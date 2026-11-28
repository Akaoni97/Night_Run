// Estetica come la V40 per tutte le auto da disegno (estetica2d.js e cars.js, v0.176): cerchi, kit leggero, spoiler,
// intercooler frontale e scritta TURBO dai pezzi del motore; il kit completo del disegno tuning resta.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const R = path.resolve(__dirname, '..');
const src = ['tuning.js', 'schede.js', 'suoni.js', 'cars.js'].map((f) => fs.readFileSync(path.join(R, f), 'utf8')).join('\n');
const { CARS, GEN_CARS } = new Function(src + ';return { CARS, GEN_CARS };')();

test('tutte le auto da disegno hanno cerchi, kit leggero e spoiler come la V40 (niente spoiler su autobus e ambulanza)', () => {
  const v40 = CARS.v40.body;
  for (const c of GEN_CARS) {
    const B = CARS[c.id].body;
    assert.deepStrictEqual(B.wheels.items.map((i) => i.id), v40.wheels.items.map((i) => i.id), c.id + ': cerchi');
    assert.deepStrictEqual(B.wheels.items.map((i) => i.price), v40.wheels.items.map((i) => i.price), c.id + ': prezzi dei cerchi');
    assert.ok(B.kit.items.some((i) => i.id === 'kit' && i.price === 1200), c.id + ': kit leggero');
    if (CARS[c.id].spriteT) assert.ok(B.kit.items.some((i) => i.id === 'tuning'), c.id + ': il kit completo del disegno tuning resta');
    if (['bus', 'ambulanza'].includes(c.id)) assert.ok(!B.spoiler, c.id + ': niente spoiler');
    else assert.deepStrictEqual(B.spoiler.items.map((i) => [i.id, i.price]), [['none', 0], ['roof', 350]], c.id + ': spoiler');
  }
});

test('intercooler frontale e scritta TURBO arrivano dai pezzi del motore, come sulla V40', () => {
  for (const id of ['e36', 'punto', 'uno', 'golf']) {
    const c = CARS[id], tb = c.tuning.turbo.items, ic = c.tuning.intercooler.items;
    const serie = c.params({}, {}).look;
    assert.ok(!serie.fmic && !serie.turbo2, id + ': di serie niente');
    const grosso = c.params({ turbo: tb[tb.length - 1].id, intercooler: ic[1].id }, {}).look;
    assert.ok(grosso.fmic && grosso.turbo2, id + ': turbo più grosso e intercooler maggiorato');
    const piccolo = c.params({ turbo: tb[1].id, intercooler: ic[0].id }, {}).look;
    assert.ok(!piccolo.fmic && !piccolo.turbo2, id + ': turbo piccolo con l\'intercooler di serie');
  }
});

test('estetica2d.js si carica dopo gomme2d.js e si aggancia a genBase e genWheel', () => {
  const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
  const s = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(s.indexOf('estetica2d.js') === s.indexOf('gomme2d.js') + 1);
  const js = fs.readFileSync(path.join(R, 'estetica2d.js'), 'utf8');
  assert.match(js, /S\.genBase = function/); assert.match(js, /S\.genWheel = function/);
});
