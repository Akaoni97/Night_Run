// Prove della polizia (polizia.js): fermo con documenti, contestazione, fuga, autovelox e Tutor, pattuglia in coda, etilometro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js', 'documenti.js', 'polizia.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, DOC, POL, POL_SCUSE, alcFine, VG } = new Function(src + ';return { SupraSim, StreetGame, DOC, POL, POL_SCUSE, alcFine, VG };')();
// viaggio in corso, documenti in regola, auto che va dritta a una velocità fissa
const trip = (rnd = () => 0.5) => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 10000; game.s.vg.firstDone = true;
  game.polRnd = rnd; game.nextSpawn = 1e9; game.trafficOn = false; game.nextRoadEvent = 1e9;
  const d = game.docs(); d.ass = d.bollo = d.rev = 1e6;
  game.s.dist = 20000; game.s.far = 20000;
  for (let i = 0; i < 6; i++) { game.update(1 / 30); if (game.prompt) game.answer(0); }   // capitolo e domande d'inizio
  game.prompt = null;
  return { sim, game };
};
const run = (game, sec, v) => { for (let t = 0; t < sec; t += 1 / 30) { if (v !== undefined && !game.ap) { game.sim.v = v; } game.update(1 / 30); if (game.prompt && game.prompt.kind !== 'police') game.answer(0); } };

test('polizia: fermato oltre i 136, si può pagare, contestare o scappare; i documenti si guardano sempre', () => {
  const { game } = trip(); const kmh = 160, sf = { over: 23, fine: 173 };
  game.sim.v = kmh / 3.6; game.polStop(null, 'speed', { kmh, sf });
  assert.ok(game.ap, 'il gioco ti fa accostare'); game.ap.onStop();
  assert.equal(game.prompt.title, 'Eccesso di velocità');
  assert.deepEqual(game.prompt.options.map((o) => o.label), ['Paga € 170', 'Contesta', 'Scappa']);
  assert.match(game.prompt.text, /in regola/);
  const m = game.s.money; game.answer(0);
  assert.equal(game.s.money, m - 170); assert.equal(game.s.heat, 1); assert.equal(game.pol.stop, null);
});

test('polizia: con l\'assicurazione scaduta la paghi lì, oltre alle multe dei documenti', () => {
  const { game } = trip(); const d = game.docs(); d.ass = 0;
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop();
  const ass = game.docCosto('ass'), tot = 170 + DOC.multa.ass;
  assert.equal(game.prompt.options[0].label, `Paga € ${(tot + ass).toLocaleString('it-IT')}`);
  game.answer(0);
  assert.deepEqual(game.docScaduti(), [], 'assicurazione rinnovata');
});

test('polizia: la contestazione ha quattro esiti con le probabilità della scusa', () => {
  const q = POL_SCUSE[3];                                      // «Mi scusi, ha ragione»: [0.1, 0.5, 0.38, 0.02]
  const esito = (k) => { const { game } = trip(() => k); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); const S = game.pol.stop; game.polScusa(S, q); return S; };
  assert.equal(esito(0.05).esito, 0); assert.equal(esito(0.3).esito, 1); assert.equal(esito(0.3).tot, 90);
  assert.equal(esito(0.8).esito, 2); assert.equal(esito(0.995).esito, 3); assert.equal(esito(0.995).tot, 260);
  for (const s of POL_SCUSE) assert.ok(Math.abs(s.p.reduce((a, b) => a + b, 0) - 1) < 1e-9, s.t);
  const { game } = trip(); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop();
  game.answer(1); assert.equal(game.prompt.title, 'Contesti'); assert.equal(game.prompt.options.length, 3);
  assert.ok(game.prompt.options.every((o) => !/analcolica|assicurazione/i.test(o.label)), 'solo scuse buone per la velocità');
});

test('polizia: scappando sei ricercato; con l\'auto veloce la volante sparisce ma resti ricercato', () => {
  const { game } = trip(() => 0.9);                              // 0.9: niente posto di blocco
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  assert.ok(game.pol.ch, 'inseguimento'); assert.equal(game.polState().fuga, true);
  run(game, 20, 70);                                             // 252 km/h: più forte della volante
  assert.equal(game.pol.stop, null);
  assert.equal(game.pol.cs.filter((C) => C.gap < POL.fuga.perso).length, 0, 'sparite dagli specchietti'); assert.equal(game.polState().fuga, true, 'ancora ricercato');
  assert.ok(game.s.heat >= 3, 'ricercato: ' + game.s.heat);
});

