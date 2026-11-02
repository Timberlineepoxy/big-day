// Big Day: screens, countdown maths, sounds and saving.
(() => {
const { HOLIDAYS, TEMPLATES, TEMPLATE_CATS } = window.BD_DATA;
const { ICONS, THEMES, startScene, PICK_ICONS } = window.BD_ART;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DAY = 864e5;

// ---- saved settings (this phone only) ----
const KEY = 'bigday.v1';
// stickers: { 'YYYY-MM-DD': icon } for each day the surprise door was opened. did: the day's challenge was done.
const DEFAULTS = { customs: [], featured: 'christmas', hidden: [], badge: false, sound: true, music: true, word: 'days', filter: 'all', look: 'auto', name: '', stickers: {}, did: '' };
let S = load();
function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEFAULTS }; }
}
// False when the phone is out of room (a big photo can do that).
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch { return false; } }

// ---- dates ----
const startOf = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today0 = () => startOf(new Date());
const daysBetween = (a, b) => Math.round((startOf(b) - startOf(a)) / DAY);
const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
// Month/day in a given year; a February 29 birthday lands on the 28th in other years.
const onYear = (m, d, y) => new Date(y, m, m === 1 && d === 29 && !isLeap(y) ? 28 : d);
const fmtDate = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const fmtShort = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const num = n => n.toLocaleString('en-US');
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// The app's own day count, for picking each day's surprise and sticker.
const dayNo = d => daysBetween(new Date(2026, 0, 1), d);
const possessive = n => n + (/s$/i.test(n) ? "'" : "'s");

