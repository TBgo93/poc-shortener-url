/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { SavedURL } from '@/types/common.d.ts';

const UrlsPage: FC<PropsWithChildren> = async () => {
  let ResApi: { urls: SavedURL[] } = { urls: [] }
  let ErrorReponse = ""
  try {
    const res = await fetch("http://localhost:8787/api/urls")
    if(!res.ok) {
      throw new Error("Something wrong!")
    }
    const json = await res.json()
    ResApi = json
  } catch (err) {
    ResApi = { urls: [] }
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

  if(ResApi.urls.length === 0) {
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
          ResApi.urls.map((url) => {
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
