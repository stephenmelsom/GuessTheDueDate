# Guess the Due Date 🧸

A Paddington-bear-themed baby pool. Friends and family guess when the wee
bear will arrive — official due date **Tuesday, 25 August 2026** — and their
guesses are collected for you to see.

Everything is a static site (HTML/CSS/JS), so it runs happily on GitHub Pages.

## ✨ Features

- 🎩 Paddington theme: red hat, blue duffle-coat colours, marmalade jars,
  a "Please look after this baby. Thank you." luggage tag, and a gentle
  rain of falling marmalade sandwiches.
- ⏳ Live countdown to the due date.
- 📝 Guess form: name, guessed date, optional weight guess, boy/girl hunch,
  and a message for the baby.
- 🍊 Instant feedback telling each guesser how far their pick is from the
  official due date — without revealing other people's guesses.
- ♿ Respects `prefers-reduced-motion` and works on mobile.

## 🛠️ Setup — collect the guesses (one time, ~2 minutes)

Guesses are collected with [Formspree](https://formspree.io)'s free tier.

1. Sign up at <https://formspree.io> and create a **New form**.
2. Copy its endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Open [`script.js`](script.js) and paste it into the `FORM_ENDPOINT`
   constant near the top:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```
4. Commit and push.

Submissions then land in your Formspree inbox (and any email you connect to
the form). Until you do step 3, the page runs in **demo mode** — guessers
still get the fun feedback, but nothing is saved.

> The first time a guess is submitted, Formspree emails you to confirm the
> form. Click the link once and you're set.

## 🚀 Deploy to GitHub Pages

This is a plain static site, so no build pipeline is needed — Pages serves
the files straight from the branch.

1. Make the repo **public** (**Settings → General → Danger Zone →
   Change visibility**). Pages is free for public repos and the site is
   openable by anyone with the link. *(On a private repo, Pages needs a paid
   plan and forces visitors to log in.)*
2. **Settings → Pages → Build and deployment**.
3. Set **Source** to **Deploy from a branch**, branch **`main`**, folder
   **`/ (root)`**, and **Save**.
4. Give it a minute, then visit
   `https://<your-username>.github.io/<repo-name>/`
   (here: `https://stephenmelsom.github.io/GuessTheDueDate/`).

## 🧸 Changing the due date

Edit two spots:

- `script.js` → `const DUE_DATE = new Date("2026-08-25T00:00:00");`
- `index.html` → the "Official due date" text in the countdown section.

## Local preview

Just open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Made with marmalade & love. 🍞
