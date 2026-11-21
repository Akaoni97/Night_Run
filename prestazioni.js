// ============================================================================
//  Night Run · Prestazioni (dopo nitido2d.js, prima dello script principale)
//  Impostazioni → Grafica → Prestazioni: quanto lavora la grafica, per far girare liscio anche i computer lenti.
//  Una scelta pronta (Automatica, Massima, Equilibrata, Fluida, Minima) o le voci una per una:
//    densità doppia (alta definizione) · bagliore delle luci · luci notturne (mappa di luce e coni dei lampioni) ·
//    vita sulla strada (foglie, cartacce, falene, riflessi: vita2d.js) · passanti disegnati come il protagonista ·
//    dettagli delle gomme (gomme2d.js) · tetto ai fotogrammi (30 o 60 al secondo, il ciclo di index.html lo legge da NR_PREST).
//  In «Automatica» la grafica parte al massimo e, se il disegno resta lento (sopra PREST.ms per PREST.attesa secondi), scende
//  un gradino alla volta (PREST_GRADINI: prima il bagliore, poi vita e passanti, per ultima la densità) invece di passare
//  subito a densità semplice come prima. Il gradino raggiunto si ricorda per questo computer (localStorage nr_slow) e si
//  azzera con «Riprova al massimo». Le scelte stanno in localStorage nr_prest (sono del computer, non della partita).
//  Agganci: Street2D.perfStep (chiamata da update di street2d.js) e i flag noLuci, noVita, noPedHD, noGomme, glow.
// ============================================================================
const PREST = { ms: 24, attesa: 3 };
const PREST_GRADINI = ['Tutto acceso', 'Bagliore spento', 'Vita e passanti semplici', 'Densità semplice'];
const PREST_DEF = { preset: 'auto', densita: 'auto', bagliore: true, luci: true, vita: true, passanti: true, gomme: true, fps: 0 };
// le scelte pronte: q = qualità del menu (#q3d) che va con quella scelta
const PREST_PRESET = {
  auto: { nome: 'Automatica (consigliata)', q: 'alta', v: { densita: 'auto', bagliore: true, luci: true, vita: true, passanti: true, gomme: true, fps: 0 } },
  max: { nome: 'Massima', q: 'alta', v: { densita: 'doppia', bagliore: true, luci: true, vita: true, passanti: true, gomme: true, fps: 0 } },
  equi: { nome: 'Equilibrata', q: 'alta', v: { densita: 'auto', bagliore: true, luci: true, vita: true, passanti: false, gomme: true, fps: 60 } },
  fluida: { nome: 'Fluida (computer lenti)', q: 'alta', v: { densita: 'normale', bagliore: false, luci: true, vita: false, passanti: false, gomme: true, fps: 60 } },
  minima: { nome: 'Minima', q: 'bassa', v: { densita: 'normale', bagliore: false, luci: false, vita: false, passanti: false, gomme: false, fps: 30 } },
};
const NR_PREST = (() => {
  let o = {};
  try { o = JSON.parse(localStorage.getItem('nr_prest') || '{}') || {}; } catch (e) { o = {}; }
  return Object.assign({}, PREST_DEF, o);
})();
function prestSave() { try { localStorage.setItem('nr_prest', JSON.stringify(NR_PREST)); } catch (e) { /* ignora */ } }
// gradino automatico raggiunto da questo computer (0-3); il vecchio '1' di nr_slow (densità semplice) vale 3
function prestLvLoad() { try { const v = localStorage.getItem('nr_slow'); return v === '1' ? 3 : Math.max(0, Math.min(3, parseInt(v, 10) || 0)); } catch (e) { return 0; } }
// cosa disegnare, dalle scelte e dal gradino automatico (puro, provato in test/prestazioni.test.js)
function prestFlags(P, lv) {
  const auto = P.densita === 'auto';
  lv = auto ? lv || 0 : 0;
  return {
    slow: P.densita === 'normale' || (auto && lv >= 3),
    glow: P.bagliore && lv < 1,
    luci: !!P.luci,
    vita: P.vita && lv < 2,
    passanti: P.passanti && lv < 2,
    gomme: !!P.gomme,
  };
}
// un passo della misura: t = tempo del disegno del fotogramma prima (ms). Dà il nuovo stato { avg, bad, lv, sale }.
function prestMisura(st, t, dt) {
  const avg = st.avg === undefined ? t : st.avg * 0.97 + t * 0.03;
  let bad = avg > PREST.ms ? (st.bad || 0) + dt : 0, lv = st.lv || 0, sale = false;
  if (bad > PREST.attesa && lv < 3) { lv++; bad = 0; sale = true; }
  return { avg: sale ? undefined : avg, bad, lv, sale };
}

