import { basicAuth, bearerAuth } from "https://deno.land/x/hono@v4.2.8/middleware.ts"
import { ENV } from "@/helpers/envs.ts"

const authMiddleware = basicAuth({
  username: ENV.USERNAME,
  password: ENV.PASSWORD
})

const authToken = bearerAuth({ token: ENV.TOKEN })

export { authMiddleware, authToken }
