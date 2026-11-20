// ============================================================================
//  Night Run · Statistiche della partita (dopo polizia.js)
//  Conta i numeri della partita in game.s.stat: tempo al volante, velocità massima, inseguimenti (iniziati, seminati,
//  persi), scuse riuscite, verbali, auto distrutte, giorni in rosso. Gli altri file chiamano game.statAdd('chiave')
//  (se c'è). La scheda Partita del menu (menu.js) li mostra sotto il riassunto, con STAT_VOCI.
// ============================================================================
// [chiave, nome, come si scrive il valore]
const STAT_VOCI = [
  ['guida', 'Ore al volante', (v) => (v / 3600).toLocaleString('it-IT', { maximumFractionDigits: 1 })],
  ['vmax', 'Velocità massima', (v) => Math.round(v) + ' km/h'],
  ['fughe', 'Fughe dalla polizia', (v) => v],
  ['seminate', 'Seminate', (v) => v],
  ['prese', 'Prese dopo la fuga', (v) => v],
  ['volanti', 'Record di volanti', (v) => v],
  ['scuse', 'Scuse riuscite', (v) => v],
  ['verbali', 'Verbali (velox, Tutor)', (v) => v],
  ['multe', 'Multe pagate', (v) => '€ ' + Math.round(v).toLocaleString('it-IT')],
  ['urti', 'Incidenti', (v) => v],
  ['rotte', 'Auto distrutte', (v) => v],
  ['rosso', 'Volte in rosso', (v) => v],
];
(function statistiche() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  P.stats = function () { return (this.s.stat = this.s.stat || {}); };
  P.statAdd = function (k, n = 1) { const S = this.stats(); S[k] = (S[k] || 0) + n; return S[k]; };
  P.statMax = function (k, v) { const S = this.stats(); if (!(S[k] >= v)) S[k] = v; return S[k]; };
  // per la scheda: valori già scritti, con multe e incidenti presi da dove li conta già il gioco
  P.statList = function () {
    const S = this.stats(), val = { ...S, multe: this.s.fines || 0, urti: this.s.crashes || 0 };
    return STAT_VOCI.map(([k, nome, f]) => ({ k, nome, testo: String(f(val[k] || 0)) }));
  };
  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    if (this.mode !== 'career') return;
    const S = this.stats(), sim = this.sim;
    if (!this.inside && Math.abs(sim.v) > 1) S.guida = (S.guida || 0) + dt;
    if (!this.inside) this.statMax('vmax', Math.abs(sim.v) * 3.6);
    const rotta = (sim.damage || 0) >= 0.95;
    if (rotta && !this._statRotta) this.statAdd('rotte');
    this._statRotta = rotta;
    const rosso = this.s.money < 0;
    if (rosso && this._statRosso === false) this.statAdd('rosso');
    this._statRosso = rosso;
    if (this.pol && this.pol.cs) this.statMax('volanti', this.pol.cs.length);
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { STAT_VOCI });
