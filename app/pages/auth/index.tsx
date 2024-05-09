/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { getSignedCookie, getCookie } from "https://deno.land/x/hono@v4.2.8/helper.ts"
import { ENV } from "@/helpers/envs.ts";
import { SSID, JWT_TOKEN } from '@/constants/config-request.ts';

const AuthPage: FC<PropsWithChildren> = async () => {
  const c = useRequestContext()
  const ssidCookie = await getSignedCookie(c, ENV.SECRET, SSID)
  const jwtCookie = getCookie(c, JWT_TOKEN)

  if(ssidCookie && jwtCookie) {
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
