/*
 * Tiebreaker engine — deterministic weighted-decision analysis. No deps, no network.
 * Runs identically in the browser and Node.
 *
 * You give it options, the criteria that matter (with weights), and how each
 * option scores on each criterion. It ranks them, explains WHY the winner won,
 * finds the most decisive criterion, and computes the tipping point — the one
 * thing that, if you stopped caring about it, would flip the result.
 *
 * Scores are 0–10 per cell; totals are reported on a 0–100 scale.
 */

const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;
const numv = (v, def = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : def; };

// normalize an array of weights to sum to 1; all-zero/empty -> equal weights
function normalizeWeights(weights) {
  const w = (weights || []).map(x => Math.max(0, numv(x)));
  const sum = w.reduce((a, b) => a + b, 0);
  if (w.length === 0) return [];
  if (sum <= 0) return w.map(() => 1 / w.length);
  return w.map(x => x / sum);
}

// total (0-100) for one option given normalized weights and its 0-10 scores
function optionTotal(scoresRow, normWeights) {
  let t = 0;
  for (let c = 0; c < normWeights.length; c++) t += normWeights[c] * Math.max(0, Math.min(10, numv(scoresRow && scoresRow[c])));
  return t * 10; // 0-10 weighted avg -> 0-100
}

function rankOptions(options, criteria, scores, normWeights) {
  return options.map((name, o) => {
    const row = (scores && scores[o]) || [];
    const contributions = criteria.map((cr, c) => ({
      criterion: cr.name,
      contribution: round2(normWeights[c] * Math.max(0, Math.min(10, numv(row[c]))) * 10)
    })).sort((a, b) => b.contribution - a.contribution);
    return { name, score: round1(optionTotal(row, normWeights)), contributions };
  }).map((r, i) => ({ ...r, _i: i }))
    .sort((a, b) => b.score - a.score)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));
}

function analyze(input = {}) {
  if (!input || typeof input !== 'object') return null;
  const options = Array.isArray(input.options) ? input.options.filter(x => x != null && String(x).trim() !== '') : [];
  const criteria = Array.isArray(input.criteria) ? input.criteria.filter(c => c && String(c.name).trim() !== '') : [];
  if (options.length < 2 || criteria.length < 1) return null;

  // align scores matrix to options x criteria (default 0)
  const scores = options.map((_, o) => criteria.map((_, c) => {
    const row = input.scores && input.scores[o];
    return Math.max(0, Math.min(10, numv(row && row[c])));
  }));

  const rawW = criteria.map(c => Math.max(0, numv(c.weight, 1)));
  const normW = normalizeWeights(rawW);

  const ranked = rankOptions(options, criteria, scores, normW);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const margin = round1(winner.score - runnerUp.score);
  const closeCall = margin <= 3;

  // indices in the ORIGINAL option order
  const wI = winner._i, rI = runnerUp._i;

  // most decisive criterion = where winner's weighted lead over runner-up is largest in magnitude
  let decisive = null, best = -Infinity;
  criteria.forEach((cr, c) => {
    const lead = normW[c] * (scores[wI][c] - scores[rI][c]); // + means it helps the winner
    if (Math.abs(lead) > best) { best = Math.abs(lead); decisive = { criterion: cr.name, index: c, lead: round2(lead * 10) }; }
  });

  // tipping point: drop the decisive criterion (weight 0), does the winner change?
  let whatIf = { flips: false, criterion: decisive ? decisive.criterion : null };
  if (decisive) {
    const w2 = rawW.slice(); w2[decisive.index] = 0;
    const nw2 = normalizeWeights(w2);
    const r2 = rankOptions(options, criteria, scores, nw2);
    whatIf.flips = r2[0]._i !== wI;
    if (whatIf.flips) whatIf.newWinner = r2[0].name;
  }

  return {
    weights: criteria.map((c, i) => ({ name: c.name, weight: round2(normW[i]) })),
    results: ranked.map(({ _i, ...r }) => r),
    winner: { name: winner.name, score: winner.score },
    runnerUp: { name: runnerUp.name, score: runnerUp.score },
    margin, closeCall,
    decisive,            // {criterion, index, lead}
    whatIf,              // {flips, criterion, newWinner?}
    topReasons: winner.contributions.slice(0, 3)
  };
}

function toJSON(a) { return JSON.stringify(a, null, 2); }
function toReport(a) {
  const L = [];
  L.push(a.closeCall ? `IT'S CLOSE: ${a.winner.name} edges ${a.runnerUp.name} (${a.winner.score} vs ${a.runnerUp.score})`
                     : `WINNER: ${a.winner.name} (${a.winner.score} / 100), over ${a.runnerUp.name} (${a.runnerUp.score})`);
  L.push('');
  L.push('Ranking:');
  a.results.forEach(r => L.push(`  ${r.rank}. ${r.name} — ${r.score}`));
  if (a.decisive) L.push('', `Most decisive: ${a.decisive.criterion}`);
  if (a.whatIf && a.whatIf.flips) L.push(`Tipping point: stop caring about ${a.whatIf.criterion} and ${a.whatIf.newWinner} wins instead.`);
  return L.join('\n');
}

const TiebreakerEngine = { normalizeWeights, optionTotal, rankOptions, analyze, toJSON, toReport, round1 };
export { TiebreakerEngine };
export default TiebreakerEngine;
if (typeof window !== 'undefined') window.TiebreakerEngine = TiebreakerEngine;
