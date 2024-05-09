import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";

const env = await load();

const ENV_TOKEN = env["TOKEN"] ?? Deno.env.get("TOKEN")
const ENV_USERNAME = env["USERNAME"] ?? Deno.env.get("USERNAME")
const ENV_PASSWORD = env["PASSWORD"] ?? Deno.env.get("PASSWORD")
const ENV_SECRET = env["SECRET"] ?? Deno.env.get("SECRET")
const ENV_PERMISSION_WRITE = env["PERMISSION_WRITE"] ?? Deno.env.get("PERMISSION_WRITE")
const ENV_PERMISSION_READ = env["PERMISSION_READ"] ?? Deno.env.get("PERMISSION_READ")
const ENV_IS_PROD = env["IS_PROD"] ?? Deno.env.get("IS_PROD")
const ENV_HOST = env["HOST"] ?? Deno.env.get("HOST")
const ENV_PORT = env["PORT"] ?? Deno.env.get("PORT")


const ENV = { 
  TOKEN: ENV_TOKEN,
  USERNAME: ENV_USERNAME,
  PASSWORD: ENV_PASSWORD,
  SECRET: ENV_SECRET,
  PERMISSION_WRITE: ENV_PERMISSION_WRITE,
  PERMISSION_READ: ENV_PERMISSION_READ,
  PORT: Number(ENV_PORT),
  IS_PROD: ENV_IS_PROD === "true" ? true : false,
  HOST: ENV_IS_PROD === "true" ? ENV_HOST : String("http://localhost:" + ENV_PORT)
}

export { ENV }