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
  (ultima versione pubblicata: 100).

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
  sete, sonno, igiene), lavori (autostoppisti, consegne, rimorchio, furgone e autobus), il prologo di apertura (`prologo.js`)
  e il telefono (`telefono.js`). La storia dopo il km 0 è da scrivere: capitoli, eventi strani e passeggeri speciali
  sono strutture vuote (`VG_CHAPTERS`, `VG_ODD`, `VG_STORY_PAX`).
- **Modalità libere**: Sfide in città (la vecchia carriera), Città libera, Montagna (solo 3D).
- **Auto**: Supra, V40 e 25 veicoli dai disegni del giocatore (`cars.js`, `GEN_DATA` + `GEN_CARS`, immagini in
  `img/<id>.png`, `_wheel.png`, `_paint.png`). Tutti con motore, peso e marce veri; si comprano alla concessionaria
  del Motel Ovunque. Il traffico usa solo questi disegni, coi loro colori (`GAME_TRAFFIC` in `game.js`).
- **Primo lavoro**: pacco dal primo locale (km 1,8) alla tappa dopo (km 5) per € 10.000, obiettivo a schermo
  (`VG_FIRST`, `vgGoal`, test nel file dei test).
- **Missioni** (`missioni.js`): catena di sei lavori con le loro regole (testi neutri), poi lavori generati senza fine.
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
- **Radio** (`radio.js`): stazione FM 103.5 Night House con quattro canzoni del proprietario in fila
  (`audio/house/`: Redline Ascent, Midnight Gearbox, Midnight Apex, Midnight Redline), poi ricomincia; il titolo in
  onda va accanto al nome. Le stazioni a scaletta si fanno con `list` al posto di `src`.
- **Valigette** (`valigette.js`, app nel telefono di `telefono.js` agganciata con `window.telefono.addApp`): bronzo
  € 1.500, argento € 6.000, oro € 18.000; sei rarità con probabilità dichiarate nell'app; garanzia raro ogni 10 ed epico
  ogni 40. Premi: soldi, tanica, bomboletta, olio; ticket tagliando gratis (Niko) e modifica gratuita fino a € 5.000
  (Luca); potenziamenti a tempo (+8 % per 50 km, +15 % per 100 km) e per sempre (+3 %, mitico); pezzo vero del
  catalogo (epico), kit turbo (mitico), auto in regalo nel garage del motel (leggendario). Ricompense: bronzo per il
  primo lavoro, argento per ogni lavoro della catena (oro ogni terzo), bronzo per il 22 % delle consegne, bronzo per le
  sfide vinte (argento ogni quinta). Il premio si dà al tocco su "Apri", prima della scena (se si chiude non si perde).
  Scena d'apertura: caduta, gradini di luce per ogni livello di rarità, serrature, esplosione, raggi, premio che sale.
- **Interni** (`interni.js`): entrando in un locale (U) la strada lascia il posto a una scena in pixel art del locale,
  inquadrata nello spazio libero accanto al pannello (a destra su computer, sopra su telefono). Ogni locale ha chi ti
  serve con la sua posa animata, luci e neon, finestre sulla notte con traffico e pioggia, la tua auto fuori e un
  suono d'ambiente. I punti toccabili (es. la bacheca del bar) portano alla sezione giusta del pannello.
- **Garage e categorie (17/11/2026)**: app Garage nel telefono (`garage.js`); categorie utilitarie, familiari, piccole
  sportive, sportive, mezzi da lavoro (`ST_CAT` in `strada.js`): con gli abbaglianti accetta la sfida solo un'auto della
  tua categoria (40 %, 65 % le sportive), le altre ti fanno passare dicendo perché; i mezzi da lavoro mai. Traguardi:
  Cinque marche, Una per tipo, Il garage dello zio (tappa secondaria: ricomprare le cinque non scelte), Re di ogni categoria.
  Le cinque auto dello zio non scelte nel prologo finiscono in vendita all'Autosalone (scritta «Era nel garage dello zio»).
- **Testi con l'auto scelta**: `{Auto}`, `{auto}`, `{tipo}` nei testi della storia (pensieri, capitoli, messaggi) diventano
  «La Panda», «l'Audi», «un'utilitaria»… secondo l'auto ereditata (`game.s.vg.eredita`, `vgTesto` e `VG_AUTO_NOME` in `viaggio.js`).
