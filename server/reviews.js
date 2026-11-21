import { getDb } from "./db.js";

const COLLECTION = process.env.MONGODB_REVIEWS_COLLECTION || "feedbacks";
const CACHE_MS = 5 * 60 * 1000;
const MAX_AVATAR_CHARS = 400 * 1024;

export const LIMITS = { name: 80, role: 80, feedback: 2000, minFeedback: 10 };

let cache = { at: 0, data: null };

const clean = (s) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim() : "");

const fixWord = (w) => {
  if (/^[A-Z]{2}[a-z]+$/.test(w)) return w[0] + w.slice(1).toLowerCase();
  return w;
};

const capitalise = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);

const titleCase = (s) =>
  clean(s)
    .split(" ")
    .map((w) => capitalise(/^[a-z]+$/.test(w) ? w : fixWord(w)))
    .join(" ");

const sentenceCase = (s) => capitalise(clean(s).split(" ").map(fixWord).join(" "));

function safeAvatar(a) {
  if (typeof a !== "string" || !a) return null;
  if (/^https:\/\//.test(a)) return a;
  if (/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(a) && a.length <= MAX_AVATAR_CHARS) return a;
  return null;
}

function toReview(doc) {
  const rating = Math.max(1, Math.min(5, Math.round(Number(doc.rating) || 5)));
  return {
    id: String(doc._id),
    name: titleCase(doc.name),
    role: sentenceCase(doc.role),
    rating,
    text: clean(doc.feedback).replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim(),
    avatar: safeAvatar(doc.avatar),
    date: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : null,
  };
}

export async function getReviews() {
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({}, { projection: { name: 1, feedback: 1, rating: 1, role: 1, avatar: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  const data = docs.map(toReview).filter((r) => r.name && r.text);
  cache = { at: Date.now(), data };
  return data;
}

export function validateReview(body) {
  const errors = {};
  const name = clean(body?.name);
  const role = clean(body?.role);
  const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";
  const rating = Number(body?.rating);
  const avatarIn = typeof body?.avatar === "string" ? body.avatar : "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;
  if (role.length > LIMITS.role) errors.role = `Profession must be under ${LIMITS.role} characters.`;
  if (feedback.length < LIMITS.minFeedback) errors.feedback = `Please write at least ${LIMITS.minFeedback} characters.`;
  else if (feedback.length > LIMITS.feedback) errors.feedback = `Please keep it under ${LIMITS.feedback} characters.`;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Rating must be between 1 and 5.";
  const avatar = avatarIn ? safeAvatar(avatarIn) : "";
  if (avatarIn && !avatar) errors.avatar = "Photo must be a JPEG, PNG or WebP image under 300 KB.";

  return {
    errors,
    value: { name, feedback, rating, role: role || "Member", avatar: avatar || "" },
  };
}

export async function createReview(value) {
  const db = await getDb();
  const now = new Date();
  const doc = { ...value, createdAt: now, updatedAt: now, __v: 0 };
  const { insertedId } = await db.collection(COLLECTION).insertOne(doc);
  cache = { at: 0, data: null };
  return toReview({ ...doc, _id: insertedId });
}
