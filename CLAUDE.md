# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, Paddington-Station-themed "guess the due date" baby pool. Static
HTML/CSS/JS only — no framework, no build step, no dependencies, no tests.
Hosted on **Cloudflare Pages** (project `babybets`) and served at
https://babybets.themelsoms.com.

The deployable site lives in `public/`. Everything outside `public/` (this
file, `README.md`, `wrangler.toml`) is repo metadata and is never published.

## Running it

No build. Preview locally by opening `public/index.html`, or:

```bash
python3 -m http.server 8000 --directory public   # then visit http://localhost:8000
```

Deploy with Wrangler (uses `wrangler.toml`, which sets
`pages_build_output_dir = "public"`):

```bash
npx wrangler pages deploy   # pushes public/ to the babybets Pages project
```

There is no CI pipeline and no git-push auto-deploy — deploying is the explicit
`wrangler` command above. The custom domain `babybets.themelsoms.com` is a
proxied CNAME → `babybets.pages.dev` in the `themelsoms.com` Cloudflare zone.

## Architecture

Three files under `public/`, each owns one concern:

- `public/index.html` — the whole page in one document. Three swappable
  `<section>`s: the arrivals `board` (countdown), the `ticket` (`#form-section`,
  the guess form), and the stamped `#thanks` confirmation. JS toggles `.hidden`
  between the form and the thanks panel.
- `public/script.js` — all behavior. No modules; runs top-to-bottom on load.
- `public/styles.css` — all styling and the split-flap/stamp animations.

### Two constants drive everything (top of `script.js`)

- `DUE_DATE` — the target date. Powers both the live countdown and the
  per-guess "how far off" feedback.
- `FORM_ENDPOINT` — a Formspree endpoint. Guesses POST here as `FormData`.
  If it still contains the placeholder `your-form-id`, the app runs in **demo
  mode**: guessers get feedback but nothing is sent. This is the
  `isConfigured` check.

### Key behaviors

- **Countdown** (`tickCountdown`, 1s interval): `setFlap` only rewrites a tile
  and replays its flip animation when the value actually changes, to avoid
  re-animating every second. Past the due date it switches to a one-time
  "standing at the platform" overdue state.
- **Guess feedback** (`guessFeedback`): computes day delta vs `DUE_DATE` and
  returns themed copy. Each guesser only ever sees their own result — other
  people's guesses are never exposed client-side (they live in the Formspree
  inbox).
- **Weight** is two inputs (`weight_lb` / `weight_oz`) combined by
  `combinedWeightGuess` into one `weight_guess` field set on the FormData
  before submit.

## Changing the due date

Edit it in **two** places, or the page contradicts itself:
- `public/script.js` → `DUE_DATE`
- `public/index.html` → the "Scheduled" value (`Tue 25 Aug 2026`) and the
  `guess_date` input's `min`/`max` bounds.

## Conventions

- The whole thing leans hard into the Paddington / National Rail voice
  (split-flap board, platform ticket, "darkest Peru", marmalade). Keep copy in
  that register.
- Accessibility is intentional: `prefers-reduced-motion` is honored, focus is
  visible, `aria-live` regions announce status. Preserve these when editing.
