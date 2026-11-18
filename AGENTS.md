# Night Run · guida per gli assistenti (Kimi, Claude e altri)

Stato del lavoro, lavori aperti e procedure (artifact, nuovi disegni di auto): vedi `PASSAGGIO.md`.
Comandi di Claude Code (`/compact`, `/clear`...), skill di Night Run e scorciatoie, spiegati in italiano: `COMANDI.md`.
Gli strumenti per trasformare i disegni in auto del gioco sono in `strumenti/`. I documenti (storia, richieste a Codex) sono in `docs/`, i testi da cui si generano le chat in `materiale_chat/`.

Gioco di guida notturna nel browser, in italiano, fatto per due persone (il proprietario del repository e suo
cognato). Repository `Akaoni97/Night_Run` (solo il gioco, alla radice); si gioca da GitHub Pages:
https://akaoni97.github.io/Night_Run/ (pubblicato dal ramo `main`). Fino al 16/11/2026 il gioco stava in
`Akaoni97/RandomEgg-s`, cartella `motori/`: lì non si lavora più.

## Com'è fatto
HTML + JavaScript puro: niente build, niente npm, niente framework. Solo three.js 0.147 da CDN per la vista 3D.
`index.html` carica gli script in quest'ordine, e le costanti globali di un file si usano dagli altri
(per esempio `CARS`, `CLUSTERS`, `GAME_LANE_Z`, `GAME_LOCS`):

