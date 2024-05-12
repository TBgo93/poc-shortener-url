/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'

const UrlsPage: FC<PropsWithChildren> = () => {
  const c = useRequestContext()
  const { status, message } = c.req.query()

  return (
    <div id="container">
      <aside style="width:auto; background:none; border:none; padding:0;">
        {status && message && (
          <p class="notice" style="width: fit-content;margin-top: 0;">
            <span>StatusCode: </span><mark style={Number(status) > 499 && "background-color: #f33 !important;"}>{status}</mark>
            <br />
            <i>Mensaje: {message}</i>
          </p>
        )}
      </aside>
      <form id="delete-url" method="post">
        <ul id="list-urls" style="list-style-type: none;padding: 0;">
        </ul>
        <br />
        <button>Borrar URL</button>
      </form>
    </div>
  )
}


export default UrlsPage