- **Tasti, eredità, giunti (17/11/2026)**: tolto il "ta-dum" delle ruote sui giunti dell'asfalto (dava fastidio);
  i colpetti fanno il rumore di lamiera solo contro un'auto. Pulsante TASTI accanto a MENU e TELEFONO con l'elenco dei
  comandi e la possibilità di cambiarli (`tasti.js`; sul telefono solo l'icona). All'inizio del primo Viaggio la Volvo
  ereditata è malconcia (`vgInherit`, `VG_EREDITA` in `viaggio.js`: gomme a 1,45-1,7 bar e consumate, olio, candele e
  pastiglie da cambiare, sporca, un po' ammaccata, 22 % di benzina). Nel garage del prologo le altre cinque auto sono
  Panda, Audi 80, Grande Punto, Corsa e Polo (le più vecchie ed economiche). Il giocatore sceglie una delle sei: diventa la sola auto nel garage del Viaggio, malconcia (`onPick` del prologo → `eredita` in `index.html`); saltando il prologo resta la V40.
- **Interni rifatti in parte (17/11/2026)**: personaggi ridisegnati (testa arrotondata con mascella, tre toni di luce,
  capelli con volume e frangia, occhi col riflesso, naso, labbra, braccia e mani a pixel netti con le dita); insegna BAR
  leggibile (prima era al rovescio), MOTEL/LIBERE dentro la finestra; dalle finestre passano le auto vere del traffico
  (stessi disegni della strada, con ruote e fari), dietro l'auto parcheggiata. La tua auto negli interni si ridisegna due
  volte al secondo: al Neon Kustom vernice, cerchi, kit e spoiler provati si vedono subito (prima un aggiornamento ogni
  mezzo secondo rimetteva quelli comprati, e i cerchi finivano sotto la carrozzeria). Pannello: valori dell'officina su
  tre colonne, l'annuncio dell'usato in fondo. Provati gli acquisti in bar, benzinaio, autogrill, Niko e Neon Kustom.
- **Traguardi** (`traguardi.js`): 29 traguardi in `TRG_LIST` (lavori, catena, km, sfide, valigette, garage, 200 e
  250 km/h, freni oltre 600 °C, ruote bloccate senza ABS, 20 s in scia, finestrini giù sopra i 150, in galleria vicino
  al limitatore, 30 km senza danni, ruota 7 giorni di fila, benzina sotto il 3 %, € 50.000, motel, 5 locali). Premio in soldi o valigetta
  (`caseGrant`). Avviso dorato dall'alto con suono, uno alla volta; app Traguardi nel telefono (installata da sola).
- **Ruota giornaliera** (`ruota.js`, app Ruota nel telefono, si installa da sola, pallino quando il giro è pronto): un
  giro per giorno di calendario (ora del dispositivo). Auto leggendaria 1 % (solo sportive: Supra, R5 Turbo, M5, M3 E30
  ed E36, Clio Williams, 2002 Turbo; se le hai tutte € 60.000), valigetta d'oro 1,5 %, mappa da pista 3 %, argento 4 %,
  ticket modifica 4 %, € 5.000 6 %, centralina 7 %, ticket tagliando 9 %, bronzo 10 %, € 2.500 11 %, € 1.000 20 %,
  € 500 23,5 %. Giorni di fila = serie; il 7° è il giro d'oro (niente comuni). Il premio si dà al tocco su GIRA.
- **Concessionario** (`concessionario.js`, Autosalone Notte): nona tappa di ogni giro (al posto del terzo bar), il primo
  al km 27,4. Salone con schede (CV, Nm, peso, kg/CV, posti, carico), occasione della tappa −15 %, contanti o a rate
  (anticipo 20 %, interessi 15 %, 8 rate ogni 10 km pagate da sole; rata saltata = mora 10 %, alla 3ª il carro attrezzi
  si riprende l'auto, anche se ci sei sopra appena ti fermi), vendita delle tue auto (prezzo a nuovo × km × danni + un
  terzo dei pezzi), giro di prova di 3 km (poi ti fermi e se la riprendono; € 250 a km oltre i 3,5, più i danni).
  Lì si cambia anche auto. Al motel resta il parcheggio e il rimorchio. Corretto anche il cambio auto al motel, che
  nel viaggio non funzionava (l'accosto automatico restava acceso e lo bloccava).
- **Usato dei privati** (`usato.js`, app Annunci): a circa 4 tappe su 10 un privato vende la sua auto (cartello VENDESI
  davanti al locale). Entrando in quel locale c'è l'annuncio: guardarla (scopre carrozzeria e gomme), farci un giro
  (motore e freni), Niko a € 120 (tutto, anche olio e km scalati), una sola trattativa (più difetti hai scoperto, più
  accetta), compra. I difetti restano sull'auto: si sistemano da Niko (servizi, carrozziere, gomme, revisione del motore).
  Un'auto sana comprata bene si rivende all'Autosalone con guadagno (traguardo Commerciante).
- **Sfascio Ruggine** (`sfascio.js`): decima tappa di ogni giro (al posto del secondo autogrill), primo al km 30,6.
  Rovistare tra sei carcasse (€ 20, una volta: niente, soldi, oggetti, ticket, un pezzo, una valigetta, raramente
  € 2.500), pezzi usati per l'auto che guidi al 45 % del nuovo, la carcassa del giorno (20 % del prezzo, tutti i difetti,
  col conto di quanto costa sistemarla e quanto vale dopo), rottamazione a peso.
- **Incidenti** (rifatti il 17/11/2026): suono a strati in `dsp.js` (botta sorda che scende, lamiera che cede a scatti,
  pannelli che vibrano su note diverse a ogni urto, vetri e pezzi che cadono, strisciata che dura col suo attrito a
  scatti; il motore si abbassa per un attimo; stesso livello in abitacolo, fuori e nel vano motore, prima dall'esterno
  quasi non si sentiva). Nel 2D: scossa dell'inquadratura che si spegne in fretta, la scocca che rimbalza, scintille e
  lampo dal punto giusto (muso, coda o fianco), frammenti di vetro e plastica che restano sull'asfalto, l'altra auto
  ammaccata con le quattro frecce. Dopo un tamponamento chi guida molla il gas e frena d'istinto, l'auto colpita
  rallenta piano e la guida automatica le resta lontana (prima si tamponava la stessa auto 2-4 volte di fila).
  Guardrail della montagna: strisciata che si sente. Test in `test/urti.test.js`; per ascoltare
  `node strumenti/ascolta.mjs v40 urti file.wav 1`.
- **Finestrini** (`sim.setWindows`/`toggleWindows`, tasto 8 o pulsante FINESTR.; lo 0 è del telefono): motorino da 2,6 s col quadro acceso,
  un filo di resistenza in più. Nel suono (`win`, `winMot`): a finestrini chiusi in abitacolo vento e rotolamento sono
  bassi (prima coprivano il motore di 23 dB a 120 km/h), aperti entrano aria, rombo basso, scarico più chiaro ed eco
  dell'ambiente; socchiusi in velocità l'abitacolo pulsa. Nel 2D il vetro abbassato perde i riflessi.
- **Guidatore** (`pilota2d.js`): finestrino del pilota misurato a mano per ogni auto (`WIN`), maschera = riquadro meno
  vernice (`img/<auto>_paint.png`) e montanti scuri; la figura si adatta al finestrino. La Supra usa ancora il
  riconoscimento del vetro. I tasti 1-6 mettono le marce: per questo la ruota di scorta è sul 9, i finestrini sull'8 e il telefono sullo 0.
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
- **Nuova storia (in corso, dal 17/11/2026)**: il proprietario vuole una storia horror **graduale** (prima tutto tranquillo, poi una piccola cosa, poi il macabro). Fatti: i **pensieri del protagonista** (`pensieri.js`: testo sulla strada di 8-10 s per radio, bisogni e pensieri a caso), il **telefono** (`telefono.js`: app normali, app da scaricare con i cartelloni sulla strada, app strane) e il **prologo** (`prologo.js`: lettera → E36 blu → notaio → scelta, solo la Volvo → autostrada). Il parente morto è **zio Claudio**. La **vecchia storia è stata cancellata** (era in `STORIA.md`, nei capitoli ed eventi di `viaggio.js` e nei testi di `missioni.js`): non rimetterla, se serve è nella cronologia git. Da fare: scrivere la storia vera (`STORIA.md` dice cosa è deciso e cosa manca), i nomi delle altre 5 auto del garage e il loro sblocco, gli effetti horror (bussare nel bagagliaio senza niente, chiamate strane, app che compaiono da sole).
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
- **La storia del Viaggio** si costruisce a sessioni con il proprietario e si annota in `STORIA.md`: non inventarla da soli
  e non toccare `STORIA.md` senza che il proprietario lo chieda.
- Il cognato a volte lavora con **Kimi Code** sui rami `kimi/...`: prima di toccare gli stessi file controlla con
  `git ls-remote --heads origin` e, se c'è lavoro suo, chiedi al proprietario prima di unirlo.

## Come lavorare
- **Skill del progetto** in `.claude/skills/` (elenco in `AGENTS.md`): prova a copione nel browser
  (`strumenti/prova.js`), ascolto del motore fuori dal browser (`strumenti/ascolta.mjs`), funzioni nuove, disegno,
  auto dai disegni, pubblicazione, storia, controllo del gioco.
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
7. Pulisci i ritagli: `python3 -I strumenti/pulisci_bordi.py img geo.json` (geo.json con `wy`, `wr`, `ax` di ogni sprite,
   da `CARS[id].sprite`; prima con `--prova`). Toglie i pezzi di gomma e d'ombra rimasti sotto la carrozzeria e chiude i
   buchi di un pixel nei passaruota, che lasciavano vedere lo sfondo a puntini. Fatto su tutte le 26 auto il 17/11/2026.
