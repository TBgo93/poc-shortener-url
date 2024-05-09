import { bodyLimit } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { StatusCodes } from "@/constants/http-status-codes.ts"
import { Message } from "@/constants/message.ts"

const bodyLimiter = bodyLimit({
  maxSize: 1 * 1024, // 1kb
  onError: (c) => {
    return c.text(Message.BAD_REQUEST, StatusCodes.BAD_REQUEST)
  },
})

export { bodyLimiter }
