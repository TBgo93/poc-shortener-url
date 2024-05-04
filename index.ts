import { app } from "./app/server/index.tsx";

Deno.serve({ port: 8787 }, app.fetch)