| File | Cosa contiene |
| --- | --- |
| `dsp.js` | Motore audio sintetizzato (classe `EngineDSP`, gira in un AudioWorklet): cilindri, collettori, scarico, turbo, valvola, aspirazione, carattere per auto (`voice`). Urti (`hit`/`hitSample`): botta, lamiera a scatti, pannelli, vetri, detriti, strisciata; evento `{ type: 'crash', I, kind: 'front'|'rear'|'side' }`, il motore si abbassa per un attimo. |
| `sim.js` | Fisica (classe `SupraSim`, passo 1/4000 s): motore, turbo, frizione, cambio, gomme Pacejka, differenziale, beccheggio, wheel hop, TRC, ABS, tipi di limitatore. |
| `tuning.js` | Catalogo pezzi della Supra, reparto Limitatore comune (`LIMITER_CAT`, `applyLimiter`), `tuningParams()`. |
| `cars.js` | Tutte le auto. V40 col suo catalogo; le auto da disegno con il costruttore comune `GEN_CARS` + `GEN_DATA` + `genCar()`. Quadri strumenti in `CLUSTERS`. |
| `samples.js` | Lettore di campioni audio caricati dall'utente (solo Supra). |
| `car3d.js`, `street3d.js` | Vista 3D. |
| `street2d.js` | Tutta la grafica 2D in pixel art (classe `Street2D`), sfondi dei luoghi (`drawScenery`, `drawNearSide`), traffico, radar delle corsie. |
| `quartieri2d.js` | Quartieri della città (dopo `street2d.js`): elenco `Street2D.DISTRICTS` (tipi di palazzo, colori, insegne, foschia, lampioni, tinta), `districtAt`/`districtMix`, palazzi nuovi (`kindExtra`), punti di riferimento lontani (`landmark`), degrado (`decayTile`), cartello col nome (`districtBanner`). |
| `pilota2d.js` | Il protagonista (dopo `street2d.js`): guidatore di profilo col cappellino visto attraverso i vetri (`drawDriver`, `glassMasks` trova i vetri e la loro altezza sul disegno), contorno dell'auto del giocatore (`heroOutline`), foschia sul traffico (`hazeOf`). |
| `galleria2d.js` | Gallerie del Viaggio dove cambia il paesaggio (`VG_ROUTE`): `tunnelSpan`, `drawTunnelBack` (volta, piastrelle, luci, imbocchi nella montagna), `drawTunnelFront` (bordo vicino e penombra). |
| `luci2d.js` | Luci (dopo `street2d.js`): mappa di luce notturna (`lightAdd` raccoglie le sorgenti durante il disegno, `lightPass` le applica sotto i palazzi), coni dei lampioni (`lampCone`), bagliore a due livelli (`glowPass`). |
| `effetti2d.js` | Effetti del 2D (si aggancia a `Street2D`, va caricato dopo `street2d.js`): fumo a sbuffi, fiammata dello scarico, scintille, ombre proiettate, fascio dei fari, luci sulla carrozzeria (`fxCar`, `fxParts`, `fxFlame`, `fxShadow`, `fxBeam`, `fxBodyLight`), mattonella dell'asfalto (`roadTile`). |
| `dettagli2d.js` | Dettagli a densità doppia (dopo `effetti2d.js`): `tileHD` porta le tessere dei palazzi a 720 righe (spigoli arrotondati con Scale2x, grana, mattoni, riflessi sui vetri); `damaged` costruisce i danni sul disegno dell'auto. |
| `paesaggi2d.js` | Luci e dettagli dei paesaggi fuori città (dopo `dettagli2d.js`): si aggiunge a `drawScenery` dopo il disegno di ogni paesaggio. Bagliore dei paesi all'orizzonte (`pHorizon`), auto lontane (`pFarCars`), paesi e campanili illuminati e aie col lampione nella Bassa, torri di San Gimignano illuminate da sotto, faro col fascio che gira e traghetto a Positano, paese a valle con i tornanti e antenna a Hakone, treno merci col faro e torre radio sulla Route 66, lampeggianti sui grattacieli del Wangan; catarifrangenti sulle strisce che si accendono coi fari (`pStuds`). Ripete gli stessi calcoli di posizione di `street2d.js`. |
| `vita2d.js` | Vita e giochi di luce (dopo `paesaggi2d.js`), tre strati chiamati da `street2d.js`: `vitaSky` (stormi e scie d'aereo di giorno, fuochi d'artificio di notte su mare, paesi e a volte città, lampi di calore lontani), `vitaRoad` (foglie, cartacce, rotolacampo nel deserto, che l'auto solleva passando), `vitaFront` dopo la penombra (riflessi verticali di insegne e lampioni sull'asfalto, scintille sul bagnato, falene ai lampioni, lucciole, raggi di sole al tramonto, miraggio di giorno). Spento con qualità bassa. |
| `icone.js` | Icone degli oggetti in pixel art 32×32 (`NR_ICON(kind)`, `NR_ICON_TAG(kind)`): bagagliaio, negozio, locali, bacheca. Un oggetto nuovo vuole una voce in `DRAW` con lo stesso nome di `INV`. |
| `radio.js` | Radio. |
| `game.js` | Carriera (`StreetGame`): soldi, km, luoghi del mondo (`GAME_LOCS`), traffico (`GAME_TRAFFIC`), negozi e officine, polizia. Guidatori del traffico: `trafficDriver(e)` dà a ogni auto un carattere (`e.drv`: normale, prudente, aggressivo, centralista, distratto circa 1 su 12; distanza in secondi, accelerazione, frenata) e `trafficAccel(e, d, dt)` la guida (modello IDM con un tetto alla frenata: non più di quanto serve, fino a 8,5 m/s² in emergenza). Il distratto non vede il giocatore finché non è a 1,5 s dall'urto e frena al massimo 4,5 m/s²: è l'unico che tampona. Inchiodate oltre 5,5 m/s²: evento `{ k: 'skid', I, rel }` (gomme che stridono, `skidSound` in `index.html`, scritta SCREEECH!), luci dei freni da `e.acc`. In autostrada (viaggio o luogo `highway`) niente cambi di corsia a caso. Test in `test/traffico.test.js`. |
| `viaggio.js` | Il Viaggio (modalità principale): tappe, paesaggi, bisogni del guidatore, Motel Ovunque e la cassa, lavori, autostoppisti, capitoli ed eventi strani. Si aggancia a `StreetGame`; stato in `game.s.vg`. |
| `missioni.js` | Missioni del Viaggio dopo il primo lavoro (`VG_MISSIONS`, poi generate): bacheca, regole (fragile, tempo, calmo, pesante), obiettivo a schermo, stato in `game.s.vg.mis`. Mini tutorial del primo lavoro (`TUT_FIRST`, `TUT_TESTI`: finché non è finito, oltre il locale giusto ti riporta davanti, fermo) e, dopo, uscita saltata = consegna annullata. Caricato anche dai test. |
| `strada.js` | Abbaglianti per chiedere strada, eventi in prima corsia, traffico da autostrada (`trafficAI`): si tiene la destra, si sorpassa a sinistra controllando chi arriva forte da dietro (anche il giocatore); l'aggressivo bloccato in corsia di sorpasso si attacca e sfanala (`e.flashT`, messaggio al giocatore), e se dura supera a destra; il centralista sta in seconda corsia; i pesanti non vanno mai in terza e sorpassano anche per poca differenza (a volte nascono a coppie: gara tra pullman). Nel viaggio circa uno su sei mette la freccia, frena con calma e parcheggia in corsia 0 davanti alla tappa (`e.exitX`, `e.parked`). Velocità e distanze le decide `trafficAccel` in `game.js` (lì anche i curiosi: accanto a incidenti e posti di blocco tutti rallentano). |
| `viaggio2d.js` | Grafica 2D del viaggio: bar, autogrill, motel, autostoppisti, cippi, cartelli, rimorchio, colpi di sonno. |
| `menu.js` | Schermata di gioco compatta (dopo lo script principale): sposta i pannelli della pagina in un menu a schede (Tab o pulsante MENU, Esc chiude), messaggi sopra la strada, comandi al tocco (solo `pointer: coarse`): FRENO e GAS in basso a destra con sopra le palette del cambio ▼/▲ e la marcia in mezzo, ◀ ▶ affiancati a sinistra, AVVIA rotondo accanto al cruscotto (sparisce a motore acceso). Mandano i tasti s/w/q/e come eventi già tradotti (`_nr`), così i tasti cambiati in TASTI non li bloccano. Sempre al tocco (`html.tdash`, deciso all'avvio): TASTI nascosto; quadro `#hudP` spostato in alto a sinistra in `.tcock` con AVVIA accanto; in basso a sinistra `.tbar` con STRUMENTI e DATI che aprono due finestrelle (`.tpan`): STRUMENTI è `#dash` stesso con le file AUTO/TC/... e quelle di `comandi.js` a tessere con icona, DATI contiene `.hud-l` (ora, lavoro, bisogni, carico); un tocco sulla strada le chiude; SCHERMO INTERO nella barra in alto (`#fsTop`, usa `#fsBtn`); a schermo intero `.fsdock` tiene MENU e TELEFONO accanto al pulsante per uscire; in verticale l'avviso "Gira il telefono" (`.gira`, "Gioca lo stesso" lo toglie). `window.gameMenu.open('bagagliaio')`. | Al tocco la finestrella STRUMENTI ha anche la tessera LEGGERA (`#tLeg`, passa la qualità `#q3d` a `leggera` e torna a quella di prima).
| `tasti.js` | I tasti (prima di `menu.js`): elenco dei comandi `TASTI` (id, tasto originale, cosa fa, gruppo), schermata per cambiarli (pulsante TASTI accanto a MENU e TELEFONO), salvati in `localStorage` (`nr_tasti`). Il tasto scelto si traduce in quello originale prima che lo veda il resto del gioco (ascoltatore in cattura, il primo registrato). `window.nightTasti.open()`. |
| `telefono.js` | Il telefono (dopo `menu.js`): smartphone sopra la strada, tasto 0 o pulsante TELEFONO. All'inizio solo Telefono, Messaggi, Rubrica, Mappa, Foto, Orologio. Lavori (bacheca e consegne vere), Passeggeri e Motel si scaricano: `TEL_APP_OFFERS` mette un cartellone luminoso sulla strada (entità `vgsign` con `app`, disegnata in `viaggio2d.js`), quando lo superi spunta l'icona e il download è finto. Le app strane (Ultima Uscita, Segreteria) compaiono da sole con la storia, senza scaricarle. `TEL_SMS` (messaggi per km), `TEL_ATTI` (km dei momenti della storia), `window.telefono.sms/ring/open/setAtto`. Grafica in Shadow DOM. Test in `test/telefono.test.js`. |
| `chat.js` | Le chat del telefono (dopo `telefono.js`): conversazioni a bivi con 2-3 risposte (nodi in `CHAT_LIST`: `id`, `who`, `text`, `alt`, `opts` con `tono`, `fx`, `req`), barra di CONFIDENZA per persona (soglie 25/50/75/100 che sbloccano altre conversazioni, `CHAT_UNLOCK`), gusti che si scoprono dalle reazioni (`CHAT_NPC.gusti`), chat ignorate che aspettano, "sta scrivendo…", rubrica a schede con barre, la presenza con la sua barra rossa. Motore puro (`chatTick`, `chatReply`, `chatOptions`, `chatSetConf`) sullo stato `game.s.chat`, grafica agganciata a `telefono.js` con `window.telefono.setMessages`. Formato dei nodi e degli effetti in testa al file. Test in `test/chat.test.js`. |
| `chat_dati.js` | I dati delle chat (prima di `chat.js`), **generati** da `strumenti/importa_chat.py` a partire dal materiale scritto da Codex: `CHAT_LIST` (982 nodi: le 28 conversazioni ampliate, 15 di soglia, 18 nuove, 12 delle città, domande di casa, scene; la presenza che imita Elena e zio Claudio), `CHAT_START` (86 ingressi da `11_ATTIVAZIONE.json`: km segnaposto, flag, `fatto:`), `CHAT_TONI_MAP` (toni dalla tabella di Codex), `CHAT_UNLOCK`. Sorgenti e comando di rigenerazione in `materiale_chat/RIGENERA.md`. Non si modifica a mano: si rigenera con `python3 strumenti/importa_chat.py <file.txt> [altri.txt] [--toni tabella.txt]`. Le conversazioni che aspettano eventi non ancora fatti hanno la condizione `flag:ev_...` (per provare: `chatDebug.flag('ev_fase_v')`). |
| `capitali.js` | Le dodici capitali del Viaggio (dopo `chat.js`): `CAP_ORDER`, `CAP` (nome, arrivo, quartieri), `CAP_PENS` (pensieri dei tratti). Entrando in una capitale: avviso d'arrivo e flag chat `luogo_<id>` che fa partire la sua conversazione; uscendone, il pensiero del tratto. Rotta in `VG_ROUTE` (`viaggio.js`), luoghi in `GAME_LOCS` con `cap: true` (fuori dalla mappa del mondo). Test in `test/chat.test.js`. |
| `regia.js` | La regia delle conversazioni (dopo `capitali.js`): stati attuali `patto`/`varco`/`affidamento` con flag-specchio (`regiaSet`, `regiaOnFlag`, agganciato a `chatApply`), domande di casa (`regiaCasaEntry` sceglie `V2_CASA_0n`, `_P` se la voce è imitata, `_M<mask>` per le domande rimaste; `regiaTick` le propone dopo la loro conversazione, fase IV), scene manuali (`regiaScena`: Marco, 4 fallimenti, uscita, guardia, varco, vicino), costi di Marco, conseguenze una volta sola (`regiaFallimento`), `regiaVicinoConfermato` (il solo che verifica Elena), epiloghi B1/B2 a tutto schermo (`regiaEpilogo`). Prova: `regiaDebug.epilogo('B1')`, `.scena(id)`, `.fallimento(n)`, `.casa(n)`. Test in `test/regia.test.js`. |
| `storia.js` | Il regista della storia (dopo `regia.js`): fasi dalle capitali raggiunte (`storiaFase`), momenti garantiti (`STORIA_BEATS`: impostano i flag `ev_*` che aprono le chat), quattro incursioni a tempo (`STORIA_INC`: lampade che si spengono, metri alla porta, sottotitoli di Rosa; menu e telefono fermano il tempo; fallimento = `regiaFallimento`), offerte con `ask` (Il passaggio, Tornare con qualcuno con la scena dei costi di Marco, Recuperare, Il varco, il vicino di Elena fino a tre volte), uscita autentica, **L'ultima porta** a Washington D.C. (`vgPorta`: Esci/Apri/Chiudi/Resta con motivo se grigi) e i cinque finali A, B1, B2, C, D con epilogo (`STORIA_EPI` per A, C, D, scritti da me: da rivedere). Stato in `game.s.vg.story`. Prova: `storiaDebug.inc(n)`, `.fine(true)`, `.porta()`, `.flag(f)`, `.stato()`. Test in `test/storia.test.js`. |
| `comandi.js` | I comandi dell'auto (dopo `storia.js`): seconda fila di pulsanti sotto AUTO/TC/LAUNCH, solo quando servono: RIMORCHIO (aggancia/sgancia, lo sgancio controlla slot e chili), TURBO (pressione ECO 70 % / NORMALE / FORTE 115 %, solo con un turbo montato, agisce su `sim.boostCtl`), SCARICO (valvola aperto/silenzio da potenza ≥ 1,05: silenzio = volume dimezzato e niente scoppi), NEON (accende/spegne il neon montato da Neon Kustom, `Street2D.neonOff`). Stato in `game.s.cmd`. Accensione con un tocco: pulsante AVVIA/SPEGNI sulla strada (computer) e AVVIA rotondo accanto al cruscotto (telefono, `menu.js`, sparisce a motore acceso), `engineTap()` in `index.html` (gira la chiave e tiene l'avviamento finché il motore non gira; da fermo spegne). Il pulsante FARI sopra il contachilometri cicla spenti / anabbaglianti / abbaglianti (`game.s.cmd.lights`, 0-1-2, di partenza 1; lo stato di render ha `high` e `lamps`); il tasto F sfanala solo per un attimo (`S.flash`). Test in `test/comandi.test.js`. |
| `pensieri.js` | I pensieri del protagonista (dopo `missioni.js`): un testo in basso, accanto alla barra dell'autostrada (che è stretta apposta); dove non c'è spazio sta in basso a destra, alzato sopra pedali al tocco, riquadro del cambio e bottone corsia; nascosto col menu, il prologo e il telefono aperti; 8-10 s, senza vignetta, che dice cosa pensa. `PENS_KM` (a un certo km: la radio a 1 km...), `PENS_BISOGNI` (fame, sete, sonno, igiene, a due livelli), `PENS_ANIMO` (a caso, una volta sola per partita). Non si ripetono (mazzo mescolato), pausa minima 25 s, tace in un locale, davanti a una domanda e da fermi. Testi segnaposto. `game.vgThink(testo)` per la storia, stato in `game.s.vg.pens`. Test in `test/pensieri.test.js`. |
| `valigette.js` | Le valigette (dopo `telefono.js`): app Valigette nel telefono (negozio bronzo/argento/oro, le mie, premi), sei rarità (`CASE_RAR`), probabilità e prezzi (`CASE_TYPES`), premi (soldi, oggetti, ticket tagliando e modifica, potenziamenti a tempo e per sempre via `sim.extraPw`, pezzi veri, kit turbo, auto in regalo), garanzia, ricompense dai lavori (`caseRewards`), scena d'apertura a tutto schermo con suoni sintetizzati (`window.valigette.play`, prova: `window.valigette.demo('oro', 5)`). Stato in `game.s.cases`. Test in `test/valigette.test.js`. |
| `interni.js` | Gli interni dei sette locali (dopo `valigette.js`): scena in pixel art a tutto schermo quando entri (U) in bar, grill, motel, benzinaio, Luca, Niko e Style, con chi ti serve che si muove, luci, insegne al neon, la notte e il traffico fuori, pioggia, la tua auto parcheggiata e suoni d'ambiente. `NightInterni.open(place)` / `.close()`, scene in `SCENE` (`focus`, `static`, `dyn`, `hot` = punti toccabili che portano alla sezione del pannello). Si inquadra nello spazio lasciato libero da `#placeBox`. |
| `traguardi.js` | I traguardi (dopo `interni.js`): elenco `TRG_LIST` (id, nome, testo, premio soldi o valigetta, `check`), controllo 4 volte al secondo (`game.achStep`), avviso dorato con suono, app Traguardi nel telefono (Da fare / Fatti, barre di avanzamento). Stato in `game.s.ach`. Prova: `window.traguardi.demo(3)`. Test in `test/traguardi.test.js`. |
| `ruota.js` | La ruota giornaliera (dopo `traguardi.js`): un giro al giorno dall'app Ruota del telefono, 12 spicchi (`RUOTA_SEG`, pesi in percento), premio grosso un'auto sportiva in regalo (`RUOTA_CARS`, 1 %), il resto soldi, valigette, ticket e potenziamenti (riusa `CASE_GIVE` di `valigette.js`). Serie di giorni di fila, ogni 7° il giro d'oro senza premi comuni. Scena a tutto schermo con lancetta, pioli, luci e premio. Stato in `game.s.ruota`. Test in `test/ruota.test.js`. |
| `concessionario.js` | L'Autosalone Notte (dopo `ruota.js`): tappa nuova del viaggio al posto del terzo bar di ogni giro (`VG_PATTERN[8]`, primo al km 27,4). Salone con le auto di `VG_SHOP` (sbloccate coi km), schede tecniche calcolate dal modello del motore (`dlSpec`), occasione della tappa −15 % (`dlDeal`), acquisto in contanti o a rate (`dlBuy`, rate ogni 10 km in `dlTick`, mora, carro attrezzi alla 3ª saltata), vendita con valutazione da km, danni e pezzi (`dlValue`, `dlSell`), giro di prova di 3 km (`dlTestStart`). Costanti in `DL`. Pannello (`NightDealer.panel`), facciata sulla strada (avvolge `Street2D.drawTripPlace`). Scena dell'interno in `interni.js` (`SCENE.dealer`). Le auto non si comprano più al motel. Test in `test/concessionario.test.js`. |
| `usato.js` | L'usato dei privati (dopo `concessionario.js`): annunci legati alle tappe (`usAt(n)`, 40 % delle tappe, sempre uguali), app Annunci nel telefono, l'auto col cartello VENDESI davanti alla tappa, sezione dell'annuncio nel pannello di qualunque locale (`NightUsed.panel`, aggiunta in fondo a `openPlace`): guardala, fai un giro, chiama Niko (€ 120), tratta una volta (−10/−20/−30 %, più facile coi difetti scoperti), compra. Difetti nascosti in `US_DEF` (carrozzeria, gomme, freni, olio, motore stanco −15 % fino alla revisione da Niko, km scalati). Tiene il conto del guadagno rivendendo all'Autosalone. Stato in `game.s.vg.usato`. |
| `sfascio.js` | Lo sfasciacarrozze Sfascio Ruggine (dopo `usato.js`): tappa nuova al posto del secondo autogrill (`VG_PATTERN[9]`, primo al km 30,6). Rovistare (€ 20, una volta per tappa, `JK_FINDS`), pezzi usati per l'auto che guidi al 45 % (più a volte uno raro), la carcassa da rimettere in strada (20 % del prezzo, con preventivo di riparazione e valore dopo), rottamazione a peso. Costanti in `JK`, stato in `game.s.vg.sfascio`. Scena in `interni.js` (`SCENE.junk`). Test di usato e sfascio in `test/usato.test.js`. |
| `garage.js` | Il garage (dopo `sfascio.js`): app Garage nel telefono (le tue auto con categoria, km, CV, stato a barre, avvisi, valore; collezione in `game.s.vg.coll` (`garColl`), traguardi da collezionista aggiunti a `TRG_LIST` (cinque marche, una per categoria, ricomprare le cinque auto dello zio non scelte, che finiscono in salone). Categorie `ST_CAT`/`stCat` in `strada.js`: usate da Garage e documenti (niente più sfide). Test in `test/garage.test.js`. |
| `documenti.js` | I documenti (dopo `garage.js`): per ogni auto assicurazione, bollo e revisione con la scadenza in km (`game.s.cars[id].docs`, `docs`, `docScaduti`, `docCosto`, `docPaga`). L'ereditata ha tutto scaduto; dall'Autosalone in regola; dal privato senza assicurazione; dallo sfascio niente. App Libretto (assicurazione e bollo si pagano dal telefono, bollo arretrato +30 %), revisione da Niko (`NightDocs.panel`), controlli ai posti di blocco in prima corsia (`docControllo`, multe in `DOC.multa`). Traguardo In regola. Costanti in `DOC`. Test in `test/documenti.test.js`. |
| `prologo.js` | Il prologo a inizio Viaggio (dopo la schermata iniziale): lettera dello studio notarile, E36 blu che arriva, colloquio col notaio, scelta dell'auto tra le sei del garage (Panda, Audi 80, V40, Grande Punto, Corsa, Polo: quella scelta diventa l'auto del Viaggio, malconcia), l'auto scelta in autostrada. Scene in pixel art su tela 640×360 con testi in HTML sopra. `PRO_LETTERA`, `PRO_NOTAIO`, `PRO_AUTO` (testi e auto, segnaposto), `NightPrologo.play/jump/shouldPlay`. Parte da `goBtn` in `index.html` se `game.s.vg.prologo` non c'è ancora. Test in `test/prologo.test.js`. |
| `index.html` | Interfaccia, quadro strumenti, impostazioni, mappa del mondo, ciclo principale (molto grande). |
| `img/` | Disegni delle auto: `<id>.png`, `<id>_wheel.png`, `<id>_paint.png`; `img/stickers/manifest.json`. |
| `audio/`, `models/` | Suoni e modelli 3D liberi già nel progetto. |

