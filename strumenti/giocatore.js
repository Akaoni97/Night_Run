// Giocatore automatico di Night Run: fa una partita nuova del Viaggio come la farebbe una persona prudente, a tempo
// accelerato, e scrive un diario (soldi, spese, lavori, bisogni, eventi) per capire ritmo ed economia.
// Non cambia il gioco: lo guida da fuori con le stesse funzioni dei pulsanti.
//
// Uso (dalla radice del repository, serve Playwright con Chromium):
//   node strumenti/giocatore.js [--km 200] [--vel 125] [--x 8] [--ore 2] [--out cartella]
//   --km    fin dove arrivare (km del viaggio)
//   --vel   velocità di crociera in km/h (sotto i 130 del limite)
//   --x     accelerazione del tempo (il passo di ogni fotogramma resta al massimo 0,1 s: oltre ~6 conta poco)
//   --ore   tempo vero massimo
//   --out   cartella per diario.json e le foto ogni 50 km
//   --guida 1 = AUTO 1 (guida l'auto, gas e freno compresi, come chi la lascia fare) · 2 = AUTO 2 (corsie sue, gas e freno del giocatore)
// Cosa fa il giocatore: il primo lavoro (tutorial) e poi le missioni della bacheca, le consegne che ci stanno nel
// bagagliaio, benzina sotto il 30 %, mangia e beve sotto il 45 %, dorme al motel sotto il 40 % di sonno, da Mario
// tagliando, candele, pastiglie, gomme e carrozzeria quando servono, documenti appena ha i soldi. Non compra auto né
// pezzi: il riassunto dice quando avrebbe potuto. Alle domande risponde con la prima scelta (alla polizia: paga).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const GUIDA = +opt('guida', 1), KM = +opt('km', 200), VEL = +opt('vel', 125), X = +opt('x', 8), ORE = +opt('ore', 2);
const OUT = path.resolve(opt('out', '.')); fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

// tempo accelerato: performance.now e i fotogrammi corrono X volte più in fretta
const TEMPO = (x) => {
  const pn = performance.now.bind(performance), t0 = pn();
  performance.now = () => t0 + (pn() - t0) * x;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf(() => cb(performance.now()));
};

