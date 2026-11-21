import { getReviews, validateReview, createReview } from "./reviews.js";
import { findCertificate, normaliseName } from "./certificates.js";

const MAX_BODY = 512 * 1024;
const TRUST_PROXY = process.env.TRUST_PROXY === "1";

const buckets = new Map();
function rateLimited(req, key, limit, windowMs) {
  const fwd = TRUST_PROXY ? String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() : "";
  const ip = fwd || req.socket?.remoteAddress || "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(id, hits);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  return hits.length > limit;
}

function send(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("Body too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

async function reviewsList(req, res) {
  const reviews = await getReviews();
  send(res, 200, { reviews }, { "Cache-Control": "no-cache" });
}

async function reviewCreate(req, res) {
  if (rateLimited(req, "review", 5, 10 * 60 * 1000)) {
    return send(res, 429, { message: "Too many reviews from this device. Please try again later." });
  }
  const body = await readJson(req);
  const { errors, value } = validateReview(body);
  if (Object.keys(errors).length) return send(res, 400, { message: Object.values(errors)[0], errors });
  const review = await createReview(value);
  send(res, 201, { message: "Feedback sent successfully!", review });
}

async function certificateLookup(req, res, name) {
  if (rateLimited(req, "cert", 30, 60 * 1000)) {
    return send(res, 429, { message: "Too many lookups. Please wait a minute and try again." });
  }
  if (!normaliseName(name)) return send(res, 400, { message: "Please enter your name." });
  const cert = await findCertificate(name);
  if (!cert) return send(res, 404, { message: "No Certificate found" });
  send(res, 200, cert, { "Cache-Control": "no-store" });
}

const ROUTES = {
  "GET /api/reviews": reviewsList,
  "POST /api/feedback": reviewCreate,
  "POST /api/certificate": async (req, res) => certificateLookup(req, res, (await readJson(req)).name),
  "GET /api/certificate": (req, res, url) => certificateLookup(req, res, url.searchParams.get("name")),
};

export async function apiMiddleware(req, res, next) {
  const url = new URL(req.url || "/", "http://local");
  if (!url.pathname.startsWith("/api/")) return next ? next() : false;
  const handler = ROUTES[`${req.method} ${url.pathname.toLowerCase().replace(/\/$/, "")}`];
  if (!handler) {
    send(res, 404, { message: "Not found" });
    return true;
  }
  try {
    await handler(req, res, url);
  } catch (err) {
    console.error(`[api] ${req.method} ${url.pathname}:`, err.message);
    if (!res.headersSent) send(res, err.status || 500, { message: err.status ? err.message : "Something went wrong. Please try again." });
  }
  return true;
}

const PAGES = ["team", "book", "certificate", "feedback"];

export function rewritePage(pathname) {
  if (/^\/verify\/[^/]+\/?$/.test(pathname)) return "/verify/index.html";
  const bare = pathname.replace(/^\/|\/$/g, "");
  if (bare === "verify") return "/certificate/index.html";
  if (PAGES.includes(bare)) return `/${bare}/index.html`;
  return null;
}