Densità doppia: con qualità alta la tela interna è a 720 righe (`Street2D.SS = 2`, `fitLo()`), ma le coordinate
di disegno restano quelle a 360: ogni unità vale 2×2 pixel veri. Quindi: niente `g.setTransform` diretto sulla tela
(usa `this.tf(g, ...)`), le carrozzerie si disegnano con `this.body(g, spr, x, y)` (pesca dal disegno a grandezza
piena), per un dettaglio fine si disegna a mezze unità (`1 / this.SS`), e chi copia dalla tela `this.lo` deve
moltiplicare le coordinate sorgente per `SS`. Con qualità bassa o leggera, o se il dispositivo è lento (`this.slow`), `SS` è 1.

Convenzioni della grafica 2D: canvas logico alto 360 px, strada tra y 236 e 336, 30 px per metro (`PPM`),
`Street2D.rnd(n)` per il caso deterministico (niente `Math.random` per ciò che deve restare fermo), testi a pixel
solo in maiuscolo ASCII (`PX_FONT`). Le auto guardano a destra.

Per aggiungere un'auto: voce in `GEN_CARS` (motore, cambio, turbo, `voice`, `shiftK`, `hesK`), sprite e coppia in
`GEN_DATA`, immagini in `img/`, voce in `CLUSTERS`.

