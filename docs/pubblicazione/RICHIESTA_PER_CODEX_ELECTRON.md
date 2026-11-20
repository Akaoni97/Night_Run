# Night Run · Richiesta a Codex: il gioco come programma per Windows (Electron)

Da dare a Codex sul PC del proprietario. Piano generale e motivi: `docs/pubblicazione/PERCORSO.md` (leggerlo per primo).
Regole del progetto: `AGENTS.md` (leggerlo per intero: niente npm nel gioco, commenti e testi in italiano, modifiche mirate, il gioco è pensato per il PC).

## Obiettivo

Un programma per Windows che apre Night Run a schermo intero, **uguale al gioco sul sito**, senza internet, con i salvataggi in file veri.
Il gioco sul sito (GitHub Pages) deve continuare a funzionare identico: **non si riscrive e non si rompe niente**.

## Dove prendere il gioco

Repository pubblico `https://github.com/Akaoni97/Night_Run`, ramo `main` (riferimento: commit `a7375df` del 20/11/2026, che contiene `docs/pubblicazione/PERCORSO.md`, `AGENTS.md` e `LICENZE.md`). Questa richiesta sta sul ramo `claude/stoic-mendel-9mgpun`, non su `main`: vale il file che ti ha dato il proprietario. Si lavora su un ramo nuovo `desktop`, da `main`, e si carica solo quello.
Se il PC ha già la cartella del repository: `git checkout main && git pull && git checkout -b desktop`.

## Regole (non negoziabili)

1. **Niente npm, niente `package.json`, niente `node_modules` nella radice del repository.** Tutto quello che serve a Electron sta in `desktop/`.
2. Si toccano solo questi file del gioco: `index.html` (solo per i punti 1 e 2: caratteri e three.js locali) e, se serve, `sw.js`. Tutto il resto del gioco **non si tocca**.
3. Prima e dopo ogni modifica al gioco: `node --test test/*.test.js` (Node 22+) deve restare verde (su `main` al commit `a7375df` sono 229; vedi «Decisioni», punto 5, per il test della polizia instabile).
4. Il gioco sul sito deve partire come prima: dopo i punti 1 e 2 aprire `index.html` con `python -m http.server` e controllare che non ci siano errori in console.
5. `node_modules/`, `desktop/dist/`, `desktop/app/` vanno in `.gitignore`. Mai committare programmi compilati.
6. Non cambiare logica, fisica, audio, storia o grafica. Se qualcosa non funziona dentro Electron, **segnalarlo nel rapporto**, non "sistemarlo" nel gioco.
7. Nessun file preso da mod o senza licenza. Le questioni legali sono in `LICENZE.md`: non toccarle.

## Cosa fare, in ordine

### 1. Il gioco senza internet (serve anche sul sito)
Oggi dipende da due cose in rete: i caratteri di Google Fonts (righe `<link>` in testa a `index.html`: Russo One, Barlow Semi Condensed e gli altri indicati nel link) e three.js 0.147 da jsdelivr.
- Scaricare i file dei caratteri (licenza OFL) in `vendor/fonts/` con i relativi `@font-face` (stessi pesi e stili del link attuale) e togliere le righe `preconnect` e `stylesheet` di Google.
- Scaricare `three@0.147` esatto in `vendor/three/` (solo i file che il gioco usa) e far puntare `index.html` lì, con la stessa versione. Controllare con `grep` che non ci siano altri `https://` che servano al gioco; `sw.js` ha già la logica per la copia salvata del CDN: va adattato in modo che non si rompa (versione `VERSIONE` da cambiare).
- Verifica: disattivare la rete e aprire il gioco da `http://localhost`; vista 3D, caratteri e audio devono funzionare.

### 2. Il guscio Electron in `desktop/`
- `desktop/package.json` (nome `night-run`, `electron` e `electron-builder` solo in `devDependencies`), `desktop/main.js`, `desktop/preload.js`, `desktop/LEGGIMI.md`.
- **Come si carica il gioco:** non da `file://` (rompe `localStorage`, `AudioWorklet` e il service worker). Registrare uno schema `app://` con `protocol.handle` come "standard + secure" che serve i file del gioco, oppure un piccolo server solo su `127.0.0.1`. Scegliere e spiegare nel LEGGIMI.
- Finestra a schermo intero, senza barra dei menu, titolo "Night Run: The Last Highway", icona (usare un'immagine esistente di `img/`; se non va bene chiedere).
- `backgroundThrottling: false`, autoplay dell'audio consentito (il motore parte da un tasto, ma l'`AudioContext` non deve restare sospeso), `contextIsolation: true`, `nodeIntegration: false`.
- Tasti: F5, Ctrl+R, Ctrl+W, Ctrl+Maiusc+I e Backspace-indietro **disattivati** nel programma finito (gli strumenti di sviluppo solo con `--dev`). F11 attiva/disattiva lo schermo intero. **Esc e Tab restano al gioco** (menu e telefono).
- Script `desktop/copia-gioco.js` che copia i file del gioco dalla radice in `desktop/app/` al momento della build (così il repository non ha due copie).

