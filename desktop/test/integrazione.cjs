'use strict';
// Prove sul programma vero, in un profilo nuovo che non tocca le partite del proprietario.
const { _electron } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { copiaGioco } = require('../copia-gioco');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.env.NIGHT_RUN_RISULTATI || path.join(ROOT, 'risultati-prove', new Date().toISOString().replace(/[:.]/g, '-')));
const PROFILO = path.join(OUT, 'profilo');
const FILE = path.join(PROFILO, 'salvataggi', 'localStorage.json');
fs.mkdirSync(OUT, { recursive: true });
const risultati = [];
let app, page;
const errori = [], esterne = [], avvisi = [];
function passa(nome, dati = {}) {
  console.log('PASSA:', nome, JSON.stringify(dati));
  risultati.push({ prova: nome, stato: 'passa', ...dati });
  fs.writeFileSync(path.join(OUT, 'risultati.json'), JSON.stringify(risultati, null, 2));
}
async function avvia() {
  const env = { ...process.env, NIGHT_RUN_DATI_PROVA: PROFILO };
  delete env.ELECTRON_RUN_AS_NODE;
  app = await _electron.launch({ args: [ROOT], env, timeout: 30000 });
  page = await app.firstWindow();
  page.on('pageerror', (e) => errori.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errori.push(m.text());
    if (m.type() === 'warning') avvisi.push(m.text());
  });
  page.on('request', (r) => { if (/^https?:/.test(r.url())) esterne.push(r.url()); });
  page.on('response', (r) => { if (r.status() >= 400) errori.push(r.status() + ' ' + r.url()); });
  await page.waitForLoadState('load');
  await page.waitForFunction(() => !!window.nightRun);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}
async function chiudi() {
  if (app) { const a = app; app = null; await a.close(); }
}
const leggi = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));
async function parti() {
  await page.click('#goBtn');
  await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelector('.pged .pg-go')?.click());
  await page.waitForTimeout(700);
  await page.evaluate(() => { if (window.NightPrologo?.playing) NightPrologo.finish(); });
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => { if (nightRun.game.prompt) nightRun.game.answer(0); });
    await page.waitForTimeout(200);
    if (await page.evaluate(() => !!nightRun.game.s.vg.cambio && !nightRun.game.prompt)) break;
  }
  await page.waitForFunction(() => !!nightRun.game.s.vg.cambio && !nightRun.game.prompt);
  await page.waitForTimeout(300);
}
async function tasto(key) {
  // Le scorciatoie del guscio devono passare dall'ingresso nativo Electron, non solo dal DOM/CDP.
  if (/^F\d+$|Control\+|Alt\+/.test(key)) {
    const parti = key.split('+');
    const codice = parti.pop();
    await app.evaluate(({ BrowserWindow }, dati) => {
      const wc = BrowserWindow.getAllWindows()[0].webContents;
      wc.sendInputEvent({ type: 'keyDown', keyCode: dati.codice, modifiers: dati.modificatori });
      wc.sendInputEvent({ type: 'keyUp', keyCode: dati.codice, modifiers: dati.modificatori });
    }, { codice: codice === 'ArrowLeft' ? 'Left' : codice.toUpperCase(), modificatori: parti.map((p) => p.toLowerCase()) });
  } else await page.keyboard.press(key);
  await page.waitForTimeout(300);
}

