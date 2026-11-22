// ============================================================================
//  Night Run · Tabacchi dell'autogrill: gratta e vinci e sigarette (22/11, chiesti da Nico)
//  - Si comprano nel market della Sosta 24 (autogrill, «Da portare via») e finiscono nel bagagliaio.
//  - Gratta e vinci: tre biglietti (2, 5 e 10 €). Si grattano da fermi dal bagagliaio: nove caselle, tre importi
//    uguali = vinci quell'importo. Si vince circa una volta su quattro; in media tornano 70-80 centesimi per euro
//    (come quelli veri: si può vincere, ma alla lunga ci si perde). Probabilità in GV_PREMI.
//  - Sigarette: pacchetto da 10, si fumano anche guidando. Ogni sigaretta toglie un po' di sonno (TAB.sig.sonno);
//    fumarne una dietro l'altra serve a poco (TAB.sig.km), e un filo di sete e di igiene se ne va.
//  Stato in game.s.vg.tab (biglietti grattati, spesi, vinti, sigarette fumate). Test in test/tabacchi.test.js.
// ============================================================================
const TAB = {
  sig: { sonno: 0.07, km: 3, poco: 0.3, sete: 0.02, igiene: 0.015 },
};
// premi di ogni biglietto: [euro, probabilità]. Il resto è «non vinci».
const GV_PREMI = {
  gv_notte: [[2, 0.15], [4, 0.06], [10, 0.025], [20, 0.01], [50, 0.004], [500, 0.0004]],
  gv_sorpasso: [[5, 0.13], [10, 0.06], [20, 0.03], [50, 0.01], [100, 0.005], [1000, 0.0006], [10000, 0.00004]],
  gv_jackpot: [[10, 0.14], [20, 0.06], [50, 0.03], [100, 0.01], [500, 0.002], [5000, 0.0002], [100000, 0.00001]],
};
const GV_TIPI = ['gv_notte', 'gv_sorpasso', 'gv_jackpot'];
const TABACCHI = ['sigarette', ...GV_TIPI];
if (typeof INV !== 'undefined') Object.assign(INV, {
  gv_notte: { name: 'Gratta «Notte Fortunata»', kg: 0.01, price: 2, gratta: true, note: 'Biglietto da 2 €: tre importi uguali e vinci quell\'importo, fino a € 500. Si gratta da fermi.' },
  gv_sorpasso: { name: 'Gratta «Corsia di Sorpasso»', kg: 0.01, price: 5, gratta: true, note: 'Biglietto da 5 €: tre importi uguali e vinci, fino a € 10.000. Si gratta da fermi.' },
  gv_jackpot: { name: 'Gratta «Jackpot Autostrada»', kg: 0.01, price: 10, gratta: true, note: 'Biglietto da 10 €: tre importi uguali e vinci, fino a € 100.000. Si gratta da fermi.' },
  sigarette: { name: 'Pacchetto di sigarette', kg: 0.05, price: 5.5, uses: 10, note: 'Dieci sigarette: ognuna toglie un po\' di sonno (una dietro l\'altra servono a poco). Fa male, lo sai.' },
});

