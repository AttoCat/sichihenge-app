import { FC } from "hono/middleware";

export const Layout: FC = (props) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>{props.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@2.51.5/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.js"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
    <body>{props.children}</body>
    </html>
    );
    }