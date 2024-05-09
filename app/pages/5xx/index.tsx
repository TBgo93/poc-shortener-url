/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'

const ErrorPage: FC<PropsWithChildren> = () => {
  return (
    <>
      <h2>Oops!</h2>
      <p>Something went wrong!</p>
    </>
  )
}


export default ErrorPage