// estrazione del premio di un biglietto (rnd: numero tra 0 e 1)
function gvEstrai(tipo, r) {
  let acc = 0;
  for (const [euro, p] of GV_PREMI[tipo] || []) { acc += p; if (r < acc) return euro; }
  return 0;
}
// le nove caselle: se si vince, tre volte l'importo vinto; gli altri importi al massimo due volte (così niente tris finto)
function gvGriglia(tipo, premio, rnd) {
  const importi = (GV_PREMI[tipo] || []).map((x) => x[0]), out = [], conta = {};
  if (premio) for (let i = 0; i < 3; i++) out.push(premio);
  while (out.length < 9) {
    const v = importi[Math.floor(rnd() * importi.length)];
    if (v === premio || (conta[v] || 0) >= 2) continue;
    conta[v] = (conta[v] || 0) + 1; out.push(v);
  }
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
// quanto torna in media e quante volte si vince (per i test e per tarare)
function gvMedia(tipo) { return (GV_PREMI[tipo] || []).reduce((a, [e, p]) => a + e * p, 0); }
function gvVincita(tipo) { return (GV_PREMI[tipo] || []).reduce((a, x) => a + x[1], 0); }

(function tabLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  P.tab = function () { const v = this.s.vg || (this.s.vg = {}); return v.tab || (v.tab = { grattati: 0, spesi: 0, vinti: 0, massimo: 0, fumate: 0, fumoKm: -99 }); };
  P.tabKm = function () { return (this.s.dist || 0) / 1000; };
  // gratta il biglietto al posto i del bagagliaio: toglie il biglietto, paga subito la vincita
  P.tabGratta = function (i, rnd = Math.random) {
    const it = this.s.trunk[i]; if (!it || !GV_PREMI[it.kind]) return { ok: false, why: 'Non è un gratta e vinci' };
    if (Math.abs(this.sim.v) > 0.5 && !this.inside) return { ok: false, why: 'Fermati per grattare' };
    const premio = gvEstrai(it.kind, rnd()), griglia = gvGriglia(it.kind, premio, rnd), T = this.tab();
    this.s.trunk.splice(i, 1); this.applyMass();
    T.grattati++; T.spesi += INV[it.kind].price; T.vinti += premio; T.massimo = Math.max(T.massimo, premio);
    if (premio) this.s.money += premio;
    return { ok: true, gratta: { tipo: it.kind, nome: INV[it.kind].name, premio, griglia } };
  };
  // una sigaretta dal pacchetto al posto i
  P.tabFuma = function (i) {
    const it = this.s.trunk[i], v = this.s.vg; if (!it || it.kind !== 'sigarette') return { ok: false, why: 'Non sono sigarette' };
    if (!v || !v.needs) return { ok: false, why: 'Le tieni per il viaggio' };
    const T = this.tab(), km = this.tabKm(), N = v.needs, S = TAB.sig;
    const k = km - (T.fumoKm ?? -99) >= S.km ? 1 : S.poco;               // appena fumata: quasi niente
    N.sleep = Math.min(1, N.sleep + S.sonno * k);
    if (N.water != null) N.water = Math.max(0, N.water - S.sete);
    if (N.wash != null) N.wash = Math.max(0, N.wash - S.igiene);
    T.fumate++; T.fumoKm = km; it.uses = (it.uses ?? 10) - 1;
    if (it.uses <= 0) this.s.trunk.splice(i, 1);
    this.applyMass();
    this.say(k === 1 ? 'Una sigaretta col finestrino giù: gli occhi si aprono un po\'' : 'Un\'altra subito: non svegli più di così, e la gola brucia', 'buy');
    return { ok: true, fumo: true };
  };
  const ui = P.useItem;
  P.useItem = function (i) {
    const it = this.s.trunk && this.s.trunk[i];
    if (it && GV_PREMI[it.kind]) return this.tabGratta(i);
    if (it && it.kind === 'sigarette') return this.tabFuma(i);
    return ui.call(this, i);
  };
})();

// traguardo: una botta di fortuna
if (typeof TRG_LIST !== 'undefined') TRG_LIST.push({ id: 'grattaFortuna', name: 'Botta di fortuna', text: 'Vinci almeno € 100 con un gratta e vinci', prize: { soldi: 300 },
  check: (g) => { const t = g.s.vg && g.s.vg.tab; return [Math.min(100, (t && t.massimo) || 0), 100]; } });

