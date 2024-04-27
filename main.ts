import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { validatorMiddleware } from "./middlewares/validator.ts"
import { authToken } from "./middlewares/auth.ts";
import { UUID } from "./helpers/uuid-generator.ts"
import { type JsonDB } from "./types/common.d.ts";

const app = new Hono()
const api = new Hono().basePath("/api")


// Auth middleware
api.use('/*', authToken)

// API routes
api.get('/ping', (c) => c.text("Pong!"))

// GET -> Acepte la URL cortada y redireccione a la URL real
api.get("/urls/:id", async (c) => {
  const id = c.req.param("id")

  try {
    const text = await Deno.readTextFile("./db.json");
    const jsonFile: JsonDB = JSON.parse(text)
    const { urls } = jsonFile;
    const url = urls.find((url) => url.id === Number(id))

    if(!url) {
      return c.json({ message: "Not found url" }, 404)
    }

    return c.json({ url }, 200)
  } catch (err) {
    return c.json({ message: 'Internal server error', err }, 500)
  }
})

// GET -> Busque y devuelva todas mis URL's acortadas
api.get("/urls", async (c) => {
  try {
    const text = await Deno.readTextFile("./db.json");
    const jsonFile: JsonDB = JSON.parse(text)

    return c.json(jsonFile, 200)
  } catch (err) {
    return c.json({ message: 'Internal server error', err }, 500)
  }
})

// POST -> Enviar URL real, haga la logica y devuelva URL acortada
api.post("/urls/cut", validatorMiddleware, async (c) => {
  const { origin: HOST } = new URL(c.req.url)
  const { url, customPath } = c.req.valid("json")
  let shortURL

  try {
    const text = await Deno.readTextFile("./db.json");
    const jsonFile: JsonDB = JSON.parse(text)
    const { urls } = jsonFile
    const lenght = urls.length
    const autoIncrementalID = lenght + 1

    const alreadyExistUrl = urls.find(({ original_url }) => original_url === url)
    if(alreadyExistUrl) {
      return c.json({ message: 'Resource already exist', resouce: alreadyExistUrl }, 409)
    }

    if(customPath) {
      shortURL = String(HOST + "/v1/" + customPath)
      urls.push({
        id: autoIncrementalID,
        original_url: url,
        short_url: shortURL,
        is_custom: true
      })
    } else {
      const uuid = await UUID.generate()
      const [shortUUID] = uuid.split("-")
      shortURL = String(HOST + "/v1/" + shortUUID)

      urls.push({
        id: autoIncrementalID,
        original_url: url,
        short_url: shortURL,
        is_custom: false
      })
    }

    await Deno.writeTextFile("./db.json", JSON.stringify(jsonFile));

    const response = JSON.stringify({ url: url, short_url: shortURL, is_custom: Boolean(customPath) })
    return c.body(response, 201)
  } catch (err) {
    return c.json({ message: 'Internal server error', err }, 500)
  }

})

// Handlers
api.notFound((c) => c.json({ message: 'Not Found' }, 404))
api.onError((err, c) => c.json({ message: 'Internal server error', err }, 500))

// Mount API routes
app.route("/", api)

// APP routes
app.get('/', (c) => c.text("Index"))

app.get('/ping', (c) => c.text("Pong!"))

// Handlers
app.notFound((c) => c.text('Not found', 404))

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Internal server error', 500)
})

Deno.serve({ port: 8787 }, app.fetch)
