import emailjs from "@emailjs/browser";
import { EMAILJS } from "../data.js";

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.status = status;
    this.errors = errors || {};
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    });
  } catch {
    throw new ApiError("You seem to be offline. Please check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || "Something went wrong. Please try again.", { status: res.status, errors: data.errors });
  return data;
}

export const REVIEW_ADDED = "unmutex:review-added";

export async function postReview({ name, profession, rating, story, avatar }) {
  const data = await request("/api/Feedback", {
    method: "POST",
    body: JSON.stringify({ name, role: profession, rating, feedback: story, avatar }),
  });
  if (data.review) window.dispatchEvent(new CustomEvent(REVIEW_ADDED, { detail: data.review }));
  return data;
}

export function fetchCertificate(name) {
  return request("/api/certificate", { method: "POST", body: JSON.stringify({ name }) });
}

export async function sendBooking({ name, email, phone, message }) {
  try {
    await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { name, email, phone, message }, { publicKey: EMAILJS.publicKey });
  } catch (err) {
    throw new ApiError(err?.status === 429 ? "Too many requests. Please try again in a minute." : "We couldn't send your request. Please try again.");
  }
}

export function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file doesn't look like an image."));
    };
    img.src = url;
  });
}
