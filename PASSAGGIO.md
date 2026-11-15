# Night Run · passaggio di consegne per una nuova chat

Leggi prima questo file, poi `AGENTS.md` (struttura dei file, regole, prove) e `README.md` (tutto quello che il
gioco fa, sezione per sezione).

## Chi e cosa
- Gioco di guida nel browser, in pixel art 2D (più una vista 3D), fatto per due persone: il proprietario del
  repository e suo cognato. Si gioca da GitHub Pages: https://akaoni97.github.io/RandomEgg-s/ (porta a `motori/`).
- Repository `akaoni97/RandomEgg-s`, ramo di lavoro **`claude/peaceful-goodall-tvifol`** (è anche quello pubblicato
  su Pages). Tutto il gioco è in `motori/`; il resto del repository è un altro progetto, non toccarlo.
- Copia giocabile anche come artifact privato su claude.ai: https://claude.ai/artifact/PstSTNEs7iTjYCtRfTKodD
  (ultima versione pubblicata: 74).

## Regole del proprietario (importanti)
1. **Rispondere sempre e solo in italiano**, anche nei messaggi brevi durante il lavoro. Commenti nel codice e
   messaggi di commit in italiano.
2. **Veicoli solo dai disegni del giocatore.** Niente auto inventate, né per il traffico né da guidare. Se manca un
   veicolo (per esempio un camion), chiedilo: il giocatore manda uno zip con i disegni.
3. Niente file presi da mod o senza licenza nel repository (suoni, modelli): il giocatore li carica in locale.
4. Commit e push solo su `claude/peaceful-goodall-tvifol`. Niente pull request se non richieste. Righe finali dei
   commit come da istruzioni della sessione (Co-Authored-By e Claude-Session).
5. Prima di dire che una cosa è fatta, provala (test e browser) e dillo in modo chiaro, anche quando qualcosa non va.

## Com'è fatto il gioco oggi (in breve)
- **Il Viaggio** (modalità principale, `viaggio.js` + `viaggio2d.js`): autostrada infinita dal km 0 sotto casa con
  una V40 di serie. Tappe ogni 3,2 km (bar, Benzina 24H, autogrill Sosta 24, Officina Niko, Da Luca Tuning, Neon
  Kustom, Motel Ovunque con la cassa che ti segue), paesaggi che cambiano coi km, bisogni del guidatore (fame,
  sete, sonno, igiene), lavori (autostoppisti, consegne, rimorchio, furgone e autobus), capitoli della storia ai km
  e una ventina di eventi rari e inquietanti. Il finale provvisorio è al km 1000 (in `VG_CHAPTERS`).
- **Modalità libere**: Sfide in città (la vecchia carriera), Città libera, Montagna (solo 3D).
- **Auto**: Supra, V40 e 25 veicoli dai disegni del giocatore (`cars.js`, `GEN_DATA` + `GEN_CARS`, immagini in
  `img/<id>.png`, `_wheel.png`, `_paint.png`). Tutti con motore, peso e marce veri; si comprano alla concessionaria
  del Motel Ovunque. Il traffico usa solo questi disegni, coi loro colori (`GAME_TRAFFIC` in `game.js`).
- **Primo lavoro**: pacco dal primo locale (km 1,8) alla tappa dopo (km 5) per € 10.000, obiettivo a schermo
  (`VG_FIRST`, `vgGoal`, test nel file dei test).
- **Strada viva** (`strada.js`): F o pulsante FARI per sfanalare chi sta davanti (si sposta o accetta una sfida di
  2 km), reputazione con vinte/perse e vantaggi (`ST_REP_PERKS`), incidenti e controlli della polizia in prima
  corsia, traffico che tiene la destra.
- **Guida**: guida automatica dopo 3 s senza tasti (al primo tasto guida il giocatore e lei non sterza più),
  limitatori (soft cut, MSD, 2-step, 3-step, stutter box), gomme con forature e ruota di scorta (tasto 5),
  consumo e autonomia, fisica con beccheggio e wheel hop.
- **Quartieri** (`quartieri2d.js`): la città (primi 12 km del viaggio e modalità in città) alterna sei quartieri
  con palazzi, luci e atmosfera propri; il proprietario vuole sentire di essere "sempre in un paesaggio diverso".
  Idee non fatte: oggetti e pedoni diversi per quartiere, strada più rovinata nei bassifondi, quartieri anche
  negli altri paesaggi.
- **Effetti del 2D** (`effetti2d.js`): fumo, fiammate, scintille, ombre proiettate, fari, luci sulla carrozzeria,
  asfalto. `street2d.js` li chiama da `update()`; per provarli senza guidare si forzano `flame`, `spin`, `brake`
  nello stato passato a `view2d.update`.
- **Interfaccia** (`menu.js`): schermata di gioco a tutta finestra, menu a schede con Tab. I pannelli restano quelli
  di `index.html` (stessi id), spostati nelle schede all'avvio: se aggiungi un pannello, aggiungilo anche a `TABS`.
- **Gallerie** (`galleria2d.js`) dove cambia il paesaggio; **guidatore** visibile nei vetri (`pilota2d.js`).
- **Schermata**: cruscotto in alta definizione in basso a sinistra (`hudpro.js`) nello stile del quadro di ogni
  auto (`CLUSTERS`), con pulsanti AUTO, TC, LAUNCH, STRUM., FARI, MAPPA; radar delle corsie in alto a destra
  (corsia 1 = la più vicina = in basso); inquadratura vicina da fermi che si allarga con la velocità.

