import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

function api(env) {
  const attach = (server) => {
    for (const key of ["MONGODB_URI", "MONGODB_DB", "TRUST_PROXY"]) if (env[key]) process.env[key] = env[key];
    server.middlewares.use(async (req, res, next) => {
      const { apiMiddleware, rewritePage } = await import("./server/api.js");
      const [path, query] = (req.url || "/").split("?");
      const page = rewritePage(path);
      if (page) req.url = page + (query ? `?${query}` : "");
      apiMiddleware(req, res, next);
    });
  };
  return { name: "unmutex-api", configureServer: attach, configurePreviewServer: attach };
}

const page = (p) => resolve(import.meta.dirname, p);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), api(env)],
    build: {
      rollupOptions: {
        input: {
          main: page("index.html"),
          team: page("team/index.html"),
          book: page("book/index.html"),
          certificate: page("certificate/index.html"),
          verify: page("verify/index.html"),
          feedback: page("feedback/index.html"),
        },
      },
    },
  };
});
