import { app } from "./app/server/index.tsx";
import { ENV } from "@/helpers/envs.ts";

const optServe = ENV.IS_PROD ? {} : { port: ENV.PORT }

Deno.serve(optServe, app.fetch)
