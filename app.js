import { TiebreakerEngine as E } from './engine.js';

/* ===================== i18n ===================== */
const I18N = {
  en: {
    lock: '100% local · nothing uploaded',
    kicker: 'DECISION MAKER · 100% IN YOUR BROWSER',
    h1: ['Stop spreadsheet-spiraling. ', 'Let it do the math', '.'],
    lede: 'List your options, rank what matters, score each one — Tiebreaker tells you <b>who wins, why</b>, and <b>what would flip the result</b>. 100% in your browser. Nothing uploaded.',
    add_opt: '+ Add option', add_crit: '+ Add what matters',
    hint: 'Score each option 0–10 on each row · stars = how much that row matters',
    f1: '© 2026 TJ NOVA LTD · Reg. 17308318',
    disc: 'A structured way to think — the math reflects your own scores and weights, not an opinion. Everything runs in your browser.',
    win_tag: 'YOUR PICK', close_tag: 'TOO CLOSE TO CALL',
    win_big: '{name} wins', close_big: 'It’s basically a tie',
    win_sub: '<b>{ws}</b> / 100 vs {rn} (<b>{rs}</b>) · margin {m}',
    close_sub: '{a} and {b} are within {m} points — the spreadsheet won’t decide this one. Go with your gut.',
    why: 'Why {name} won', tip_tag: 'Tipping point',
    tip_flip: 'Your pick rests on <b>{crit}</b>. Stop caring about it and <b>{nw}</b> wins instead.',
    tip_solid: '<b>{name}</b> still wins even if you drop any single factor — that’s a solid, robust choice.',
    need: 'Add at least 2 options and 1 thing that matters to see your result.',
    copy: 'Copy result', copied: 'Copied ✓',
    opt_new: 'Option {n}', crit_new: 'Factor {n}',
    pre_job: 'Job offer', pre_apartment: 'Apartment', pre_car: 'Buying a car', pre_laptop: 'Which laptop'
  },
  zh: {
    lock: '100% 本地 · 零上传',
    kicker: '决策助手 · 100% 浏览器本地运行',
    h1: ['别在脑子里反复纠结了，', '让它帮你算', '。'],
    lede: '列出选项、标出你在乎什么、给每个打分——Tiebreaker 告诉你<b>谁赢、为什么赢</b>，以及<b>什么会让结论翻盘</b>。全程浏览器本地运行，不上传任何东西。',
    add_opt: '+ 加选项', add_crit: '+ 加在乎的点',
    hint: '每个选项每行打 0–10 分 · 星星=这一行有多重要',
    f1: '© 2026 TJ NOVA LTD · 注册号 17308318',
    disc: '一种把纠结理清楚的结构化方法——算出的结果来自你自己的打分和权重，不是谁的主观意见。全程浏览器本地运行。',
    win_tag: '你该选', close_tag: '几乎打平',
    win_big: '{name} 胜出', close_big: '基本打平',
    win_sub: '<b>{ws}</b> / 100 vs {rn}（<b>{rs}</b>）· 领先 {m} 分',
    close_sub: '{a} 和 {b} 只差 {m} 分——这个表替你决定不了，跟着直觉走吧。',
    why: '{name} 凭什么赢', tip_tag: '临界点',
    tip_flip: '你的选择主要押在<b>{crit}</b>上。一旦不在乎它，赢家就变成 <b>{nw}</b>。',
    tip_solid: '就算去掉任意单一因素，<b>{name}</b> 依然胜出——这是个稳的选择。',
    need: '至少加 2 个选项和 1 个在乎的点，才能算出结果。',
    copy: '复制结果', copied: '已复制 ✓',
    opt_new: '选项 {n}', crit_new: '因素 {n}',
    pre_job: '工作 offer', pre_apartment: '租房', pre_car: '买车', pre_laptop: '买哪台电脑'
  },
  uk: {
    lock: '100% локально · нічого не завантажується',
    kicker: 'ПРИЙНЯТТЯ РІШЕНЬ · 100% У БРАУЗЕРІ',
    h1: ['Годі крутити в голові. ', 'Хай воно порахує', '.'],
    lede: 'Запиши варіанти, познач що важливо, постав оцінки — Tiebreaker скаже <b>хто переміг, чому</b> і <b>що могло б перевернути результат</b>. Усе в браузері. Нічого не вивантажується.',
    add_opt: '+ Додати варіант', add_crit: '+ Додати критерій',
    hint: 'Оцінюй кожен варіант 0–10 у кожному рядку · зірки = наскільки рядок важливий',
    f1: '© 2026 TJ NOVA LTD · Реєстр. 17308318',
    disc: 'Структурований спосіб думати — розрахунок відображає ваші власні оцінки та ваги, а не чиюсь думку. Усе працює у браузері.',
    win_tag: 'ВАШ ВИБІР', close_tag: 'ЗАНАДТО БЛИЗЬКО',
    win_big: '{name} перемагає', close_big: 'Майже нічия',
    win_sub: '<b>{ws}</b> / 100 проти {rn} (<b>{rs}</b>) · відрив {m}',
    close_sub: '{a} і {b} відрізняються на {m} балів — таблиця це не вирішить. Слухай інтуїцію.',
    why: 'Чому {name} переміг', tip_tag: 'Точка перелому',
    tip_flip: 'Ваш вибір тримається на <b>{crit}</b>. Перестаньте це цінувати — і перемагає <b>{nw}</b>.',
    tip_solid: '<b>{name}</b> перемагає навіть якщо прибрати будь-який окремий фактор — це надійний вибір.',
    need: 'Додайте щонайменше 2 варіанти і 1 критерій, щоб побачити результат.',
    copy: 'Копіювати', copied: 'Скопійовано ✓',
    opt_new: 'Варіант {n}', crit_new: 'Фактор {n}',
    pre_job: 'Пропозиція роботи', pre_apartment: 'Квартира', pre_car: 'Купівля авто', pre_laptop: 'Який ноутбук'
  }
};

