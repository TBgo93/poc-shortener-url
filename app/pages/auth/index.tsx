/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { getSignedCookie } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { ENV } from "@/helpers/envs.ts";

const AuthPage: FC<PropsWithChildren> = async () => {
  const c = useRequestContext()
  const ssidSigned = await getSignedCookie(c, ENV.SECRET, "ssid")

  if(ssidSigned) {
    return (
      <> 
        <p>You are logged!</p>
        <form method="POST" action="/auth?sign-out=true">
          <button>Sign Out</button>
        </form>
      </>
    )
  }

  return (
    <>
      <form method="POST" action="/auth">
        <label htmlFor="user">
          <span style="display:block;">Username</span>
          <input type="text" name="user" required minlength={4} maxlength={12}/>
        </label>
        <label htmlFor="pass">
          <span style="display:block;">Password</span>
          <input type="password" name="pass" required minlength={4} maxlength={12}/>
        </label>
        <br />
        <button>Sign In</button>
      </form>
    </>
  )
}


export default AuthPage
