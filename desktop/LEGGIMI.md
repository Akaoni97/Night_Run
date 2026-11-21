# Night Run per Windows

Il gioco corrente, con la stessa grafica 2D del sito, dentro una finestra a schermo intero. Funziona senza internet. Il 3D e three.js sono stati rimossi da `main` prima di questo lavoro e non vengono reintrodotti.

## Provare e costruire

Serve Node 22.12 o successivo con npm. La prima installazione delle dipendenze e la prima build richiedono internet.

Apri un terminale nella cartella del repository:

```powershell
cd desktop
npm install
npm start
```

Per creare installatore e versione portatile Windows x64:

```powershell
npm run dist
```

I due `.exe` finiscono in `desktop/dist/`. Sono senza firma digitale: se SmartScreen mostra «app non riconosciuta», per la copia ricevuta dal proprietario scegli «Ulteriori informazioni» e «Esegui comunque».

La build genera `desktop/app/` copiando le risorse dalla radice: non modificare quella copia. `node_modules/`, `app/` e `dist/` non si caricano su GitHub. Tutte le dipendenze npm restano qui in `desktop/`; il sito continua a funzionare senza npm.

## Comandi

- **F11** entra ed esce dallo schermo intero. **Alt+F4** chiude il programma.
- **Tab**, **Esc**, **0** e i comandi dell'auto restano quelli del gioco.
- F5, Ctrl+R, Ctrl+W e le scorciatoie degli strumenti del browser sono bloccati. Backspace resta utilizzabile nei campi di testo, senza navigazione indietro.
- Per sviluppare: `npm start -- --dev`. Solo con `--dev` sono abilitati gli strumenti di sviluppo.

## Aggiornare il programma installato