const PRESET_DATA = {
  job: { weights: [5, 3, 4, 3], scores: [[8, 4, 6, 7], [6, 9, 7, 6]] },
  apartment: { weights: [5, 4, 3, 2], scores: [[6, 5, 8, 7], [8, 8, 5, 6]] },
  car: { weights: [4, 5, 3, 2], scores: [[8, 6, 7, 5], [5, 9, 6, 8]] },
  laptop: { weights: [4, 5, 4, 3], scores: [[7, 8, 5, 6], [5, 6, 9, 8]] }
};
const PRESET_NAMES = {
  en: {
    job: { options: ['Job A', 'Job B'], criteria: ['Salary', 'Commute', 'Growth', 'Culture'] },
    apartment: { options: ['Apartment A', 'Apartment B'], criteria: ['Rent', 'Commute', 'Space', 'Light'] },
    car: { options: ['Car A', 'Car B'], criteria: ['Price', 'Reliability', 'Fuel economy', 'Looks'] },
    laptop: { options: ['Laptop A', 'Laptop B'], criteria: ['Price', 'Performance', 'Battery', 'Weight'] }
  },
  zh: {
    job: { options: ['工作 A', '工作 B'], criteria: ['薪资', '通勤', '成长', '文化'] },
    apartment: { options: ['公寓 A', '公寓 B'], criteria: ['租金', '通勤', '空间', '采光'] },
    car: { options: ['车 A', '车 B'], criteria: ['价格', '可靠性', '油耗', '颜值'] },
    laptop: { options: ['电脑 A', '电脑 B'], criteria: ['价格', '性能', '续航', '重量'] }
  },
  uk: {
    job: { options: ['Робота A', 'Робота B'], criteria: ['Зарплата', 'Дорога', 'Розвиток', 'Культура'] },
    apartment: { options: ['Квартира A', 'Квартира B'], criteria: ['Оренда', 'Дорога', 'Простір', 'Світло'] },
    car: { options: ['Авто A', 'Авто B'], criteria: ['Ціна', 'Надійність', 'Витрата', 'Вигляд'] },
    laptop: { options: ['Ноутбук A', 'Ноутбук B'], criteria: ['Ціна', 'Потужність', 'Батарея', 'Вага'] }
  }
};

