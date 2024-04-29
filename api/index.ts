import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { validatorMiddleware } from "@/middlewares/validator.ts"
import { authToken } from "@/middlewares/auth.ts"
import { UUID } from "@/helpers/uuid-generator.ts"
import { FILE } from "@/helpers/reader-file.ts"
import { MESSAGE } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"

const api = new Hono().basePath("/api")


// Auth middleware
api.use('/*', authToken)

// API routes
api.get('/ping', (c) => c.text("Pong API!"))

// GET -> Busque y devuelva todas mis URL's acortadas
api.get("/urls", async (c) => {
  try {
    const urls = await FILE.reader()

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
    const urls = await FILE.reader()

    const lenght = urls.length
    const autoIncrementalID = lenght + 1

    const alreadyExistUrl = urls.find(({ original_url }) => original_url === url)
    if(alreadyExistUrl) {
      return c.json({ message: MESSAGE.AlreadyExist, resouce: alreadyExistUrl }, StatusCodes.CONFLICT)
    }

    const uuid = await UUID.generateShort()

    if(customPath) {
      shortURL = String(HOST + "/v1/" + customPath)
      isCustom = true
    } else {
      shortURL = String(HOST + "/v1/" + uuid)
      isCustom = false
    }

    urls.push({
      id: autoIncrementalID,
      original_url: url,
      short_url: shortURL,
      is_custom: isCustom,
      hash: uuid
    })

    await FILE.writter(urls)

    const response = JSON.stringify({ url: url, short_url: shortURL })
    return c.body(response, StatusCodes.CREATED)
  } catch (err) {
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// DELETE -> Eliminar, por id, los recursos guardados
api.delete("/urls/:id", async (c) => {
  const id = c.req.param("id")

  try {
    const urls = await FILE.reader()
    const url = urls.find((url) => url.hash === id)

    if(!url) {
      return c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND)
    }

    const newUrls = urls.filter((url) => url.hash !== id)
    await FILE.writter(newUrls)

    return c.json({ message: MESSAGE.Deleted }, StatusCodes.OK)
  } catch (err) {
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// Handlers
api.notFound((c) => c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND))
api.onError((err, c) => c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR))

export { api }
