import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";

const env = await load();

const ENV_TOKEN = env["TOKEN"] ?? Deno.env.get("TOKEN")
const ENV_USERNAME = env["USERNAME"] ?? Deno.env.get("USERNAME")
const ENV_PASSWORD = env["PASSWORD"] ?? Deno.env.get("PASSWORD")
const ENV_SECRET = env["SECRET"] ?? Deno.env.get("SECRET")
const ENV_PERMISSION_WRITE = env["PERMISSION_WRITE"] ?? Deno.env.get("PERMISSION_WRITE")
const ENV_PERMISSION_READ = env["PERMISSION_READ"] ?? Deno.env.get("PERMISSION_READ")


const ENV = { 
  TOKEN: ENV_TOKEN,
  USERNAME: ENV_USERNAME,
  PASSWORD: ENV_PASSWORD,
  SECRET: ENV_SECRET,
  PERMISSION_WRITE: ENV_PERMISSION_WRITE,
  PERMISSION_READ: ENV_PERMISSION_READ
}

export { ENV }