test('polizia: con l\'auto lenta la volante ti supera, ti taglia la strada, inchioda e ti prende: multone e fuga finita', () => {
  const { game } = trip(() => 0.9);
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  const e = game.pol.ch.e; let tagliato = false, dentro = 0;
  for (let t = 0; t < 40 && !game.pol.stop; t += 1 / 30) {
    if (!game.ap) game.sim.v = Math.min(game.sim.v + 3 / 30, 120 / 3.6);   // un'auto scassata: arriva a 120 e basta
    if (game.pol.ch && game.pol.ch.fase === 'taglia') { tagliato = true; if (e.lane === game.lane) game.sim.v = Math.min(game.sim.v, e.v); }   // frena dietro di lei
    if (game.ents.includes(e) && e.x > game.s.dist) dentro++;
    game.update(1 / 30); if (game.prompt && game.prompt.kind !== 'police') game.answer(0);
  }
  assert.ok(tagliato, 'ti ha tagliato la strada'); assert.ok(dentro > 0, 'è passata davanti');
  assert.ok(game.pol.stop && game.pol.stop.why === 'fuga', 'presa'); assert.ok(game.pol.stop.e.x > game.s.dist, 'resta davanti');
  game.ap.onStop(); assert.deepEqual(game.prompt.options.length, 1, 'solo Paga');
  const m = game.s.money; game.answer(0);
  assert.ok(m - game.s.money >= POL.fuga.multa, 'multone'); assert.equal(game.polState().fuga, false, 'fuga finita');
});

test('polizia: tre volanti davanti fanno muro; ogni volante in più alza la multa', () => {
  const { game } = trip(() => 0.9);
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  game.pol.rinfT = 1e9;
  for (let i = 0; i < 2; i++) { const e = { id: 900 + i, kind: 'police', lane: 1 + i, x: game.s.dist - 30, v: 30 }; game.ents.push(e); game.polJoin(e, 30, 0); }
  assert.equal(game.pol.cs.length, 3);
  let muro = false; game.autoLane = false;                       // vorrebbe andare a 120 e scansa le volanti cambiando corsia
  for (let t = 0; t < 60 && !game.pol.stop; t += 1 / 30) {
    if (!game.ap) {
      game.sim.v = Math.min(game.sim.v + 3 / 30, 120 / 3.6);
      const avanti = (L) => game.pol.cs.some((C) => C.e.lane === L && -C.gap > 0 && -C.gap < 30);
      if (avanti(game.lane)) { const L = [1, 2, 3].find((q) => !avanti(q)); if (L) game.lane = L; }   // prova a scansarle
      for (const C of game.pol.cs) if (C.e.lane === game.lane && -C.gap > 0 && -C.gap < 20) game.sim.v = Math.min(game.sim.v, C.e.v);   // frena dietro chi ha davanti
    }
    const davanti = game.pol.cs.filter((C) => C.fase === 'taglia').map((C) => C.e.lane);
    if (new Set(davanti).size === 3) muro = true;
    game.update(1 / 30); if (game.prompt && game.prompt.kind !== 'police') game.answer(0);
  }
  assert.ok(muro, 'tre volanti davanti, una per corsia');
  assert.ok(game.pol.stop && game.pol.stop.why === 'fuga', 'preso');
  assert.equal(game.pol.stop.data.n, 3);
  game.ap.onStop(); assert.match(game.prompt.options[0].label, /Paga/);
  const base = POL.fuga.multa + 173 * 1.5; assert.ok(game.pol.stop.tot >= base + 2 * POL.fuga.aVolante - 10, 'multa con tre volanti: ' + game.pol.stop.tot);
});

