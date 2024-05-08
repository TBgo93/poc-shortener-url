/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from 'https://deno.land/x/hono@v4.2.8/mod.ts'
import { jsx, secureHeaders, cors } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { customAuthMiddleware, validatorAuth, jwtMiddleware } from "@/middlewares/auth.ts";
import { bodyLimiter } from "@/middlewares/limiters.ts"
import { validatorUrls, validatorDeleteUrl } from "@/middlewares/urls.ts"
import { api } from "@/api/index.ts"
import { v1 } from "@/api/v1/index.ts"

import Layout from '@/app/layouts/index.tsx';
import AuthPage from "@/app/pages/auth/index.tsx"
import UrlsPage from "@/app/pages/urls/index.tsx"
import CutUrlsPage from "@/app/pages/cut-url/index.tsx"
import NotFoundPage from "@/app/pages/404/index.tsx"
import ErrorPage from "@/app/pages/5xx/index.tsx";

const app = new Hono()

// Mount API routes
app.route("/api", api)
app.route("/v1", v1)

// Auth
app.use("/*", customAuthMiddleware)
// Body limit middleware
app.use(bodyLimiter)
// Secure Headers middleware
app.use(secureHeaders())
app.use(cors())

// APP routes
app.use("*", Layout)
app.get('/', (c) => c.redirect("/urls"))

app.get('/auth', (c) => c.render(<AuthPage />))
app.post('/auth', validatorAuth)

app.use("/urls/*", jwtMiddleware)
app.use("/urls", validatorDeleteUrl)
app.get("/urls", (c) => c.render(<UrlsPage />))
app.get("/urls/cut", (c) => c.render(<CutUrlsPage />))
app.post("/urls/cut", validatorUrls)

// Handlers
app.notFound((c) => c.render(<NotFoundPage />))

app.onError((err, c) => {
  if(!c.req.header("Authorization")){
    return c.redirect("/auth")
  }
  console.error(err)
  return c.render(<ErrorPage />)
})

export { app }
