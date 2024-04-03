import { html } from 'https://deno.land/x/hono@v4.2.1/helper.ts'
import { jsxRenderer } from 'https://deno.land/x/hono@v4.2.1/middleware.ts'

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.11"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Hono + htmx</title>
      </head>
      <body>
        <div class="p-4">
          <h1 class="text-4xl font-bold mb-4"><a href="/">Todo</a></h1>
          ${children}
        </div>
      </body>
    </html>
  `
})

export const LoginForm = () => (<div>
    <h4>メールアドレス</h4>
  <form hx-post="/login" hx-target="#todo" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" class="mb-4">
    <div class="mb-2">
      <input name="email" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
    </div>
    <h4>パスワード</h4>
    <div class="mb-2">
      <input name="password" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" />
    </div>
    <button class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center" type="submit">
      Submit
    </button>
  </form>
  </div>
)

