/* ===========================================================
   Guess the Due Date — Paddington edition 🧸
   ===========================================================
   SETUP (one time):
   1. Make a free form at https://formspree.io (New form → copy the
      endpoint, it looks like https://formspree.io/f/abcdwxyz).
   2. Paste that endpoint into FORM_ENDPOINT below.
   3. Commit & push. Guesses will arrive in your Formspree inbox
      (and any email you connect to the form).
   Until you do step 2, the form runs in "demo mode": guessers still
   get the fun feedback, but submissions aren't sent anywhere.
   =========================================================== */

const FORM_ENDPOINT = "https://formspree.io/f/xgobrdya";

// Official due date — Tuesday, 25 August 2026
const DUE_DATE = new Date("2026-08-25T00:00:00");

/* ---------- Countdown ---------- */
function pad(n) { return String(n).padStart(2, "0"); }

function tickCountdown() {
  const now = new Date();
  let diff = DUE_DATE - now;

  const el = (id) => document.getElementById(id);

  if (diff <= 0) {
    el("clock").innerHTML =
      '<p style="font-size:1.3rem;font-weight:700;color:var(--red)">' +
      'The wee bear has (officially) arrived! 🎉🧸</p>';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  el("days").textContent = days;
  el("hours").textContent = pad(hours);
  el("minutes").textContent = pad(mins);
  el("seconds").textContent = pad(secs);
}

tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- How close is the guess? ---------- */
function guessFeedback(guessStr, name) {
  const guess = new Date(guessStr + "T00:00:00");
  const dayMs = 86400000;
  const diffDays = Math.round((guess - DUE_DATE) / dayMs);
  const who = name ? name.split(" ")[0] : "you";

  if (diffDays === 0) {
    return `Spot on, ${who}! You picked the official due date itself. ` +
      `A marmalade sandwich tips its hat to you. 🍊🎩`;
  }
  const absDays = Math.abs(diffDays);
  const dir = diffDays < 0 ? "earlier than" : "later than";
  const word = absDays === 1 ? "day" : "days";
  let flavour;
  if (absDays <= 3)      flavour = "So close you can smell the marmalade! 🍞";
  else if (absDays <= 10) flavour = "A solid hunch from darkest Peru. 🐻";
  else if (absDays <= 21) flavour = "Bold! Babies do love a surprise. 🎁";
  else                    flavour = "A real adventurer's guess. 🧳";

  return `${who}, your guess is ${absDays} ${word} ${dir} the official due ` +
    `date. ${flavour}`;
}

/* ---------- Form handling ---------- */
const form = document.getElementById("guess-form");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const formSection = document.getElementById("form-section");
const thanksPanel = document.getElementById("thanks");
const thanksDetail = document.getElementById("thanks-detail");
const againBtn = document.getElementById("again-btn");

const isConfigured = !FORM_ENDPOINT.includes("your-form-id");

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function showThanks(detail) {
  thanksDetail.textContent = detail;
  formSection.classList.add("hidden");
  thanksPanel.classList.remove("hidden");
  rainSandwiches(18);
  thanksPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const guessStr = document.getElementById("guess_date").value;
  const feedback = guessFeedback(guessStr, name);

  // Demo mode — no endpoint configured yet.
  if (!isConfigured) {
    setStatus("Demo mode: add a Formspree endpoint in script.js to collect guesses.", "ok");
    showThanks(feedback + "  (Demo mode — this guess wasn't saved.)");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending your guess to Paddington Station… 🧳");

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });

    if (res.ok) {
      form.reset();
      showThanks(feedback);
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = data.errors ? data.errors.map((x) => x.message).join(", ")
                              : "Something went wrong. Please try again.";
      setStatus("Oh dear: " + msg, "error");
    }
  } catch (err) {
    setStatus("Network hiccup — please check your connection and try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

againBtn.addEventListener("click", () => {
  thanksPanel.classList.add("hidden");
  formSection.classList.remove("hidden");
  setStatus("");
  formSection.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* ---------- Falling marmalade sandwiches ---------- */
function rainSandwiches(count) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.querySelector(".sandwich-rain");
  const treats = ["🍞", "🍊", "🧸", "🧡", "🎩"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = treats[Math.floor(Math.random() * treats.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = 4 + Math.random() * 4 + "s";
    s.style.animationDelay = Math.random() * 1.5 + "s";
    s.style.fontSize = 1.2 + Math.random() * 1.4 + "rem";
    layer.appendChild(s);
    setTimeout(() => s.remove(), 10000);
  }
}

// A gentle welcome shower on load.
window.addEventListener("load", () => rainSandwiches(10));