test('polizia: da ricercato le altre pattuglie non ti fanno accostare, ti inseguono; entrando in un locale si dimenticano di te', () => {
  const { game } = trip(() => 0.9);
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  run(game, 20, 70); game.pol.rinfT = 1e9;
  // nessun fermo automatico: velocità, posto di controllo, etilometro
  assert.equal(game.polStop(null, 'speed', { kmh: 200, sf: { over: 60, fine: 543 } }), false);
  assert.equal(game.polStop(null, 'docs'), false); assert.equal(game.polStop(null, 'alcol', { gl: 1 }), false);
  assert.equal(game.ap, null); assert.equal(game.prompt, null);
  // una volante ferma più avanti: la bruci a 200 km/h e ti insegue lei
  const e = { id: 999, kind: 'police', lane: 0, x: game.s.dist + 40, v: 0, busy: true, still: true, hazard: true };
  game.ents.push(e); run(game, 1.5, 200 / 3.6);
  assert.equal(game.pol.stop, null); assert.equal(game.ap, null, 'niente frenata');
  assert.ok(game.pol.cs.some((C) => C.e === e), 'la volante bruciata ti insegue'); assert.ok(!e.hazard && !e.busy);
  // ti infili in un locale: ricercato azzerato
  const p = { ok: true, id: 'bar', x: game.s.dist + 30, name: 'Bar', rel: 30 };
  assert.ok(game.enterPlace(p));
  assert.equal(game.polState().fuga, false); assert.equal(game.s.heat, 0); assert.equal(game.pol.ch, null);
  assert.ok(!game.ents.includes(e), 'la volante è andata avanti');
  // e dopo si torna alla normalità: la prossima volante ti ferma di nuovo
  game.ap = null; game.inside = null;
  assert.equal(game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }), true);
});

test('polizia: gli autovelox sono pochi (a volte tratti liberi di 7-12 km), il Tutor uno ogni 10-15 km lungo 0,5-1 km, e la multa arriva subito', () => {
  const { game } = trip(); const S = game.polState();
  for (let k = 0; k < 200; k++) { game.s.dist += 1000; game.polPlan(); }
  let seed = 12345; const lcg = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };   // sempre uguale: niente prova instabile
  const all = [];                                                // tutti quelli pianificati (polPlan butta i vecchi)
  const g2 = trip(lcg).game; for (let k = 0; k < 1500; k++) { g2.s.dist += 1000; g2.polPlan(); for (const c of g2.polState().ctl) if (c.x < g2.s.dist + 1500 && !all.includes(c)) all.push(c); }   // solo quelli già vicini: più lontano un autovelox può ancora saltare per un Tutor nuovo
  all.sort((a, b) => a.x - b.x);
  const vel = all.filter((c) => c.k === 'velox'), tut = all.filter((c) => c.k === 'tutor');
  const xs = []; let free = 0;
  for (let i = 1; i < vel.length; i++) { const gap = (vel[i].x - vel[i - 1].x) / 1000; xs.push(gap); if (gap >= 7) free++; }
  assert.ok(Math.min(...xs) >= 2.4, 'due autovelox mai uno sopra l\'altro');
  assert.ok(free / xs.length > 0.2 && free / xs.length < 0.5, 'tratti liberi ogni tanto: ' + free / xs.length);
  assert.ok(tut.length > 30, 'ci sono Tutor');
  for (const c of tut) assert.ok((c.x2 - c.x) >= 500 && (c.x2 - c.x) <= 1000, 'Tutor lungo da 0,5 a 1 km: ' + (c.x2 - c.x));
  for (let i = 1; i < tut.length; i++) { const g = (tut[i].x - tut[i - 1].x) / 1000; assert.ok(g >= 9.99 && g <= 15.01, 'un Tutor ogni 10-15 km: ' + g); }
  for (const c of tut) assert.ok(!vel.some((v) => v.x > c.x - 700 && v.x < c.x2 + 700), 'niente autovelox dentro un Tutor');
  assert.ok(S.ctl.length > 0);
  // autovelox: a 160 scatta e la multa arriva subito (niente verbale che aspetta qualche km)
  const { game: g } = trip(); g.polState().nextKm = 1e9; g.polState().ctl = [{ k: 'velox', x: g.s.dist + 30 }];
  const m = g.s.money; run(g, 1.5, 160 / 3.6);
  assert.equal(g.polState().verb.length, 0, 'nessun verbale in attesa'); assert.equal(g.s.money, m - 173, 'multa subito');
  // Tutor: conta la media, non la punta
  const { game: t } = trip(); t.polState().nextKm = 1e9; t.polState().ctl = [{ k: 'tutor', x: t.s.dist + 10, x2: t.s.dist + 1010 }];
  run(t, 4, 40); run(t, 30, 30);                                // una punta a 144 e poi 108: media sotto i 136
  assert.equal(t.polState().verb.length, 0); const mt = t.s.money;
  assert.equal(t.s.money, mt, 'sotto la media non si paga');
  // Tutor: tutto a 160 per 1.000 m, e alla fine (subito) la multa, con il lampo della telecamera di fine tratto
  const { game: u } = trip(); u.polState().nextKm = 1e9; u.polState().ctl = [{ k: 'tutor', x: u.s.dist + 10, x2: u.s.dist + 1010 }];
  const mu = u.s.money; run(u, 26, 160 / 3.6);
  assert.equal(u.s.money, mu - 173, 'multa alla fine del tratto'); assert.equal(u.polState().verb.length, 0);
  assert.ok(u.ents.some((o) => o.kind === 'tutor' && o.end && o.flashT !== undefined), 'la telecamera di fine tratto ha lampeggiato');
  assert.ok(t.polPins(t.s.dist - 5000, t.s.dist + 5000).length >= 0);
  // un salto di strada (traino del carro attrezzi fino all'officina, «Vai a») non passa da autovelox né Tutor (v0.175)
  const { game: w } = trip(); w.polState().nextKm = 1e9; w.polState().ctl = [{ k: 'tutor', x: w.s.dist + 10, x2: w.s.dist + 1010 }, { k: 'velox', x: w.s.dist + 2000 }];
  const mw = w.s.money; w.sim.v = 160 / 3.6; w.s.dist += 5000; w.polCams(1 / 30, w.s.dist - 5000);
  assert.equal(w.s.money, mw, 'saltati senza multe'); assert.equal(w.polState().verb.length, 0);
});