let lang = 'en';
let state = { options: [], criteria: [], scores: [] };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (k) => (I18N[lang] && I18N[lang][k] != null) ? I18N[lang][k] : I18N.en[k];
const fill = (s, m) => String(s).replace(/\{(\w+)\}/g, (_, k) => m[k] != null ? m[k] : '');

/* ===================== grid render ===================== */
function renderGrid() {
  const g = $('#grid');
  // header row
  let html = '<tr><th></th>' + state.options.map((o, i) =>
    `<th class="cellhdr"><input class="optname" data-o="${i}" value="${esc(o)}">${state.options.length > 2 ? `<button class="delcol" data-delopt="${i}" title="remove">✕</button>` : ''}</th>`
  ).join('') + '</tr>';
  // criteria rows
  state.criteria.forEach((cr, c) => {
    const stars = [1, 2, 3, 4, 5].map(n => `<span class="wstar ${n <= cr.weight ? 'on' : ''}" data-w="${c}-${n}">★</span>`).join('');
    html += `<tr><td class="critcell">
      <input class="critname" data-c="${c}" value="${esc(cr.name)}">
      <div class="wrow">${state.criteria.length > 1 ? `<button class="delrow" data-delcrit="${c}" title="remove">✕</button>` : ''}<span class="wstars">${stars}</span></div>
    </td>` + state.options.map((_, o) =>
      `<td><input class="scoreinp" type="number" min="0" max="10" step="1" data-s="${o}-${c}" value="${state.scores[o] && state.scores[o][c] != null ? state.scores[o][c] : ''}"></td>`
    ).join('') + '</tr>';
  });
  g.innerHTML = html;

  // wire (lightweight: update state + results, no grid re-render to keep focus)
  $$('.optname', g).forEach(el => el.addEventListener('input', () => { state.options[+el.dataset.o] = el.value; renderResults(); }));
  $$('.critname', g).forEach(el => el.addEventListener('input', () => { state.criteria[+el.dataset.c].name = el.value; renderResults(); }));
  $$('.scoreinp', g).forEach(el => el.addEventListener('input', () => {
    const [o, c] = el.dataset.s.split('-').map(Number);
    if (!state.scores[o]) state.scores[o] = [];
    state.scores[o][c] = el.value === '' ? 0 : Math.max(0, Math.min(10, parseFloat(el.value) || 0));
    renderResults();
  }));
  $$('.wstar', g).forEach(el => el.addEventListener('click', () => {
    const [c, n] = el.dataset.w.split('-').map(Number);
    state.criteria[c].weight = n;
    // update just this row's stars
    $$(`.wstar[data-w^="${c}-"]`, g).forEach(s => s.classList.toggle('on', (+s.dataset.w.split('-')[1]) <= n));
    renderResults();
  }));
  $$('[data-delopt]', g).forEach(el => el.addEventListener('click', () => { const i = +el.dataset.delopt; state.options.splice(i, 1); state.scores.splice(i, 1); renderGrid(); renderResults(); }));
  $$('[data-delcrit]', g).forEach(el => el.addEventListener('click', () => { const c = +el.dataset.delcrit; state.criteria.splice(c, 1); state.scores.forEach(r => r.splice(c, 1)); renderGrid(); renderResults(); }));
}