// One shape for holidays and home-made countdowns.
function eventFor(src, custom) {
  const t0 = today0();
  let next, prev, past = false, at = null;
  if (!custom) {
    // Most come every year; elections every 2 or 4 (src.every), in years where year % every === src.from.
    const step = src.every || 1, fit = y => y + (((src.from || 0) - y) % step + step) % step;
    next = src.date(fit(t0.getFullYear()));
    if (next < t0) next = src.date(fit(t0.getFullYear() + 1));
    prev = src.date(next.getFullYear() - step);
  } else {
    const [y, m, d] = src.date.split('-').map(Number);
    if (src.yearly) {
      next = onYear(m - 1, d, t0.getFullYear());
      if (next < t0) next = onYear(m - 1, d, t0.getFullYear() + 1);
      prev = onYear(m - 1, d, next.getFullYear() - 1);
    } else {
      next = new Date(y, m - 1, d);
      prev = new Date(src.made || Date.now() - 30 * DAY);
      past = next < t0;
    }
    if (src.time) { const [hh, mm] = src.time.split(':').map(Number); at = [hh, mm]; }
  }
  const target = at ? new Date(next.getFullYear(), next.getMonth(), next.getDate(), at[0], at[1]) : next;
  const days = daysBetween(t0, next);
  const age = custom && src.birthday && src.birthYear ? next.getFullYear() - Number(src.birthYear) : null;
  return { ...src, custom, next, prev, target, days, past, age, today: days === 0, tags: custom ? ['mine'] : src.tags, tone: src.tone || 'party' };
}
function allEvents() {
  const hs = HOLIDAYS.filter(h => !S.hidden.includes(h.id)).map(h => eventFor(h, false));
  const cs = S.customs.map(c => eventFor(c, true));
  return [...hs, ...cs].sort((a, b) => (a.past - b.past) || (a.past ? b.next - a.next : a.target - b.target));
}
function findEvent(id) {
  const h = HOLIDAYS.find(x => x.id === id); if (h) return eventFor(h, false);
  const c = S.customs.find(x => x.id === id); return c ? eventFor(c, true) : null;
}
function featured() {
  return findEvent(S.featured) || findEvent('christmas');
}
// Time left, split into days / hours / minutes / seconds.
function parts(e) {
  const ms = Math.max(0, e.target - Date.now());
  return { ms, d: Math.floor(ms / DAY), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
}
const celebrating = e => e.today && e.target - Date.now() <= 0;
const word = n => S.word === 'sleeps' ? (n === 1 ? 'sleep' : 'sleeps') : (n === 1 ? 'day' : 'days');

const GREET = {
  christmas: 'Merry Christmas!', 'christmas-eve': 'Merry Christmas Eve!', easter: 'He is risen!', 'new-years': 'Happy New Year!',
  'new-years-eve': "Happy New Year's Eve!", thanksgiving: 'Happy Thanksgiving!', july4: 'Happy 4th of July!', halloween: 'Happy Halloween!',
  'april-fools': 'April Fools!', 'palm-sunday': 'Hosanna!', pentecost: 'Happy Pentecost!', epiphany: 'Happy Epiphany!',
};
function greeting(e) {
  if (e.custom) return e.birthday ? 'Happy Birthday!' : "It's here!";
  if (GREET[e.id]) return GREET[e.id];
  return e.tone === 'calm' ? `Today is ${e.name}` : `Happy ${e.name}!`;
}

// ---- tap sounds: tiny synthesizer, no audio files ----
let AC = null;
function ac() {
  if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(f, t, dur, vol = 0.16, type = 'triangle') {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = f; o.connect(g); g.connect(a.destination);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + 0.05);
  return o;
}
function pop() {
  if (!S.sound) return; const a = ac(); if (!a) return;
  const t = a.currentTime, base = 520 + Math.random() * 300;
  tone(base, t, 0.16, 0.14, 'sine'); tone(base * 1.5, t + 0.06, 0.2, 0.1, 'sine'); tone(base * 2, t + 0.12, 0.25, 0.07, 'sine');
}
// ---- holiday music: real recordings in music/ (see music.js) ----
// One <audio> for the whole app: once a tap has started it, iPhones let it keep changing songs.
const { TRACKS, playlistFor } = window.BD_MUSIC;
const player = new Audio();
player.preload = 'auto';
let mus = { id: null, list: [], i: 0, blocked: false };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nowTrack = () => TRACKS[mus.list[mus.i]];
// Start this holiday's playlist, unless it is already the one playing.
function musicFor(e, anyway) {
  if (e && e.music === false) { stopMusic(); return; }
  if (!e || (!S.music && !anyway)) return;
  if (mus.id === e.id && !player.paused) return;
  if (mus.id !== e.id) { const [first, ...rest] = playlistFor(e); mus = { id: e.id, list: [first, ...shuffle(rest)], i: 0, blocked: false }; playTrack(); }
  else player.play().catch(() => {});
}
function playTrack() {
  player.src = `music/${mus.list[mus.i]}.mp3`;
  const p = player.play();
  if (p) p.catch(() => { mus.blocked = true; musicButton(); });
  musicButton();
}
function nextTrack() { if (!mus.list.length) return; mus.i = (mus.i + 1) % mus.list.length; playTrack(); }
function stopMusic() { player.pause(); mus.id = null; }
player.addEventListener('ended', nextTrack);
player.addEventListener('playing', () => { mus.blocked = false; musicButton(); });
player.addEventListener('pause', musicButton);
// The music button on a holiday page shows the song that is playing.
function musicButton() {
  const b = $('#mus'); if (!b) return;
  const on = !player.paused && !mus.blocked, t = nowTrack();
  b.innerHTML = on && t ? `${I.pause}<span>${esc(t.t)}</span>` : `${I.note}<span>Play music</span>`;
  b.classList.toggle('playing', on);
  const n = $('#nxt'); if (n) n.hidden = !on;
  const c = $('#by'); if (c) c.textContent = on && t ? `Played by the ${t.by}` : '';
}

// ---- drawing helpers ----
const STAR_D = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z';
const I = {
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  star: `<svg viewBox="0 0 24 24"><path d="${STAR_D}"/></svg>`,
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
  next: '<svg viewBox="0 0 24 24"><path d="M5 5l9 7-9 7zM18 5v14"/></svg>',
  pencil: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};
const grad = t => { const th = THEMES[t] || THEMES.party; return `linear-gradient(150deg,${th.bg[0]},${th.bg[1]})`; };
const icon = id => ICONS[id] || ICONS.star;
// The small square picture on a row: your photo if the countdown has one, otherwise its drawing.
const icBox = e => e.photo ? `<div class="ic ph" style="background-image:url('${esc(e.photo)}')"></div>`
  : `<div class="ic" style="background:${grad(e.theme)}">${icon(e.icon)}</div>`;
// The big picture on the home screen and a countdown's page.
const bigArt = (e, id) => e.photo ? `<div class="art ph"${id ? ` id="${id}"` : ''} style="background-image:url('${esc(e.photo)}')"><span class="badge">${icon(e.icon)}</span></div>`
  : `<div class="art"${id ? ` id="${id}"` : ''}>${icon(e.icon)}</div>`;

let scene = null, timer = 0, autoBurst = 0, shownDay = today0().getTime();
function applyTheme(themeId) {
  const th = THEMES[themeId] || THEMES.party, r = document.documentElement.style;
  r.setProperty('--a', th.bg[0]); r.setProperty('--b', th.bg[1]); r.setProperty('--accent', th.accent);
  document.querySelector('meta[name=theme-color]').content = th.bg[1];
  if (scene) scene.stop();
  scene = startScene($('#fx'), themeId);
}
function applyLook() {
  if (S.look === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = S.look;
}

// ---- screens ----
function route() {
  clearInterval(autoBurst);
  const m = location.hash.match(/^#day=(.+)$/);
  const e = m && findEvent(decodeURIComponent(m[1]));
  if (e) showDetail(e); else { stopMusic(); showHome(); }
  window.scrollTo(0, 0);
}

function clockHTML(p, cls) {
  return `<div class="${cls}">${[['d', 'Days'], ['h', 'Hours'], ['m', 'Min'], ['s', 'Sec']].map(([k, l]) =>
    `<div class="u"><div class="n" data-k="${k}">${k === 'd' ? num(p[k]) : String(p[k]).padStart(2, '0')}</div><div class="l">${l}</div></div>`).join('')}</div>`;
}

function showHome() {
  const f = featured();
  applyTheme(f.theme);
  const evs = allEvents();
  const filt = S.filter;
  const shown = filt === 'all' ? evs : evs.filter(e => e.tags.includes(filt));
  const chips = [['all', 'All'], ['christian', 'Christian'], ['american', 'American'], ['family', 'Family Fun'], ['fun', 'Fun Days'], ['vote', 'Voting'], ['mine', 'My Countdowns']];
  let lastMonth = '';
  const rows = shown.map(e => {
    const mo = e.past ? 'Already happened' : e.next.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const head = mo !== lastMonth ? `<div class="month">${mo}</div>` : ''; lastMonth = mo;
    const sub = e.age ? `${fmtShort(e.next)} · turning ${e.age}` : fmtShort(e.next);
    const right = e.today ? '<span class="today">TODAY!</span>'
      : e.past ? `<div class="ct"><b>${num(-e.days)}</b><span>${-e.days === 1 ? 'day ago' : 'days ago'}</span></div>`
        : `<div class="ct"><b>${num(e.days)}</b><span>${word(e.days)}</span></div>`;
    return `${head}<button class="row" data-go="${esc(e.id)}">${icBox(e)}
      <div class="tx"><div class="t">${esc(e.name)}</div><div class="d">${sub}</div></div>
      ${S.featured === e.id ? `<svg class="pin" viewBox="0 0 24 24"><path d="${STAR_D}"/></svg>` : ''}${right}</button>`;
  }).join('');
  const p = parts(f);
  const heroBody = celebrating(f)
    ? `<div class="yay">${esc(greeting(f))}</div><div class="when">${esc(f.name)} is today!</div>`
    : `<div class="big" data-k="big">${f.today ? 'Today!' : num(f.days)}</div>
       <div class="unit">${f.today ? 'It\'s the big day!' : `${word(f.days)} until ${esc(f.name)}`}</div>${clockHTML(p, 'clock')}`;
  $('#app').innerHTML = `
    <div class="bar"><div class="logo"><span class="mk">${ICONS.gift}</span>Big Day</div><div class="sp"></div>
      <button class="round" id="set" aria-label="Settings">${I.gear}</button></div>
    ${todayBanner(evs)}
    <button class="hero" data-go="${esc(f.id)}">
      <span class="tag">${S.name ? esc(possessive(S.name)) + ' big day' : f.custom ? 'My big day' : 'Big day'}</span>
      ${bigArt(f)}
      <div class="nm">${esc(f.name)}</div>${heroBody}
      <div class="when">${fmtDate(f.next)}</div>
    </button>
    <div id="doorw">${doorHTML()}</div>
    <div class="chips">${chips.map(([k, l]) => `<button class="chip${filt === k ? ' on' : ''}" data-f="${k}">${l}</button>`).join('')}</div>
    <div class="list">${rows || `<div class="empty">${filt === 'mine' ? 'No countdowns of your own yet. Make one for a birthday, a trip, anything!' : 'Nothing here. Turn some holidays back on in Settings.'}</div>`}</div>
    <button class="make" id="make">${I.plus}Make my own countdown</button>`;
  $('#app').onclick = ev => {
    const go = ev.target.closest('[data-go]'), fb = ev.target.closest('[data-f]');
    if (ev.target.closest('#door')) openDoor(ev);
    else if (ev.target.closest('#ans')) { pop(); $('#ans').hidden = true; $('#ansT').hidden = false; }
    else if (ev.target.closest('#did') && S.did !== dayKey(today0())) {
      S.did = dayKey(today0()); save(); pop(); scene.burst(ev.clientX, ev.clientY, 50); toast('Way to go!'); $('#doorw').innerHTML = doorHTML();
    }
    else if (ev.target.closest('#book')) openStickers();
    else if (go) { pop(); musicFor(findEvent(go.dataset.go)); location.hash = 'day=' + encodeURIComponent(go.dataset.go); }
    else if (fb) { S.filter = fb.dataset.f; save(); showHome(); }
    else if (ev.target.closest('#make')) openEditor(null);
    else if (ev.target.closest('#set')) openSettings();
  };
  startTick();
}

// "Today is National Sandwich Day!" across the top of the home screen; tomorrow's days when nothing is on today.
function todayBanner(evs) {
  let lead = 'Today is', list = evs.filter(e => e.today);
  if (!list.length) { lead = 'Tomorrow is'; list = evs.filter(e => !e.past && e.days === 1); }
  if (!list.length) return '';
  const n = list.map(e => e.name);
  const txt = n.length === 1 ? n[0] : n.length === 2 ? `${n[0]} and ${n[1]}` : `${n[0]}, ${n[1]} and ${n.length - 2} more`;
  return `<button class="todaybn" data-go="${esc(list[0].id)}">${icBox(list[0])}<div class="tx"><small>${lead}</small><b>${esc(txt)}!</b></div>${I.back}</button>`;
}

// ---- the surprise door: one a day, and a sticker for opening it ----
const { surpriseFor } = window.BD_SURPRISE;
const DOOR_LABEL = { joke: 'Joke of the day', challenge: 'Today\'s challenge', fact: 'Did you know?', verse: 'Verse of the day' };
function hello() {
  const h = new Date().getHours(), part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return S.name ? `${part}, ${esc(S.name)}!` : `${part}!`;
}
// Today's sticker: the picture of a holiday that is on today, otherwise one of the drawings, taking turns.
function stickerFor(d) {
  const on = HOLIDAYS.find(h => !S.hidden.includes(h.id) && eventFor(h, false).today);
  return on ? on.icon : PICK_ICONS[((dayNo(d) * 7) % PICK_ICONS.length + PICK_ICONS.length) % PICK_ICONS.length];
}
// Days in a row with a sticker, counting back from today (or from yesterday, if today's door is still shut).
function streak() {
  let d = today0(), n = 0;
  if (!S.stickers[dayKey(d)]) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  while (S.stickers[dayKey(d)]) { n++; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1); }
  return n;
}
function doorHTML() {
  const t = today0(), k = dayKey(t);
  if (!S.stickers[k]) return `<button class="doorc" id="door" aria-label="Open today's surprise door">
      <div class="door"><div class="dp"><b>${t.getDate()}</b><i></i></div></div>
      <div class="dtx"><small>${hello()}</small><b>Today's surprise door</b><span>Tap to open it!</span></div></button>`;
  const s = surpriseFor(dayNo(t)), n = streak();
  const extra = s.type === 'joke' ? `<button class="mini" id="ans">Show the answer</button><p class="ansT" id="ansT" hidden>${esc(s.answer)}</p>`
    : s.type === 'verse' ? `<cite>${esc(s.ref)} (King James Version)</cite>`
      : s.type === 'challenge' ? `<button class="mini${S.did === k ? ' done' : ''}" id="did">${S.did === k ? 'Done! Great job!' : 'I did it!'}</button>` : '';
  return `<div class="doorc open"><div class="dbody ${s.type}"><h3>${DOOR_LABEL[s.type]}</h3><p>${esc(s.text)}</p>${extra}</div>
    <div class="stk"><div class="sk">${icon(S.stickers[k])}</div><div class="tx"><b>Today's sticker is yours!</b><span>${n} ${n === 1 ? 'day' : 'days'} in a row</span></div>
      <button class="mini" id="book">Sticker book</button></div></div>`;
}
function openDoor(ev) {
  const t = today0(), k = dayKey(t), dr = $('#door .door');
  if (S.stickers[k] || !dr || dr.classList.contains('opening')) return;
  pop(); dr.classList.add('opening');
  const r = dr.getBoundingClientRect();
  setTimeout(() => {
    S.stickers[k] = stickerFor(t); save();
    $('#doorw').innerHTML = doorHTML();
    scene.burst(r.left + r.width / 2, r.top + r.height / 2, 60);
    toast('You got a new sticker!');
  }, 550);
}
function openStickers() {
  const keys = Object.keys(S.stickers).sort().reverse();
  let best = 0, run = 0, prev = null;
  for (const k of [...keys].reverse()) {
    const [y, m, d] = k.split('-').map(Number), day = new Date(y, m - 1, d);
    run = prev && daysBetween(prev, day) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = day;
  }
  const n = streak();
  sheet(`<h2>Sticker book</h2>
    <div class="note">Open the surprise door every day to get a new sticker. On a holiday, you get that holiday's sticker!</div>
    <div class="stats"><div><b>${keys.length}</b><span>${keys.length === 1 ? 'sticker' : 'stickers'}</span></div><div><b>${n}</b><span>${n === 1 ? 'day' : 'days'} in a row</span></div><div><b>${best}</b><span>best streak</span></div></div>
    ${keys.length ? `<div class="book">${keys.map(k => { const [y, m, d] = k.split('-').map(Number);
      return `<div class="st">${icon(S.stickers[k])}<span>${new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>`; }).join('')}</div>`
      : '<div class="note">No stickers yet. Open today\'s door!</div>'}
    <button class="btn ghost" id="done">Done</button>`, (el, close) => { el.querySelector('#done').onclick = close; });
}

// Fun ways to count: Earth circles the Sun at about 66,600 miles an hour (29.8 km a second).
const EARTH_MPMS = 66600 / 36e5;
// Weeks with one decimal while small ("7.7"), whole numbers after that.
const weeks = d => d / 7 >= 10 ? num(Math.round(d / 7)) : String(Math.round(d / 7 * 10) / 10);
const CHAIN_MAX = 100, CHAIN_COLORS = ['#ff3b4e', '#ffc531', '#2fd38a', '#3ba7ff', '#8a3ff0', '#ff8a1f', '#ff4fa3'];

function showDetail(e) {
  // "Make it my big day" redraws this page without going through route(), so stop the old confetti here too.
  clearInterval(autoBurst);
  applyTheme(e.theme);
  const party = celebrating(e), p = parts(e), feat = S.featured === e.id;
  const prog = Math.max(0, Math.min(1, (Date.now() - e.prev) / (e.target - e.prev)));
  let weekends = 0;
  for (let d = new Date(today0().getTime() + DAY); d < e.next; d = new Date(d.getTime() + DAY)) if (d.getDay() === 6) weekends++;
  const top = party
    ? `<div class="greet">${esc(greeting(e))}</div><div class="when">${e.age ? `Turning ${e.age} today!` : esc(e.name) + ' is today!'}</div>`
    : e.past ? `<div class="greet" style="animation:none">${num(-e.days)} ${-e.days === 1 ? 'day' : 'days'} ago</div>`
      : clockHTML(p, 'flip') + `<div class="hint">${e.today ? 'Today! Almost time...' : `${num(e.days)} ${e.days === 1 ? 'sleep' : 'sleeps'} to go!`} Tap the picture for a surprise.</div>`;
  const fun = e.past || party ? '' : `<div class="card"><h3>Fun ways to count</h3><div class="fun">
      <div><b>${num(e.days)}</b><span>${e.days === 1 ? 'sleep' : 'sleeps'}</span></div>
      <div><b>${weeks(e.days)}</b><span>${e.days === 7 ? 'week' : 'weeks'}</span></div>
      <div><b>${num(weekends)}</b><span>${weekends === 1 ? 'weekend' : 'weekends'}</span></div>
      <div><b>${num(e.days * 3)}</b><span>meals (about)</span></div>
      <div><b data-k="hrs">${num(Math.floor(p.ms / 36e5))}</b><span>hours</span></div>
      <div><b data-k="mins">${num(Math.floor(p.ms / 6e4))}</b><span>minutes</span></div>
      <div><b data-k="beats">${num(Math.round(p.ms / 6e4 * 80))}</b><span>heartbeats (about)</span></div>
      <div><b data-k="miles">${num(Math.round(p.ms * EARTH_MPMS))}</b><span>miles Earth zooms around the Sun</span></div></div>
      <h3 style="margin-top:14px">The wait is ${Math.round(prog * 100)}% over</h3><div class="prog"><i style="width:${(prog * 100).toFixed(1)}%"></i></div>
      <div class="small">Counting from ${e.custom && !e.yearly ? 'the day you made it' : 'last time'}: ${fmtShort(e.prev)}</div></div>`;
  // A paper chain like the ones made at school: one link for every day left, and one comes off each day.
  const links = Math.min(e.days, CHAIN_MAX);
  const chain = e.past || party || e.days < 1 ? '' : `<div class="card"><h3>Paper chain</h3>
      <button class="chain" id="chain" aria-label="Paper chain">${Array.from({ length: links }, (_, i) => `<i style="--c:${CHAIN_COLORS[i % CHAIN_COLORS.length]}"></i>`).join('')}</button>
      <div class="small">${e.days > CHAIN_MAX ? `Here are the last ${CHAIN_MAX} links of ${num(e.days)}.` : `${num(links)} ${links === 1 ? 'link' : 'links'} left.`} One link comes off every day. Tap the chain to try!</div></div>`;
  $('#app').innerHTML = `
    <div class="bar"><button class="round" id="back" aria-label="Back">${I.back}</button><div class="sp"></div>
      <button class="round" id="share" aria-label="Share">${I.share}</button></div>
    <div class="detail">
      <button class="tap" id="tap" aria-label="Tap for a surprise">${bigArt(e, 'art')}</button>
      <h1>${esc(e.name)}</h1><div class="when">${fmtDate(e.target)}${e.time ? ' at ' + e.target.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}${e.age && !party ? ` · turning ${e.age}!` : ''}</div>
      ${top}
      <div class="acts">
        <button class="pill gold${feat ? ' on' : ''}" id="feat">${I.star}${feat ? 'My big day' : 'Make it my big day'}</button>
        ${e.custom ? `<button class="pill" id="edit">${I.pencil}Change</button>` : ''}
      </div>
      ${e.music === false ? '' : `<div class="acts music"><button class="pill" id="mus"></button><button class="pill" id="nxt" aria-label="Next song" hidden>${I.next}</button></div>
      <div class="by" id="by"></div>`}
      <div class="cards">
        ${fun}
        ${chain}
        ${e.about ? `<div class="card"><h3>What is ${esc(e.name)}?</h3><p>${esc(e.about)}</p></div>` : ''}
        ${e.verse ? `<div class="card verse"><h3>From the Bible</h3><p>"${esc(e.verse[0])}"</p><cite>${esc(e.verse[1])} (King James Version)</cite></div>` : ''}
        ${e.fact ? `<div class="card"><h3>Did you know?</h3><p>${esc(e.fact)}</p></div>` : ''}
      </div>
    </div>`;
  $('#back').onclick = () => { pop(); if (history.length > 1) history.back(); else location.hash = ''; };
  $('#tap').onclick = ev => {
    pop(); scene.burst(ev.clientX, ev.clientY, 40);
    const a = $('#art'); a.classList.remove('wiggle'); void a.offsetWidth; a.classList.add('wiggle');
  };
  $('#feat').onclick = () => { S.featured = e.id; save(); pop(); updateBadge(); toast(`${e.name} is your big day now!`); showDetail(findEvent(e.id)); };
  $('#share').onclick = () => share(e);
  // Tapping the chain pulls off the next link; it hangs back on, because that day hasn't come yet.
  if ($('#chain')) $('#chain').onclick = ev => {
    const l = $('#chain i:last-child'); if (!l || l.classList.contains('off')) return;
    pop(); l.classList.add('off'); scene.burst(ev.clientX, ev.clientY, 18);
    setTimeout(() => l.classList.remove('off'), 1400);
  };
  if ($('#edit')) $('#edit').onclick = () => openEditor(S.customs.find(c => c.id === e.id));
  // Pausing here only stops this holiday; the next one plays again. Settings has the always-off switch.
  if ($('#mus')) $('#mus').onclick = () => {
    if (!player.paused) { player.pause(); return; }
    mus.blocked = false;
    if (mus.id === e.id) player.play().catch(() => {}); else musicFor(e, true);
  };
  if ($('#nxt')) $('#nxt').onclick = nextTrack;
  musicFor(e); musicButton();
  if (party) {
    // Bound to this page's scene, so a timer that outlives the page can't throw confetti on the next one.
    const sc = scene, boom = () => sc.burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.5, 45);
    setTimeout(boom, 300); setTimeout(boom, 800);
    if (e.tone === 'party') autoBurst = setInterval(boom, 1600);
  }
  startTick(e.id);
}

// Update the numbers every second without rebuilding the screen.
function startTick(detailId) {
  clearInterval(timer);
  const set = (k, v) => { for (const el of document.querySelectorAll(`[data-k="${k}"]`)) if (el.textContent !== v) { el.textContent = v; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); } };
  timer = setInterval(() => {
    if (today0().getTime() !== shownDay) { shownDay = today0().getTime(); updateBadge(); route(); return; }
    const e = detailId ? findEvent(detailId) : featured(); if (!e) return;
    if (e.today && e.target - Date.now() <= 0 && document.querySelector('[data-k="s"]')) { route(); return; }
    const p = parts(e);
    set('d', num(p.d)); set('h', String(p.h).padStart(2, '0')); set('m', String(p.m).padStart(2, '0')); set('s', String(p.s).padStart(2, '0'));
    const hrs = document.querySelector('[data-k="hrs"]'); if (hrs) hrs.textContent = num(Math.floor(p.ms / 36e5));
    const beats = document.querySelector('[data-k="beats"]'); if (beats) beats.textContent = num(Math.round(p.ms / 6e4 * 80));
    const mins = document.querySelector('[data-k="mins"]'); if (mins) mins.textContent = num(Math.floor(p.ms / 6e4));
    const miles = document.querySelector('[data-k="miles"]'); if (miles) miles.textContent = num(Math.round(p.ms * EARTH_MPMS));
  }, 1000);
}