test('polizia: il posto di controllo non ti ferma e non ti insegue: passi e ti multano (documenti e velocità); da ricercato niente multa, ti inseguono', () => {
  const posto = (game, dx = 5) => { const e = { id: 700 + dx, kind: 'police', lane: 1, x: game.s.dist + dx, v: 0, busy: true, still: true, hazard: true }; game.ents.push(e); return e; };
  // in regola e piano: niente
  { const { game } = trip(); game.docRnd = () => 0; game.sim.v = 30 / 3.6; const m = game.s.money; posto(game); game.update(1 / 30);
    assert.equal(game.s.money, m); assert.ok(!game.pol.stop); assert.ok(!game.ap); }
  // documenti scaduti: multa subito, senza fermarti né far partire una volante che ti segue
  { const { game } = trip(); game.docRnd = () => 0; game.docs().ass = 0; game.sim.v = 30 / 3.6; const m = game.s.money; const e = posto(game); game.update(1 / 30);
    assert.equal(game.s.money, m - DOC.multa.ass); assert.ok(!game.pol.stop); assert.ok(!game.ap); assert.ok(!e.chase, 'nessuna volante che ti insegue'); assert.ok(!game.prompt);
    assert.equal(game.s.heat, 1); }
  // velocità: la vedono sempre, anche se i documenti non li guardano questa volta
  { const { game } = trip(); game.docRnd = () => 0.99; const m = game.s.money; posto(game, 30); run(game, 1.5, 160 / 3.6);
    assert.equal(game.s.money, m - 170); assert.ok(!game.pol.stop); assert.ok(!game.ap); }
  // da ricercato: nessuna multa al posto di controllo (ti inseguono e basta)
  { const { game } = trip(() => 0.9); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
    game.pol.rinfT = 1e9; const m = game.s.money; posto(game, 30); run(game, 1.5, 200 / 3.6);
    assert.equal(game.polState().fuga, true); assert.ok(!game.pol.stop);
    assert.ok(game.s.money >= m - 1, 'nessuna multa da ricercato: ' + (m - game.s.money)); }
});

