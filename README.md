# Tiebreaker

**Stuck between options? Tiebreaker tells you which one actually wins, why, and what would flip the result — free, private, in your browser.**

🔗 **Live: https://tb-70f.pages.dev**

We make big decisions — which job, which apartment, which laptop — by spiraling in our heads or building a messy pros/cons spreadsheet. Tiebreaker is the structured version: list your options, rank what matters (with weights), score each one, and it computes a weighted result. But the useful part isn't the number — it's the **tipping point**: *"Your pick rests on Commute. Stop caring about it and Job A wins instead."* And when two options are genuinely close, it tells you honestly: **go with your gut.**

## What it does

- **Ranks your options** on a 0–100 weighted score from your own inputs.
- **Tipping point** — the one factor your choice depends on; drop it and see if the winner flips. No other decision tool does this.
- **Honest ties** — if the margin is tiny, it says so instead of faking precision.
- **Why the winner won** — the criteria contributing most to the top score.
- **Built-in presets** — job offer, apartment, buying a car, which laptop — start scoring in one click.
- **Private** — no upload, no account, no tracking. It's just arithmetic on your numbers.
- **Trilingual** — English / 中文 / Українська.

## How it works (deterministic, no AI)

Normalize the criteria weights, multiply by each option's 0–10 scores, sum to a 0–100 total, rank. The "decisive" criterion is the one where the winner's weighted lead over the runner-up is largest; the tipping point re-runs the ranking with that criterion's weight set to zero and checks whether the winner changes. All pure functions — no model, no server.

## Project structure

```
index.html      UI, editable decision grid, trilingual scaffold
engine.js       Deterministic weighted-decision engine (no deps; browser + Node)
app.js          dynamic grid, i18n, results, tipping-point, copy
test.mjs        49 assertions
```

## Run the tests

```bash
node test.mjs
```

## Run locally

```bash
python -m http.server 8037
# open http://localhost:8037
```

## Note

Tiebreaker is a structured thinking aid. The result reflects *your* scores and weights — it's math, not advice. Use it to clarify your own judgment, not replace it.

## License

MIT — see [LICENSE](LICENSE).
