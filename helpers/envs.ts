import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";

const env = await load();

const ENV_TOKEN = env["TOKEN"] ?? Deno.env.get("TOKEN")
const ENV_USERNAME = env["USERNAME"] ?? Deno.env.get("USERNAME")
const ENV_PASSWORD = env["PASSWORD"] ?? Deno.env.get("PASSWORD")

const ENV = { 
  TOKEN: ENV_TOKEN,
  USERNAME: ENV_USERNAME,
  PASSWORD: ENV_PASSWORD
}

export { ENV }