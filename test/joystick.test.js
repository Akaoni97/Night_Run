// Prove del joystick: più dispositivi insieme (cambio a H, pedali, pad), comandi assegnati, calibrazione dei pedali, cambio a H.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = readFileSync(new URL('joystick.js', dir), 'utf8');
const E = new Function(src + ';return { PAD_AZIONI, padPoll, padLearnStart, padLearnStep, padStd, padPos };')();

// dispositivi finti, uguali a quelli del proprietario
const mk = (id, mapping, nb, axes) => ({ id, mapping, connected: true, buttons: Array.from({ length: nb }, () => ({ value: 0, pressed: false })), axes: axes.slice() });
const shifter = () => mk('SIMSONN-HSifter H (Vendor: ddfd Product: 5012)', '', 10, []);
const maple = () => mk('Maple (Vendor: 1eaf Product: 0024)', '', 32, [0, 0, 0, -1, -1, 0, -0.92, 0, 0, 3.29]);
const xbox = () => mk('Controller gioco compatibile HID (STANDARD GAMEPAD Vendor: 045e Product: 02fd)', 'standard', 17, [0, 0, 0, 0]);
const press = (p, i, v = 1) => { p.buttons[i].value = v; p.buttons[i].pressed = v > 0.5; };

test('joystick: il pad standard va da solo, come prima (gas, freno, sterzo, marce)', () => {
  const x = xbox(), st = { prev: {} };
  press(x, 7, 0.8); press(x, 6, 0.3); x.axes[0] = 0.5;
  const r = E.padPoll([x], {}, st);
  assert.equal(r.thr, 0.8); assert.equal(r.brake, 0.3); assert.equal(r.steer, -0.5);
  press(x, 14); assert.equal(E.padPoll([x], {}, st).steer, 1 - 0.5);
  press(x, 0); assert.equal(E.padPoll([x], {}, st).up, true); assert.equal(E.padPoll([x], {}, st).up, false, 'la marcia su è un solo istante');
});

test('joystick: con il cambio a H collegato per primo il gioco usa il pad standard, non il cambio', () => {
  const sh = shifter(), mp = maple(), xb = xbox(), st = { prev: {} };
  press(sh, 7); press(sh, 6);                                    // marce del cambio: non devono dare gas e freno
  press(xb, 7, 1);
  const r = E.padPoll([sh, mp, xb], {}, st);
  assert.equal(r.thr, 1); assert.equal(r.brake, 0);
  assert.equal(E.padStd([sh, mp, xb]), xb);
  assert.equal(E.padStd([sh, mp]), null, 'senza pad standard e senza assi i pulsanti del cambio non fanno niente di serie');
  assert.equal(E.padPoll([sh, mp], {}, { prev: {} }).thr, 0);
});

test('joystick: i pedali si assegnano a un asse e si calibrano (riposo −1, fondo 1), anche su un altro dispositivo', () => {
  const sh = shifter(), mp = maple(), xb = xbox(), st = { prev: {} };
  const bind = { gas: { id: mp.id, k: 'a', i: 3, rest: -1, full: 1 }, freno: { id: mp.id, k: 'a', i: 4, rest: -1, full: 0.2 } };
  let r = E.padPoll([sh, xb, mp], bind, st); assert.equal(r.thr, 0); assert.equal(r.brake, 0);
  mp.axes[3] = 0; mp.axes[4] = -0.4; r = E.padPoll([sh, xb, mp], bind, st);
  assert.ok(Math.abs(r.thr - 0.5) < 1e-9); assert.ok(Math.abs(r.brake - 0.5) < 1e-9);
  mp.axes[3] = 1; r = E.padPoll([mp], bind, st); assert.equal(r.thr, 1);
  press(xb, 7, 1);                                              // il pad non deve rubare il gas assegnato ai pedali
  mp.axes[3] = -1; assert.equal(E.padPoll([xb, mp], bind, st).thr, 0);
  assert.equal(E.padPoll([xb], bind, st).thr, 0, 'dispositivo scollegato: niente gas');
});