## Skill di Night Run (`.claude/skills/`)
Procedure del progetto scritte per gli assistenti: Claude Code le carica da sola; gli altri (Kimi...) leggano il
`SKILL.md` giusto prima di cominciare.
| Skill | Quando |
| --- | --- |
| `night-run-prova` | dopo ogni modifica: test, prova nel browser a copione (`strumenti/prova.js`), foto, rapporto |
| `night-run-funzione` | una novità di gioco: file nuovo, tappa, app del telefono, interno, traguardo, stato, test |
| `night-run-pixel` | prima di disegnare nel 2D: coordinate, stile, luci, facciate, interni |
| `night-run-audio` | suono del motore: `strumenti/ascolta.mjs` lo registra in WAV fuori dal browser e lo misura |
| `night-run-auto` | un veicolo nuovo dai disegni del proprietario |
| `night-run-pubblica` | commit, push diretto su `main`, artifact, documentazione |
| `night-run-sera` | controllo della sera: cosa è cambiato su `main` dall'ultima volta, test, prova (`strumenti/controllo_sera.sh`) |
| `night-run-storia` | dove si scrive la storia e cosa non deve fare un assistente |
| `night-run-controllo` | controllo del gioco con voti per area e proposte |

Skill nuove o modificate si fanno sul ramo **`skill`** (partito da `main`): una cartella
`.claude/skills/<nome>/SKILL.md` con `name` uguale al nome della cartella e una `description` che dice quando usarla,
una riga nella tabella qui sopra, poi uniscile su `main` (direttamente, come il resto). Prima di cominciare porta `skill` in pari con `main`.

