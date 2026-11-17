# Night Run · limiti e possibilità (per chi aggiunge funzioni)

Questo file dice su cosa gira il gioco, fin dove ci si può spingere e cosa non si deve fare. Si legge dopo
`AGENTS.md` (mappa dei file e regole) e `PASSAGGIO.md` (stato del lavoro). Se qualcosa qui contraddice `AGENTS.md`,
vale `AGENTS.md`.

## 1. Su cosa gira
- **Solo il browser, solo file statici.** Il gioco si pubblica su GitHub Pages dal ramo `main`: non esiste un
  server, un database, un account, un login. Tutto quello che serve sta nei file del repository.
- **HTML + JavaScript puro.** Niente build, niente npm, niente framework, niente TypeScript, niente bundler.
  Una dipendenza esterna sola: three.js 0.147 da CDN (vista 3D). Aggiungere una libreria nuova non è previsto: se
  pensi che serva davvero, proponilo prima, non metterla.
- **Gli script sono globali.** `index.html` li carica uno dopo l'altro con `<script src>` e le costanti di un file
  si usano dagli altri (`CARS`, `GAME_LOCS`, `VG`...). Niente `import`/`export` nel gioco. Un file nuovo va
  aggiunto in fondo alla lista in `index.html` e **dopo** i file da cui dipende.
- **Salvataggio nel browser.** La partita sta in `localStorage` (chiave `nightrun`, più `nightrun-viaggio` e
  `banco2jz` per le impostazioni); i campioni audio caricati dall'utente stanno in IndexedDB. Non c'è salvataggio
  online né condiviso tra dispositivi. Ogni lettura e scrittura è già in `try/catch`: fai lo stesso.
- **Vecchi salvataggi.** Un giocatore può avere una partita salvata con la struttura di prima. Ogni campo nuovo
  di `game.s` deve avere un valore di default e il codice deve funzionare anche se il campo manca. Non
  rinominare e non togliere campi esistenti senza gestire i salvataggi vecchi.
- **Giocatori:** due persone (il proprietario e suo cognato), su computer e su telefono. Quindi ogni cosa vista o
  premuta deve funzionare anche col tocco, senza tastiera.

## 2. Cosa si può fare senza chiedere
- Nuovi testi, messaggi, pensieri, eventi, traguardi, premi, prezzi, missioni, tappe: sono dati in tabelle
  (`TEL_SMS`, `PENS_KM`, `TRG_LIST`, `VG_MISSIONS`, `VG_CHAPTERS`...). Sono i punti dove è più facile e più sicuro
  lavorare.
- Nuove app del telefono, nuovi locali o tappe del Viaggio, nuove sezioni dei pannelli: segui la skill
  `night-run-funzione` (file nuovo agganciato a `StreetGame` e `Street2D`, stato in `game.s`, test, documentazione).
