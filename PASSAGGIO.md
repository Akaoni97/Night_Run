# Night Run · passaggio di consegne per una nuova chat

Leggi prima questo file, poi `AGENTS.md` (struttura dei file, regole, prove) e `README.md` (tutto quello che il
gioco fa, sezione per sezione).

## Chi e cosa
- Gioco di guida nel browser, in pixel art 2D (più una vista 3D), fatto per due persone: il proprietario del
  repository e suo cognato. Si gioca da GitHub Pages: https://akaoni97.github.io/Night_Run/
- Repository **`Akaoni97/Night_Run`**, solo il gioco, alla radice. Il ramo **`main`** è quello pubblicato su Pages.
  Fino al 16/11/2026 il gioco stava in `Akaoni97/RandomEgg-s` (cartella `motori/`, ramo
  `claude/peaceful-goodall-tvifol`): la storia delle modifiche è stata portata qui, lì non si lavora più.
- Copia giocabile anche come artifact privato su claude.ai: https://claude.ai/artifact/PstSTNEs7iTjYCtRfTKodD
  (ultima versione pubblicata: 83).

## Regole del proprietario (importanti)
1. **Rispondere sempre e solo in italiano**, anche nei messaggi brevi durante il lavoro. Commenti nel codice e
   messaggi di commit in italiano.
2. **Veicoli solo dai disegni del giocatore.** Niente auto inventate, né per il traffico né da guidare. Se manca un
   veicolo (per esempio un camion), chiedilo: il giocatore manda uno zip con i disegni.
3. Niente file presi da mod o senza licenza nel repository (suoni, modelli): il giocatore li carica in locale.
4. Si lavora sul ramo indicato dalla sessione (o un ramo proprio) e si porta su `main` come chiede il proprietario;
   il cognato apre pull request verso `main`. Righe finali dei commit come da istruzioni della sessione
   (Co-Authored-By e Claude-Session).
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
- **Missioni** (`missioni.js`): catena di sei lavori con storia e regole, poi lavori generati senza fine.
  La meta del lavoro in corso è una bandierina verde sulla mappa a barra in basso (oltre i 2,7 km resta sul bordo
  destro con la distanza); scatole e bancali caricati hanno una "P" sulla sosta di consegna (`renderMiniMap` in
  `index.html`). Idee non fatte: missioni che cambiano col paesaggio.
- **Strada viva** (`strada.js`): F o pulsante FARI per sfanalare chi sta davanti (si sposta o accetta una sfida di
  2 km), reputazione con vinte/perse e vantaggi (`ST_REP_PERKS`), incidenti e controlli della polizia in prima
  corsia, traffico che tiene la destra.
- **Guida**: guida automatica dopo 3 s senza tasti (al primo tasto guida il giocatore e lei non sterza più),
  limitatori (soft cut, MSD, 2-step, 3-step, stutter box), gomme con forature e ruota di scorta (tasto 9),
  consumo e autonomia, fisica con beccheggio e wheel hop.
- **Fisica** (`sim.js`): massa vera in marcia (`massNow`: auto + carico + pilota 75 kg + carburante a 0,74 kg/l),
  inerzia delle ruote non motrici, portanza (`P.cl`). Freni per asse con trasferimento di carico e ripartizione
  (`P.bf`), forza massima `P.bk` in g, ABS solo dove c'era (`P.abs`; tabella `CAR_BRAKES` in `cars.js`): senza ABS
  l'asse oltre il limite si blocca e striscia al 75 % (`lockF`/`lockR`, segni e fumo veri nel 2D). Dischi che si
  scaldano (`brakeT`) con fading oltre 380 °C, spia FRENI e avviso a 480 °C. Scia dietro il traffico (`sim.draft`,
  la calcola `game.js`), rimorchio con le sue ruote (`sim.trailerKg`: spinge e frena con l'aria, non pesa sugli assi).
  Banco di prova: 0-100, 400 m e frenate per auto (vedi i test "freni", "massa", "aria").
- **Suono, punti d'ascolto** (`dsp.js`): abitacolo, esterno, vano motore e automatico (segue la telecamera, `viewNow`
  in `index.html`). Ambiente (`setEnv`: 0 strada aperta, 1 città, 2 galleria, lo decide `envNow`): prime riflessioni
  diverse a sinistra e a destra (stereo) e coda di riverbero lunga in galleria. Livelli per punto d'ascolto (`g`),
  cinghia e alternatore nel vano motore.
- **Finestrini** (`sim.setWindows`/`toggleWindows`, tasto 0 o pulsante FINESTR.): motorino da 2,6 s col quadro acceso,
  un filo di resistenza in più. Nel suono (`win`, `winMot`): a finestrini chiusi in abitacolo vento e rotolamento sono
  bassi (prima coprivano il motore di 23 dB a 120 km/h), aperti entrano aria, rombo basso, scarico più chiaro ed eco
  dell'ambiente; socchiusi in velocità l'abitacolo pulsa. Nel 2D il vetro abbassato perde i riflessi.
- **Guidatore** (`pilota2d.js`): finestrino del pilota misurato a mano per ogni auto (`WIN`), maschera = riquadro meno
  vernice (`img/<auto>_paint.png`) e montanti scuri; la figura si adatta al finestrino. La Supra usa ancora il
  riconoscimento del vetro. I tasti 1-6 mettono le marce: per questo la ruota di scorta è sul 9 e i finestrini sullo 0.