Strumenti: `node strumenti/prova.js [--mob] [--out cartella] passo...` (per esempio
`tappa:junk entra foto:dentro stato`; elenco dei passi in testa al file) e
`node strumenti/ascolta.mjs <auto> <minimo|sgasate|allungo|crociera|limitatore|urti> <file.wav> [vista] [ambiente]`.

## Plugin ECC (Everything Claude Code)
`.claude/settings.json` attiva il plugin `ecc@ecc` (repository `affaan-m/everything-claude-code`): aprendo la
cartella in Claude Code e dando fiducia al progetto, Claude Code propone di installarlo. Le sue rules non sono
copiate qui apposta. Se una skill o un agente di ECC dice altro (commit in inglese, copertura test all'80 %, npm,
TDD obbligatorio), valgono le regole di questo file e le skill di Night Run.

## Regole
1. `main` è il ramo pubblicato su GitHub Pages. Il progetto è del proprietario e del cognato insieme: **tutti e due
   caricano direttamente su `main`, senza pull request e senza approvazione**, e il cognato può aggiungere, cambiare
   ed eliminare quello che vuole. Prima di caricare: `git fetch origin main` e unisci (`git merge`), tenendo il
   lavoro dell'altro; mai `push --force`, mai riscrivere la storia di `main`. I test devono passare e, se tocchi il
   gioco, provalo nel browser (`night-run-prova`). Un ramo a parte serve solo se vuoi (lavori lunghi, prove): lo
   unisci tu quando è pronto. Se la sessione ti assegna un ramo di lavoro, lavora lì e poi unisci su `main`.
   Ogni sera, prima di un lavoro nuovo, si fa il **controllo della sera** insieme (skill `night-run-sera`).
   **Per stare in pari**: all'inizio di ogni sessione l'hook `.claude/hooks/session-start.sh` scarica `main` (e si
   aggiorna da solo se può farlo senza rischi) e mostra novità, lavori in corso e diario. Quando cominci un lavoro
   aggiungi una riga a `INCORSO.md` e caricala subito; quando finisci togli la riga e scrivi 2-3 righe in cima a
   `DIARIO.md` (fatto, aperto, cosa serve dall'altro). Ogni commit finisce con una riga `Per: proprietario` o
   `Per: cognato` (chi ha chiesto il lavoro), prima delle righe Co-Authored-By: così il controllo della sera sa chi ha
   fatto cosa. Su GitHub i test girano da soli a ogni caricamento (`.github/workflows/test.yml`): se arriva l'email
   di test falliti, si sistema prima di tutto il resto.
2. Commenti, testi del gioco e messaggi di commit in italiano, nello stile del codice esistente.
3. Nel repository niente file presi da mod di giochi o senza licenza (suoni, modelli, immagini): l'utente li carica
   in locale nel browser (IndexedDB). Niente copie di grafica, nomi o personaggi di giochi esistenti.
4. Modifiche mirate: non riscrivere file interi senza motivo, non cambiare ciò che funziona se non è richiesto.
   Parametri nuovi del suono e della fisica con valori di default che lasciano Supra e V40 come sono.
5. Modificando un file con uno script: leggi tutto, cambia in memoria, scrivi una volta sola (una scrittura a metà
   ha già troncato dei file).
6. Prima di cambiare qualcosa leggi per intero i file coinvolti: un'auto o un pezzo passano da più file.
7. **Il gioco è pensato per il PC.** Il telefono serve solo a proprietario e cognato per provare quando non hanno il
   computer (al lavoro): i comandi al tocco sono uno strumento di prova. Grafica, fluidità, suono e sensazione di
   guida si giudicano sul PC; sul telefono si provano trama, missioni, negozi, menu e logica. Non si toglie niente
   alla versione PC per far girare meglio il telefono: se una scelta va bene sul PC e male sul telefono, vince il PC.
   Per provare da telefono senza scatti c'è la qualità **leggera** (impostazioni o tessera LEGGERA in STRUMENTI al
   tocco): densità normale e niente bagliore, il resto come in alta.

