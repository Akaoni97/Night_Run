// ============================================================================
//  Night Run · La strada viva: sfide lanciate con gli abbaglianti, reputazione, eventi in prima corsia
//  (incidenti con le quattro frecce, la polizia che ferma qualcuno) e un traffico che si comporta da autostrada.
//  Si aggancia a StreetGame (game.js), caricato dopo viaggio.js.
// ============================================================================

// auto "che ci stanno": con gli abbaglianti accettano la sfida più spesso; i mezzi da lavoro non accettano mai
const ST_SPORTY = ['golf', 'p205', 'p206', 'williams', 'v850', 'a3', 'e30', 'e36', 'e34', 'r5', 'b2002', 'a112', 'supra'];
const ST_NEVER = ['bus', 'van', 'doblo', 'ambulanza', 'taxi'];
// categorie: con gli abbaglianti si sfidano solo auto della stessa categoria (una Panda non corre contro una M5)
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
const ST_RACE_M = 2000;                                      // sfida in corsa: due chilometri fissi
// reputazione: cosa si sblocca vincendo le sfide di strada
const ST_REP_PERKS = [
  { rep: 5, id: 'rep_rispetto', name: 'Rispetto', note: 'Le auto sportive accettano più spesso le sfide.' },
  { rep: 12, id: 'rep_mappa', name: 'Rimappatura da strada', note: '+3 % di potenza su tutte le auto.' },
  { rep: 25, id: 'rep_gomme', name: 'Gomme scelte dai ragazzi del porto', note: '+3 % di aderenza.' },
  { rep: 45, id: 'rep_sconto', name: 'Amici in officina', note: '15 % di sconto da Luca e da Niko.' },
  { rep: 70, id: 'rep_leggenda', name: 'Leggenda della notte', note: 'Altri +4 % di potenza.' },
];

