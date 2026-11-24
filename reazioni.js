// ============================================================================
//  Night Run · Reazioni del protagonista (dopo fumetti2d.js, meteo2d.js e sensi.js, v0.119)
//  Il protagonista si accorge di quello che fa la macchina e ci reagisce: quando accelera forte, fa un launch, sorpassa, quando
//  lo scarico spara o il motore canta al limitatore, sopra la sua testa esce una vignetta in pixel art e in faccia gli si legge
//  lo stupore (occhi grandi, bocca aperta: `awe` di pgDriver in personaggio.js).
//  v0.124 (deciso da Luca): **niente parole, solo versi** che imitano la macchina, come un bambino che fa il motore: secondo il
//  momento e il suono vero dell'auto (famiglia del motore in `REA_FAM`: tre cilindri «TRATRATRA», diesel «BRUUU», sei
//  cilindri «UUUAAAH»...) e gli scoppi secondo quanto è preparata (`REA_BOTTO`: POP! → PUPUPU! → TRATATAN!). Le lettere escono
//  una alla volta come se le dicesse, ballano e negli urli tremano; scoppi, limitatore e partenze hanno la vignetta a punte.
//  Si spegne con Impostazioni → Grafica → Scritte sulla strada → Versi del pilota (`street2d.reaOn`, `S.reazioni`), a parte dalle scritte da fumetto.
//  Parte pura (provata in test/reazioni.test.js): REA_LINES, REA_FAM, REA_BOTTO, reaFam, reaPick, reaAccelStep. Disegno: agganciato a Street2D.drawComics.
//  La posizione della testa la scrive pilota2d.js (`_drvHead`), la faccia legge `_rea.awe`.
//  Prova a mano: `nightRun.view2d.reaSay('accel')` (tipi: accel, launch1, launch2, sorpasso, botto, giri, turbo).
// ============================================================================
// versi per tipo di momento (maiuscole senza accenti: il carattere a pixel non li ha; '|' = a capo, al massimo due righe di 12 lettere).
// Solo versi, niente parole: sono quelli di base (un quattro cilindri sportivo); REA_FAM li cambia secondo il motore.
const REA_LINES = {
  accel: ['VRAAAAM!', 'VRRRAAAA|AAAAM!', 'NYAAAAAA!', 'BRAAAAP!'],
  launch1: ['BRA BRA|BRAAAA!', 'TA-TA-TA-TA!', 'NGA NGA NGA!', 'BRAP BRAP!'],
  launch2: ['VRUUUUUM!', 'ZOOOOOOM!', 'NYAAAAAAA!', 'SKRIIIIII!'],
  sorpasso: ['ZIIIUUUM!', 'FIUUUUUN!', 'NYOOOOM!', 'FSSSSHUM!'],
  botto: ['PUPUPU!', 'PA-PA-PAM!', 'POP POP!', 'PUPU-PAM!'],
  giri: ['TATATATA!', 'RA-RA-RA-RA!', 'BRRAP BRRAP!', 'NGNGNGNG!'],
  turbo: ['FIIIUUUU!', 'PSSSSHHH!', 'STUTUTUTU!', 'FIIIISSSH!'],
};
// il verso cambia col motore (famiglia di suoni.js, o cilindri e alimentazione per le auto fatte a mano)
const REA_FAM = {
  citta: { accel: ['NIIIIIII!', 'VIIIIUUU!', 'NYEEEEEE!', 'ZIIIIII!'], giri: ['NI-NI-NI-NI!', 'NENENENE!'] },
  berlina: { accel: ['VUUUUUM!', 'BROOOOOM!', 'VROOOOOM!'], giri: ['BRO-BRO-BRO!', 'VU-VU-VU-VU!'] },
  tre: { accel: ['TRRRRAAA!', 'BRRRRRRR!', 'TRATRATRA!', 'GRRRRAAA!'], giri: ['TRA-TRA-TRA!', 'TRTRTRTR!'] },
  turbo: { accel: ['VRUUU|FIIIUUU!', 'SSSHVROOOM!', 'FSSSS|VRAAAM!'] },
  cinque: { accel: ['UOOOOOAAA!', 'BWAAAAAAH!', 'WRAAOOOOW!'], giri: ['UA-UA-UA-UA!', 'BWABWABWA!'] },
  sei: { accel: ['UUUAAAAAAH!', 'NGAAAAAAA!', 'AAAOOOOWW!'], giri: ['AAAAAAAA!', 'NGA-NGA-NGA!'] },
  diesel: { accel: ['BRUUUUUU!', 'TOCTOCTOC|BRUUU!', 'BRRROOOO!'], giri: ['BRU-BRU-BRU!', 'TOC-TOC-TOC!'], botto: ['PUF!', 'TOC!'] },
  bus: { accel: ['BRUUUUUUM!', 'FSSHH|BRUUUUM!'], giri: ['BRU-BRU-BRU!'], botto: ['PUF!', 'PFFF!'] },
};
// gli scoppi secondo quanto è preparata l'auto (flameTier di fiamme.js: 0 leggera, 1 media, 2 spinta)
const REA_BOTTO = [['POP!', 'PUP!', 'TOC!', 'POC!'], ['PUPUPU!', 'PA-PA-PAM!', 'POP POP!', 'PUPU-PAM!'], ['TRATATAN!', 'TARATARATA!', 'BAM BAM BAM!', 'TATATA-BAM!']];
// colore del testo per tipo
const REA_COL = { accel: '#d6261c', launch1: '#e8590c', launch2: '#d6261c', sorpasso: '#1c6fd6', botto: '#c97a00', giri: '#7a2bd6', turbo: '#0a8f8f' };
// vignetta a punte (urlo) per questi momenti
const REA_URLO = { botto: 1, giri: 1, launch2: 1 };
// la famiglia del verso per un'auto (c = CARS[id])
function reaFam(id, c) {
  if (!c) return id === 'supra' ? 'sei' : null;
  if (c.sound && REA_FAM[c.sound]) return c.sound;
  if (id === 'supra' || c.cyl === 6) return 'sei';
  if (c.diesel) return 'diesel';
  if (c.cyl === 5) return 'cinque';
  if (c.cyl === 3) return 'tre';
  return null;
}
// l'elenco dei versi per un momento: dal motore (fam), per gli scoppi dalla preparazione (tier)
function reaVersi(tipo, fam, tier) {
  const F = fam && REA_FAM[fam];
  if (F && F[tipo]) return F[tipo];
  if (tipo === 'botto' && tier != null) return REA_BOTTO[Math.max(0, Math.min(2, tier | 0))];
  return REA_LINES[tipo];
}
// un verso a caso del tipo, mai uguale al precedente. rnd = numero casuale in [0, 1)
function reaPick(tipo, prev, rnd, fam, tier) {
  const v = reaVersi(tipo, fam, tier); if (!v) return null;
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
    const NR = typeof window !== 'undefined' && window.nightRun, id = NR && NR.game && NR.game.car;
    let tier = null; try { tier = NR && NR.exh ? NR.exh().tier : null; } catch (e) { tier = null; }
    const txt = reaPick(tipo, R.last[tipo], null, reaFam(id, typeof CARS !== 'undefined' && CARS[id]), tier); if (!txt) return false;
    R.last[tipo] = txt; R.cat[tipo] = REA.cat[tipo] || 15; R.cd = REA.cdAll + Math.random() * 4;
    R.bub = { t: 0, life: 2.1 + txt.length * 0.04, lines: txt.split('|'), tipo, j: Math.random() * 6.28, n: txt.replace('|', '').length, urlo: !!REA_URLO[tipo], forte: tier === 2 };
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
    if (g.inside || !sim.running || this.reaOn === false || this.quality === 'bassa') return;
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
    // nuvoletta: scatola a spigoli smussati, scala dal centro (negli urli trema un po')
    const sh = b.urlo && b.t < b.life - 0.3 ? Math.round(Math.sin(b.t * 47 + b.j) * (b.forte ? 1.3 : 0.8)) : 0;
    const ww = Math.round(w * k), hh = Math.round(h * k), x0 = Math.round(bx - ww / 2) + sh, y0 = Math.round(by - hh / 2);
    const box = (xx, yy, w2, h2, col) => { g.fillStyle = col; g.fillRect(xx + 2, yy, w2 - 4, h2); g.fillRect(xx, yy + 2, w2, h2 - 4); g.fillRect(xx + 1, yy + 1, w2 - 2, h2 - 2); };
    // punte dell'urlo: triangoli a pixel intorno alla scatola, prima il contorno poi il fondo
    const punta = (cx, cy, an, len, wd, col) => {
      g.fillStyle = col; const ca = Math.cos(an), sa = Math.sin(an);
      for (let d = 0; d <= len; d++) { const r = Math.max(0, Math.round(wd * (1 - d / len))); g.fillRect(Math.round(cx + ca * d - r), Math.round(cy + sa * d - r), 2 * r + 1, 2 * r + 1); }
    };
    const punte = [];
    if (b.urlo) {
      const n = 9, rx = ww / 2, ry = hh / 2;
      for (let i = 0; i < n; i++) {
        const an = (i / n) * Math.PI * 2 + 0.3 + Math.sin(b.t * 9 + i) * 0.04;
        if (an % (Math.PI * 2) > 1.55 && an % (Math.PI * 2) < 2.35) continue;                  // lascia libero dove esce la coda
        const ex = Math.cos(an), ey = Math.sin(an), sc2 = Math.min(rx / Math.max(0.01, Math.abs(ex)), ry / Math.max(0.01, Math.abs(ey)));
        punte.push([bx + sh + ex * sc2 * 0.85, by + ey * sc2 * 0.85, an, (5 + (i % 2) * 3 + (b.forte ? 2 : 0)) * k, 2.4 * k]);
      }
    }
    // coda a punta verso la testa (è lui che fa il verso)
    const coda = (col, o) => { g.fillStyle = col; const ax = bx - ww * 0.18, ay = y0 + hh - 1; for (let d = 0; d <= 1; d += 1 / 16) { const x = ax + (hx + 3 - ax) * d, y = ay + (hy - 6 - ay) * d, r = Math.round((1 - d) * 3 * k) + o; g.fillRect(Math.round(x - r), Math.round(y - r / 2), 2 * r + 1, Math.max(1, r)); } };
    for (const p of punte) punta(p[0], p[1], p[2], p[3] + 1, p[4] + 1, ink);
    coda(ink, 1); box(x0 - 1, y0 - 1, ww + 2, hh + 2, ink);
    const fondo = b.urlo ? (b.forte ? '#fff2a8' : '#fff6d0') : '#fff8e8';
    for (const p of punte) punta(p[0], p[1], p[2], p[3], p[4], fondo);
    coda(fondo, 0); box(x0, y0, ww, hh, fondo);
    g.fillStyle = '#e9dcc0'; g.fillRect(x0 + 2, y0 + hh - 2, ww - 4, 1);                         // ombra sotto
    // raggi d'entusiasmo nel primo istante (non negli urli: hanno già le punte)
    if (!b.urlo && b.t < 0.45) { g.fillStyle = ink; const rr = 3 + b.t * 14; for (let i = 0; i < 6; i++) { const an = -Math.PI * (0.1 + i * 0.16); g.fillRect(Math.round(bx + Math.cos(an) * (ww / 2 + rr)), Math.round(by + Math.sin(an) * (hh / 2 + rr)), 2, 2); } }
    if (k > 0.9) {
      // le lettere escono una alla volta come se le dicesse, e ballano; negli urli tremano
      const col = REA_COL[b.tipo] || '#d6261c', vis = Math.floor(b.t * 24) + 2, amp = b.urlo ? 1.6 : 1;
      let n = 0;
      b.lines.forEach((l, li) => {
        const tx = Math.round(bx - this.textW(l, sc) / 2) + sh, ty = y0 + pad + li * lh;
        for (let i = 0; i < l.length; i++, n++) {
          if (n >= vis) return;
          const ch = l[i]; if (ch === ' ') continue;
          const fresh = vis - n <= 2 ? -1 : 0;                                                   // l'ultima lettera uscita salta su
          const dy = Math.round(Math.sin(b.t * 11 - n * 0.8) * amp) + fresh + (b.urlo ? Math.round(Math.sin(b.t * 53 + n * 2.1) * 0.6) : 0);
          const c2 = b.forte && b.tipo === 'botto' && n % 2 ? '#e8590c' : col;
          const cx = tx + i * 4 * sc;
          this.text(g, ch, cx + 1, ty + 1 + dy, '#1a1520', sc); this.text(g, ch, cx, ty + dy, c2, sc);
        }
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
if (typeof window !== 'undefined') Object.assign(window, { REA_LINES, REA_FAM, REA_BOTTO, REA_COL, reaFam, reaPick, reaAccelStep });
