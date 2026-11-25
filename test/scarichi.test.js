// Fiamme e terminale dallo scarico vero (v0.119): il punto delle fiamme (`ex` di ogni disegno, di serie e col kit) sta
// sulla carrozzeria disegnata, in basso, nella metà dietro (il kit spesso lo ha laterale, subito dopo la ruota posteriore); le auto di serie lo hanno sotto il paraurti dietro.
// Foto per controllarlo a occhio: node strumenti/scarichi.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'samples.js', 'street2d.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { CARS, TUNING_SUPRA, Street2D } = new Function(src + ';return { CARS, TUNING_SUPRA, Street2D }')();

// PNG a 8 bit senza interlacciatura: basta l'alfa (tipo 6 RGBA, tipo 4 grigio+alfa)
function alfa(file) {
  const b = readFileSync(new URL(file, dir)); let p = 8, W = 0, H = 0, ct = 0; const idat = [];
  while (p < b.length) {
    const n = b.readUInt32BE(p), t = b.toString('ascii', p + 4, p + 8), d = b.subarray(p + 8, p + 8 + n);
    if (t === 'IHDR') { W = d.readUInt32BE(0); H = d.readUInt32BE(4); ct = d[9]; assert.equal(d[8], 8, file + ': 8 bit'); }
    else if (t === 'IDAT') idat.push(d);
    p += 12 + n;
  }
  const bpp = ct === 6 ? 4 : ct === 4 ? 2 : 0; assert.ok(bpp, file + ': serve il canale alfa');
  const raw = inflateSync(Buffer.concat(idat)), st = W * bpp, out = Buffer.alloc(H * st);
  for (let y = 0; y < H; y++) {
    const f = raw[y * (st + 1)], row = raw.subarray(y * (st + 1) + 1, (y + 1) * (st + 1));
    for (let x = 0; x < st; x++) {
      const a = x >= bpp ? out[y * st + x - bpp] : 0, u = y ? out[(y - 1) * st + x] : 0, c = y && x >= bpp ? out[(y - 1) * st + x - bpp] : 0;
      const pa = Math.abs(u - c), pb = Math.abs(a - c), pc = Math.abs(a + u - 2 * c);
      out[y * st + x] = (row[x] + [0, a, u, (a + u) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? u : c][f]) & 255;
    }
  }
  return { W, H, a: (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : out[y * st + x * bpp + bpp - 1]) };
}

test('scarichi: il punto delle fiamme sta sulla carrozzeria, nella metà dietro, in basso', () => {
  let n = 0;
  for (const id in CARS) for (const D of [CARS[id].sprite, CARS[id].spriteT]) {
    if (!D || !D.ex || !/^img\//.test(D.img || '')) continue;
    const A = alfa(D.img), [x, y] = D.ex.map(Math.round);
    let vicino = false;
    for (let dy = -2; dy <= 2 && !vicino; dy++) for (let dx = -2; dx <= 2; dx++) if (A.a(x + dx, y + dy) > 100) { vicino = true; break; }
    assert.ok(vicino, `${id} ${D === CARS[id].spriteT ? 'kit' : 'serie'}: (${x}, ${y}) è lontano dal disegno`);
    assert.ok(x < (D.ax[0] + D.ax[1]) / 2, `${id}: lo scarico è nella metà davanti dell'auto`);
    assert.ok(y > D.wy - D.wr, `${id}: lo scarico è troppo in alto`);
    if (D === CARS[id].sprite && id !== 'v40') {             // di serie (la V40 ha il terminale suo, a metà paraurti): sotto il paraurti, a pochi pixel dal fondo della coda
      let fondo = 0; for (let yy = 0; yy < A.H; yy++) for (let xx = 0; xx < 12; xx++) if (A.a(xx, yy) > 100) fondo = yy;
      assert.ok(Math.abs(y - fondo) <= 3, `${id} di serie: (${x}, ${y}) non è sotto il paraurti (fondo ${fondo})`);
    }
    n++;
  }
  assert.ok(n >= 50, 'controllati ' + n + ' disegni');
});

test('scarichi di profilo: il tubo e l’innesto restano dietro la gomma posteriore con qualsiasi pezzo e kit', () => {
  const v = Object.create(Street2D.prototype);
  v.v40Ready = true;
  for (const [id, car] of Object.entries(CARS)) {
    v.carId = id;
    for (const kit of ['none', ...(car.spriteT ? ['tuning'] : []), ...(id === 'v40' ? ['kit'] : [])]) {
      v.cos = { kit };
      const geo = v.geo(), D = v.genDef(), [x, y] = geo.ex;
      let raggio = geo.wr;
      if (D) {
        const a = alfa(D.wheel);
        let r = 0;
        for (let yy = 0; yy < a.H; yy++) for (let xx = 0; xx < a.W; xx++) {
          if (a.a(xx, yy) > 64) r = Math.max(r, Math.hypot(xx + .5 - a.W / 2, yy + .5 - a.H / 2));
        }
        raggio = Math.max(raggio, r * Street2D.scalaRuota(D));
        const carrozzeria = alfa(D.img);
        assert.ok([0, 1, 2].some((dy) => carrozzeria.a(Math.round(x), Math.round(y) - dy) > 64),
          `${id} ${kit}: innesto lontano dal paraurti`);
      }
      for (const pezzo of (car.tuning || TUNING_SUPRA).exhaust.items) {
        v.carLook = car.params({ ...car.presets[0].sel, exhaust: pezzo.id }).look;
        const tubo = v.scarico(geo);
        assert.ok(tubo.lunghezza > 0);
        assert.ok(x + tubo.lunghezza * tubo.scala + .3 < geo.ax[0] - raggio,
          `${id} ${kit} ${pezzo.id}: il terminale raggiunge la gomma`);
      }
    }
  }
});
