// ============================================================================
//  Night Run · Le missioni del Viaggio (dopo viaggio.js e strada.js)
//  Dopo il primo lavoro (VG_FIRST in viaggio.js) arriva una catena di lavori, ognuno con una
//  sua regola, e poi lavori senza fine con paghe che crescono. Il lavoro dopo si prende alla bacheca del locale
//  successivo (bar, autogrill, motel); l'obiettivo resta a schermo (vgGoal) con lo stato della regola.
//  Regole (kind): pacco (basta consegnare), fragile (botte e frenate brusche abbassano la paga), tempo (in ritardo
//  paga meno), calmo (un passeggero: sotto una velocità e guida dolce), pesante (serve spazio: rimorchio o furgone),
//  sfida (prima di consegnare vinci una sfida con gli abbaglianti).
//  Stato in game.s.vg.mis. Testi e paghe in VG_MISSIONS (facili da cambiare).
// ============================================================================
const VG_BOARDS = ['bar', 'grill', 'motel'];               // locali con la bacheca
const VG_MISSIONS = [
  { id: 'cristalli', kind: 'fragile', title: 'Bicchieri di cristallo', what: 'una cassetta di bicchieri', to: 'motel', kg: 8, pay: 2000,
    give: 'La barista ti indica una cassetta piena di paglia: bicchieri di cristallo per il Motel Ovunque. Guida dolce: ogni botta e ogni frenata brusca si sentono.',
    end: 'Il portiere apre la cassetta e conta i bicchieri uno per uno alla luce dell\'insegna. Tutto a posto.' },
  { id: 'medicine', kind: 'tempo', title: 'Le medicine', what: 'le medicine', to: 'fuel', kg: 1, pay: 2800,
    give: '«Il benzinaio qui avanti aspetta delle medicine. Corri: ha poco tempo.» Un sacchetto bianco, leggero, sul sedile accanto.',
    end: 'Il benzinaio prende il sacchetto, ti mette i soldi in mano e ti stringe la spalla.',
    late: 'Il benzinaio ti aspetta sulla porta. «In ritardo.» Prende il sacchetto e ti paga lo stesso, ma meno.' },
  { id: 'signore', kind: 'calmo', pax: 'Il signore della valigetta', title: 'Il signore della valigetta', to: 'grill', kg: 0, pay: 3000, max: 120,
    give: 'Un signore in giacca, con una valigetta stretta al petto, sale dietro: «Sosta 24, prego. E piano, ho il cuore delicato: sopra i 120 mi viene l\'ansia.»',
    end: 'Il signore scende, si sistema la giacca e conta le banconote due volte.' },
  { id: 'cassa', kind: 'pesante', title: 'La cassa pesante', what: 'una cassa da 240 kg', to: 'shop', kg: 240, pay: 4500,
    give: 'Una cassa di legno da 240 kg per Da Luca Tuning: dentro c\'è un motore intero. Serve il rimorchietto (concessionaria del Motel Ovunque) o un furgone.',
    end: 'Luca apre la cassa con un piede di porco e guarda il motore per un minuto buono. Poi ride.' },
  { id: 'busta', kind: 'sfida', title: 'La busta', what: 'una busta chiusa', to: 'style', kg: 0.2, pay: 4000,
    give: 'Un ragazzo ti dà una busta per Neon Kustom: «Ma prima fammi vedere che sai guidare: vinci una sfida. Sfanala qualcuno con F.»',
    end: 'Quelli di Neon Kustom aprono la busta, annuiscono e ti pagano.',
    lost: 'Quelli di Neon Kustom leggono il biglietto nella busta e scuotono la testa. «Doveva portarla uno che vince.» Ti pagano poco.' },
  { id: 'chiave', kind: 'pacco', title: 'La chiave del motel', what: 'una chiave col portachiavi di legno', to: 'motel', kg: 0.1, pay: 6500,
    give: 'Il barista ti dà una chiave con un portachiavi di legno: «Portala al Motel Ovunque, la stanno aspettando.»',
    end: 'Alla reception guardano la chiave e ti danno una busta coi soldi.' },
];
// lavori senza fine dopo la catena: titoli e frasi a rotazione
const VG_MIS_MORE = {
  kinds: ['pacco', 'fragile', 'tempo', 'calmo', 'pacco', 'sfida'],
  what: { pacco: ['un pacco sigillato', 'una scatola di dischi', 'un sacco di posta', 'una valigetta chiusa'], fragile: ['uno specchio antico', 'delle damigiane di vino', 'una lampada di vetro'], tempo: ['dei pezzi di ricambio urgenti', 'una torta di compleanno', 'dei documenti da firmare stanotte'], sfida: ['una scommessa', 'un trofeo da consegnare'] },
  pax: ['Una cantante', 'Un pescatore', 'Una sposa in ritardo', 'Un prete', 'Un turista giapponese'],
};