// ---------------------------------------------------------------- interfaccia: icone e il biglietto da grattare
(function tabUI() {
  if (typeof document === 'undefined') return;
  // icone 32×32 (icone.js non ha queste voci: le disegniamo qui con lo stesso contorno scuro)
  const ICO = {};
  const disegna = (kind) => {
    const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    const r = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    if (kind === 'sigarette') {
      r('#d8d2c4', 8, 6, 16, 22); r('#f2ede2', 8, 6, 16, 3); r('#b8b0a0', 22, 6, 2, 22); r('#c8282a', 8, 13, 16, 9); r('#e84a40', 8, 13, 16, 2);
      r('#f4f0e8', 11, 2, 3, 5); r('#e8a050', 11, 2, 3, 2); r('#f4f0e8', 16, 3, 3, 4); r('#e8a050', 16, 3, 3, 2); r('#fff', 11, 16, 10, 2);
    } else {
      const col = { gv_notte: '#3a62d8', gv_sorpasso: '#1fa060', gv_jackpot: '#d8a020' }[kind] || '#888';
      r(col, 3, 7, 26, 18); r('rgba(255,255,255,.35)', 3, 7, 26, 2); r('rgba(0,0,0,.25)', 3, 23, 26, 2);
      for (let i = 0; i < 3; i++) r('#c8ccd4', 6 + i * 8, 12, 6, 8), r('#e8ecf2', 6 + i * 8, 12, 6, 2);
      r('#ffe25a', 22, 4, 6, 6); r('#fff6b0', 23, 5, 2, 2);
    }
    const im = x.getImageData(0, 0, 32, 32), d = im.data, a = new Uint8Array(1024);
    for (let i = 0; i < 1024; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
    for (let i = 0; i < 1024; i++) { if (a[i]) continue; const xx = i % 32, yy = (i / 32) | 0; if ((xx > 0 && a[i - 1]) || (xx < 31 && a[i + 1]) || (yy > 0 && a[i - 32]) || (yy < 31 && a[i + 32])) { d[i * 4] = 11; d[i * 4 + 1] = 13; d[i * 4 + 2] = 22; d[i * 4 + 3] = 255; } }
    x.putImageData(im, 0, 0); return c;
  };
  const ni = window.NR_ICON;
  if (ni) window.NR_ICON = function (kind) { return TABACCHI.includes(kind) ? (ICO[kind] || (ICO[kind] = disegna(kind))) : ni(kind); };

  // il biglietto: nove caselle sotto la patina argentata, si gratta col mouse o col dito
  const css = document.createElement('style');
  css.textContent = `.gv-ov{position:fixed;inset:0;z-index:95;background:rgba(4,4,10,.72);display:flex;align-items:center;justify-content:center}
.gv-card{width:min(92vw,420px);border-radius:14px;padding:14px 16px 16px;color:#fff;font:600 14px system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.6)}
.gv-card h3{margin:0 0 2px;font:800 20px/1.1 system-ui,sans-serif;letter-spacing:.02em}.gv-card p{margin:0 0 10px;opacity:.85;font-weight:500;font-size:12px}
.gv-wrap{position:relative;width:100%;aspect-ratio:3/2;border-radius:10px;overflow:hidden;touch-action:none;cursor:crosshair}
.gv-wrap canvas{position:absolute;inset:0;width:100%;height:100%}
.gv-esito{min-height:26px;margin:10px 0 8px;text-align:center;font:800 19px system-ui,sans-serif}
.gv-btns{display:flex;gap:8px;justify-content:center}.gv-btns button{flex:1;padding:9px;border-radius:9px;border:0;font:700 14px system-ui,sans-serif;cursor:pointer;background:#1b1b26;color:#fff}`;
  document.head.appendChild(css);
  const COL = { gv_notte: ['#1c2f78', '#3a62d8'], gv_sorpasso: ['#0f5a34', '#1fa060'], gv_jackpot: ['#7a4c08', '#d8a020'] };
  const eur = (n) => '€ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  function suono(vinto) {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)(), t = ac.currentTime, note = vinto ? [523, 659, 784, 1047] : [330, 262];
      note.forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t + i * 0.12); g.gain.linearRampToValueAtTime(0.12, t + i * 0.12 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.35); o.connect(g).connect(ac.destination); o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.4); });
      setTimeout(() => ac.close(), 1500);
    } catch (e) { /* senza audio va bene lo stesso */ }
  }
  function gratta(res) {
    const game = window.nightRun && window.nightRun.game, [c1, c2] = COL[res.tipo] || ['#333', '#666'];
    const ov = document.createElement('div'); ov.className = 'gv-ov';
    ov.innerHTML = `<div class="gv-card" style="background:linear-gradient(160deg,${c2},${c1})"><h3>${res.nome.replace('Gratta ', '')}</h3><p>Gratta le nove caselle: tre importi uguali e vinci quell'importo.</p>
      <div class="gv-wrap"><canvas class="gv-sotto" width="600" height="400"></canvas><canvas class="gv-sopra" width="600" height="400"></canvas></div>
      <div class="gv-esito">&nbsp;</div><div class="gv-btns"><button type="button" data-a="tutto">Gratta tutto</button><button type="button" data-a="chiudi">Chiudi</button></div></div>`;
    document.body.appendChild(ov);
    const sotto = ov.querySelector('.gv-sotto').getContext('2d'), cs = ov.querySelector('.gv-sopra'), sopra = cs.getContext('2d');
    // sotto: le caselle con gli importi
    sotto.fillStyle = '#fbf6e6'; sotto.fillRect(0, 0, 600, 400);
    res.griglia.forEach((v, i) => {
      const x = 20 + (i % 3) * 190, y = 20 + Math.floor(i / 3) * 125, win = res.premio && v === res.premio;
      sotto.fillStyle = win ? '#fff1a8' : '#efe6cc'; sotto.fillRect(x, y, 180, 115);
      sotto.fillStyle = win ? '#b4141a' : '#2a2a38'; sotto.font = `900 ${v >= 10000 ? 34 : 44}px system-ui,sans-serif`; sotto.textAlign = 'center'; sotto.textBaseline = 'middle'; sotto.fillText(eur(v), x + 90, y + 60);
    });
    // sopra: la patina argentata con un po' di grana e la scritta GRATTA QUI
    const gr = sopra.createLinearGradient(0, 0, 600, 400); gr.addColorStop(0, '#c9ced8'); gr.addColorStop(0.5, '#eef1f6'); gr.addColorStop(1, '#aab0bc');
    sopra.fillStyle = gr; sopra.fillRect(0, 0, 600, 400);
    for (let i = 0; i < 2500; i++) { sopra.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '90,96,110'},.18)`; sopra.fillRect(Math.random() * 600, Math.random() * 400, 2, 2); }
    sopra.fillStyle = 'rgba(70,76,92,.55)'; sopra.font = '900 40px system-ui,sans-serif'; sopra.textAlign = 'center'; sopra.fillText('GRATTA QUI', 300, 210);
    let finito = false, giu = false, last = null;
    const esito = () => {
      if (finito) return; finito = true; sopra.clearRect(0, 0, 600, 400);
      ov.querySelector('.gv-esito').textContent = res.premio ? `HAI VINTO ${eur(res.premio)}!` : 'Niente stavolta. Ritenta.';
      ov.querySelector('[data-a="tutto"]').style.visibility = 'hidden'; suono(!!res.premio);
      if (game) game.say(res.premio ? `Gratta e vinci: vinti ${eur(res.premio)}` : 'Gratta e vinci: niente', res.premio ? 'buy' : 'info');
    };
    const pos = (ev) => { const b = cs.getBoundingClientRect(); return [(ev.clientX - b.left) * 600 / b.width, (ev.clientY - b.top) * 400 / b.height]; };
    const raschia = (ev) => {
      if (!giu || finito) return; const [x, y] = pos(ev);
      sopra.globalCompositeOperation = 'destination-out'; sopra.lineWidth = 46; sopra.lineCap = 'round';
      sopra.beginPath(); sopra.moveTo(...(last || [x, y])); sopra.lineTo(x, y); sopra.stroke(); last = [x, y];
      sopra.globalCompositeOperation = 'source-over';
    };
    const quanto = () => { const d = sopra.getImageData(0, 0, 600, 400).data; let n = 0; for (let i = 3; i < d.length; i += 64) if (d[i] < 20) n++; return n / (d.length / 64); };
    cs.addEventListener('pointerdown', (ev) => { giu = true; last = null; cs.setPointerCapture(ev.pointerId); raschia(ev); });
    cs.addEventListener('pointermove', raschia);
    cs.addEventListener('pointerup', () => { giu = false; last = null; if (quanto() > 0.6) esito(); });
    const chiudi = () => { esito(); ov.remove(); document.removeEventListener('keydown', tasto, true); };
    const tasto = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); chiudi(); } else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); if (finito) chiudi(); else esito(); } };
    document.addEventListener('keydown', tasto, true);
    ov.addEventListener('click', (ev) => { const a = ev.target.dataset && ev.target.dataset.a; if (a === 'tutto') esito(); else if (a === 'chiudi') chiudi(); });
  }
  // dal bagagliaio: dopo aver grattato si apre il biglietto
  const G = typeof StreetGame !== 'undefined' && StreetGame.prototype, uiG = G && G.useItem;
  if (uiG) G.useItem = function (i) { const r = uiG.call(this, i); if (r && r.gratta) setTimeout(() => gratta(r.gratta), 50); return r; };
  window.NightTabacchi = { gratta };
})();

if (typeof window !== 'undefined') Object.assign(window, { TAB, GV_PREMI, GV_TIPI, TABACCHI, gvEstrai, gvGriglia, gvMedia, gvVincita });
