// Vercel serverless entry point. Every /api/* request is handled by the same
// router the Node server and the dev server use (server/api.js).
import { apiMiddleware } from "../server/api.js";

export default async function handler(req, res) {
  await apiMiddleware(req, res);
}
