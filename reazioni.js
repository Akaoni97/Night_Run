// ============================================================================
//  Night Run · Reazioni del protagonista (dopo fumetti2d.js, meteo2d.js e sensi.js, v0.119)
//  Il protagonista si accorge di quello che fa la macchina e ci reagisce: quando accelera forte, fa un launch, sorpassa, quando
//  lo scarico spara o il motore canta al limitatore, sopra la sua testa esce una nuvoletta di pensiero in pixel art («WOW!»,
//  «ANCORA!»...) e in faccia gli si legge lo stupore (occhi grandi, bocca aperta: `awe` di pgDriver in personaggio.js).
//  Si spegne con Impostazioni → Grafica → Grafiche anime (`street2d.comicsOn`, come le scritte da fumetto).
//  Parte pura (provata in test/reazioni.test.js): REA_LINES, reaPick, reaAccelStep. Disegno: agganciato a Street2D.drawComics.
//  La posizione della testa la scrive pilota2d.js (`_drvHead`), la faccia legge `_rea.awe`.
//  Prova a mano: `nightRun.view2d.reaSay('accel')` (tipi: accel, launch1, launch2, sorpasso, botto, giri, turbo).
// ============================================================================
// frasi per tipo di momento (maiuscole senza accenti: il carattere a pixel non li ha; '|' = a capo, al massimo due righe di 12 lettere)
const REA_LINES = {
  accel: ['WOW!', 'ANCORA!', 'CHE SPINTA!', 'SI VOLA!', 'SIII!', 'SPETTACOLO!', 'MI INCOLLA|AL SEDILE!', 'CHE FORZA!', 'ANCORA,|ANCORA!'],
  launch1: ['PRONTI...', 'ORA SI|PARTE!', 'CARICA!', 'TIENITI|FORTE!'],
  launch2: ['VIA!', 'CHE|PARTENZA!', 'VOLA!', 'SIIII!'],
  sorpasso: ['SORPASSO!', 'CIAO CIAO!', 'TI SALUTO!', 'VIA DI QUI!', 'ADDIO!'],
  botto: ['CHE BOTTI!', 'SENTI CHE|SUONO!', 'CHE CATTIVO!', 'AHAH!', 'CHE|MUSICA!'],
  giri: ['ANCORA GIRI!', 'CHE URLO!', 'CANTA!', 'SENTILO|CANTARE!'],
  turbo: ['SENTI IL|TURBO!', 'CHE FISCHIO!', 'ARIA!', 'IL TURBO|SOFFIA!'],
};
// colore del testo per tipo
const REA_COL = { accel: '#d6261c', launch1: '#e8590c', launch2: '#d6261c', sorpasso: '#1c6fd6', botto: '#c97a00', giri: '#7a2bd6', turbo: '#0a8f8f' };
// una frase a caso del tipo, mai uguale alla precedente. rnd = numero casuale in [0, 1)
function reaPick(tipo, prev, rnd) {
  const v = REA_LINES[tipo]; if (!v) return null;
  let i = Math.floor((rnd == null ? Math.random() : rnd) * v.length) % v.length;
  if (v.length > 1 && v[i] === prev) i = (i + 1) % v.length;
  return v[i];
}
// accelerazione filtrata in m/s² (media mobile con costante ~0,25 s); S tiene lo stato fra un fotogramma e l'altro
function reaAccelStep(S, v, dt) {
  if (S.v == null) S.v = v;
  const raw = dt > 0 ? (v - S.v) / dt : 0; S.v = v;
  S.a = (S.a || 0) + (raw - (S.a || 0)) * Math.min(1, dt / 0.25);
  return S.a;
}

