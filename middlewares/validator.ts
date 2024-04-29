import { validator } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { StatusCodes } from '@/constants/http-status-codes.ts';
import { MESSAGE } from "@/constants/message.ts";

const validatorMiddleware = validator('json', (value, c) => {
  const url = value['url']
  const customPath = value['custom_path']
  if (!url || typeof url !== 'string') {
    return c.text(MESSAGE.BadRequest, StatusCodes.BAD_REQUEST)
  }
  if (customPath && typeof customPath !== 'string') {
    return c.text(MESSAGE.BadRequest, StatusCodes.BAD_REQUEST)
  }
  if (customPath === "") {
    return c.text(MESSAGE.BadRequest, StatusCodes.BAD_REQUEST)
  }
  return {
    url: url,
    customPath: customPath
  }
})

export { validatorMiddleware }