// Shown at the bottom of Settings, so you can tell which copy a phone is running.
// Each release bumps it together with version.json, SHELL in sw.js and the ?v= on the scripts in index.html.
const VERSION = 10;

// ---- sheets ----
// While a sheet is open the page behind it is pinned in place (the only lock iPhones respect).
let locks = 0, lockY = 0;
function lockPage(on) {
  const b = document.body.style;
  if (on && locks++ === 0) { lockY = scrollY; Object.assign(b, { position: 'fixed', top: `-${lockY}px`, left: '0', right: '0' }); }
  if (!on && locks > 0 && --locks === 0) { Object.assign(b, { position: '', top: '', left: '', right: '' }); scrollTo(0, lockY); }
}
function sheet(html, mount) {
  const bg = document.createElement('div'); bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div><button class="x" aria-label="Close">${I.close}</button>${html}</div>`;
  document.body.appendChild(bg);
  lockPage(true);
  const sh = bg.querySelector('.sheet');
  let gone = false;
  const close = () => {
    if (gone) return; gone = true;
    sh.style.transition = 'transform .22s ease-in'; sh.style.transform = 'translateY(100%)';
    bg.classList.add('closing'); setTimeout(() => { bg.remove(); lockPage(false); }, 220);
  };
  bg.addEventListener('click', ev => { if (ev.target === bg || ev.target.closest('.x')) close(); });
  // Slide a finger down to put the sheet away. iPhones decide on the FIRST finger movement whether
  // something scrolls, so the decision is made right there: a downward swipe on the grab bar, or
  // anywhere while the sheet is scrolled to the top, moves the sheet; anything else scrolls it.
  let y0 = null, dy = 0, t0 = 0, drag = false, decided = false, onBar = false;
  sh.addEventListener('touchstart', ev => {
    y0 = ev.touches[0].clientY; dy = 0; drag = false; decided = false; t0 = Date.now();
    onBar = y0 - sh.getBoundingClientRect().top < 56;
  }, { passive: true });
  sh.addEventListener('touchmove', ev => {
    if (y0 === null) return;
    dy = ev.touches[0].clientY - y0;
    if (!decided) {
      if (dy === 0) return; // sideways wobble: wait for the finger to pick a direction
      decided = true; drag = onBar || (dy > 0 && sh.scrollTop <= 0);
    }
    if (!drag) return;
    ev.preventDefault();
    sh.style.transition = 'none'; sh.style.transform = `translateY(${Math.max(0, dy)}px)`;
  }, { passive: false });
  sh.addEventListener('touchend', () => {
    if (drag) {
      const fast = dy / Math.max(1, Date.now() - t0) > 0.5;
      if (dy > 110 || (fast && dy > 30)) close();
      else { sh.style.transition = 'transform .2s ease-out'; sh.style.transform = ''; }
    }
    y0 = null; drag = false;
  });
  // The dark area around the sheet never scrolls the page behind it.
  bg.addEventListener('touchmove', ev => { if (!sh.contains(ev.target)) ev.preventDefault(); }, { passive: false });
  mount(sh, close);
  return close;
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

// Make a phone photo small enough to keep (800 pixels on the long side, as a JPEG).
async function shrinkPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const k = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.72);
  } finally { URL.revokeObjectURL(url); }
}
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

// Quick start buttons for one category.
const temps = cat => TEMPLATES.map((t, i) => t.cat === cat ? `<button class="temp" data-t="${i}">${icon(t.icon)}${esc(t.name)}</button>` : '').join('');

function openEditor(existing) {
  const isNew = !existing;
  const d = existing ? { ...existing } : { name: '', date: '', time: '', icon: 'cake', theme: 'party', yearly: false, birthday: false, birthYear: '' };
  sheet(`<h2>${isNew ? 'Make a countdown' : 'Change countdown'}</h2>
    ${isNew ? `<label class="f">Quick start</label>
      <div class="tcats">${TEMPLATE_CATS.map(([k, l], i) => `<button data-c="${k}" class="${i ? '' : 'on'}">${l}</button>`).join('')}</div>
      <div class="temps" id="tps">${temps(TEMPLATE_CATS[0][0])}</div>` : ''}
    <label class="f" for="nm">What are we counting down to?</label><input type="text" id="nm" maxlength="40" placeholder="Grandma's visit" value="${esc(d.name)}">
    <div class="two"><div><label class="f" for="dt">Date</label><input type="date" id="dt" value="${esc(d.date)}"></div>
      <div><label class="f" for="tm">Time (if you want)</label><input type="time" id="tm" value="${esc(d.time || '')}"></div></div>
    <div class="sw"><div class="tx">Every year<small>Birthdays, anniversaries: it starts over after the day.</small></div><button class="tog${d.yearly ? ' on' : ''}" id="yr" aria-label="Every year"></button></div>
    <div class="sw"><div class="tx">It's a birthday<small>Shows how old they are turning.</small></div><button class="tog${d.birthday ? ' on' : ''}" id="bd" aria-label="It's a birthday"></button></div>
    <div id="byw" ${d.birthday ? '' : 'hidden'}><label class="f" for="by">Year they were born</label><input type="number" id="by" inputmode="numeric" min="1900" max="2100" placeholder="2018" value="${esc(d.birthYear || '')}"></div>
    <label class="f">Picture</label><div class="icons" id="ics">${PICK_ICONS.map(k => `<button data-i="${k}" class="${d.icon === k ? 'on' : ''}" aria-label="${k}">${icon(k)}</button>`).join('')}</div>
    <label class="f">Colors</label><div class="themes" id="ths">${Object.entries(THEMES).map(([k, t]) => `<button data-th="${k}" class="${d.theme === k ? 'on' : ''}" style="background:${grad(k)}" aria-label="${t.name}"></button>`).join('')}</div>
    <label class="f">Your own photo (if you want)</label>
    <div class="phrow"><div class="phprev" id="php"></div><div class="phbtns"><button class="mini" id="pha">Add a photo</button><button class="mini" id="phx">Take it off</button></div>
      <input type="file" id="phf" accept="image/*" hidden></div>
    <div class="small">The photo stays on this phone only.</div>
    <button class="btn" id="ok">${isNew ? 'Start the countdown!' : 'Save'}</button>
    ${isNew ? '' : '<button class="btn red" id="del">Delete this countdown</button>'}
    <button class="btn ghost" id="cancel">Cancel</button>`, (el, close) => {
    const q = s => el.querySelector(s);
    const mark = (sel, attr, val) => el.querySelectorAll(sel).forEach(b => b.classList.toggle('on', b.dataset[attr] === val));
    el.addEventListener('click', ev => {
      const t = ev.target.closest('[data-t]'), ic = ev.target.closest('[data-i]'), th = ev.target.closest('[data-th]'), c = ev.target.closest('[data-c]');
      if (c) { mark('[data-c]', 'c', c.dataset.c); q('#tps').innerHTML = temps(c.dataset.c); q('#tps').scrollLeft = 0; pop(); }
      if (t) {
        const tp = TEMPLATES[t.dataset.t]; Object.assign(d, { icon: tp.icon, theme: tp.theme, yearly: tp.yearly, birthday: !!tp.birthday });
        q('#nm').value = tp.name; mark('[data-i]', 'i', d.icon); mark('[data-th]', 'th', d.theme);
        q('#yr').classList.toggle('on', d.yearly); q('#bd').classList.toggle('on', d.birthday); q('#byw').hidden = !d.birthday; pop();
      }
      if (ic) { d.icon = ic.dataset.i; mark('[data-i]', 'i', d.icon); pop(); }
      if (th) { d.theme = th.dataset.th; mark('[data-th]', 'th', d.theme); pop(); }
    });
    q('#yr').onclick = () => { d.yearly = !d.yearly; q('#yr').classList.toggle('on', d.yearly); };
    q('#bd').onclick = () => { d.birthday = !d.birthday; q('#bd').classList.toggle('on', d.birthday); q('#byw').hidden = !d.birthday; if (d.birthday && !d.yearly) { d.yearly = true; q('#yr').classList.add('on'); } };
    const showPhoto = () => {
      q('#php').style.backgroundImage = d.photo ? `url('${d.photo}')` : '';
      q('#php').innerHTML = d.photo ? '' : icon(d.icon);
      q('#pha').textContent = d.photo ? 'Pick another' : 'Add a photo'; q('#phx').hidden = !d.photo;
    };
    showPhoto();
    el.addEventListener('click', ev => { if (ev.target.closest('[data-i],[data-t]')) showPhoto(); });
    q('#pha').onclick = () => q('#phf').click();
    q('#phx').onclick = () => { d.photo = ''; showPhoto(); pop(); };
    q('#phf').onchange = async () => {
      const f = q('#phf').files[0]; q('#phf').value = ''; if (!f) return;
      try { d.photo = await shrinkPhoto(f); showPhoto(); pop(); } catch { toast('That photo would not open. Try another one.'); }
    };
    q('#cancel').onclick = close;
    q('#ok').onclick = () => {
      d.name = q('#nm').value.trim(); d.date = q('#dt').value; d.time = q('#tm').value; d.birthYear = q('#by').value;
      if (!d.name) { toast('Give it a name first'); q('#nm').focus(); return; }
      if (!d.date) { toast('Pick the date'); q('#dt').focus(); return; }
      if (!d.birthday) d.birthYear = '';
      if (isNew) { d.id = 'c' + Date.now().toString(36); d.made = Date.now(); S.customs.push(d); }
      else S.customs[S.customs.findIndex(c => c.id === d.id)] = d;
      if (!save()) {
        if (!d.photo) { if (isNew) S.customs.pop(); toast('The phone is out of room. Delete an old countdown first.'); return; }
        d.photo = ''; save(); toast('That photo was too big to keep, so it was left off.');
      } else toast(isNew ? 'Countdown started!' : 'Saved');
      close(); pop();
      if (isNew) location.hash = 'day=' + d.id; else route();
    };
    if (q('#del')) q('#del').onclick = () => {
      const b = q('#del');
      if (b.dataset.sure) {
        S.customs = S.customs.filter(c => c.id !== d.id); if (S.featured === d.id) S.featured = 'christmas';
        save(); updateBadge(); close(); toast('Deleted'); location.hash = '';
      } else { b.dataset.sure = 1; b.textContent = 'Tap again to delete for good'; }
    };
  });
}

function openSettings() {
  const groups = [['christian', 'Christian holidays'], ['american', 'American holidays'], ['family', 'Family fun days'], ['fun', 'Fun days'], ['vote', 'Voting days']];
  const lists = groups.map(([tag, title]) => {
    const hs = HOLIDAYS.filter(h => h.tags[0] === tag).map(h => eventFor(h, false)).sort((a, b) => a.next - b.next);
    return `<div class="grp">${title}</div>${hs.map(h => `<div class="sw"><div class="ic">${icon(h.icon)}</div><div class="tx">${esc(h.name)}<small>${fmtShort(h.next)}</small></div>
      <button class="tog${S.hidden.includes(h.id) ? '' : ' on'}" data-h="${h.id}" aria-label="Show ${esc(h.name)}"></button></div>`).join('')}`;
  }).join('');
  const canBadge = 'setAppBadge' in navigator;
  sheet(`<h2>Settings</h2>
    <label class="f" for="kn">Your first name</label><input type="text" id="kn" maxlength="20" autocomplete="off" placeholder="So Big Day can say hi" value="${esc(S.name)}">
    <label class="f">Count in</label><div class="seg" id="wd"><button data-w="days" class="${S.word === 'days' ? 'on' : ''}">Days</button><button data-w="sleeps" class="${S.word === 'sleeps' ? 'on' : ''}">Sleeps</button></div>
    <label class="f">Cards</label><div class="seg" id="lk"><button data-l="auto" class="${S.look === 'auto' ? 'on' : ''}">Match phone</button><button data-l="light" class="${S.look === 'light' ? 'on' : ''}">Light</button><button data-l="dark" class="${S.look === 'dark' ? 'on' : ''}">Dark</button></div>
    <div class="sw"><div class="tx">Holiday music<small>Plays that holiday's songs while you look at it.</small></div><button class="tog${S.music ? ' on' : ''}" id="msc" aria-label="Holiday music"></button></div>
    <div class="sw"><div class="tx">Tap sounds</div><button class="tog${S.sound ? ' on' : ''}" id="snd" aria-label="Tap sounds"></button></div>
    <div class="sw"><div class="tx">Days left on the app icon<small>${canBadge ? 'Puts the number of days until your big day on the Big Day icon.' : 'Works once Big Day is on your Home Screen (see below).'}</small></div><button class="tog${S.badge ? ' on' : ''}" id="bdg" aria-label="Days on icon"></button></div>
    <div class="note"><b>Put Big Day on your iPhone:</b> open this page in Safari, tap the Share button, then <b>Add to Home Screen</b>. It works with no signal too.</div>
    ${lists}
    <div class="grp">Music credits</div>
    <div class="note">Real recordings from Wikimedia Commons. Most are by United States military bands, which makes them public domain (free for everyone).</div>
    ${Object.values(TRACKS).map(t => `<div class="sw"><div class="tx">${esc(t.t)}<small>${esc(t.by)} · <a href="${esc(t.page)}" target="_blank" rel="noopener">${esc(t.lic)}</a></small></div></div>`).join('')}
    <div class="note">Dates follow the United States calendar. Easter, Lent and the days around them follow the Western church calendar used by most American churches. Bible verses are from the King James Version.</div>
    <div class="note" style="text-align:center">Big Day version ${VERSION}</div>
    <button class="btn ghost" id="upd">Check for updates</button>
    <button class="btn ghost" id="done">Done</button>`, (el, close) => {
    el.addEventListener('click', async ev => {
      if (ev.target.closest('#upd')) checkUpdate(true);
      const h = ev.target.closest('[data-h]'), w = ev.target.closest('[data-w]'), l = ev.target.closest('[data-l]');
      if (h) { const id = h.dataset.h; S.hidden = S.hidden.includes(id) ? S.hidden.filter(x => x !== id) : [...S.hidden, id]; h.classList.toggle('on'); save(); }
      if (w) { S.word = w.dataset.w; el.querySelectorAll('[data-w]').forEach(b => b.classList.toggle('on', b === w)); save(); }
      if (l) { S.look = l.dataset.l; el.querySelectorAll('[data-l]').forEach(b => b.classList.toggle('on', b === l)); save(); applyLook(); }
      if (ev.target.closest('#msc')) { S.music = !S.music; ev.target.closest('#msc').classList.toggle('on', S.music); save(); }
      if (ev.target.closest('#snd')) { S.sound = !S.sound; ev.target.closest('#snd').classList.toggle('on', S.sound); save(); if (S.sound) pop(); }
      if (ev.target.closest('#bdg')) {
        const b = ev.target.closest('#bdg');
        if (!S.badge && 'Notification' in window && Notification.permission === 'default') { try { await Notification.requestPermission(); } catch {} }
        S.badge = !S.badge; b.classList.toggle('on', S.badge); save(); updateBadge();
        if (S.badge && !canBadge) toast('Add Big Day to your Home Screen first');
      }
      if (ev.target.closest('#done')) close();
    });
    el.querySelector('#kn').oninput = ev => { S.name = ev.target.value.trim(); save(); };
    const obs = new MutationObserver(() => { if (!el.isConnected) { obs.disconnect(); route(); } });
    obs.observe(document.body, { childList: true });
  });
}

// ---- sharing: a picture card to send, or just a link ----
const shareText = e => e.today ? `${greeting(e)} ${e.name} is today!` : `Only ${num(e.days)} ${word(e.days)} until ${e.name}!`;
async function shareLink(e) {
  const text = shareText(e), url = location.origin + location.pathname;
  try {
    if (navigator.share) await navigator.share({ title: 'Big Day', text, url });
    else { await navigator.clipboard.writeText(`${text} ${url}`); toast('Copied! Paste it in a message.'); }
  } catch {}
}
// The picture is made first and shown, so the Send button can hand it straight to the phone's share menu
// (iPhones refuse to share if the tap was too long ago).
function share(e) {
  sheet(`<h2>Share the countdown</h2>
    <div class="cardprev" id="cp"><div class="small">Making your picture...</div></div>
    <button class="btn" id="sp" disabled>Send the picture</button>
    <button class="btn ghost" id="sl">Send a link instead</button>`, async (el, close) => {
    const q = s => el.querySelector(s);
    q('#sl').onclick = () => shareLink(e);
    let file, url;
    try {
      const blob = await makeCard(e);
      file = new File([blob], `${e.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-countdown.png`, { type: 'image/png' });
      url = URL.createObjectURL(blob);
      q('#cp').innerHTML = `<img src="${url}" alt="${esc(shareText(e))}">`;
    } catch { q('#cp').innerHTML = '<div class="small">The picture would not draw. You can still send a link.</div>'; return; }
    const canFile = !!(navigator.canShare && navigator.canShare({ files: [file] }));
    q('#sp').disabled = false; if (!canFile) q('#sp').textContent = 'Save the picture';
    q('#sp').onclick = async () => {
      pop();
      if (canFile) { try { await navigator.share({ files: [file], text: shareText(e) }); } catch {} return; }
      const a = document.createElement('a'); a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
      toast('Picture saved');
    };
  });
}
// A 1080 x 1350 picture (the shape phones show best): colors, the picture, the name and the count.
async function makeCard(e) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), th = THEMES[e.theme] || THEMES.party, party = e.today;
  try { await document.fonts.load('700 100px Fredoka'); await document.fonts.load('900 40px Nunito'); } catch {}
  const g = x.createLinearGradient(0, 0, W * 0.6, H); g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[1]);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // Confetti dots, the same every time.
  let seed = 11; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 70; i++) {
    x.globalAlpha = 0.16 + rnd() * 0.22; x.fillStyle = CHAIN_COLORS[i % CHAIN_COLORS.length];
    x.beginPath(); x.arc(rnd() * W, rnd() * H, 6 + rnd() * 14, 0, 7); x.fill();
  }
  x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'middle';
  const DF = 'Fredoka, "Arial Rounded MT Bold", Arial, sans-serif', BF = 'Nunito, Arial, sans-serif';
  // Tag at the top.
  const tag = (S.name ? `${possessive(S.name)} countdown` : 'Countdown').toUpperCase();
  x.font = `900 40px ${BF}`; const tw = x.measureText(tag).width + 72;
  x.fillStyle = th.accent; x.beginPath(); x.roundRect(W / 2 - tw / 2, 70, tw, 70, 35); x.fill();
  x.fillStyle = '#2a1a00'; x.fillText(tag, W / 2, 107);
  // The picture: your photo in a white frame, or the drawing.
  x.shadowColor = 'rgba(0,0,0,.22)'; x.shadowOffsetY = 12;
  if (e.photo) {
    const im = await loadImg(e.photo), S0 = 440, px = W / 2 - S0 / 2, py = 180, k = Math.max(S0 / im.width, S0 / im.height);
    x.fillStyle = '#fff'; x.beginPath(); x.roundRect(px - 14, py - 14, S0 + 28, S0 + 28, 64); x.fill();
    x.save(); x.shadowColor = 'transparent'; x.beginPath(); x.roundRect(px, py, S0, S0, 52); x.clip();
    x.drawImage(im, px + (S0 - im.width * k) / 2, py + (S0 - im.height * k) / 2, im.width * k, im.height * k); x.restore();
  } else {
    const im = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icon(e.icon).replace('<svg ', '<svg width="512" height="512" ')));
    x.drawImage(im, W / 2 - 230, 170, 460, 460);
  }
  x.shadowOffsetY = 6; x.shadowColor = 'rgba(0,0,0,.2)'; x.fillStyle = '#fff';
  // Name, on up to two lines.
  x.font = `700 88px ${DF}`;
  const words = e.name.split(' '), lines = [''];
  for (const w of words) { const t = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${w}` : w; if (x.measureText(t).width > 960 && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = t; }
  const shown = lines.slice(0, 2); let y = 700;
  shown.forEach((l, i) => x.fillText(l, W / 2, y + i * 94)); y += (shown.length - 1) * 94;
  if (party) {
    x.font = `700 ${greeting(e).length > 16 ? 96 : 128}px ${DF}`; x.fillText(greeting(e), W / 2, y + 190);
    x.font = `800 48px ${BF}`; x.fillText('is today!', W / 2, y + 310);
  } else {
    x.font = `700 ${e.days > 999 ? 220 : 270}px ${DF}`; x.fillText(num(e.days), W / 2, y + 200);
    x.font = `700 64px ${DF}`; x.fillText(`${word(e.days)} to go!`, W / 2, y + 360);
  }
  x.shadowColor = 'transparent';
  x.font = `800 40px ${BF}`; x.globalAlpha = 0.92; x.fillText(fmtDate(e.target), W / 2, y + 440);
  x.globalAlpha = 0.8; x.font = `700 40px ${DF}`; x.fillText(`Big Day  ·  ${location.host}`, W / 2, H - 56); x.globalAlpha = 1;
  return new Promise((ok, no) => c.toBlob(b => b ? ok(b) : no(new Error('no picture')), 'image/png'));
}

// ---- the number on the icon ----
function updateBadge() {
  const f = featured(), n = f && !f.past ? f.days : 0;
  try {
    if (S.badge && n > 0 && navigator.setAppBadge) navigator.setAppBadge(n);
    else if (navigator.clearAppBadge) navigator.clearAppBadge();
  } catch {}
  // The browser tab shows it too.
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  const th = THEMES[f.theme] || THEMES.party, g = x.createLinearGradient(0, 0, 64, 64);
  g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[1]); x.fillStyle = g; x.beginPath(); x.roundRect(0, 0, 64, 64, 14); x.fill();
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; const label = f.today ? '!' : String(n);
  x.font = `700 ${label.length > 2 ? 26 : 38}px Fredoka, Arial, sans-serif`; x.fillText(label, 32, 35);
  $('#favicon').href = c.toDataURL('image/png');
  document.title = f.today ? `${f.name} is today! · Big Day` : `${n} ${word(n)} until ${f.name} · Big Day`;
}

