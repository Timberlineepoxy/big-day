// Big Day artwork: every holiday picture is drawn here in code (64 x 64 SVG), plus the
// colour scheme and moving scene (snow, fireworks, bats...) for each theme.

const svg = body => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
const STAR5 = (cx, cy, r, fill) => {
  let p = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r;
    p += `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)} `;
  }
  return `<polygon points="${p}" fill="${fill}"/>`;
};
const rays = (cx, cy, r1, r2, n, color, w = 3) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = i * 2 * Math.PI / n;
    s += `<line x1="${(cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(cy + r2 * Math.sin(a)).toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  return s;
};
const LEAF3 = 'M0 0C-4-6-14-8-14-16C-14-22-6-24 0-18C6-24 14-22 14-16C14-8 4-6 0 0Z';

// A comic-book "POW" burst: n spikes between radius r1 (tips) and r2 (dips).
const burst = (cx, cy, r1, r2, n, fill) => {
  let p = '';
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1;
    p += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return `<polygon points="${p}" fill="${fill}"/>`;
};
// Fibonacci squares (1, 1, 2, 3, 5, 8, 13, 21) with the golden spiral drawn through them.
const fibo = () => {
  const F = [1, 1, 2, 3, 5, 8, 13, 21], cols = ['#ffd34d', '#ff8fb5', '#7dd3fc', '#a3e635', '#c4b5fd', '#ffb27a', '#5eead4', '#fde68a'];
  let x0 = 0, y0 = 0, x1 = 0, y1 = 0; const sq = [];
  F.forEach((f, i) => {
    const d = i % 4;
    const [sx, sy] = i === 0 ? [0, 0] : d === 1 ? [x1, y0] : d === 2 ? [x1 - f, y1] : d === 3 ? [x0 - f, y1 - f] : [x0, y0 - f];
    sq.push([sx, sy, f, d]);
    x0 = Math.min(x0, sx); y0 = Math.min(y0, sy); x1 = Math.max(x1, sx + f); y1 = Math.max(y1, sy + f);
  });
  const k = 58 / (x1 - x0), X = x => (3 + (x - x0) * k).toFixed(1), Y = y => (32 - (y1 - y0) * k / 2 + (y - y0) * k).toFixed(1);
  // Each quarter arc runs between two corners of its square, turning clockwise.
  const ends = (sx, sy, f, d) => d === 1 ? [[sx, sy], [sx + f, sy + f]] : d === 2 ? [[sx + f, sy], [sx, sy + f]]
    : d === 3 ? [[sx + f, sy + f], [sx, sy]] : [[sx, sy + f], [sx + f, sy]];
  let path = '';
  sq.forEach(([sx, sy, f, d], i) => {
    const [a, b] = ends(sx, sy, f, d);
    path += `${i ? '' : `M${X(a[0])} ${Y(a[1])}`}A${(f * k).toFixed(1)} ${(f * k).toFixed(1)} 0 0 1 ${X(b[0])} ${Y(b[1])}`;
  });
  return sq.map(([sx, sy, f], i) => `<rect x="${X(sx)}" y="${Y(sy)}" width="${(f * k).toFixed(1)}" height="${(f * k).toFixed(1)}" fill="${cols[i]}" stroke="#ffffff" stroke-width="1.2"/>`).join('')
    + `<path d="${path}" stroke="#1f2937" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
};

// A soccer-ball patch: a dark pentagon of radius r, turned by rot.
const pent = (cx, cy, r, rot) => {
  let p = '';
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + rot + i * 2 * Math.PI / 5; p += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `; }
  return `<polygon points="${p}" fill="#1f2937"/>`;
};
// A black-and-white checkered race flag, 4 squares by 3.
const checker = (x, y, w, h) => {
  const cw = w / 4, ch = h / 3; let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2 === 0) s += `<rect x="${(x + c * cw).toFixed(1)}" y="${(y + r * ch).toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" fill="#111827"/>`;
  return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#111827" stroke-width="1"/>`;
};

