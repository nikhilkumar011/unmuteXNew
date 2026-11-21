import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { apiMiddleware, rewritePage } from "./api.js";

const ROOT = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const target = normalize(join(ROOT, decoded));
  if (!target.startsWith(ROOT)) return null;
  try {
    const s = await stat(target);
    if (s.isDirectory()) return resolveFile(join(decoded, "index.html"));
    return target;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  if (await apiMiddleware(req, res)) return;
  const path = (req.url || "/").split("?")[0];
  const file = (await resolveFile(rewritePage(path) || path)) || (await resolveFile("/index.html"));
  if (!file) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  const body = await readFile(file);
  res.setHeader("Content-Type", TYPES[extname(file)] || "application/octet-stream");
  if (file.includes(`${join(ROOT, "assets")}`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.end(body);
}).listen(PORT, () => console.log(`Unmutex running on http://localhost:${PORT}`));