(function () {
  const P = StreetGame.prototype;
  const kmh = (v) => Math.round(v * 3.6);

  // ------------------------------------------------------------ reputazione e suoi vantaggi
  P.streetRep = function () { const s = this.s; s.street = s.street || { w: 0, l: 0, rep: 0 }; return s.street; };
  P.repPerk = function (id) { const r = this.streetRep(), p = ST_REP_PERKS.find((q) => q.id === id); return !!p && r.rep >= p.rep; };
  const pp = P.perkPow, pg = P.perkGrip, dc = P.disc;
  P.perkPow = function () { return pp.call(this) + (this.repPerk('rep_mappa') ? 0.03 : 0) + (this.repPerk('rep_leggenda') ? 0.04 : 0); };
  P.perkGrip = function () { return pg.call(this) * (this.repPerk('rep_gomme') ? 1.03 : 1); };
  P.disc = function () { return dc.call(this) * (this.repPerk('rep_sconto') ? 0.85 : 1); };

  // ------------------------------------------------------------ abbaglianti: si chiede strada a chi sta davanti
  P.flashLights = function () {
    const d = this.s.dist, sim = this.sim;
    if (this.race || this.street || this.inside || this.track !== 'city') return null;
    const lead = this.ents.filter((e) => (e.kind === 'traffic' || e.kind === 'police') && !e.hazard && Math.abs(GAME_LANE_Z[e.lane] - this.laneZ) < 1.7 && e.x - d > 4 && e.x - d < 75).sort((a, b) => a.x - b.x)[0];
    if (!lead) return null;
    if (lead.kind === 'police') {
      if (lead.flashed) return null; lead.flashed = true;
      const fine = 80; this.s.money -= fine; this.s.heat = Math.min(3, (this.s.heat || 0) + 0.5);
      this.say(`Hai sfanalato una volante. Accosta, verbale: − € ${fine}`, 'police'); return 'police';
    }
    if (lead.flashed) return null;
    lead.flashed = true;
    const rep = this.streetRep();
    const sporty = ST_SPORTY.includes(lead.vt), never = ST_NEVER.includes(lead.vt);
    const cl = stCat(lead.vt), cm = stCat(this.car), same = cl === cm && cl !== 'lavoro';
    const chance = never || !same ? 0 : (sporty ? 0.65 : 0.4) + (this.repPerk('rep_rispetto') ? 0.15 : 0) + Math.min(0.15, rep.rep * 0.004);
    if (Math.random() < chance && sim.v > 8) { this.startStreetRace(lead); return 'race'; }
    // non ci sta: mette la freccia e si sposta a destra (o a sinistra se è già tutto a destra) per farti passare
    const to = lead.lane > 1 ? lead.lane - 1 : lead.lane + 1;
    lead.to = to; lead.sig = 1.0; lead.yield = 4;
    const nm = (CARS[lead.vt] && CARS[lead.vt].short) || 'L\'auto';
    if (!never && !same && cm !== 'lavoro') this.say(`${nm} è ${ST_CAT_ONE[cl]}, tu guidi ${ST_CAT_ONE[cm]}: niente sfida, mette la freccia e ti fa passare`, 'info');
    else this.say(`${nm} davanti mette la freccia e ti fa passare`, 'info');
    return 'yield';
  };

  // ------------------------------------------------------------ sfida in corsa: due chilometri, chi è davanti vince
  P.startStreetRace = function (e) {
    const c = CARS[e.vt] || {}, hp = (c.P && c.P.tq) ? Math.max(...c.P.tq.map(([r, t]) => (t - 16 - 0.0035 * r - 0.9e-6 * r * r) * r / 7023)) : 120;
    e.racing = true; e.hazard = false;
    e.rPow = hp * 735.5 * (0.78 + Math.random() * 0.17);       // potenza alla ruota, con un pilota più o meno bravo
    e.rMass = (c.mass || 1200) + 80; e.rCdA = ((c.P && c.P.cd) || 0.33) * ((c.P && c.P.A) || 2.1);
    e.rMaxV = Math.max(e.v, 0);
    this.street = { e, x0: this.s.dist, end: this.s.dist + ST_RACE_M, t: 0, name: c.short || 'Auto' };
    this.fx.push({ k: 'challenge' });
    this.say(`Ha risposto con gli abbaglianti: sfida! ${ST_RACE_M / 1000} km, chi è davanti vince`, 'race');
  };
  P.updateStreetRace = function (dt) {
    const R = this.street; if (!R) return;
    const e = R.e, sim = this.sim; R.t += dt;
    if (!this.ents.includes(e)) { this.street = null; return; }
    // l'avversario accelera con la sua potenza, frenato da aria e rotolamento; cambia corsia se ha qualcuno davanti
    const v = Math.max(3, e.v), Fd = 0.5 * 1.2 * e.rCdA * v * v + 0.013 * e.rMass * 9.81;
    const a = Math.min(7.5, (e.rPow / v - Fd) / e.rMass);
    e.v = Math.max(0, e.v + a * dt);
    const block = this.ents.find((o) => o !== e && (o.kind === 'traffic' || o.kind === 'police') && o.lane === e.lane && o.x > e.x && o.x - e.x < 30 + e.v * 0.8);
    if (block && !e.sig) {
      const free = [e.lane + 1, e.lane - 1].filter((l) => l >= 1 && l <= 3 && !this.ents.some((o) => o !== e && (o.kind === 'traffic' || o.kind === 'police') && o.lane === l && Math.abs(o.x - e.x) < 25));
      if (free.length) { e.lane = free[0]; } else e.v = Math.min(e.v, block.v);
    }
    const my = this.s.dist - R.x0, his = e.x - R.x0;
    R.gap = his - my;
    if (my >= ST_RACE_M || his >= ST_RACE_M || R.t > 120) {
      const win = my >= his, rep = this.streetRep();
      if (win) { rep.w++; rep.rep += 3 + (ST_SPORTY.includes(e.vt) ? 2 : 0); (rep.cat = rep.cat || {})[stCat(e.vt)] = (rep.cat[stCat(e.vt)] || 0) + 1; } else { rep.l++; rep.rep = Math.max(0, rep.rep - 1); }
      this.s.rep = (this.s.rep || 0) + (win ? 2 : 0);
      e.racing = false; e.vT = e.vBase || e.v * 0.8;
      this.street = null;
      this.fx.push({ k: win ? 'streetWin' : 'streetLose' });
      const unlocked = ST_REP_PERKS.filter((p) => win && rep.rep >= p.rep && rep.rep - (3 + (ST_SPORTY.includes(e.vt) ? 2 : 0)) < p.rep);
      this.say(`${win ? 'Vinta' : 'Persa'} contro ${R.name} per ${Math.abs(Math.round(R.gap))} m · ${rep.w} vinte, ${rep.l} perse · reputazione ${rep.rep}` + (unlocked.length ? ` · sbloccato: ${unlocked.map((p) => p.name).join(', ')}` : ''), win ? 'money' : 'bad');
      if (unlocked.length) this.perkUp = true;
    }
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
      if (e.kind !== 'traffic' || e.still || e.racing) continue;
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
    this.updateStreetRace(dt);
    // un evento ogni tanto (nel viaggio e in autostrada), sempre in prima corsia
    const km = this.s.dist / 1000;
    if (this.nextRoadEvent === undefined) this.nextRoadEvent = km + 4 + Math.random() * 6;
    if (km > this.nextRoadEvent && !this.race) { this.nextRoadEvent = km + 7 + Math.random() * 12; if (this.s.vg || (this.loc && this.loc.bg === 'highway')) this.spawnRoadEvent(); }
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { ST_REP_PERKS, ST_RACE_M, ST_CAT, ST_CAT_NAME, ST_CAT_ONE, stCat });
