import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { validatorMiddleware, validatorPermission } from "@/middlewares/validator.ts"
import { UUID } from "@/helpers/uuid-generator.ts"
import { Message } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"
import { SavedURL } from '@/types/common.d.ts';
import { Deno_KV, Key } from "@/db/index.ts"

const api = new Hono()

// Middlewares
api.use("/*", validatorPermission)

// GET -> Busque y devuelva todas mis URL's acortadas
api.get("/urls", async (c) => {
  try {
    const urls: SavedURL[] = []
    const list = Deno_KV.list<SavedURL>({ prefix: [Key.URLS] })

    for await (const res of list) urls.push(res.value)

    return c.json({ urls }, StatusCodes.OK)
  } catch (err) {
    console.log(err)
    return c.json({ message: Message.INTERNAL_SERVER_ERROR, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// POST -> Enviar URL real, haga la logica y devuelva URL acortada
api.post("/urls/cut", validatorMiddleware, async (c) => {
  const { origin: HOST } = new URL(c.req.url)
  const { url, customPath } = c.req.valid("json")
  let shortURL
  let isCustom

  try {
    const urls: SavedURL[] = []
    const list = Deno_KV.list<SavedURL>({ prefix: [Key.URLS] })

    for await (const res of list) urls.push(res.value)

    const lenght = urls.length
    const autoIncrementalID = lenght + 1

    const alreadyExistUrl = urls.find(({ original_url }) => original_url === url)
    if(alreadyExistUrl) {
      return c.json({ message: Message.ALREADY_EXIST, resource: alreadyExistUrl }, StatusCodes.CONFLICT)
    }

    const uuid = await UUID.generateShort()

    if(customPath) {
      shortURL = String(HOST + "/v1" + customPath)
      isCustom = true
    } else {
      shortURL = String(HOST + "/v1/" + uuid)
      isCustom = false
    }

    const newUrl = {
      id: autoIncrementalID,
      original_url: url,
      short_url: shortURL,
      is_custom: isCustom,
      hash: uuid
    }

    const res = await Deno_KV.atomic()
      .set([Key.URLS, uuid], newUrl)
      .commit();

    if(!res.ok) {
      return c.json({ message: Message.CANNOT_SAVED, resource: url }, StatusCodes.CONFLICT)
    }

    return c.json({ url: url, short_url: shortURL }, StatusCodes.CREATED)
  } catch (err) {
    return c.json({ message: Message.INTERNAL_SERVER_ERROR, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// DELETE -> Eliminar, por id, los recursos guardados
api.delete("/urls/:id", async (c) => {
  const hashId = c.req.param("id")

  try {
    const url = await Deno_KV.get([Key.URLS, hashId])
    if(!url.value) {
      return c.json({ message: Message.NOT_FOUND }, StatusCodes.NOT_FOUND)
    }

    await Deno_KV.delete([Key.URLS, hashId]);

    return c.json({ message: Message.DELETED }, StatusCodes.OK)
  } catch (err) {
    return c.json({ message: Message.INTERNAL_SERVER_ERROR, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// Handlers
api.notFound((c) => c.json({ message: Message.NOT_FOUND }, StatusCodes.NOT_FOUND))
api.onError((err, c) => {
  console.log({ err })
  return c.json({ message: Message.INTERNAL_SERVER_ERROR, err }, StatusCodes.INTERNAL_SERVER_ERROR)
})

export { api }
