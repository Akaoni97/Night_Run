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
