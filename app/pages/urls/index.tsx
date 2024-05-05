/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { getCookie } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { JWT_TOKEN } from "@/constants/config-request.ts";
import { SavedURL } from '@/types/common.d.ts';

const UrlsPage: FC<PropsWithChildren> = async () => {
  const c = useRequestContext()
  const jwtCookie = getCookie(c, JWT_TOKEN)

  let responseApi: { urls: SavedURL[] } = { urls: [] }
  let ErrorReponse = ""

  try {
    const res = await fetch("http://localhost:8787/api/urls", {
      headers: {
        "Authorization": jwtCookie ?? ""
      }
    })

    if(!res.ok) {
      throw new Error(String("Status: " + res.status + "- message: " + res.statusText))
    }

    const json = await res.json()
    responseApi = json
  } catch (err) {
    responseApi = { urls: [] }
    ErrorReponse = err.message
    console.log(err)
  }

  if(ErrorReponse !== "") {
    return (
      <>
        <p>{ErrorReponse}</p>
      </>
    )
  }

  if(responseApi.urls.length === 0) {
    return (
      <>
        <p>You dont have url's.</p>
        <p>Please go to the "cut your url" section</p>
      </>
    )
  }

  return (
    <>
      <ul style="list-style-type: disclosure-closed;">
        {
          responseApi.urls.map((url) => {
            return (
              <li>
                <a href={url.short_url}>{url.short_url}</a>
                <small> ({url.original_url})</small>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}


export default UrlsPage
