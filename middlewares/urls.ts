import { type MiddlewareHandler } from "https://deno.land/x/hono@v4.2.8/types.ts"
import { getCookie, createMiddleware } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { JWT_TOKEN } from "@/constants/config-request.ts";
import { deleteUrlByHashid } from "@/services/urls.ts";

type Payload = {
  url: FormDataEntryValue
  custom_path?: FormDataEntryValue
}

const validatorDeleteUrl = createMiddleware(async (c, next) => {
  if(c.req.method !== "POST") {
    await next()
    return
  }

  const jwtCookie = getCookie(c, JWT_TOKEN)
  if(!jwtCookie) {
    return c.redirect("/auth")
  }

  const formData = await c.req.formData()
  const hashId = formData.get("hash_id")

  if(!hashId) {
    throw new Error("Bad request, hash_id is required")
  }

  const [error, response] = await deleteUrlByHashid(jwtCookie, hashId.toString())

  if(error) {
    return c.redirect(`/urls?error=${error}`)
  }

  const message = response.message.split(" ").join("-").toLowerCase()

  return c.redirect(`/urls?status=${200}&message=${message}`)
})

const validatorUrls: MiddlewareHandler = async (c) => {
  const jwtCookie = getCookie(c, JWT_TOKEN)
  if(!jwtCookie) {
    return c.redirect("/auth")
  }

  const formData = await c.req.formData()
  const originalUrl = formData.get("original_url")
  const customPath = formData.get("custom_path")

  if(!originalUrl) {
    throw new Error("Bad request, original_url is required")
  }

  const payload: Payload = {
    url: originalUrl
  }

  if(customPath) {
    payload.custom_path = customPath
  }

  try {
    const res = await fetch("http://localhost:8787/api/urls/cut", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwtCookie
      },
      body: JSON.stringify(payload)
    })

    if(!res.ok) {
      const json = await res.json()
      const message = json.message.split(" ").join("-").toLowerCase()
      return c.redirect(`/urls/cut?status=${res.status}&message=${message}`)
    }

    return c.redirect("/urls")
  } catch (err) {
    console.log("validatorUrls", { err })
    throw new Error(String("validatorUrls" + err))
  }
}

export { validatorUrls, validatorDeleteUrl }