### 3. I salvataggi in file veri
Il gioco salva in `localStorage` (chiavi come `nightrun-viaggio`, `nightrun`, `banco2jz`, `nr_pg`, `nr_tasti`: cercare con `grep localStorage`, sono in `index.html`, `personaggio.js`, `tasti.js`, `riavvia.js` e altri).
- **Senza modificare il codice del gioco:** il preload carica un file JSON da `app.getPath('userData')/salvataggi/` dentro `localStorage` **prima** che parta il gioco, e il processo principale riscrive il file quando i dati cambiano (ogni pochi secondi e alla chiusura). Tenere una copia di riserva (`.bak`) alla scrittura.
- Verifica: giocare, chiudere, cancellare la cache di Electron, riaprire: la partita c'è ancora. Il pulsante RIAVVIA del gioco (cancella `nightrun-viaggio`) deve cancellare anche il file.
- Se un file è corrotto: partire con la copia, e se manca anche quella, partire da zero senza errori.

### 4. Costruire l'eseguibile
- `electron-builder` per Windows: installatore NSIS e versione portatile. **Senza firma digitale** (Windows mostrerà "app non riconosciuta": normale, va indicato nel LEGGIMI come procedere con "Esegui comunque").
- Comandi nel LEGGIMI: `cd desktop && npm install && npm start` (prova) e `npm run dist` (eseguibile in `desktop/dist/`).

### 5. Prova sul PC e rapporto
Controllare e scrivere in `desktop/RAPPORTO.md` (passa / non passa e come):
1. si avvia con la rete scollegata; vista 3D e caratteri corretti;
2. il motore suona: `I` poi `Invio` per accendere, poi marcia automatica (vedere `AGENTS.md`, sezione "Come provare");
3. Tab apre il menu, Esc lo chiude, il telefono (tasto 0) si apre;
4. i salvataggi sopravvivono alla chiusura e alla cancellazione della cache; RIAVVIA li azzera;
5. F5 e Ctrl+W non fanno niente, F11 funziona;
6. fotogrammi al secondo a schermo intero rispetto a Chrome (anche solo "uguale / peggio / meglio");
7. peso dell'installatore e dell'eseguibile portatile.

## Cosa NON fare
Niente Steamworks, niente Tauri, niente riscrittura in Godot o altri motori, niente modifiche a `chat_dati.js`, alla storia o alla fisica, niente firma a pagamento, niente aggiornamenti automatici. Il passo "Steam" del piano è un lavoro successivo.

## Cosa consegnare
- Ramo `desktop` con: `vendor/` (caratteri e three.js), `index.html` e `sw.js` ritoccati, cartella `desktop/` completa, `.gitignore` aggiornato.
- `desktop/LEGGIMI.md` (come provare e come costruire, in italiano semplice) e `desktop/RAPPORTO.md` (§5).
- Elenco di quello che non ha funzionato o è stato aggirato. Chi riceve il ramo (Claude) lo rivede, fa girare i test e lo unisce a `main` solo dopo l'ok del proprietario.

## Decisioni (risposte alle domande di Codex del 20/11/2026)

Le proposte di Codex sono accettate, con queste precisazioni. Le decisioni di prodotto restano quelle del proprietario: se qualcosa non ti torna, chiedi.

1. **RIAVVIA.** Si rispetta esattamente quello che fa il gioco (`riavvia.js`): cancella la chiave `nightrun-viaggio` e **riscrive** `banco2jz` (pezzi montati azzerati), poi ricarica; volume, vista, tasti (`nr_tasti`) e personaggio (`nr_pg`) restano. Quindi il JSON si riscrive **senza le chiavi cancellate** e con quelle modificate com'erano. Il file non si elimina mai: se non resta niente si scrive `{}`. Anche la copia `.bak` va riallineata subito (stessa scrittura), così un recupero non fa ricomparire una partita azzerata.
2. **Dati e precedenza.** Si conservano **tutte** le chiavi `localStorage` dell'origine dedicata al gioco. Con un JSON valido, il JSON è autorevole (anche per le chiavi assenti). JSON corrotto: si usa il `.bak` valido; se non c'è nemmeno quello, si parte da zero senza errori. **Se il JSON manca** ma esistono dati locali: si recuperano (prima migrazione) e si scrive subito il JSON; da lì in poi il file esiste sempre, quindi una cancellazione intenzionale (RIAVVIA) non può essere annullata da questa regola.
3. **Installatore e portatile.** Stesso identificativo applicazione e stessa cartella `userData`: entrambe leggono la stessa partita sullo stesso account Windows. Nel LEGGIMI: «portatile» vuol dire «senza installazione», i salvataggi restano nel profilo Windows. Usare `app.requestSingleInstanceLock()` per non aprire due copie insieme e non avere scritture concorrenti.
4. **«Cancellare la cache» nella prova.** Si eliminano solo i dati web di Electron (Local Storage, IndexedDB, Cache, Service Worker, ecc.) e si **preserva** `salvataggi/`. Documentare nel rapporto cosa è stato rimosso. Provare anche il caso opposto: cancellare `salvataggi/` e lasciare i dati web (deve valere il punto 2, recupero dei dati locali).
5. **Riferimento dei test.** Partire da `main` aggiornato e riportare il commit usato. Oggi `main` (`a7375df`) ha **229 test**, tutti verdi. Il test intermittente è in `test/polizia.test.js`: *«polizia: autovelox e Tutor sono pochi, a volte con tratti liberi di 7-12 km, e il verbale arriva dopo»*, con errore noto `tratti liberi ogni tanto: 0.17…` (usa `Math.random`: capita raramente nella suite completa, mai da solo nelle prove). Se fallisce solo quello con quel messaggio, rilanciarlo una volta e riportare **sia il primo esito sia la ripetizione**; qualsiasi altro fallimento è un problema vero e va indagato.