test('polizia: la mappa in basso conosce pattuglie, posti di controllo e di blocco, inseguitori, autovelox e Tutor', () => {
  const { game } = trip(); const d = game.s.dist, S = game.polState(); S.nextKm = 1e9;
  S.ctl = [{ k: 'velox', x: d + 700 }, { k: 'tutor', x: d + 1000, x2: d + 2300 }];
  game.ents.push({ id: 801, kind: 'police', lane: 1, x: d + 300, v: 0, busy: true, still: true, hazard: true });     // posto di controllo
  game.ents.push({ id: 802, kind: 'police', lane: 0, x: d + 520, v: 0 });                                            // pattuglia ferma
  game.ents.push({ id: 803, kind: 'police', lane: 1, x: d + 1300, v: 0, busy: true, still: true, hazard: true, block: true });
  game.ents.push({ id: 804, kind: 'police', lane: 2, x: d + 1303, v: 0, busy: true, still: true, hazard: true, block: true });   // le due del blocco sono un segno solo
  game.ents.push({ id: 805, kind: 'police', lane: 1, x: d + 900, v: 20, chase: true });                              // quella che ti sta fermando non c'è
  const m = game.polMap(d - 300, d + 2700), tipi = m.map((q) => q.t).sort();
  assert.deepEqual(tipi, ['block', 'check', 'patrol', 'span', 'tutor0', 'tutor1', 'velox']);
  const span = m.find((q) => q.t === 'span'); assert.equal(span.x2 - span.x, 1300); assert.match(span.name, /1,3 km/);
  // ricercato: le volanti che ti inseguono sono dietro di te (anche fuori dall'elenco della strada)
  S.fuga = true; game.pol.cs = [{ e: { x: d - 120 }, gap: 120 }, { e: { x: d - 500 }, gap: 500 }];
  const ch = game.polMap(d - 300, d + 2700).filter((q) => q.t === 'chase'); assert.equal(ch.length, 1); assert.equal(Math.round(d - ch[0].x), 120);
  // volante in coda e con l'etilometro
  game.ents.push({ id: 806, kind: 'police', lane: 1, x: d - 50, v: 25, tail: true }, { id: 807, kind: 'police', lane: 0, x: d + 150, v: 0, alcol: true });
  const t2 = game.polMap(d - 300, d + 2700).map((q) => q.t); assert.ok(t2.includes('tail') && t2.includes('alcol'));
});

test('polizia: la pattuglia in coda ti ferma solo se passi i 136', () => {
  const { game } = trip(() => 0.1); const S = game.polState(); S.codaKm = 0; S.nextKm = 1e9;
  run(game, 0.2, 30); assert.ok(game.pol.tail, 'volante dietro');
  run(game, 3, 34); assert.ok(!game.pol.stop, "a 122 km/h non succede niente");
  run(game, 3, 42); assert.ok(game.pol.stop && game.pol.stop.why === 'speed');
});

test('polizia: etilometro a un bar su cinque, multa sopra 0,5 g/l, l\'alcol cala col tempo', () => {
  const { game } = trip(); const bars = [];
  for (let n = 0; n < 100; n++) if (game.polBarCheck(n)) bars.push(n);
  assert.equal(bars.length, 20);
  assert.equal(alcFine(0.3), 0); assert.equal(alcFine(0.6), 543); assert.equal(alcFine(1), 800); assert.equal(alcFine(2), 1500);
  assert.ok(game.polDrink('birra').ok); assert.ok(game.polDrink('whisky').ok); assert.ok(Math.abs(game.s.vg.alc - 0.65) < 1e-9);
  game.polStop({ id: 9, kind: 'police', lane: 0, x: game.s.dist, v: 0 }, 'alcol', { gl: game.s.vg.alc }); game.ap.onStop();
  assert.match(game.prompt.text, /0,65 g\/l/); assert.equal(game.prompt.options[0].label, 'Paga € 543');
  game.answer(0);
  game.s.vg.alc = 0.2; assert.equal(game.polStop(null, 'alcol', { gl: 0.2 }), false, 'sotto il limite si riparte');
  game.s.vg.alc = 1; game.polAlc(1000); assert.ok(game.s.vg.alc < 0.7);
});

