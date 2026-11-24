# Night Run · passaggio di consegne per una nuova chat

Leggi prima questo file, poi `AGENTS.md` (struttura dei file, regole, prove) e `README.md` (tutto quello che il
gioco fa, sezione per sezione).

## Chi e cosa
- Gioco di guida nel browser, in pixel art 2D (più una vista 3D), fatto per due persone: il proprietario del
  repository e suo cognato. Si gioca da GitHub Pages: https://akaoni97.github.io/Night_Run/
- Repository **`Akaoni97/Night_Run`**, solo il gioco, alla radice. Il ramo **`main`** è quello pubblicato su Pages.
  Fino al 16/11/2026 il gioco stava in `Akaoni97/RandomEgg-s` (cartella `motori/`, ramo
  `claude/peaceful-goodall-tvifol`): la storia delle modifiche è stata portata qui, lì non si lavora più.
- Copie giocabili come artifact privati su claude.ai (ognuno aggiorna la sua):
  - del proprietario: https://claude.ai/artifact/PstSTNEs7iTjYCtRfTKodD (ultima versione pubblicata: 132, grafica più nitida e ruote della trazione anteriore);
  - del cognato: https://claude.ai/artifact/XJDCR8GCQSYz95XXtXoyrs.

## Il gioco come app sul PC
Da Edge o Chrome, sul sito https://akaoni97.github.io/Night_Run/: menu (i tre puntini) → «App» → «Installa Night Run»
(in Chrome a volte è l'icona col monitor e la freccia in fondo alla barra degli indirizzi). Diventa un'icona sul desktop e
nel menu Start, si apre in una finestra sua e si aggiorna da sola a ogni caricamento su `main`. I salvataggi sono gli
stessi del sito aperto in quel browser. L'exe vero (Electron, per Steam) è per più avanti: `docs/pubblicazione/PERCORSO.md`.

## Regole del proprietario (importanti)
1. **Rispondere sempre e solo in italiano**, anche nei messaggi brevi durante il lavoro. Commenti nel codice e
   messaggi di commit in italiano.
2. **Veicoli solo dai disegni del giocatore.** Niente auto inventate, né per il traffico né da guidare. Se manca un
   veicolo (per esempio un camion), chiedilo: il giocatore manda uno zip con i disegni.
3. Niente file presi da mod o senza licenza nel repository (suoni, modelli): il giocatore li carica in locale.
4. Il proprietario e il cognato caricano direttamente su `main`, senza pull request né approvazione: il cognato ha
   piena libertà di aggiungere ed eliminare. Prima di caricare `git fetch origin main` e unione, mai `push --force`.
   Ogni sera, prima di un lavoro nuovo, controllo insieme (`strumenti/controllo_sera.sh`, skill `night-run-sera`). Righe finali dei commit come da istruzioni della sessione
   (Co-Authored-By e Claude-Session).
5. Prima di dire che una cosa è fatta, provala (test e browser) e dillo in modo chiaro, anche quando qualcosa non va.

## Com'è fatto il gioco oggi (in breve)
- **Il Viaggio** (modalità principale, `viaggio.js` + `viaggio2d.js`): autostrada infinita dal km 0 sotto casa con
  una V40 di serie. Tappe ogni 3,2 km (bar, Benzina 24H, autogrill Sosta 24, Officina Mario, Da Luca Tuning, Neon
  Kustom, Motel Ovunque con la cassa che ti segue), paesaggi che cambiano coi km, bisogni del guidatore (fame,
  sete, sonno, igiene), lavori (autostoppisti, consegne, rimorchio, furgone e autobus), il prologo di apertura (`prologo.js`)
  e il telefono (`telefono.js`). La storia dopo il km 0 è da scrivere: capitoli, eventi strani e passeggeri speciali
  sono strutture vuote (`VG_CHAPTERS`, `VG_ODD`, `VG_STORY_PAX`).
- **Modalità libere**: Città libera, Montagna (solo 3D). Il pulsante "Sfide in città" è stato tolto; la modalità interna `career` serve ancora al Viaggio.
- **Auto**: Supra, V40 e 25 veicoli dai disegni del giocatore (`cars.js`, `GEN_DATA` + `GEN_CARS`, immagini in
  `img/<id>.png`, `_wheel.png`, `_paint.png`). Tutti con motore, peso e marce veri; si comprano alla concessionaria
  del Motel Ovunque. Il traffico usa solo questi disegni, coi loro colori (`GAME_TRAFFIC` in `game.js`).
- **Primo lavoro**: pacco dal primo locale (km 1,8) alla tappa dopo (km 5) per € 10.000, obiettivo a schermo
  (`VG_FIRST`, `vgGoal`, test nel file dei test).
- **Missioni** (`missioni.js`): catena di sei lavori con le loro regole (testi neutri), poi lavori generati senza fine.
  La meta del lavoro in corso è una bandierina verde sulla mappa a barra in basso (oltre i 2,7 km resta sul bordo
  destro con la distanza); scatole e bancali caricati hanno una "P" sulla sosta di consegna (`renderMiniMap` in
  `index.html`). Idee non fatte: missioni che cambiano col paesaggio.
- **Strada viva** (`strada.js`): F o pulsante FARI per sfanalare chi sta davanti (si sposta e ti fa passare),
  incidenti e controlli della polizia in prima corsia.
- **Traffico da autostrada (18/11/2026)** (`trafficDriver`/`trafficAccel` in `game.js`, `trafficAI` in `strada.js`): ogni
  auto ha un carattere (normale, prudente, aggressivo, centralista, distratto ~1 su 12) e segue chi ha davanti col modello
  IDM: distanza in secondi, frenata che anticipa, fino a 8,5 m/s² ma mai più del necessario. Chi arriva da dietro
  rallenta; solo il distratto ti vede tardi e ti tampona. Si tiene la destra e si sorpassa a sinistra; l'aggressivo
  bloccato in terza ti sfanala e se dura supera a destra; il centralista sta in seconda. Inchiodate con gomme che
  stridono (`skidSound` in `index.html`) e scritta SCREEECH!, luci dei freni accese. Dinamiche: curiosi che rallentano
  accanto a incidenti e posti di blocco (code a fisarmonica dietro), circa uno su sei che esce alla tappa (freccia,
  frenata da 2 m/s², parcheggia in corsia 0 davanti al locale; chi segue si accoda o sorpassa), pullman a coppie che si
  sorpassano piano in seconda (i pesanti non vanno mai in terza). Test in `test/traffico.test.js`.
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
- **Chat del telefono** (`chat.js`): conversazioni a bivi con 2-3 risposte, barra di **confidenza** per persona, **gusti** che si scoprono dalle
  reazioni, soglie 25/50/75/100 che si consumano una volta sola, chat ignorate che restano ad aspettare (e restano in coda se i
  prerequisiti non ci sono ancora). I dati (982 nodi del terzo giro di Codex: le 28 conversazioni ampliate, 15 di soglia, 18 nuove, 12 delle
  capitali, domande di casa, scene) sono in `chat_dati.js`, **generato** da `strumenti/importa_chat.py` partendo da `materiale_chat/`
  (comando in `materiale_chat/RIGENERA.md`; `11_ATTIVAZIONE.json` decide chi parte da solo). Toni dalla tabella di Codex. I km di partenza
  sono ancora segnaposto da calibrare giocando.
- **La storia gira** (18/11/2026): `capitali.js` (le dodici capitali nel Viaggio: rotta in `VG_ROUTE`, arrivi, 36 cartelli, 48 eventi, pensieri dei
  tratti, flag `luogo_<città>`), `regia.js` (patto/varco/affidamento come stati, domande di casa, scene manuali, fallimenti, epiloghi B1/B2),
  `storia.js` (fasi dalle capitali, momenti garantiti, quattro incursioni a lampade, vicino di Elena, L'ultima porta e i finali A, B1, B2, C, D;
  gli epiloghi di A, C e D li ho scritti io, da rivedere). Prove: `storiaDebug`, `regiaDebug`, `chatDebug` nella console.
  Ancora da fare: sfondi propri per le capitali (oggi usano quello di Tokyo), galleria disegnata, sangue a gradi, figura alla porta, rifugio
  dopo un fallimento, calibrazione di lampade e metri delle incursioni.
- **Tutorial del primo lavoro** (`missioni.js`): finché non è finito non si può superare il locale giusto; poi un'uscita saltata annulla la consegna.
- **Comandi dell'auto** (`comandi.js`): rimorchio, turbo (ECO/NORMALE/FORTE), scarico (aperto/silenzio), neon; **fari** spenti/anabbaglianti/abbaglianti
  col pulsante FARI (F sfanala); **accensione** con AVVIA (telefono: rotondo accanto al quadro). Cambio e pedali sono nascosti nella scheda Guida del menu. **AUTO 1 si inserisce dopo 5 s** senza toccare niente; la leva ha anche **S (sport)**; i tasti 1-4 sono solo per mangiare e bere.
- **Comandi da telefono (18/11/2026)** (`menu.js`, solo al tocco, `html.tdash`): servono per le prove, il gioco è pensato
  per il PC (regola 7 di `AGENTS.md`). Quadro in alto a sinistra con AVVIA accanto; FRENO e GAS in basso a destra con
  sopra le palette del cambio ▼/▲ e la marcia in mezzo; ◀ ▶ affiancati a sinistra; STRUMENTI e DATI aprono due finestrelle
  (funzioni dell'auto a tessere, compresa LEGGERA; ora, lavoro, bisogni, carico); SCHERMO INTERO nella barra in alto (a
  schermo intero MENU e TELEFONO restano in alto a destra); in verticale l'avviso "Gira il telefono". Qualità **leggera**
  nelle impostazioni (densità normale, niente bagliore) per provare senza scatti.
- **Fari** (`effetti2d.js`): due coni volumetrici (anabbagliante e abbagliante), alone, pozza sull'asfalto, pulviscolo.
- **Valigette** (`valigette.js`, app nel telefono di `telefono.js` agganciata con `window.telefono.addApp`): bronzo
  € 1.500, argento € 6.000, oro € 18.000; sei rarità con probabilità dichiarate nell'app; garanzia raro ogni 10 ed epico
  ogni 40. Premi: soldi, tanica, bomboletta, olio; ticket tagliando gratis (Mario) e modifica gratuita fino a € 5.000
  (Luca); potenziamenti a tempo (+8 % per 50 km, +15 % per 100 km) e per sempre (+3 %, mitico); pezzo vero del
  catalogo, mai il turbo (epico), auto in regalo nel garage del motel (leggendario). Ricompense: bronzo per il
  primo lavoro, argento per ogni lavoro della catena (oro ogni terzo), bronzo per il 22 % delle consegne, Il premio si dà al tocco su "Apri", prima della scena (se si chiude non si perde).
  Scena d'apertura: caduta, gradini di luce per ogni livello di rarità, serrature, esplosione, raggi, premio che sale.
- **Interni** (`interni.js`): entrando in un locale (U) la strada lascia il posto a una scena in pixel art del locale,
  inquadrata nello spazio libero accanto al pannello (a destra su computer, sopra su telefono). Ogni locale ha chi ti
  serve con la sua posa animata, luci e neon, finestre sulla notte con traffico e pioggia, la tua auto fuori e un
  suono d'ambiente. I punti toccabili (es. la bacheca del bar) portano alla sezione giusta del pannello.
- **Video teaser e licenze (18/11/2026)**: `strumenti/teaser.js` registra il gioco senza interfaccia a 30 fps col tempo finto
  di Playwright (fermo: avanza solo fotogramma per fotogramma, `requestAnimationFrame` a 1/60 s fissi), guidando con la
  fisica vera (pilota a copione: avviamento e partenza senza controllo di trazione, crociera, partenza affiancata al
  semaforo sotto la pioggia col gas dosato, frenata al posto di blocco; dal 18/11 sera anche il telefono che sale con un
  messaggio dello Sconosciuto, «Ho lasciato sei auto. Tu ne hai presa una.», e la Supra preparata Big single che tira la
  3ª al limitatore, mette la 4ª e se ne va con la telecamera che si ferma, `camHold` in `street2d.js`) e salvando i
  parametri del motore; nelle riprese gomme gonfie e guida automatica spenta; ogni ripresa può avere la sua auto
  (`car: { id, preset }`) e `teaser_audio.mjs` usa quella; `strumenti/teaser_audio.mjs` ci rifà il suono col motore audio del gioco;
  `strumenti/teaser_cartelli.py` fa le scritte (nome, frasi, anno); `strumenti/teaser_monta.sh` monta 16:9 e 9:16 con
  *Redline at Midnight* sotto. Nel video niente cartelloni né testi della storia. `LICENZE.md`: controllo di licenze e
  marchi prima dell'uscita (nome già usato da altri giochi, marche vere, musica da confermare, crediti da mostrare).
- **Vita e giochi di luce (17/11/2026)**: `vita2d.js` (uccelli, scie d'aereo, fuochi d'artificio, lampi lontani, foglie e cartacce sulla strada, riflessi verticali sull'asfalto, falene, lucciole, raggi di sole, miraggio). Costa circa 2 ms a fotogramma sul computer di prova.
- **Grafica dei paesaggi (17/11/2026)**: `paesaggi2d.js` (luci lontane, fari, treni, torri illuminate, catarifrangenti),
  lampioni anche nella Bassa (ogni 55 m), cielo con la sua tinta per paesaggio (`drawSky`: azzurro-grigio nella Bassa, blu
  in montagna e al mare, caldo a San Gimignano, rosa nel deserto), fari pubblicitari ed elicottero solo in città e sul
  Wangan, nuvole rifatte come veli morbidi illuminati dalla luna (`cloudHD`), meno foschia sulla città del Wangan. Corretta
  la scia della velocità, che era disegnata davanti alle cose invece che dietro (fantasmi sulle case). Messaggi: la pila
  a destra parte sotto il radar delle corsie (al massimo 3), l'avviso del telefono sotto la barra in alto.
- **Economia (rivista il 17/11/2026)**: prezzi delle auto credibili (nuove: Panda 13.500, Punto 14.000, Corsa 15.500,
  Clio 17.000, Polo 17.500, 308 25.000, A3 30.000; usate e d'epoca: Audi 80 4.500, 206 GTI 6.500, Golf GTI 15.000, A112
  14.000, 205 GTI 19.000, Williams 25.000, E36 28.000, M5 32.000, 2002 Turbo 55.000, Supra 65.000, E30 75.000, R5 Turbo
  95.000). Lavori più bassi (primo € 3.000, catena 2.000-6.500, poi 2.500 + 300 a lavoro fino a 9.000), consegne ×4,
  passeggeri ~€ 30 + 9-13 al km, autobus € 12 a passeggero; tagliando 120, candele 140, pastiglie 180, gomme da 420,
  motel 60. Ritmo misurato (40 lavori di fila, strumento in scratchpad non salvato): ~€ 290 netti al km coi lavori più
  ~€ 30 da consegne e passeggeri; una Panda nuova dopo ~45 km di lavoro, la Supra dopo ~200 (si sblocca al km 260).
- **Documenti (17/11/2026)**: `documenti.js`, app Libretto, revisione da Mario, controlli della polizia (vedi AGENTS.md).
  Mettere in regola l'auto ereditata costa ~€ 830 (assicurazione 400, bollo con mora ~345, revisione 85).
- **Gare tolte (17/11/2026, ramo del cognato)**: niente più sfide al semaforo, con gli abbaglianti, scala dei rivali e reputazione di strada; le categorie restano per Garage e documenti. La voce qui sotto sulle sfide per categoria è superata. **Le gare torneranno (18/11/2026, deciso dal cognato)**, ma come attività secondaria per guadagnare, accanto alle consegne: il gioco non è centrato su di loro.
- **Garage e categorie (17/11/2026)**: app Garage nel telefono (`garage.js`); categorie utilitarie, familiari, piccole
  sportive, sportive, mezzi da lavoro (`ST_CAT` in `strada.js`, usate da Garage e documenti; le sfide con gli abbaglianti sono state tolte). Traguardi:
  Cinque marche, Una per tipo, Il garage dello zio (tappa secondaria: ricomprare le cinque non scelte).
  Le cinque auto dello zio non scelte nel prologo finiscono in vendita all'Autosalone (scritta «Era nel garage dello zio»).
- **Testi con l'auto scelta**: `{Auto}`, `{auto}`, `{tipo}` nei testi della storia (pensieri, capitoli, messaggi) diventano
  «La Panda», «l'Audi», «un'utilitaria»… secondo l'auto ereditata (`game.s.vg.eredita`, `vgTesto` e `VG_AUTO_NOME` in `viaggio.js`).
- **Tasti, eredità, giunti (17/11/2026)**: tolto il "ta-dum" delle ruote sui giunti dell'asfalto (dava fastidio);
  i colpetti fanno il rumore di lamiera solo contro un'auto. Pulsante TASTI accanto a MENU e TELEFONO con l'elenco dei
  comandi e la possibilità di cambiarli (`tasti.js`; sul telefono solo l'icona). All'inizio del primo Viaggio la Volvo
  ereditata è malconcia (`vgInherit`, `VG_EREDITA` in `viaggio.js`: gomme a 1,45-1,7 bar e consumate, olio, candele e
  pastiglie da cambiare, sporca, un po' ammaccata, 22 % di benzina). Nel garage del prologo le altre cinque auto sono
  Panda, Audi 80, Grande Punto, Corsa e Polo (le più vecchie ed economiche). Il giocatore sceglie una delle sei: diventa la sola auto nel garage del Viaggio, malconcia (`onPick` del prologo → `eredita` in `index.html`); saltando il prologo resta la V40.
- **Luca Garage** (21/11/2026, `lucagarage.js`): app del telefono che porta davanti a Da Luca Tuning più vicino (davanti o dietro) per € 150, da fermi e fuori dai locali. Nel gioco normale si scarica con un cartellone al km 26 (`FERRO CHE NON BASTA?`); nella scheda Sviluppatori il pulsante «Sblocca Luca Garage» (`NightDev.luca`) la installa subito (e «Installa tutte le app» la include). Test in `test/lucagarage.test.js`.
- **Assetto a livelli** (20/11/2026, `tuning.js` + `sim.js` + pannello di Luca in `index.html`): in ogni auto l'Assetto ha 6 livelli
  (0 originale, poi molle, molle e ammortizzatori, coilover, coilover da pista, competizione; id `oem, springs, dampers,
  coilover|tein, race, pro`). Livello 0: niente da regolare. Dal livello 1 il pezzo parte più basso e rigido
  (`SUSP_LV[n].h0/k0`) e due cursori sotto la tendina regolano altezza (mm rispetto all'originale, anche rialzata) e
  rigidità (% delle molle di serie) entro i limiti del livello, sempre più larghi fino al 5 (−120/+90 mm, 50-420 %). La
  regolazione è gratis ma da fermo e da Luca come i pezzi; cambiando pezzo si riparte dai valori di fabbrica. Stato:
  `S.adj[auto] = { h, k }` (nel salvataggio di `banco2jz`, come `S.tunes`). La fisica: baricentro (`dcg`) e quindi trasferimento
  di carico, aria (`cdK`), presa, beccheggio (rigidità), partenza (`launch`), saltellamento dopo i giunti (`sim.roadBump`,
  `bumpU`) e, sotto −70 mm, il fondo che tocca sugli urti (`scrapeT`: frena un po', scintille e SCRAAAPE col `game.fx` `scrape`).
  Il disegno segue (`look.low` in `street2d.js` e `carPic` in `interni.js`); nella vista 3D non si vede l'altezza. Il vecchio
  assetto 'drag' della Supra è ora il livello 4 con regolazione morbida (migrazione in `fillTunes`). Test in `test/assetto.test.js`.
- **Interni rifatti in parte (17/11/2026)**: personaggi ridisegnati (testa arrotondata con mascella, tre toni di luce,
  capelli con volume e frangia, occhi col riflesso, naso, labbra, braccia e mani a pixel netti con le dita); insegna BAR
  leggibile (prima era al rovescio), MOTEL/LIBERE dentro la finestra; dalle finestre passano le auto vere del traffico
  (stessi disegni della strada, con ruote e fari), dietro l'auto parcheggiata. La tua auto negli interni si ridisegna due
  volte al secondo: al Neon Kustom vernice, cerchi, kit e spoiler provati si vedono subito (prima un aggiornamento ogni
  mezzo secondo rimetteva quelli comprati, e i cerchi finivano sotto la carrozzeria). Pannello: valori dell'officina su
  tre colonne, l'annuncio dell'usato in fondo. Provati gli acquisti in bar, benzinaio, autogrill, Mario e Neon Kustom.
- **Traguardi** (`traguardi.js`): 27 traguardi in `TRG_LIST` (lavori, catena, km, valigette, garage, 200 e
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
  (motore e freni), Mario a € 120 (tutto, anche olio e km scalati), una sola trattativa (più difetti hai scoperto, più
  accetta), compra. I difetti restano sull'auto: si sistemano da Mario (servizi, carrozziere, gomme, revisione del motore).
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
- **Effetti del 2D** (`effetti2d.js`): fumo, fiammate (arancio, gialla o blu, con fiammella che resta accesa tra uno scoppio e l'altro; dal punto `ex` del disegno, controllo con `node strumenti/scarichi.js`), marmitta che si arroventa ai giri alti (v0.120), scintille, ombre proiettate, fari, luci sulla carrozzeria,
  asfalto. `street2d.js` li chiama da `update()`; per provarli senza guidare si forzano `flame`, `spin`, `brake`
  nello stato passato a `view2d.update`.
- **Interfaccia** (`menu.js`): schermata di gioco a tutta finestra, menu a schede con Tab. I pannelli restano quelli
  di `index.html` (stessi id), spostati nelle schede all'avvio: se aggiungi un pannello, aggiungilo anche a `TABS`.
  Menu di pausa con sezioni a icone e colori (`ICO`, `TABS` in `menu.js`; stile in fondo allo `<style>` di
  `index.html`, blocco "Menu di pausa"), riassunto della partita (`summary()`).
- **Street Racing** (v0.141, `premium.css`, `premium.js`, `menu.js`): menu Partita fotografabile col garage in pixel art, auto del salvataggio e obiettivo sopra le statistiche. Icone e colori distinguono avvisi, quartieri e traguardi. Lo stile Classico si trova in Impostazioni → Grafica.
- **Gallerie** (`galleria2d.js`) dove cambia il paesaggio; **guidatore** visibile nei vetri (`pilota2d.js`).
- **Schermata**: cruscotto in alta definizione in basso a sinistra (`hudpro.js`) nello stile del quadro di ogni
  auto (`CLUSTERS`), con pulsanti AUTO, TC, LAUNCH, STRUM., FARI, MAPPA; radar delle corsie in alto a destra
  (corsia 1 = la più vicina = in basso); inquadratura vicina da fermi che si allarga con la velocità.
  Da v0.140, V40, Supra ed E30 hanno geometrie dedicate nel quadro in strada; i km dell’auto restano distinti dal viaggio.
- **Nico e il motore**: il vecchio banco dei motori di Nico (cartella `pistone/`: livelli, magazzino, banco di lavoro, motori
  costruiti a pezzi) è stato **cancellato il 21/11 sera** su decisione di Luca (il cognato); se servisse, è nella storia di git
  (commit prima della v0.74). Da Luca resta l'officina semplice (`officina.js`), che ne ha preso il peso del motore per lo swap
  (`offKgSerie`) e rimborsa una volta sola chi aveva speso da Nico (`offPistoneRimborso`). Nico, il personaggio, cerca un'altra
  mansione (`SOSPESI.md`).
- **Campioni audio dei pezzi** (`campioni.js`, v0.78): da Luca Tuning la scheda **Suoni** dell'officina. Ogni pezzo montato non di
  serie porta la sua voce sopra la sintesi (`cmpAuto`): valvola, turbo, compressore, wastegate, aspirazione, borbottio dello scarico,
  centralina pop & bang, limitatore/launch/cambiate, cambio, spurgo nitro. 42 kit, 180 file in `audio/campioni/` fatti a codice da
  `strumenti/campioni_pezzi.py` (guida in `audio/campioni/LEGGIMI.md`); gli altri kit si comprano una volta per tutte le auto. In
  `dsp.js` i flag `valv`/`turb`/`bur` evitano i doppioni con la sintesi. Per sentirli fuori dal gioco: `strumenti/ascolta_campioni.js`.
  Ogni componente che suona ha il suo cursore VOLUME (0-200 %, v0.104), sopra quello generale.
- **Cambi e pezzi per tutti** (v0.107): da corsa a 350/320/300 km/h al limitatore per classe, sport fino a 300/275/255 (bus 200); la Supra ha aspirazioni, cilindrata, benzina e cambi regolabili; compressori a cinghia senza ritardo né valvola.
- **Turbo** (v0.106): girante mossa dai gas di scarico, wastegate con picco e assestamento, depressione sul manometro
  (`SIM_TB` in `sim.js`); soffio dell'aria e valvola nitida in `dsp.js`, valvole dei campioni rifatte.
- **Volano e pop & bang** (v0.105): il volano è un reparto suo da Luca Tuning (originale, pesante, alleggerito, superleggero:
  `volanoCat` in `tuning.js`); la mappa pop & bang è l'ultimo livello della centralina, non più una spunta del menu.
- **Ruote che si fermano** (`sim.js`, v0.104): la gomma oltre il picco tiene il segno anche con lo slittamento all'indietro (prima
  spingeva avanti: sgommate infinite passando da in movimento a fermi); quando il gioco ferma l'auto di colpo si usa `sim.ferma()`.

## Lavori aperti e idee in sospeso

- **Dal report di verifica del 18/11/2026**: tasti 1-4 liberati dalle marce, test dell'officina e 0-100 della Supra (5,83 s) già a posto. Il menu non ferma il gioco: è voluto (ci si ferma in una postazione).
- **Pulizia da fare più avanti:** il codice morto delle vecchie gare (coupé 3D «rival», `s.rep`), i blocchi cambio e pedali nascosti nella scheda Guida,
  le app strane del telefono (Ultima Uscita, Segreteria, 03:07) e `TEL_ATTI`, residui della vecchia storia.
- **Nuova storia (in corso, dal 17/11/2026)**: il proprietario vuole una storia horror **graduale** (prima tutto tranquillo, poi una piccola cosa, poi il macabro). Fatti: i **pensieri del protagonista** (`pensieri.js`: testo sulla strada di 8-10 s per radio, bisogni e pensieri a caso), il **telefono** (`telefono.js`: app normali, app da scaricare con i cartelloni sulla strada, app strane) e il **prologo** (`prologo.js`: lettera → E36 blu → notaio → scelta, solo la Volvo → autostrada). Il parente morto è **zio Claudio**. La **vecchia storia è stata cancellata** (era in `docs/storia/STORIA.md`, nei capitoli ed eventi di `viaggio.js` e nei testi di `missioni.js`): non rimetterla, se serve è nella cronologia git. Da fare: scrivere la storia vera (`STORIA.md` dice cosa è deciso e cosa manca), i nomi delle altre 5 auto del garage e il loro sblocco, gli effetti horror (bussare nel bagagliaio senza niente, chiamate strane, app che compaiono da sole).
- **Alta definizione a 720 righe** (vedi AGENTS.md, "Densità doppia"): fatti tela interna, cielo, luci sfumate,
  carrozzerie a grandezza piena, palazzi (`tileHD`), fumo, fiamme, fari e asfalto fini, danni sul disegno
  (`damaged`). Da fare: marciapiedi, pedoni e oggetti, scritte delle insegne, luoghi del viaggio (bar, motel...). Il proprietario vuole un pixel "più moderno, senza esagerare".
- Manca il disegno di un **camion** (traffico lento a 90 km/h, lavori pesanti: la logica c'è, serve il disegno).
- Golf GTI e 205 GTI: maschera della vernice rifatta il 20/11 con `strumenti/maschera_scura.py` (prima prendeva il 16-26 %, ora il 73-77 %); restano un po' colorati i sedili dietro i finestrini.
- La V40 è nel traffico: ruota e maschera della vernice sono ricavate dal disegno con `strumenti/v40_traffico.py`
  (`img/v40_wheel.png`, `img/v40_paint.png`); la V40 guidata dal giocatore resta disegnata a parte (`v40Base`).
- Il traffico mette il bagliore di fanali e frecce all'altezza giusta di ogni disegno (dati `tail`/`head`).
- La Volvo 850 R ha 5 cilindri ma `dsp.js` sa fare solo 4 o 6.
- La vista 3D non ha i luoghi, le auto nuove né gli eventi.
- Gli **sticker** del giocatore: `img/stickers/manifest.json` è vuoto, arriveranno.
- Passano tutti i 29 test. I due vecchi fallimenti erano errori dei test, non del gioco: la prova dello 0-100 non
  montava la configurazione originale (con il Torsen di serie fa 5,6 s e 13,7 s sui 400 m) e quella dell'officina
  non sapeva che i pezzi si sbloccano anche coi chilometri.
- **La storia del Viaggio** si costruisce a sessioni con il proprietario e si annota in `docs/storia/STORIA.md`: non inventarla da soli
  e non toccare `docs/storia/STORIA.md` senza che il proprietario lo chieda.
- Il cognato a volte lavora con **Kimi Code** sui rami `kimi/...`: prima di toccare gli stessi file controlla con
  `git ls-remote --heads origin` e, se c'è lavoro suo, chiedi al proprietario prima di unirlo.

## Come lavorare
- **Skill del progetto** in `.claude/skills/` (elenco in `AGENTS.md`): prova a copione nel browser
  (`strumenti/prova.js`), ascolto del motore fuori dal browser (`strumenti/ascolta.mjs`), funzioni nuove, disegno,
  auto dai disegni, pubblicazione, storia, controllo del gioco.
- **Prove automatiche** (dalla radice del repository, Node 22+): `node --test test/test1.test.js`.
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
**Disegni ad alta definizione (dal 22/11, v0.82)**: `python3 -I strumenti/sfondo_via.py <uscita> 14 <disegni>` toglie lo sfondo
(scrive anche `_bianco.png`), `trova_ruote.py` sui `_bianco`, poi `affina_ruote.py <ruote.json> <uscita>` (centro dal cerchione,
raggio fino a terra; guarda i cerchi ingranditi, per autobus e auto difficili mettili a mano), poi
`python3 -I strumenti/disegni_hd.py img <anteprime> ruote.json <uscita> <cartella ruote> elenco.json`
(`elenco.json = { id: [disegno, ruota disegnata a parte, passo in metri, suffisso, [y0, y1] fascia dei finestrini, id normale per le tuning] }`):
crea le due misure e `meta.json` da copiare in `GEN_DATA` (`sprite`, o `spriteT` per la tuning). Finestrino del guidatore a mano in `WIN`
di `pilota2d.js`. Camion: `strumenti/camion_hd.py` (motrice + rimorchio, assi trovati sul disegno). Togli dai disegni marchi e stemmi.

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