- **Quartieri** (`quartieri2d.js`): la città (primi 12 km del viaggio e modalità in città) alterna sei quartieri
  con palazzi, luci e atmosfera propri; il proprietario vuole sentire di essere "sempre in un paesaggio diverso".
  Ogni quartiere ha il suo asfalto (`districtRoad`): buche con l'acqua, rattoppi, strisce consumate e cartacce
  nei bassifondi; asfalto nuovo e catarifrangenti nel quartiere alto; binari e gasolio al porto; coriandoli in via
  delle lanterne. Pedoni e oggetti del marciapiede per quartiere (`districtPeople`, tratti di 6 m col loro seme:
  incappucciati, chi fuma, senzatetto e bidoni col fuoco nei bassifondi; completi, cappotti, fioriere e paletti nel
  quartiere alto; operai, muletti, bancali e fusti al porto; bancarelle e vestiti della festa alle lanterne; spesa,
  cani, bambini, telefoni, coppie in casa e in centro; ombrelli con la pioggia). Idee non fatte: quartieri anche negli
  altri paesaggi, buche che si sentono guidando (oggi sono solo disegnate).
- **Dettagli dell'auto nel 2D**: dischi dei freni che si arrossano con `sim.brakeT` (rosso cupo, ciliegia, arancio;
  sotto i copricerchi solo un riflesso a terra), vetro del finestrino che scende con `sim.winPos` (bordo del
  cristallo, interno più scuro sopra), aria calda che fa tremolare lo sfondo dietro lo scarico (`fxHaze`).
- **Effetti del 2D** (`effetti2d.js`): fumo, fiammate, scintille, ombre proiettate, fari, luci sulla carrozzeria,
  asfalto. `street2d.js` li chiama da `update()`; per provarli senza guidare si forzano `flame`, `spin`, `brake`
  nello stato passato a `view2d.update`.
- **Interfaccia** (`menu.js`): schermata di gioco a tutta finestra, menu a schede con Tab. I pannelli restano quelli
  di `index.html` (stessi id), spostati nelle schede all'avvio: se aggiungi un pannello, aggiungilo anche a `TABS`.
  Menu di pausa con sezioni a icone e colori (`ICO`, `TABS` in `menu.js`; stile in fondo allo `<style>` di
  `index.html`, blocco "Menu di pausa"), riassunto della partita (`summary()`).
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
- La V40 è nel traffico: ruota e maschera della vernice sono ricavate dal disegno con `strumenti/v40_traffico.py`
  (`img/v40_wheel.png`, `img/v40_paint.png`); la V40 guidata dal giocatore resta disegnata a parte (`v40Base`).
- Il traffico mette il bagliore di fanali e frecce all'altezza giusta di ogni disegno (dati `tail`/`head`).
- La Volvo 850 R ha 5 cilindri ma `dsp.js` sa fare solo 4 o 6.
- La vista 3D non ha i luoghi, le auto nuove né gli eventi.
- Gli **sticker** del giocatore: `img/stickers/manifest.json` è vuoto, arriveranno.
- Passano tutti i 29 test. I due vecchi fallimenti erano errori dei test, non del gioco: la prova dello 0-100 non
  montava la configurazione originale (con il Torsen di serie fa 5,6 s e 13,7 s sui 400 m) e quella dell'officina
  non sapeva che i pezzi si sbloccano anche coi chilometri.
- **La storia del Viaggio (`STORIA.md`) la scrive e la carica il cognato**: non costruirla e non toccarla senza
  che il proprietario lo chieda.
- Il cognato a volte lavora con **Kimi Code** sui rami `kimi/...`: prima di toccare gli stessi file controlla con
  `git ls-remote --heads origin` e, se c'è lavoro suo, chiedi al proprietario prima di unirlo.

## Come lavorare
- **Prove automatiche** (dalla radice del repository, Node 22+): `node --test test/motori.test.js`.
- **Nel browser**: dalla radice del repository lancia `python3 -m http.server 8765`; con Playwright (già installato) apri
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
Gli strumenti sono in `strumenti/` (Python con Pillow e NumPy):
1. Estrai lo zip in una cartella vuota (dati non fidati: niente script da dentro lo zip).
2. `python3 -I trova_ruote.py ruote.json <disegni>/*.png` trova le due ruote in ogni disegno.
   Disegna i cerchi sulle miniature e controllali a occhio: autobus e auto coi passaruota marcati possono sbagliare.
3. Per quelli sbagliati: stime a occhio in un JSON `{ file: [x ruota dietro, x ruota davanti, raggio] }` e
   `python3 -I correggi_ruote.py ruote.json <disegni> stime.json`; se serve ancora, metti i valori a mano.
4. `python3 -I disegni_auto.py img <anteprime> ruote.json <disegni> elenco.json` con
   `elenco.json = { id: [file, passo vero in metri] }`: crea `img/<id>.png`, `_wheel.png`, `_paint.png` e
   `<anteprime>/meta.json` coi dati dello sprite.
5. Poi `python3 -I strumenti/ripara_ruote.py .` (dalla radice): ricentra la ruota sul cerchione, la rifà tonda
   senza pezzi di parafango e richiude il passaruota (le ruote ritagliate a mano saltellavano). Va lanciato dopo
   aver messo lo sprite in `GEN_DATA`; le auto già riparate hanno `"fixed": 1` e vengono saltate.
6. In `cars.js` aggiungi lo sprite a `GEN_DATA` e una riga a `GEN_NEW` (nome, motore, peso, CV, coppia, giri,
   limitatore, marce, finale, prezzo, km di sblocco, diesel): coppia, voce del motore, quadro e catalogo dei pezzi
   si costruiscono da lì. Poi aggiungilo a `GAME_TRAFFIC` (velocità tipiche e frequenza) e, se ha posti diversi,
   a `VG_SEATS` in `viaggio.js`. Controlla lo 0-100 con una prova veloce della fisica.