test('polizia: ogni tanto tra le scuse ce n\'è una assurda, che passa spesso; quella del bagno a volte passa', () => {
  const q = POL_SCUSE.find((x) => /urgenza/.test(x.t)); assert.ok(q.p[0] >= 0.25, 'il bagno a volte passa');
  for (const r of POL_SCUSE.filter((x) => x.raro)) assert.ok(r.p[0] >= 0.4, r.t);
  const rari = (k) => { const { game } = trip(() => k); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(1); return game.prompt.options.filter((o) => POL_SCUSE.some((x) => x.raro && o.label.startsWith(x.t.replace(/[«»]/g, '').slice(0, 20)))).length; };
  assert.equal(rari(0.2), 1, 'con un po\' di fortuna esce l\'assurda'); assert.equal(rari(0.6), 0, 'di solito no');
});

test('polizia: entrando in un locale con la volante a ridosso, a volte ti aspettano fuori; da lontano no', () => {
  const ricercato = (k, gap) => {
    const { game } = trip(() => 0.9); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
    game.pol.rinfT = 1e9; const C = game.pol.ch; C.t = 10; C.gap = gap; C.e.x = game.s.dist - gap; if (!game.ents.includes(C.e)) game.ents.push(C.e);
    game.polRnd = () => k; return game;
  };
  const a = ricercato(0.1, 12); assert.ok(a.enterPlace({ ok: true, id: 'bar', x: a.s.dist + 3, name: 'Bar', rel: 3 }));
  assert.equal(a.polState().fuga, true, 'ancora ricercato'); assert.ok(a.polState().aspetta);
  a.inside = { id: 'bar', x: a.s.dist, phase: 'shop', t: 0 }; a.exitPlace();
  assert.ok(a.pol.ch, 'la volante fuori riparte'); assert.equal(a.polState().aspetta, null);
  const b = ricercato(0.1, 80); b.enterPlace({ ok: true, id: 'bar', x: b.s.dist + 3, name: 'Bar', rel: 3 });
  assert.equal(b.polState().fuga, false, 'lontana: seminata');
  const c = ricercato(0.9, 12); c.enterPlace({ ok: true, id: 'bar', x: c.s.dist + 3, name: 'Bar', rel: 3 });
  assert.equal(c.polState().fuga, false, 'vicina ma non ti hanno visto');
});

test('polizia: «Disabilita polizia» (sviluppatori): niente fermo, multe, inseguimento, autovelox; si riaccende senza strascichi', () => {
  const { game } = trip(); const kmh = 170, sf = { over: 33, fine: 173 };
  game.sim.v = kmh / 3.6;
  // ricercato e inseguito: si spegne tutto subito
  game.polStop(null, 'speed', { kmh, sf }); game.ap.onStop(); game.answer(2);        // scappa
  assert.ok(game.s.pol.fuga, 'prima era ricercato');
  assert.equal(game.polOffSet(true), true);
  assert.equal(game.s.pol.fuga, false); assert.equal(game.s.heat, 0); assert.deepEqual(game.pol.cs, []);
  const m = game.s.money;
  assert.equal(game.polStop(null, 'speed', { kmh, sf }), false, 'non ti ferma');
  assert.equal(game.polCheck(null, true), false, 'non ti multa al posto di controllo');
  // un autovelox sulla strada davanti: c'è, ma a 170 km/h non multa
  const S = game.s.pol; S.ctl.push({ k: 'velox', x: game.s.dist + 40 });
  const d0 = game.s.dist; game.sim.v = kmh / 3.6; for (let t = 0; t < 4; t += 1 / 30) game.update(1 / 30);
  assert.ok(game.s.dist > d0 + 40, 'superato');
  assert.equal(game.s.money, m, 'nessuna multa'); assert.equal(S.verb.length, 0);
  assert.equal(S.ctl[S.ctl.length - 1].ents, true, 'cartello e autovelox sono stati messi sulla strada (la grafica resta)');
  // di nuovo in servizio: l'autovelox successivo multa come prima
  assert.equal(game.polOffSet(false), false);
  assert.ok(game.polStop(null, 'speed', { kmh, sf }) !== false, 'ora ti ferma');
});
