// Prove dei documenti: scadenze, pagamenti, revisione da Nico, controlli della polizia.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js', 'documenti.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, DOC, VG } = new Function(src + ';return { SupraSim, StreetGame, DOC, VG };')();
const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 10000; return { sim, game }; };

test('documenti: l\'auto ereditata ha tutto scaduto, una nuova dall\'Autosalone è in regola', () => {
  const { game } = trip(); game.docs();                      // creati prima della scelta: poi l'eredità li fa scadere
  game.vgInherit(); assert.deepEqual(game.docScaduti().sort(), ['ass', 'bollo', 'rev']);
  game.s.money = 100000; game.dlBuy('panda', 'cash'); assert.deepEqual(game.docScaduti('panda'), []);
});

test('documenti: assicurazione e bollo si pagano ovunque (il bollo arretrato costa di più), la revisione solo da Nico', () => {
  const { game } = trip(); game.vgInherit();
  const b = game.docCosto('bollo'), m = game.s.money;
  assert.ok(game.docPaga('ass').ok); assert.ok(game.docPaga('bollo').ok); assert.equal(game.s.money, m - DOC.ass.familiare - b);
  assert.ok(game.docCosto('bollo') < b, 'pagato in tempo costa meno della mora');
  assert.equal(game.docPaga('ass').ok, false, 'già a posto');
  assert.equal(game.docPaga('rev').ok, false, 'solo da Nico');
  game.inside = { id: 'niko', x: VG.stopX(3) }; assert.ok(game.docPaga('rev').ok);
  assert.deepEqual(game.docScaduti(), []);
  game.inside = null; game.s.dist += (DOC.durata.ass + 1) * 1000; assert.deepEqual(game.docScaduti(), ['ass'], 'dopo 300 km l\'assicurazione scade');
});

test('documenti: ai controlli multa per ogni documento scaduto, niente se in regola', () => {
  const { game } = trip(); game.vgInherit(); const m = game.s.money;
  const r = game.docControllo(); assert.equal(r.multa, DOC.multa.ass + DOC.multa.bollo + DOC.multa.rev); assert.equal(game.s.money, m - r.multa);
  game.s.money = 10000; game.docPaga('ass'); game.docPaga('bollo'); game.inside = { id: 'niko' }; game.docPaga('rev'); game.inside = null;
  assert.equal(game.docControllo().multa, 0);
  game.achStep(0.25); assert.ok(game.ach().got.regola, 'traguardo In regola');
});

test('documenti: passando un posto di controllo ti possono fermare (una volta per posto)', () => {
  const { game } = trip(); game.vgInherit(); game.s.vg.firstDone = true; game.docRnd = () => 0; game.s.dist = 20000;
  game.ents.push({ id: 999, kind: 'police', lane: 1, x: game.s.dist + 5, v: 0, busy: true, still: true, hazard: true });
  const m = game.s.money; game.update(0.016); assert.ok(game.s.money < m, 'multa');
  const m2 = game.s.money; game.update(0.016); assert.equal(game.s.money, m2, 'una volta sola');
});

test('documenti: dal privato arriva senza la tua assicurazione', () => {
  const { game } = trip(); game.s.money = 100000; game.s.dist = 100000;
  for (let n = 1; n < 200; n++) { const L = game.usAt(n); if (L && !game.s.vg.garage.includes(L.id)) { game.inside = { id: VG.stop(n).id, x: L.x }; game.s.dist = L.x; assert.ok(game.usBuy(n).ok); assert.ok(game.docScaduti(L.id).includes('ass')); return; } }
  assert.fail('nessun annuncio');
});
