import { getDb } from "./db.js";

const COLLECTION = process.env.MONGODB_CERTIFICATES_COLLECTION || "certificates";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normaliseName = (s) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim() : "");

function toCertificate(doc) {
  const download = doc.certificate || "";
  return {
    name: doc.name,
    certificate: download,
    preview: download.replace("/upload/fl_attachment/", "/upload/"),
    qrCode: /^data:image\/png;base64,/.test(doc.qrCode || "") ? doc.qrCode : "",
    issuedAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : null,
    verifyPath: `/verify/${encodeURIComponent(doc.name)}`,
  };
}

export async function findCertificate(rawName) {
  const name = normaliseName(rawName);
  if (!name) return null;
  const col = (await getDb()).collection(COLLECTION);
  const projection = { name: 1, certificate: 1, qrCode: 1, createdAt: 1 };
  const exact = await col.find({ name }, { projection }).sort({ _id: 1 }).limit(1).next();
  if (exact) return toCertificate(exact);
  const pattern = new RegExp(`^\\s*${name.split(" ").map(escapeRegex).join("\\s+")}\\s*$`, "i");
  const loose = await col.find({ name: pattern }, { projection }).sort({ _id: 1 }).limit(1).next();
  return loose ? toCertificate(loose) : null;
}
