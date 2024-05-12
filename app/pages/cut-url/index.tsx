/** @jsx jsx */
/** @jsxFrag Fragment */
import { type PropsWithChildren, type FC } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'
import { jsx, Fragment, useRequestContext } from 'https://deno.land/x/hono@v4.2.8/middleware.ts'

const CutUrlsPage: FC<PropsWithChildren> = () => {
  const c = useRequestContext()
  const { status, message } = c.req.query()

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
      <form id="form-to-save" method="POST">
        <label htmlFor="original_url">
          <span style="display:block;">Url to cut *</span>
          <input type="text" name="original_url" placeholder="https://..." required minlength={10} maxlength={32} pattern="https?://.+"/>
        </label>
        <label htmlFor="custom_path">
          <span style="display:block;">Custom path</span>
          <input type="text" name="custom_path" placeholder="Ej: /..." minlength={4} maxlength={32} pattern="/?.+"/>
        </label>
        <button>Enviar</button>
      </form>
    </>
  )
}


export default CutUrlsPage
