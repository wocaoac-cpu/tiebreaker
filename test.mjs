// Tiebreaker engine tests — deterministic weighted decision. Run: node test.mjs
import { TiebreakerEngine as E } from './engine.js';

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
function eq(a, b, m) { ok(a === b, `${m} — got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); }
function near(a, b, m, t = 0.1) { ok(Math.abs(a - b) <= t, `${m} — got ${a}, want ~${b}`); }

// ---- normalizeWeights ----
const nw = E.normalizeWeights([5, 3, 4]);
near(nw[0], 0.4167, 'normalize salary'); near(nw[1], 0.25, 'normalize commute'); near(nw[2], 0.3333, 'normalize growth');
near(E.normalizeWeights([5, 3, 4]).reduce((a, b) => a + b, 0), 1, 'weights sum to 1');
eq(JSON.stringify(E.normalizeWeights([0, 0])), JSON.stringify([0.5, 0.5]), 'all-zero -> equal');
eq(E.normalizeWeights([]).length, 0, 'empty weights');

// ---- main case: Job A vs Job B ----
const input = {
  options: ['Job A', 'Job B'],
  criteria: [{ name: 'Salary', weight: 5 }, { name: 'Commute', weight: 3 }, { name: 'Growth', weight: 4 }],
  scores: [[8, 4, 6], [6, 9, 7]]
};
const a = E.analyze(input);
eq(a.winner.name, 'Job B', 'winner is Job B');
near(a.winner.score, 70.8, 'winner score');
eq(a.runnerUp.name, 'Job A', 'runnerUp is Job A');
near(a.runnerUp.score, 63.3, 'runnerUp score');
near(a.margin, 7.5, 'margin');
eq(a.closeCall, false, 'not a close call');
eq(a.results.length, 2, 'two results');
eq(a.results[0].rank, 1, 'rank 1 first');
eq(a.results[1].rank, 2, 'rank 2 second');
ok(a.results[0].score >= a.results[1].score, 'results sorted desc');

// most decisive = Commute (where B beats A most, weighted)
eq(a.decisive.criterion, 'Commute', 'decisive criterion is Commute');
// tipping point: drop Commute and Job A wins instead
eq(a.whatIf.flips, true, 'whatIf flips');
eq(a.whatIf.newWinner, 'Job A', 'whatIf new winner Job A');
// top contribution to B is Salary (0.4167*6*10 = 25.0, the largest single contribution)
eq(a.topReasons[0].criterion, 'Salary', 'top contributor to winner is Salary');
near(a.topReasons[0].contribution, 25.0, 'top contribution value');

// weights echoed normalized
near(a.weights[0].weight, 0.42, 'weights echoed', 0.02);

// ---- close call ----
const cc = E.analyze({ options: ['X', 'Y'], criteria: [{ name: 'a', weight: 1 }, { name: 'b', weight: 1 }], scores: [[6, 6], [6, 6.4]] });
near(cc.winner.score, 62, 'close winner score', 0.2);
near(cc.margin, 2, 'close margin', 0.2);
eq(cc.closeCall, true, 'flagged close call (margin <= 3)');

// ---- no tipping point (winner dominates) ----
const dom = E.analyze({ options: ['Strong', 'Weak'], criteria: [{ name: 'a', weight: 1 }, { name: 'b', weight: 1 }], scores: [[9, 9], [2, 2]] });
eq(dom.winner.name, 'Strong', 'dominant winner');
eq(dom.whatIf.flips, false, 'no flip when winner dominates');

// ---- score clamping + missing defaults ----
const clamp = E.analyze({ options: ['Hi', 'Lo'], criteria: [{ name: 'a', weight: 1 }], scores: [[15], [3]] });
near(clamp.results.find(r => r.name === 'Hi').score, 100, 'score 15 clamps to 10 -> 100');
const miss = E.analyze({ options: ['Full', 'Empty'], criteria: [{ name: 'a', weight: 1 }], scores: [[7]] }); // Empty row missing
eq(miss.winner.name, 'Full', 'missing scores default 0');
near(miss.results.find(r => r.name === 'Empty').score, 0, 'missing -> 0');

// ---- single criterion ----
const one = E.analyze({ options: ['P', 'Q'], criteria: [{ name: 'only', weight: 1 }], scores: [[5], [8]] });
eq(one.winner.name, 'Q', 'single-criterion winner');

// ---- invalid input ----
eq(E.analyze(null), null, 'null -> null');
eq(E.analyze({}), null, 'empty -> null');
eq(E.analyze({ options: ['solo'], criteria: [{ name: 'a', weight: 1 }] }), null, '<2 options -> null');
eq(E.analyze({ options: ['a', 'b'], criteria: [] }), null, '0 criteria -> null');
eq(E.analyze({ options: ['a', 'b', ''], criteria: [{ name: 'x', weight: 1 }], scores: [[5], [6], [9]] }).results.length, 2, 'blank option filtered out');

// ---- exports ----
ok(E.toReport(a).includes('Job B'), 'report names winner');
ok(E.toReport(a).includes('Tipping point'), 'report has tipping point');
ok(JSON.parse(E.toJSON(a)).winner.name === 'Job B', 'json parseable');

// ---- adversarial / robustness (self-audit; Codex was over quota this round) ----
eq(JSON.stringify(E.normalizeWeights([-5, 5])), JSON.stringify([0, 1]), 'negative weight clamped to 0');
// NaN weight -> falls back, no crash, finite output
const nanW = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: NaN }, { name: 'y', weight: 2 }], scores: [[5, 5], [7, 3]] });
ok(nanW && Number.isFinite(nanW.winner.score), 'NaN weight -> finite winner score');
// NaN score -> treated as 0
const nanS = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: 1 }], scores: [[NaN], [5]] });
eq(nanS.winner.name, 'B', 'NaN score -> 0, B wins');
ok(Number.isFinite(nanS.winner.score) && Number.isFinite(nanS.runnerUp.score), 'no NaN in scores');
// negative score clamped to 0
const negS = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: 1 }], scores: [[-5], [4]] });
near(negS.results.find(r => r.name === 'A').score, 0, 'negative score clamps to 0');
// exact tie -> close call, no crash, margin 0
const tie = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: 1 }, { name: 'y', weight: 1 }], scores: [[5, 7], [5, 7]] });
near(tie.margin, 0, 'exact tie margin 0');
eq(tie.closeCall, true, 'exact tie is close call');
ok(tie.whatIf && tie.whatIf.flips === false, 'tie tipping point does not crash');
// jagged / short score row -> missing cells default 0
const jag = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: 1 }, { name: 'y', weight: 1 }], scores: [[8], [4, 9]] });
ok(Number.isFinite(jag.winner.score), 'jagged rows -> finite');
// huge values: weight + score
const huge = E.analyze({ options: ['A', 'B'], criteria: [{ name: 'x', weight: 1e9 }, { name: 'y', weight: 1 }], scores: [[1e9, 2], [3, 4]] });
ok(huge.results.every(r => r.score >= 0 && r.score <= 100), 'huge inputs stay within 0-100');

// ---- report ----
console.log(`\nTiebreaker engine tests: ${pass} passed, ${fail} failed (total ${pass + fail})`);
if (fail) { console.log('\nFAILURES:'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
else console.log('ALL GREEN ✓');
