import { app } from "@/app/server/index.tsx";
import { ENV } from "@/helpers/envs.ts";

const serveOptions = ENV.IS_PROD ? {} : { port: ENV.PORT }

Deno.serve(serveOptions, app.fetch)
