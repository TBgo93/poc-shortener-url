import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { csrf, secureHeaders } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { api } from "@/api/index.ts"
import { v1 } from "@/api/v1/index.ts"
import { MESSAGE } from "@/constants/message.ts"
import { StatusCodes } from "@/constants/http-status-codes.ts"
import { bodyLimiter } from "@/middlewares/limiters.ts"

const app = new Hono()

// Body limit middleware
app.use(bodyLimiter)
// Secure Headers middleware
app.use(secureHeaders())
// CSRF middleware
app.use(csrf())

// Mount API routes
app.route("/", api)
app.route("/v1", v1)

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