(async () => {
  copiaGioco();
  await avvia();
  const ambiente = await page.evaluate(() => ({ origine: location.origin, sicuro: isSecureContext, node: typeof require, processo: typeof process }));
  assert.deepEqual(ambiente, { origine: 'app://night-run', sicuro: true, node: 'undefined', processo: 'undefined' });
  const preferenze = await app.evaluate(({ BrowserWindow }) => {
    const w = BrowserWindow.getAllWindows()[0];
    const p = w.webContents.getLastWebPreferences();
    return { fullscreen: w.isFullScreen(), contextIsolation: p.contextIsolation, nodeIntegration: p.nodeIntegration, sandbox: p.sandbox, backgroundThrottling: w.webContents.getBackgroundThrottling() };
  });
  assert.deepEqual(preferenze, { fullscreen: true, contextIsolation: true, nodeIntegration: false, sandbox: true, backgroundThrottling: false });
  passa('Avvio isolato e schermo intero', { ambiente, preferenze });

  const envSeconda = { ...process.env, NIGHT_RUN_DATI_PROVA: PROFILO };
  delete envSeconda.ELECTRON_RUN_AS_NODE;
  const seconda = spawn(require('electron'), [ROOT], { env: envSeconda, windowsHide: true, stdio: 'ignore' });
  const codiceSeconda = await new Promise((ok, ko) => {
    const timer = setTimeout(() => { seconda.kill(); ko(new Error('Seconda istanza ancora aperta')); }, 15000);
    seconda.once('error', (e) => { clearTimeout(timer); ko(e); });
    seconda.once('exit', (code) => { clearTimeout(timer); ok(code); });
  });
  assert.equal(codiceSeconda, 0);
  assert.equal(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length), 1);
  passa('Seconda apertura: una sola istanza e una sola finestra');

  const font = await page.evaluate(async () => {
    const font = ['400 16px "Russo One"', '400 16px "Barlow Semi Condensed"', '500 16px "Barlow Semi Condensed"', '600 16px "Barlow Semi Condensed"', '700 16px "Barlow Semi Condensed"', 'italic 600 16px "Barlow Semi Condensed"', '400 16px "Share Tech Mono"', '400 16px "Saira Stencil One"', '400 16px "Bangers"', '400 16px "Permanent Marker"', '400 16px "Black Ops One"'];
    return Promise.all(font.map(async (f) => ({ font: f, caricati: (await document.fonts.load(f, 'Viaggio è à €')).length, disponibile: document.fonts.check(f, 'Viaggio è à €') })));
  });
  assert.ok(font.every((f) => f.caricati > 0 && f.disponibile));
  passa('Sette famiglie, tutti i pesi e corsivo caricati localmente', { font });
  await page.screenshot({ path: path.join(OUT, 'electron-titolo.png') });

  await page.evaluate(() => { window.__sentinellaProva = 'stessa pagina'; });
  for (const key of ['F5', 'Control+r', 'Control+Shift+r', 'Control+w', 'Control+Shift+i', 'F12', 'Alt+ArrowLeft', 'Backspace']) {
    await tasto(key);
    assert.equal(await page.evaluate(() => window.__sentinellaProva), 'stessa pagina', key);
  }
  assert.equal(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].webContents.isDevToolsOpened()), false);
  await tasto('F11');
  assert.equal(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isFullScreen()), false);
  await tasto('F11');
  assert.equal(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isFullScreen()), true);
  passa('Scorciatoie del browser bloccate e F11 funzionante');

  // Strumentazione solo in memoria per osservare AudioContext e il segnale del motore.
  await page.evaluate(() => {
    window.__audioProva = [];
    const AC = window.AudioContext;
    window.AudioContext = class extends AC {
      constructor(...a) { super(...a); window.__audioProva.push(this); }
    };
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (...a) {
      if (a[0] === this.context.destination && !window.__analizzatoreProva) {
        window.__analizzatoreProva = this.context.createAnalyser();
        window.__analizzatoreProva.fftSize = 4096;
        connect.call(this, window.__analizzatoreProva);
      }
      return connect.apply(this, a);
    };
  });
  await parti();
  await tasto('Tab');
  assert.equal(await page.evaluate(() => gameMenu.isOpen), true);
  await tasto('Escape');
  assert.equal(await page.evaluate(() => gameMenu.isOpen), false);
  assert.equal(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].isFullScreen()), true);
  await tasto('Digit0');
  assert.equal(await page.evaluate(() => telefono.isOpen), true);
  await tasto('Digit0');
  passa('Tab, Esc e telefono restano al gioco');

  await tasto('KeyI');
  await page.keyboard.down('Enter');
  await page.waitForTimeout(1800);
  await page.keyboard.up('Enter');
  assert.equal(await page.evaluate(() => nightRun.sim.running), true);
  await page.evaluate(() => nightRun.leva('D'));
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1800);
  await page.keyboard.up('KeyW');
  const motore = await page.evaluate(() => {
    const dati = new Float32Array(4096);
    window.__analizzatoreProva?.getFloatTimeDomainData(dati);
    return { acceso: nightRun.sim.running, giri: nightRun.sim.rpm, kmh: nightRun.sim.kmh, marcia: nightRun.levaNow, contesti: window.__audioProva.map((a) => a.state), rms: Math.sqrt(dati.reduce((s, v) => s + v * v, 0) / dati.length), audio: document.getElementById('audioState').textContent };
  });
  assert.ok(motore.kmh > 0);
  assert.ok(motore.rms > 0.00001);
  assert.ok(motore.contesti.includes('running'));
  assert.ok(!avvisi.some((a) => a.includes('AudioWorklet non disponibile')));
  passa('I + Invio, cambio automatico D, movimento e segnale audio', { motore });
  await page.screenshot({ path: path.join(OUT, 'electron-gioco.png') });

  await page.evaluate(() => {
    nightRun.sim.v = 0;
    nightRun.game.s.money = 12345;
    localStorage.setItem('nr_chiave_sconosciuta', 'conserva à 🚗');
    localStorage.setItem('nr_tasti', '{}');
  });
  const personaggio = await page.evaluate(() => localStorage.getItem('nr_pg'));
  // Nessuna attesa del timer: la chiusura deve scaricare su file l'ultima scrittura.
  await chiudi();
  assert.equal(leggi().nr_chiave_sconosciuta, 'conserva à 🚗');
  assert.equal(JSON.parse(leggi()['nightrun-viaggio']).s.money, 12345);
  await avvia();
  assert.equal(await page.evaluate(() => nightRun.game.s.money), 12345);
  passa('Chiusura immediata e riapertura conservano partita e chiavi sconosciute');

  // Cancella la sola memoria web; nessun processo del gioco resta attivo durante la pulizia.
  await page.goto('about:blank');
  await app.evaluate(async ({ session }) => {
    await session.defaultSession.clearStorageData();
    await session.defaultSession.clearCache();
  });
  await chiudi();
  assert.equal(JSON.parse(leggi()['nightrun-viaggio']).s.money, 12345);
  await avvia();
  assert.equal(await page.evaluate(() => nightRun.game.s.money), 12345);
  assert.equal(await page.evaluate(() => localStorage.getItem('nr_chiave_sconosciuta')), 'conserva à 🚗');
  passa('Cancellazione di Local Storage, IndexedDB, CacheStorage, Service Worker e cache HTTP: recupero dal JSON');

  await chiudi();
  // Caso inverso: togli soltanto i due file di prova, lasciando intatta la memoria web del profilo di prova.
  fs.unlinkSync(FILE);
  fs.unlinkSync(FILE + '.bak');
  await avvia();
  assert.equal(JSON.parse(leggi()['nightrun-viaggio']).s.money, 12345);
  passa('JSON mancante: migrazione immediata dei dati web esistenti');

  await chiudi();
  const autorevole = leggi();
  delete autorevole.nr_chiave_sconosciuta;
  autorevole.nr_da_file = 'autorevole';
  fs.writeFileSync(FILE, JSON.stringify(autorevole));
  await avvia();
  assert.equal(await page.evaluate(() => localStorage.getItem('nr_chiave_sconosciuta')), null);
  assert.equal(await page.evaluate(() => localStorage.getItem('nr_da_file')), 'autorevole');
  passa('JSON autorevole anche per le chiavi assenti');

  await chiudi();
  fs.writeFileSync(FILE, '{interrotto');
  await avvia();
  assert.equal(await page.evaluate(() => nightRun.game.s.money), 12345);
  passa('JSON corrotto: partita recuperata dal backup');

  await parti();
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('banco2jz'));
    s.vol = 37;
    s.tunes.v40 = { turbo: 'prova' };
    localStorage.setItem('banco2jz', JSON.stringify(s));
    localStorage.setItem('nr_tasti', '{}');
  });
  // Usa il pulsante e la sua conferma reali; nessuna modifica a riavvia.js.
  await page.click('#riavviaBtn');
  await page.click('#riavviaBox .si');
  await page.waitForLoadState('load');
  await page.waitForFunction(() => !!window.nightRun);
  await page.waitForTimeout(300);
  const ripartito = await page.evaluate(() => ({ soldi: nightRun.game.s.money, personaggio: localStorage.getItem('nr_pg'), tasti: localStorage.getItem('nr_tasti'), volume: JSON.parse(localStorage.getItem('banco2jz')).vol }));
  assert.notEqual(ripartito.soldi, 12345);
  assert.equal(ripartito.personaggio, personaggio);
  assert.equal(ripartito.tasti, '{}');
  assert.equal(ripartito.volume, 37);
  await chiudi();
  assert.equal(fs.readFileSync(FILE, 'utf8'), fs.readFileSync(FILE + '.bak', 'utf8'));
  fs.writeFileSync(FILE, 'corrotto dopo RIAVVIA');
  await avvia();
  assert.notEqual(await page.evaluate(() => nightRun.game.s.money), 12345);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('banco2jz')).vol), 37);
  passa('RIAVVIA reale conserva impostazioni/personaggio e non risorge dal backup', { ripartito });

  await chiudi();
  fs.writeFileSync(FILE, 'corrotto');
  fs.writeFileSync(FILE + '.bak', 'corrotto');
  await avvia();
  assert.equal(await page.evaluate(() => localStorage.getItem('nr_da_file')), null);
  assert.notEqual(await page.evaluate(() => nightRun.game.s.money), 12345);
  passa('Entrambi i JSON corrotti: nuova partita senza errore');
  await chiudi();
  assert.deepEqual(errori, []);
  assert.deepEqual(esterne, []);
  passa('Nessun errore JavaScript, risorsa mancante o richiesta HTTP esterna', { avvisi: [...new Set(avvisi)].map((a) => a.slice(0, 200)) });
  console.log('Risultati:', OUT);
})().catch(async (e) => {
  console.error(e);
  risultati.push({ prova: 'Esecuzione', stato: 'fallisce', errore: e.stack });
  fs.writeFileSync(path.join(OUT, 'risultati.json'), JSON.stringify(risultati, null, 2));
  await chiudi().catch(() => {});
  process.exitCode = 1;
});
