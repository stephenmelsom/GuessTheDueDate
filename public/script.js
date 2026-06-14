/* ===========================================================
   Now Arriving — Paddington Station 🚉
   ===========================================================
   SETUP (one time):
   1. Make a free form at https://formspree.io (New form → copy the
      endpoint, it looks like https://formspree.io/f/abcdwxyz).
   2. Paste that endpoint into FORM_ENDPOINT below.
   3. Commit & push. Guesses arrive in your Formspree inbox.
   Until you do step 2, the form runs in "demo mode": guessers still
   get the fun feedback, but submissions aren't sent anywhere.
   =========================================================== */

const FORM_ENDPOINT = "https://formspree.io/f/xgobrdya";

// Scheduled arrival — Tuesday, 25 August 2026
const DUE_DATE = new Date("2026-08-25T00:00:00");

/* ---------- Arrivals board countdown ---------- */
function pad(n) { return String(n).padStart(2, "0"); }

const el = (id) => document.getElementById(id);

// Flip a flap tile only when its displayed value actually changes.
function setFlap(id, value) {
  const span = el(id);
  if (!span || span.textContent === value) return;
  span.textContent = value;
  const tile = span.closest(".flap");
  if (!tile) return;
  tile.classList.remove("flip");
  // reflow so the animation can replay
  void tile.offsetWidth;
  tile.classList.add("flip");
}

let overdueShown = false;

function tickCountdown() {
  const now = new Date();
  let diff = DUE_DATE - now;

  if (diff <= 0) {
    if (!overdueShown) {
      el("clock").innerHTML =
        '<p class="board__arrived">— Standing at the platform —</p>';
      const chip = el("status-chip");
      chip.textContent = "Arriving";
      chip.classList.add("late");
      el("status-note").textContent = "any moment now";
      overdueShown = true;
    }
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  setFlap("days", String(days));
  setFlap("hours", pad(hours));
  setFlap("minutes", pad(mins));
  setFlap("seconds", pad(secs));
}

tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- How close is the guess? (station voice) ---------- */
function guessFeedback(guessStr, name) {
  const guess = new Date(guessStr + "T00:00:00");
  const dayMs = 86400000;
  const diffDays = Math.round((guess - DUE_DATE) / dayMs);
  const who = name ? name.split(" ")[0] : "You";

  if (diffDays === 0) {
    return `Bang on the timetable, ${who} — you've picked the scheduled ` +
      `arrival itself. The stationmaster doffs his hat. 🎩`;
  }

  const absDays = Math.abs(diffDays);
  const word = absDays === 1 ? "day" : "days";
  const dir = diffDays < 0 ? "ahead of schedule" : "behind schedule";

  let flavour;
  if (absDays <= 3)       flavour = "Close enough to hear the whistle.";
  else if (absDays <= 10) flavour = "A solid hunch from darkest Peru. 🐻";
  else if (absDays <= 21) flavour = "Bold — but this train keeps its own time.";
  else                    flavour = "A real adventurer's guess. 🧳";

  const late = diffDays > 0
    ? " (Running late — very much in the Paddington tradition.)"
    : "";

  return `${who}, your guess is ${absDays} ${word} ${dir}. ${flavour}${late}`;
}

/* ---------- Combine lb + oz into one readable weight ---------- */
function combinedWeightGuess() {
  const lb = (el("weight_lb").value || "").trim();
  const oz = (el("weight_oz").value || "").trim();
  const parts = [];
  if (lb !== "") parts.push(lb + " lb");
  if (oz !== "") parts.push(oz + " oz");
  return parts.join(" ");
}

/* ---------- Ticket / form handling ---------- */
const form = document.getElementById("guess-form");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const formSection = document.getElementById("form-section");
const thanksPanel = document.getElementById("thanks");
const thanksDetail = document.getElementById("thanks-detail");
const stampDate = document.getElementById("stamp-date");
const againBtn = document.getElementById("again-btn");

const isConfigured = !FORM_ENDPOINT.includes("your-form-id");

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function showThanks(detail, guessStr) {
  thanksDetail.textContent = detail;
  // Stamp the date the guess was logged.
  const stamped = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase().replace(/ /g, " · ");
  stampDate.textContent = stamped;

  formSection.classList.add("hidden");
  thanksPanel.classList.remove("hidden");
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
    showThanks(feedback + "  (Demo mode — this guess wasn't saved.)", guessStr);
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending your guess up to the board… 🚉");

  try {
    const data = new FormData(form);
    const weight = combinedWeightGuess();
    if (weight) data.set("weight_guess", weight);

    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });

    if (res.ok) {
      form.reset();
      showThanks(feedback, guessStr);
    } else {
      const data = await res.json().catch(() => ({}));
      const msg = data.errors ? data.errors.map((x) => x.message).join(", ")
                              : "Something went wrong. Please try again.";
      setStatus("Signal failure: " + msg, "error");
    }
  } catch (err) {
    setStatus("The line's gone quiet — check your connection and try again.", "error");
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