**Per chi gioca:** apri il gioco, premi **Tab** (menu), scheda **Partita**, in fondo il riquadro **Aggiornamenti**.
1. **Cerca aggiornamenti**: dice «Sei aggiornato», «Nessuna versione pubblicata», «Connessione non disponibile» oppure mostra la versione nuova con data e novità.
2. **Scarica**: puoi continuare a giocare mentre scarica (c'è la barra).
3. **Installa e riavvia** (o **Più tardi**): il gioco salva la partita su file, ne fa una copia a parte, si chiude, installa e si riapre da solo.
Non controlla e non scarica niente da solo: tutto parte da un clic. Senza rete il pulsante dice che non c'è connessione e si gioca lo stesso.
La versione che stai usando è scritta sopra il pulsante (per esempio `0.2.9 · gioco a8487cd`: numero del programma e commit del gioco).
La copia **portatile** non si aggiorna da sola: il pulsante apre la pagina delle versioni per scaricare la copia nuova.

**Come escono le versioni** (`.github/workflows/desktop-release.yml`): a ogni caricamento su `main` che tocca il gioco o `desktop/` GitHub fa i test,
costruisce installatore e portatile su Windows **sullo stesso commit** e pubblica una release `v0.2.N` (prima come bozza, resa pubblica solo a file
tutti caricati). Se i test o la build falliscono non esce niente e chi ha il gioco resta sulla versione di prima. Si può far partire anche a mano
da GitHub, scheda Actions, «Windows release», «Run workflow» (solo da `main`). Le sole note (file `.md`) non producono una versione.
Dopo il caricamento servono alcuni minuti: il pulsante vede l'**ultima release pubblicata**, non l'ultimo commit.

**Numeri di versione:** il programma ha una versione sua, `0.2.N` (SemVer, N sempre crescente: lo decide il workflow guardando le release già
uscite), diversa da quella «editoriale» di `VERSIONI.md` (v0.64...). Il commit sorgente è nella release e nel pulsante. Anche una modifica
al solo guscio produce un numero nuovo. Il numero in `package.json` (0.2.0) vale solo per le build fatte a mano sul PC.

**Primo passaggio, una volta sola:** il programma già installato sul PC non ha l'aggiornamento dentro. Bisogna installare **una** volta una
versione con l'updater: la prima release che esce dal workflow (o `npm run dist` a mano). Da quella in poi si aggiorna dal pulsante.
L'installazione sopra la vecchia mantiene programma, percorso e salvataggi (`%APPDATA%\night-run`).

**Se qualcosa va storto:** la versione in uso non viene toccata finché il download non è completo e controllato (la libreria rifiuta un file
incompleto o manomesso). Prima di installare viene scritto un **checkpoint** `checkpoint-<versione>.json` accanto ai salvataggi (restano gli
ultimi tre, non si ripristinano da soli). Se l'installazione non riesce, riscarica l'installatore dalla pagina delle release e installalo sopra: i salvataggi restano.
Senza firma digitale Windows può mostrare SmartScreen anche per l'aggiornamento: non si aggira, si sceglie «Esegui comunque».

**Nome dell'installatore:** questo è l'**installatore Luca** (`Night-Run-Luca-<versione>-Installazione.exe` e `...-Portatile.exe`), per distinguerlo da quello di Nico. Se un domani si cambia o si aggiunge un installatore, **prima si chiede quale sovrascrivere**: non si decide da soli. Attenzione: programma installato, `appId` e cartella dei salvataggi (`%APPDATA%\\night-run`) sono ancora quelli di sempre, quindi un installatore di Nico con gli stessi valori installato sullo stesso PC prende il posto di questo.

**Per chi sviluppa:** `desktop/aggiorna.js` (logica, provata in `test/aggiorna.test.js` senza Electron), `main.js` (IPC solo da `app://night-run/index.html`),
`preload.js` (ponte `window.nightUpdate`: stato, controlla, scarica, installa, apriPagina, onStato), `aggiorna_ui.js` nella radice (il riquadro, assente nel browser),
`info-build.js` (scrive `info-build.json` con commit e data). Libreria: `electron-updater` 6.8.12 (provider GitHub, non l'`autoUpdater` interno di Electron).

## Salvataggi

Si trovano in `%APPDATA%\night-run\salvataggi\localStorage.json`, con copia `localStorage.json.bak`. Installatore e portatile usano la stessa cartella e la stessa partita sul medesimo account Windows. «Portatile» significa «senza installazione»: i salvataggi restano nel profilo Windows. Una seconda apertura riporta in primo piano la finestra esistente.

Il preload isolato ripristina tutte le chiavi prima degli script del gioco. Il JSON valido prevale sui dati web, anche per le chiavi assenti. Ogni due secondi e all'uscita si rispecchia lo stato su disco, con file temporaneo e sostituzione atomica di ciascun file. Il backup conserva lo stesso stato corrente: una partita cancellata non deve tornare dal backup. In caso di arresto forzato possono andare persi gli ultimi secondi non ancora salvati dal gioco o dal preload.

RIAVVIA segue le regole del gioco: azzera il viaggio e i pezzi montati, preserva volume, comandi e personaggio. Anche il backup viene aggiornato durante la ricarica. Lo stato completamente vuoto viene scritto come `{}`; i file non vengono eliminati da RIAVVIA.

JSON corrotto: si recupera il backup valido. Entrambi corrotti: si riparte da zero. JSON mancante: si importano subito i dati locali ancora presenti. Per azzerare manualmente ogni dato occorre quindi rimuovere sia i salvataggi sia i dati web, a programma chiuso. Prima di operazioni manuali conserva una copia della cartella.

I campioni audio importati dall'utente in IndexedDB restano dati web; non sono inclusi nel backup JSON di localStorage.

## Come viene caricato il gioco

Si usa lo schema standard e sicuro `app://night-run/index.html`, registrato con `protocol.handle`. Mantiene un'origine stabile e supporta fetch, font, audio e AudioWorklet. Non apre porte di rete. Il processo principale serve soltanto file sotto la copia `app/`; il gioco non ha accesso a Node e il preload non gli espone API privilegiate. Le richieste a server esterni vengono bloccate.

Il service worker resta attivo per il sito HTTP/HTTPS. Il gioco attuale non lo registra sullo schema `app://`: nel programma le risorse sono già tutte locali e il funzionamento senza rete non dipende da una cache precedente.

Riferimenti tecnici: [protocollo Electron](https://www.electronjs.org/docs/latest/api/protocol/), [isolamento dei contesti](https://www.electronjs.org/docs/latest/tutorial/context-isolation/).

## Verifiche ripetibili

Dalla radice: `node --test test/*.test.js`.

Da `desktop/`:

```powershell
npm test
npm run test:integrazione
```

La seconda prova apre e chiude finestre reali, usa un profilo separato sotto `desktop/risultati-prove/` e verifica salvataggi, recupero e RIAVVIA. Non tocca le partite normali. Conserva lì rapporto JSON e immagini. Per l'ascolto sul PC e il confronto delle prestazioni, vedi `RAPPORTO.md`.
