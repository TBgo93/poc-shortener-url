/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx, jsxRenderer } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts';

const TITLES: Record<string, string> = {
  "/urls": "Urls",
  "/urls/cut": "Cut your url",
  "/auth": "Auth panel"
}

const Layout = jsxRenderer(({ children }) => {
  const ctx = useRequestContext()
  const { req: { path: reqPath } } = ctx
  const title = TITLES[reqPath] ?? ""
  const links = Object.entries(TITLES)

  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - Shortener Url</title>
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
      </head>
      <body>
        <header>
          <nav>
            {links.map(([path, title]) => {
              return (
                <a 
                  href={path}
                  class={reqPath === path ? "current" : ""}
                >
                  {title}
                </a>
              )
            })}
          </nav>
          <h1>Shortener Url</h1>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )},
  {
    docType: true,
  }
)

export default Layout
