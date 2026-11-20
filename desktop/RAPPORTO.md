# Night Run Electron — rapporto del 20/11/2026

Base: `main`, commit `a7375df032cc5ac7c653f4f5a01e9fc2bfb57818`. Ramo di consegna: `desktop`. `main` non viene modificato o unito da questo lavoro.

Richiesta applicata: file fornito dal proprietario, comprese le cinque decisioni sui salvataggi. **Una discrepanza nel testo:** in questo commit il proprietario aveva già eliminato il 3D e three.js, come documentato in `AGENTS.md`. Si conserva il gioco 2D corrente; il controllo «vista 3D» non è applicabile. Nessuna libreria 3D o modalità rimossa viene reintrodotta.

## Modifiche

- `index.html`: sostituite soltanto le tre righe Google Fonts con il collegamento a `vendor/fonts/fonts.css`. Tutto il resto del file è invariato.
- `vendor/fonts/`: 30 file WOFF2, stessi sette caratteri, pesi e stili richiesti dal collegamento originale; sette licenze ufficiali, URL delle fonti e SHA-256 in `FONTI.md`.
- `sw.js`: versione `nr-2-font-locali`, caratteri locali tra le risorse conservate, rimossi i riferimenti al CDN di three.js ormai inutilizzato.
- `desktop/`: Electron, preload isolato e sandbox, protocollo locale sicuro, salvataggi, copia delle risorse, build NSIS/portatile, istruzioni e prove ripetibili.
- `.gitignore`: dipendenze, copia generata del gioco, distribuzioni, cache e risultati delle prove esclusi da git.

Nessuna modifica a fisica, storia, logica di gioco, audio, personaggio, comandi o `LICENZE.md`. Nessun pacchetto npm alla radice. L'icona è quella già presente in `img/app/icona-512.png`.

## Verifiche richieste

1. **Avvio senza internet: PASSA con rete bloccata/emulata scollegata.** Profilo nuovo, risorse locali, font caricati e gioco 2D visibile. Ricarica con `session.enableNetworkEmulation({ offline: true })`: recuperati pagina, font e un file audio completo. Il guscio blocca le richieste HTTP/HTTPS esterne; nelle prove funzionali non ne sono state emesse. Non è stato scollegato fisicamente l'adattatore di rete del PC.
2. **Motore: PASSA la verifica funzionale e del segnale.** Premuti I e Invio tenuto, motore acceso, leva D, acceleratore e movimento: circa 13 km/h nella prova breve. AudioContext in stato `running`, AudioWorklet senza avviso di ripiego, uscita a 48 kHz con RMS circa 0,19. **Ascolto fisico tramite casse/cuffie non verificato.**
3. **Menu/telefono: PASSA.** Tab apre il menu, Esc lo chiude mantenendo lo schermo intero, 0 apre e chiude il telefono.
4. **Persistenza e RIAVVIA: PASSA.** Chiusa subito la finestra dopo una modifica alla partita, senza attendere il timer e senza chiamare il comando Salva: al riavvio soldi e chiavi arbitrarie conservati. Cancellati i dati web tramite `clearStorageData()` e la cache HTTP tramite `clearCache()` preservando `salvataggi/`: partita recuperata dal JSON. Provato anche il caso inverso, eliminando i due JSON di prova e preservando la memoria web: migrazione immediata. JSON valido autorevole anche per le chiavi assenti; primario corrotto recuperato dal backup; entrambi corrotti danno una nuova partita. RIAVVIA premuto dalla vera interfaccia: soldi azzerati alla nuova partita (€ 450), personaggio, tasti e volume preservati; corrompere poi il primario non fa riapparire il viaggio precedente. File e backup riallineati.
5. **Tasti del guscio: PASSA.** Eventi nativi Electron per F5, Ctrl+R, Ctrl+Maiusc+R, Ctrl+W, Ctrl+Maiusc+I, F12 e Alt+Sinistra: nessuna ricarica/chiusura o DevTools. F11 entra ed esce dallo schermo intero. Backspace non naviga indietro. Secondo processo: termina e rimane una sola finestra.
6. **Prestazioni: SIMILI nella prova breve.** Electron 45.4.1 / Chromium 156.0.8078.100, Chrome 157.0.8103.79. Stesso monitor a schermo intero, 3440×1440 pixel fisici, area 2085×873 CSS con scala 1,65; qualità alta, scena iniziale ferma, finestra in primo piano. Due campioni consecutivi di 5 secondi: Electron **58,7 / 70,3 fps**, Chrome **61,7 / 70,1 fps**. Intervallo mediano **16,7 / 16,6 ms** per entrambi; p95 Electron **22,3 / 16,8 ms**, Chrome **22,2 / 16,7 ms**. Si misurano i callback `requestAnimationFrame`: è un confronto breve di fluidità, non una garanzia di prestazioni durante guida prolungata.
7. **Eseguibili: PASSA build e integrità.** Installatore `Night-Run-0.1.0-Installazione.exe`: **177.825.220 byte** (177,8 MB, 169,6 MiB). Portatile `Night-Run-0.1.0-Portatile.exe`: **166.945.665 byte** (166,9 MB, 159,2 MiB). Senza firma digitale. `7za t` su entrambi: uscita 0 e «Everything is Ok», con avviso sui dati successivi al flusso 7z nel contenitore NSIS. Avviati davvero il programma compilato in `win-unpacked/` e il portatile finale: titolo, origine sicura, gioco e font corretti. Entrambi leggono `%APPDATA%\night-run`; la prova ha creato lì una nuova partita predefinita, non essendoci un profilo precedente. **Installazione/disinstallazione mediante la procedura NSIS non eseguite.**