## Skill per la grafica (`.claude/skills/`)
Claude Code le carica da solo quando servono; provenienza e licenze in `.claude/skills/FONTI.md`.
- `game-feel`: il "succo" del gioco (scosse, fermo immagine, easing, lampi, effetti a strati). Senza esagerare:
  niente lampi forti e ripetuti a schermo intero.
- `create-game-assets`: guida di stile e controllo di coerenza dei disegni. Gli script in Python servono solo
  per i controlli in locale e non entrano nel gioco.
- `pixel-art`: palette, dithering, contorni, animazione a pixel.
Le regole di questo file valgono sopra le skill (testi in italiano, niente npm, niente grafica copiata da altri giochi).
In particolare: le convenzioni di disegno di Night Run sono in `night-run-pixel` e valgono sopra `pixel-art` (che
dice di "correggere" l'utente: le scelte di stile del proprietario non si correggono, al massimo si consiglia);
`create-game-assets` parla di immagini generate con l'IA: **i veicoli vengono solo dai disegni del proprietario** e
niente immagini generate entra nel gioco senza che il proprietario lo chieda; gli esempi in Godot e Unity di
`game-feel` vanno tradotti nel canvas di `Street2D` (scossa = spostamento della telecamera, non dell'auto).

## Come provare
- Test automatici (dalla radice del repository, Node 22+): `node --test test/motori.test.js test/telefono.test.js test/valigette.test.js test/traguardi.test.js test/ruota.test.js test/concessionario.test.js test/usato.test.js`.
  Oggi passano tutti i test (`node --test test/*.test.js`: 145, compresi traffico, telefono, chat, prologo, valigette, traguardi, ruota, concessionario, usato, sfascio, urti, eredità, garage e documenti). Non peggiorare il conteggio.
- Nel browser: dalla radice del repository lancia `python3 -m http.server 8765` e apri
  http://localhost:8765/index.html. Tab apre il menu (officina, bagagliaio, guida, vista...). Comandi: I quadro, Invio avviamento, W gas, S freno, E/Q marce, A/D corsie,
  T mappa del mondo, J strumenti, L launch, Z schermo intero. Controlla che la console non abbia errori.
- Grafica: ogni modifica a qualcosa che si vede va guardata, non immaginata. Fai uno screenshot del gioco nel
  browser (Playwright o il browser di Claude Code) prima e dopo, e confrontali; se non puoi farlo, dillo nel
  riassunto.
- Alla fine scrivi un riassunto breve: cosa hai cambiato e dove, cosa hai provato, cosa non hai potuto provare.
