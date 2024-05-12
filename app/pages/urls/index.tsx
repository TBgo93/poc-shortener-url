/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'

const UrlsPage: FC<PropsWithChildren> = () => {
  const c = useRequestContext()
  const { status, message } = c.req.query()

  return (
    <div id="container">
      <aside style="width:auto; background:none; border:none; padding:0;">
        {status && message && (
          <p class="notice" style="width: fit-content;">
            <span>StatusCode: </span><mark style={Number(status) > 499 && "background-color: #f33 !important;"}>{status}</mark>
            <br />
            <i>Mensaje: {message}</i>
          </p>
        )}
      </aside>
      <ul id="list-urls">
      </ul>
      <script type="module" async src="./static/client-side-urls.js" />
    </div>
  )
}


export default UrlsPage
