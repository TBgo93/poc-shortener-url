import { app } from "@/app/server/index.ts";

Deno.serve({ port: 8787 }, app.fetch)
