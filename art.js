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
  'gradcap', 'tree', 'pumpkin', 'turkey', 'fireworks', 'partyhat', 'flag', 'ship', 'tulip', 'crown', 'shamrock', 'rocket', 'glasses', 'tie'];

window.BD_ART = { ICONS, THEMES, startScene, PICK_ICONS };