(function () {
  'use strict';
  if (typeof Street2D === 'undefined') return;
  const P = Street2D.prototype, prev = P.drawComics;
  const ease = (a) => 1 - Math.pow(1 - Math.min(1, Math.max(0, a)), 3);
  const REA = { cdAll: 7, cat: { accel: 16, launch1: 30, launch2: 20, sorpasso: 18, botto: 14, giri: 26, turbo: 30 } };
  const stato = (v) => v._rea || (v._rea = { cd: 3, cat: {}, bub: null, awe: 0, A: {}, tA: 0, tG: 0, armed: false, tArm: 0, rel: new Map(), last: {} });

  // ---------------------------------------------------------------- dire una frase (anche a mano, per provare: force = senza attese)
  P.reaSay = function (tipo, awe, force) {
    const R = stato(this);
    if (!force && (R.cd > 0 || R.cat[tipo] > 0 || R.bub)) return false;
    if (!force && Math.random() > 0.8) { R.cat[tipo] = 4; return false; }        // non sempre: a volte tace
    const txt = reaPick(tipo, R.last[tipo]); if (!txt) return false;
    R.last[tipo] = txt; R.cat[tipo] = REA.cat[tipo] || 15; R.cd = REA.cdAll + Math.random() * 4;
    R.bub = { t: 0, life: 1.9 + txt.length * 0.03, lines: txt.split('|'), tipo, j: Math.random() * 6.28 };
    R.awe = Math.max(R.awe, awe == null ? 1 : awe);
    return true;
  };

  // ---------------------------------------------------------------- quando
  P.reaTick = function (dt) {
    const R = stato(this);
    R.awe = Math.max(0, R.awe - dt * 0.7); R.cd -= dt;
    for (const k in R.cat) R.cat[k] = Math.max(0, R.cat[k] - dt);
    if (R.bub) { R.bub.t += dt; if (R.bub.t > R.bub.life) R.bub = null; }
    const NR = typeof window !== 'undefined' && window.nightRun, sim = NR && NR.sim, g = NR && NR.game;
    if (!sim || !g || dt <= 0 || dt > 0.25) return;
    if (g.inside || !sim.running || this.comicsOn === false || this.quality === 'bassa') return;
    const v = Math.abs(sim.v || 0), thr = sim.thr || 0;
    // accelerazione forte: oltre 2,6 m/s² a gas aperto per mezzo secondo (una V40 a gas pieno ci arriva, una preparata molto prima e più spesso)
    const a = reaAccelStep(R.A, v, dt);
    R.tA = a > 2.6 && thr > 0.8 && v > 3 && v < 70 ? R.tA + dt : Math.max(0, R.tA - dt * 2);
    if (R.tA > 0.5 && this.reaSay('accel', 1)) R.tA = 0;
    // launch: «pronti» quando si arma, «via» quando si molla e l'auto parte
    const armed = !!sim.launchArmed;
    if (armed && !R.armed) this.reaSay('launch1', 0.7);
    if (R.armed && !armed) R.tArm = 3;
    R.armed = armed; R.tArm = Math.max(0, R.tArm - dt);
    if (R.tArm > 0 && v > 3 && this.reaSay('launch2', 1)) R.tArm = 0;
    // il turbo sale di pressione a gas aperto
    if (sim.tur > 0.5 && thr > 0.8 && v > 5) this.reaSay('turbo', 0.7);
    // scoppi e fiammate dallo scarico (la fiamma grossa) e il motore al limitatore
    if ((this.st.flame || 0) > 1.0) this.reaSay('botto', 0.9);
    if (sim.cut > 0 && thr > 0.9 && sim.rpm > 0.97 * ((sim.P && sim.P.limiter) || 7000)) { R.tG += dt; if (R.tG > 0.7) this.reaSay('giri', 0.8); } else R.tG = Math.max(0, R.tG - dt);
    // sorpasso: un'auto che era davanti ora è dietro, nella stessa corsia o accanto, e andavamo più forte
    const dist = g.s && g.s.dist, seen = new Set();
    if (dist != null && g.ents) for (const e of g.ents) {
      if (e.kind !== 'traffic' || e.hazard || e.still || e.id == null) continue;
      seen.add(e.id); const rel = e.x - dist, p = R.rel.get(e.id); R.rel.set(e.id, rel);
      if (p !== undefined && p > 0 && rel <= 0 && p < 20 && v - Math.abs(e.v || 0) > 4 && Math.abs((e.lane ?? 0) - (g.lane ?? 0)) <= 1) this.reaSay('sorpasso', 0.8);
    }
    for (const id of R.rel.keys()) if (!seen.has(id)) R.rel.delete(id);
  };

  // ---------------------------------------------------------------- disegno
  const disc = (g, x, y, r, col) => { g.fillStyle = col; for (let dy = -r; dy <= r; dy++) { const w = Math.floor(Math.sqrt(r * r - dy * dy + 0.25)); g.fillRect(Math.round(x - w), Math.round(y + dy), 2 * w + 1, 1); } };
  P.reaDraw = function (g) {
    const R = this._rea, b = R && R.bub, H = this._drvHead; if (!b || !H || !H.m) return;
    const S = this.SS || 1, m = H.m;
    const hx = (m.a * H.ax + m.c * H.ay + m.e) / S, hy = (m.b * H.ax + m.d * H.ay + m.f) / S;     // testa, in unità della tela
    const ink = this.C.ink, sc = 2, lh = 12, pad = 5;
    const w = Math.max(...b.lines.map((l) => this.textW(l, sc))) + pad * 2, h = b.lines.length * lh - 2 + pad * 2;
    const k = b.t < 0.22 ? ease(b.t / 0.22) * 1.12 : b.t < 0.34 ? 1.12 - (b.t - 0.22) / 0.12 * 0.12 : 1;
    const fade = b.t > b.life - 0.25 ? Math.max(0, (b.life - b.t) / 0.25) : 1;
    const bob = Math.sin(b.t * 5 + b.j) * 1.2;
    const bx = Math.round(hx + 6), by = Math.round(hy - 28 - h / 2 + bob);                        // centro della nuvoletta, sopra il tetto
    g.save(); g.globalAlpha = fade; g.globalCompositeOperation = 'source-over';
    if (typeof window !== 'undefined' && window.__reaDbg) { g.fillStyle = '#f0f'; g.fillRect(Math.round(hx) - 1, Math.round(hy) - 1, 3, 3); }
    // coda: tre cerchi che salgono dalla testa
    const tail = [[hx + 2, hy - 7, 1.5], [hx + 3.5, hy - 13, 2.2], [hx + 5, hy - 20, 3]];
    for (const [tx, ty, r] of tail) disc(g, tx, ty + bob * 0.4, Math.round(r * k) + 1, ink);
    for (const [tx, ty, r] of tail) disc(g, tx, ty + bob * 0.4, Math.round(r * k), '#fff8e8');
    // nuvoletta: scatola a spigoli smussati, scala dal centro
    const ww = Math.round(w * k), hh = Math.round(h * k), x0 = Math.round(bx - ww / 2), y0 = Math.round(by - hh / 2);
    const box = (xx, yy, w2, h2, col) => { g.fillStyle = col; g.fillRect(xx + 2, yy, w2 - 4, h2); g.fillRect(xx, yy + 2, w2, h2 - 4); g.fillRect(xx + 1, yy + 1, w2 - 2, h2 - 2); };
    box(x0 - 1, y0 - 1, ww + 2, hh + 2, ink); box(x0, y0, ww, hh, '#fff8e8');
    g.fillStyle = '#e9dcc0'; g.fillRect(x0 + 2, y0 + hh - 2, ww - 4, 1);                         // ombra sotto
    // raggi d'entusiasmo nel primo istante
    if (b.t < 0.45) { g.fillStyle = ink; const rr = 3 + b.t * 14; for (let i = 0; i < 6; i++) { const an = -Math.PI * (0.1 + i * 0.16); g.fillRect(Math.round(bx + Math.cos(an) * (ww / 2 + rr)), Math.round(by + Math.sin(an) * (hh / 2 + rr)), 2, 2); } }
    if (k > 0.9) {
      const col = REA_COL[b.tipo] || '#d6261c';
      b.lines.forEach((l, i) => {
        const tx = Math.round(bx - this.textW(l, sc) / 2), ty = y0 + pad + i * lh;
        this.text(g, l, tx + 1, ty + 1, '#1a1520', sc); this.text(g, l, tx, ty, col, sc);
      });
    }
    g.restore();
  };

  P.drawComics = function (g, dt) {
    this.reaTick(dt);
    this.reaDraw(g);
    return prev.call(this, g, dt);
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { REA_LINES, REA_COL, reaPick, reaAccelStep });