/* ===================== results render ===================== */
function renderResults() {
  const R = $('#results');
  const a = E.analyze(state);
  if (!a) { R.innerHTML = `<div class="bars" style="text-align:center;color:var(--dim)">${esc(t('need'))}</div>`; return; }

  const maxScore = Math.max(...a.results.map(r => r.score), 1);
  const close = a.closeCall;
  const verdict = `<div class="verdict ${close ? 'close' : ''}">
    <div class="em">${close ? '🤔' : '✅'}</div>
    <div>
      <div class="tag">${esc(close ? t('close_tag') : t('win_tag'))}</div>
      <div class="big">${esc(close ? t('close_big') : fill(t('win_big'), { name: a.winner.name }))}</div>
      <div class="sub">${close
        ? esc(fill(t('close_sub'), { a: a.winner.name, b: a.runnerUp.name, m: a.margin }))
        : fill(t('win_sub'), { ws: a.winner.score, rn: esc(a.runnerUp.name), rs: a.runnerUp.score, m: a.margin })}</div>
    </div>
  </div>`;

  const bars = `<div class="bars"><h3>${esc(t('kicker').split('·')[0].trim())}</h3>` + a.results.map((r, i) =>
    `<div class="brow"><span class="bn ${i === 0 && !close ? 'win' : ''}">${esc(r.name)}</span><div class="btrack"><div class="bfill ${i === 0 && !close ? 'win' : ''}" style="width:${r.score / maxScore * 100}%"></div></div><span class="bv">${r.score}</span></div>`
  ).join('') + '</div>';

  const reasons = `<div class="block"><h3>${esc(fill(t('why'), { name: a.winner.name }))}</h3>` +
    a.topReasons.map(rr => `<div class="reason"><span class="rc"></span><b>${esc(rr.criterion)}</b><span class="rv">+${rr.contribution}</span></div>`).join('') + '</div>';

  const tip = a.whatIf && a.whatIf.flips
    ? fill(t('tip_flip'), { crit: esc(a.whatIf.criterion), nw: esc(a.whatIf.newWinner) })
    : fill(t('tip_solid'), { name: esc(a.winner.name) });
  const tipping = `<div class="block"><h3>${esc(t('tip_tag'))}</h3><div class="tipping"><span class="ti">⚖️</span><div>${tip}</div></div></div>`;

  const toolbar = `<div class="toolbar"><button class="btn" id="copyRes">${esc(t('copy'))}</button></div>`;

  R.innerHTML = verdict + bars + `<div class="grid2">${reasons}${tipping}</div>` + toolbar;
  $('#copyRes').addEventListener('click', e => copyResult(e.target));
}

async function copyResult(btn) {
  const a = E.analyze(state); if (!a) return;
  try { await navigator.clipboard.writeText(E.toReport(a)); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = E.toReport(a); document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e2) {} ta.remove();
  }
  const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => btn.textContent = old, 1500);
}

/* ===================== presets ===================== */
function applyPreset(key) {
  const names = PRESET_NAMES[lang][key] || PRESET_NAMES.en[key];
  const data = PRESET_DATA[key];
  state = {
    options: names.options.slice(),
    criteria: names.criteria.map((n, i) => ({ name: n, weight: data.weights[i] })),
    scores: data.scores.map(r => r.slice())
  };
  renderGrid(); renderResults();
}

/* ===================== language ===================== */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  $$('[data-i]').forEach(el => {
    const k = el.dataset.i;
    if (k === 'h1') { const a = t('h1'); el.innerHTML = `${esc(a[0])}<em>${esc(a[1])}</em>${esc(a[2])}`; return; }
    const v = t(k);
    if (k === 'lede' || k === 'disc') el.innerHTML = v; else el.textContent = v;
  });
  $$('#presets .preset').forEach(b => b.textContent = t('pre_' + b.dataset.k));
  $$('.langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  try { localStorage.setItem('tb_lang', lang); } catch (e) {}
  renderResults();
}

/* ===================== init ===================== */
function init() {
  try {
    const saved = localStorage.getItem('tb_lang');
    lang = (saved && I18N[saved]) ? saved : 'en';  // English-first public face; zh/uk via switcher (persisted)
  } catch (e) {}

  $('#presets').innerHTML = Object.keys(PRESET_DATA).map(k => `<button class="preset" data-k="${k}">${esc(t('pre_' + k))}</button>`).join('');

  $$('.langs button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; applyLang(); }));
  $('#addOpt').addEventListener('click', () => {
    state.options.push(fill(t('opt_new'), { n: state.options.length + 1 }));
    state.scores.push(state.criteria.map(() => 0));
    renderGrid(); renderResults();
  });
  $('#addCrit').addEventListener('click', () => {
    state.criteria.push({ name: fill(t('crit_new'), { n: state.criteria.length + 1 }), weight: 3 });
    state.scores.forEach(r => r.push(0));
    renderGrid(); renderResults();
  });
  $$('#presets .preset').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.k)));

  applyPreset('job'); // populated example on load
  applyLang();
}
init();
