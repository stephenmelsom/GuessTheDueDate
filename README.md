# Guess the Due Date 🧸

A Paddington-bear-themed baby pool. Friends and family guess when the wee
bear will arrive — official due date **Tuesday, 25 August 2026** — and their
guesses are collected for you to see.

Everything is a static site (HTML/CSS/JS) hosted on Cloudflare Pages, live at
**<https://babybets.themelsoms.com>**.

## ✨ Features

- 🚉 **Paddington Station** theme: the baby is "the next arrival." A vintage
  railway arrivals board, British-Rail navy and marmalade-amber, with the
  countdown shown as a split-flap "Expected in" time and an `ON TIME` status
  (which everyone knows it never is).
- 🎫 The guess form is a **platform ticket** — perforated Manila card stock,
  punched hole and all. Submitting **rubber-stamps** the ticket `GUESS LOGGED`.
- ⏳ Live countdown to the scheduled arrival, with a mechanical flap-flip on
  each change.
- 📝 Guess form: passenger name, guessed arrival date, optional weight guess,
  a name guess, and a note for the wee bear.
- 🍊 Instant feedback telling each guesser how far their pick is from the
  scheduled arrival — without revealing other people's guesses.
- ♿ Respects `prefers-reduced-motion`, has visible keyboard focus, and works
  down to mobile.

## 🛠️ Setup — collect the guesses (one time, ~2 minutes)

Guesses are collected with [Formspree](https://formspree.io)'s free tier.

1. Sign up at <https://formspree.io> and create a **New form**.
2. Copy its endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Open [`public/script.js`](public/script.js) and paste it into the
   `FORM_ENDPOINT` constant near the top:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
4. Redeploy (see below).

Submissions then land in your Formspree inbox (and any email you connect to
the form). Until you do step 3, the page runs in **demo mode** — guessers
still get the fun feedback, but nothing is saved.

> The first time a guess is submitted, Formspree emails you to confirm the
> form. Click the link once and you're set.

## 🚀 Deploy to Cloudflare Pages

This is a plain static site (no build pipeline). The deployable files live in
`public/`; `wrangler.toml` sets `pages_build_output_dir = "public"`.

Deploy (or redeploy after any edit) with:

```bash
npx wrangler pages deploy
```

That uploads `public/` to the `babybets` Cloudflare Pages project. The live
site is `https://babybets.themelsoms.com` (a proxied CNAME →
`babybets.pages.dev` in the `themelsoms.com` zone), and the project also stays
reachable at `https://babybets.pages.dev`.

## 🧸 Changing the due date

Edit two spots:

- `public/script.js` → `const DUE_DATE = new Date("2026-08-25T00:00:00");`
- `public/index.html` → the "Official due date" text in the countdown section.

## Local preview

Open `public/index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000 --directory public
# then visit http://localhost:8000
```

Made with marmalade & love. 🍞
