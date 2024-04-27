import { basicAuth, bearerAuth } from "https://deno.land/x/hono@v4.2.8/middleware.ts"

const USERNAME = "Jerry93"
const PASSWORD = "1234"

const authMiddleware = basicAuth({
  username: USERNAME,
  password: PASSWORD
})

const authToken = bearerAuth({ token: "8f8e28bc-b116-5880-977c-6f21df0c706e" })

export { authMiddleware, authToken }