- Nuovi effetti 2D (luci, fumo, scintille, scossa dell'inquadratura) dentro `Street2D`, nello stile esistente.
- Nuovi suoni sintetizzati con `dsp.js` (lo strumento `strumenti/ascolta.mjs` li registra e li misura senza
  browser).
- Correzioni di bug, test nuovi, documentazione.

## 3. Cosa richiede un accordo prima (proponi, non fare)
- **La storia.** La scrive il cognato. Non inventare trama, nomi, battute, personaggi, finali, segreti. Puoi
  costruire gli attacchi tecnici (strutture, formati, test) e metterci testi segnaposto dichiarati come tali.
- **Veicoli e disegni.** Le auto vengono solo dai disegni del proprietario (PNG in `img/`). Niente immagini
  generate dall'IA senza che il proprietario lo chieda.
- **Cambi di fisica o di suono** che alterano Supra e V40: i parametri nuovi devono avere un default che le lascia
  com'erano.
- **Rimettere cose tolte.** Le gare clandestine (sfide al semaforo, scala dei rivali, sfide con gli abbaglianti,
  reputazione di strada) e le vecchie storie sono state eliminate di proposito.
- **Riscritture grosse** di un file intero o spostamenti di codice tra file senza che servano.

## 4. Cosa non si fa mai
- Niente file presi da mod di giochi o senza licenza (suoni, modelli, immagini) e niente grafica, nomi o
  personaggi copiati da giochi esistenti. I file personali dell'utente si caricano solo in locale nel browser.
- Niente lavoro diretto su `main`: ramo tuo e pull request, che il proprietario approva.
- Niente chiamate di rete a servizi esterni (analytics, API, font, immagini da altri siti). Il gioco deve
  funzionare offline, a parte three.js dal CDN.
- Niente dati personali nel repository o nelle richieste a servizi esterni.

## 5. Limiti tecnici da rispettare
- **Il frame è prezioso.** La grafica 2D ridisegna tutto ogni fotogramma. Il gioco ha già una modalità lenta
  (`Street2D.slow`, `SS`) che abbassa la risoluzione se il dispositivo non regge. Non aggiungere lavoro pesante per
  fotogramma (cicli enormi, creazione di tele nuove, `getImageData` continui): prepara in anticipo (cache) e
  disegna solo quello che serve.
- **Canvas a 360 righe logiche** (720 con qualità alta). Le coordinate di disegno restano quelle a 360: ogni
  unità vale 2×2 pixel veri. Strada tra y 236 e 336, 30 px per metro. Niente `g.setTransform` diretto sulla tela
  (usa `this.tf`), carrozzerie con `this.body`. Dettagli in `night-run-pixel`.
- **Testi a pixel sulla strada solo in maiuscolo ASCII** (`PX_FONT`). Nei pannelli HTML e nel telefono i testi
  sono normali, con gli accenti giusti.
- **Il caso.** Per ciò che deve restare fermo (stesso palazzo, stessa insegna) usa `Street2D.rnd(n)`, non
  `Math.random`. `Math.random` va bene solo per ciò che deve cambiare ogni volta.
- **Fisica a passo 1/4000 s** (`sim.js`) e audio in un AudioWorklet: sono il cuore del gioco. Non metterci
  dentro logica di contorno e non allungare il lavoro del passo.
- **Audio:** si parte solo dopo un gesto dell'utente (regola del browser). Il motore è sintetizzato; i file in
  `audio/` sono pochi e già scelti. Il repository non deve gonfiarsi: evita di aggiungere file grandi.
- **three.js 0.147 da CDN:** la vista 3D ha bisogno di internet al primo caricamento. Non usare funzioni di
  three.js più recenti di quella versione.
- **Schermi piccoli.** Layout che funziona in verticale e in orizzontale, pulsanti toccabili, niente `hover`
  indispensabile, niente lampi forti e ripetuti a schermo intero.
- **Il telefono del gioco** vive in Shadow DOM: gli stili della pagina non lo toccano e viceversa.

## 6. Come si lavora (riassunto)
- Prima leggi per intero i file coinvolti: un'auto, un pezzo o una funzione passano da più file.
- Modifiche mirate; commenti, testi del gioco e messaggi di commit in italiano.
- Se modifichi un file con uno script: leggi tutto, cambia in memoria, scrivi una volta sola.
- Prova: `node --test test/*.test.js` (Node 22+; oggi tutti passano, non peggiorare) e
  `node strumenti/prova.js ...` per guardare il gioco nel browser (anche `--mob` per il telefono).
  Ogni cosa che si vede va guardata con uno screenshot, non immaginata.
- I file con la logica da testare si caricano in Node senza browser: tieni la logica separata dal disegno e dal
  DOM, così i test restano possibili.
- Chiudi con un riassunto breve: cosa hai cambiato e dove, cosa hai provato, cosa non hai potuto provare.

## 7. Idee a portata di mano (da proporre, non da fare da soli)
- Attaccare la storia ai punti già pronti: capitoli ai km (`VG_CHAPTERS`), eventi strani (`VG_ODD`), passeggeri
  speciali (`VG_STORY_PAX`), messaggi e chiamate del telefono (`TEL_SMS`, `window.telefono.ring`), app che
  compaiono da sole, pensieri (`game.vgThink`).
- Sbloccare le altre 5 auto del garage del prologo (nomi e momenti da decidere con chi scrive la storia).
- Effetti horror piccoli e graduali: il bussare nel bagagliaio, la radio che non conosce le stazioni, lo
  specchietto, il sonno, la cassa del motel.
- Pulizia del codice morto rimasto dopo la rimozione delle gare (disegno 3D del coupé "rival", campo `s.rep`):
  si fa a fine lavoro, non adesso.
