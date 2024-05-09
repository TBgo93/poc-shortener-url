import { validator } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { type MiddlewareHandler } from "https://deno.land/x/hono@v4.2.8/types.ts"
import { JwtTokenExpired } from 'https://deno.land/x/hono@v4.2.8/utils/jwt/types.ts';
import { jwtDecode, jwtVerify } from "https://deno.land/x/hono@v4.2.8/helper.ts"

import { StatusCodes } from '@/constants/http-status-codes.ts';
import { Message } from "@/constants/message.ts";
import { ENV } from '@/helpers/envs.ts';

const validatorMiddleware = validator('json', (value, c) => {
  const url = value['url']
  const customPath = value['custom_path']
  if (!url || typeof url !== 'string') {
    return c.text(Message.BAD_REQUEST, StatusCodes.BAD_REQUEST)
  }
  if (customPath && typeof customPath !== 'string') {
    return c.text(Message.BAD_REQUEST, StatusCodes.BAD_REQUEST)
  }
  if (customPath === "") {
    return c.text(Message.BAD_REQUEST, StatusCodes.BAD_REQUEST)
  }
  return {
    url: url,
    customPath: customPath
  }
})

const validatorPermission: MiddlewareHandler = async (c, next) => {
  const jwtToken = c.req.header("Authorization")
  if(!jwtToken) {
    return c.text(Message.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
  }

  try {
    await jwtVerify(jwtToken, ENV.SECRET)
  } catch (err) {
    if(err instanceof JwtTokenExpired) {
      return c.text(Message.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
    }
  }

  const { payload } = jwtDecode(jwtToken)
  const { role } = payload

  if(role !== ENV.PERMISSION_WRITE) {
    return c.text(Message.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
  }

  await next()
  return
}

export { validatorMiddleware, validatorPermission }
