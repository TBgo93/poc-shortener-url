/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { getCookie } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { JWT_TOKEN } from "@/constants/config-request.ts";
import { getAllUrls } from "@/services/urls.ts";

const UrlsPage: FC<PropsWithChildren> = async () => {
  const c = useRequestContext()
  const { origin: HOST } = new URL(c.req.url)
  const { status, message } = c.req.query()
  const jwtCookie = getCookie(c, JWT_TOKEN)
  // Buscar otra forma que no sea porq query param o sanitizarlor

  if(!jwtCookie) {
    return (
      <>
        <p>Unauthorized - Not found Auth header</p>
      </>
    )
  }

  const [error, urls] = await getAllUrls(HOST, jwtCookie)
  
  if(error) {
    return (
      <>
        <p>{error}</p>
      </>
    )
  }

  if(urls?.length === 0) {
    return (
      <>
        <div>
          <p>You dont have url's.</p>
          <p>Please go to the "cut your url" section</p>
        </div>
      </>
    )
  }

  return (
    <>
      <aside style="width:auto; background:none; border:none; padding:0;">
        {status && message && (
          <p class="notice" style="width: fit-content;">
            <span>StatusCode: </span><mark style={Number(status) > 499 && "background-color: #f33 !important;"}>{status}</mark>
            <br />
            <i>Mensaje: {message}</i>
          </p>
        )}
      </aside>
      <ul style="list-style-type: disclosure-closed;">
        {
          urls?.map((url) => {
            return (
              <li style="display: flex; gap: 16px; align-items: center;">
                <div style="display: flex; flex-direction: column;">
                  <a href={url.short_url}>{url.short_url}</a>
                  <small> ({url.original_url})</small>
                </div>
                <form method="POST" action="/urls">
                  <input type="hidden" name="hash_id" value={url.hash}/>
                  <button style="margin: 0; padding: .25rem .75rem">x</button>
                </form>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}


export default UrlsPage