test('joystick: lo sterzo assegnato a un asse (destra = verso il valore di fondo)', () => {
  const mp = maple(), bind = { sterzo: { id: mp.id, k: 'a', i: 0, rest: 0, full: 0.9 } };
  mp.axes[0] = 0.9; assert.equal(E.padPoll([mp], bind, { prev: {} }).steer, -1);
  mp.axes[0] = -0.9; assert.equal(E.padPoll([mp], bind, { prev: {} }).steer, 1);
  mp.axes[0] = 0.04; assert.equal(E.padPoll([mp], bind, { prev: {} }).steer, -0, 'zona morta al centro');
});

test('joystick: cambio a H, una marcia per pulsante, folle quando non ne è premuto nessuno', () => {
  const sh = shifter(), st = { prev: {} };
  assert.equal(E.padPoll([sh], {}, st).gear, undefined, 'senza assegnazioni nessun cambio a H');
  const bind = {}; [1, 2, 3, 4, 5, 6].forEach((n) => { bind['g' + n] = { id: sh.id, k: 'b', i: n - 1 }; }); bind.gr = { id: sh.id, k: 'b', i: 6 };
  assert.equal(E.padPoll([sh], bind, st).gear, 0);
  press(sh, 2); assert.equal(E.padPoll([sh], bind, st).gear, 3);
  press(sh, 2, 0); press(sh, 6); assert.equal(E.padPoll([sh], bind, st).gear, -1);
  press(sh, 6, 0); assert.equal(E.padPoll([sh], bind, st).gear, 0);
});

test('joystick: assegnare un pulsante e un pedale premendoli (si ignora l\'asse del cappellino a 3,29)', () => {
  const sh = shifter(), mp = maple(), xb = xbox();
  let ls = E.padLearnStart([sh, mp, xb], 'd', 0);
  assert.equal(E.padLearnStep(ls, [sh, mp, xb], 100).done, false);
  press(sh, 4); let r = E.padLearnStep(ls, [sh, mp, xb], 200);
  assert.deepEqual(r.bind, { id: sh.id, k: 'b', i: 4 }); assert.equal(r.done, true);
  ls = E.padLearnStart([sh, mp, xb], 'a', 0); mp.axes[9] = -3.29;      // il cappellino salta di colpo: non è un pedale
  assert.equal(E.padLearnStep(ls, [sh, mp, xb], 50).done, false);
  mp.axes[3] = 0.6; assert.equal(E.padLearnStep(ls, [sh, mp, xb], 100).done, false);
  mp.axes[3] = 1; assert.equal(E.padLearnStep(ls, [sh, mp, xb], 300).done, false, 'tiene ancora');
  r = E.padLearnStep(ls, [sh, mp, xb], 800);
  assert.equal(r.done, true); assert.deepEqual(r.bind, { id: mp.id, k: 'a', i: 3, rest: -1, full: 1 });
  ls = E.padLearnStart([sh, mp, xb], 's', 0); mp.axes[0] = 0.8; E.padLearnStep(ls, [mp], 100);
  r = E.padLearnStep(ls, [mp], 900); assert.deepEqual(r.bind, { id: mp.id, k: 'a', i: 0, rest: 0, full: 0.8 });
  ls = E.padLearnStart([mp], 'd', 0); assert.equal(E.padLearnStep(ls, [mp], 21000).timeout, true);
});

test('joystick: è collegato al gioco (script, lettura dei pad, scheda Comandi del menu)', () => {
  const idx = readFileSync(new URL('index.html', dir), 'utf8'), menu = readFileSync(new URL('menu.js', dir), 'utf8');
  assert.ok(idx.includes('<script src="joystick.js"></script>'));
  assert.ok(/function readPad\(\) \{\s*if \(window\.nightPad\)/.test(idx));
  assert.ok(menu.includes("window.nightPad.open()"));
  assert.equal(E.PAD_AZIONI.length, 14);
});
