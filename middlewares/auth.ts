import { type MiddlewareHandler } from "https://deno.land/x/hono@v4.2.8/types.ts"
import { bearerAuth, jwt } from "https://deno.land/x/hono@v4.2.8/middleware.ts"
import { getCookie, setCookie, getSignedCookie, setSignedCookie, deleteCookie, jwtSign, jwtVerify } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { ENV } from "@/helpers/envs.ts"
import { JwtTokenExpired } from 'https://deno.land/x/hono@v4.2.8/utils/jwt/types.ts';

const AUTH_PATH = "/auth"
const AUTH_QUERY_PARAM = "sign-out"
const SSID = "ssid"
const JWT_TOKEN = "token_jwt"


const makePayload = (user: string) => {
  return {
    user: user,
    role: user === ENV.USERNAME ? 'admin' : 'read',
    exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 min
  }
}

const jwtMiddleware = jwt({ secret: ENV.SECRET, cookie: JWT_TOKEN })

const customAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const isAuthPage = c.req.path === AUTH_PATH
  const ssidSigned = await getSignedCookie(c, ENV.SECRET, SSID)
  const tokenToVerify = getCookie(c, JWT_TOKEN)

  if(!tokenToVerify || !ssidSigned) {
    await next()
    return c.redirect(AUTH_PATH)
  }

  try {
    await jwtVerify(tokenToVerify, ENV.SECRET)
  } catch (err) {
    if(err instanceof JwtTokenExpired) {
      deleteCookie(c, SSID)
      deleteCookie(c, JWT_TOKEN)
      await next()
      return c.redirect(AUTH_PATH)
    }
  }

  const isCorrectSSID = ssidSigned === ENV.TOKEN
  if(!isCorrectSSID && !isAuthPage) {
    await next()
    return c.redirect(AUTH_PATH)
  }

  await next()
  return
}

const validatorAuth: MiddlewareHandler = async (c) => {
  const hasQueryParam = !!c.req.query(AUTH_QUERY_PARAM)
  if(hasQueryParam) {
    deleteCookie(c, SSID)
    deleteCookie(c, JWT_TOKEN)
    return c.redirect(AUTH_PATH)
  }

  const formData = await c.req.formData()
  const user = formData.get("user")
  const pass = formData.get("pass")
  
  if(user === ENV.USERNAME && pass === ENV.PASSWORD) {
    const payload = makePayload(user)
    const tokenJwt = await jwtSign(payload, ENV.SECRET)
    
    setCookie(c, JWT_TOKEN, tokenJwt)
    await setSignedCookie(c, SSID, ENV.TOKEN, ENV.SECRET)
    c.header("Authorization", String("Bearer " + tokenJwt))

    return c.redirect("/urls")
  }

  return c.redirect(AUTH_PATH)
}

const authToken = bearerAuth({ token: ENV.TOKEN })

export { authToken, customAuthMiddleware, validatorAuth, jwtMiddleware }