## Test e controllo del sito

- `node --test test/*.test.js` prima delle modifiche: **229 passati, 0 falliti**; dopo le modifiche: **229 passati, 0 falliti**. Il caso intermittente della polizia non ha fallito e non è stato necessario ripeterlo.
- Da `desktop/`, `npm test`: **8 passati, 0 falliti**, su file reali, migrazione, recupero, backup dopo RIAVVIA, stato `{}`, valori non validi e filesystem in errore.
- Da `desktop/`, `npm run test:integrazione`: **14 verifiche passate**, programma vero e profilo separato. Risultati JSON e immagini nella cartella ignorata `desktop/risultati-prove/`. Il copione aspetta che la domanda sul cambio sia terminata prima di provare il movimento.
- Sito avviato con `python -m http.server 8765 --bind 127.0.0.1`: Chrome prima e dopo, schermata iniziale e gioco esaminati nelle immagini. Dopo: connessioni esterne bloccate, nessun errore JavaScript, richiesta fallita o risorsa mancante. Le schermate del titolo mantengono impaginazione e caratteri.
- Copione originale `strumenti/prova.js` anche in formato mobile 390×844, con il Chrome installato selezionato da un precaricamento esterno al repository: nessun errore o 404; esaminate immagini con e senza avviso di orientamento.
- `git diff --cached --check` sul codice e sui documenti propri: nessun errore. Sui testi originali delle licenze OFL compaiono sei segnalazioni di spazio finale già presente nelle fonti: mantenuti i testi ricevuti. Dipendenze, file compilati e copia `app/` risultano ignorati da git.

## Scelte e limiti da sapere

- `app://night-run` evita porte locali e mantiene un'origine stabile. Il service worker del gioco non viene registrato su questo schema dalle condizioni già esistenti: il desktop carica tutto dal pacchetto. Sul sito resta il service worker aggiornato.
- Preload con `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`; nessuna API Node esposta al gioco. Il guscio aggiunge una CSP alle risposte HTML, permettendo gli script/stili in linea già presenti e le risorse locali/Blob necessarie all'audio. CSP verificata anche durante la prova senza rete.
- Backup dello stato corrente, come deciso: non è una cronologia di partite. Ciascun file viene scritto tramite temporaneo, `fsync` e rinomina. I due file vengono aggiornati in sequenza: non costituiscono una transazione atomica unica tra file in caso di interruzione di corrente nel mezzo delle due sostituzioni.
- Il gioco salva periodicamente in localStorage e il preload rispecchia su file ogni due secondi; alla chiusura si intercetta anche `pagehide` dopo il salvataggio del gioco. Arresto forzato o perdita di alimentazione possono perdere gli ultimi secondi.
- I campioni importati dall'utente in IndexedDB non sono inclusi nel JSON di localStorage. La cancellazione dei dati web rimuove quei campioni; le risorse audio distribuite col gioco restano nel pacchetto.
- Nelle prove di sviluppo compaiono avvisi Canvas2D sulle letture dei pixel. Il copione, che include il passaggio intenzionale ad `about:blank` per svuotare lo storage, registra anche un avviso CSP di Electron: la sua origine esatta non è stata isolata; la presenza dell'header CSP sulla pagina del gioco è stata verificata direttamente. Nessun errore funzionale corrispondente rilevato.
- Nell'ambiente di lavoro mancava npm nel PATH: usato npm 12.2.3 scaricato separatamente sotto `work/tools`, con PATH impostato soltanto per la build. Nessuna installazione globale o modifica permanente al PATH. Su una normale installazione Node con npm valgono i comandi del LEGGIMI. Pacchetti bloccati dal lockfile.
- Restano da fare ascolto sul dispositivo audio del proprietario, guida prolungata e prova completa di installazione/disinstallazione. Nessun risultato viene attribuito a queste prove non eseguite.

## SHA-256 degli eseguibili consegnati

```text
98ee5de688d85a4ef58e9318d8962c3c9f23c972507020bad4b0ce9bf1b1d11e  Night-Run-0.1.0-Installazione.exe
0bab8d96771b137441fda9e40cbc32fc15589ce0311061d43bc0189c522a6618  Night-Run-0.1.0-Portatile.exe
```

Claude può rivedere il ramo `desktop` e ripetere i comandi di verifica. L'unione in `main` resta subordinata all'ok del proprietario, come richiesto.
