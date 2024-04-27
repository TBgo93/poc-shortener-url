import { v5, NAMESPACE_DNS } from "https://deno.land/std@0.209.0/uuid/mod.ts";


const generateUUID = async () => {
  const encodedUUID = new TextEncoder().encode(crypto.randomUUID())
  return await v5.generate(NAMESPACE_DNS, encodedUUID)
}

const UUID = {
  generate: generateUUID
}

export { UUID }