// ---- updates ----
// iPhones are lazy about refreshing a Home Screen app, so Big Day checks for itself: version.json on the
// site holds the newest version number. If it is newer than this copy, reload to get it. One try per
// version per minute, so a half-published update can't cause a reload loop.
async function checkUpdate(manual) {
  let latest;
  try {
    const r = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    latest = (await r.json()).version;
  } catch { if (manual) toast('Can\'t check right now. Are you online?'); return; }
  if (!(latest > VERSION)) { if (manual) toast(`You have the newest Big Day (version ${VERSION})`); return; }
  let tried = null;
  try { tried = JSON.parse(localStorage.getItem('bigday.update')); } catch {}
  if (tried && tried.v === latest && Date.now() - tried.t < 60000) { if (manual) toast('The update is still on its way. Try again in a minute.'); return; }
  try { localStorage.setItem('bigday.update', JSON.stringify({ v: latest, t: Date.now() })); } catch {}
  toast(`Updating Big Day to version ${latest}...`);
  try { for (const k of await caches.keys()) if (k.startsWith('bigday-shell')) await caches.delete(k); } catch {}
  try { const reg = await navigator.serviceWorker?.getRegistration(); await reg?.update(); } catch {}
  setTimeout(() => location.reload(), 900);
}

// ---- start ----
applyLook();
addEventListener('hashchange', route);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { updateBadge(); checkUpdate(false); } });
route();
updateBadge();
document.fonts && document.fonts.ready.then(updateBadge);
checkUpdate(false);
})();