(function missioni() {
  if (typeof StreetGame === 'undefined' || typeof VG === 'undefined') return;
  const P = StreetGame.prototype;
  Object.assign(INV, { missione: { name: 'Lavoro da consegnare', kg: 1, price: 0, note: 'È il lavoro che stai facendo: va consegnato al locale scritto.' } });
  const nextStop = (from, ids, min = 0) => { for (let n = Math.max(0, from + min); n < from + min + 60; n++) if (ids.includes(VG.stop(n).id)) return n; return from + min; };
  const fmtKm = (x) => (x / 1000).toFixed(1).replace('.', ',');
  const fmtEur = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // la missione numero i: le prime della catena, poi generate (stesse per lo stesso numero)
  P.vgMission = function (i) {
    if (i < VG_MISSIONS.length) return VG_MISSIONS[i];
    const j = i - VG_MISSIONS.length, h = (k) => VG.hash(i * 31 + k), M = VG_MIS_MORE;
    const kind = M.kinds[j % M.kinds.length], pay = Math.min(9000, 2500 + j * 300);   // economia: vedi PASSAGGIO.md, «Economia»
    const to = ['bar', 'grill', 'motel', 'niko', 'shop', 'style', 'fuel'][Math.floor(h(1) * 7)];
    if (kind === 'calmo') {
      const who = M.pax[Math.floor(h(2) * M.pax.length)];
      return { id: 'm' + i, kind, pax: who, title: who, to, kg: 0, pay, max: 110 + Math.floor(h(3) * 3) * 10, give: `${who} chiede un passaggio fino al prossimo ${VG_PLACE[to].what}. Paga bene, ma vuole un viaggio tranquillo: sotto i limiti e niente frenate brusche.`, end: `${who} scende e ti lascia i soldi sul sedile.` };
    }
    const list = M.what[kind] || M.what.pacco, what = list[Math.floor(h(4) * list.length)];
    return { id: 'm' + i, kind, title: what[0].toUpperCase() + what.slice(1), what, to, kg: kind === 'fragile' ? 12 : 3, pay,
      give: `Dalla bacheca: ${what}, da portare al prossimo ${VG_PLACE[to].what}.` + ({ fragile: ' Fragile: guida dolce.', tempo: ' Urgente: c\'è poco tempo.', sfida: ' Prima di consegnare vinci una sfida (F).' }[kind] || ''),
      end: 'Consegnato. Ti pagano senza fare domande.', late: 'Sei in ritardo: ti pagano meno.', lost: 'Niente vittoria, niente premio: ti pagano poco.' };
  };

  const misState = (g) => {
    const v = g.s.vg; if (!v || !v.firstDone) return null;
    if (!v.mis) v.mis = { i: 0, phase: 'go', giverN: nextStop(VG.stopIndex(g.s.dist) + 1, VG_BOARDS) };
    return v.mis;
  };
  P.vgMisState = function () { return misState(this); };

  // regola in corso: quanto vale la paga adesso (0..1) e cosa scrivere a schermo
  P.vgMisRule = function () {
    const m = misState(this); if (!m || m.phase !== 'carry') return null;
    const M = this.vgMission(m.i), crashes = (this.s.crashes || 0) - m.c0, dmg = Math.max(0, (this.sim.damage || 0) - m.dmg);
    if (M.kind === 'fragile') { const k = Math.max(0.25, Math.min(1, 1 - crashes * 0.25 - m.harsh * 0.6 - dmg * 2)); return { k, note: `integra al ${Math.round(k * 100)} %` }; }
    if (M.kind === 'tempo') { const left = m.lim - m.t; return { k: left >= 0 ? 1 : Math.max(0.4, 1 + left / m.lim), note: left >= 0 ? `tempo ${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}` : 'in ritardo!', late: left < 0 }; }
    if (M.kind === 'calmo') { const k = Math.max(0.3, Math.min(1, 1 - m.over * 0.02 - m.harsh * 0.6)); return { k, note: `sotto i ${M.max} km/h · soddisfatto al ${Math.round(k * 100)} %` }; }
    if (M.kind === 'sfida') { const won = (this.streetRep ? this.streetRep().w : 0) > m.w0; return { k: won ? 1 : 0.35, note: won ? 'sfida vinta' : 'vinci una sfida (F)', lost: !won }; }
    if (M.kind === 'pesante') return { k: 1, note: `${M.kg} kg a bordo` };
    return { k: 1, note: '' };
  };

  // bacheca: il lavoro della catena in cima
  const offers = P.vgOffers;
  P.vgOffers = function (n) {
    const out = offers.call(this, n), m = misState(this);
    if (m && m.phase === 'go' && n === m.giverN) {
      const M = this.vgMission(m.i), to = nextStop(n, [M.to], 1), dest = VG.stop(to);
      out.unshift({ k: 'mis' + m.i, kind: 'missione', kg: M.kg, to, toName: dest.name, kmTo: Math.round(dest.x / 100) / 10, pay: M.pay, mission: true, title: M.title, rule: M.kind, give: M.give });
    }
    return out;
  };
  const take = P.vgTake;
  P.vgTake = function (o, n) {
    if (!o || !o.mission) return take.call(this, o, n);
    const v = this.s.vg, m = misState(this), M = m && this.vgMission(m.i);
    if (!m || m.phase !== 'go' || n !== m.giverN) return { ok: false, why: 'Questo lavoro non è più disponibile' };
    if (M.pax && v.pax.length >= (VG_SEATS[this.car] || 3)) return { ok: false, why: 'Non c\'è posto: fai scendere qualcuno prima' };
    if (M.kg > 0 && !this.trunkFits(M.kg)) return { ok: false, why: M.kind === 'pesante' ? `Pesa ${M.kg} kg: serve il rimorchietto (Motel Ovunque) o un furgone` : 'Non ci sta nel bagagliaio' };
    v.taken = v.taken || {}; v.taken[n + ':' + o.k] = true;
    const dest = VG.stop(o.to);
    Object.assign(m, { phase: 'carry', toN: o.to, t: 0, c0: this.s.crashes || 0, dmg: this.sim.damage || 0, harsh: 0, over: 0, w0: this.streetRep ? this.streetRep().w : 0, pax: M.pax || null,
      lim: M.kind === 'tempo' ? Math.round((dest.x - this.s.dist) / (95 / 3.6) + 25) : 0 });
    if (M.kg > 0) { this.s.trunk.push({ kind: 'missione', kg: M.kg, to: o.to, mis: true, name: `${M.title} per ${dest.name} (km ${o.kmTo})` }); this.applyMass(); }
    this.say(M.give, 'job');
    this.fx.push({ k: 'mission' });
    return { ok: true };
  };

  // consegna: arrivando al locale giusto
  const arrive = P.vgArrive;
  P.vgArrive = function (pl) {
    const m = misState(this);
    if (m && m.phase === 'carry' && pl.n === m.toN) {
      const v = this.s.vg, M = this.vgMission(m.i), R = this.vgMisRule() || { k: 1 };
      const pay = Math.round(M.pay * R.k / 50) * 50;
      this.s.trunk = this.s.trunk.filter((it) => it.kind !== 'missione'); this.applyMass();
      this.s.money += pay; v.earned += pay; v.jobs++;
      this.say(`${R.late && M.late ? M.late : R.lost && M.lost ? M.lost : M.end} + € ${fmtEur(pay)}${R.k < 0.999 && !R.late && !R.lost ? ` (su ${fmtEur(M.pay)}: ${R.note})` : ''}`, 'money');
      this.fx.push({ k: 'missionDone', pay });
      v.misDone = (v.misDone || 0) + 1;
      Object.assign(m, { i: m.i + 1, phase: 'go', giverN: nextStop(pl.n, VG_BOARDS, 1), toN: null, pax: null });
    }
    return arrive.call(this, pl);
  };

  // ogni fotogramma: regola in corso, avvisi, bacheca saltata
  const upd = P.vgUpdate;
  P.vgUpdate = function (dt) {
    upd.call(this, dt);
    const m = misState(this); if (!m || this.mode !== 'career') return;
    const sim = this.sim, kmh = Math.abs(sim.v) * 3.6;
    if (m.phase === 'go') {
      // passato davanti alla bacheca senza prendere il lavoro: lo trovi alla prossima
      if (!this.inside && this.s.dist > VG.stopX(m.giverN) + 200) { m.giverN = nextStop(m.giverN, VG_BOARDS, 1); }
      return;
    }
    const M = this.vgMission(m.i);
    m.t += dt;
    if (Math.abs(sim.acc || 0) > 4.5 && (M.kind === 'fragile' || M.kind === 'calmo')) m.harsh += dt * 0.08;
    if (M.kind === 'calmo' && kmh > M.max) { m.over += dt; if (!(m.warnT > m.t)) { m.warnT = m.t + 6; this.say(`${M.pax}: «Più piano, per favore!»`, 'bad'); } }
    if (M.kind === 'fragile' && (this.s.crashes || 0) > (m.cSeen ?? m.c0)) { m.cSeen = this.s.crashes; this.say('Dal bagagliaio un tintinnio di vetri. Brutto segno.', 'bad'); }
    if (M.kind === 'tempo') {
      const left = m.lim - m.t;
      if (left < 60 && !m.w60) { m.w60 = true; this.say(`${M.title}: manca un minuto!`, 'bad'); }
      if (left < 0 && !m.w0t) { m.w0t = true; this.say('Sei in ritardo: corri lo stesso, pagano meno ma pagano.', 'bad'); }
    }
  };

  // obiettivo a schermo
  const goal = P.vgGoal;
  P.vgGoal = function () {
    const g0 = goal.call(this); if (g0) return g0;
    const m = misState(this); if (!m) return null;
    const M = this.vgMission(m.i), km = this.s.dist;
    if (m.phase === 'go') {
      const A = VG.stop(m.giverN);
      return { title: 'Prossimo lavoro', text: `${M.title} · bacheca di ${A.name}`, left: Math.max(0, (A.x - km) / 1000), pay: M.pay, x: A.x };
    }
    const B = VG.stop(m.toN), R = this.vgMisRule() || {};
    return { title: M.title, text: `${M.pax ? 'Accompagna ' + M.pax[0].toLowerCase() + M.pax.slice(1) : 'Porta ' + M.what} a ${B.name} · km ${fmtKm(B.x)}`, left: Math.max(0, (B.x - km) / 1000), pay: Math.round(M.pay * (R.k ?? 1) / 50) * 50, x: B.x, note: R.note };
  };

  // posti: il passeggero della missione ne occupa uno; il lavoro non si butta né si lascia nella cassa
  const seats = P.vgSeats;
  P.vgSeats = function () { const m = misState(this); return seats.call(this) - (m && m.phase === 'carry' && m.pax ? 1 : 0); };
  const drop = P.dropItem;
  P.dropItem = function (i) { const it = this.s.trunk[i]; if (it && it.kind === 'missione') return { ok: false, why: 'È il lavoro che stai facendo: va consegnato' }; return drop.call(this, i); };
  const toCassa = P.vgToCassa;
  P.vgToCassa = function (i) { const it = this.s.trunk[i]; if (it && it.kind === 'missione') return { ok: false, why: 'Il lavoro resta a bordo' }; return toCassa.call(this, i); };
})();

if (typeof window !== 'undefined') Object.assign(window, { VG_MISSIONS, VG_MIS_MORE, VG_BOARDS });