const ICONS = {
  tree: svg(`<rect x="28" y="50" width="8" height="10" rx="2" fill="#8b5a2b"/>
    <path d="M32 9L45 25H39L50 38H42L54 52H10L22 38H14L25 25H19Z" fill="#22a447"/>
    <path d="M32 9L45 25H39L50 38H42L54 52H32Z" fill="#178a39"/>
    <path d="M20 31c8 3 16 3 24-2M15 45c11 4 23 4 34-3" stroke="#ffd34d" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="26" cy="36" r="3" fill="#ff3b4e"/><circle cx="39" cy="43" r="3" fill="#3ba7ff"/><circle cx="23" cy="48" r="2.6" fill="#ffd34d"/>
    <circle cx="36" cy="28" r="2.4" fill="#ff3b4e"/><circle cx="44" cy="49" r="2.4" fill="#ff3b4e"/>${STAR5(32, 9, 7, '#ffd34d')}`),
  bell: svg(`<path d="M32 12c-10 0-16 8-16 18v9l-5 7h42l-5-7v-9c0-10-6-18-16-18z" fill="#ffc531"/>
    <path d="M32 12c6 0 12 6 12 18v9l4 7H32z" fill="#f0a91b"/><rect x="11" y="45" width="42" height="5" rx="2.5" fill="#e3961a"/>
    <circle cx="32" cy="54" r="5" fill="#e3961a"/><path d="M22 28c0-6 3-10 7-11" stroke="#fff6c9" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32 12c-4-6-12-6-12-1 0 4 8 3 12 1zM32 12c4-6 12-6 12-1 0 4-8 3-12 1z" fill="#e8283c"/><circle cx="32" cy="12" r="3" fill="#b5172a"/>`),
  candles: svg(`<path d="M6 54c8-6 44-6 52 0-4 6-48 6-52 0z" fill="#1f8f45"/><path d="M10 52l5-4 4 4 5-4 4 4 5-4 4 4 5-4 4 4 5-4" stroke="#2fbf5b" stroke-width="3" fill="none"/>
    <rect x="12" y="26" width="9" height="24" rx="2" fill="#8a3ff0"/><rect x="27.5" y="20" width="9" height="30" rx="2" fill="#ff6fb5"/><rect x="43" y="26" width="9" height="24" rx="2" fill="#8a3ff0"/>
    <rect x="14" y="28" width="2.5" height="18" rx="1.2" fill="#ffffff55"/><rect x="29.5" y="22" width="2.5" height="24" rx="1.2" fill="#ffffff66"/><rect x="45" y="28" width="2.5" height="18" rx="1.2" fill="#ffffff55"/>
    <path d="M16.5 25c-3-3-2-7 0-10 2 3 3 7 0 10z" fill="#ffb21a"/><path d="M32 19c-3-3-2-7 0-10 2 3 3 7 0 10z" fill="#ffb21a"/><path d="M47.5 25c-3-3-2-7 0-10 2 3 3 7 0 10z" fill="#ffb21a"/>
    <circle cx="16.5" cy="22" r="1.4" fill="#fff3b0"/><circle cx="32" cy="16" r="1.4" fill="#fff3b0"/><circle cx="47.5" cy="22" r="1.4" fill="#fff3b0"/>`),
  stocking: svg(`<path d="M22 14h20v24c0 4 1 6-2 10l-6 7c-5 6-15 5-18-1-3-6 1-11 6-14V14z" fill="#e8283c"/>
    <path d="M42 30v8c0 4 1 6-2 10l-6 7c-3 4-8 5-12 3 8-2 14-10 14-18v-10z" fill="#b5172a"/>
    <rect x="19" y="8" width="26" height="10" rx="5" fill="#ffffff"/><circle cx="24" cy="28" r="2" fill="#ffd34d"/><circle cx="34" cy="26" r="2" fill="#2fbf5b"/><circle cx="28" cy="36" r="2" fill="#ffd34d"/>
    <path d="M45 13l7-6" stroke="#ffd34d" stroke-width="3" stroke-linecap="round"/>${STAR5(53, 6, 4.5, '#ffd34d')}`),
  partyhat: svg(`<path d="M32 8L50 54H14Z" fill="#8a3ff0"/><path d="M32 8L50 54H32Z" fill="#6d28d9"/>
    <path d="M25 26l14 4M21 37l20 6M17 48l26 6" stroke="#ffd34d" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="32" cy="54" rx="19" ry="4" fill="#ff4fa3"/><circle cx="32" cy="8" r="5" fill="#ffd34d"/>
    <circle cx="10" cy="16" r="2.4" fill="#ff4fa3"/><circle cx="54" cy="20" r="2.4" fill="#3ba7ff"/><rect x="50" y="34" width="5" height="3" rx="1" transform="rotate(30 52 35)" fill="#ffd34d"/><rect x="7" y="32" width="5" height="3" rx="1" transform="rotate(-25 9 33)" fill="#2fd38a"/>`),
  fireworks: svg(`${rays(22, 24, 5, 16, 10, '#ffd34d', 3)}${rays(44, 36, 4, 14, 8, '#ff4fa3', 3)}${rays(30, 48, 3, 9, 8, '#3ba7ff', 2.5)}
    <circle cx="22" cy="24" r="3.5" fill="#fff3b0"/><circle cx="44" cy="36" r="3" fill="#ffd0e8"/><circle cx="30" cy="48" r="2.4" fill="#cfe9ff"/>
    <circle cx="52" cy="12" r="1.8" fill="#ffd34d"/><circle cx="8" cy="44" r="1.8" fill="#ff4fa3"/>`),
  star: svg(`${rays(32, 32, 26, 31, 12, '#ffe58a', 2)}${STAR5(32, 32, 24, '#ffc531')}
    <polygon points="32,8 32,32 13,39" fill="#ffd95e"/><circle cx="26" cy="26" r="3" fill="#fff8d6"/>`),
  mic: svg(`<rect x="22" y="6" width="20" height="30" rx="10" fill="#4b5563"/><rect x="22" y="6" width="10" height="30" rx="10" fill="#6b7280"/>
    <path d="M26 14h12M26 19h12M26 24h12M26 29h12" stroke="#9ca3af" stroke-width="1.6"/>
    <path d="M16 28c0 10 7 16 16 16s16-6 16-16" stroke="#374151" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="30" y="44" width="4" height="10" fill="#374151"/><rect x="20" y="53" width="24" height="5" rx="2.5" fill="#374151"/>
    <path d="M8 10l-3-3M8 20H3M56 10l3-3M56 20h5" stroke="#3ba7ff" stroke-width="2.6" stroke-linecap="round"/>`),
  groundhog: svg(`<ellipse cx="32" cy="56" rx="28" ry="7" fill="#7a4b26"/><path d="M14 56c0-26 8-40 18-40s18 14 18 40z" fill="#b07a45"/>
    <ellipse cx="32" cy="44" rx="10" ry="12" fill="#d9a873"/><circle cx="20" cy="20" r="5" fill="#b07a45"/><circle cx="44" cy="20" r="5" fill="#b07a45"/>
    <circle cx="20" cy="20" r="2.4" fill="#e7b98a"/><circle cx="44" cy="20" r="2.4" fill="#e7b98a"/>
    <circle cx="26" cy="27" r="2.6" fill="#1f1f1f"/><circle cx="38" cy="27" r="2.6" fill="#1f1f1f"/><circle cx="27" cy="26" r=".9" fill="#fff"/><circle cx="39" cy="26" r=".9" fill="#fff"/>
    <ellipse cx="32" cy="33" rx="4" ry="3" fill="#5a3518"/><rect x="29.5" y="36" width="5" height="5" rx="1" fill="#fff"/>
    <ellipse cx="32" cy="58" rx="22" ry="4" fill="#5a3518"/>`),
  heart: svg(`<path d="M32 56C10 40 4 28 8 18 12 8 26 6 32 16 38 6 52 8 56 18 60 28 54 40 32 56Z" fill="#ff3b6b"/>
    <path d="M32 56C46 44 56 32 56 22 56 14 50 9 44 10 52 14 52 30 32 56Z" fill="#e31b54"/>
    <ellipse cx="19" cy="20" rx="5" ry="3.5" transform="rotate(-35 19 20)" fill="#ffd0dc"/>`),
  tophat: svg(`<rect x="18" y="8" width="28" height="38" rx="3" fill="#1f2937"/><rect x="18" y="8" width="10" height="38" rx="3" fill="#374151"/>
    <rect x="18" y="34" width="28" height="8" fill="#e8283c"/><rect x="18" y="38" width="28" height="2.5" fill="#ffffff"/>
    <ellipse cx="32" cy="48" rx="26" ry="6" fill="#111827"/>${STAR5(32, 38, 5, '#ffffff')}`),
  ashes: svg(`<circle cx="32" cy="32" r="27" fill="#7c5cb5"/><circle cx="32" cy="32" r="27" fill="none" stroke="#a78bdb" stroke-width="3"/>
    <path d="M32 14c1 9 0 26 1 36" stroke="#4b4b55" stroke-width="7" stroke-linecap="round" opacity=".9"/>
    <path d="M18 27c9 1 19-1 28 1" stroke="#4b4b55" stroke-width="7" stroke-linecap="round" opacity=".9"/>
    <circle cx="27" cy="44" r="1.4" fill="#4b4b55"/><circle cx="40" cy="22" r="1.2" fill="#4b4b55"/>`),
  shamrock: svg(`<path d="M32 32c2 10 6 18 12 26" stroke="#15803d" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <g transform="translate(32 32)"><path d="${LEAF3}" fill="#22c55e"/><path d="${LEAF3}" fill="#16a34a" transform="rotate(120)"/><path d="${LEAF3}" fill="#22c55e" transform="rotate(240)"/></g>
    <circle cx="32" cy="32" r="3" fill="#15803d"/><ellipse cx="27" cy="18" rx="3" ry="2" fill="#bbf7d0"/>`),
  silly: svg(`<circle cx="32" cy="32" r="26" fill="#ffd23f"/><path d="M32 6a26 26 0 0 1 0 52 22 26 0 0 0 0-52z" fill="#f5b700"/>
    <circle cx="23" cy="25" r="4" fill="#3a2a00"/><path d="M37 25c2-3 7-3 9 0" stroke="#3a2a00" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M18 36c6 9 22 9 28 0" stroke="#3a2a00" stroke-width="3.4" fill="#7a1f1f" stroke-linecap="round"/><path d="M33 42c0 6 9 6 9 0z" fill="#ff5c7a"/>
    <circle cx="16" cy="33" r="3" fill="#ff9a7a" opacity=".7"/><circle cx="48" cy="33" r="3" fill="#ff9a7a" opacity=".7"/>`),
  palm: svg(`<path d="M10 58C22 44 34 28 54 8" stroke="#a16207" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${[...Array(9)].map((_, i) => { const t = 0.15 + i * 0.09, x = 10 + 44 * t, y = 58 - 50 * t; return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}q-14-2-20-12q12 0 20 12z" fill="#22a447"/><path d="M${x.toFixed(1)} ${y.toFixed(1)}q2 14 12 20q0-12-12-20z" fill="#178a39"/>`; }).join('')}`),
  chalice: svg(`<path d="M16 10h32c0 14-6 22-16 22S16 24 16 10z" fill="#ffc531"/><path d="M32 10h16c0 14-6 22-16 22z" fill="#e3a51a"/>
    <path d="M18 14h28" stroke="#9b1c31" stroke-width="5" stroke-linecap="round"/><rect x="29" y="31" width="6" height="14" fill="#e3a51a"/>
    <path d="M20 52c0-5 6-8 12-8s12 3 12 8z" fill="#ffc531"/><ellipse cx="22" cy="20" rx="2" ry="4" fill="#fff3b0"/>
    <path d="M38 56c0-6 4-9 10-9s10 3 10 9z" fill="#d79a54"/><path d="M42 50l3 3M48 49l2 3M53 50l1 3" stroke="#9a5f25" stroke-width="1.6" stroke-linecap="round"/>`),
  cross: svg(`${rays(32, 26, 24, 31, 16, '#ffe08a', 2.4)}<rect x="27" y="6" width="10" height="54" rx="2" fill="#9a5f25"/><rect x="12" y="18" width="40" height="10" rx="2" fill="#9a5f25"/>
    <rect x="27" y="6" width="4" height="54" rx="2" fill="#b77a3c"/><rect x="12" y="18" width="40" height="4" rx="2" fill="#b77a3c"/>
    <path d="M30 34c2 4 2 10 0 16M46 22h-6" stroke="#6f4116" stroke-width="1.4" stroke-linecap="round"/>`),
  sunrise: svg(`${rays(32, 33, 19, 29, 11, '#ffffff', 3.4)}<circle cx="32" cy="33" r="17" fill="#ffffff"/><circle cx="32" cy="33" r="13" fill="#ffc531"/>
    <ellipse cx="32" cy="50" rx="30" ry="11" fill="#2fbf5b"/><path d="M8 57c10 4 34 5 50-3-8 6-20 8-30 8-9 0-16-2-20-5z" fill="#1f9e48"/>
    <rect x="30" y="20" width="4" height="22" rx="1" fill="#5b3a1a"/><rect x="24" y="25" width="16" height="4" rx="1" fill="#5b3a1a"/>
    <ellipse cx="14" cy="52" rx="3.5" ry="2.5" fill="#ff8fb1"/><ellipse cx="48" cy="54" rx="3.5" ry="2.5" fill="#8fd3ff"/><ellipse cx="40" cy="50" rx="3" ry="2.2" fill="#ffe066"/>`),
  cloud: svg(`${rays(32, 30, 18, 30, 12, '#ffd34d', 3)}<path d="M16 46c-6 0-10-4-10-9s5-9 10-8c1-8 8-13 15-12 6 0 11 4 12 10 7-1 13 4 13 10s-5 9-11 9z" fill="#ffffff"/>
    <path d="M16 46h29c6 0 11-3 11-9 0 6-6 5-11 5-8 0-20 1-29-1-4 0-8-1-10-4 1 5 5 9 10 9z" fill="#dbeafe"/>`),
  flame: svg(`<path d="M32 4c4 10 18 16 18 32 0 12-8 22-18 22S14 48 14 36c0-8 4-12 6-16 2 6 4 8 7 8-2-10 1-18 5-24z" fill="#ff6a1a"/>
    <path d="M32 26c3 6 10 10 10 18 0 7-4 12-10 12s-10-5-10-12c0-4 2-6 3-8 1 3 3 4 5 4-1-6 0-10 2-14z" fill="#ffc531"/>
    <ellipse cx="32" cy="48" rx="4" ry="5" fill="#fff3b0"/>`),
  tulip: svg(`<path d="M32 34v26" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/><path d="M32 52c-10-2-16-10-16-20 8 2 14 8 16 20z" fill="#22c55e"/><path d="M32 48c8-2 14-8 14-18-8 2-12 8-14 18z" fill="#16a34a"/>
    <path d="M20 10l6 8 6-12 6 12 6-8c2 14-2 26-12 26S18 24 20 10z" fill="#ff4f93"/><path d="M32 6l6 12 6-8c2 14-2 26-12 26z" fill="#e1306c"/><ellipse cx="25" cy="22" rx="2" ry="5" fill="#ffc2da"/>`),
  poppy: svg(`<path d="M32 36c1 8 0 16-2 24" stroke="#16a34a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M31 50c-6-2-10-6-12-12 6 1 10 5 12 12z" fill="#22c55e"/>
    <circle cx="22" cy="22" r="12" fill="#e11d2e"/><circle cx="42" cy="22" r="12" fill="#e11d2e"/><circle cx="22" cy="38" r="11" fill="#c8102e"/><circle cx="42" cy="38" r="11" fill="#c8102e"/>
    <circle cx="32" cy="30" r="7" fill="#1a1a1a"/><circle cx="32" cy="30" r="3" fill="#3f3f3f"/><ellipse cx="18" cy="17" rx="4" ry="2.5" fill="#ff6b7a" transform="rotate(-30 18 17)"/>`),
  flag: svg(`<rect x="6" y="6" width="4" height="54" rx="2" fill="#9ca3af"/><circle cx="8" cy="6" r="3.4" fill="#ffc531"/>
    <g>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="10" y="${10 + i * 6}" width="48" height="3" fill="#e8283c"/><rect x="10" y="${13 + i * 6}" width="48" height="3" fill="#ffffff"/>`).join('')}</g>
    <rect x="10" y="10" width="22" height="21" fill="#1e3a8a"/>${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<circle cx="${14 + c * 5}" cy="${14 + r * 4.6}" r="1.2" fill="#fff"/>`).join('')).join('')}`),
  tie: svg(`<path d="M24 6h16l-3 10h-10z" fill="#1d4ed8"/><path d="M27 16h10l7 32-12 12-12-12z" fill="#2563eb"/>
    <path d="M27 16h10l7 32-12 12z" fill="#1d4ed8"/><path d="M24 26l18 8M22 38l20 9M27 50l10 4" stroke="#93c5fd" stroke-width="3" stroke-linecap="round"/>`),
  freestar: svg(`<circle cx="32" cy="32" r="28" fill="#1e3a8a"/><path d="M4 36c12-6 44-6 56 0a28 28 0 0 1-56 0z" fill="#c8102e"/>
    ${STAR5(32, 31, 17, '#ffffff')}${rays(32, 31, 21, 25, 12, '#ffffff', 2)}`),
  rocket: svg(`<path d="M32 4c8 6 10 16 9 30H23C22 20 24 10 32 4z" fill="#ffffff"/><path d="M32 4c8 6 10 16 9 30h-9z" fill="#dbe4f0"/>
    <path d="M23 14h18v6H23z" fill="#e8283c"/><circle cx="32" cy="25" r="3.5" fill="#1e3a8a"/>
    <path d="M23 26l-7 10h8zM41 26l7 10h-8z" fill="#e8283c"/><rect x="26" y="34" width="12" height="4" fill="#1e3a8a"/>
    <path d="M27 40c0 8 5 12 5 18 0-6 5-10 5-18z" fill="#ffb21a"/><path d="M30 40c0 5 2 8 2 12 0-4 2-7 2-12z" fill="#fff3b0"/>
    ${STAR5(10, 12, 4, '#ffd34d')}${STAR5(54, 18, 3.5, '#3ba7ff')}${STAR5(52, 48, 3, '#e8283c')}`),
  hardhat: svg(`<path d="M10 42c0-14 9-24 22-24s22 10 22 24z" fill="#ffc531"/><path d="M32 18c13 0 22 10 22 24H32z" fill="#f0a91b"/>
    <rect x="27" y="14" width="10" height="28" rx="3" fill="#ffd95e"/><rect x="4" y="42" width="56" height="7" rx="3.5" fill="#e3961a"/>
    <path d="M16 54h32" stroke="#6b7280" stroke-width="4" stroke-linecap="round"/><path d="M20 32c1-5 4-9 8-11" stroke="#fff3b0" stroke-width="2.6" fill="none" stroke-linecap="round"/>`),
  glasses: svg(`<path d="M32 22c-6-8-18-3-10 6l10 8 10-8c8-9-4-14-10-6z" fill="#ff4f7b"/>
    <circle cx="18" cy="44" r="11" fill="#dbeafe" stroke="#7c4a1e" stroke-width="4"/><circle cx="46" cy="44" r="11" fill="#dbeafe" stroke="#7c4a1e" stroke-width="4"/>
    <path d="M29 43c2-3 4-3 6 0M7 42l-4-4M57 42l4-4" stroke="#7c4a1e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M13 41l5-4M41 41l5-4" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>`),
  ship: svg(`<path d="M30 6v40" stroke="#7c4a1e" stroke-width="3"/><path d="M33 10c10 6 16 16 18 30H33z" fill="#ffffff"/><path d="M27 14c-8 6-12 14-13 26h13z" fill="#f1f5f9"/>
    <path d="M30 6l10 4-10 3z" fill="#e8283c"/><path d="M8 46h48l-7 10H15z" fill="#b45309"/><path d="M8 46h48l-2 3H10z" fill="#92400e"/>
    <path d="M0 58c5-3 9 3 14 0s9 3 14 0 9 3 14 0 9 3 14 0 6 2 8 1v7H0z" fill="#3ba7ff"/>`),
  pumpkin: svg(`<path d="M32 16c-2-6 0-10 6-12" stroke="#4d7c0f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="38" rx="14" ry="20" fill="#f97316"/><ellipse cx="44" cy="38" rx="14" ry="20" fill="#f97316"/><ellipse cx="32" cy="38" rx="12" ry="21" fill="#fb923c"/>
    <path d="M22 32l5-6 5 6zM36 32l5-6 5 6z" fill="#3b1a00"/><path d="M20 42c4 8 20 8 24 0l-4 2-2-2-3 3-3-3-3 3-3-3-2 2z" fill="#3b1a00"/>
    <path d="M26 20c-3 4-4 10-3 16" stroke="#fdba74" stroke-width="2.4" fill="none" stroke-linecap="round"/>`),
  crown: svg(`${rays(32, 30, 26, 31, 14, '#ffe58a', 2)}<path d="M8 46L6 18l14 12 12-18 12 18 14-12-2 28z" fill="#ffc531"/><path d="M32 12l12 18 14-12-2 28H32z" fill="#e3a51a"/>
    <rect x="8" y="46" width="48" height="8" rx="2" fill="#e3961a"/><circle cx="20" cy="50" r="2.6" fill="#e8283c"/><circle cx="32" cy="50" r="2.6" fill="#3ba7ff"/><circle cx="44" cy="50" r="2.6" fill="#2fbf5b"/>
    <circle cx="6" cy="18" r="3" fill="#ffd95e"/><circle cx="32" cy="12" r="3" fill="#ffd95e"/><circle cx="58" cy="18" r="3" fill="#ffd95e"/>`),
  medal: svg(`<path d="M18 4h10l8 22h-10z" fill="#e8283c"/><path d="M36 4h10l-8 22h-10z" fill="#1e3a8a"/><path d="M28 4h8l-2 6h-4z" fill="#ffffff"/>
    <circle cx="32" cy="42" r="17" fill="#ffc531"/><circle cx="32" cy="42" r="13" fill="#e3a51a"/>${STAR5(32, 42, 10, '#fff3b0')}`),
  turkey: svg(`${['#e8283c', '#f97316', '#ffc531', '#84cc16', '#f97316', '#e8283c', '#b45309'].map((c, i) => `<ellipse cx="32" cy="16" rx="6" ry="16" fill="${c}" transform="rotate(${-72 + i * 24} 32 36)"/>`).join('')}
    <ellipse cx="32" cy="42" rx="14" ry="15" fill="#8b5a2b"/><ellipse cx="32" cy="45" rx="9" ry="10" fill="#a8743f"/>
    <circle cx="32" cy="26" r="8" fill="#9b6533"/><circle cx="29" cy="24" r="1.8" fill="#1f1f1f"/><circle cx="35" cy="24" r="1.8" fill="#1f1f1f"/>
    <path d="M30 28l2 4 2-4z" fill="#ffb21a"/><path d="M33 30c2 2 2 6 0 7-2-1-2-5 0-7z" fill="#e8283c"/>
    <path d="M26 56l-2 5M38 56l2 5" stroke="#ffb21a" stroke-width="3" stroke-linecap="round"/>`),
  cake: svg(`<rect x="10" y="38" width="44" height="18" rx="3" fill="#ff7ab6"/><rect x="16" y="24" width="32" height="15" rx="3" fill="#ffd1e6"/>
    <path d="M10 42c4 4 7 4 11 0s7 4 11 0 7 4 11 0 7 4 11 0" stroke="#ffffff" stroke-width="3.4" fill="none"/><path d="M16 28c4 3 6 3 8 0s6 3 8 0 6 3 8 0 6 3 8 0" stroke="#ff7ab6" stroke-width="3" fill="none"/>
    <rect x="6" y="55" width="52" height="4" rx="2" fill="#c4b5fd"/>
    ${[22, 32, 42].map((x, i) => `<rect x="${x - 1.6}" y="13" width="3.2" height="11" rx="1" fill="${['#3ba7ff', '#ffd34d', '#2fd38a'][i]}"/><path d="M${x} 12c-2.4-2-1.6-5 0-7 1.6 2 2.4 5 0 7z" fill="#ffb21a"/>`).join('')}`),
  rings: svg(`<circle cx="24" cy="38" r="15" fill="none" stroke="#ffc531" stroke-width="5"/><circle cx="40" cy="38" r="15" fill="none" stroke="#e3a51a" stroke-width="5"/>
    <path d="M14 30a15 15 0 0 1 10-7" stroke="#fff3b0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M18 16l6-8h0l6 8-6 6z" fill="#bfe7ff"/><path d="M24 8l6 8-6 6z" fill="#7cc8f5"/>${rays(46, 12, 3, 7, 6, '#ffd34d', 2)}`),
  plane: svg(`<path d="M6 30l10-2 10 4 16-14c4-3 9-2 10 0s1 6-3 9L35 41l3 11-4 4-7-10-10 4-2 4-3-2 2-6-8-8z" fill="#ffffff"/>
    <path d="M52 18c1 2 1 6-3 9L35 41l3 11-4 4-5-8z" fill="#cbd5e1"/><path d="M40 21l5 5" stroke="#3ba7ff" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 52c6 0 6-3 12-3s6 3 12 3" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`),
  backpack: svg(`<path d="M24 12c0-6 16-6 16 0" stroke="#1e40af" stroke-width="4" fill="none"/><rect x="12" y="14" width="40" height="44" rx="12" fill="#3b82f6"/>
    <rect x="12" y="14" width="20" height="44" rx="12" fill="#60a5fa"/><rect x="18" y="36" width="28" height="18" rx="5" fill="#1d4ed8"/>
    <path d="M18 44h28" stroke="#ffd34d" stroke-width="2.6"/><circle cx="32" cy="44" r="2.4" fill="#ffd34d"/><rect x="20" y="20" width="24" height="6" rx="3" fill="#93c5fd"/>`),
  bus: svg(`<rect x="4" y="16" width="56" height="32" rx="6" fill="#ffc531"/><rect x="4" y="38" width="56" height="10" rx="3" fill="#e3a51a"/>
    ${[10, 22, 34].map(x => `<rect x="${x}" y="21" width="9" height="10" rx="2" fill="#bfe7ff"/>`).join('')}<rect x="46" y="21" width="10" height="17" rx="2" fill="#bfe7ff"/>
    <path d="M4 35h56" stroke="#1f2937" stroke-width="2"/><circle cx="16" cy="50" r="6" fill="#1f2937"/><circle cx="48" cy="50" r="6" fill="#1f2937"/><circle cx="16" cy="50" r="2.4" fill="#9ca3af"/><circle cx="48" cy="50" r="2.4" fill="#9ca3af"/>
    <rect x="56" y="40" width="5" height="4" rx="1" fill="#fff3b0"/>`),
  baby: svg(`<rect x="21" y="22" width="22" height="34" rx="9" fill="#e0f2fe"/><rect x="21" y="22" width="11" height="34" rx="9" fill="#ffffff"/>
    <path d="M24 34h6M24 40h8M24 46h6" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/><rect x="19" y="16" width="26" height="8" rx="3" fill="#ff7ab6"/>
    <path d="M26 16c0-8 3-12 6-12s6 4 6 12z" fill="#fde68a"/><circle cx="50" cy="12" r="4" fill="#ff7ab6"/><circle cx="12" cy="20" r="3" fill="#93c5fd"/>`),
  ball: svg(`<circle cx="32" cy="32" r="26" fill="#f97316"/><path d="M32 6v52M6 32h52" stroke="#7c2d12" stroke-width="2.6"/>
    <path d="M14 13c8 6 8 32 0 38M50 13c-8 6-8 32 0 38" stroke="#7c2d12" stroke-width="2.6" fill="none"/><ellipse cx="22" cy="18" rx="5" ry="3" transform="rotate(-35 22 18)" fill="#fdba74"/>`),
  gift: svg(`<rect x="10" y="28" width="44" height="28" rx="3" fill="#e8283c"/><rect x="7" y="20" width="50" height="10" rx="3" fill="#ff4b5c"/>
    <rect x="28" y="20" width="8" height="36" fill="#ffd34d"/><rect x="32" y="28" width="22" height="28" fill="#00000018"/>
    <path d="M32 20c-6-10-18-10-16-3 1 4 9 4 16 3zM32 20c6-10 18-10 16-3-1 4-9 4-16 3z" fill="#ffc531"/>`),
  sun: svg(`${rays(32, 32, 20, 29, 12, '#ffb21a', 4)}<circle cx="32" cy="32" r="15" fill="#ffc531"/><circle cx="27" cy="30" r="2" fill="#7a4b00"/><circle cx="37" cy="30" r="2" fill="#7a4b00"/>
    <path d="M26 36c3 4 9 4 12 0" stroke="#7a4b00" stroke-width="2.4" fill="none" stroke-linecap="round"/>`),
  paw: svg(`<ellipse cx="32" cy="42" rx="14" ry="12" fill="#8b5a2b"/><ellipse cx="16" cy="26" rx="6" ry="8" fill="#8b5a2b"/><ellipse cx="27" cy="16" rx="6" ry="8" fill="#8b5a2b"/>
    <ellipse cx="39" cy="16" rx="6" ry="8" fill="#8b5a2b"/><ellipse cx="50" cy="26" rx="6" ry="8" fill="#8b5a2b"/><ellipse cx="28" cy="38" rx="4" ry="3" fill="#a8743f"/>`),
  house: svg(`<path d="M6 30L32 8l26 22z" fill="#e8283c"/><rect x="12" y="28" width="40" height="28" fill="#fde68a"/><rect x="12" y="28" width="40" height="4" fill="#00000018"/>
    <rect x="27" y="38" width="10" height="18" rx="1" fill="#8b5a2b"/><rect x="16" y="35" width="8" height="8" rx="1" fill="#bfe7ff"/><rect x="40" y="35" width="8" height="8" rx="1" fill="#bfe7ff"/>
    <path d="M30 22c0-3 4-3 4 0" stroke="#fff" stroke-width="0"/><path d="M32 21c-3-3-7 0-4 3l4 3 4-3c3-3-1-6-4-3z" fill="#ffd0dc"/>`),
  music: svg(`<path d="M24 46V14l28-6v32" stroke="#8a3ff0" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M24 14l28-6v8l-28 6z" fill="#8a3ff0"/>
    <ellipse cx="17" cy="47" rx="9" ry="7" fill="#8a3ff0"/><ellipse cx="45" cy="41" rx="9" ry="7" fill="#8a3ff0"/><ellipse cx="14" cy="45" rx="3" ry="2" fill="#c4b5fd"/>`),
  gradcap: svg(`<path d="M32 12L4 24l28 12 28-12z" fill="#1f2937"/><path d="M14 29v12c6 6 30 6 36 0V29l-18 8z" fill="#374151"/>
    <path d="M54 26v18" stroke="#ffc531" stroke-width="2.6"/><circle cx="54" cy="46" r="3.5" fill="#ffc531"/><path d="M32 12L60 24 32 30z" fill="#111827"/>`),
  // ---- Fun days ----
  spaghetti: svg(`<ellipse cx="32" cy="32" rx="24" ry="9" fill="#ffd97a"/>
    <path d="M11 33c4-6 9-6 12 0s8 6 10 0 8-6 10 0 6 4 10 1" stroke="#f2b632" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M20 29c0-6 6-9 12-9s12 3 12 9c-4 3-20 3-24 0z" fill="#e8283c"/>
    <circle cx="27" cy="22" r="5" fill="#8b4513"/><circle cx="37.5" cy="23" r="4.5" fill="#7a3b10"/><circle cx="25.5" cy="20.5" r="1.5" fill="#c27a45"/>
    <path d="M6 34h52c0 13-11 22-26 22S6 47 6 34z" fill="#3ba7ff"/><path d="M32 34h26c0 13-11 22-26 22z" fill="#2563eb"/>
    <path d="M12 40c3 6 8 9 14 10" stroke="#9fd4ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <rect x="44.5" y="13" width="3" height="18" rx="1.5" fill="#e5e7eb"/><path d="M41 4v6c0 3 2 5 5 5s5-2 5-5V4" stroke="#e5e7eb" stroke-width="2.4" fill="none"/>
    <path d="M44.5 4v7M47.5 4v7" stroke="#e5e7eb" stroke-width="2"/>`),
  beanie: svg(`<circle cx="32" cy="12" r="7" fill="#ffffff"/><circle cx="30" cy="10" r="2.5" fill="#e8eef5"/>
    <path d="M10 46c0-18 10-30 22-30s22 12 22 30z" fill="#e8283c"/><path d="M32 16c12 0 22 12 22 30H40c0-16-3-26-8-30z" fill="#b5172a"/>
    ${STAR5(24, 33, 6, '#ffd34d')}<rect x="7" y="42" width="50" height="13" rx="6" fill="#ffffff"/>
    <path d="M13 44v9M19 44v9M25 44v9M31 44v9M37 44v9M43 44v9M49 44v9" stroke="#dbe3ec" stroke-width="2.2"/>`),
  popcorn: svg(`<g fill="#fff6d5" stroke="#f2c14e" stroke-width="1.5"><circle cx="18" cy="22" r="6"/><circle cx="28" cy="18" r="7"/><circle cx="40" cy="18" r="7"/>
    <circle cx="48" cy="23" r="5.5"/><circle cx="33" cy="10" r="6"/><circle cx="22" cy="12" r="5"/><circle cx="44" cy="10" r="4.5"/>
    <circle cx="7" cy="12" r="3"/><circle cx="57" cy="14" r="3"/></g>
    <path d="M14 26h36l-5 32H19z" fill="#ffffff"/><path d="M14 26h7l2.5 32H19z" fill="#e8283c"/><path d="M28 26h8l-1 32h-6z" fill="#e8283c"/>
    <path d="M43 26h7l-5 32h-4.5z" fill="#e8283c"/><rect x="12" y="24" width="40" height="5" rx="2.5" fill="#ffd34d"/>`),
  squirrel: svg(`<path d="M38 52c14 0 20-10 18-22S44 12 38 18c-4 4 0 10 6 8" stroke="#b65a22" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M40 50c10-1 14-9 13-18" stroke="#e3a062" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="44" rx="13" ry="14" fill="#d9813a"/><ellipse cx="25" cy="47" rx="7" ry="9" fill="#f6d1a3"/>
    <path d="M26 17l5-11 3 12z" fill="#b65a22"/><path d="M18 18l-1-10 7 7z" fill="#b65a22"/>
    <circle cx="25" cy="25" r="10" fill="#d9813a"/><ellipse cx="17" cy="28" rx="5" ry="4" fill="#e9a76b"/>
    <circle cx="23" cy="23" r="2.4" fill="#1f1f1f"/><circle cx="23.8" cy="22.2" r=".8" fill="#fff"/><circle cx="13" cy="27.5" r="1.8" fill="#5a3518"/>
    <path d="M15 38c0-4 10-4 10 0z" fill="#6b3a16"/><ellipse cx="20" cy="42" rx="4.5" ry="5" fill="#a0522d"/><path d="M20 34v-2" stroke="#6b3a16" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="22" cy="58" rx="6" ry="3" fill="#b65a22"/><ellipse cx="35" cy="58" rx="6" ry="3" fill="#b65a22"/>`),
  hug: svg(`<circle cx="32" cy="28" r="22" fill="#ffc531"/><path d="M32 6a22 22 0 0 1 0 44c8-6 12-14 12-22S40 12 32 6z" fill="#f0a91b"/>
    <path d="M21 24c2-3 6-3 8 0M35 24c2-3 6-3 8 0" stroke="#7a4b00" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="19" cy="31" r="3" fill="#ff8fa3"/><circle cx="45" cy="31" r="3" fill="#ff8fa3"/>
    <path d="M27 33c3 3 7 3 10 0" stroke="#7a4b00" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 61C20 53 16 47 18 42c2-5 9-6 14 0 5-6 12-5 14 0 2 5-2 11-14 19z" fill="#ff3b6b"/>
    <path d="M9 40c4 9 12 13 21 11M55 40c-4 9-12 13-21 11" stroke="#f0a91b" stroke-width="7" fill="none" stroke-linecap="round"/>`),
  pie: svg(`<path d="M24 16c-3-3 3-5 0-9M32 16c-3-3 3-5 0-9M40 16c-3-3 3-5 0-9" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="32" cy="42" rx="29" ry="14" fill="#dbe3ec"/><path d="M6 34v4c0 10 12 16 26 16s26-6 26-16v-4z" fill="#c9862f"/>
    <ellipse cx="32" cy="34" rx="26" ry="12" fill="#e8a54b"/><ellipse cx="32" cy="34" rx="21" ry="9" fill="#b91c4b"/>
    <path d="M22 26.5v15M32 25.5v17M42 26.5v15M13.5 30h37M13.5 38h37" stroke="#f3c27a" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="32" cy="34" rx="23.5" ry="10.5" fill="none" stroke="#d4913a" stroke-width="3" stroke-dasharray="3 2"/>`),
  compliment: svg(`<path d="M10 10h44a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H30L16 57V46h-6a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill="#ffffff"/>
    <path d="M32 40c-10-6-13-11-12-15 1-5 8-6 12 0 4-6 11-5 12 0 1 4-2 9-12 15z" fill="#ff3b6b"/>
    <path d="M56 1l1.6 4.4L62 7l-4.4 1.6L56 13l-1.6-4.4L50 7l4.4-1.6z" fill="#ffd34d"/><path d="M6 52l1.2 3.3 3.3 1.2-3.3 1.2L6 61l-1.2-3.3L1.5 56.5l3.3-1.2z" fill="#ffd34d"/>`),
  puzzle: svg(`<path d="M14 18h12c-2-3-2-10 6-10s8 7 6 10h12v12c3-2 10-2 10 6s-7 8-10 6v14H38c2-3 2-10-6-10s-8 7-6 10H14V42c3 2 10 2 10-6s-7-8-10-6z" fill="#8a3ff0"/>
    <path d="M32 8c8 0 8 7 6 10h12v12c3-2 10-2 10 6s-7 8-10 6v14H38c2-3 2-10-6-10z" fill="#6d28d9"/>
    <path d="M18 23h6M18 27h3" stroke="#c4a8ff" stroke-width="3" stroke-linecap="round"/>`),
  bubblewrap: svg(`<rect x="7" y="7" width="50" height="50" rx="7" fill="#e0f4ff"/><rect x="7" y="7" width="50" height="50" rx="7" fill="none" stroke="#9fd4ff" stroke-width="2"/>
    ${[16, 27, 38, 49].flatMap(y => [16, 27, 38, 49].map(x => x === 38 && y === 27
      ? `<path d="M34 23l8 8M42 23l-8 8M38 21.5v3M38 29.5v3M32.5 27h3M40.5 27h3" stroke="#3ba7ff" stroke-width="1.8" stroke-linecap="round"/>`
      : `<circle cx="${x}" cy="${y}" r="4.6" fill="#ffffff" stroke="#7cc4f2" stroke-width="1.3"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.3" fill="#c9e9ff"/>`)).join('')}`),
  pizza: svg(`<path d="M10 16c14-6 30-6 44 0L32 60z" fill="#ffd34d"/><path d="M32 14c8 0 16 1 22 2L32 60z" fill="#f5bd1f"/>
    <path d="M22 36c0 5 4 5 4 0M40 30c0 6 4 6 4 0" stroke="#ffd34d" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="25" cy="24" r="4.5" fill="#e8283c"/><circle cx="39" cy="25" r="4" fill="#e8283c"/><circle cx="31" cy="37" r="4" fill="#e8283c"/><circle cx="33" cy="49" r="2.6" fill="#e8283c"/>
    <circle cx="23.5" cy="22.5" r="1.2" fill="#ff8a8a"/><circle cx="37.5" cy="23.5" r="1.1" fill="#ff8a8a"/>
    <path d="M8 14c14-8 34-8 48 0" stroke="#c9862f" stroke-width="8" fill="none" stroke-linecap="round"/>`),
  bulb: svg(`${rays(32, 24, 22, 29, 10, '#fff3b0', 3)}
    <path d="M32 6c-11 0-19 8-19 18 0 7 4 11 7 15 2 3 3 5 3 8h18c0-3 1-5 3-8 3-4 7-8 7-15 0-10-8-18-19-18z" fill="#ffe14d"/>
    <path d="M41 9c5 3 10 8 10 15 0 7-4 11-7 15-2 3-3 5-3 8h-4c0-3 1-5 3-8 3-4 7-8 7-15 0-6-3-11-6-15z" fill="#f5c400"/>
    <path d="M21 19c2-5 6-8 11-8" stroke="#fffbe0" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <path d="M27 42l2-12 3 6 3-6 2 12" stroke="#e08a00" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <rect x="23" y="46" width="18" height="11" rx="3" fill="#9ca3af"/><path d="M23 50h18M23 54h18" stroke="#6b7280" stroke-width="1.8"/><path d="M28 57h8l-1 4h-6z" fill="#4b5563"/>`),
  kindness: svg(`<path d="M32 38C18 29 14 22 16 16c2-7 11-8 16-1 5-7 14-6 16 1 2 6-2 13-16 22z" fill="#ff3b6b"/>
    <ellipse cx="22" cy="19" rx="4" ry="2.6" transform="rotate(-35 22 19)" fill="#ffd0dc"/>
    <path d="M6 38c4 13 14 20 26 20s22-7 26-20c-7 3-15 5-26 5S13 41 6 38z" fill="#f2b98a"/><path d="M32 43v15" stroke="#d9925e" stroke-width="2"/>
    <path d="M10 42c1 3 3 6 5 8M54 42c-1 3-3 6-5 8" stroke="#d9925e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M8 6l1.4 3.6L13 11l-3.6 1.4L8 16l-1.4-3.6L3 11l3.6-1.4zM56 6l1.4 3.6L61 11l-3.6 1.4L56 16l-1.4-3.6L51 11l3.6-1.4z" fill="#ffd34d"/>`),
  dog: svg(`<ellipse cx="14" cy="28" rx="8" ry="15" transform="rotate(20 14 28)" fill="#7a4b26"/><ellipse cx="50" cy="28" rx="8" ry="15" transform="rotate(-20 50 28)" fill="#7a4b26"/>
    <circle cx="32" cy="33" r="20" fill="#d9a066"/><ellipse cx="41" cy="24" rx="7" ry="6" fill="#b9814a"/><ellipse cx="32" cy="43" rx="11" ry="8" fill="#f6dcb8"/>
    <circle cx="25" cy="31" r="3" fill="#1f1f1f"/><circle cx="39" cy="31" r="3" fill="#1f1f1f"/><circle cx="26" cy="30" r="1" fill="#fff"/><circle cx="40" cy="30" r="1" fill="#fff"/>
    <ellipse cx="32" cy="39" rx="4" ry="3" fill="#1f1f1f"/><path d="M30 47h4v4a2 2 0 0 1-4 0z" fill="#ff6b8a"/>
    <path d="M32 42v4M28 46c2 2 6 2 8 0" stroke="#1f1f1f" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M54 4c-2-3-6-1-4 2l4 4 4-4c2-3-2-5-4-2z" fill="#ff3b6b"/>`),
  polarbear: svg(`<circle cx="15" cy="18" r="7" fill="#ffffff"/><circle cx="49" cy="18" r="7" fill="#ffffff"/><circle cx="15" cy="18" r="3.5" fill="#cbd5e1"/><circle cx="49" cy="18" r="3.5" fill="#cbd5e1"/>
    <ellipse cx="32" cy="35" rx="22" ry="20" fill="#ffffff"/><path d="M12 42c4 8 12 13 20 13s16-5 20-13c-5 5-12 7-20 7s-15-2-20-7z" fill="#e2e8f0"/>
    <ellipse cx="32" cy="42" rx="10" ry="8" fill="#eef2f7"/>
    <circle cx="24" cy="31" r="2.6" fill="#111827"/><circle cx="40" cy="31" r="2.6" fill="#111827"/><circle cx="24.8" cy="30.2" r=".8" fill="#fff"/><circle cx="40.8" cy="30.2" r=".8" fill="#fff"/>
    <path d="M28 38h8c0 3-2 5-4 5s-4-2-4-5z" fill="#111827"/><path d="M32 43v3M28 47c2 2 6 2 8 0" stroke="#111827" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M13 52c10 6 28 6 38 0v6c-10 5-28 5-38 0z" fill="#e8283c"/><rect x="40" y="54" width="7" height="10" rx="2" fill="#b5172a"/>`),
  tooth: svg(`<path d="M18 10c6-4 10 0 14 0s8-4 14 0c6 4 6 14 3 22-2 6-2 12-3 20-1 6-6 6-7 0l-2-12c-1-4-4-4-5 0l-2 12c-1 6-6 6-7 0-1-8-1-14-3-20-3-8-3-18 3-22z" fill="#ffffff"/>
    <path d="M46 10c6 4 6 14 3 22-2 6-2 12-3 20-1 6-6 6-7 0 2-8 3-14 5-20 3-8 4-16 2-22z" fill="#e2e8f0"/>
    <circle cx="26" cy="22" r="2.2" fill="#1f2937"/><circle cx="38" cy="22" r="2.2" fill="#1f2937"/><circle cx="22" cy="27" r="2.4" fill="#ffb3c6"/><circle cx="42" cy="27" r="2.4" fill="#ffb3c6"/>
    <path d="M28 27c2 2.5 6 2.5 8 0" stroke="#1f2937" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M55 4l1.6 4.4L61 10l-4.4 1.6L55 16l-1.6-4.4L49 10l4.4-1.6zM8 40l1.3 3.7L13 45l-3.7 1.3L8 50l-1.3-3.7L3 45l3.7-1.3zM56 44l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" fill="#ffd34d"/>`),
  // ---- Voting days ----
  ballot: svg(`<g transform="rotate(-8 32 16)"><rect x="22" y="3" width="20" height="26" rx="2" fill="#ffffff"/>
    <path d="M26 15l4 4 8-9" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    <rect x="8" y="26" width="48" height="32" rx="4" fill="#ffffff"/><rect x="32" y="26" width="24" height="32" rx="4" fill="#e5e9f2"/>
    <rect x="6" y="24" width="52" height="8" rx="3" fill="#e8283c"/><rect x="20" y="26.5" width="24" height="3" rx="1.5" fill="#7a0b1f"/>
    ${STAR5(32, 45, 9, '#2546b8')}`),
  whitehouse: svg(`<ellipse cx="32" cy="58" rx="30" ry="5" fill="#22a447"/>
    <path d="M32 20V7" stroke="#cbd5e1" stroke-width="1.6"/><rect x="32" y="7" width="11" height="7" fill="#e8283c"/><path d="M32 9.3h11M32 11.7h11" stroke="#fff" stroke-width="1.1"/><rect x="32" y="7" width="4.5" height="3.5" fill="#2546b8"/>
    <rect x="5" y="30" width="54" height="25" fill="#ffffff"/><rect x="3" y="27" width="58" height="4" rx="1" fill="#e5e7eb"/>
    <g fill="#94a3b8"><rect x="8" y="35" width="4" height="6"/><rect x="14" y="35" width="4" height="6"/><rect x="46" y="35" width="4" height="6"/><rect x="52" y="35" width="4" height="6"/>
    <rect x="8" y="45" width="4" height="6"/><rect x="14" y="45" width="4" height="6"/><rect x="46" y="45" width="4" height="6"/><rect x="52" y="45" width="4" height="6"/><rect x="29.5" y="44" width="5" height="11"/></g>
    <path d="M19 30L32 19l13 11z" fill="#f1f5f9"/><path d="M23 32v22M27.5 32v22M36.5 32v22M41 32v22" stroke="#d1d5db" stroke-width="2.4"/>`),
  capitol: svg(`<rect x="29.5" y="5" width="5" height="8" fill="#ffffff"/><circle cx="32" cy="4" r="2" fill="#ffffff"/>
    <path d="M17 32c0-13 7-20 15-20s15 7 15 20z" fill="#ffffff"/><path d="M32 12c8 0 15 7 15 20H38c0-12-3-18-6-20z" fill="#e5e9f2"/>
    <path d="M32 13v19M25 16c-2 5-3 10-3 16M39 16c2 5 3 10 3 16" stroke="#d1d5db" stroke-width="1.4" fill="none"/>
    <rect x="15" y="31" width="34" height="13" fill="#ffffff"/><path d="M19 33v10M23.5 33v10M28 33v10M32 33v10M36 33v10M40.5 33v10M45 33v10" stroke="#d1d5db" stroke-width="1.6"/>
    <rect x="3" y="44" width="58" height="12" fill="#ffffff"/><path d="M8 47v8M13 47v8M18 47v8M46 47v8M51 47v8M56 47v8" stroke="#d1d5db" stroke-width="1.8"/>
    <path d="M23 45l9-6 9 6z" fill="#e5e9f2"/><path d="M18 56h28l4 5H14z" fill="#e5e7eb"/>`),
  register: svg(`<rect x="10" y="9" width="40" height="51" rx="5" fill="#a0632e"/><rect x="15" y="15" width="30" height="40" rx="2" fill="#ffffff"/>
    <rect x="22" y="5" width="16" height="9" rx="3" fill="#9ca3af"/>
    <g fill="none" stroke="#2546b8" stroke-width="1.6"><rect x="19" y="22" width="6" height="6" rx="1"/><rect x="19" y="32" width="6" height="6" rx="1"/><rect x="19" y="42" width="6" height="6" rx="1"/></g>
    <path d="M29 25h12M29 35h12M29 45h9" stroke="#cbd5e1" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M19 24l3 3 6-7M19 34l3 3 6-7" stroke="#16a34a" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M52 28l7 7-17 17-8 1 1-8z" fill="#ffc531"/><path d="M52 28l7 7-3 3-7-7z" fill="#ff8fa3"/><path d="M35 45l-1 8 8-1z" fill="#f6d1a3"/><path d="M34 51l-.4 2 2-.4z" fill="#374151"/>`),
  // ---- Fun days, March to December ----
  book: svg(`<path d="M3 13h26l3 3 3-3h26v43H35l-3 3-3-3H3z" fill="#e8283c"/>
    <path d="M32 16c-8-5-18-6-26-4v38c8-2 18-1 26 4z" fill="#ffffff"/><path d="M32 16c8-5 18-6 26-4v38c-8-2-18-1-26 4z" fill="#eef2f7"/>
    <path d="M32 16v38" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M11 21c6-1 12 0 16 2M11 28c6-1 12 0 16 2M11 35c6-1 12 0 16 2M11 42c6-1 12 0 12 1M37 23c4-2 10-3 16-2M37 30c4-2 10-3 16-2M37 37c4-2 10-3 16-2" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M56 2l1.4 3.6L61 7l-3.6 1.4L56 12l-1.4-3.6L51 7l3.6-1.4z" fill="#ffd34d"/>`),
  pi: svg(`<circle cx="32" cy="32" r="27" fill="#ffffff"/><circle cx="32" cy="32" r="25" fill="none" stroke="#ffc531" stroke-width="4"/>
    <path d="M16 25c4-5 8-5 32-5" stroke="#1d4ed8" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    <path d="M26 21c0 10-2 18-6 23" stroke="#1d4ed8" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    <path d="M38 21c-1 10 0 19 3 22 2 1.5 4.5 0 5.5-2" stroke="#1d4ed8" stroke-width="5.5" fill="none" stroke-linecap="round"/>`),
  sandwich: svg(`<path d="M9 35h46v12c0 4-3 7-7 7H16c-4 0-7-3-7-7z" fill="#f3c27a"/><path d="M9 35h46v12c0 4-3 7-7 7H16c-4 0-7-3-7-7z" fill="none" stroke="#c98a3a" stroke-width="2.5"/>
    <path d="M8 30h48c0 4-3 7-6 7H14c-3 0-6-3-6-7z" fill="#8b2fc9"/><path d="M20 35c0 7 5 7 5 0M40 35c0 5 4 5 4 0" stroke="#8b2fc9" stroke-width="4" stroke-linecap="round"/>
    <rect x="8" y="26" width="48" height="6" rx="3" fill="#c9862f"/>
    <path d="M10 28c-4-11 4-19 22-19s26 8 22 19z" fill="#f3c27a"/><path d="M10 28c-4-11 4-19 22-19s26 8 22 19" fill="none" stroke="#c98a3a" stroke-width="2.5"/>
    <path d="M20 17c4-3 9-4 14-4" stroke="#fde3b5" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  grilledcheese: svg(`<rect x="8" y="32" width="48" height="17" rx="6" fill="#d38f35"/><rect x="8" y="11" width="48" height="17" rx="6" fill="#e0a046"/>
    <path d="M16 17h10M32 21h12M14 23h6" stroke="#c07a26" stroke-width="2.4" stroke-linecap="round"/><path d="M18 40h8M34 43h10" stroke="#b06a1e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M6 26h52v6c0 2-2 2-3 0 0 6-6 6-6 0H39c0 9-6 9-6 0H22c0 6-5 6-5 0H9c-2 0-3-2-3-4z" fill="#ffc531"/>`),
  earth: svg(`<circle cx="32" cy="32" r="27" fill="#3ba7ff"/>
    <path d="M14 18c6-2 10 2 9 7-1 4 4 6 2 10-2 5-8 3-9 8-1 3-4 0-5-3-2-7-1-17 3-22z" fill="#22a447"/>
    <path d="M36 10c6 0 14 4 16 10-4 0-6 3-4 6 2 4-2 7-6 5-3-2-6 0-5 4 1 5-3 9-6 7-2-2 0-6-2-9-2-4-6-3-6-7 0-5 6-6 8-10 1-2 2-4 5-6z" fill="#22a447"/>
    <path d="M28 50c4-2 9-1 12 2-3 3-8 4-12 2z" fill="#22a447"/><path d="M32 5a27 27 0 0 1 0 54c10-8 14-17 14-27S42 13 32 5z" fill="#00000022"/>
    <ellipse cx="21" cy="15" rx="6" ry="3.5" transform="rotate(-30 21 15)" fill="#ffffff55"/>`),
  pretzel: svg(`<g fill="none" stroke-linecap="round"><path d="M32 52C12 52 6 36 12 24 18 12 30 14 32 26M32 52C52 52 58 36 52 24 46 12 34 14 32 26M32 26C30 34 22 40 17 47M32 26C34 34 42 40 47 47" stroke="#b5651d" stroke-width="8"/>
    <path d="M15 22c3-5 8-7 12-5M49 22c-3-5-8-7-12-5" stroke="#d98a3a" stroke-width="2.4"/></g>
    <g fill="#ffffff"><rect x="12" y="32" width="2.6" height="2.6" rx=".6"/><rect x="20" y="16" width="2.6" height="2.6" rx=".6"/><rect x="44" y="18" width="2.6" height="2.6" rx=".6"/><rect x="50" y="36" width="2.6" height="2.6" rx=".6"/><rect x="31" y="50" width="2.6" height="2.6" rx=".6"/><rect x="24" y="38" width="2.6" height="2.6" rx=".6"/><rect x="38" y="38" width="2.6" height="2.6" rx=".6"/></g>`),
  oak: svg(`<ellipse cx="32" cy="60" rx="20" ry="3" fill="#16a34a"/><path d="M28 60V40h8v20z" fill="#8b5a2b"/>
    <path d="M32 46l-9-7M32 43l8-7" stroke="#8b5a2b" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="20" cy="28" r="12" fill="#22a447"/><circle cx="44" cy="28" r="12" fill="#22a447"/><circle cx="32" cy="18" r="13" fill="#2fbf5b"/><circle cx="32" cy="33" r="11" fill="#1f8f45"/>
    <circle cx="26" cy="14" r="4" fill="#5ed47e"/><circle cx="15" cy="25" r="3" fill="#4cc56e"/>`),
  planet: svg(`${STAR5(9, 10, 4, '#ffffff')}${STAR5(55, 52, 3.5, '#ffffff')}<circle cx="54" cy="9" r="1.6" fill="#fff"/><circle cx="8" cy="50" r="1.4" fill="#fff"/>
    <ellipse cx="32" cy="32" rx="29" ry="8" transform="rotate(-20 32 32)" fill="none" stroke="#c4b5fd" stroke-width="4"/>
    <circle cx="32" cy="32" r="16" fill="#ff8a3d"/><path d="M18 26c8 3 20 3 28 0M17 36c8 3 22 3 30 0" stroke="#ffb27a" stroke-width="3" fill="none"/>
    <path d="M4.7 41.9A29 8 -20 0 0 59.3 22.1" fill="none" stroke="#c4b5fd" stroke-width="4"/>`),
  comic: svg(`${burst(32, 32, 30, 20, 14, '#e8283c')}${burst(32, 32, 25, 16, 14, '#ffd34d')}
    <text x="32" y="38" text-anchor="middle" font-family="Fredoka, Arial Black, sans-serif" font-weight="700" font-size="16" fill="#e8283c">POW!</text>`),
  apple: svg(`<path d="M32 18c-4-4-14-6-20 2-6 9-2 26 6 32 4 3 8 3 10 1 2-1 6-1 8 0 2 2 6 2 10-1 8-6 12-23 6-32-6-8-16-6-20-2z" fill="#e8283c"/>
    <path d="M32 18c4-4 14-6 20 2 6 9 2 26-6 32-4 3-8 3-10 1 8-6 12-20 8-30-2-4-6-6-12-5z" fill="#b5172a"/>
    <path d="M32 19c0-6 2-9 4-12" stroke="#7a4b26" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M35 12c4-6 12-6 14-3-4 5-10 6-14 3z" fill="#22a447"/>
    <ellipse cx="20" cy="28" rx="3" ry="6" transform="rotate(20 20 28)" fill="#ff8a8a"/>`),
  burger: svg(`<path d="M8 48h48v3c0 4-3 6-7 6H15c-4 0-7-2-7-6z" fill="#e0983e"/><rect x="7" y="38" width="50" height="10" rx="5" fill="#7a3b10"/>
    <path d="M8 35h48l-6 7-4-4-6 6-6-6-6 6-6-6-4 4z" fill="#ffc531"/>
    <path d="M6 30h52v4c-2 2-4-1-6 1s-4-1-6 1-4-1-6 1-4-1-6 1-4-1-6 1-4-1-6 1-4-1-6 1-4-1-6-1z" fill="#22c55e"/>
    <path d="M8 31c0-12 11-20 24-20s24 8 24 20z" fill="#e8a54b"/><path d="M18 18c3-3 8-4 12-4" stroke="#f6c98a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g fill="#fff6d5"><ellipse cx="22" cy="22" rx="1.8" ry="1.1"/><ellipse cx="32" cy="17" rx="1.8" ry="1.1"/><ellipse cx="42" cy="22" rx="1.8" ry="1.1"/><ellipse cx="30" cy="25" rx="1.8" ry="1.1"/><ellipse cx="40" cy="15" rx="1.8" ry="1.1"/></g>`),
  donut: svg(`<path d="M8 34a24 24 0 1 0 48 0a24 24 0 1 0-48 0zM25 34a7 7 0 1 0 14 0a7 7 0 1 0-14 0z" fill="#e0a046" fill-rule="evenodd"/>
    <path d="M12 33a20 19 0 1 0 40 0a20 19 0 1 0-40 0zM23.5 33a8.5 8 0 1 0 17 0a8.5 8 0 1 0-17 0z" fill="#ff7ab6" fill-rule="evenodd"/>
    <g fill="#ff7ab6"><circle cx="15" cy="42" r="3.4"/><circle cx="24" cy="49" r="3"/><circle cx="41" cy="50" r="3.4"/><circle cx="50" cy="41" r="3"/></g>
    <g stroke-width="2.2" stroke-linecap="round"><path d="M18 26l3-2" stroke="#ffd34d"/><path d="M28 18l3 1" stroke="#3ba7ff"/><path d="M40 20l2 3" stroke="#ffffff"/><path d="M46 30l3-1" stroke="#2fd38a"/>
    <path d="M44 42l2 2" stroke="#ffd34d"/><path d="M30 46l3-1" stroke="#ffffff"/><path d="M18 36l1 3" stroke="#8a3ff0"/><path d="M36 15l-2 2" stroke="#2fd38a"/></g>`),
  cheese: svg(`<path d="M6 30L44 14l14 16z" fill="#ffe066"/><path d="M6 30h52v22H6z" fill="#ffc531"/><path d="M44 14l14 16v22l-14-8z" fill="#00000010"/>
    <g fill="#e6a800"><circle cx="17" cy="40" r="4"/><circle cx="33" cy="46" r="3"/><circle cx="48" cy="39" r="3.6"/><circle cx="27" cy="36" r="2"/><ellipse cx="36" cy="22" rx="3" ry="1.6"/><ellipse cx="24" cy="26" rx="2.4" ry="1.2"/></g>`),
  icecream: svg(`<path d="M20 32h24L32 60z" fill="#e8a54b"/><path d="M24 36l10 13M30 33l8 9M22 41l5 6M40 36l-10 13M34 33l-8 9M42 41l-5 6" stroke="#c9862f" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M16 33c-3 0-4-4-1-6 0-10 8-16 17-16s17 6 17 16c3 2 2 6-1 6z" fill="#7a3b10"/>
    <path d="M23 33c0 5 4 5 4 0M37 33c0 7 4 7 4 0" stroke="#7a3b10" stroke-width="3.6" stroke-linecap="round"/>
    <ellipse cx="24" cy="19" rx="4" ry="2.4" transform="rotate(-30 24 19)" fill="#a0603a"/>
    <g stroke-width="2" stroke-linecap="round"><path d="M20 26l2-1" stroke="#ff7ab6"/><path d="M30 22l2 1" stroke="#ffd34d"/><path d="M40 25l1 2" stroke="#3ba7ff"/><path d="M27 29l2 0" stroke="#2fd38a"/></g>
    <circle cx="33" cy="9" r="4.5" fill="#e8283c"/><path d="M34 5c1-3 3-4 5-4" stroke="#7a4b26" stroke-width="1.6" fill="none" stroke-linecap="round"/>`),
  friends: svg(`<circle cx="21" cy="30" r="15" fill="#ffc531"/><circle cx="43" cy="34" r="15" fill="#ff8fb5"/>
    <circle cx="16" cy="28" r="2" fill="#7a4b00"/><circle cx="25" cy="28" r="2" fill="#7a4b00"/><path d="M15 34c3 4 9 4 12 0" stroke="#7a4b00" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="32" r="2" fill="#8a1c47"/><circle cx="47" cy="32" r="2" fill="#8a1c47"/><path d="M37 38c3 4 9 4 12 0" stroke="#8a1c47" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M32 12c-2-4-8-3-6 1l6 5 6-5c2-4-4-5-6-1z" fill="#e8283c"/>`),
  picnic: svg(`<path d="M18 28c0-16 28-16 28 0" stroke="#8b5a2b" stroke-width="4" fill="none"/>
    <circle cx="24" cy="24" r="6" fill="#e8283c"/><path d="M36 26c0-8 6-10 10-8" stroke="#f3c27a" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M8 30h48l-5 26H13z" fill="#d9813a"/><path d="M11 38h42M12 46h40M20 30l-2 26M32 30v26M44 30l2 26" stroke="#b5651d" stroke-width="2"/>
    <rect x="6" y="27" width="52" height="7" rx="2" fill="#ffffff"/><g fill="#e8283c"><rect x="6" y="27" width="6.5" height="3.5"/><rect x="19.5" y="27" width="6.5" height="3.5"/><rect x="32.5" y="27" width="6.5" height="3.5"/><rect x="45.5" y="27" width="6.5" height="3.5"/>
    <rect x="12.5" y="30.5" width="7" height="3.5"/><rect x="26" y="30.5" width="6.5" height="3.5"/><rect x="39" y="30.5" width="6.5" height="3.5"/><rect x="52" y="30.5" width="6" height="3.5"/></g>`),
  phone: svg(`<rect x="16" y="4" width="32" height="56" rx="7" fill="#1f2937"/><rect x="19" y="10" width="26" height="44" rx="3" fill="#7dd3fc"/>
    <circle cx="32" cy="7" r="1.4" fill="#4b5563"/><circle cx="32" cy="30" r="10" fill="#ffc531"/>
    <circle cx="28.5" cy="28" r="1.6" fill="#7a4b00"/><circle cx="35.5" cy="28" r="1.6" fill="#7a4b00"/><path d="M27 32c3 4 7 4 10 0" stroke="#7a4b00" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="22" y="45" width="20" height="4" rx="2" fill="#ffffff"/>
    <path d="M55 6l1.4 3.6L60 11l-3.6 1.4L55 16l-1.4-3.6L50 11l3.6-1.4z" fill="#ffd34d"/><path d="M8 40l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8L4.2 43.8l2.8-1z" fill="#ffffff"/>`),
  sunglasses: svg(`<circle cx="52" cy="10" r="6" fill="#ffd34d"/>${rays(52, 10, 8, 11, 8, '#ffd34d', 2)}
    <path d="M6 25h22c0 12-4 18-11 18S6 37 6 25z" fill="#111827"/><path d="M36 25h22c0 12-4 18-11 18s-11-6-11-18z" fill="#111827"/>
    <path d="M28 27c2-2 6-2 8 0" stroke="#e8283c" stroke-width="3" fill="none"/><rect x="4" y="22" width="56" height="5" rx="2.5" fill="#e8283c"/>
    <path d="M11 30l5 7M41 30l5 7" stroke="#ffffff88" stroke-width="2.6" stroke-linecap="round"/>`),
  chocolate: svg(`<rect x="12" y="6" width="40" height="26" rx="3" fill="#7a3b10"/><path d="M25.3 6v24M38.6 6v24M12 18h40" stroke="#5a2a08" stroke-width="2"/>
    <path d="M14 8h9v8h-9zM27.3 8h9v8h-9z" fill="#8b4a1c"/>
    <rect x="12" y="28" width="40" height="32" rx="3" fill="#e8283c"/><rect x="12" y="38" width="40" height="11" fill="#ffd34d"/>
    <path d="M12 28l5-3 5 3 5-3 5 3 5-3 5 3 5-3 5 3v3H12z" fill="#e5e7eb"/>${STAR5(32, 43.5, 4.5, '#e8283c')}`),
  moon: svg(`${STAR5(9, 12, 3.5, '#ffffff')}${STAR5(56, 44, 3, '#ffffff')}<circle cx="10" cy="50" r="1.4" fill="#fff"/>
    <circle cx="32" cy="36" r="23" fill="#e5e7eb"/><path d="M32 13a23 23 0 0 1 0 46c9-6 13-14 13-23s-4-17-13-23z" fill="#cbd5e1"/>
    <g fill="#cbd5e1"><circle cx="22" cy="30" r="4.5"/><circle cx="34" cy="46" r="5.5"/><circle cx="21" cy="46" r="2.5"/><circle cx="38" cy="26" r="2.5"/></g>
    <path d="M36 14V2" stroke="#9ca3af" stroke-width="1.6"/><rect x="36" y="2" width="11" height="7" fill="#e8283c"/><path d="M36 4.3h11M36 6.7h11" stroke="#fff" stroke-width="1.1"/><rect x="36" y="2" width="4.5" height="3.5" fill="#2546b8"/>`),
  cookie: svg(`<circle cx="32" cy="32" r="25" fill="#d9a066"/><circle cx="32" cy="32" r="25" fill="none" stroke="#c08245" stroke-width="2.5"/>
    <g fill="#5a2a08"><ellipse cx="22" cy="22" rx="3.4" ry="2.8"/><ellipse cx="38" cy="18" rx="3" ry="2.5"/><ellipse cx="44" cy="32" rx="3.4" ry="2.8"/><ellipse cx="28" cy="34" rx="3" ry="2.6"/>
    <ellipse cx="20" cy="42" rx="3" ry="2.5"/><ellipse cx="36" cy="46" rx="3.4" ry="2.8"/><ellipse cx="46" cy="44" rx="2.2" ry="1.8"/><ellipse cx="14" cy="31" rx="2.2" ry="1.8"/></g>`),
  bracelet: svg(`<circle cx="32" cy="30" r="19" fill="none" stroke="#a78bdb" stroke-width="1.6"/>
    ${['#ff3b4e', '#ffd34d', '#2fd38a', '#3ba7ff', '#ff4fa3', '#8a3ff0', '#ff8a1f', '#22e0d0', '#ff3b4e', '#ffd34d', '#2fd38a', '#3ba7ff'].map((c, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 6;
      return i === 6 ? '' : `<circle cx="${(32 + 19 * Math.cos(a)).toFixed(1)}" cy="${(30 + 19 * Math.sin(a)).toFixed(1)}" r="5" fill="${c}"/><circle cx="${(30.8 + 19 * Math.cos(a)).toFixed(1)}" cy="${(28.8 + 19 * Math.sin(a)).toFixed(1)}" r="1.4" fill="#ffffff99"/>`;
    }).join('')}
    <path d="M32 61C22 54 20 50 21.5 46.5c1.5-3.5 7-4 10.5 0 3.5-4 9-3.5 10.5 0C44 50 42 54 32 61z" fill="#ff3b6b"/>`),
  cat: svg(`<path d="M11 28L13 5l17 13z" fill="#f59e0b"/><path d="M53 28L51 5 34 18z" fill="#f59e0b"/><path d="M15 22l1-11 8 7z" fill="#ffb3c6"/><path d="M49 22l-1-11-8 7z" fill="#ffb3c6"/>
    <ellipse cx="32" cy="36" rx="23" ry="20" fill="#f59e0b"/><path d="M32 16v8M25 17l1.5 6M39 17l-1.5 6" stroke="#c2410c" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="23" cy="35" rx="4.5" ry="5.5" fill="#22c55e"/><ellipse cx="41" cy="35" rx="4.5" ry="5.5" fill="#22c55e"/><ellipse cx="23" cy="35" rx="1.5" ry="4.5" fill="#111"/><ellipse cx="41" cy="35" rx="1.5" ry="4.5" fill="#111"/>
    <path d="M29.5 42h5l-2.5 3z" fill="#ff6b8a"/><path d="M32 45c0 2-3 3.5-5 2M32 45c0 2 3 3.5 5 2" stroke="#7c2d12" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M4 41l13 1M5 48l12-2.5M60 41l-13 1M59 48l-12-2.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>`),
  smores: svg(`<rect x="8" y="41" width="48" height="12" rx="3" fill="#d9a066"/><rect x="11" y="36" width="42" height="7" rx="2" fill="#7a3b10"/>
    <rect x="12" y="22" width="40" height="16" rx="7" fill="#ffffff"/><path d="M14 27c6-4 30-4 36 0" stroke="#e8a54b" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <rect x="8" y="10" width="48" height="13" rx="3" fill="#e0a85c"/>
    <g fill="#b97a35"><circle cx="16" cy="16.5" r="1.3"/><circle cx="26" cy="16.5" r="1.3"/><circle cx="38" cy="16.5" r="1.3"/><circle cx="48" cy="16.5" r="1.3"/><circle cx="16" cy="47" r="1.3"/><circle cx="26" cy="47" r="1.3"/><circle cx="38" cy="47" r="1.3"/><circle cx="48" cy="47" r="1.3"/></g>
    <path d="M32 10v13" stroke="#c98a3a" stroke-width="1.4"/>`),
  hand: svg(`<path d="M7 13c-3 4-3 10 0 14M12 17c-2 3-2 6 0 9" stroke="#ffffff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <rect x="16" y="13" width="7.5" height="26" rx="3.75" fill="#f6c28b"/><rect x="24.5" y="7" width="7.5" height="30" rx="3.75" fill="#f6c28b"/><rect x="33" y="8" width="7.5" height="29" rx="3.75" fill="#f6c28b"/>
    <rect x="41.5" y="14" width="7" height="24" rx="3.5" fill="#f6c28b"/><rect x="45" y="30" width="7.5" height="19" rx="3.75" transform="rotate(38 48.7 39.5)" fill="#f6c28b"/>
    <path d="M16 31h32.5v11c0 10-7 17-16.5 17S16 52 16 42z" fill="#f6c28b"/><path d="M23 44c4 3 10 3 15 0" stroke="#d9925e" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  coaster: svg(`<path d="M8 48v12M15 31v29M23 21v39M31 32v28M39 48v12M47 30v30M55 15v45" stroke="#9ca3af" stroke-width="2.2"/>
    <path d="M2 50C10 50 13 20 22 20s12 30 19 30 9-38 21-38" stroke="#e8283c" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <rect x="14" y="11" width="16" height="8" rx="3" fill="#3ba7ff"/><circle cx="18.5" cy="9" r="3" fill="#ffc531"/><circle cx="25.5" cy="9" r="3" fill="#f6c28b"/>
    <path d="M15 8l-3-5M28 8l3-5" stroke="#ffc531" stroke-width="2" stroke-linecap="round"/>
    <circle cx="17.5" cy="19.5" r="2" fill="#1f2937"/><circle cx="26.5" cy="19.5" r="2" fill="#1f2937"/>`),
  clay: svg(`<path d="M16 31c2-9 30-9 32 0z" fill="#3ba7ff"/><path d="M14 34h36l-3 24H17z" fill="#ffd34d"/><rect x="12" y="30" width="40" height="6" rx="3" fill="#e8283c"/>
    <path d="M18 40h28" stroke="#ffffff" stroke-width="2"/>
    <path d="M2 56c0-6 7-8 11-5 3 3 0 8-5 8-4 0-6-1-6-3z" fill="#22c55e"/><circle cx="56" cy="52" r="6" fill="#ff7ab6"/><circle cx="54" cy="50" r="1.8" fill="#ffc2dd"/>
    <path d="M44 14c4-6 12-2 8 3s-12 0-8-3z" fill="#ff8a1f"/><path d="M8 16c6 0 6 6 12 6" stroke="#8a3ff0" stroke-width="5" fill="none" stroke-linecap="round"/>`),
  pirate: svg(`<g fill="#ffc531" stroke="#d99a00" stroke-width="1.4"><circle cx="16" cy="52" r="6"/><circle cx="28" cy="55" r="6"/><circle cx="48" cy="52" r="6"/></g>
    <path d="M4 40c6-16 16-24 28-24s22 8 28 24c-8-4-16-6-28-6S12 36 4 40z" fill="#1f2937"/>
    <path d="M8 37c8-4 16-5 24-5s16 1 24 5" stroke="#ffd34d" stroke-width="2.6" fill="none"/>
    <path d="M26 31l12-6M26 25l12 6" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="32" cy="23" r="5.5" fill="#ffffff"/><rect x="29.5" y="26" width="5" height="3.5" rx="1" fill="#ffffff"/>
    <circle cx="30" cy="22.5" r="1.4" fill="#1f2937"/><circle cx="34" cy="22.5" r="1.4" fill="#1f2937"/>`),
  door: svg(`<path d="M-2 56C4 30 18 18 32 18s28 12 34 38z" fill="#22a447"/><path d="M6 30c3-4 6-6 9-7M50 24c3 2 6 5 8 8" stroke="#5ed47e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="41" r="16" fill="#8b5a2b"/><circle cx="32" cy="41" r="13" fill="#16a34a"/>
    <path d="M26 29v26M32 28v27M38 29v26" stroke="#15803d" stroke-width="1.5"/><circle cx="32" cy="41" r="2.6" fill="#ffc531"/>
    <rect x="-2" y="55" width="68" height="11" fill="#3f7a0a"/>
    <g fill="#ff7ab6"><circle cx="9" cy="52" r="2"/><circle cx="55" cy="52" r="2"/></g><g fill="#ffd34d"><circle cx="13" cy="54" r="1.8"/><circle cx="51" cy="54" r="1.8"/></g>`),
  mug: svg(`<path d="M20 15c-3-3 3-5 0-8M28 15c-3-3 3-5 0-8M36 15c-3-3 3-5 0-8" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M44 28c10 0 10 18 0 18" stroke="#e8283c" stroke-width="6" fill="none"/><rect x="10" y="20" width="36" height="38" rx="7" fill="#e8283c"/>
    <path d="M38 20h8v31a7 7 0 0 1-7 7h-6c3-2 5-5 5-8z" fill="#b5172a"/><ellipse cx="28" cy="22" rx="16" ry="4" fill="#7a3b10"/>
    <rect x="18" y="16" width="7" height="6" rx="1.6" fill="#ffffff"/><rect x="28" y="15" width="7" height="6" rx="1.6" fill="#ffffff"/><rect x="23" y="18" width="6" height="5" rx="1.4" fill="#f1f5f9"/>
    <path d="M28 46c-6-4-7-7-6-9 1-2 4-3 6 0 2-3 5-2 6 0 1 2 0 5-6 9z" fill="#ffffff"/>`),
  taco: svg(`<path d="M6 46C6 28 18 15 32 15s26 13 26 31" stroke="#22c55e" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="7 2"/>
    <g fill="#e8283c"><circle cx="16" cy="26" r="3"/><circle cx="30" cy="17" r="3"/><circle cx="44" cy="20" r="3"/><circle cx="52" cy="32" r="3"/></g>
    <path d="M10 48C10 30 20 20 32 20s22 10 22 28z" fill="#ffc531"/><path d="M32 20c12 0 22 10 22 28H42c0-16-4-24-10-28z" fill="#f5b301"/>
    <g fill="#e09a00"><circle cx="20" cy="36" r="1.4"/><circle cx="28" cy="30" r="1.4"/><circle cx="26" cy="42" r="1.4"/><circle cx="38" cy="34" r="1.4"/><circle cx="46" cy="42" r="1.4"/></g>`),
  longship: svg(`<path d="M32 40V5" stroke="#5a3518" stroke-width="2.6"/><path d="M17 9h30l-2 25H19z" fill="#ffffff"/><path d="M23 9l-.8 25M32 9v25M41 9l.8 25" stroke="#e8283c" stroke-width="4.5"/>
    <path d="M4 40h56c-4 10-14 14-28 14S8 50 4 40z" fill="#8b5a2b"/><path d="M4 41c-3-9 0-16 7-18 2 2 0 5-2 6 1 4 1 7-1 12z" fill="#8b5a2b"/><circle cx="8" cy="26.5" r="1.1" fill="#ffd34d"/>
    <path d="M60 41c3-9 0-14-5-16 0 3 1 7-1 16z" fill="#8b5a2b"/>
    ${[13, 22, 31, 40, 49].map((x, i) => `<circle cx="${x}" cy="43" r="4" fill="${i % 2 ? '#ffd34d' : '#e8283c'}"/><circle cx="${x}" cy="43" r="1.2" fill="#5a3518"/>`).join('')}
    <path d="M0 58c5-3 9 3 14 0s9 3 14 0 9 3 14 0 9 3 14 0 6 2 8 1" stroke="#bfe7ff" stroke-width="3" fill="none" stroke-linecap="round"/>`),
  cupcake: svg(`<path d="M16 36h32l-4 22H20z" fill="#3ba7ff"/><path d="M22 36l2 22M28 36l1 22M34 36v22M40 36l-1.4 22" stroke="#1d4ed8" stroke-width="1.6"/>
    <path d="M13 38c-4-6 2-12 8-10 0-8 8-12 14-8 6-4 14 2 12 8 6 0 9 8 3 10z" fill="#ff7ab6"/><path d="M19 30c4-1 8 0 12-2M27 22c4-1 7 0 10-1" stroke="#ffb3d4" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="13" r="5" fill="#e8283c"/><path d="M35 8c1-3 3-5 6-5" stroke="#7a4b26" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g stroke-width="2" stroke-linecap="round"><path d="M20 33l2-1" stroke="#ffd34d"/><path d="M42 31l2 1" stroke="#3ba7ff"/><path d="M30 31l2 0" stroke="#2fd38a"/><path d="M38 24l1 2" stroke="#ffffff"/></g>`),
  candycorn: svg(`<g stroke-linejoin="round" stroke-width="5"><path d="M32 6L25 22h14z" fill="#ffffff" stroke="#ffffff"/><path d="M25 22h14l7.8 18H17.2z" fill="#ff8a1f" stroke="#ff8a1f"/>
    <path d="M17.2 40h29.6L52 52Q32 60 12 52z" fill="#ffd34d" stroke="#ffd34d"/></g><path d="M27 14l-5 14" stroke="#ffffff99" stroke-width="2.4" stroke-linecap="round"/>`),
  flask: svg(`<path d="M26 6h12v16l14 26c2 5-1 10-6 10H18c-5 0-8-5-6-10l14-26z" fill="#ffffff"/>
    <path d="M15.2 42h33.6l3.2 6c2 5-1 10-6 10H18c-5 0-8-5-6-10z" fill="#22c55e"/><rect x="23" y="3" width="18" height="5" rx="2.5" fill="#cbd5e1"/>
    <g fill="#bbf7d0"><circle cx="26" cy="49" r="2.2"/><circle cx="37" cy="52" r="1.6"/><circle cx="31" cy="36" r="2"/><circle cx="34" cy="28" r="1.4"/></g>
    ${rays(52, 12, 3, 8, 8, '#ffd34d', 2.2)}<path d="M28 12v8" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round"/>`),
  recycle: svg(`<rect x="10" y="10" width="44" height="7" rx="3" fill="#15803d"/><rect x="27" y="6" width="10" height="5" rx="2" fill="#15803d"/><path d="M14 17h36l-4 41H18z" fill="#16a34a"/>
    <path d="M23 38A9 9 0 0 1 35.1 29.5M41 38A9 9 0 0 1 28.9 46.5" stroke="#ffffff" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M38.9 30.9L33.9 32.8 36.3 26.2zM25.1 45.1L30.1 43.2 27.7 49.8z" fill="#ffffff"/>`),
  mountain: svg(`<circle cx="50" cy="12" r="6" fill="#ffd34d"/><path d="M2 56L22 18l12 18 8-10 20 30z" fill="#64748b"/><path d="M22 18l12 18 8-10 20 30H34z" fill="#00000018"/>
    <path d="M22 18l-5.8 11 3.8-2 3 3 3-3 3.3 2z" fill="#ffffff"/><path d="M42 26l-4 5 2-1 2 2 2-2 1.3 1z" fill="#ffffff"/>
    <path d="M14 56c6-6 2-10 10-14" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
    <path d="M6 56l4-9 4 9zM50 56l4-10 4 10z" fill="#16a34a"/>`),
  fibo: svg(`${fibo()}`),
  shop: svg(`<rect x="6" y="6" width="52" height="7" rx="2" fill="#7a3b10"/><rect x="8" y="22" width="48" height="34" fill="#fde68a"/>
    <path d="M6 13h52v9H6z" fill="#e8283c"/><g fill="#ffffff"><rect x="13" y="13" width="6.5" height="9"/><rect x="26" y="13" width="6.5" height="9"/><rect x="39" y="13" width="6.5" height="9"/><rect x="52" y="13" width="6" height="9"/></g>
    ${[9.25, 15.75, 22.25, 28.75, 35.25, 41.75, 48.25, 54.75].map((x, i) => `<circle cx="${x}" cy="22" r="3.25" fill="${i % 2 ? '#ffffff' : '#e8283c'}"/>`).join('')}
    <rect x="12" y="32" width="18" height="14" rx="1.5" fill="#bfe7ff"/><path d="M21 43c-5-3-6-5-5-7 1-2 4-2 5 0 1-2 4-2 5 0 1 2 0 4-5 7z" fill="#ff3b6b"/>
    <rect x="36" y="32" width="14" height="24" rx="1.5" fill="#8b5a2b"/><circle cx="46" cy="45" r="1.4" fill="#ffd34d"/><rect x="4" y="55" width="56" height="4" rx="2" fill="#9ca3af"/>`),
  ninja: svg(`<circle cx="32" cy="33" r="24" fill="#1f2937"/><rect x="12" y="25" width="40" height="13" rx="6.5" fill="#f6c28b"/>
    <ellipse cx="25" cy="32" rx="2.6" ry="3" fill="#111"/><ellipse cx="39" cy="32" rx="2.6" ry="3" fill="#111"/><circle cx="25.8" cy="31.2" r=".8" fill="#fff"/><circle cx="39.8" cy="31.2" r=".8" fill="#fff"/>
    <path d="M20 28l8 2M44 28l-8 2" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="9" y="17" width="46" height="6" rx="3" fill="#e8283c"/><path d="M54 20c4 0 7-4 8-8M54 21c5 2 7 6 8 10" stroke="#e8283c" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M24 46c5 2 11 2 16 0" stroke="#374151" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  clock: svg(`<circle cx="32" cy="34" r="25" fill="#ffffff"/><circle cx="32" cy="34" r="25" fill="none" stroke="#8a3ff0" stroke-width="5"/>
    ${rays(32, 34, 17, 20.5, 12, '#8a3ff0', 2.6)}<path d="M32 34V19M32 34l9 6" stroke="#1f2937" stroke-width="3.2" stroke-linecap="round"/><circle cx="32" cy="34" r="2.6" fill="#e8283c"/>
    <rect x="28" y="3" width="8" height="5" rx="2" fill="#8a3ff0"/>
    <path d="M6 7l1.4 3.6L11 12l-3.6 1.4L6 17l-1.4-3.6L1 12l3.6-1.4zM58 4l1.2 3L62 8.2l-2.8 1L58 12l-1.2-2.8-2.8-1L56.8 7z" fill="#ffd34d"/>`),
  scroll: svg(`<rect x="14" y="10" width="36" height="44" fill="#fdf0c8"/>
    <path d="M22 17c3-2 5 2 8 0s5 2 8 0 4 2 6 0" stroke="#7a5b2b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M19 23h26M19 28h26M19 33h22M19 38h26M19 43h16" stroke="#a0855b" stroke-width="1.8" stroke-linecap="round"/><circle cx="43" cy="46" r="4" fill="#e8283c"/>
    <rect x="10" y="5" width="44" height="8" rx="4" fill="#e9d5a1"/><rect x="10" y="51" width="44" height="8" rx="4" fill="#e9d5a1"/>
    <g fill="#c9a66b"><circle cx="10" cy="9" r="4"/><circle cx="54" cy="9" r="4"/><circle cx="10" cy="55" r="4"/><circle cx="54" cy="55" r="4"/></g>`),
  sweater: svg(`<path d="M20 10L6 18l6 17 6-3v26h28V32l6 3 6-17-14-8c-2 4-6 6-12 6s-10-2-12-6z" fill="#e8283c"/>
    <path d="M20 10c2 4 6 6 12 6s10-2 12-6" stroke="#16a34a" stroke-width="4" fill="none"/><rect x="18" y="52" width="28" height="6" fill="#16a34a"/>
    <path d="M6 18l6 17M58 18l-6 17" stroke="#16a34a" stroke-width="0"/>
    <path d="M18 24l3.5 3.5L25 24l3.5 3.5L32 24l3.5 3.5L39 24l3.5 3.5L46 24" stroke="#ffffff" stroke-width="2" fill="none"/>
    <path d="M32 31l-8 15h16z" fill="#16a34a"/><rect x="30.5" y="46" width="3" height="3" fill="#8b5a2b"/>${STAR5(32, 31, 3.2, '#ffd34d')}
    <g fill="#ffffff"><circle cx="21" cy="38" r="1.6"/><circle cx="43" cy="38" r="1.6"/><circle cx="22" cy="46" r="1.6"/><circle cx="42" cy="46" r="1.6"/></g>
    <g fill="#ffd34d"><circle cx="29" cy="41" r="1.2"/><circle cx="35" cy="38" r="1.2"/></g>`),
  crossword: svg(`<rect x="6" y="6" width="52" height="52" rx="3" fill="#ffffff"/>
    ${['FUN#.', '.#..#', 'BIG.D', '#..#.', 'DAY..'].map((row, r) => [...row].map((ch, c) => {
      const x = 7 + c * 10, y = 7 + r * 10;
      return ch === '#' ? `<rect x="${x}" y="${y}" width="10" height="10" fill="#1f2937"/>`
        : ch === '.' ? '' : `<text x="${x + 5}" y="${y + 8}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="7.5" fill="#1d4ed8">${ch}</text>`;
    }).join('')).join('')}
    <path d="M17 7v50M27 7v50M37 7v50M47 7v50M7 17h50M7 27h50M7 37h50M7 47h50" stroke="#94a3b8" stroke-width="1"/><rect x="6" y="6" width="52" height="52" rx="3" fill="none" stroke="#1f2937" stroke-width="2"/>`),
  candycane: svg(`<path d="M40 58V22c0-8-6-14-12-14s-12 6-12 12" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M40 58V22c0-8-6-14-12-14s-12 6-12 12" stroke="#e8283c" stroke-width="10" fill="none" stroke-dasharray="5 6"/>
    <path d="M40 30c-6-5-11 0-6 3 3 2 6-1 6-3zM40 30c6-5 11 0 6 3-3 2-6-1-6-3z" fill="#16a34a"/><path d="M40 30l-4 8M40 30l4 8" stroke="#16a34a" stroke-width="2.6" stroke-linecap="round"/><circle cx="40" cy="30" r="2.2" fill="#15803d"/>`),
  cards: svg(`<g transform="rotate(-14 22 32)"><rect x="8" y="12" width="28" height="38" rx="3.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M22 38c-7-4.5-9-8-8-11 1-3 5-4 8-.5 3-3.5 7-2.5 8 .5 1 3-1 6.5-8 11z" fill="#e8283c"/></g>
    <g transform="rotate(12 42 34)"><rect x="28" y="14" width="28" height="38" rx="3.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="33" y="25" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="#1f2937">A</text>
    <path d="M42 26c-6 6-9 9-7 12.5 1.5 2.5 4.5 2.5 6 .5-.2 2.5-1 4-2.5 5h7c-1.5-1-2.3-2.5-2.5-5 1.5 2 4.5 2 6-.5 2-3.5-1-6.5-7-12.5z" fill="#1f2937"/></g>`),
  // ---- More pictures for home-made countdowns ----
  tent: svg(`${STAR5(10, 10, 3.5, '#ffffff')}${STAR5(54, 16, 2.8, '#ffffff')}<path d="M3 56h58" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 4v8" stroke="#7a4b26" stroke-width="2.4"/><path d="M32 4h9l-2.5 3 2.5 3h-9z" fill="#e8283c"/>
    <path d="M32 11L6 55h52z" fill="#ff8a1f"/><path d="M32 11l26 44H32z" fill="#e56b00"/>
    <path d="M32 26l-10 29h20z" fill="#7a3b10"/><path d="M32 26l-4 29h-6z" fill="#ffb366"/>`),
  fish: svg(`<g fill="none" stroke="#ffffff" stroke-width="1.6"><circle cx="8" cy="18" r="2.6"/><circle cx="12" cy="10" r="1.8"/><circle cx="6" cy="5" r="1.4"/></g>
    <path d="M50 32l12-12v24z" fill="#1d4ed8"/><path d="M28 22c2-6 8-8 12-6-2 2-3 5-3 8z" fill="#1d4ed8"/>
    <path d="M8 32c8-12 22-16 34-10 4 2 7 5 9 10-2 5-5 8-9 10-12 6-26 2-34-10z" fill="#3ba7ff"/>
    <path d="M12 35c10 8 26 9 36 1-12 3-24 3-36-1z" fill="#93c5fd"/>
    <path d="M27 28c2 2 2 5 0 7M33 27c2 2 2 6 0 8M39 28c2 2 2 5 0 7" stroke="#93c5fd" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="18" cy="29" r="3.4" fill="#ffffff"/><circle cx="17.4" cy="29" r="1.8" fill="#111827"/><path d="M9 33h4" stroke="#1d4ed8" stroke-width="1.6" stroke-linecap="round"/>`),
  trophy: svg(`<path d="M18 12h-7c0 9 4 13 9 13M46 12h7c0 9-4 13-9 13" stroke="#ffc531" stroke-width="4" fill="none"/>
    <path d="M18 8h28v14c0 9-6 15-14 15S18 31 18 22z" fill="#ffc531"/><path d="M32 8h14v14c0 9-6 15-14 15z" fill="#f0a91b"/>
    <path d="M23 12v9" stroke="#fff3b0" stroke-width="3" stroke-linecap="round"/>${STAR5(32, 20, 7, '#fff6c9')}
    <rect x="29" y="36" width="6" height="8" fill="#f0a91b"/><rect x="20" y="44" width="24" height="5" rx="1.5" fill="#ffc531"/>
    <rect x="16" y="49" width="32" height="9" rx="2" fill="#7a3b10"/><rect x="25" y="51.5" width="14" height="4" rx="1" fill="#ffd34d"/>`),
  dove: svg(`${rays(32, 34, 26, 31, 12, '#ffffff66', 2)}
    <path d="M44 34l16-6-6 10 6 6-16-2z" fill="#e5e9f2"/><ellipse cx="30" cy="37" rx="16" ry="9" fill="#ffffff"/>
    <path d="M24 33c2-13 13-23 30-25-2 11-9 21-21 27z" fill="#eef2f7"/><path d="M30 30c4-6 10-11 17-14" stroke="#cbd5e1" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="16" cy="30" r="6.5" fill="#ffffff"/><path d="M10 29.5l-5.5 2 5.5 1.5z" fill="#ffb21a"/><circle cx="15" cy="29" r="1.4" fill="#1f2937"/>
    <path d="M7 33c-3 4-3 9 0 13" stroke="#16a34a" stroke-width="1.6" fill="none"/>
    <g fill="#22a447"><ellipse cx="4" cy="38" rx="2.6" ry="1.3" transform="rotate(-30 4 38)"/><ellipse cx="9" cy="41" rx="2.6" ry="1.3" transform="rotate(30 9 41)"/><ellipse cx="5" cy="45" rx="2.6" ry="1.3" transform="rotate(-20 5 45)"/></g>`),
  // ---- Sports and everyday pictures for home-made countdowns ----
  football: svg(`<g transform="rotate(-35 32 32)"><path d="M5 32C13 15 51 15 59 32 51 49 13 49 5 32z" fill="#8b4513"/>
    <path d="M32 18c12 0 22 5 27 14-9-6-18-8-27-8z" fill="#00000022"/>
    <path d="M15 23c-2 6-2 12 0 18M49 23c2 6 2 12 0 18" stroke="#ffffff" stroke-width="2.6" fill="none"/>
    <path d="M22 32h20" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/><path d="M25 29v6M29 29v6M33 29v6M37 29v6M41 29v6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="22" cy="24" rx="5" ry="1.8" fill="#b5651d"/></g>`),
  baseball: svg(`<circle cx="32" cy="32" r="25" fill="#ffffff"/><path d="M32 7a25 25 0 0 1 0 50c9-6 14-15 14-25S41 13 32 7z" fill="#00000012"/>
    <path d="M18 12c8 10 8 30 0 40M46 12c-8 10-8 30 0 40" stroke="#e8283c" stroke-width="1.6" fill="none"/>
    <path d="M18 12c8 10 8 30 0 40M46 12c-8 10-8 30 0 40" stroke="#e8283c" stroke-width="6" fill="none" stroke-dasharray="1.4 3.2"/>`),
  soccer: svg(`<circle cx="32" cy="32" r="25" fill="#ffffff"/><path d="M32 7a25 25 0 0 1 0 50c9-6 14-15 14-25S41 13 32 7z" fill="#00000010"/>
    ${pent(32, 32, 8, 0)}${[0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return pent(32 + 19.5 * Math.cos(a), 32 + 19.5 * Math.sin(a), 5, Math.PI); }).join('')}
    <path d="M32 24v-6.5M39.6 29.5l6.2-2M36.7 38.5l3.8 5.3M27.3 38.5l-3.8 5.3M24.4 29.5l-6.2-2" stroke="#1f2937" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="25" fill="none" stroke="#1f2937" stroke-width="1.6"/>`),
  hockey: svg(`<path d="M46 4L27 46c-1.5 3-3.5 5-7 5H8c-3 0-4 5 0 6h14c5 0 9-2 11-7L51 7z" fill="#c98a3a"/>
    <path d="M9 51.5h12" stroke="#1f2937" stroke-width="5"/><path d="M45 7l5 2" stroke="#1f2937" stroke-width="4"/>
    <ellipse cx="46" cy="53" rx="11" ry="4.5" fill="#111827"/><rect x="35" y="48.5" width="22" height="4.5" fill="#111827"/><ellipse cx="46" cy="48.5" rx="11" ry="4.5" fill="#374151"/>`),
  golf: svg(`<ellipse cx="32" cy="52" rx="29" ry="9" fill="#22a447"/><ellipse cx="32" cy="50" rx="24" ry="6" fill="#2fbf5b"/>
    <ellipse cx="36" cy="50" rx="5" ry="2" fill="#14532d"/><path d="M36 50V7" stroke="#e5e7eb" stroke-width="2.2"/><path d="M36 7l17 6-17 6z" fill="#e8283c"/>
    <circle cx="18" cy="47" r="5" fill="#ffffff"/><g fill="#cbd5e1"><circle cx="16.5" cy="45.5" r=".8"/><circle cx="19.5" cy="46" r=".8"/><circle cx="18" cy="48.5" r=".8"/></g>`),
  deer: svg(`<path d="M23 20C16 14 14 8 16 2M18 12l-7-2M17 7l-5-4M41 20c7-6 9-12 7-18M46 12l7-2M47 7l5-4" stroke="#c9a66b" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="14" cy="27" rx="9" ry="4.5" transform="rotate(-25 14 27)" fill="#a0632e"/><ellipse cx="50" cy="27" rx="9" ry="4.5" transform="rotate(25 50 27)" fill="#a0632e"/>
    <ellipse cx="14" cy="27" rx="5.5" ry="2.4" transform="rotate(-25 14 27)" fill="#e9c79a"/><ellipse cx="50" cy="27" rx="5.5" ry="2.4" transform="rotate(25 50 27)" fill="#e9c79a"/>
    <path d="M20 22c0-7 24-7 24 0 0 10-4 18-6 26-1.5 6-10.5 6-12 0-2-8-6-16-6-26z" fill="#b5763a"/><path d="M28 18c2-2 6-2 8 0-1 4-7 4-8 0z" fill="#d9a066"/>
    <ellipse cx="32" cy="46" rx="7" ry="6.5" fill="#e9c79a"/><ellipse cx="32" cy="43.5" rx="3.6" ry="2.6" fill="#1f1f1f"/>
    <circle cx="25.5" cy="30" r="2.6" fill="#1f1f1f"/><circle cx="38.5" cy="30" r="2.6" fill="#1f1f1f"/><circle cx="26.3" cy="29.2" r=".9" fill="#fff"/><circle cx="39.3" cy="29.2" r=".9" fill="#fff"/>`),
  raceflag: svg(`<g transform="rotate(-18 20 60)"><path d="M20 60V6" stroke="#9ca3af" stroke-width="2.6" stroke-linecap="round"/>${checker(20, 7, 22, 15)}</g>
    <g transform="rotate(18 44 60)"><path d="M44 60V6" stroke="#9ca3af" stroke-width="2.6" stroke-linecap="round"/>${checker(22, 7, 22, 15)}</g>`),
  car: svg(`<path d="M6 43v-8c0-3 2-5 5-5h6l7-10c1-2 3-3 5-3h12c2 0 4 1 5 3l6 10h2c3 0 5 2 5 5v8c0 2-1 3-3 3H9c-2 0-3-1-3-3z" fill="#e8283c"/>
    <path d="M23 30l5-8c.5-1 1.5-1.5 2.5-1.5H34V30z" fill="#bfe7ff"/><path d="M37 20.5h4c1 0 2 .5 2.5 1.5l5 8H37z" fill="#bfe7ff"/>
    <path d="M10 36h44" stroke="#ff6b78" stroke-width="2" stroke-linecap="round"/><rect x="55" y="34" width="4" height="3" rx="1" fill="#ffd34d"/>
    <circle cx="18" cy="46" r="7" fill="#1f2937"/><circle cx="18" cy="46" r="3" fill="#9ca3af"/><circle cx="46" cy="46" r="7" fill="#1f2937"/><circle cx="46" cy="46" r="3" fill="#9ca3af"/>`),
  gamepad: svg(`<path d="M14 22h36c7 0 11 6 12 14 1 9-2 16-8 16-4 0-6-3-9-7H19c-3 4-5 7-9 7-6 0-9-7-8-16 1-8 5-14 12-14z" fill="#8a3ff0"/>
    <path d="M32 22h18c7 0 11 6 12 14 1 9-2 16-8 16-4 0-6-3-9-7H32z" fill="#6d28d9"/>
    <path d="M14 34h11M19.5 28.5v11" stroke="#1f2937" stroke-width="4.4" stroke-linecap="round"/>
    <circle cx="45" cy="29" r="2.8" fill="#ffd34d"/><circle cx="51" cy="34.5" r="2.8" fill="#2fd38a"/><circle cx="45" cy="40" r="2.8" fill="#3ba7ff"/><circle cx="39" cy="34.5" r="2.8" fill="#ff3b4e"/>`),
  ferriswheel: svg(`<path d="M32 30L16 59M32 30l16 29" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/><rect x="8" y="57" width="48" height="5" rx="2.5" fill="#16a34a"/>
    ${rays(32, 30, 0, 22, 8, '#ffd34d', 1.6)}<circle cx="32" cy="30" r="22" fill="none" stroke="#e8283c" stroke-width="3"/>
    ${['#3ba7ff', '#ff4fa3', '#2fd38a', '#ffd34d', '#8a3ff0', '#ff8a1f', '#22e0d0', '#ff3b4e'].map((c, i) => {
      const a = i * Math.PI / 4, x = 32 + 22 * Math.cos(a), y = 30 + 22 * Math.sin(a);
      return `<rect x="${(x - 4).toFixed(1)}" y="${(y + 1).toFixed(1)}" width="8" height="6" rx="2" fill="${c}"/>`;
    }).join('')}<circle cx="32" cy="30" r="3.5" fill="#ffd34d"/>`),
  balloons: svg(`<path d="M20 34c2 8-2 14 6 26M44 32c-2 10 2 16-8 28M32 40c0 8 2 12 0 20" stroke="#ffffff" stroke-width="1.4" fill="none"/>
    <ellipse cx="20" cy="22" rx="10" ry="12" fill="#ff4fa3"/><path d="M18 34l2-2 2 2z" fill="#ff4fa3"/>
    <ellipse cx="44" cy="20" rx="10" ry="12" fill="#3ba7ff"/><path d="M42 32l2-2 2 2z" fill="#3ba7ff"/>
    <ellipse cx="32" cy="28" rx="10" ry="12" fill="#ffd34d"/><path d="M30 40l2-2 2 2z" fill="#ffd34d"/>
    <g fill="#ffffff88"><ellipse cx="16" cy="17" rx="2.4" ry="4" transform="rotate(20 16 17)"/><ellipse cx="40" cy="15" rx="2.4" ry="4" transform="rotate(20 40 15)"/><ellipse cx="28" cy="23" rx="2.4" ry="4" transform="rotate(20 28 23)"/></g>`),
  camera: svg(`<path d="M22 18l4-6h12l4 6z" fill="#374151"/><rect x="10" y="13" width="8" height="6" rx="1.5" fill="#e8283c"/>
    <rect x="6" y="18" width="52" height="36" rx="6" fill="#4b5563"/><rect x="6" y="18" width="52" height="8" rx="4" fill="#374151"/>
    <circle cx="32" cy="37" r="13" fill="#1f2937"/><circle cx="32" cy="37" r="8.5" fill="#3ba7ff"/><circle cx="29" cy="34" r="2.8" fill="#bfe7ff"/>
    <rect x="46" y="21" width="8" height="4" rx="1.5" fill="#ffd34d"/>`),
  briefcase: svg(`<path d="M24 18v-5c0-2 1-3 3-3h10c2 0 3 1 3 3v5" stroke="#5a3518" stroke-width="3.6" fill="none"/>
    <rect x="6" y="18" width="52" height="38" rx="5" fill="#8b5a2b"/><rect x="32" y="18" width="26" height="38" rx="5" fill="#7a4b26"/>
    <path d="M6 33h52" stroke="#5a3518" stroke-width="3"/><rect x="28" y="29" width="8" height="8" rx="1.5" fill="#ffc531"/>`),
};

// Colour schemes. bg = sky gradient, ink = text on it, accent = buttons, fx = moving scene.
const THEMES = {
  christmas: { name: 'Christmas', bg: ['#d7263d', '#7a0b1f'], accent: '#ffd34d', fx: ['snow'] },
  night: { name: 'Starry Night', bg: ['#22307a', '#0b1236'], accent: '#ffd34d', fx: ['stars'] },
  advent: { name: 'Advent', bg: ['#6d2fc2', '#2a0d55'], accent: '#ff8fd1', fx: ['snow', 'stars'] },
  newyear: { name: 'Midnight', bg: ['#3a1d8f', '#0d0730'], accent: '#ffd34d', fx: ['fireworks', 'stars'] },
  winter: { name: 'Snow Day', bg: ['#4fb3ff', '#1d5fb8'], accent: '#ffffff', fx: ['snow'] },
  love: { name: 'Hearts', bg: ['#ff5d95', '#c2185b'], accent: '#ffffff', fx: ['hearts'] },
  usa: { name: 'Stars & Stripes', bg: ['#2546b8', '#0b1b5c'], accent: '#ff3b4e', fx: ['fireworks', 'stars'] },
  lent: { name: 'Quiet Purple', bg: ['#6a568f', '#2a2040'], accent: '#e9ddff', fx: ['rays', 'motes'] },
  irish: { name: 'Shamrock', bg: ['#22b455', '#0a6a2c'], accent: '#ffd34d', fx: ['shamrocks', 'coins'] },
  silly: { name: 'Silly', bg: ['#ffb300', '#ff3d81'], accent: '#ffffff', fx: ['confetti', 'bubbles'] },
  spring: { name: 'Spring', bg: ['#6fd36b', '#1e8f55'], accent: '#ffffff', fx: ['petals'] },
  easter: { name: 'Easter Morning', bg: ['#ffcf5c', '#ff7aa8'], accent: '#ffffff', fx: ['eggs', 'petals'] },
  sky: { name: 'Blue Sky', bg: ['#4cc3ff', '#1769d1'], accent: '#ffffff', fx: ['clouds'] },
  pentecost: { name: 'Fire', bg: ['#ff7a18', '#c2185b'], accent: '#fff3b0', fx: ['embers'] },
  dad: { name: 'Ocean Teal', bg: ['#14b8a6', '#0c4a6e'], accent: '#ffd34d', fx: ['bubbles'] },
  autumn: { name: 'Autumn', bg: ['#ffa21a', '#b4400b'], accent: '#ffffff', fx: ['leaves'] },
  sea: { name: 'Sea', bg: ['#14c6e0', '#1e40af'], accent: '#ffffff', fx: ['bubbles'] },
  halloween: { name: 'Spooky', bg: ['#4b1670', '#120a24'], accent: '#ff8a1f', fx: ['bats', 'stars'] },
  party: { name: 'Party', bg: ['#9b5cff', '#ec4899'], accent: '#ffffff', fx: ['balloons', 'confetti'] },
  summer: { name: 'Summer', bg: ['#ffc72c', '#ff6a1a'], accent: '#ffffff', fx: ['bubbles', 'rays'] },
  magenta: { name: 'Magenta', bg: ['#ff2bd6', '#a1007a'], accent: '#ffffff', fx: ['confetti', 'stars'] },
  maroon: { name: 'Maroon', bg: ['#9e1b32', '#4a0614'], accent: '#ffd34d', fx: ['stars'] },
  lime: { name: 'Lime', bg: ['#8fdc1a', '#3f7a0a'], accent: '#ffffff', fx: ['bubbles', 'confetti'] },
  coral: { name: 'Coral', bg: ['#ff7a6b', '#e0335a'], accent: '#ffffff', fx: ['petals'] },
  yellow: { name: 'Yellow', bg: ['#ffe234', '#f5b301'], accent: '#ffffff', fx: ['bubbles', 'confetti'] },
  gold: { name: 'Gold', bg: ['#ffcc33', '#c7861a'], accent: '#ffffff', fx: ['coins', 'stars'] },
  navy: { name: 'Navy', bg: ['#2b3f8f', '#0a1233'], accent: '#ffd34d', fx: ['stars'] },
  turquoise: { name: 'Turquoise', bg: ['#22e0d0', '#0e8a9e'], accent: '#ffffff', fx: ['bubbles'] },
  bubblegum: { name: 'Bubblegum', bg: ['#ffa8d9', '#ff5fae'], accent: '#ffffff', fx: ['hearts', 'bubbles'] },
};

// ---- Moving scenes -------------------------------------------------------------------
// One <canvas> per scene. Each effect knows how to make a piece and how to draw it.
const R = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const CONF = ['#ff3b4e', '#ffd34d', '#2fd38a', '#3ba7ff', '#ff4fa3', '#8a3ff0', '#ffffff'];

function heartPath(c, s) {
  c.beginPath(); c.moveTo(0, s * 0.35);
  c.bezierCurveTo(-s * 1.1, -s * 0.3, -s * 0.5, -s * 1.1, 0, -s * 0.45);
  c.bezierCurveTo(s * 0.5, -s * 1.1, s * 1.1, -s * 0.3, 0, s * 0.35); c.fill();
}
function star4(c, s) {
  c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(0, 0, s, 0); c.quadraticCurveTo(0, 0, 0, s);
  c.quadraticCurveTo(0, 0, -s, 0); c.quadraticCurveTo(0, 0, 0, -s); c.fill();
}

const FX = {
  snow: {
    n: 70, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), r: R(1.5, 5), vy: R(20, 60), sway: R(0, 6.28), big: Math.random() < 0.18 }),
    step(p, dt, w, h, t) { p.y += p.vy * dt * (p.big ? 0.7 : 1); p.x += Math.sin(t * 0.8 + p.sway) * 0.4; return p.y < h + 20; },
    draw(c, p) {
      c.fillStyle = 'rgba(255,255,255,.9)';
      if (!p.big) { c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.29); c.fill(); return; }
      c.save(); c.translate(p.x, p.y); c.rotate(p.y / 80); c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 2; c.lineCap = 'round';
      const s = p.r * 3;
      for (let i = 0; i < 6; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, s); c.moveTo(0, s * .55); c.lineTo(s * .3, s * .8); c.moveTo(0, s * .55); c.lineTo(-s * .3, s * .8); c.stroke(); }
      c.restore();
    },
  },
  stars: {
    n: 45, fixed: true, make: (w, h) => ({ x: R(0, w), y: R(0, h * 0.75), r: R(1, 3.2), ph: R(0, 6.28), sp: R(1, 3), sparkle: Math.random() < 0.25 }),
    step: () => true,
    draw(c, p, t) {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * p.sp * 0.5 + p.ph));
      c.fillStyle = `rgba(255,248,214,${a})`;
      if (p.sparkle) { c.save(); c.translate(p.x, p.y); star4(c, p.r * 2.6 * a + 2); c.restore(); }
      else { c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.29); c.fill(); }
    },
  },
  hearts: {
    n: 22, make: (w, h, top) => ({ x: R(0, w), y: top ? R(h, h * 2) : R(0, h), s: R(8, 22), vy: R(25, 60), ph: R(0, 6.28), col: pick(['#ffffff', '#ffd0dc', '#ff2d6f', '#ff8fb1']) }),
    step(p, dt, w, h, t) { p.y -= p.vy * dt; p.x += Math.sin(t + p.ph) * 0.5; return p.y > -40; },
    draw(c, p, t) { c.save(); c.globalAlpha = .85; c.fillStyle = p.col; c.translate(p.x, p.y); c.rotate(Math.sin(t + p.ph) * .25); heartPath(c, p.s); c.restore(); },
  },
  shamrocks: {
    n: 16, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), s: R(.25, .6), vy: R(25, 55), rot: R(0, 6.28), vr: R(-1, 1) }),
    step(p, dt, w, h) { p.y += p.vy * dt; p.rot += p.vr * dt; return p.y < h + 40; },
    draw(c, p) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(p.s, p.s); c.fillStyle = 'rgba(190,255,200,.9)';
      const leaf = new Path2D(LEAF3); for (let i = 0; i < 3; i++) { c.fill(leaf); c.rotate(2.094); } c.restore();
    },
  },
  coins: {
    n: 10, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), r: R(5, 9), vy: R(40, 80), ph: R(0, 6.28) }),
    step(p, dt, w, h) { p.y += p.vy * dt; return p.y < h + 20; },
    draw(c, p, t) { const sx = Math.abs(Math.cos(t * 3 + p.ph)); c.fillStyle = '#ffd34d'; c.beginPath(); c.ellipse(p.x, p.y, p.r * sx + .5, p.r, 0, 0, 6.29); c.fill(); c.fillStyle = '#e3a51a'; c.beginPath(); c.ellipse(p.x, p.y, p.r * sx * .55 + .3, p.r * .55, 0, 0, 6.29); c.fill(); },
  },
  eggs: {
    n: 14, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), s: R(9, 16), vy: R(25, 50), rot: R(-.5, .5), vr: R(-.8, .8), a: pick(['#8fd3ff', '#ffe066', '#c4b5fd', '#9ef0b5', '#ffb3c7']), b: pick(['#ffffff', '#ff7aa8', '#3ba7ff', '#8a3ff0']) }),
    step(p, dt, w, h) { p.y += p.vy * dt; p.rot += p.vr * dt; return p.y < h + 40; },
    draw(c, p) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); const s = p.s;
      c.beginPath(); c.ellipse(0, 0, s * .78, s, 0, 0, 6.29); c.fillStyle = p.a; c.fill(); c.clip();
      c.strokeStyle = p.b; c.lineWidth = s * .22; c.beginPath();
      for (let i = -4; i <= 4; i++) c.lineTo(i * s * .25, (i % 2 ? -1 : 1) * s * .14); c.stroke();
      c.fillStyle = p.b; for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * s * .4, -s * .5, s * .1, 0, 6.29); c.arc(i * s * .4, s * .55, s * .1, 0, 6.29); c.fill(); }
      c.restore();
    },
  },
  petals: {
    n: 26, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), s: R(4, 9), vy: R(20, 45), rot: R(0, 6.28), vr: R(-2, 2), ph: R(0, 6.28), col: pick(['#ffffff', '#ffd0e3', '#fff0a6', '#ffc2da']) }),
    step(p, dt, w, h, t) { p.y += p.vy * dt; p.x += Math.sin(t * 1.3 + p.ph) * .7; p.rot += p.vr * dt; return p.y < h + 20; },
    draw(c, p) { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.col; c.beginPath(); c.ellipse(0, 0, p.s, p.s * .5, 0, 0, 6.29); c.fill(); c.restore(); },
  },
  leaves: {
    n: 22, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), s: R(7, 15), vy: R(30, 60), rot: R(0, 6.28), vr: R(-2, 2), ph: R(0, 6.28), col: pick(['#ffd34d', '#ff8a1f', '#e8283c', '#b45309', '#fff3b0']) }),
    step(p, dt, w, h, t) { p.y += p.vy * dt; p.x += Math.sin(t * 1.4 + p.ph) * 1.1; p.rot += p.vr * dt; return p.y < h + 30; },
    draw(c, p) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); const s = p.s; c.fillStyle = p.col;
      c.beginPath(); c.moveTo(0, -s); c.quadraticCurveTo(s, -s * .3, 0, s); c.quadraticCurveTo(-s, -s * .3, 0, -s); c.fill();
      c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -s * .8); c.lineTo(0, s * 1.3); c.stroke(); c.restore();
    },
  },
  confetti: {
    n: 40, make: (w, h, top) => ({ x: R(0, w), y: top ? R(-h, 0) : R(0, h), w: R(5, 10), h: R(3, 6), vy: R(40, 90), rot: R(0, 6.28), vr: R(-5, 5), col: pick(CONF) }),
    step(p, dt, w, h) { p.y += p.vy * dt; p.rot += p.vr * dt; return p.y < h + 20; },
    draw(c, p) { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.rot * 2)); c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore(); },
  },
  bubbles: {
    n: 22, make: (w, h, top) => ({ x: R(0, w), y: top ? R(h, h * 1.6) : R(0, h), r: R(4, 16), vy: R(20, 50), ph: R(0, 6.28) }),
    step(p, dt, w, h, t) { p.y -= p.vy * dt; p.x += Math.sin(t + p.ph) * .5; return p.y > -30; },
    draw(c, p) {
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.8; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.29); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.18)'; c.fill(); c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(p.x - p.r * .35, p.y - p.r * .35, p.r * .22, 0, 6.29); c.fill();
    },
  },
  balloons: {
    n: 9, make: (w, h, top) => ({ x: R(0, w), y: top ? R(h, h * 1.8) : R(0, h), r: R(12, 20), vy: R(25, 45), ph: R(0, 6.28), col: pick(CONF.slice(0, 6)) }),
    step(p, dt, w, h, t) { p.y -= p.vy * dt; p.x += Math.sin(t * .8 + p.ph) * .4; return p.y > -80; },
    draw(c, p, t) {
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(p.x, p.y + p.r * 1.2);
      c.quadraticCurveTo(p.x + Math.sin(t * 2 + p.ph) * 8, p.y + p.r * 2.2, p.x, p.y + p.r * 3.4); c.stroke();
      c.fillStyle = p.col; c.beginPath(); c.ellipse(p.x, p.y, p.r * .85, p.r * 1.1, 0, 0, 6.29); c.fill();
      c.beginPath(); c.moveTo(p.x, p.y + p.r * 1.05); c.lineTo(p.x - 3, p.y + p.r * 1.3); c.lineTo(p.x + 3, p.y + p.r * 1.3); c.fill();
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(p.x - p.r * .35, p.y - p.r * .4, p.r * .18, p.r * .32, -.5, 0, 6.29); c.fill();
    },
  },
  bats: {
    n: 7, make: (w, h, top) => ({ x: top ? R(-w * .6, -20) : R(0, w), y: R(20, h * .6), s: R(10, 20), vx: R(40, 90), ph: R(0, 6.28) }),
    step(p, dt, w, h, t) { p.x += p.vx * dt; p.y += Math.sin(t * 2 + p.ph) * .6; return p.x < w + 40; },
    draw(c, p, t) {
      const f = Math.sin(t * 14 + p.ph), s = p.s; c.save(); c.translate(p.x, p.y); c.fillStyle = '#0c0614';
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-s * .6, -s * .8 * f, -s * 1.4, -s * .3 * f);
      c.quadraticCurveTo(-s * 1, s * .1, -s * .9, s * .35); c.quadraticCurveTo(-s * .5, s * .1, 0, s * .35);
      c.quadraticCurveTo(s * .5, s * .1, s * .9, s * .35); c.quadraticCurveTo(s * 1, s * .1, s * 1.4, -s * .3 * f);
      c.quadraticCurveTo(s * .6, -s * .8 * f, 0, 0); c.fill();
      c.beginPath(); c.arc(0, s * .1, s * .28, 0, 6.29); c.fill(); c.restore();
    },
  },
  embers: {
    n: 40, make: (w, h, top) => ({ x: R(0, w), y: top ? R(h, h * 1.4) : R(0, h), r: R(1.5, 4.5), vy: R(30, 80), ph: R(0, 6.28) }),
    step(p, dt, w, h, t) { p.y -= p.vy * dt; p.x += Math.sin(t * 2 + p.ph) * .7; return p.y > -20; },
    draw(c, p, t) { c.fillStyle = `rgba(255,${200 + Math.floor(Math.sin(t * 4 + p.ph) * 50)},120,.9)`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.29); c.fill(); },
  },
  clouds: {
    n: 5, make: (w, h, top) => ({ x: top ? -160 : R(-100, w), y: R(10, h * .55), s: R(.6, 1.3), vx: R(8, 20) }),
    step(p, dt, w) { p.x += p.vx * dt; return p.x < w + 180; },
    draw(c, p) {
      c.save(); c.translate(p.x, p.y); c.scale(p.s, p.s); c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath();
      c.arc(0, 0, 26, 0, 6.29); c.arc(30, -12, 32, 0, 6.29); c.arc(64, 0, 26, 0, 6.29); c.rect(0, 0, 64, 26); c.fill(); c.restore();
    },
  },
  rays: {
    n: 1, fixed: true, make: (w, h) => ({ w, h }),
    step: () => true,
    draw(c, p, t) {
      c.save(); c.translate(p.w / 2, -20); c.rotate(t * .05); c.fillStyle = 'rgba(255,255,255,.07)';
      for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(-40, p.h * 1.6); c.lineTo(40, p.h * 1.6); c.fill(); }
      c.restore();
    },
  },
  motes: {
    n: 25, make: (w, h, top) => ({ x: R(0, w), y: top ? R(h, h * 1.3) : R(0, h), r: R(1, 2.6), vy: R(6, 16), ph: R(0, 6.28) }),
    step(p, dt, w, h, t) { p.y -= p.vy * dt; p.x += Math.sin(t * .6 + p.ph) * .3; return p.y > -10; },
    draw(c, p, t) { c.fillStyle = `rgba(255,240,210,${.3 + .4 * Math.abs(Math.sin(t + p.ph))})`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.29); c.fill(); },
  },
  // Rockets that climb and burst. Each piece is a rocket until it pops into sparks.
  fireworks: {
    n: 4, make: (w, h, top) => ({ x: R(w * .1, w * .9), y: h + R(0, top ? 400 : 200), vy: R(-340, -260), ty: R(h * .12, h * .45), col: pick(['#ff3b4e', '#ffffff', '#3ba7ff', '#ffd34d', '#ff4fa3']), sparks: null }),
    step(p, dt, w, h) {
      if (!p.sparks) {
        p.y += p.vy * dt;
        if (p.y <= p.ty) { p.sparks = [...Array(36)].map((_, i) => { const a = i / 36 * 6.28, v = R(80, 160); return { x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v }; }); p.life = 1.6; }
        return true;
      }
      p.life -= dt; for (const s of p.sparks) { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 90 * dt; s.vx *= .985; }
      return p.life > 0;
    },
    draw(c, p) {
      c.fillStyle = p.col;
      if (!p.sparks) { c.fillRect(p.x - 1.5, p.y, 3, 10); return; }
      c.globalAlpha = Math.max(0, Math.min(1, p.life)); for (const s of p.sparks) { c.beginPath(); c.arc(s.x, s.y, 2.2, 0, 6.29); c.fill(); }
      c.globalAlpha = 1;
    },
  },
};

