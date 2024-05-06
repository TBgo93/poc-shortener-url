import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { MESSAGE } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"
import { SavedURL } from "@/types/common.d.ts";
// DenoKV - BBDD
const db = await Deno.openKv();
const URLS = "urls"

const v1 = new Hono()

// GET -> Acepte la URL cortada y redireccione a la URL real
v1.get("/:id", async (c) => {
  const id = c.req.param("id")

  try {
    const urls: SavedURL[] = []
    const list = db.list<SavedURL>({ prefix: [URLS] })

    for await (const res of list) urls.push(res.value)
    const url = urls.find((url) => url.hash === id)

    if(!url) {
      return c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND)
    }

    return c.redirect(url.original_url)
  } catch (err) {
    return c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

// Handlers
v1.notFound((c) => c.json({ message: MESSAGE.NotFound }, StatusCodes.NOT_FOUND))
v1.onError((err, c) => c.json({ message: MESSAGE.InternalServerError, err }, StatusCodes.INTERNAL_SERVER_ERROR))

export { v1 }
