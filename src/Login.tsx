import { Hono } from "hono";

export const login = new Hono()

login.get("/", (c) => {
  return c.render(<div class="container">
    <form
      id="contact"
      hx-post="/api/submit"
      hx-target="#submit-button"
      hx-swap="outerHTML"
    >
      <h3>お問い合わせフォーム</h3>
      <h4>ご意見・ご要望をお寄せください。</h4>
      <fieldset>
        <input
          placeholder="お名前"
          type="text"
          name="name"
          required
          autofocus />
      </fieldset>
      <fieldset>
        <input
          placeholder="メールアドレス"
          type="email"
          name="email"
          required />
      </fieldset>
      <fieldset>
        <textarea
          placeholder="パスワード."
          type="password"
          name="message"
          required
        ></textarea>
      </fieldset>
      <button name="submit" type="submit" id="submit-button">送信</button>
      <div class="htmx-indicator loader"></div>
    </form>
  </div>
  );
});
