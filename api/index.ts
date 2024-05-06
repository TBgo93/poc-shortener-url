import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { validatorMiddleware, validatorPermission } from "@/middlewares/validator.ts"
import { UUID } from "@/helpers/uuid-generator.ts"
import { MESSAGE } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"
import { SavedURL } from '@/types/common.d.ts';
// DenoKV - BBDD
const db = await Deno.openKv();
const URLS = "urls"

const api = new Hono()

// Middlewares
api.use("/*", validatorPermission)

// GET -> Busque y devuelva todas mis URL's acortadas
api.get("/urls", async (c) => {
  try {
    const urls: SavedURL[] = []
    const list = db.list<SavedURL>({ prefix: [URLS] })

    for await (const res of list) urls.push(res.value)

    return c.json({ urls }, StatusCodes.OK)
  } catch (err) {
    console.log(err)
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
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
    const list = db.list<SavedURL>({ prefix: [URLS] })

    for await (const res of list) urls.push(res.value)

    const lenght = urls.length
    const autoIncrementalID = lenght + 1

    const alreadyExistUrl = urls.find(({ original_url }) => original_url === url)
    if(alreadyExistUrl) {
      return c.json({ message: MESSAGE.AlreadyExist, resouce: alreadyExistUrl }, StatusCodes.CONFLICT)
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

    const res = await db.atomic()
      .set([URLS, uuid], newUrl)
      .commit();

    if(!res.ok) {
      return c.json({ message: "Cannot save new URL" }, StatusCodes.CONFLICT)
    }

    const response = JSON.stringify({ url: url, short_url: shortURL })
    return c.body(response, StatusCodes.CREATED)
  } catch (err) {
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// DELETE -> Eliminar, por id, los recursos guardados
api.delete("/urls/:id", async (c) => {
  const hashId = c.req.param("id")

  try {
    const url = await db.get([URLS, hashId])
    if(!url.value) {
      return c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND)
    }

    await db.delete([URLS, hashId]);

    return c.json({ message: MESSAGE.Deleted }, StatusCodes.OK)
  } catch (err) {
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// Handlers
api.notFound((c) => c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND))
api.onError((err, c) => c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR))

export { api }