// il giocatore, dentro la pagina
const BOT = (VEL, KM, GUIDA) => {
  const n = window.nightRun, g = n.game, sim = n.sim, s = g.s;
  const B = window.__bot = { log: [], snap: [], t: 0, keys: {}, done: {}, want: {}, exitAt: 0, lastKm: 0, stuckT: 0, prompts: 0, cost: {}, firstKm: {} };
  const km = () => s.dist / 1000, r1 = (x) => Math.round(x * 10) / 10;
  // ogni messaggio del gioco finisce nel diario, con il km e l'ora di gioco
  const say = g.say.bind(g);
  g.say = function (text, kind) { const t = typeof text === 'string' ? text : (text && text.text) || String(text); B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: kind || '', text: t }); return say(text, kind); };
  // tempo di gioco
  const up = g.update.bind(g); g.update = function (dt) { B.t += dt; return up(dt); };
  // spese per voce: si guarda il calo dei soldi intorno a ogni azione
  const spend = (what, fn) => { const m0 = s.money; const r = fn(); const d = m0 - s.money; if (d > 0.001) B.cost[what] = (B.cost[what] || 0) + d; return r; };
  const key = (k, on) => { if (!!B.keys[k] === on) return; B.keys[k] = on; window.dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { key: k, bubbles: true })); };
  const release = () => { key('w', false); key('s', false); };
  const mis = () => (s.vg && s.vg.mis) || null;
  const needs = () => s.vg.needs;
  const docsDue = () => (g.docScaduti ? g.docScaduti() : []);

  // in quale tappa entrare
  function wantIn(p) {
    const N = needs(), m = mis(), why = [];
    if (s.trunk.some((it) => it.to === p.n)) why.push('consegna');
    if (!s.vg.firstDone && (p.n === 0 || p.n === 1)) why.push('primo lavoro');
    if (m && m.phase === 'go' && m.giverN === p.n) why.push('missione');
    if (m && m.phase === 'carry' && m.toN === p.n) why.push('consegna missione');
    if (p.id === 'fuel' && sim.fuel < 0.3) why.push('benzina');
    if ((p.id === 'bar' || p.id === 'grill' || p.id === 'motel') && (N.food < 0.45 || N.water < 0.45)) why.push('fame/sete');
    if (p.id === 'grill' && N.wash < 0.3) why.push('doccia');
    if (p.id === 'motel' && N.sleep < 0.4) why.push('dormire');
    if ((p.id === 'bar' || p.id === 'grill') && N.sleep < 0.25) why.push('caffè');
    if (p.id === 'niko') {
      const M = g.maint(), T = g.tyres();
      if (Math.min(M.oil, M.plugs, M.pads) < 0.3) why.push('manutenzione');
      if (Math.min(...T.p) < 1.9) why.push('gomme sgonfie');
      if (sim.damage > 0.2) why.push('carrozzeria');
      if (sim.tireWear > 0.7) why.push('gomme consumate');
      if (docsDue().includes('rev') && s.money > 300) why.push('revisione');
    }
    return why;
  }
  // dentro: fa quello che serve
  function shop(I) {
    const N = needs(), nn = VG.stopIndex(I.x), did = [];
    const eat = (f, w, eur, what) => { const q = spend('cibo e bevande', () => g.vgEat(f, w, eur, what)); if (q.ok) did.push(what); };
    if (I.id === 'bar') { if (N.food < 0.6) eat(0.5, 0, 4.5, 'Panino'); if (N.food < 0.6) eat(0.2, 0, 1.5, 'Cornetto'); if (N.water < 0.6) eat(0, 0.5, 1, 'Acqua'); if (N.sleep < 0.4) { spend('cibo e bevande', () => g.vgPay(1.2, 'Caffè')); N.sleep = Math.min(1, N.sleep + 0.12); did.push('Caffè'); } }
    if (I.id === 'grill') { if (N.food < 0.6 || N.water < 0.6) eat(1, 0.6, 12, 'Pasto completo'); if (N.wash < 0.5) { spend('igiene', () => g.vgShower(6)); did.push('Doccia'); } if (N.sleep < 0.4) { spend('cibo e bevande', () => g.vgPay(1.8, 'Caffè lungo')); N.sleep = Math.min(1, N.sleep + 0.14); did.push('Caffè'); } }
    if (I.id === 'motel') {
      // la missione pesante vuole il rimorchietto: lo compra appena può
      const m = mis(), M = m && m.phase === 'go' && g.vgMission(m.i);
      if (M && M.kg > 50 && !s.vg.trailer && s.money > 2200 + 300) { const q = spend('rimorchio', () => g.vgBuy('trailer')); if (q.ok) { n.applySettings(); did.push('RIMORCHIO'); } }
    }
    if (I.id === 'motel') { if (N.sleep < 0.6) { const q = spend('motel', () => g.vgSleep()); if (q.ok) did.push('Dormito'); } g.vgShower(0); if (N.food < 0.6) eat(0.8, 0.4, 9, 'Cena'); }
    if (I.id === 'bar' || I.id === 'grill' || I.id === 'motel') {
      for (const o of g.vgOffers(nn)) {
        const taken = s.vg.taken && s.vg.taken[nn + ':' + o.k];
        if (taken) continue;
        if (o.kmTo > KM + 5 && !o.mission && !o.first) continue;
        const q = g.vgTake(o, nn); if (q.ok) did.push(o.mission ? 'MISSIONE ' + o.title + ' € ' + o.pay : o.first ? 'PRIMO LAVORO' : `carico ${o.kg} kg € ${o.pay}`);
      }
    }
    if (I.id === 'fuel') { g.inflate(); if (sim.fuel < 0.8) { const q = g.startFill(999); if (q.ok) { B.fillM0 = s.money; did.push('Pieno'); } } }
    if (I.id === 'niko') {
      const M = g.maint();
      for (const sv of ['oil', 'plugs', 'pads']) if (M[sv] < 0.35) { const q = spend('officina', () => g.service(sv)); if (q.ok) did.push(sv); }
      if (M.dirt > 0.8) spend('officina', () => g.service('wash'));
      if (sim.damage > 0.1) { const q = spend('carrozzeria', () => g.repair()); if (q.ok) did.push('carrozzeria'); }
      if (sim.tireWear > 0.6) { const q = spend('officina', () => g.newTires()); if (q.ok) did.push('gomme nuove'); }
      const T = g.tyres(); for (let i = 0; i < 4; i++) { T.leak[i] = 0; T.p[i] = 2.3; }
      if (s.trunk.some((it) => it.kind === 'forata')) { const q = spend('officina', () => g.repairTyre()); if (q.ok) did.push('gomma riparata'); }
      if (docsDue().includes('rev')) { const q = spend('documenti', () => g.docPaga('rev')); if (q.ok) did.push('revisione'); }
    }
    B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: 'BOT', text: `Dentro ${I.name} (${I.id}): ${did.join(', ') || 'niente'} · € ${Math.round(s.money)}` });
  }

  function tick() {
    if (B.stop) return;
    // domande: prima scelta, alla polizia «Paga»
    if (g.prompt && g.prompt.options) {
      const p = g.prompt; let i = p.options.findIndex((o) => /^paga/i.test(o.label || '')); if (i < 0) i = 0;
      B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: 'DOMANDA', text: `${p.title || ''}: ${(p.text || '').slice(0, 90).replace(/\n/g, ' ')} → ${p.options[i].label}` });
      B.prompts++; const m0 = s.money; g.answer(i); if (s.money < m0) B.cost['polizia e multe'] = (B.cost['polizia e multe'] || 0) + m0 - s.money; return;
    }
    if (window.telefono && window.telefono.isOpen && window.telefono.close) window.telefono.close();
    const I = g.inside;
    if (I) {
      release();
      if (I.phase === 'shop') {
        if (!B.done[I.x]) { B.done[I.x] = true; shop(I); B.exitAt = B.t + 1; }
        if (I.fill) return;
        if (B.fillM0 !== undefined) { B.cost.benzina = (B.cost.benzina || 0) + Math.max(0, B.fillM0 - s.money); B.fillM0 = undefined; }
        if (B.t > B.exitAt) g.exitPlace();
      }
      return;
    }
    // documenti: assicurazione e bollo appena ci sono i soldi (dal telefono)
    for (const d of docsDue()) if (d !== 'rev' && s.money > g.docCosto(d) + 400) spend('documenti', () => g.docPaga(d));
    // motore e leva
    if (!sim.running) { if (!B.startT || B.t - B.startT > 3) { B.startT = B.t; n.engineTap(); } return; }
    if (n.levaNow && n.levaNow !== 'D') n.leva('D');
    // tappe
    const d = s.dist, p = g.placesBetween(d - 5, d + 400).find((q) => q.x > d - 2);
    if (p && B.want[p.x] === undefined && p.x - d < 380) { const w = wantIn(p); B.want[p.x] = w; }
    if (p && B.want[p.x] && B.want[p.x].length && !g.ap) {
      const np = g.nearPlace();
      if (np && np.x === p.x) {
        if (np.ok) { release(); B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: 'BOT', text: `Entro: ${p.name} per ${B.want[p.x].join(', ')}` }); B.want[p.x] = []; g.enterPlace(np); return; }
        key('w', false); key('s', true); return;            // troppo veloce: frena
      }
      if (p.x - d < 260) { const lim = 70 / 3.6; if (sim.v > lim) { key('w', false); key('s', true); return; } }
    }
    if (g.ap) { release(); return; }
    // crociera: gas e freno, le corsie le cambia l'AUTO 2
    const M = mis(), Mm = M && M.phase === 'carry' && g.vgMission ? g.vgMission(M.i) : null;
    let tgt = VEL; if (Mm && Mm.kind === 'calmo') tgt = Math.min(tgt, (Mm.max || 110) - 8);
    if (needs().sleep < 0.15) tgt = Math.min(tgt, 90);
    if (s.vg.trailerOn) tgt = Math.min(tgt, 105);
    // gomma a terra: si ferma e monta la ruota di scorta
    { const T = g.tyres(); if (Math.min(...T.p) < 1.2 && s.trunk.some((it) => it.kind === 'scorta')) {
      key('w', false); key('s', true);
      if (Math.abs(sim.v) < 0.5) { const q = g.changeTyre(); B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: 'BOT', text: 'Cambio la gomma: ' + (q.ok ? 'fatto' : q.why) }); }
      return;
    } }
    const calmo = tgt < VEL;
    if (GUIDA === 1 && !calmo) {
      // AUTO 1: si porta l'auto a velocità e si lascia: dopo 15 s senza tasti guida lei (alla velocità che ha)
      if (n.autoState().on) release();
      else { key('s', false); if (sim.kmh < tgt + 4 && !B.coast) key('w', true); else { B.coast = true; key('w', false); } }
    } else if (g.blocked) { key('w', false); key('s', true); }
    else { key('s', false); key('w', sim.kmh < tgt - 1); }
    if (n.autoState().on || sim.kmh < 40) B.coast = false;
    // bloccato?
    if (km() > B.lastKm + 0.05) { B.lastKm = km(); B.stuckT = B.t; }
    else if (B.t - B.stuckT > 90) { B.stuckT = B.t; B.log.push({ km: r1(km()), min: Math.round(B.t / 6) / 10, kind: 'BLOCCATO', text: `fermo da 90 s: v ${Math.round(sim.kmh)} km/h, leva ${n.levaNow}, motore ${sim.running}` }); release(); }
  }
  // foto dello stato ogni km
  let lastSnap = -1;
  function snap() {
    const k = Math.floor(km()); if (k <= lastSnap) return; lastSnap = k;
    const N = needs(), v = s.vg, M = g.maint();
    B.snap.push({ km: k, min: Math.round(B.t / 6) / 10, soldi: Math.round(s.money), guadagnato: Math.round(v.earned || 0), lavori: v.jobs || 0, missioni: v.misDone || 0,
      benzina: Math.round(sim.fuel * 100), fame: Math.round(N.food * 100), sete: Math.round(N.water * 100), sonno: Math.round(N.sleep * 100), igiene: Math.round(N.wash * 100),
      danni: Math.round((sim.damage || 0) * 100), olio: Math.round(M.oil * 100), pastiglie: Math.round(M.pads * 100), gomme: Math.round((1 - (sim.tireWear || 0)) * 100),
      luogo: g.loc && g.loc.id, ricercato: s.pol ? s.pol.fuga || 0 : 0, auto: g.car, crash: s.crashes || 0, multe: s.fines || 0 });
  }
  setInterval(() => { try { tick(); snap(); } catch (e) { B.log.push({ km: r1(km()), kind: 'ERRORE BOT', text: String(e && e.stack || e).slice(0, 300) }); } }, 30);
};

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const URL = `http://127.0.0.1:${server.address().port}/index.html`;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED/.test(m.text())) errs.push(m.text()); });
  await page.goto(URL); await page.waitForTimeout(1200);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* niente */ } });
  await page.reload(); await page.waitForTimeout(1200);
  await page.evaluate(() => { const b = document.getElementById('goBtn'); b && b.click(); }); await page.waitForTimeout(2500);
  await page.evaluate(() => { const b = document.querySelector('.pged .pg-go'); if (b) b.click(); }); await page.waitForTimeout(1500);
  await page.evaluate(() => { if (window.NightPrologo && NightPrologo.playing) NightPrologo.finish(); }); await page.waitForTimeout(800);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { const g = nightRun.game; if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ } }); await page.waitForTimeout(150); }
  // qualità bassa (più fotogrammi al secondo) e AUTO 2: le corsie le cambia l'auto, gas e freno il giocatore
  await page.evaluate((GUIDA) => {
    const q = document.getElementById('q3d'); if (q) { q.value = 'bassa'; q.dispatchEvent(new Event('change')); }
    const db = document.getElementById('dbAuto'); for (let i = 0; i < 3 && nightRun.autoState().mode !== GUIDA; i++) db.click();   // il testo del pulsante si aggiorna al fotogramma dopo: si guarda lo stato
  }, GUIDA);
  await page.evaluate(`(${TEMPO})(${X})`);
  await page.evaluate(`(${BOT})(${VEL}, ${KM}, ${GUIDA})`);
  const t0 = Date.now(); let lastLog = 0, lastFoto = -1;
  const ultimo = () => page.evaluate(() => { const B = window.__bot, s = nightRun.game.s; return { km: s.dist / 1000, soldi: Math.round(s.money), min: B.t / 60, nlog: B.log.length }; });
  for (;;) {
    await page.waitForTimeout(3000);
    const u = await ultimo();
    const nuovi = await page.evaluate((i) => window.__bot.log.slice(i), lastLog); lastLog += nuovi.length;
    for (const l of nuovi) if (['BOT', 'DOMANDA', 'BLOCCATO', 'ERRORE BOT', 'money', 'police', 'bad'].includes(l.kind)) console.log(`km ${l.km.toFixed(1).padStart(6)} · ${String(l.min).padStart(5)}' · ${l.kind.padEnd(8)} ${l.text.slice(0, 150)}`);
    console.log(`--- km ${u.km.toFixed(2)} · € ${u.soldi} · ${u.min.toFixed(1)} min di gioco · ${((Date.now() - t0) / 60000).toFixed(1)} min veri`);
    const f50 = Math.floor(u.km / 50); if (f50 > lastFoto) { lastFoto = f50; await page.screenshot({ path: path.join(OUT, `km${f50 * 50}.png`) }); }
    if (u.km >= KM || Date.now() - t0 > ORE * 3600e3) break;
  }
  const B = await page.evaluate(() => { const B = window.__bot; B.stop = true; const v = nightRun.game.s.vg; return { log: B.log, snap: B.snap, cost: B.cost, min: B.t / 60, vg: { earned: v.earned, jobs: v.jobs, misDone: v.misDone, stops: v.stops }, money: nightRun.game.s.money }; });
  B.errori = errs;
  fs.writeFileSync(path.join(OUT, 'diario.json'), JSON.stringify(B, null, 1));
  await page.screenshot({ path: path.join(OUT, 'fine.png') });
  console.log('\nFINE: km', B.snap.length ? B.snap[B.snap.length - 1].km : 0, '· € ', Math.round(B.money), '· minuti di gioco', B.min.toFixed(1), '· spese', JSON.stringify(B.cost), '· errori', errs.length);
  for (const e of errs.slice(0, 10)) console.log('ERRORE', e);
  await b.close(); server.close();
})();
