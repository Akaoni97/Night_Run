// ============================================================================
//  Night Run · Luca Garage (dopo garage.js)
//  App «Luca Garage» nel telefono: ti porta davanti a Da Luca Tuning, il negozio dove si modificano le auto, quello
//  più vicino (davanti o dietro). Costa € 150 (LG.prezzo), si usa da fermi e fuori dai locali. Nel gioco normale si
//  scarica con un cartellone sulla strada (TEL_APP_OFFERS, dopo l'app Motel); dalla scheda Sviluppatori si sblocca
//  subito (NightDev.luca). Stato: niente di suo, l'icona è in game.s.tel.apps.lug come le altre app scaricate.
// ============================================================================
const LG = { prezzo: 150, vicino: 60, davanti: 9 };      // costo del passaggio, entro quanti metri «sei già lì», metri prima della porta dove ti lascia

(function lucaGarageLogica() {
  if (typeof StreetGame === 'undefined' || typeof VG === 'undefined') return;
  const P = StreetGame.prototype;
  // il negozio di Luca più vicino alla posizione: { n, x (metri), dist (metri, positiva se è avanti), avanti }
  P.lgNear = function () {
    const d = this.s.dist, n0 = VG.stopIndex(d); let best = null;
    for (let k = 0; k <= VG_PATTERN.length; k++) for (const n of [n0 + k, n0 - k]) {
      if (n < 0 || VG.stop(n).id !== 'shop') continue;
      const x = VG.stopX(n), dd = Math.abs(x - d);
      if (!best || dd < best.dd) best = { n, x, dd, dist: x - d, avanti: x >= d };
    }
    return best;
  };
  // perché non si può partire adesso (testo) o null
  P.lgWhy = function () {
    if (!this.s.vg) return 'Serve un Viaggio in corso.';
    if (this.inside) return 'Prima esci dal locale.';
    if (!this.canMount()) return 'Fermati prima: ti vengono a prendere da fermo.';
    const n = this.lgNear();
    if (!n) return 'Nessun negozio di Luca da raggiungere.';
    if (n.dd < LG.vicino) return 'Sei già davanti a Luca.';
    if ((this.s.money || 0) < LG.prezzo) return `Servono € ${LG.prezzo} per il passaggio.`;
    return null;
  };
  // il passaggio: paga e ti lascia davanti alla porta di Luca, fermo
  P.lgGo = function () {
    const why = this.lgWhy(); if (why) return { ok: false, why };
    const n = this.lgNear();
    this.s.money -= LG.prezzo;
    this.s.dist = n.x - LG.davanti; this.s.far = Math.max(this.s.far || 0, this.s.dist); this.sim.v = 0;
    return { ok: true, km: n.dd / 1000, name: VG.stop(n.n).name };
  };

  // nel telefono si scarica come le altre app: un cartellone sulla strada dopo quello del Motel
  if (typeof TEL_APP_OFFERS !== 'undefined' && !TEL_APP_OFFERS.some((o) => o.app === 'lug')) {
    TEL_APP_OFFERS.push({ app: 'lug', km: 26, name: 'Luca Garage', sign: 'FERRO CHE|NON BASTA?' });
  }
})();

// ---------------------------------------------------------------- app nel telefono (solo nel browser)
(function lucaGarageApp() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CSS = `
.lg-hd{background:linear-gradient(135deg,#4a3410,#1a1206);border-radius:16px;padding:12px;margin-bottom:10px;font-size:12px;color:var(--t2)}.lg-hd b{display:block;font:800 16px system-ui;color:#ffd27a;margin-bottom:2px}
.lg-go{display:block;width:100%;padding:13px;border:0;border-radius:14px;background:#ffb347;color:#1a1206;font:800 15px system-ui;cursor:pointer}.lg-go[disabled]{opacity:.4;cursor:default}
.lg-why{margin:8px 2px;font-size:12px;color:#ffb347;min-height:1.2em}`;
  function render() {
    const g = G(); if (!g || !g.s || !g.s.vg || !g.lgNear) return '';
    const n = g.lgNear(), why = g.lgWhy();
    const dove = n ? (n.dd < LG.vicino ? 'Sei davanti a Luca.' : `${esc(VG.stop(n.n).name)} è a ${fmt(n.dd / 1000, 1)} km, ${n.avanti ? 'avanti' : 'indietro'}.`) : 'Nessun negozio trovato.';
    return `<div class="view app"><div class="nav"><h3>Luca Garage</h3></div><div class="body">
      <div class="lg-hd"><b>Da Luca Tuning</b>Il negozio dove si montano pezzi e assetto. ${dove}<br>Passaggio: € ${fmt(LG.prezzo)}, da fermi e fuori dai locali.</div>
      <button class="lg-go" data-x="go" ${why ? 'disabled' : ''}>Portami da Luca</button>
      <div class="lg-why">${why ? esc(why) : ''}</div>
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'lug', name: 'Luca Garage', color: 'linear-gradient(145deg,#ffb347,#8a4b0a)', css: CSS,
      icon: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
      render,
      click: (D) => {
        const g = G(); if (!g || D.x !== 'go') return;
        const r = g.lgGo();
        window.telefono.toast('Luca Garage', r.ok ? `Eccoti davanti a ${r.name}. − € ${LG.prezzo}` : r.why);
        if (r.ok && window.nightRun.save) window.nightRun.save();
        window.telefono.render();
      } });
    return true;
  };
  if (!add()) addEventListener('load', add);
})();
if (typeof window !== 'undefined') Object.assign(window, { LG });
