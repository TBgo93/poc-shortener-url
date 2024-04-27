import { validator } from 'https://deno.land/x/hono@v4.2.8/mod.ts'

const validatorMiddleware = validator('json', (value, c) => {
  const url = value['url']
  const customPath = value['custom_path']
  if (!url || typeof url !== 'string') {
    return c.text('Bad request', 400)
  }
  if (customPath && typeof customPath !== 'string') {
    return c.text('Bad request', 400)
  }
  if (customPath === "") {
    return c.text('Bad request', 400)
  }
  return {
    url: url,
    customPath: customPath
  }
})

export { validatorMiddleware }
