'use strict';
const { app, BrowserWindow, Menu, protocol, net, ipcMain, dialog } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { Salvataggi } = require('./salvataggi');
const { Aggiornatore, PAGINA_RELEASE } = require('./aggiorna');

const ORIGINE = 'app://night-run';
const DEV = process.argv.includes('--dev');
const ROOT = path.join(__dirname, 'app');
let finestra;
let erroreMostrato = false;

// Nome e percorso espliciti: avvio npm, installatore e portatile condividono gli stessi dati.
app.setName('night-run');
app.setPath('userData', path.join(app.getPath('appData'), 'night-run'));
// Percorso alternativo riservato alle prove da sorgente; gli eseguibili usano sempre quello comune.
if (!app.isPackaged && process.env.NIGHT_RUN_DATI_PROVA) {
  app.setPath('userData', path.resolve(process.env.NIGHT_RUN_DATI_PROVA));
}
app.setAppUserModelId('it.akaoni97.nightrun');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, allowServiceWorkers: true }
}]);

function segnala(errore) {
  console.error(errore);
  if (!erroreMostrato) {
    erroreMostrato = true;
    dialog.showErrorBox('Night Run — salvataggio non riuscito',
      'Non riesco a leggere o scrivere i salvataggi. Controlla spazio libero e permessi.\n' + errore.message);
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (finestra) {
      if (finestra.isMinimized()) finestra.restore();
      finestra.show();
      finestra.focus();
    }
  });
  app.whenReady().then(() => {
    if (!fs.existsSync(path.join(ROOT, 'index.html'))) throw new Error('Manca desktop/app: esegui node copia-gioco.js');
    const archivio = new Salvataggi(path.join(app.getPath('userData'), 'salvataggi'));
    const autorizzato = (e) => {
      if (e.sender !== finestra?.webContents || e.senderFrame !== e.sender.mainFrame) return false;
      const url = new URL(e.senderFrame.url);
      return url.protocol === 'app:' && url.host === 'night-run' && url.pathname === '/index.html';
    };
    ipcMain.on('nr:carica', (e) => {
      try {
        if (!autorizzato(e)) throw new Error('Origine del salvataggio non autorizzata');
        e.returnValue = { ok: true, ...archivio.carica() };
      } catch (err) {
        e.returnValue = { ok: false, errore: err.message };
        segnala(err);
      }
    });
    ipcMain.on('nr:salva', (e, dati) => {
      try {
        if (!autorizzato(e)) throw new Error('Origine del salvataggio non autorizzata');
        archivio.scrivi(dati);
        e.returnValue = { ok: true };
      } catch (err) {
        e.returnValue = { ok: false, errore: err.message };
        segnala(err);
      }
    });
    // Aggiornamenti: solo da clic del giocatore (aggiorna.js). Nel programma non impacchettato l'updater non parte.
    let info = { versione: app.getVersion(), commit: null, data: null };
    try { info = { ...info, ...JSON.parse(fs.readFileSync(path.join(__dirname, 'info-build.json'), 'utf8')), versione: app.getVersion() }; } catch { /* sviluppo: nessuna info di build */ }
    const impacchettato = app.isPackaged;
    const portatile = !!process.env.PORTABLE_EXECUTABLE_DIR;
    let autoUpdater = null;
    if (impacchettato && !portatile) autoUpdater = require('electron-updater').autoUpdater;
    const aggiorna = new Aggiornatore({
      updater: autoUpdater, info, avvio: { impacchettato, portatile },
      salvaPrima: (dati) => archivio.scrivi(dati),
      checkpoint: (versione) => archivio.checkpoint(versione),
      installa: () => autoUpdater.quitAndInstall(true, true),
      notifica: (stato) => { if (finestra && !finestra.isDestroyed()) finestra.webContents.send('nr:agg:stato', stato); }
    });
    ipcMain.handle('nr:agg:stato', (e) => { if (!autorizzato(e)) throw new Error('Non autorizzato'); return aggiorna.stato(); });
    ipcMain.handle('nr:agg:controlla', (e) => { if (!autorizzato(e)) throw new Error('Non autorizzato'); return aggiorna.controlla(); });
    ipcMain.handle('nr:agg:scarica', (e) => { if (!autorizzato(e)) throw new Error('Non autorizzato'); return aggiorna.scarica(); });
    ipcMain.handle('nr:agg:installa', (e, dati) => { if (!autorizzato(e)) throw new Error('Non autorizzato'); return aggiorna.installa(dati); });
    // Solo la pagina fissa delle release, mai un indirizzo scelto dal gioco.
    ipcMain.handle('nr:agg:pagina', (e) => { if (!autorizzato(e)) throw new Error('Non autorizzato'); return require('electron').shell.openExternal(PAGINA_RELEASE); });
    protocol.handle('app', async (req) => {
      const url = new URL(req.url);
      if (url.host !== 'night-run' || !['GET', 'HEAD'].includes(req.method)) return new Response('', { status: 403 });
      let relativo;
      try { relativo = decodeURIComponent(url.pathname); } catch { return new Response('', { status: 400 }); }
      if (relativo.includes('\\') || relativo.includes('\0')) return new Response('', { status: 403 });
      const file = path.resolve(ROOT, '.' + (relativo === '/' ? '/index.html' : relativo));
      if (!file.startsWith(ROOT + path.sep)) return new Response('', { status: 403 });
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response('', { status: 404 });
      const risposta = await net.fetch(pathToFileURL(file).toString(), { method: req.method, headers: req.headers });
      if (path.extname(file) !== '.html') return risposta;
      const headers = new Headers(risposta.headers);
      // Il gioco contiene script e stili in linea; nessuna risorsa deve arrivare da altri siti.
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' blob: data:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob: data:; font-src 'self'; connect-src 'self' blob: data:; worker-src 'self' blob: data:; object-src 'none'; base-uri 'self'; frame-src 'none'");
      return new Response(risposta.body, { status: risposta.status, headers });
    });
    Menu.setApplicationMenu(null);
    finestra = new BrowserWindow({
      title: 'Night Run: The Last Highway',
      icon: path.join(ROOT, 'img', 'app', 'icona-512.png'),
      width: 1280, height: 720, fullscreen: true, autoHideMenuBar: true,
      backgroundColor: '#0a081c',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, nodeIntegration: false, sandbox: true,
        backgroundThrottling: false, devTools: DEV,
        autoplayPolicy: 'no-user-gesture-required'
      }
    });
    const wc = finestra.webContents;
    // Tutte le risorse arrivano dal pacchetto: il gioco non deve contattare server esterni.
    wc.session.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*', 'ftp://*/*'] },
      (_d, cb) => cb({ cancel: true }));
    wc.session.setPermissionRequestHandler((_wc, permesso, cb) => cb(permesso === 'fullscreen'));
    wc.setWindowOpenHandler(() => ({ action: 'deny' }));
    wc.on('will-navigate', (e, url) => { if (url !== ORIGINE + '/index.html') e.preventDefault(); });
    wc.on('will-redirect', (e) => e.preventDefault());
    wc.on('before-input-event', (e, input) => {
      const key = input.key.toLowerCase();
      const ctrl = input.control || input.meta;
      if (key === 'f11') {
        e.preventDefault();
        if (input.type === 'keyDown' && !input.isAutoRepeat) finestra.setFullScreen(!finestra.isFullScreen());
      } else if (key === 'f5' || (ctrl && ['r', 'w'].includes(key)) ||
        (!DEV && (key === 'f12' || (ctrl && input.shift && ['i', 'j', 'c'].includes(key)))) ||
        (key === 'browserback') || (input.alt && key === 'arrowleft')) {
        e.preventDefault();
      }
      // Backspace rimane disponibile per scrivere; la navigazione indietro è bloccata anche qui sotto.
    });
    wc.on('did-fail-load', (_e, code, descrizione) => { if (code !== -3) console.error('Caricamento fallito:', code, descrizione); });
    finestra.on('closed', () => { finestra = null; });
    finestra.loadURL(ORIGINE + '/index.html');
    if (DEV) wc.openDevTools({ mode: 'detach' });
  }).catch((e) => { dialog.showErrorBox('Night Run — avvio non riuscito', e.message); app.quit(); });
  app.on('window-all-closed', () => app.quit());
}
