// DenoKV - BBDD
const Deno_KV = await Deno.openKv();

const Key = {
  URLS: "urls"
}

export { Deno_KV, Key }