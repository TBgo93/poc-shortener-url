import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { api } from "@/api/index.ts"
import { MESSAGE } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"

const app = new Hono()

// Mount API routes
app.route("/", api)

// APP routes
app.get('/', (c) => c.text("Index"))

app.get('/ping', (c) => c.text("Pong!"))

// Handlers
app.notFound((c) => c.text(MESSAGE.NotFound, StatusCodes.NOT_FOUND))

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(MESSAGE.InternalServerError, StatusCodes.INTERNAL_SERVER_ERROR)
})

export { app }
