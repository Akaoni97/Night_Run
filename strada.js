// ============================================================================
//  Night Run · La strada viva: abbaglianti per chiedere strada, eventi in prima corsia
//  (incidenti con le quattro frecce, la polizia che ferma qualcuno) e un traffico che si comporta da autostrada.
//  Si aggancia a StreetGame (game.js), caricato dopo viaggio.js.
// ============================================================================

// categorie delle auto (le usano il Garage e i documenti: una Panda e una M5 non sono nella stessa classe)
const ST_CAT = {
  utilitaria: ['panda', 'punto', 'polo', 'corsa', 'clio', 'a112'],
  familiare: ['v40', 'a80', 'a3', 'p308', 'v850', 'taxi'],
  hot: ['golf', 'p205', 'p206', 'williams', 'r5'],
  sportiva: ['e30', 'e36', 'e34', 'b2002', 'supra'],
  lavoro: ['bus', 'van', 'doblo', 'ambulanza', 'polizia'],
};
const ST_CAT_NAME = { utilitaria: 'utilitarie', familiare: 'familiari', hot: 'piccole sportive', sportiva: 'sportive', lavoro: 'mezzi da lavoro' };
const ST_CAT_ONE = { utilitaria: 'un\'utilitaria', familiare: 'una familiare', hot: 'una piccola sportiva', sportiva: 'una sportiva', lavoro: 'un mezzo da lavoro' };
function stCat(id) { for (const k in ST_CAT) if (ST_CAT[k].includes(id)) return k; return 'familiare'; }

(function () {
  const P = StreetGame.prototype;
  const kmh = (v) => Math.round(v * 3.6);

  // ------------------------------------------------------------ abbaglianti: si chiede strada a chi sta davanti
  P.flashLights = function () {
    const d = this.s.dist;
    if (this.inside || this.track !== 'city') return null;
    const lead = this.ents.filter((e) => (e.kind === 'traffic' || e.kind === 'police') && !e.hazard && Math.abs(GAME_LANE_Z[e.lane] - this.laneZ) < 1.7 && e.x - d > 4 && e.x - d < 75).sort((a, b) => a.x - b.x)[0];
    if (!lead) return null;
    if (lead.kind === 'police') {
      if (lead.flashed) return null; lead.flashed = true;
      const fine = 80; this.s.money -= fine; this.s.heat = Math.min(3, (this.s.heat || 0) + 0.5);
      this.say(`Hai sfanalato una volante. Accosta, verbale: − € ${fine}`, 'police'); return 'police';
    }
    if (lead.flashed) return null;
    lead.flashed = true;
    // mette la freccia e si sposta a destra (o a sinistra se è già tutto a destra) per farti passare
    const to = lead.lane > 1 ? lead.lane - 1 : lead.lane + 1;
    lead.to = to; lead.sig = 1.0; lead.yield = 4;
    const nm = (CARS[lead.vt] && CARS[lead.vt].short) || 'L\'auto';
    this.say(`${nm} davanti mette la freccia e ti fa passare`, 'info');
    return 'yield';
  };

  // ------------------------------------------------------------ eventi in prima corsia: incidente, controllo della polizia
  P.spawnRoadEvent = function () {
    const d = this.s.dist, x = d + 650 + Math.random() * 250, kind = Math.random() < 0.55 ? 'crash' : 'stop';
    if (this.ents.some((e) => e.hazard && Math.abs(e.x - x) < 300)) return;
    const pick = () => GAME_TRAFFIC[Math.floor(Math.random() * GAME_TRAFFIC.length)];
    if (kind === 'crash') {
      // due auto tamponate, ferme in prima corsia con le quattro frecce
      const a = pick(), b = pick();
      this.ents.push({ id: this.id++, kind: 'traffic', vt: a.vt === 'bus' ? 'punto' : a.vt, len: 4.2, lane: 1, x, v: 0, vT: 0, vBase: 0, hazard: true, still: true, color: 'orig', dent: 1 });
      this.ents.push({ id: this.id++, kind: 'traffic', vt: b.vt === 'bus' ? 'polo' : b.vt, len: 4.2, lane: 1, x: x + 4.9, v: 0, vT: 0, vBase: 0, hazard: true, still: true, color: 'orig', dent: 1 });
      this.say('Più avanti: incidente in prima corsia, auto ferme con le quattro frecce', 'info');
    } else {
      // controllo: la volante coi lampeggianti dietro a un'auto ferma
      const a = pick();
      this.ents.push({ id: this.id++, kind: 'traffic', vt: a.vt === 'bus' ? 'clio' : a.vt, len: 4.2, lane: 1, x: x + 6.5, v: 0, vT: 0, vBase: 0, hazard: true, still: true, color: 'orig' });
      this.ents.push({ id: this.id++, kind: 'police', lane: 1, x, v: 0, busy: true, still: true, hazard: true });
      this.say('Più avanti: la polizia ha fermato un\'auto in prima corsia', 'info');
    }
  };

  // ------------------------------------------------------------ traffico più umano
  P.trafficAI = function (dt) {
    const d = this.s.dist;
    for (const e of this.ents) {
      if (e.kind !== 'traffic' || e.still) continue;
      e.yield = Math.max(0, (e.yield || 0) - dt);
      if (e.sig > 0 || e.to) continue;
      const near = (lane, back, front) => this.ents.some((o) => o !== e && (o.kind === 'traffic' || o.kind === 'police') && (o.lane === lane || o.to === lane) && o.x - e.x > -back && o.x - e.x < front)
        || (Math.abs(this.laneZ - GAME_LANE_Z[lane]) < 1.7 && d - e.x > -back && d - e.x < front);
      const lead = this.ents.find((o) => o !== e && (o.kind === 'traffic' || o.kind === 'police') && o.lane === e.lane && o.x > e.x && o.x - e.x < 60 + e.v * 1.2);
      // ostacolo fermo davanti (incidente, controllo): si sposta per tempo
      if (lead && lead.still && e.lane < 3 && !near(e.lane + 1, 15, 35)) { e.to = e.lane + 1; e.sig = 0.8; continue; }
      // qualcuno più lento davanti: sorpassa a sinistra se c'è spazio
      if (lead && lead.v < e.v - 1.5 && e.lane < 3 && Math.random() < dt * 0.8 && !near(e.lane + 1, 20 + e.v * 0.4, 30)) { e.to = e.lane + 1; e.sig = 1.2; continue; }
      // tiene la destra: rientra quando la corsia a destra è libera per un buon tratto
      if (e.lane > 1 && !e.yield && Math.random() < dt * 0.25 && !near(e.lane - 1, 18, 70 + e.v)) { const r = this.ents.find((o) => o.kind === 'traffic' && o.lane === e.lane - 1 && o.x > e.x && o.x - e.x < 90 && o.v < e.v - 2); if (!r) { e.to = e.lane - 1; e.sig = 1.4; } }
    }
  };

  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    if (this.track !== 'city' || this.inside) return;
    this.trafficAI(dt);
    // un evento ogni tanto (nel viaggio e in autostrada), sempre in prima corsia
    const km = this.s.dist / 1000;
    if (this.nextRoadEvent === undefined) this.nextRoadEvent = km + 4 + Math.random() * 6;
    if (km > this.nextRoadEvent) { this.nextRoadEvent = km + 7 + Math.random() * 12; if (this.s.vg || (this.loc && this.loc.bg === 'highway')) this.spawnRoadEvent(); }
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { ST_CAT, ST_CAT_NAME, ST_CAT_ONE, stCat });
