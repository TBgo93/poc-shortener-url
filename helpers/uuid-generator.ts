import { v5, NAMESPACE_DNS } from "https://deno.land/std@0.209.0/uuid/mod.ts";


const generateUUID = async () => {
  const encodedUUID = new TextEncoder().encode(crypto.randomUUID())
  return await v5.generate(NAMESPACE_DNS, encodedUUID)
}

const generateShortUUID = async () => {
  const uuid = await generateUUID()

  const randomNumber = Math.ceil((Math.random() * 10)); // 1 - 10
  const shortUUID = uuid.split("-").join("").slice(randomNumber, randomNumber + 8)
  return shortUUID
}

const UUID = {
  generate: generateUUID,
  generateShort: generateShortUUID
}

export { UUID }