if (typeof Street2D !== 'undefined') {
  const S = Street2D.prototype;
  S.perfStep = function (dt) {
    Street2D.cur = this;
    if (this.pfLv === undefined) this.pfLv = prestLvLoad();
    const P = NR_PREST;
    if (P.densita === 'auto' && this.tPrev !== undefined && this.pfLv < 3) {
      const r = prestMisura({ avg: this.tAvg, bad: this.tBad, lv: this.pfLv }, this.tPrev, dt);
      this.tAvg = r.avg; this.tBad = r.bad;
      if (r.sale) { this.pfLv = r.lv; try { localStorage.setItem('nr_slow', String(r.lv)); } catch (e) { /* ignora */ } }
    }
    const f = prestFlags(P, this.pfLv);
    this.slow = f.slow; this.glow = f.glow ? undefined : false;
    this.noLuci = !f.luci; this.noVita = !f.vita; this.noPedHD = !f.passanti; this.noGomme = !f.gomme;
  };
  const reset = S.slowReset;
  S.slowReset = function () { if (reset) reset.call(this); this.pfLv = 0; this.tAvg = undefined; this.tBad = 0; };
}

// il riquadro nelle impostazioni (menu.js lo mette in Grafica)
(function prestUI() {
  if (typeof document === 'undefined') return;
  let box = null;
  const lv = () => { const s = Street2D.cur; return s && s.pfLv !== undefined ? s.pfLv : prestLvLoad(); };
  const sel = (id, label, opts, val) => `<label class="kbtn qsel">${label} <select data-k="${id}" aria-label="${label}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(val) ? ' selected' : ''}>${t}</option>`).join('')}</select></label>`;
  const onoff = [['1', 'accesi'], ['0', 'spenti']];
  function render() {
    const P = NR_PREST, b = (v) => (v ? '1' : '0');
    const stato = P.densita === 'auto' ? `Questo computer: <b>${PREST_GRADINI[lv()]}</b>` + (lv() ? ' (scelto da solo perché il disegno era lento)' : '') : 'Gradini automatici spenti: vale quello che scegli qui.';
    if (!box) return;
    box.innerHTML = `<p class="hint">Se il gioco scatta, scegli <b>Fluida</b>. «Automatica» parte al massimo e spegne da sola una cosa alla volta se il computer non ce la fa.</p>
<div class="gm-row">${sel('preset', 'Grafica', Object.entries(PREST_PRESET).map(([k, p]) => [k, p.nome]).concat(P.preset === 'custom' ? [['custom', 'Personalizzata']] : []), P.preset)}
${sel('densita', 'Densità', [['auto', 'automatica'], ['doppia', 'doppia (alta definizione)'], ['normale', 'normale (più veloce)']], P.densita)}
${sel('bagliore', 'Bagliore delle luci', onoff.map(([v, t]) => [v, t === 'accesi' ? 'acceso' : 'spento']), b(P.bagliore))}
${sel('luci', 'Luci di notte', onoff, b(P.luci))}
${sel('vita', 'Vita sulla strada', [['1', 'accesa'], ['0', 'spenta']], b(P.vita))}
${sel('passanti', 'Passanti', [['1', 'dettagliati'], ['0', 'semplici']], b(P.passanti))}
${sel('gomme', 'Dettagli delle gomme', onoff, b(P.gomme))}
${sel('fps', 'Fotogrammi al secondo', [['0', 'senza limite'], ['60', '60'], ['30', '30']], P.fps)}</div>
<p class="hint" id="prStato">${stato}</p>${P.densita === 'auto' && lv() ? '<button type="button" class="kbtn" id="prRiprova">Riprova al massimo<small>torna al primo gradino e rimisura</small></button>' : ''}`;
    box.querySelectorAll('select').forEach((s) => s.addEventListener('change', () => set(s.dataset.k, s.value)));
    const rp = box.querySelector('#prRiprova');
    if (rp) rp.addEventListener('click', () => { try { localStorage.removeItem('nr_slow'); } catch (e) { /* ignora */ } const s = Street2D.cur; if (s && s.slowReset) s.slowReset(); render(); });
  }
  function set(k, v) {
    if (k === 'preset') {
      const p = PREST_PRESET[v]; if (!p) return;
      Object.assign(NR_PREST, p.v, { preset: v });
      const q = document.getElementById('q3d');
      if (q && q.value !== p.q) { q.value = p.q; q.dispatchEvent(new Event('change', { bubbles: true })); }
    } else {
      NR_PREST[k] = k === 'densita' ? v : k === 'fps' ? Number(v) || 0 : v === '1';
      NR_PREST.preset = 'custom';
    }
    prestSave(); render();
  }
  function panel() {                                           // il contenuto: menu.js lo mette in un riquadro «Prestazioni»
    if (!box) { box = document.createElement('div'); box.className = 'prestazioni'; render(); }
    return box;
  }
  window.NightPrest = { panel, set, get: () => Object.assign({}, NR_PREST), lv };
})();

if (typeof window !== 'undefined') Object.assign(window, { NR_PREST, PREST, PREST_PRESET, prestFlags, prestMisura });
