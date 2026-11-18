// ============================================================================
//  Night Run · La strada viva: abbaglianti per chiedere strada, eventi in prima corsia
//  (incidenti con le quattro frecce, la polizia che ferma qualcuno) e un traffico che si comporta da autostrada
//  (destra, sorpasso a sinistra, caratteri dei guidatori: vedi trafficDriver in game.js).
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

  // ------------------------------------------------------------ traffico da autostrada
  // Si tiene la destra e si sorpassa a sinistra, guardando prima chi arriva forte da dietro (anche il giocatore).
  // Il carattere del guidatore (trafficDriver in game.js) cambia il modo: l'aggressivo sorpassa appena può, se è bloccato
  // in corsia di sorpasso si attacca e sfanala, e se dura ti supera a destra; il prudente rientra presto; il centralista
  // si mette in seconda corsia e ci resta. La velocità e la distanza da chi sta davanti le decide trafficAccel (game.js).
  P.trafficAI = function (dt) {
    const d = this.s.dist, sim = this.sim, mov = (o) => o.kind === 'traffic' || o.kind === 'police';
    // la corsia `lane` è libera per e? `front` metri davanti e `back` dietro, più lo spazio per chi arriva più veloce
    const free = (e, lane, back, front) => {
      const le = e.len || 4.6;
      for (const o of this.ents) {
        if (o === e || !mov(o) || (o.lane !== lane && o.to !== lane)) continue;
        const dx = o.x - e.x, need = ((o.len || 4.6) + le) / 2;
        if (dx > -(need + back + Math.max(0, (o.v || 0) - e.v) * 2.5) && dx < need + front + Math.max(0, e.v - (o.v || 0)) * 2) return false;
      }
      if (Math.abs(this.laneZ - GAME_LANE_Z[lane]) < 1.7) {
        const dx = d - e.x, need = (le + 4.5) / 2;
        if (dx > -(need + back + Math.max(0, sim.v - e.v) * 2.5) && dx < need + front + Math.max(0, e.v - sim.v) * 2) return false;
      }
      return true;
    };
    for (const e of this.ents) {
      if (e.kind !== 'traffic' || e.still || e.racing) continue;
      const D = this.trafficDriver(e), heavy = (e.len || 4.6) > 8;
      e.yield = Math.max(0, (e.yield || 0) - dt);
      e.flashT = Math.max(0, (e.flashT || 0) - dt);
      // uscita alla tappa del viaggio: circa uno su sei di chi passa (mai i pesanti) mette la freccia a destra, va in prima,
      // rallenta e si ferma davanti al locale (corsia 0, dove si parcheggia); chi segue si accoda o lo sorpassa a sinistra
      if (this.s.vg && typeof VG !== 'undefined' && !heavy && !e.police) {
        const n = Math.ceil((e.x + 80 - VG_STOP0) / VG_STEP), X = VG.stopX(n);
        if (e.exitN !== n && !(e.exitX > 0) && X - e.x < 450) {                                     // si decide una volta, a 450 m dalla tappa
          e.exitN = n; e.exitX = 0;
          if (X - e.x > 120 && Math.random() < 1 / 6) {
            const k = this.ents.filter((o) => o.exitN === n && o.exitX > 0).length;
            if (k < 3) e.exitX = X - 12 + k * 7;
          }
        }
        if (e.exitX > 0) {
          if (e.lane > 1) {
            if (e.exitX - e.x < 40) { e.exitX = 0; continue; }                     // non è riuscito a rientrare in tempo: tira dritto
            if (!e.to && free(e, e.lane - 1, 12, 20)) { e.to = e.lane - 1; e.sig = 1.2; }
            continue;
          }
          if (e.x > e.exitX + 6) { e.exitX = 0; continue; }                         // l'ha mancata: tira dritto
          e.sig = Math.max(e.sig || 0, 0.4); e.to = 0;                               // freccia a destra finché non si ferma
          if (e.v < 0.8 && e.exitX - e.x < 9) { e.lane = 0; e.still = true; e.parked = true; e.sig = 0; e.exitX = 0; e.v = 0; }
          continue;
        }
      }
      if (e.sig > 0 || e.to) continue;
      // chi ha davanti nella sua corsia (anche il giocatore)
      let lead = null, lgap = Infinity, leadV = Infinity, meLead = false;
      for (const o of this.ents) {
        if (o === e || !mov(o) || o.lane !== e.lane || o.x <= e.x) continue;
        const g = o.x - e.x - ((o.len || 4.6) + (e.len || 4.6)) / 2; if (g < lgap) { lgap = g; lead = o; leadV = o.v || 0; }
      }
      if (!this.inside && d > e.x && Math.abs(this.laneZ - GAME_LANE_Z[e.lane]) < 1.7 && !(D.t === 'distratto' && !(e.alertT > 0))) {   // il distratto non ti vede
        const g = d - e.x - ((e.len || 4.6) + 4.5) / 2; if (g < lgap) { lgap = g; lead = null; leadV = sim.v; meLead = true; }
      }
      const want = e.vT || e.vBase || e.v, close = lgap < 60 + e.v * 1.5, slower = close && leadV < want - (heavy ? 0.4 : 1.5);
      // ostacolo fermo davanti (incidente, controllo): si sposta per tempo
      if (lead && lead.still && close && e.lane < (heavy ? 2 : 3) && free(e, e.lane + 1, 15, 35)) { e.to = e.lane + 1; e.sig = 0.8; continue; }
      // più lento davanti: sorpasso a sinistra, mai a destra
      if (slower && e.lane < (heavy ? 2 : 3) && Math.random() < dt * (D.t === 'aggressivo' ? 2 : D.t === 'prudente' ? 0.5 : 0.9) && free(e, e.lane + 1, 20 + e.v * 0.3, 25)) {   // i pesanti non vanno in terza
        e.to = e.lane + 1; e.sig = D.t === 'aggressivo' ? 0.7 : 1.3; continue;
      }
      // aggressivo bloccato in corsia di sorpasso: si attacca, sfanala, e se dura ti supera a destra
      if (D.t === 'aggressivo' && slower && e.lane === 3 && lgap < 12 + e.v * 1.1) {
        e.blockT = (e.blockT || 0) + dt;
        if (!e.flashT && e.blockT > 1.5 && Math.random() < dt * 0.6) {
          e.flashT = 0.9;
          if (meLead && !e.flashedMe) { e.flashedMe = true; this.fx.push({ k: 'flashed', id: e.id }); this.say('Uno attaccato dietro ti sfanala: in corsia di sorpasso si sorpassa', 'info'); }
        }
        if (e.blockT > 7 && Math.random() < dt * 0.3 && free(e, 2, 12, 40)) { e.to = 2; e.sig = 0.5; e.blockT = 0; continue; }
      } else e.blockT = 0;
      // centralista: va in seconda corsia e ci resta
      if (D.t === 'centralista') { if (e.lane === 1 && !slower && Math.random() < dt * 0.3 && free(e, 2, 15, 40)) { e.to = 2; e.sig = 1.6; } continue; }
      // tiene la destra: rientra quando a destra c'è spazio per un buon tratto e nessuno più lento da ripassare subito
      if (e.lane > 1 && !e.yield && Math.random() < dt * (D.t === 'prudente' ? 0.4 : 0.25) && free(e, e.lane - 1, 18, 50 + e.v)) {
        const r = this.ents.some((o) => mov(o) && o.lane === e.lane - 1 && o.x > e.x && o.x - e.x < 90 && o.v < want - 2);
        const meR = Math.abs(this.laneZ - GAME_LANE_Z[e.lane - 1]) < 1.7 && d > e.x && d - e.x < 90 && sim.v < want - 2;
        if (!r && !meR) { e.to = e.lane - 1; e.sig = 1.4; }
      }
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