// A running scene on a canvas. Returns { burst(x, y), stop() }.
function startScene(canvas, theme, opts = {}) {
  const ctx = canvas.getContext('2d'), kinds = (THEMES[theme] || THEMES.party).fx;
  const dense = opts.dense ?? 1, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, raf = 0, last = performance.now(), live = true;
  let pieces = [], pops = [];
  function size() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function fill() {
    pieces = [];
    for (const k of kinds) { const fx = FX[k]; const n = Math.max(1, Math.round(fx.n * dense * (fx.fixed ? 1 : Math.min(1.6, w / 400)))); for (let i = 0; i < n; i++) pieces.push({ k, p: fx.make(w, h, false) }); }
  }
  size(); fill();
  const ro = new ResizeObserver(() => { const ow = w; size(); if (Math.abs(ow - w) > 40) fill(); });
  ro.observe(canvas);
  function frame(now) {
    if (!live) return;
    const dt = Math.min(0.05, (now - last) / 1000), t = now / 1000; last = now;
    ctx.clearRect(0, 0, w, h);
    for (const it of pieces) {
      const fx = FX[it.k];
      if (!still && !fx.step(it.p, dt, w, h, t)) it.p = fx.make(w, h, true);
      fx.draw(ctx, it.p, t);
    }
    pops = pops.filter(s => (s.life -= dt) > 0);
    for (const s of pops) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 260 * dt; s.rot += s.vr * dt;
      ctx.save(); ctx.globalAlpha = Math.min(1, s.life * 1.5); ctx.translate(s.x, s.y); ctx.rotate(s.rot); ctx.fillStyle = s.col;
      if (s.shape === 'heart') heartPath(ctx, 8); else if (s.shape === 'star') star4(ctx, 8); else ctx.fillRect(-5, -3, 10, 6);
      ctx.restore();
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return {
    burst(x, y, n = 30) {
      const shape = kinds.includes('hearts') ? 'heart' : (kinds.includes('stars') || kinds.includes('snow')) ? 'star' : 'rect';
      for (let i = 0; i < n; i++) { const a = R(0, 6.28), v = R(120, 380); pops.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 160, rot: R(0, 6), vr: R(-8, 8), life: R(.9, 1.6), col: pick(CONF), shape }); }
    },
    stop() { live = false; cancelAnimationFrame(raf); ro.disconnect(); },
  };
}

// Icons offered when making your own countdown.
const PICK_ICONS = ['cake', 'rings', 'plane', 'backpack', 'bus', 'baby', 'ball', 'gift', 'heart', 'star', 'sun', 'paw', 'house', 'music',
  'gradcap', 'tree', 'pumpkin', 'turkey', 'fireworks', 'partyhat', 'flag', 'ship', 'tulip', 'crown', 'shamrock', 'rocket', 'glasses', 'tie',
  'trophy', 'tent', 'fish', 'dove', 'cross', 'dog', 'cat', 'squirrel', 'polarbear', 'coaster', 'popcorn', 'pizza', 'donut', 'icecream',
  'cupcake', 'cookie', 'burger', 'taco', 'friends', 'hug', 'moon', 'planet', 'earth', 'mountain', 'oak', 'book', 'apple', 'bulb',
  'puzzle', 'beanie', 'sunglasses', 'phone', 'bell', 'stocking', 'candycane', 'sweater', 'tooth', 'flame',
  'football', 'baseball', 'soccer', 'hockey', 'golf', 'deer', 'raceflag', 'car', 'gamepad', 'ferriswheel', 'balloons', 'camera', 'briefcase'];

window.BD_ART = { ICONS, THEMES, startScene, PICK_ICONS };