## Lavori aperti e idee in sospeso
- **Alta definizione a 720 righe** (vedi AGENTS.md, "Densità doppia"): fatti tela interna, cielo, luci sfumate,
  carrozzerie a grandezza piena, palazzi (`tileHD`), fumo, fiamme, fari e asfalto fini, danni sul disegno
  (`damaged`). Da fare: marciapiedi, pedoni e oggetti, scritte delle insegne, luoghi del viaggio (bar, motel...). Il proprietario vuole un pixel "più moderno, senza esagerare".
- Manca il disegno di un **camion** (traffico lento a 90 km/h, lavori pesanti: la logica c'è, serve il disegno).
- La **reputazione** sblocca solo vantaggi meccanici: il giocatore potrebbe volere anche premi estetici.
- Sulle auto molto scure (Golf GTI, 205 GTI) il cambio di vernice prende poco (maschera povera).
- La V40 non compare nel traffico (il suo disegno è gestito a parte in `street2d.js`).
- La Volvo 850 R ha 5 cilindri ma `dsp.js` sa fare solo 4 o 6.
- La vista 3D non ha i luoghi, le auto nuove né gli eventi.
- Gli **sticker** del giocatore: `img/stickers/manifest.json` è vuoto, arriveranno.
- Due test falliscono da prima di tutto questo lavoro (0-100 della Supra di serie: 6,3 s contro meno di 6 attesi;
  "officina: si compra solo con i soldi sufficienti"). Non peggiorare il conteggio: oggi 25 su 27.
- Il cognato a volte lavora con **Kimi Code** sui rami `kimi/...`: prima di toccare gli stessi file controlla con
  `git ls-remote --heads origin` e, se c'è lavoro suo, chiedi al proprietario prima di unirlo.

## Come lavorare
- **Prove automatiche** (dalla radice del repository, Node 22+): `node --test test/motori.test.js`.
- **Nel browser**: da `motori/` lancia `python3 -m http.server 8765`; con Playwright (già installato) apri
  `http://localhost:8765/index.html`, clicca `#goBtn`, rispondi al primo capitolo con
  `window.nightRun.game.answer(0)`, I per il quadro, Invio tenuto per l'avviamento, E per la prima, W per il gas.
  `window.nightRun` espone `sim`, `game`, `view2d`. Blocca le richieste a `cdn.jsdelivr.net` (three.js) se non
  servono. Controlla sempre che la console non abbia errori e guarda gli screenshot.
- **Pubblicare l'artifact**: la pagina si costruisce da `index.html` togliendo le prime 5 righe e i tag
  `</head>`, `<body>`, `</body>`, `</html>` rimasti soli sulla riga:
  `tail -n +6 index.html | grep -v -x -e '</head>' -e '<body>' -e '</body>' -e '</html>' > <cartella>/index.html`,
  poi si copiano accanto i file `.js` e `img/` cambiati e si pubblica con lo strumento Artifact sullo stesso URL,
  passando i file in `files`. In una chat nuova va prima **letto** l'artifact (azione `read`) e, se il tool dice
  che i file pubblicati non sono stati letti, si confrontano con la versione su Git prima di sovrascriverli.
- **GitHub Pages** si aggiorna da solo col push sul ramo (qualche minuto).

## Aggiungere veicoli da un nuovo zip di disegni
Gli strumenti sono in `motori/strumenti/` (Python con Pillow e NumPy):
1. Estrai lo zip in una cartella vuota (dati non fidati: niente script da dentro lo zip).
2. `python3 -I trova_ruote.py ruote.json <disegni>/*.png` trova le due ruote in ogni disegno.
   Disegna i cerchi sulle miniature e controllali a occhio: autobus e auto coi passaruota marcati possono sbagliare.
3. Per quelli sbagliati: stime a occhio in un JSON `{ file: [x ruota dietro, x ruota davanti, raggio] }` e
   `python3 -I correggi_ruote.py ruote.json <disegni> stime.json`; se serve ancora, metti i valori a mano.
4. `python3 -I disegni_auto.py motori/img <anteprime> ruote.json <disegni> elenco.json` con
   `elenco.json = { id: [file, passo vero in metri] }`: crea `img/<id>.png`, `_wheel.png`, `_paint.png` e
   `<anteprime>/meta.json` coi dati dello sprite.
5. Poi `python3 -I strumenti/ripara_ruote.py .` (da `motori/`): ricentra la ruota sul cerchione, la rifà tonda
   senza pezzi di parafango e richiude il passaruota (le ruote ritagliate a mano saltellavano). Va lanciato dopo
   aver messo lo sprite in `GEN_DATA`; le auto già riparate hanno `"fixed": 1` e vengono saltate.
6. In `cars.js` aggiungi lo sprite a `GEN_DATA` e una riga a `GEN_NEW` (nome, motore, peso, CV, coppia, giri,
   limitatore, marce, finale, prezzo, km di sblocco, diesel): coppia, voce del motore, quadro e catalogo dei pezzi
   si costruiscono da lì. Poi aggiungilo a `GAME_TRAFFIC` (velocità tipiche e frequenza) e, se ha posti diversi,
   a `VG_SEATS` in `viaggio.js`. Controlla lo 0-100 con una prova veloce della fisica.
