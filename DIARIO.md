## 24/11/2026 · proprietario (Nico) · v0.143 (**fiamme dello scarico a scelta da Luca Tuning**)
- Officina di Luca, scheda nuova **Fiamme** (`officina.js`, `drawFiamme`): cinque kit più «Come viene» (`FIAMME_KIT` in `fiamme.js`): **Ossidrica blu** € 1.800 (getto blu col cuore bianco), **Lanciafiamme** € 2.600 (lunga e piena, arancio e gialla), **Mitraglia** € 1.500 (botti a raffica), **Smeraldo** € 3.200 (verde), **Neon viola** € 3.600 (viola e rosa con lingue blu). Ogni scheda ha l'anteprima animata (gli stessi disegni della strada: `fxFlameV`, `fxTorch`, `fxBang`). Si compra una volta e si rimonta gratis su ogni auto (`game.s.fiamme`, `fiammeMonta`, `fiammeKit`).
- Come i kit veri le fiamme escono **da qualunque auto**, anche di serie, al rilascio e al limitatore (`index.html`: `fkit` arma il rilascio e il limitatore; `effetti2d.js`: tipo con `fiammeScegli`, colore con `fiammePal`, tavolozze nuove `verde` e `viola` con luce e palline di fuoco dello stesso colore). Con la valvola dello scarico in silenzio niente. Senza kit tutto come prima. Test in `test/fiamme.test.js` (413).
- Aperto: guardarle sul PC; prezzi da rivedere se sembrano troppo alti o bassi.

## 24/11/2026 · cognato · v0.142 (**suono di turbo, cambiate e aspirazione**)
- Turbo: la nota della girante non è più un fischio fisso a 5-9 kHz ma aria intorno a una nota più bassa, con le bande dell'albero, che sale dentro ogni marcia e cala alla cambiata; forte mentre prende giri, più calma a pressione ferma; sotto un «vooosh» grave che cresce coi bar. Aria del compressore più cupa (prima più di metà dell'energia era fruscio sopra i 6 kHz). Cambiata: innesto metallico + botta della trasmissione + leva. Aspirazione: cassa del filtro, tubo, aria che pulsa coi cilindri, «whoomp» al colpo di gas. Anelli dei campioni di turbo, compressore e cambio rifatti (CMP_VER 5). Manopole in `DSP_TB`/`DSP_CB` (`dsp.js`). **Scarichi e collettori non toccati** (il test dei livelli degli scarichi ora misura il solo scarico).
- Aperto: va ascoltato sul PC (sei MP3 prima/dopo mandati a Luca); la Supra di serie ha il soffio del turbo più basso di prima (~3 dB(A)): era quasi tutto fruscio acuto.

## 24/11/2026 · proprietario (Nico) · v0.141 (**interfaccia Street Racing**)
- Riquadro Partita con garage notturno e sprite dell’auto, obiettivo prima delle statistiche, navigazione a pixel e barra compatta al tocco. Lo stile si sceglie in Impostazioni → Grafica.
- Avvisi, domande, quartieri, capitali e traguardi usano pannelli opachi con icone a pixel, titoli leggibili e colori per tipo. Gli avvisi usano la stessa scadenza per la barra visiva e per la coda.

## 24/11/2026 · proprietario (Nico) · v0.140 (**quadri originali di V40, Supra ed E30**)
- Tre quadri in **Originale dell’auto**: Volvo con display verde e strumenti a destra, Supra con contagiri centrale, BMW con scala ambra e contachilometri a rulli. Le cornici e i quadranti fissi sono memorizzati in cache.
- Il totale dei chilometri legge il salvataggio della singola auto anche nel quadro grande; il contatore del viaggio continua a mostrare la distanza della partita.

## 24/11/2026 · proprietario (Nico) · v0.139 (**scritte sulla strada: tre interruttori**)
- Impostazioni → Grafica → **Scritte sulla strada** (riquadro nuovo, `menu.js`): **Scritte da fumetto** (gli sticker che escono dalla marmitta, urti, frenate e il lampo PERFETTA!; è il vecchio «Grafiche anime», `S.anime`), **Versi del pilota** (le vignette «VRAAAAM!» sopra la testa e la faccia stupita, `S.reazioni` → `street2d.reaOn` in `reazioni.js`; prima si spegnevano insieme ai fumetti: chi li aveva spenti li trova ancora spenti), **Pensieri** (tutti / solo la storia / spenti, `S.pensieri` → `game.pensMode` in `pensieri.js`).
- «Solo la storia» tiene i pensieri della trama (capitali, eventi strani, Jeshka, la notte: `vgThink(testo, true)`). Con «spenti» gli eventi strani che erano un pensiero escono nel riquadro della domanda, e le frasi di Jeshka e dello specchietto come avviso: la storia non si perde. Test nuovo in `test/pensieri.test.js` (410).

## 24/11/2026 · proprietario (Nico) · v0.138 (**i 60 fps anche fuori città, controllo nella prova di fumo, schermata iniziale**)
- **Paesaggi**: contando i comandi di disegno paesaggio per paesaggio (densità doppia, notte) le capitali erano a 1.100-1.900, ma fuori città 3.100-6.700: tralicci, cavi, pioppi, cedri, il Fuji, le mesas, i cipressi, la gru e la rete dello sfascio, il ponte del Wangan si disegnavano pixel per pixel a ogni fotogramma. Ora ogni forma è una figura sola (`batch(g, fn)` in `street2d.js`: rettangoli raggruppati per colore; `ridge`, `text`, `drawNearSide`, `paesaggi2d.js`, `vita2d.js`, `sfascio.js`): tutti i paesaggi tra 830 e 1.900. Stesso fotogramma prima e dopo: differenza media sotto 0,2 su 255 (qualche pixel dove due linee trasparenti si incrociano). Provato e scartato un «raccoglitore» generale dei fillRect (`lotti2d.js`): nel browser senza scheda video rallentava del 12-15 %.
- **Controllo** (punto 1): passo `comandi:N` in `strumenti/prova.js` (conta i comandi di 60 fotogrammi, fallisce sopra il tetto) e nella prova di fumo a San Gimignano di notte con la pioggia a densità doppia, tetto 2.600 (oggi ~2.000). Provato che fallisce col tetto basso.
- **Schermata iniziale** (`titolo.js`): al telefono in orizzontale il cruscotto sta a destra, più piccolo, e non esce dallo schermo (Pixel 7, iPhone 13, iPhone SE: sospeso 26 chiuso); l'auto prende la luce della scena (fredda dal cielo, calda dal lampione), ha il contorno scuro e il riflesso sull'asfalto, un lampo sul faro; per una partita nuova c'è la E36 blu del prologo (disegno ad alta definizione: la V40 ha solo quello piccolo), per una partita cominciata l'auto che guidi; sfondo con foschia sulla città lontana, bagliore all'orizzonte, riflessi delle luci della città sull'asfalto, fari di ricerca più morbidi (non tagliano più il logo). `NightPrologo.arte` dà anche `recolor` e `load`.
- Aperto: guardare sul PC fuori città (Wangan, Bassa, Route 66) che restino 60 fps.

## 24/11/2026 · proprietario (Nico) · **prova sul PC: 58-60 fps**
- Dopo i tre giri sulle prestazioni (v0.131-v0.137) Nico misura **58-60 fps** sul suo PC (prima 11-24). Obiettivo raggiunto, sospeso 27 chiuso.

## 24/11/2026 · proprietario (Nico) · v0.137 (**prestazioni, terzo giro: meno comandi alla scheda video**)
- Contati i comandi di disegno di un fotogramma (notte, pioggia, Roma): **3.877 `fillRect`**, 281 `drawImage`, 80 sfumature rifatte, ~2 tele nuove (gli sbuffi di fumo, finché la loro scorta non è piena). Una scheda video paga ogni comando: tanti rettangoli piccoli costano molto più dei loro pixel. Ora si riempiono in una figura sola: pioggia (1.300 → 1), `span` (le ellissi a righe: nuvole della pioggia, ombre, 760 → 1 per ellisse), riflessi sull'asfalto in 6 livelli di trasparenza (`vitaRiflessi`, ~350 → pochi), riflesso tremolante dei lampioni, sampietrini di Roma (~280 → 2). Totale ~900 `fillRect`. Stesso fotogramma prima e dopo: differenza media 0,1 su 255.
- Nel browser di prova (senza scheda video, anche quella «emulata» è software) non cambia niente, come previsto: lì conta solo il numero di pixel. Sul PC vero conta il numero di comandi: va visto sul contatore.
- Aperto: «30 fps esatti» su uno schermo a 60 Hz vuol dire fotogrammi appena sopra i 16,7 ms (il browser ne mostra uno ogni due rinfreschi) oppure browser senza scheda video. Serve la riga del **Contatore FPS** (Impostazioni → Grafica) dal PC vero: fps, ms del gioco, della strada, del browser e nome della scheda video (sospeso 27).

## 24/11/2026 · cognato · v0.136 (**proposta: progetto impennata**)
- `docs/fisica/IMPENNATA.md`: impennata solo se la fisica lo permette (μ_eff·G ≥ b/h), trazione posteriore, slick calde, 4-link, peso dietro, colpo della frizione; pioggia e trazione anteriore no; grafica a taglio verticale con tetto a 8°; interruttore «Progetto impennata» in Sviluppatori (spento = gioco identico); piano in 6 passi e 5 domande per Luca. Nessun codice cambiato.

## 23/11/2026 · cognato · v0.135 (**risposte sulle capitali**)
- Luca ha risposto alle sei domande di `docs/storia/PROPOSTA_CITTA.md` (sezione 5): collegamenti veri all'inizio e strani più avanti; momenti forti a Roma (Colosseo), Washington (obelisco), Tokyo (torre di luci), Vienna da decidere; bivi come progetto futuro (`SOSPESI.md` 28); la storia va confermata tutta con Nico. Tolto l'avviso per Luca, messo quello per Nico.

## 23/11/2026 · proprietario (Nico) · v0.134 (**prestazioni, secondo giro**)
- Fatto (da 11-24 fps verso 50-60, senza togliere animazioni; unito col primo giro della chat di Luca, v0.131-v0.133): **la tela dello schermo** non è più grande quanto lo schermo (con 4K o lo zoom di Windows anche 8 milioni di pixel a passata) ma un multiplo intero della scena (×2 a densità doppia, ×3 a quella normale, `fitScreen` in `street2d.js`): si disegna in una passata a pixel netti e il browser la porta alla misura vera con la scheda video (`image-rendering: auto`); prima erano due passate e una tela d'appoggio da 3,7 milioni di pixel. Bagliore, colori e vignettatura sulla tela interna **anche con lo zoom della ripresa** (tra 60 e 160 km/h c'è quasi sempre: prima si tornava alla strada lenta a tutto schermo). Bagliore: i due livelli sommati su una tela piccola e poi una passata sola (`nitido2d.js`). Quadro strumenti grande quanto si vede (era quasi tre volte i pixel, `drawHudPro`). Il gradino automatico delle Prestazioni ricordato da prima si rimisura una volta (`PREST_RIMISURA`). Strumento `strumenti/misura_fps.js` (fps, stili e layout per fotogramma, `--sonda` per funzione, `--profilo` della CPU, `--js` per spegnere una cosa, `--gpu`).
- Misure nel browser di prova (senza scheda video, quindi più lento di un PC vero; contano i rapporti), 1920×1080, notte, pioggia, città: gradino più basso **da 19,6 a 47,6 fps**, densità doppia **da 10,5 a 18**, «Automatica» da ~15 a ~35-40. Stesso aspetto (stesso fotogramma confrontato con la vecchia strada: differenza media 4 su 255). Test 409, prova di fumo, foto di notte, giorno, fermi al bar, entrata, interno.
- Aperto: guardare il contatore FPS sul PC vero (sospeso 27). Se a densità doppia resta sotto i 50, la prossima cosa sono le carrozzerie e i passanti (tanti disegni piccoli).

## 23/11/2026 notte · cognato · v0.133 (**quale scheda video**)
- `index.html` (`GPU`, accanto a `fpsTick`): legge da WebGL la scheda video che usa il browser e la scrive nel contatore FPS; se è un rendering software (SwiftShader, llvmpipe, «Basic Render Driver») scrive SENZA SCHEDA VIDEO e all'avvio dà un avviso con come riaccendere l'accelerazione grafica. Il Canvas 2D usa già la scheda video quando il browser ce l'ha accesa: questo serve a scoprire se sul PC di Luca è spenta. Prossimo passo possibile: presentazione in WebGL (ingrandimento, bagliore e colori fatti da uno shader).

## 23/11/2026 notte · cognato · v0.132 (**prestazioni, primo giro**)
- Stesso aspetto, meno lavoro. `leggero.js` (primo script): le scritture sulla pagina che non cambiano niente (testi, `hidden`, classi, `aria-*`, stili uguali) non si fanno più, prima erano ~35 a fotogramma. Pilota (`pilota2d.js`) ridisegnato al massimo 20 volte al secondo e su tela in memoria. `blit` (`nitido2d.js`): la tela di mezzo non si rifà a ogni fotogramma e niente mipmap. Riflesso bagnato (`wetHD`) capovolto e sfumato in una volta (da 180 copie a pochi tratti). Bagliore, colori da anime e vignettatura sulla tela interna prima dell'ingrandimento (`presentFx` in `street2d.js`; con lo zoom come prima). Dentro un locale la strada sotto non si presenta (`NightInterni.covers`) e la scena misura la pagina 4 volte al secondo. Il quadro grande nel menu non rilegge `offsetWidth` a ogni fotogramma.
- Contatore FPS (Impostazioni → Grafica) ora dice i ms: gioco (strada) e browser. **Luca: dimmi i numeri sul tuo PC** (in guida e al bar): da lì si capisce se il collo è il codice o la scheda video/pannelli (vetri sfocati `backdrop-filter`, ombra del cruscotto). In cloud: da 12,5 a ~14 fps a densità doppia (senza scheda video, poco indicativo). 409 test ok. Due chat sullo stesso lavoro (Luca e Nico): misure in `strumenti/carico.js` dell'altra.

## 23/11/2026 · cognato · v0.131 (**sfruttamento del motore grafico**)
- `node strumenti/carico.js` misura quanto pesa ogni parte su un fotogramma (pilota, logica, asfalto bagnato, foschia, ingrandimento, luci, fisica, città, passanti, effetti, vita, scritte) e stampa le barre col totale; schema, metodo e storico in `SFRUTTAMENTO.md`; skill `night-run-sfruttamento` per rifarla quando la chiedete. Prima misura: ~66 % del fotogramma su un PC medio (stima dal cloud, ±30-50 %); i pezzi più pesanti sono il pilota in auto e la logica. Luca vede 11-24 fps sul suo PC: serve un contatore vero (da fare). Avviso per Nico in `AVVISI.md`.

## 23/11/2026 · cognato · v0.130 (**marmitta rovente più calma**)
- Tempi del rosso (`MARMITTA` in `fiamme.js`): di serie comincia prima e ci mette di più (da 13 a 21 s, prima 15-21), media da 9,5 a 15 (prima 10-14,5), spinta da 3 a 7 (prima 2-5,5). Test aggiornati.

## 23/11/2026 · cognato · v0.129 (**marmitta rovente rifatta**)
- Via l'alone tondo grande e biancastro (era la luce notturna larga più il bagliore): ora di notte c'è solo un bagliore stretto sulla bocca e il riflesso rosso sull'asfalto (di giorno solo il metallo e il riflesso tenue).
- Il terminale si scalda a pixel (celle da mezzo pixel del disegno): rosso ciliegia scuro → rosso → arancio, giallo quasi bianco solo alla bocca al massimo; il tubo si spegne a scalini verso la carrozzeria, il centro è più chiaro, il contorno diventa rosso cupo, il buco resta scuro e poi brilla dei gas; il calore tremola e al massimo staccano faville minuscole. Costanti in `MARM` (`effetti2d.js`). Provato con `strumenti/scarichi.js --rossa` e nel gioco sulla V40 di serie.

## 23/11/2026 · proprietario (Nico) · v0.128 (**il blocchetto come nel modello**)
- Il blocchetto d'accensione della schermata iniziale (`titolo.js`) ora segue l'immagine del proprietario: pannello «ACCENSIONE» in metallo spazzolato con le viti agli angoli, spie BAT / OLIO / MOT in alto a destra, arco con LOCK, ACC, ON e START e un puntino ambra che segue la chiave, la chiave vista da sopra (testa ovale con la presa a righe) che gira nel quadrante, e sotto «QUADRO SPENTO → ACCESSORI → AVVIAMENTO IN CORSO → MOTORE ACCESO» con la barra a dieci segmenti che si riempie.

## 23/11/2026 · proprietario (Nico) · v0.127 (**via il fascio di luce dal blocchetto**)
- Il fascio di luce che passava sopra il blocchetto era il riflesso lucido del pulsante «premium» (`premium.css`, `.gate .go::after`, animazione `pShine`): nella schermata iniziale ora è spento.
## 23/11/2026 · cognato (Luca) · v0.126 (**vignette a versi**)
- Fatto: le nuvolette del protagonista non dicono più parole («WOW!», «SORPASSO!»), fanno **solo versi** come chi imita la macchina (`reazioni.js`): secondo il momento (accelerata, partenza, sorpasso, scoppi, limitatore, turbo), secondo il motore (`REA_FAM`: tre cilindri «TRATRATRA!», diesel «BRUUUUUU!», cinque cilindri «BWAAAAAAH!», sei «UUUAAAAAAH!», utilitaria «NIIIIIII!», turbo «VRUUU FIIIUUU!») e negli scoppi secondo la preparazione (`REA_BOTTO`: leggera POP!, media PUPUPU!, spinta TRATATAN! / TARATARATA!). Più carattere: le lettere escono una alla volta e ballano, l'ultima salta su; scoppi, limitatore e partenze hanno la vignetta a punte che trema (più gialla e coi colori alternati quando l'auto è spinta); coda a punta verso la testa. Check: approvati 1, 2, 3, 4, 8, 9, 12, 17, 19, 23 (tolti dai sospesi). Test 409, foto di tutti i tipi su V40 e Polo, nessun errore.
- Aperto: guardarle guidando sul PC (sospeso 25).

## 23/11/2026 · proprietario (Nico) · v0.125 (**la chiave vista da sopra**)
- La chiave è ora una **barretta verticale** al centro del cilindro, vista dalla testa dall'alto, che ruota quando tieni premuto (LOCK → ACC → ON → START). I fari di ricerca sono ritagliati davvero nel cielo (prima un fascio passava ancora sopra il blocchetto).

## 23/11/2026 · proprietario (Nico) · v0.124 (**schermata iniziale: più vita, chiave di taglio**)
- **Blocchetto d'accensione** rifatto: ghiera cromata, targa con LOCK/ACC/ON/START (e i puntini che si accendono), la chiave vista **di taglio dalla testa**, infilata nel cilindro, che gira con lui.
- Via l'insegna «SOLO AVANTI» dal palazzo (ora è scritta sul dirigibile che passa) e il cartello dice **ULTIMA USCITA**.
- **Fari di ricerca** rifatti: stanno nel cielo (ritagliati sopra la città), con la base che brilla, mai sulla strada né sul blocchetto. Tolti il fascio lungo dei fari dell'auto e il cono del lampione di destra.
- **Più sfondo**: case sulle colline con finestre e camini, pini, **ruota panoramica** che gira con le cabine che brillano, dirigibile con scritta a led, stelle cadenti, stormi di uccelli, cinque gruppi di finestre che si accendono e spengono.
- Provato: foto a 1280×720 e 1920×1080, chiave in giro, 4 test, prova di fumo. Da guardare dal vivo.

## 23/11/2026 · proprietario (Nico) · v0.123 (**la chiave si gira davvero**)
- **Schermata iniziale** (`titolo.js`): via le luci che passano e le scie; strada ferma, lampioni che sfarfallano. Sfondo animato in CSS: luna con alone, nuvole, due fari di ricerca, un aereo, luci rosse sui palazzi, finestre che si accendono e si spengono (trovate leggendo i pixel del quadro).
- **Niente più pannello «Accendi e parti»**: c'è il blocchetto d'accensione con la chiave. Si **tiene premuto** (mouse, dito, Invio o Spazio): ACC, ON, poi START col motorino; a metà la chiave torna indietro e il motore non prende. In fondo il motore prende, le spie (BATT, OLIO, MOT) si spengono e parte il gioco. Le tre partite sono portachiavi su una barra; «Come si gioca» è un fumetto.
- **Suono**: l'avviamento non è più sintetizzato a mano ma reso una volta con `EngineDSP` e `SupraSim` del gioco (motorino, presa, colpo di gas, minimo); se non è pronto, riserva semplice. **Non posso ascoltarlo: da giudicare a orecchio.**
- Le prove automatiche partono subito (solo i clic veri girano la chiave). Dopo il caricamento Ctrl+F5.

## 23/11/2026 · proprietario (Nico) · v0.122 (**aggiornamenti subito**)
- Dopo un caricamento su `main` il gioco poteva mostrare il codice vecchio fino a 10 minuti anche ricaricando: `sw.js` chiedeva i file alla rete ma passando dalla cache HTTP di GitHub Pages. Ora chiede sempre se il file è cambiato (`cache: 'no-cache'`: se è uguale arriva un 304), e `VERSIONE` è `nr-3-aggiornamenti`. Il service worker nuovo si attiva alla seconda apertura dopo il caricamento; intanto si forza con Ctrl+F5.

## 23/11/2026 · proprietario (Nico) · v0.121 (**la schermata iniziale vive**)
- **Scena animata** (`titolo.js`), sempre con animazioni CSS sulla scheda video (nessun ridisegno: lo scatto della v0.103 non torna): auto del traffico che passano con fanale rosso, faro bianco e scia; le quattro frecce che lampeggiano; il lampione spento che ogni tanto sfarfalla; il telefono che pulsa; stelle che brillano.
- **Il tempo cambia a ogni avvio**: sereno, pioggia o nebbia, a caso (si prova con `?meteo=pioggia` nell'indirizzo).
- **«Accendi e parti» gira la chiave**: il pannello scende, le frecce si spengono, i fari si accendono forte, la telecamera spinge in avanti e si sente un avviamento (motorino, motore che prende, colpo di gas, minimo; sintetizzato). Poi parte il gioco di sempre. Funziona con clic e con Invio o Spazio; le prove automatiche partono subito.
- **Logo**: scintille e sotto, al posto di «Stanotte si corre» fisso, una frase che cambia (sette frasi: capitali, motori, meteo, partite...).
- **Partite come schede**: auto, dove sei arrivato (capitale), km, soldi e ultima volta.
- Provato: foto delle tre atmosfere, sequenza della chiave con clic vero (il gioco parte e non ci sono errori), schede con tre partite finte; 405 test.
## 23/11/2026 · cognato · v0.120 (**fiamme allineate allo scarico, marmitta rovente**)
- **Fiamme e terminale allineati su tutte le auto**: la fiamma usciva sempre 2 pixel sotto il punto `ex` (in `frame` di `street2d.js` il disegno sta a `top - k` e la fiamma a `top + k`: ora tutte e due a `- k`; si vedeva bene sulla V40, fiamma sotto il terminale). Il terminale montato da Luca era disegnato sempre in fondo al paraurti (x 0) anche sulle auto col kit e lo scarico laterale: ora sta centrato su `ex`. Le auto di serie avevano tutte `ex: [3, h-11]` a occhio (fiamma nel vuoto dietro il paraurti): misurati sui disegni (sotto il paraurti, in fondo alla coda); col kit corretti A112 (scarico laterale 6 px più in basso), bus e ambulanza. Foglio di controllo: `node strumenti/scarichi.js [--nuda] [--rossa 0.8]`; test in `test/scarichi.test.js`.
- **Marmitta rovente**: gas oltre metà negli ultimi 1.500 giri (limitatore compreso) scalda lo scarico; il terminale (o il tubo sotto il paraurti) diventa rosso scuro, rosso, poi arancio quasi bianco con alone e riflesso sull'asfalto. Di serie / poco preparata comincia a 15 s (pieno a 21), media a 10 (14,5), spinta a 2 (5,5); fuori dal tiro si raffredda piano (~10 s dal massimo). Livello = `flameTier`. `MARMITTA`, `marmittaPasso`, `marmittaRossa` in `fiamme.js`, `fxMarmitta` in `effetti2d.js`, `marmitta` nello stato di render. Provato nel browser sulla V40 di serie in P (rossa a 17 s, incandescente a 22, ancora rossa dopo 6 s). 404 test (con i 4 delle reazioni di Nico).

## 23/11/2026 · proprietario (Nico) · v0.119 (**il protagonista reagisce, vapore, fari sul bagnato**)
- **Il protagonista in pixel art**: la figura in auto era a vettori sfumati; ora si porta alla griglia di mezza unità dei disegni HD (`drvPixel` in `pilota2d.js`), con colori a livelli e il contorno scuro dei passanti, senza perdere occhi e bocca (sopracciglia, occhi e bocca più grandi in `personaggio.js`).
- **Nuvolette di pensiero** (`reazioni.js`, nuovo): accelerazione forte, launch (pronti / via), sorpasso, scoppio grosso, motore al limitatore. Esce sopra la testa una nuvoletta con la sua frase (WOW!, ANCORA!, CHE SPINTA!, SORPASSO!, CHE BOTTI!...) e in faccia compare lo stupore (occhi grandi, bocca a O). Mai più di una ogni 7-11 secondi, ogni tipo ha il suo riposo. Si spegne con Grafiche anime.
- **Vapore**: colonne dai tombini più alte e larghe, e dallo sfiato sul tetto dei locali di ramen/soba (prima `meta.steam` non faceva niente).
- **Fari sul bagnato** (`fxFariBagnato`): la luce dei fari e del fanale si specchia sull'asfalto; molto con la pioggia, appena sull'asciutto; più forte il fanale quando freni.
- Provato nel browser (prima e dopo, con 3 foto per cosa); 401 test.

## 23/11/2026 · proprietario (Nico) · v0.118 (**livelli: locali dietro i passanti, riflessi sotto le auto**)
- **Passanti e locali**: le facciate dei locali (bar, benzinaio, Sosta 24, motel, officine, Autosalone, sfascio, piazzetta) erano disegnate dopo i passanti, quindi chi camminava sul marciapiede spariva dietro l'edificio. Ora in città e nei paesi i locali si disegnano prima dei pedoni (`placesEarly` in `draw` di `street2d.js`); traffico e auto restano nel passaggio delle entità, dopo. Fuori da città e paesi non cambia niente.
- **Strisce di luce sull'asfalto**: i riflessi verticali di insegne e lampioni (e le scintille sul bagnato) erano in `vitaFront`, dopo le auto, e passavano sopra la carrozzeria. Ora sono `vitaRiflessi` (`vita2d.js`), disegnati prima delle auto: stanno sulla strada e la macchina ci passa sopra. `RIFL_K` 1,7 compensa la penombra che viene dopo.
- Provati: 397 test, prova di fumo, foto dei locali (benzinaio, Sosta 24, motel, Luca, Nico, bar) prima e dopo.

## 23/11/2026 · proprietario (Nico) · v0.117 (**fiamme dal vero scarico, gomme del kit più piccole, rilascio nel video**)
- **Fiamme e scoppi partono dal punto vero dello scarico** nel disegno col kit carrozzeria: prima partivano sempre dal paraurti dietro (`ex: [3, ...]`), anche dove lo scarico del kit è laterale (Golf, E36, E34, Audi 80, A112, Polo, Punto, Williams, Doblò, Van...). Misurato sui disegni di 23 auto (`spriteT.ex` in `cars.js`); restano come prima il bus e l'ambulanza (scarico non visibile) e le auto senza kit.
- **Gomme del kit più piccole** su BMW M3 E30 e Golf: col kit la ruota era il 5 % (E30) e il 15 % (Golf) più grande di quella di serie. Nuovo campo `wk` in `GEN_DATA[id].spriteT` (scala del disegno della ruota, letto da `genWheel` di `street2d.js`) e `wr` più piccolo: E30 14,4 (wk 0,935), Golf 14,2 (wk 0,91).
- Video «di serie e preparate»: ogni clip fa **accelerazione, rilascio, accelerazione...** (`waves`/`ONDE` in `strumenti/reel/preparate.js`), così si sentono borbottio e scoppi al rilascio di tutti i motori; le preparate hanno sgasate ferme + tirata in marcia a ondate (tutte e tre, BMW compresa). 397 test e prova di fumo ok.

## 23/11/2026 · proprietario · v0.117 (**più fluidità con fiammate e scritte**)
- Alleggerito il disegno di fiammate, aloni, fumo e fumetti. Le scritte riusano il disegno delle lettere, e gli avvisi misurano la loro posizione prima di spostarsi.
- Frequenza e durata degli scoppi, impostazioni del motore e suono restano quelli della preparazione. Provati i 397 test e il disegno nel browser a densità doppia e semplice.

## 23/11/2026 · proprietario (Nico) · v0.116 (**video: la 205 e la Golf tirano le marce lunghe**)
- Nel video «di serie e preparate» la 205 e la Golf preparate facevano un rumore strano: sono a trazione anteriore con 700-800 CV, da fermi il controllo di trazione tagliava il gas quasi sempre e il motore restava a un regime quasi fisso. Ora fanno le sgasate da ferme e poi una tirata in marcia (2ª, 3ª, 4ª, 5ª a gas pieno, i giri salgono e scendono a ogni cambiata), tagliata prima del limitatore in ultima (`mode: 'tira'` in `strumenti/reel/preparate.js`).
- Solo per il video: nelle due tirate le gomme hanno +80 % di aderenza (`grip` nella ripresa), il gioco non cambia. La BMW è rimasta com'era.
- `suono_preparate.js` non fa più andare oltre lo zero il picco del suono. Non toccato il gioco.

## 23/11/2026 · proprietario (Nico) · v0.115 (**video «di serie e preparate»**)
- Quattro strumenti nuovi in `strumenti/reel/` per un video verticale di ~66 s: tre auto (E30 col motore della Supra, 205 GTI col cinque cilindri della 850 R, Golf col 3.0 dell'M3 E36) prima di serie e poi preparate (swap, pezzi, kit, neon, cerchi). Fermo al semaforo fa sgasate e limitatore, poi parte a fondo.
- `suono_preparate.js` rifà il suono con motore, campioni dei pezzi (turbina, valvola, scoppi, limitatore a raffica) e compressore del gioco, partendo dallo stato della fisica salvato a ogni passo.
- Scritte da fumetto spente nelle riprese (coprivano auto e fiamme). Uso e ordine dei passi: in testa a ogni file. I video non vanno nel repository.
- Non toccato il gioco, solo strumenti.

## 23/11/2026 · proprietario (Nico) · v0.114 (**monumenti definiti, come le case**)
- Tutti i monumenti delle capitali sono stati ridisegnati **al doppio della risoluzione** (pixel da mezza unità) in `citta_monumenti.js`: pietra a conci con luce da sinistra, colonne scanalate coi capitelli, archi, cupole a spicchi, frontoni, finestre accese, faro dal basso che schiarisce solo il monumento. Si riconoscono: il Colosseo con i tre ordini di arcate e il lato crollato, il Pantheon col portico, San Pietro, la Torre Eiffel a traliccio con le tre piattaforme, l'Arco di Trionfo col fregio e i gruppi scolpiti, Notre-Dame col rosone e le due torri, il Big Ben col quadrante e Westminster, il Tower Bridge, il London Eye e il Riesenrad con le cabine, lo Stadshuset con le tre corone, il Fernsehturm, la Porta di Brandeburgo con la quadriga, il duomo di Berlino, il Tyn, San Vito, lo Stephansdom col tetto a losanghe, la Karlskirche, il Metropolis, il toro di Osborne, Santa Justa, la torre di Belem, il castello di Sao Jorge, il Partenone, il Campidoglio, l'obelisco e il Lincoln Memorial.
- I vecchi disegni semplici sono stati tolti da `citta_dati.js`. Le tessere dei monumenti hanno `hd: true` e il gioco le usa come sono.
- Da guardare sul PC con l'auto in movimento (da fermi l'inquadratura taglia in alto).

## 23/11/2026 · proprietario (Nico) · v0.113 (**più carattere alle città**)
- Ogni capitale ha ora i suoi **oggetti del marciapiede** (`citta_dettagli.js`): a Roma pini, cipressi, nasone, fontana, tavolini di trattoria, cartello ZTL, Vespa; a Parigi colonne Morris, fontanelle Wallace, metrò Guimard, lampioni a due globi, chioschi verdi; a Londra cabine e cassette rosse, cartello della metropolitana, lampioni neri, fermate, ringhiere; a Stoccolma bandiere, T-bana, biciclette, betulle; a Berlino semaforini Ampelmännchen, U-Bahn, colonne della pubblicità, Döner, pezzi del Muro; a Praga lampioni gotici, statue, birreria; a Vienna Würstelstand; a Madrid metrò, madroño e terrazze; a Lisbona palme, lampadine di festa, pastelaria, pannelli di azulejos; ad Atene ulivi, chioschi, taverna con pergola, gatti; a Washington bandiere, cassette blu, idranti gialli, metrò, ciliegi, hot dog.
- Sulle **facciate**: targhe delle vie nei colori del posto (VIA DEL CORSO, RUE DE RIVOLI, REGENT ST W1...), bucato e madonnelle a Roma, fioriere, croce verde e losanga del tabacchi a Parigi, **pub** con le lettere d'oro e l'insegna a bandiera a Londra, bandiere di Svezia, Grecia e Stati Uniti, graffiti a Berlino, azulejos e lampadine a Lisbona, prosciutti a Madrid, statue sui tetti, bouganville ad Atene. Sull'**asfalto**: LOOK RIGHT e doppia riga gialla a Londra, sampietrini a Roma.
- **26 monumenti** (otto nuovi: Pantheon, Notre-Dame, Tower Bridge, duomo di Berlino, Karlskirche, toro di Osborne, torre di Belem, Lincoln Memorial), su un basamento di case lontane e a distanza regolare.
- Da guardare sul PC con l'auto in movimento; se qualcosa è troppo fitto o troppo poco si regola `propP` e `landEvery` in `citta_dati.js`.

## 23/11/2026 · proprietario (Nico) · v0.112 (**le capitali sembrano città vere**)
- Prima tutte le capitali erano Tokyo con un altro nome (konbini, ramen, pagode). Ora ognuna ha i suoi palazzi, le sue insegne nella lingua del posto (BOULANGERIE, PUB, BIERGARTEN, TAPAS, TAVERNA...), i suoi quartieri (con i nomi di `capitali.js`) e i suoi monumenti sullo sfondo, illuminati: Colosseo e San Pietro, Torre Eiffel e Arco di Trionfo, Big Ben e ruota panoramica, Stadshuset, Fernsehturm e Porta di Brandeburgo, Tyn e San Vito, Stephansdom, Metropolis, Santa Justa, Partenone, Campidoglio e obelisco. File nuovi `citta2d.js` e `citta_dati.js`, aggancio in `street2d.js` (`setCity`). Tokyo non è cambiata.
- Strumenti del reel in `strumenti/reel/` (LEGGIMI.md); nelle riprese del teaser la leva va in D (prima l'auto restava ferma).
- Da guardare sul PC: se i colori di notte (tutto un po' viola) e i monumenti vi piacciono; i monumenti si vedono bene solo con l'auto in movimento (da fermi l'inquadratura taglia in alto). Non toccano la storia: è la parte «A» della proposta per Luca.

## 23/11/2026 · proprietario (Nico) · v0.111 (**proposta sulle capitali per Luca**)
- Scritto `docs/storia/PROPOSTA_CITTA.md`: com'è il giro oggi, cosa manca (le città sembrano tutte uguali, i collegamenti si ripetono) e sei domande per Luca. Niente trama inventata. Avviso per Luca in `AVVISI.md`, sospeso 23.

## 23/11/2026 · proprietario (Nico) · v0.110 (**pausa, avvisi del telefono, nomi dei salvataggi, mappa del diario**)
- **Pausa** (`pausa.js`): Esc ferma gioco e suono e apre una finestrella; Menu completo, Impostazioni e Salvataggi aprono il menu a schede e chiudendolo si torna alla finestrella. «Salva e torna al titolo» chiede conferma.
- **Premi sul telefono**: traguardi e valigette guadagnate arrivano come avvisi del telefono (uno alla volta, tocco = la loro app). Tolto il doppione «Valigetta di bronzo» a destra. Senza telefono resta la coppa grande.
- **Salvataggi**: ogni partita ha un nome (matita sulla casella) e «oggi / ieri / N giorni fa».
- **Diario**: mappa a serpentina con le dodici capitali, la strada fatta, dove sei e un punto per ogni momento; tocco sulla foto la ingrandisce.
- Da guardare sul PC: se la pausa a due livelli è comoda, se la coppa dei traguardi vi manca (si rimette facilmente), se la mappa piace.

## 23/11/2026 · proprietario (Nico) · v0.109 (**pulizia del codice**)
- Controllo del codice morto: tolte `renderUps` e `suspLabels` (index.html) e `sim0` (polizia.js), nessuno le chiamava; tolta `desk-fine.png` (uscita della prova di fumo) e messa in `.gitignore`. Restano esportate ma senza uso `bancoSim`, `gvMedia`, `gvVincita` (le provano i test), `FLAME_TIERS`, `ST_CAT_NAME`. Immagini e suoni: tutti usati.

## 23/11/2026 · proprietario (Nico) · v0.108 (**check e avvisi sul titolo**)
- Check: nessun commit nuovo su `main`, 384 test su 384, prova di fumo senza errori. Corretto il punto 20 dei sospesi: gli avvisi a destra aspettano finché c'è la schermata iniziale o il prologo (`index.html`).

## 22/11/2026 · cognato (Luca) · v0.107 (**pezzi per tutti i motori, cambi lunghi, compressori veri**)
- Supra (2JZ): da Luca ora ha gli stessi reparti delle altre: aspirazioni (pannello, cono, il suo filtro, airbox con presa fredda, cornetti), cilindrata (alesata e +300 cc), benzina (pompa, iniettori) e i cambi sport e da corsa regolabili. La frizione bidisco OS Giken ora regge 1.500 Nm (con la cilindrata maggiorata 1.300 non bastavano). I diesel restano senza camme e catalizzatore apposta (c'è il FAP).
- Cambi: il da corsa di serie in ultima al limitatore tira a 350 km/h sulle belle (dai 200 CV: Supra, M3, M5...), 320 sulle normali, 300 sulle piccole (Panda, Twingo...) e sui mezzi pesanti; il cambio sport con la ghiera tutta lunga arriva a 300/275/255 e il bus a 200. È la velocità del rapporto: se il motore non ha i cavalli, l'aria lo ferma prima.
- Turbo: il modello nuovo della v0.106 vale già per ogni turbo (tutte le auto, V40, Supra, swap). I compressori invece adesso vanno a cinghia: il volumetrico dà pressione piena dai bassi, il centrifugo cresce coi giri, niente ritardo e niente valvola in rilascio. Test in `test/cambi.test.js`.

## 22/11/2026 · cognato (Luca) · v0.106 (**turbo più vero, dentro e fuori**)
- Fisica (`sim.js`, costanti `SIM_TB`): la girante la muove l'energia dei gas di scarico (giri × aria × pressione, che si alimenta da sola: il turbo grosso «entra» invece di salire a rampa), la wastegate comincia ad aprire al 95 % del target e la capsula risponde in 0,12 s (picco del 5-15 % e assestamento sul target, un filo di tremolio), a metà gas meno pressione e a un quarto quasi niente, a farfalla chiusa depressione fino a −0,7 bar sul manometro (`sim.mapB`). La girante resta lanciata negli stacchi brevi (la pressione torna in 0,2-0,3 s).
- Suono (`dsp.js`): soffio dell'aria nel compressore in due bande che salgono con la girante e sibilo d'aspirazione, soffio della wastegate quando regola, fischio che in rilascio resta e cala invece di sparire, valvola con attacco netto e getto brillante che scende di tono. Campioni della valvola rifatti più puliti e nitidi (`pssh`, `pssh_grossa`, `trombetta`, `doppio_pistone`, `ricircolo`: attacco sotto il millesimo, meno grave, coda della turbina che rallenta), valvola +4 dB e fischio +2,4 dB, in abitacolo il gruppo motore dei campioni non è più tagliato a 3.200 Hz. Test in `test/turbo.test.js`.
- Da sentire sul PC: se il soffio è giusto o troppo (si regola col cursore di ogni componente nei Suoni).

## 22/11/2026 · cognato (Luca) · v0.105 (**pop & bang tra le centraline, volano a quattro livelli**)
- Pop & bang: tolta la spunta dal menu di pausa (Guida). Ora è l'ultimo livello del reparto Centralina da Luca Tuning, «stand-alone + mappa pop & bang» (Supra: «Elite 2500 + mappa»): niente cavalli in più, solo scoppi e fiammate in rilascio; sui diesel non c'è. Chi aveva la spunta accesa la ritrova montata, gratis, sulle auto con la centralina programmabile.
- Volano: reparto suo nella Trasmissione, separato dalla Frizione (che ora decide solo quanta coppia regge). Originale, pesante in ghisa (giri che salgono e scendono il 35-40 % più piano, minimo più basso e rotondo), alleggerito, superleggero in alluminio (giri quasi al doppio della velocità, minimo più alto e ballerino, tintinnio del cambio in folle). Chi aveva la frizione rinforzata o da corsa (che prima alleggeriva anche il volano) ritrova il volano alleggerito montato e suo. Test in `test/volano.test.js`.
- Corretto mentre provavo il volano: col superleggero e tutto al massimo una partenza su sei a gas pieno si spegneva (il controllo di trazione toglieva il gas a frizione chiusa vicino al minimo, e l'antistallo della frizione automatica scattava a 880 giri fissi, sotto il minimo di quel motore). Ora le soglie seguono il minimo vero e il TC non taglia lì: nessuna partenza spenta su tutte le auto.
- Corretto: l'anomalia «Corsia d'emergenza» scriveva «{Auto}»; ora dice l'auto che stai guidando. Numerazione tornata su v0 (le v1.00-v1.04 sono le v0.100-v0.104).
- Da decidere (in `SOSPESI.md`): le potenze col massimo dei pezzi si moltiplicano senza freno.

## 22/11/2026 · cognato (Luca) · v0.104 (**gomme che sgommavano da sole, controllo di fisica e motori, volume dei pezzi**)
- Luca: passando da in movimento a fermi le gomme restavano a sgommare, anche a motore spento, e smettevano solo riprendendo velocità. Causa in `sim.js`: dalla v0.71 la curva della gomma oltre il picco perdeva il segno, e con lo slittamento all'indietro (freno motore, scalata, ruote lanciate su un'auto fermata) la gomma spingeva avanti invece di frenare: la ruota girava all'indietro sempre più forte. Effetto anche su una scalata brusca: ruote bloccate, motore spento e l'auto che non frenava affatto. Corretto; in più `sim.ferma()` ferma ruote, trasmissione e gomma quando il gioco ferma l'auto di colpo (Luca Garage, tutorial, «Vai a», fondo della retro). Test in `test/fermo.test.js`.
- Controllo da pilota su tutte le auto, di serie e col massimo dei pezzi: frenate 100-0 tra 40 e 54 m, freno motore, veleggio, 0-100 e punte credibili; motori che partono, tengono il minimo e rispettano il limitatore. Da decidere: col massimo dei pezzi le potenze si moltiplicano senza freno (E36 1.393 CV, A112 da 70 a 595).
- Suoni di Luca Tuning: sotto ogni componente che suona un cursore VOLUME (0-200 %, «100 %» per tornare a posto), vale su strada e nell'ascolto, salvato nel computer (`nr_campioni`). Test in `test/campioni.test.js`.

## 22/11/2026 · proprietario (Nico) · v0.103 (**schermata iniziale: quadro fermo**)
- Nico: l'animazione della v0.102 scattava ogni tanto e le ruote sembravano ferme (giravano troppo veloci per i 60 fotogrammi: l'effetto delle ruote dei carri nei film). Fatto: `titolo.js` disegna **un quadro fermo, una volta sola** (e di nuovo solo se cambia la finestra): l'auto della partita ferma in corsia d'emergenza con le quattro frecce e i fari accesi, il protagonista appoggiato dietro col telefono acceso (`pgStanding`, posa `phone`), le scie del traffico come in una foto a lunga posa, il cartello USCITA 18 KM, il lampione in mezzo spento, la città con l'insegna SOLO AVANTI e la luna. Si muove solo la telecamera (zoom e spostamento lentissimi in CSS, fatti dalla scheda video: niente ridisegno, niente scatti).
- Da guardare sul PC: se piace così.

## 22/11/2026 · proprietario (Nico) · v0.102 (**schermata iniziale nuova**)
- Fatto: `titolo.js`, la schermata iniziale rifatta. Sfondo animato alla risoluzione del gioco con gli attrezzi del prologo (`NightPrologo.arte`): autostrada di notte, luna, città con le antenne e l'insegna SOLO AVANTI, colline coi tralicci, lampioni coi coni (uno ogni tanto si spegne), portale AUTOSTRADA/USCITA 18 KM, traffico e camion che sorpassiamo, e **l'auto della partita scelta** in primo piano coi fari e qualche botto dallo scarico. Logo in alto a sinistra, pannello a destra: per una partita già cominciata dice «Il Viaggio continua», auto, km e soldi, e il pulsante «Continua il viaggio». Stessi id di prima (`#gate`, `#introMenu`, `#goBtn`).
- Corretti: il link «Crediti» sotto il pulsante era sparito con i salvataggi (v0.101); i traguardi comparivano sopra la schermata iniziale (ora aspettano, anche durante il prologo).
- Da guardare sul PC: se piace, e se la scena scorre fluida.

## 22/11/2026 · proprietario (Nico) · v0.101 (**tre salvataggi**)
- Fatto: `salvataggi.js`, tre partite separate (una di Nico, una di Luca, una di prova). La partita in uso resta dove è sempre stata, le altre aspettano da parte (`<chiave>@n`, `nr_pezzi@n`); cambiando partita si scambiano e la pagina riparte dal titolo. Ognuna ha la sua auto, i soldi, i pezzi montati, il personaggio e le foto del diario; impostazioni, tasti e volume restano del computer. Si sceglie sulla schermata iniziale (sopra «Accendi e parti») e nel menu, Partita → Salvataggi (lì chiede conferma). La partita di prima è la Partita 1. «Nuovo viaggio» cancella solo quella in uso. Test in `test/salvataggi.test.js`; provato nel browser andata e ritorno tra le partite.
- Da provare: anche nel programma per Windows (salva su file tutto il `localStorage`, quindi dovrebbe andare uguale).

## 22/11/2026 · proprietario (Nico) · v0.100 (**anomalie di Luca, due errori piccoli**)
- Fatto: le otto anomalie proposte da Luca e approvate da Nico in `VG_ODD` (`viaggio.js`), rare, senza musica, su tre livelli coi km: *si notano appena* (dal km 12: l'auto nello specchietto che sparisce quando cambi corsia, il cartello «USCITA 18 KM» che dieci km dopo dice ancora 18, la radio che dice il km in cui sei), *si possono verificare* (dal km 60: la tua auto gemella ferma in corsia d'emergenza con le quattro frecce e la stessa ammaccatura, il barista che ti saluta «come l'altra volta», un cippo «KM -n»), *lasciano qualcosa* (dal km 150: un thermos ancora caldo nella cassa del motel, sei auto tutte uguali in fila). Le prime sono pensieri, le altre finestre. Effetti nuovi in `vgOddFai`: `pens`, `radio`, `mirror`, `then`, cippo col suo numero, auto ferme che non si urtano (prima le «parcheggiate» non si vedevano proprio). Test in `test/anomalie.test.js`.
- Corretti: fruscio della radio di notte che usciva come spazi vuoti; la prova di fumo credeva di provare lo sfascio ma entrava nel negozio accanto della piazzetta; il test dei campioni falliva una volta su ~30 per caso (seme fisso).
- Serve da Luca: rivedere i testi brevi delle anomalie (li ha scritti Claude dalle sue idee).

## 22/11/2026 · cognato (Luca) · v0.99 (**officina più chiara**)
- Fatto: pallini dell'officina e dei Suoni uguali dappertutto (verde montato, grigio tuo, rosso da comprare o bloccato); nei Suoni un kit non tuo si ascolta da solo e si compra solo col pulsante «Compra e monta» della scheda; intercooler da competizione aria-acqua (`race`, `heat` 0,12); turbo rinominati con nomi da catalogo (stesse funzioni, la nota dice cosa fanno); la schermata saltellava perché l'anteprima al passaggio del mouse aggiungeva una riga sotto i numeri: ora la riga c'è sempre, vuota.
- Aperto: niente.

## 22/11/2026 · proprietario (Nico) · v0.98 (**prologo alla qualità del gioco**)
- Fatto: `prologo.js` ridisegnato alla stessa risoluzione del gioco (tela 1280×720, coordinate 640×360, disegni HD, attrezzi di Street2D: facciate, lampioni, marciapiede, luci, scritte). Lettera sul tavolo con carta intestata e firma; via dei Cantieri sotto la pioggia (la E36 mette la freccia, parcheggia, spegne, la portiera si apre e lui gira davanti al cofano fino al portone); studio con libreria, pendolo, tende e lampada, notaio più curato; garage con le auto una alla volta sotto la lampada (← → Invio, miniature, «Prendi questa»); autostrada con un camion vero e il portale. Suoni: pioggia, freccia, portiere, passi. Il notaio in piedi è un personaggio del gioco col tratto nuovo `abito` (`personaggio.js`).
- Errori corretti: intestazione della lettera mai in grassetto e righe spezzate a metà; il «camion» dell'autostrada era un rettangolo nero sul guardrail; la portiera della E36 era un rettangolo blu e lui ci camminava sopra; tutto stirato da 640×360 a pixel di grandezze diverse; scegliere l'auto mentre la scena cambiava poteva chiudere il prologo prima del titolo; `play` chiamato due volte di seguito apriva due prologhi; durante il caricamento il gioco sotto non sapeva che il prologo era in corso.
- Da guardare giocando: ritmo dell'arrivo (14 s) e volume della pioggia.

## 22/11/2026 · cognato (Luca) · v0.95 (**sgommare ma spingere: controllo di trazione e bagnato**)
- Segnalazione: E36 da 600 CV, quinta, gas a fondo: giri al limitatore, sembra che slitti la frizione e la velocità sale di poco. Misurato (simulazione e gioco vero): la frizione non c'entrava (giri motore = giri ruote), erano le **gomme che sgommano** e due cose che le rendevano inutili: il controllo di trazione tagliava tutto o niente (80 % del gas tolto per mezzo secondo a ogni micro-slittamento: in 3ª-5ª la coppia alla frizione saltava da 785 a 300-500 Nm) e il **bagnato** toglieva il 27 % di aderenza più un 12 % di aquaplaning. Con la pioggia e il TC spento l'E36 faceva 0-200 in 25-34 s.
- Fatto (`sim.js`): TC **progressivo** (nessun taglio sotto lo 0,10 di slittamento, massimo verso lo 0,22, si riprende in 0,07 s); bagnato −20 % (era −27 %) e aquaplaning −7 % (era −12 %); dopo il picco la gomma tiene di più (`tyre.fall` 0,45, era 0,6). Risultati E36 al massimo: asciutto 0-100 in 4,5 s e 0-200 in 9,2 s (prima 4,65 e 9,5), bagnato con TC 5,5 e 10,9 s (prima 7,4 e 15,4), bagnato senza TC 7,6 e 13 s (prima 10,4 e 25). Test in `test/accelerazione.test.js`; aggiornati i due test della pioggia (un quinto, non un quarto).
- Aperto: con gomme di serie e 600 CV, bagnato e senza TC, si sgomma ancora (giusto): 0-200 in ~22 s.

## 22/11/2026 · proprietario (Nico) · v0.97 (**componenti per tutte le auto**)
- Fatto: Nico ha chiarito che i disegni dello zip sono componenti per tutte le auto, non della Supra (la Supra è un'auto come le altre). In `componenti.js` niente più «prima la Supra, poi le altre»: una sola regola per tutte, il nome del pezzo (`COMP_NOMI`: gomme da drag e slick → slick, sportive e semi-slick → sportive, biturbo → il disegno coi due turbo, nessun turbo o compressore → niente, scarico da gara → dritto) e poi il livello nel catalogo di quell'auto (il primo = di serie, gli altri dal più semplice al più spinto sui disegni rimasti, `COMP_SCALA`). Test `test/componenti.test.js` riscritto (stesse regole per tutte, catalogo inventato in ordine).
- Aperto: il catalogo dello zip (`img/componenti/catalogo.json`) dice ancora «Toyota Supra RZ» nel campo `car`: è il file di Nico, lasciato com'è.

## 22/11/2026 · proprietario (Nico) · v0.96 (**illustrazioni dei componenti**)
- Fatto: dallo zip «Night-Run-Sprite-Componenti» in `img/componenti/` i due fogli (48 pezzi della Supra, 128×96 e 256×192 l'uno), le sei cornici delle rarità e il catalogo. `componenti.js` (nuovo): `compPos` sceglie la casella (Supra: il disegno esatto; altre auto: stesso reparto a livello simile, più qualche abbinamento per nome in `COMP_NOMI`; reparti senza disegno, come peso, benzina o cilindrata, niente), `compHTML` la mostra. Officina di Luca (`officina.js`): l'illustrazione grande nella scheda del pezzo toccato e una piccola accanto a ogni reparto (il pezzo montato). Valigette (`valigette.js`): un pezzo vinto esce come illustrazione dentro la cornice della sua rarità. `LICENZE.md`: nota sui ricambi di marca. Test `test/componenti.test.js` (353 test), provato nel browser.
- Aperto: i disegni sono della Supra: sulle altre auto (e sulle utilitarie) il turbo o lo scarico mostrati sono quelli della Supra del livello simile. Se arrivano disegni per altre auto si aggiungono al foglio.

## 22/11/2026 · cognato (Luca) · v0.94 (**frizione dello swap**)
- Causa del «sembra sempre slittare, in quinta vado al limitatore»: misurato in simulazione (quinta, gas a fondo da 4.000 giri) e nel gioco vero. Le auto di serie e le preparazioni pronte non slittano mai; slitta chi ha il **motore di un'altra auto (swap)**, perché la frizione restava quella dell'auto (V40 420 Nm contro i 440-920 Nm della Supra: slittamento al 35 % del tempo) e chi tiene la **frizione di serie con il motore al massimo** (50-100 %). Con la frizione in sovraccarico il motore non è frenato e resta al limitatore senza spingere: è la fisica giusta, ma il giocatore non ha modo di capirlo.
- Fatto: con lo swap la frizione vale quella del donatore allo stesso livello (serie, sport, corsa), mai meno di quella dell'auto (`offSwapApply`); in Modifiche un riquadro rosso avverte «la frizione regge X Nm e il motore ne fa Y» e manda in Trasmissione; guidando, se la frizione slitta a gas pieno per 1,5 s lo dice (una volta ogni 90 s).  Test in `test/officina.test.js` (337 in tutto).
- Rapporti del cambio regolabili: li avevo fatti anch'io (±15 % per marcia), ma nel frattempo la v0.91 aveva il suo cambio regolabile (sport: un rapporto per tutte le marce, da corsa: marcia per marcia) e ne ho tolto il mio, per non avere due serie di barre.
- Aperto: la frizione di serie con motore al massimo slitta ancora (voluto, dissero). Il «singhiozzo» a caso col livello sport non c'è.

## 22/11/2026 · cognato (Luca) · v0.93 (**scritte anime più varie, con interruttore**)
- Fatto: nuovo `fumetti2d.js`: per ogni rumore ora si sceglie tra 5-8 voci (scoppi della marmitta, urti, sfiato, cambio che gratta, clacson, frenata, partenza, auto sfiorata: oltre 60 in tutto, mai la stessa due volte di fila), con forme diverse (stella, esplosione irregolare col retino, raggi del clacson, strisce di velocità, sbuffi dello sfiato), testo a due tinte con riflesso e scintille. Aggiunte W, X, Y al carattere a pixel. In Impostazioni → Grafica c'è «Grafiche anime» (accese/spente): spente, niente scritte da fumetto e niente lampo «PERFETTA!» sulle cambiate; la scelta si salva. Test in `test/fumetti.test.js` (310).
- Prima versione scartata: troppo grande e carica (l'urto copriva mezza auto, l'eco si sovrapponeva, la nuvola dello sfiato copriva il tetto). Confrontata con le vecchie nelle stesse situazioni vere e rimessa alle stesse grandezze e posizioni di prima: le vecchie erano ben proporzionate.
- Aperto: gli scoppi alla marmitta con la finestra piccola finiscono sotto i pulsanti a sinistra (già prima). Non provato guidando con l'audio: foto fatte provocando gli eventi veri (urto, sfiato, strisciata) e le scritte a mano per gli altri.
## 22/11/2026 · cognato (Luca) · v0.91 (**Luca Tuning da meccanico**)
- Fatto: nelle auto da disegno e nella V40 ogni pezzo nuovo cambia la fisica. **Aspirazione** a scelta: pannello, cono, fungo, airbox con presa fredda e cornetti; i cornetti perdono ai bassi e regalano in alto, e nella sintesi ululano. **Cilindrata**: l'ultimo passo è sempre +300 cc e la coppia cresce come la cilindrata; dove il reparto speciale era già la cilindrata (le due Panda) va in fondo a quello. **Turbo**: cinque nuovi (`GEN_TURBO_PIU`), coi giri scalati sul limitatore dell'auto. **Benzina e iniettori** (`genFuel`): la pressione la limitano centralina e benzina, e la scheda del turbo dice quanta ne usi davvero. **Cambio** (`genGearbox`, `gbState`/`gbGears` in tuning.js): sport con un rapporto per tutte le marce, da corsa con un cursore per marcia, cambiate più rapide (`shiftMul` in sim.js); la regolazione sta in `S.adj[auto]` (`gk`, `gr`) accanto all'assetto. **Slick da drag** anche su Supra e V40. La frizione da corsa ora regge sempre 1,3 volte la coppia dell'auto preparata al massimo.
- Di serie non cambia niente (test). Per tenere uguale chi usava la mappa FORTE, la benzina di serie regge i turbo che l'auto aveva già, anche al +20 %; la V40 regge 1,5 bar come prima.
- Aperto: la Supra ha solo le slick (il suo catalogo era già pieno). I suoni nuovi (ululato dei cornetti, voci dei turbo e del cambio) li ho misurati, non sentiti.

## 22/11/2026 · cognato (Luca) · v0.89 (**la notte**)
- Fatto, da una critica di Codex scelta dal cognato (`notte.js`): **giorno e notte contano** (`game.dayK` da `tickAtmosphere`: di notte volanti in giro ×0,45 e pattuglia in coda meno spesso, eventi strani del viaggio ×1,6; di giorno ×0,4). **Radio che disturba** di notte ogni 5-11 km (55 %): fruscio e per 2,4 s il titolo diventa un avviso già sentito sulla strada qualche minuto prima (niente testi nuovi). **«Quella dietro»** (scena di Codex): di notte, uscendo da un benzinaio dopo il km 12, una volta: il benzinaio ha visto un'auto identica alla tua parcheggiata dietro, vai a vedere (vuoto) o lasci stare, poi «Numero sconosciuto: Non accenderla. La tua è quella dietro.». **Interfaccia Essenziale / Meccanico** in Impostazioni → Grafica. **Buio nelle incursioni**: via tutto tranne strada, cruscotto e lampade; il buio lascia libera la strada. Test `test/notte.test.js` (anche: ogni condizione dell'ultima porta è messa da qualcosa che succede davvero).
- Per il proprietario: proposta di anomalie in `AVVISI.md` (è storia: decidi tu). La scena «Quella dietro» è la prima cosa di storia scritta da noi: se non ti va, `NOTTE_DIETRO` in `notte.js`.
- Aperto: l'auto gemella nella scena sta dietro di te e col quadro aperto si vede poco; il buio vero va provato giocando un'incursione intera.

## 22/11/2026 · proprietario (Nico) · v0.92 (**gratta e vinci, sigarette, occhi stanchi, botta forte**)
- Fatto: `tabacchi.js` (nuovo): nel market della Sosta 24 tre gratta e vinci («Notte Fortunata» 2 €, «Corsia di Sorpasso» 5 €, «Jackpot Autostrada» 10 €; premi in `GV_PREMI`, si vince il 24-25 % delle volte, in media tornano 70/77/81 cent per euro, fino a € 500/10.000/100.000) e il pacchetto di sigarette (10, € 5,50: ognuna −7 % di sonno, una dietro l'altra quasi niente, un filo di sete e igiene). Si grattano da fermi dal bagagliaio: biglietto a tutto schermo con la patina che si gratta col mouse o col dito, «Gratta tutto», suonino. Traguardo «Botta di fortuna» (vinci € 100). `sensi.js` (nuovo): col sonno le palpebre (sopra e sotto, orlo curvo) si abbassano, ogni tanto si chiudono pesanti, nel colpo di sonno si chiudono del tutto (`senApertura`, al posto della vignetta in `viaggio2d.js`); urto con differenza oltre ~36 km/h: fischio a due toni, motore ovattato (passa-basso dopo il compressore, `nightRun.audio.comp`) e buio che torna in 6 s (`senBotta`, prova: `NightSensi.prova()`). `index.html`: due righe (lista dell'autogrill, `audio.comp` e `nightRun.audio`). Test `test/tabacchi.test.js` (335 test), provato nel browser.
- Aperto: fischio e ovattato vanno sentiti sul PC (non ascoltati).

## 22/11/2026 · proprietario (Nico) · v0.90 (**meteo: vento vero, città, ora, nebbia horror**)
- Fatto (decisioni di Nico al check): in `meteo2d.js` il vento ha una direzione per episodio e soffia sulla fisica (`sim.windV` m/s contro la marcia o a favore, `sim.windX` di traverso; in `sim.js` l'aria che frena è quella relativa all'auto, di serie 0 = Supra e V40 come prima): una Panda col vento contro perde più di 10 km/h di punta. Neve e nebbia anche in città (prima in città sparivano), la neve smette solo al mare e nel deserto. Tempo dinamico secondo l'ora (`meteoPesi`: nebbia all'alba e la sera, neve più facile di notte, vento di pomeriggio). Di notte la nebbia arriva poco da sola e sale nei momenti horror: durante un'incursione o, una volta su due, dopo una cosa strana (`horrorFog`). Fruscio del vento più basso, lento e senza sibili. Test `test/meteo.test.js` (329 test), provati vento e neve in città nel browser.
- Aperto: il fruscio va sentito sul PC.

## 22/11/2026 · cognato (Luca) · v0.85 (**cinque auto iniziali**)
- Fatto: dai disegni HD del proprietario cinque auto nuove economiche, all'Autosalone: **Fiat Panda 1000 Fire** (45 CV, € 3.000), **Citroën AX 1.1** (60 CV, € 3.500), **Renault Twingo 1.2** (58 CV, € 4.500) da subito, **Dacia Sandero 1.2 16V** (75 CV, € 10.500) e **Toyota Aygo 1.0** tre cilindri (69 CV, € 9.500) dal km 10. Dati veri del motore in `schede.js` (coi pezzi di ognuna e un reparto speciale), voce in `GEN_NEW`, freni (le tre vecchie senza ABS), posti, nomi, traffico, finestrini del guidatore, utilitarie in garage e documenti, le tre vecchie anche allo sfascio. Test 318 (`suoni.test.js` conta 25 auto), foto in guida, prova di fumo.
- Aperto: guardarle e sentirle sul PC.

## 22/11/2026 · proprietario (Nico) · v0.88 (**cambi veri per tutte le auto da disegno**)
- Fatto: messa nel gioco la ricerca di Codex (`docs/fisica/RAPPORTO_CODEX_CAMBI.md`, 54 fonti: manuali d'officina, cataloghi, omologazioni svizzere, schede Quattroruote). `GEN_CAMBI` ha ora 20 auto con marce, finale e misura delle gomme di serie; il raggio della ruota si calcola dalla gomma (`genRaggio`, 97 % del geometrico). Velocità massime vicine alle vere (Panda 158/164, Twingo 150/151, 206 204/210, A80 190/186, Doblò 161/164, 850 R 241/250). 322 test, provata la Panda nel browser.
- Aperto: restano coi cambi comuni solo i mezzi generici (taxi, polizia, furgone, ambulanza, autobus). Sicurezza media per 206, 308, Clio e Corsa (vedi il rapporto). Le utilitarie spesso arrivano alla punta in 4ª: è così anche nelle vere (5ª lunga di risparmio).

## 22/11/2026 · proprietario (Nico) · v0.87 (**rapporti veri del cambio**)
- Fatto: cercati sul web (prove su strada d'epoca, manuali, forum dei singoli modelli) i rapporti veri. Messi in `GEN_CAMBI` (`cars.js`) per Golf GTI 1.8 (3,48-2,12-1,44-1,13-0,912, finale 3,65), 205 GTI 1.9 (BE1, 3,69), Clio Williams (JC5-014, 4,067), 850 R (M56, 4,00), Aygo (C551, 3,55), AX (MA, 3,937), Grande Punto (C514, 4,07), Sandero e Clio (JH3), Corsa (F13, 3,94). Risultati vicini ai veri: Golf 186 km/h e 8,6 s, 205 207 km/h e 8,0 s, Williams 213 e 8,0 s, 850 R 244 e 7,1 s. Test in `test/telaio.test.js` (322 test).
- Aperto: senza dati sicuri restano coi cambi comuni Panda, Panda 141, Polo, Twingo, 206, 308, A3, Audi 80, A112, Doblò e i mezzi generici (taxi, polizia, furgone, ambulanza, autobus). Le fonti della 850 R (la R aveva l'M56H, prima più corta), di AX, Clio e Corsa sono da forum o schede di modelli vicini: da sistemare se qualcuno trova il manuale.

## 22/11/2026 · proprietario (Nico) · v0.86 (**fisica e trazione vere delle auto**)
- Fatto: le 25 auto da disegno avevano tutte lo stesso telaio (passo 2,50 m, baricentro a 50 cm, 62 % del peso davanti, gomme uguali) e le ruote pesanti della Supra. Ora ognuna ha i suoi dati (`GEN_TELAIO` in `cars.js`): passo e peso sull'asse motore dalle schede, baricentro stimato, aderenza delle gomme di serie (le strette degli anni 80 e quelle da furgone 0,90-0,94, le sportive 1,0-1,03), inerzia delle ruote dalla loro misura (`genInerzia`). Attriti di trasmissione in scala col peso per le piccole (`P.lossK`, in `sim.js` di serie 1: Supra e V40 identiche), così arrivano alla velocità vera (Panda 157, AX 164, Aygo 164, Polo 162). M3 E30: finale europeo 3,25 al posto di 4,10 (0-100 in 6,7 s, 237 km/h come la vera). Il resto dello scatto resta quello tarato da Luca. Test `test/telaio.test.js`, 321 test. Provata nel browser la 205 GTI (cambio al motel, telaio caricato, partenza): nessun errore.
- Aperto: si sente guidando: carico che va dietro in partenza (le trazioni anteriori corte e alte pattinano prima), frenate, ruote più leggere sulle piccole. I rapporti del cambio restano quelli comuni (5 o 6 marce): quelli veri di ogni auto si possono mettere quando servono. Notato: uscendo dal motel la leva resta in D e il motore non si avvia finché non la metti in P (era già così).

## 22/11/2026 · cognato (Luca) · v0.82 (**auto nuove in alta definizione, versioni tuning e camion**)
- Fatto: le 25 auto da disegno (tutte tranne Supra e V40) rifatte dai disegni nuovi del proprietario, alla misura di sempre e a densità doppia (`img/<id>_hd.png`), con le ruote disegnate a parte che girano. Strumenti: `sfondo_via.py` (toglie lo sfondo), `affina_ruote.py` (centro dal cerchione, raggio fino a terra), `disegni_hd.py` (carrozzeria, ruota, vernice senza i vetri, versione tuning allineata), `camion_hd.py` (motrice + rimorchio in un disegno, assi quanti servono). In gioco: `street2d.js`/`nitido2d.js` disegnano la densità doppia senza Scale2x, danni anche sul disegno grande (`dettagli2d.js`), finestrini del guidatore rimisurati a mano (`pilota2d.js`). Versioni tuning (`spriteT`): «Kit completo» € 1.600 nell'estetica di ogni auto. Tolti dai disegni tuning gli stemmi (A112, scritta M della E36, Doblò). Camion: `CAMION` in `cars.js`, 12 voci in `GAME_TRAFFIC` (classe `truck`, pesano su `mix.truck` dei luoghi), il traino del soccorso arriva col carro attrezzi. Test 318, foto di tutte le auto, dei kit, dei camion e del traino.
- Aperto: guardarle sul PC (punto 20 dei sospesi). Le auto «iniziali» dello zip (Panda 141, AX, Twingo, Sandero, Aygo) sono pronte ma non sono nel gioco: non ci sono ancora auto con quei nomi; se si vogliono si aggiungono con scheda e prezzo.

## 22/11/2026 · proprietario (Nico) per il cognato · v0.84 (**campioni: correzione degli stridii**)
- Fatto: ascoltati da Nico, i campioni della v0.83 sembravano stridii acuti e irriconoscibili. Misurato: i botti avevano perso il corpo basso (sotto i 300 Hz dal 65-95 % al 30-55 % dell'energia) e i fischi d'aria acuti ondeggianti erano peggio dei seni di prima. Ora: anelli di turbo, compressore e cambio uguali alla v0.78, botti col tubo più cupo e il tonfo più forte (bassi di nuovo al 56-90 %, come prima), stu-tu-tu senza il soffio acuto; colpi più deboli alzati con una saturazione morbida (`LIVELLO`). Confronto «in gioco» (V40 e Golf con motore vero) mandato a Nico.
- Aperto: da ascoltare di nuovo (punto 2 dei sospesi). Se ancora non va, si torna ai campioni della v0.78 (`git show 7656e4b~3` per i file).

## 22/11/2026 · proprietario (Nico) per il cognato · v0.83 (**campioni dei pezzi meno robotici**)
- Fatto: Luca voleva i suoni dei pezzi più veri. Misurati i 42 kit: botti di scarico e limitatore erano per l'86-97 % toni puri sotto i 150 Hz (una «cassa da discoteca»), fischio del turbo e cambio seni quasi perfetti. In `strumenti/campioni_pezzi.py` ora: il botto è un colpo d'aria che rimbalza nel tubo (`tube`) con un tonfo di rumore cupo, i fischi sono aria stretta intorno alla nota che ondeggia a caso (`breath`, `_wander`, `pslow`: gli anelli si richiudono senza giunte), i «tu» della valvola sbuffi risonanti, il clack del cambio e il «whomp» dell'aspirazione senza seni, un filo di spazio intorno ai colpi (`spazio`, corto: il riverbero vero lo mette il gioco). Sonorità pesata A riportata a quella di prima kit per kit (`LIVELLO`), così `CMP.g` resta giusto. `CMP_VER` 2. 318 test, nessuna saturazione nel mix con V40 e Golf.
- Aperto: **non ascoltato** (punto 2 dei sospesi). Luca ascolti in cuffia il file prima/dopo che ha Nico e dica quali kit ritoccare.

## 21/11/2026 · cognato (Luca) · v0.81 (**chicche dell'officina, dalle idee di Codex**)
- Fatto (solo le cose semplici delle proposte di Codex, niente astronave): **toccare un pezzo non lo compra più**: si apre la scheda con nome intero, carattere (turbo Pronto/Stradale/Allungo coi giri di entrata e i bar, giri a 130 km/h per rapporto finale e cambio, chili in meno), cosa cambia sulla tua macchina (CV e Nm con un decimale se sono pochi) e un pulsante che dice cosa succede («Compra e monta · € N», «Monta»); al telefono finalmente si vede cosa si compra. Le scelte hanno il nome breve invece di «LIV. 2». «Suono diverso · potenza invariata» dove un pezzo cambia solo il suono. Assetto: pulsanti «Come di serie» e «Consigliato dal kit». **Correzione**: il FORTE non supera più il limite della centralina (`turbo.cap`, `sim.boostTop`): il GT3582 sulla centralina originale restava a 1,0 bar ma il FORTE lo portava a 1,2; il turbo piccolo da 0,5 sale ancora a 0,6. Test: `test/chicche-officina.test.js`.
- Aperto: le altre idee di Codex non sono state fatte (punto 2 dei sospesi). Provato nel browser su PC (scheda, acquisto, chiusura); al telefono non provato.

## 21/11/2026 · cognato (Luca) · v0.80 (**scarichi a livelli e collettore più cattivo**)
- Fatto: **scarichi**: ogni auto da disegno ha cinque livelli (originale, terminale, catback, senza centrale, da gara), ognuno più corto, aperto, forte e ruvido del precedente (`suoni.js`: `exTer`, `exCat`, `exCen`, `exRace`; per le auto fatte a mano `suonoMix` fa i gradini in mezzo; il terminale della V40 ora ha un suono suo, prima era uguale al catback). **Collettore/cat** (Supra, V40 e tutte le altre): quattro livelli (cat originale a 400 celle, cat a 200 celle, collettore tubolare con cat a 100 celle, decat) che non aumentano solo il volume: `dsp.js` accetta in `tune.cat` `len` (tubo più corto), `tone` (picchi in su), `bark`, `edge` (mordente dopo il silenziatore) e `rasp`/`jet`, quindi il suono sale di tono, è più duro e ruggisce di più. Misurato con il motore audio vero (media su tre regimi): il volume cresce di livello in livello (Panda, Golf, A3, V40...), il tono (centroide) sale con ogni livello di cat. Test in `test/suoni.test.js`.
- Aperto: **non ascoltato**, solo misurato: i passi e il «cattivo» vanno sentiti sul PC (punto 1 dei sospesi). Il tono dei cat sulle auto con scarico di serie molto chiuso (Supra, V40) sale poco: lo scarico di serie toglie gran parte degli alti, come nella realtà. 850 R: lunghezza dello scarico ritoccata (`timbro`) perché il catback suonava meno del terminale.

## 21/11/2026 · cognato (Luca) · v0.79 (**suoni diversi per ogni auto**)
- Fatto: prima 20 auto su 25 suonavano quasi uguale (Panda, Punto, Corsa, Golf, A112, Audi 80 identiche; 205, 206 e Williams identiche; i cinque diesel identici). `suoni.js` sceglie la famiglia dalla scheda del motore (città, berlina, sportiva, tricilindrico, turbo, cinque cilindri, diesel, autobus) e costruisce voce, scarico di serie, scarichi sportivi, aspirazione, inerzia di giri e tempi di cambiata; dentro la famiglia ogni auto cambia per cilindrata, valvole, giri e una «firma» fissa. I diesel hanno ritocchi propri (`timbro` in `schede.js`: il furgone secco, l'ambulanza rimbombante, il taxi malandato, la polizia più raffinata). Misurato con il motore audio vero: nessuna coppia di auto suona uguale, i volumi sono bilanciati. Test: `test/suoni.test.js`, tutta la suite passa.
- Aperto: **non ho potuto ascoltare**, solo misurare (spettro, volume, ruvidezza): il timbro va giudicato a orecchio sul PC, auto per auto (punto 15 di `SOSPESI.md`). I turbo di serie (A3, 308, Clio, 850 R, diesel) non hanno ancora il fischio della turbina: la fisica li tratta come aspirati con la spinta già nella curva.

## 21/11/2026 notte · cognato (Luca) · v0.78 (**campioni audio dei pezzi del motore**)
- Fatto: scheda **Suoni** nell'officina di Luca (`campioni.js`, accanto a Modifiche e Swap motore). Ogni pezzo montato porta la sua voce sopra la sintesi: **42 kit in 10 componenti** (valvola pop-off con pssh, trombetta, doppio pistone, sbuffo, quattro stu-tu-tu diversi e «mezzo e mezzo»; fischio del turbo per taglia fino alla sirena da drag; compressore volumetrico, centrifugo, a vite; screamer della wastegate; aspirazione fungo/cornetti/airbox; borbottio in rilascio in sei caratteri; centralina crackle, pop & bang, mitragliatrice, capodanno, anti-lag; limitatore, 2-step, fucilata in cambiata, stutter; cambio a denti dritti e sequenziale; spurgo nitro di scena). 180 file in `audio/campioni/<componente>/<kit>/`, **fatti a codice** (`strumenti/campioni_pezzi.py`, niente registrazioni di altri, 11 MB, si scaricano solo i kit montati). Montando un pezzo non di serie la sua voce arriva da sola e gratis; gli altri kit si ascoltano (▶), si comprano una volta per tutte le auto e si montano, o si spegne il componente; volume dei campioni 0-150 %. Note dei kit scritte da critico, col «Verdetto». In `dsp.js` tre flag (`valv`, `turb`, `bur`) zittiscono sfiato e pompaggio sintetizzati e abbassano fischio e borbottio quando li fa un campione (senza flag tutto come prima). Livelli tarati col nuovo `strumenti/ascolta_campioni.js` (fisica + sintesi + campioni in un WAV, con i livelli). Test 303 dopo l’unione con la v0.77 (9 nuovi), prova di fumo e prova nel browser (comprare, montare, guidare: i colpi partono) senza errori.
- Fatto anche: `desktop/copia-gioco.js` cercava ancora la cartella `pistone/` (cancellata nella v0.74) e la **build di Windows falliva a ogni caricamento** su main («Windows release», ENOENT): ora salta le cartelle che non ci sono.
- Aperto: **i suoni li ho misurati ma non ascoltati**: vanno sentiti sul PC (cuffie) e tarati (`CMP.g` in `campioni.js`, o il volume nella scheda). La mappa pop & bang resta spenta finché non la accendi (Guida), tranne quando monti apposta un kit della centralina.
- Cosa serve dall'altro: niente; il proprietario può provarli quando vuole (Da Luca Tuning → Suoni).

## 21/11/2026 sera · cognato (Luca) · v0.77 (**pulizia, Test 1, alta definizione leggera**)
- Fatto: tolto il codice morto. Scene vecchie degli interni (`interni.js` da 831 a ~270 righe, restano gli attrezzi, `dealerCar` e `junkCar`), consegne della vecchia modalità città (`offerJob`, entità `drop`, `game.job`), reputazione (chip in alto, `s.rep`, statistica del menu), controlli sulle sfide (`this.race`), traguardo ARRIVO delle gare (entità `line`), pedali e cambio a griglia nascosti nella scheda Guida (HTML, stile, aggiornamento a ogni fotogramma), bilancio di calore e protezione del motore costruito in `sim.js`, motore rotto in `soccorso.js` e `diario.js`. Restano `TEL_ATTI` e le app strane del telefono: si usano ancora. `test/motori.test.js` ora è `test/test1.test.js` («Test 1», anche nelle skill). Nuovo `insegne2d.js`: insegne grandi col carattere 5×7 in grassetto e oggetti del marciapiede ridisegnati a mezza unità, disegnati una volta e copiati (più leggeri di prima). Test 294, prova di fumo e foto prima/dopo.
- Aperto: le scritte piccole delle insegne (scala 1) restano col 3×5; se piacciono quelle grandi si possono fare anche loro.

## 21/11/2026 sera · cognato (Luca) · v0.76 (**aspetto dei personaggi**)
- Fatto: in `personaggio.js` i tratti speciali `L.x` (canotta, tatuaggi, muscoli, catena, pazzo, barbone), solo per i personaggi del gioco: l'editor del protagonista e i passanti non cambiano. Nico giovane e swag (cappellino, occhiali da sole, canotta nera, braccia tatuate, catenina) anche sul furgone del soccorso; Tito vecchio e pazzo; Rocco fisicato in canotta e un po' più grande; Massimo barbone con la bottiglia. Test 293, foto di tutti e quattro.
- Aperto: guardarli sul PC (punto 21 dei sospesi).

## 21/11/2026 sera · cognato (Luca) · v0.75 (**nomi nuovi di negozi e personaggi**)
- Fatto: Mario tolto, al suo posto Nico (Officina Nico; il furgone e il carro attrezzi del soccorso sono suoi, `SOC_LOOK` = il suo aspetto; il traino porta sempre all'Officina Nico). Neon Kustom → Russian Kùstòm (insegne a pixel RUSSIAN KUSTOM, il font a pixel ora toglie gli accenti invece di saltare la lettera), Motel Ovunque → Motel 4Ever (insegna 4EVER) con Tito. Personaggi con nome nei pannelli, negli interni e nelle missioni: Nabir (bar, ora un uomo), Rossana (benzinaio, ora una donna), Phill Grill (cassa della Sosta 24), Rocco Lostallone (Autosalone), Massimo Lo Sfascio (sfascio). Gli id delle tappe restano quelli di prima (`niko`, `style`, `motel`...): i salvataggi vanno. Test 292, foto di tutti gli interni senza errori.
- Aperto: aspetto dei personaggi (punto 21 dei sospesi). Le scene vecchie degli interni (`SCENE.<id>_vecchio`) hanno ancora la barista e la cassiera di prima: non si usano.

## 21/11/2026 sera · cognato (Luca) · v0.74 (**Pistone cancellato, Prestazioni, auto elaborate**)
- Fatto: cancellata la cartella `pistone/` (banco dei motori di Nico) e i suoi agganci (`index.html`, `sviluppatori.js`, `valigette.js`, `sfascio.js`, `sim.js` solo commenti). L'unica cosa che serviva ancora, il peso del motore per lo swap, è in `officina.js` (`offKgSerie`); chi aveva speso da Nico riceve i soldi una volta sola (`offPistoneRimborso`). Nuova sezione **Impostazioni → Grafica → Prestazioni** (`prestazioni.js`): scelte pronte, voci una per una, tetto a 30/60 fotogrammi, e in «Automatica» gradini che spengono una cosa alla volta (prima il bagliore, la densità per ultima) invece di passare subito a densità semplice. Vendita all'Autosalone: le modifiche valgono metà di quello speso in pezzi e swap (`dlMods`). Test 292 (tolti i 18 del Pistone, aggiunti 5), prova di fumo e prova nel browser senza errori.
- Aperto, **Nico cerca un'altra mansione** (punto 3 dei sospesi). Proposte di Claude: (a) **il ricambista dello sfascio**: sta allo Sfascio Ruggine e trova pezzi rari usati (già c'è il «pezzo raro» di `JK_FINDS`); (b) **il soccorso stradale**: è lui il meccanico del furgone di `soccorso.js`, che oggi è anonimo (`SOC_LOOK`); (c) **il preparatore del banco prova**: sta ai rulli di Luca (`banco.js`) e commenta le curve. La (b) costa meno e gli dà una faccia che si vede spesso.
- Cosa serve dall'altro: il proprietario guardi Prestazioni sul PC (se «Automatica» scende senza motivo, si alza `PREST.ms`).

## 21/11/2026 · cognato (Luca) · v0.73 (**frizione che non slitta col kit**)
- Fatto: misurato con il tuning massimo di ogni auto quanta coppia arriva alla frizione e quanto slitta in 3ª-5ª. Con la frizione migliore acquistabile 11 auto slittavano ancora (Panda, Polo, A112, Golf, Clio, 205, Williams, Audio 80, A3...): il kit «sport» regge solo ×1,5 la frizione di serie, ma il motore a fondo ha 2-3 volte la coppia di serie. Il Supra non cambiava affatto: i pezzi della frizione toccavano solo il volano, mai la capacità. Ora ogni auto ha un terzo livello «Bidisco da corsa con volano in acciaio leggero» (×3, € 2.600, km come gli altri pezzi di fascia alta; la preparazione «Da gara» lo monta) e il Supra ha oem 820 Nm / bidisco 1.300 Nm. Con la migliore: 0 % di slittamento in 3ª-6ª su tutte le auto; con quella di serie su un motore molto potente slitta ancora (E36 36 %, A3 100 %). Test in `test/frizione.test.js` (305).
- Aperto: il «singhiozzo ogni tanto» non c'è: con il kit giusto non slitta mai. Si può aggiungere un piccolo colpo a caso solo con il livello sport quando la coppia è oltre il 90 % della capacità: da decidere con Luca.

## 21/11/2026 · cognato (Luca) · v0.71 (**più sprint in accelerazione**)
- Fatto: misurato 0-60 e 0-100 di tutte le auto con il cambio automatico del gioco, col controllo di trazione acceso e spento. Le piccole erano a posto; le potenti perdevano troppo sgommando: con il TRC spento la E34 faceva 0-100 in 9,1 s contro 6,6 con il TRC (gomma che dopo il picco perdeva il 21 % della forza, spinta di aderenza sfruttata male, carico che passava dietro in ~0,8 s). In `sim.js`: `P.tr` 1,08, `tyre.fall` 0,6, trasferimento di carico più rapido, TRC al 12 %, cambiate ×0,8. Ora (cambio automatico, TRC acceso): Supra 6,1 → 5,8 s, E36 6,6 → 6,1, E34 6,6 → 6,2, V850 7,6 → 7,2, V40 9,5 → 9,2; Panda e Polo quasi uguali. TRC spento: E34 9,1 → 6,3. Test nuovi in `test/accelerazione.test.js` (302).
- Aperto: il Supra resta ~0,5 s più lento dei tempi da rivista (5,0-5,3): la potenza e il peso di serie sono giusti, il resto lo fanno la turbina che sale piano e le due cambiate. Da sentire sul PC; se serve ancora più scatto si tocca `P.tr` (aderenza) o `shiftK`, non la potenza. Non provato nel browser con l'audio (solo fisica).

## 21/11/2026 · proprietario · v0.72 (**pedoni in alta definizione, leggeri**)
- Fatto: a densità doppia i passanti che camminano sul marciapiede (`quartieri2d.js`, `fig`) sono disegnati come il protagonista: pixel art vera
  con giacca, capelli, passo. 34 aspetti fissi (24 qualunque, incappucciati, operai col caschetto, giacca scura), 8 pose ciascuno in memoria; al
  massimo 2 pose nuove per fotogramma (0,36 ms l'una), intanto resta l'omino di prima. Misurato: 168 pose in un minuto, 60 ms in tutto.
- Aperto: fermi (fumatore, seduto), bambini e muletto restano a blocchi; con qualità bassa o leggera tutto come prima.

## 21/11/2026 · proprietario · v0.70 (**editor della storia**)
- Fatto: pagina personale `strumenti/editor_storia.html` (fuori dal gioco): conversazioni per persona e fase, mappa a bivi con frecce, a destra testo originale e «come lo vorrei» (messaggi, varianti, risposte). Bozza salvata nel browser; «Copia modifiche» / «Scarica file» dà il JSON. Si assorbe con `node strumenti/assorbi_modifiche.mjs <file>`, che lo unisce in `chat_modifiche.js` (caricato dopo `chat_dati.js`, quindi sopravvive alla rigenerazione). Cambia solo le parole, non bivi, condizioni, effetti.
- Poi: lista **in sequenza di gioco** (scheda Sequenza: capitali, fasi, km) e striscia in alto con una corsia per persona e un pallino per ogni conversazione che parte (clic = ci va). I km sono quelli segnaposto di `CHAT_START`; le conversazioni con flag `luogo_*` o `ev_*` si posano sull'arrivo della capitale. Senza km: quelle a confidenza e quelle che partono da scelte o regia.
- Aperto: la storia secondaria di Jeshka e Luca sta in `jeshka.js` (`JL_SCENE`), non nelle chat: non è nell'editor. Non provato il tasto Copia negli appunti (nel browser di prova); Scarica file sì come logica.
## 21/11/2026 · cognato (Luca) · v0.67 (**chi è chi**)
- Fatto: sezione «Chi è chi» in `AGENTS.md` (solo per gli assistenti): Nico = proprietario e motorista del gioco, Luca = cognato e meccanico di Da Luca Tuning. «È per Nico» vuol dire il proprietario. Corrette le attribuzioni di v0.65 e v0.66 e dei sospesi (il punto 4, i pedoni, lo decide Nico).
- Aperto: i commit v0.63-v0.66 portano `Per: proprietario` (sbagliato per i miei: erano di Luca); la storia di git non si riscrive.

## 21/11/2026 · cognato (Luca) · v0.66 (**schede tecniche delle auto e pezzi con personalità**)
- Fatto: `schede.js` con la scheda vera di ogni auto (cilindrata, cilindri, valvole, alimentazione, benzina/diesel, CV, Nm, cambio, trazione) e i pezzi suoi: marchi e nomi propri per scarico, filtro, camme, downpipe, centralina, gomme e un reparto speciale a due livelli; nuovi reparti Downpipe e Camme sui benzina (sui diesel lo scarico ha il FAP, rimappatura più generosa, niente scoppi). Polo, Clio e 308 ora sono a **tre cilindri** (`dsp.js`: uno scoppio ogni 240°, voce ruvida). Il turbo di serie di A3, 308, Clio, 850 R e dei diesel è dichiarato. La scheda compare nell'officina (`officina.js`). Tolto il carattere audio «Codex · deciso» (menu, `dsp.js`, `index.html`, `ascolta.mjs`). Test: `test/schede.test.js`, 297 passati.
- Aperto: provata a vista solo la V40; prezzi, km e rese dei pezzi nuovi tarati a occhio; le modifiche vere (pezzi nuovi) si aggiungono man mano a `mods` di ogni auto. Vedi punti 15-16 di `SOSPESI.md`.

## 21/11/2026 · cognato (Luca) · v0.65 (**sospesi numerati**)
- Fatto: `SOSPESI.md` riscritto con punti numerati (regola: sempre elenco numerato, numerazione continua). Economia, missione della valigetta e danni sono in pausa fino alla fine (punti 1-3). Aggiunti il 16 (cosa riportare di Nico) e il 17 (provare la versione Windows).
- Aperto: decisioni sui punti 4-16; nessuna richiesta all'altro.
## 21/11/2026 · cognato · v0.69 (**installatore Luca**)
- Fatto: i file dell'installatore e del portatile si chiamano `Night-Run-Luca-<versione>-Installazione.exe` e `...-Portatile.exe` (`desktop/package.json`, workflow di rilascio, titolo della release «Night Run Luca»). Il nome interno (`appId`, cartella dei salvataggi) non è cambiato, per non perdere le partite.
- Regola: se questo installatore viene cambiato o se ne aggiunge un altro, **si chiede prima quale sovrascrivere**. Aperto: un installatore di Nico con lo stesso `appId` sullo stesso PC prenderebbe il posto di questo; se devono stare insieme servono `appId` e cartella dati diversi (da decidere con lui).

## 21/11/2026 · cognato · v0.68 (**aggiornamenti del programma Windows**)
- Fatto: dalla richiesta di Codex (aggiornamenti dal programma). Nel menu, Partita, in fondo, riquadro **Aggiornamenti** (`aggiorna_ui.js`, solo nel programma Windows): Cerca, Scarica, Installa e riavvia / Più tardi, stati chiari (aggiornato, nessuna versione, senza rete, download fallito). Dietro: `desktop/aggiorna.js` con `electron-updater` 6.8.12 (manuale: niente download né installazione da soli), ponte `window.nightUpdate` nel preload, installazione che prima scrive la partita su file e ne tiene un checkpoint a parte (se il salvataggio fallisce non installa). `.github/workflows/desktop-release.yml`: a ogni caricamento su `main` test, build Windows sullo stesso commit, release `v0.2.N` (bozza, poi pubblica a file completi, una alla volta). Versioni `0.2.N` SemVer, distinte da quelle di `VERSIONI.md`; commit in `info-build.json`. Test: 17 nuovi in `desktop/test/aggiorna.test.js` (292 del gioco ancora verdi), prova su Electron vero (ponte e riquadro, in sviluppo), impacchettamento provato fino ad `app-update.yml`.
- Aperto: **non provato** l'aggiornamento vero da un'installazione A a una B (serve Windows e due release): da fare sul PC dopo la prima release. Il workflow non ha mai girato su GitHub: alla prima esecuzione guardare i log (permessi di Actions: «Read and write» per i workflow). Portatile: solo link alla pagina. Niente firma digitale (SmartScreen resta). Il primo installatore con updater va installato a mano una volta.

## 21/11/2026 · proprietario · v0.64 (**Luca Garage**)
- Fatto: app **Luca Garage** nel telefono (`lucagarage.js`): ti lascia davanti al negozio di Luca più vicino (davanti o dietro) per € 150, da fermi e fuori dai locali. Si scarica con un
  cartellone sulla strada al km 26 (dopo l'app Motel); in Sviluppatori c'è «Sblocca Luca Garage» (`NightDev.luca`). Unita dopo l'officina v0.63.
- Aperto: «Luca Garage» non esisteva, è un'interpretazione: prezzo e cartellone si ritoccano in `LG` e `TEL_APP_OFFERS`. Il pulsante nel telefono non è stato cliccato col mouse (Shadow DOM), provata la stessa funzione `lgGo`.

## 21/11/2026 · proprietario · v0.63 (**officina di Luca: pezzi nuovi per la V40 e pallini verde/rosso**)
- Fatto: sulla V40 (`cars.js`) nuovi pezzi: turbo da **0,5 / 1,0 / 1,5 bar** (oltre ai due che c'erano; ogni turbo ha il suo flusso, la centralina originale tiene a 1 bar),
  **downpipe** (reparto Downpipe e catalizzatore: cat sportivo e decat), **terminale**, **airbox con presa d'aria fredda**, **camme** (sportive e da corsa), **cambio** (ravvicinato e
  corto da drag), **gomme da drag** (livello 3), **frizione da corsa**. La preparazione «Drag 450» (`V40_PRESETS`) arriva a ~520 CV, 620 Nm. Nell'officina (`officina.js`) ogni livello ha un
  **pallino**: verde = ce l'hai (un clic **monta**), rosso = non ce l'hai (un clic **compra**, poi lo monti), col lucchetto servono i km.
- Aperto: solo la V40 ha i pezzi nuovi (le altre auto hanno ancora i loro cataloghi più corti, `genCatalog` e `TUNING_SUPRA`). I pezzi di Nico (`pistone/`, magazzino) restano spenti: non sono
  nell'officina semplice. Le cifre (CV, prezzi, km) sono tarate a occhio.

## 21/11/2026 · proprietario · v0.62 (**Night Run per Windows, da Codex**)
- Fatto: unito il lavoro di Codex (Electron). `desktop/` (finestra del gioco con sandbox, protocollo `app://`, salvataggi in `%APPDATA%\night-run\salvataggi` con backup, build per
  installatore e portatile), `vendor/fonts/` (30 caratteri locali con le licenze al posto di Google Fonts), `sw.js` col nuovo `VERSIONE`. Guida in `desktop/LEGGIMI.md`.
- Aperto: l'installatore e il portatile non sono nel repository (si costruiscono da `desktop/` con `npm run dist`) e **non provati da me** (qui non c'è Windows): da provare sul PC con
  l'installatore di Codex, soprattutto l'ascolto del motore, una guida lunga e l'installazione e disinstallazione.

## 21/11/2026 · proprietario · v0.61 (**assetto a livelli**)
- Fatto: assetto a 6 livelli per ogni auto (`tuning.js`, `sim.js`): dal livello 1 due cursori regolano altezza (mm, anche rialzata) e rigidità (% delle molle di serie); la fisica
  (baricentro, aria, presa, beccheggio, partenza, saltellamento e fondo che tocca) e il disegno seguono. I cursori ora stanno nella **nuova officina** di Luca (`officina.js`, gruppo
  Ruote e telaio): il pannello a tendine su cui era scritto non c'è più. Il «ta-dum» dei giunti resta spento: dei giunti restano solo le scintille a assetto troppo basso.
- Aperto: valori tarati a occhio, da provare in mano. Nel 3D (tolto) l'altezza non si vedeva comunque.

## 21/11/2026 · proprietario · v0.60 (**la piazzetta**)
- Fatto: `piazzetta.js`. Ogni 2 o 3 tappe (dalla quarta) la tappa è una piazzetta con due negozi affiancati: la tappa non cambia (bacheca, lavori e consegne come prima), le si aggiunge un secondo negozio a caso tra gli altri. **Luca e Neon Kustom (Jeshka) non stanno mai nella stessa piazzetta**, le altre coppie sono tutte uguali. U sulla piazzetta chiede dove entrare. La telecamera punta al centro dei due negozi (`street2d.js`), le strisce del posto auto sono di ognuno (`entrata2d.js`). 4 test nuovi (269), la prova di fumo ci passa dentro.
- Aperto: nella piazzetta i due negozi hanno la stessa bacheca dei lavori della tappa; l'auto parcheggia nel posto del negozio scelto ma la camera resta sul gruppo. Da guardare col gioco vero: facciate larghe come il benzinaio con un garage possono stare strette.

## 21/11/2026 · proprietario · v0.59 (**frasi di pipì e cacca**)
- Fatto: nuovi pensieri (`pensieri.js`, `pee` e `poo`, sette frasi a livello, serie e comiche: «Oh merda, mi sto cagando addosso»), avvisi e tre frasi a testa per l'incidente quando arrivi a zero (`viaggio.js`). Testi miei, da rivedere.

## 21/11/2026 · proprietario · v0.58 (**pipì e cacca**)
- Fatto: due bisogni nuovi nel quadro (🚽 e 💩) e nei pensieri. Solo col tempo: la pipì si svuota in 12 «ore di viaggio», la cacca in 24, e un'ora di viaggio vale 3 minuti veri (`VG_BAGNO` in `viaggio.js`: l'orologio del gioco corre a 3 minuti per secondo e a ore di gioco vere sarebbe una pausa bagno ogni 4 minuti). Bere fa venire prima la pipì, mangiare la cacca. Il bagno è gratis in bar, autogrill, benzinaio e motel. A zero fuori da un locale te la fai addosso e l'igiene crolla. 4 test nuovi (265).
- Aperto: i tempi sono da provare (pipì ogni ~36 min veri, cacca ogni ~72): si cambiano in `VG_BAGNO`.

## 21/11/2026 · proprietario · v0.57 (**Sviluppatori: cinque strumenti in più**)
- Fatto: scheda Sviluppatori con **Vai a** (km o prossima tappa di ogni tipo), **Bisogni e benzina** (riempi, o infiniti), **Danni e usura** (ripara, o indistruttibile), **Meteo e ora** (pulsanti), **Storia e telefono** (flag di chat/storia, tutte le app, L'ultima porta). Le spunte si ricordano nel browser (`nr_dev`). Provati nel browser, senza errori in console.
- Aperto: nessun test automatico per questi strumenti (usano la pagina); li copre la prova a mano.

## 21/11/2026 · proprietario · v0.56 (**Sviluppatori: Disabilita polizia**)
- Fatto: nella scheda Sviluppatori la spunta **Disabilita polizia** (`POL.off` in `polizia.js`, `game.polOffSet`): la polizia c'è e si vede, ma non può fermarti, multarti né inseguirti (fermi per velocità, posto di controllo, etilometro, coda, sfanalare una volante); autovelox e Tutor restano sulla strada ma non multano; accesa, il ricercato e i verbali in arrivo si azzerano. Si ricorda nel browser. 1 test nuovo (261).
- Aperto: nessuno.

## 20/11/2026 notte · proprietario (**v0.55 · assicurazione, traino, diario**)
- Fatto: (1) **assicurazione con franchigia** (`documenti.js`): in regola, carrozzeria e soccorso costano al massimo € 150; il resto lo copre lei ed è un sinistro
  (premio +25 % l'uno, al massimo il doppio, ne sparisce uno ogni 300 km); scaduta si paga tutto. (2) **Guasti e traino** (`soccorso.js`): da fermo con motore
  rotto o gomma a terra la domanda propone l'app; servizio **Traino** (motore rotto → da Luca, dove Nico lo rifà; auto distrutta → da Mario): catena, buio,
  si arriva davanti all'officina (premi U), € 60 + € 12 al km; non si può con una consegna in corso prima dell'officina. (3) **Diario** (`diario.js`, app nel telefono):
  capitali, incidenti, fughe, motore rotto, auto nuove, soccorso, ogni 100 km, con foto piccole fuori dal salvataggio.
- Aperto: la prossima officina dello stesso tipo è lontana (Mario e Luca ogni ~38 km): il traino salta quella strada (eventi, bisogni sì, odometro no). Se è troppo,
  si può far arrivare al locale più vicino anche indietro. Il diario scrive anche «Arrivo a Tokyo» al km 0.

## 20/11/2026 notte · proprietario (**v0.53 · elenco delle versioni**)
- Fatto: `VERSIONI.md` (al posto di `VERSIONE.md`): versione attuale, regola e una riga per ogni versione con giorno, chi e cosa. Da v0.01 a v0.50 è
  ricostruito dalle voci del diario (approssimato), da v0.51 è esatto. Da qui in poi lo compila chi fa l'intervento, prima di chiuderlo.

## 20/11/2026 notte · proprietario (**v0.52 · conteggio delle versioni**)
- Fatto: `VERSIONI.md`. Ogni intervento (sessione o pacchetto di modifiche) alza la versione di un passo; si parte da v0.50 (le 50 voci del diario prima
  di oggi), il soccorso è la v0.51. Regola aggiunta in `AGENTS.md` (regola 1).
- Aperto: la versione non è ancora mostrata nel gioco (titolo o menu): se la vuoi vedere in Impostazioni, dimmelo.

## 20/11/2026 notte · proprietario (**v0.51 · soccorso stradale: chiami il furgone e ti sistema l'auto**)
- Fatto: app **Soccorso** nel telefono (`soccorso.js`): scegli uno o più servizi (pieno, carrozzeria, gomme, gomme nuove, manutenzione) col prezzo vero di ciascuno
  più l'uscita (€ 40). L'auto accosta nella corsia più a destra, il furgone ti supera e si ferma davanti con le quattro frecce, il meccanico scende e lavora
  (martello, aria, olio, pompa) e l'auto migliora davvero poco per volta; si paga alla fine. Riquadro con le barre e «Accelera ×4». Dal «A secco» si arriva all'app.
- Aperto: nel gioco non c'è una corsia d'emergenza vera, quindi si lavora nella corsia più a destra (il traffico rallenta per le quattro frecce); il furgone è il
  `van` del traffico, un carro attrezzi vero verrà dopo. Non provato su telefono in orizzontale (solo il riquadro e l'app, che sono HTML come il resto).

# Diario di Night Run

Due o tre righe a fine sessione, le più recenti in alto: cosa è stato fatto, cosa resta aperto, cosa serve
dall'altro. Lo scrive Claude a fine lavoro (skill `night-run-pubblica`); l'hook di inizio sessione mostra le ultime
due voci, e il controllo della sera le legge.

## 21/11/2026 · proprietario · v0.54 (**sei miglioramenti: prova di fumo, pausa, suggerimenti, prossimo traguardo, anteprima officina, qualità ricordata**)
- Fatto: **prova di fumo nel browser** su GitHub (`strumenti/fumo.js`, job `fumo`: una tappa per tipo, errori di console = rosso); **pausa** quando la finestra perde il fuoco (alt-tab: il gioco si ferma e riprende con un tasto o un clic; non al tocco; Impostazioni → Grafica, «Pausa se esci»); **suggerimenti dei primi minuti** (`suggerimenti.js`, uno ogni 40 s al massimo, una volta sola, spegnibili in Impostazioni → Guida; con un joystick non standard si apre da sola la finestra di assegnazione); **prossimo traguardo** sempre nel quadro (`obiettivo.js`); **anteprima nell'officina** (passando sopra un livello le barre mostrano il prima/dopo); **qualità**: se il computer è andato a densità semplice resta così al prossimo avvio (si azzera scegliendo la qualità a mano), contatore FPS opzionale. 10 test nuovi (256).
- Aperto: nell'anteprima con uno swap montato si guarda solo il motore (non peso né gomme); il tasto «Pausa se esci» è acceso di serie, se dà fastidio si spegne dalle Impostazioni.

## 21/11/2026 · proprietario (**officina semplice: Modifiche e Swap motore; Tutor ogni 10-15 km**)
- Fatto: `officina.js`. Da Luca una schermata sola a due schede (era un pannello di 3.600 px con Nico e sei schede): **Modifiche** (pezzi a livelli in riquadri, un clic compra e monta, la i spiega, livelli SERIE/1/2 sempre sbloccati e km solo dal 3 in su) e
  **Swap motore** (il motore di un'altra auto del gioco: curva, giri, turbo, cilindri, voce e peso; i pezzi del motore dopo lo swap sono quelli del nuovo motore). Il vecchio Nico resta in `pistone/` ma spento di serie (interruttore in Sviluppatori); nel menu la scheda
  Officina non ha più il negozio. 5 test nuovi (246 in tutto), provato nel browser: V40 140 CV → motore Supra 330 CV, turbo e pezzi del donatore comprabili. **Polizia**: un Tutor ogni 10-15 km lungo da 500 m a 1 km, niente autovelox a 700 m da lui; la prova del Tutor era instabile e ora è deterministica.
- Aperto: **da dire a tuo cognato** (i motori sono suoi): Nico è spento di serie, da decidere cosa riportare nell'officina semplice (interni V40, banco, motori costruiti). Non fatto: anteprima prima/dopo sulle barre, interni del motore (albero, bielle...) come pezzi semplici.

## 20/11/2026 notte · proprietario (**fluidità: palazzi preparati prima, meno lavoro a ogni fotogramma**)
- Fatto: il palazzo che sta per entrare da destra si porta a densità doppia (`tileHD`) quando è ancora fuori schermo, uno per fotogramma
  (`street2d.js`, `drawCity`): misurati 113 su 113 pronti prima di comparire, prima si facevano nel fotogramma in cui entravano (anche due o tre
  insieme). Numeri con un formattatore preparato una volta (`fmt` in `index.html`, stesso risultato); pedali, quadro grande e telemetria non si
  riscrivono col menu chiuso. Tre minuti di guida: memoria ferma a 14 MB, niente perdite.
- Da sapere: nel browser di prova (senza scheda video) il gioco passa da solo a densità semplice dopo 3 s (`this.slow`); per provare l'alta va forzato.

## 20/11/2026 notte · proprietario (**scatti: niente più letture di pixel dalla scheda video**)
- Fatto: misurato un minuto di guida. Timer, salvataggi e stile premium non pesano; il sospetto è nelle tele preparate al volo e poi rilette
  (~5 letture al secondo: palazzi, auto, sagome, Scale2x), che sul PC stanno nella scheda video e a ogni lettura la fermano. Ora nascono già
  «nel processore» (`willReadFrequently` alla creazione: 13 righe in `street2d.js`, `quartieri2d.js`, `nitido2d.js`). Ridisegnate a ogni
  fotogramma: invariate. Nel browser di prova (senza scheda video) lo scatto non si vede: va sentito giocando sul PC.
- Aperto: i palazzi creano ~9 tele al secondo mentre si guida (la cache tiene 260 tessere): se gli scatti restano, il prossimo passo è lì.

## 20/11/2026 notte · proprietario (**polizia: posti di controllo che multano al passaggio, autovelox, Tutor e mappa**)
- Fatto: il **posto di controllo** non ti ferma più e non fa partire nessuna volante: passi e ti multano (velocità sempre, documenti scaduti a caso),
  da ricercato non multano, ti inseguono (`polCheck` in `polizia.js`). **Autovelox** (palo con la cassetta quadrata, flasha) e **Tutor** (un palo con
  telecamera all'inizio e uno alla fine) multano subito, non più con il verbale dopo qualche km. **Mappa in basso**: nuovi segni per pattuglie, posto
  di controllo, blocco, volanti che ti inseguono, autovelox, Tutor con il tratto sorvegliato (`polMap`), e la scritta della più vicina.
- Aperto: le pattuglie che fanno il radar (parcheggiate o in giro) ti fermano ancora e hai Paga / Contesta / Scappa, come prima: se vuoi lo stesso
  passaggio senza fermarti, dimmelo.

## 20/11/2026 notte · proprietario (**estetica premium: layout, banner, icone**)
- Fatto: `premium.css` e `premium.js`. Icone disegnate al posto di emoji e simboli (barra in alto, bisogni, cruscotto a tessere, frecce, avvisi,
  pannelli dei locali, telefono); vetro scuro e pulsanti metallici; avvisi con icona e barra del tempo; traguardo dorato; titoli dei quartieri e
  delle capitali. Interruttore Premium/Classico in Impostazioni → Grafica (Classico = come prima). Provato su PC e al tocco, console pulita.
- Aperto: non guardati uno per uno i pannelli di autosalone, sfascio e Nico (prendono lo stile comune dei pulsanti).

## 20/11/2026 notte · proprietario (**grafica più nitida e dettagliata; ruote della trazione anteriore**)
- Fatto (`nitido2d.js` nuovo, agganci piccoli in `street2d.js`): ingrandimento sullo schermo a pixel tutti uguali (prima su un 1080p
  erano larghi 1 o 2 pixel a caso), carrozzerie e ruote dai disegni passate per Scale2x (curve e diagonali senza scalini, ruote che girano
  lisce), contorno e luci dell'auto alla densità vera, bagliore più netto, scia della velocità più leggera e nitida. Più dettagli:
  marciapiede a lastre con fughe, crepe e cordolo di pietra, cordolo vicino, lampioni nuovi (palo tondo, braccio curvo, base coi
  bulloni, vetro acceso), riflessi sull'asfalto più fini, cartacce riconoscibili (`vita2d.js`). Qualità bassa e leggera come prima.
- Fatto: sulle auto a **trazione anteriore** (V40, Panda, Golf...) ora gira forte la ruota davanti e la dietro rotola (`street2d.js`);
  al banco di Luca girano solo i rulli sotto le ruote motrici (`banco.js`). `strumenti/prova.js --vista 1920x1080` per le foto grandi.
- Aperto: i pedoni del marciapiede sono ancora i vecchi omini a blocchi (il prossimo passo: disegnarli come il protagonista).

## 20/11/2026 notte · proprietario (**fiamme al rilascio: medie fino a 5.000 giri, bella fiammata sopra**)
- Fatto: provando il gioco le fiamme al rilascio non uscivano quasi mai (servivano valvola o Supra e un caso fortunato). Ora ogni auto toccata dal
  tuning ne fa: molli sotto i 5.000 giri = fiamme di livello medio, sopra = una bella fiammata grossa (nello spinto con l'ossidrica); il primo
  scoppio parte subito appena molli il gas, sopra i 5.000 ne parte un secondo. Provato in folle a più giri: sotto 4.800 tre fiamme medie, da 5.600
  fiamme grosse. Il numero dei giri (5.000) è `FLAME_BIG_RPM` in `fiamme.js`.
- Aperto: da sentire/vedere giocando sull'auto vera (il livello dipende da quanto è preparata).

## 20/11/2026 notte · proprietario (**fiamme secondo il tuning**)
- Fatto: l'auto ha un livello di preparazione (leggero, medio, spinto: `flameTier` in `fiamme.js`) e da quello dipende la fiammata: leggero fa
  soprattutto un piccolo **botto** circolare, medio la **fiamma libera** in quattro versioni (classica, doppia lingua, lunga, tozza; arancio e
  giallo), spinto l'**ossidrica** (getto blu sottile e rapido, diamanti, scintille) e a metà rilascio la fiamma libera. Anche le cambiate
  danno qualche fiammata sull'auto potenziata. La mappa ECO/FORTE del turbo sposta il livello. Provate nel browser tutte e tre le famiglie.
- Aperto: il suono dei botti non cambia con il tipo (resta quello del motore audio); le soglie dei livelli vanno sentite giocando.

## 20/11/2026 notte · proprietario (**turbo vero, scarico, negozio dei pezzi a categorie**)
- Fatto: la mappa del turbo (ECO / NORMALE / FORTE) cambia i bar in tubo (0,44 / 0,79 / 0,89 con 0,9 di massimo), non solo la coppia; scarico
  aperto più forte (125 %), chiuso più basso (72 %) e senza fiamme; fiammata media al rilascio ai giri medi. Negozio di Luca in schede per
  categoria (Motore, Turbo e aria, Scarico, Trasmissione, Ruote e telaio) con i pezzi a livelli e un clic per montare (`renderTuneShop`).

## 20/11/2026 notte · proprietario (**briefing: AUTO 5 s, leva S, tasti, schede di Nico, vernice**)
- Fatto: AUTO 1 dopo 5 s; leva con la **S** sport (`autoBox` tiene i giri alti); tasti 1-4 solo per mangiare e bere (via le marce dai
  numeri, `tasti.js` aggiornato); pannello di Nico a schede (Livelli, La mia auto, Negozio, Magazzino, Banco, Motori); magazzino pezzi
  a 100 (`MOT.maxPezzi`); valigette senza turbo; maschera vernice di Golf GTI e 205 GTI rifatta (`strumenti/maschera_scura.py`).
- Aperto: codice morto delle vecchie gare, camion (disegni dal proprietario), alta definizione di marciapiedi e pedoni. Il cognato
  decide i punti motori di `SOSPESI.md` (vendere la V40 coi pezzi, estendere ai altri motori, vecchio Pistone).

## 20/11/2026 sera · proprietario (**la cassa pesante non blocca più le missioni**)
- Fatto (`missioni.js`, riga della bacheca in `index.html`): senza rimorchietto l'obiettivo dice cosa serve e dove
  («240 kg: serve il rimorchietto, al Motel Ovunque (€ 2.200)», o «attacca il rimorchio», o «fai spazio»); in bacheca
  c'è «Lascia perdere»: la cassa la porta un altro e il lavoro dopo (la busta) arriva alla bacheca successiva. Test in
  `test/missioni.test.js`.

## 20/11/2026 sera · proprietario (**prova dei primi 200 km col giocatore automatico**)
- Fatto: `strumenti/giocatore.js` gioca una partita nuova del Viaggio da solo a tempo accelerato (~6×: 200 km in 25
  minuti veri) e scrive il diario (soldi, spese, lavori, bisogni, eventi). Due partite da 200 km, nessun errore.
  Risultati e decisioni in `SOSPESI.md` (economia, rimorchio che blocca le missioni, missione da 38 km, danni).
- Per il cognato: si può rilanciare dopo ogni cambio di prezzi o paghe (`--km`, `--vel`, `--guida`).

## 20/11/2026 sera · proprietario (**tutti gli interni in alta definizione**)
- Fatto: come il bar, anche benzinaio, Sosta 24, motel, Mario, Luca, Neon Kustom, Autosalone e sfascio (`interni_hd.js`):
  doppia densità, profondità, materiali, luci, persone disegnate come il protagonista e **scritte leggibili** (carattere 5×7:
  prezzi a led, cartelli, menu, chiavi, calendario, CV del banco, prezzo in vetrina). Le scene vecchie restano (`_vecchio`).
- Per il cognato: da Luca c'è solo Luca; Nico lo aggiungi tu quando decidi come è fatto (`HD.shop` in `interni_hd.js`).

## 20/11/2026 sera · proprietario (**interni più belli: prototipo del bar**)
- Fatto: il bar rifatto in alta definizione (`interni_hd.js`): doppia densità come la strada, profondità su tre piani,
  materiali e luci vere, barista disegnata come il protagonista che lavora tra caffè e brioche. `interni.js` ora sa
  disegnare una scena a doppia densità (solo se la scena lo chiede: gli altri interni sono identici). Il bar vecchio
  resta in `SCENE.bar_vecchio`.
- Aperto: se lo stile piace, gli altri otto interni uno alla volta (quello di Luca col cognato, per Nico).

## 20/11/2026 sera · proprietario (**Impostazioni nel menu e meteo nuovo**)
- Fatto: nel menu una scheda **Impostazioni** con quattro sottoschede (Grafica, Audio, Comandi, Guida): ci sono finite le
  regolazioni che stavano sparse in Vista, Guida ed Extra (stessi controlli, spostati). Le schede Vista ed Extra non ci
  sono più: colore, mappa, foto, replay e «Come si gioca» stanno in Partita. File: `menu.js`.
- Fatto: **nebbia, neve e vento** (`meteo2d.js`), dal menu Meteo o col tasto K; in «dinamico» secondo il paesaggio. La
  neve fa scivolare più della pioggia, il vento fa sbandare l'auto sulle raffiche. Niente di `pistone/` toccato.
- Da provare sul PC: quanto si vede nella nebbia di notte, il fruscio del vento.

## 20/11/2026 · cognato (**negozio unico: Nico lavora da Luca, pezzi singoli sulla V40**)
- Deciso col proprietario: il negozio dei pezzi motore è uno solo, Da Luca Tuning. Nico ci lavora: compri un pezzo alla
  volta (a livelli), va in magazzino (un pezzo, un posto) e lo monti sul **motore originale della V40** (tutto tranne il
  blocco) o sul **banco di lavoro**, dove il motore nuovo ti aspetta finché non ha tutti i 14 pezzi. Il Pistone non è più
  una tappa: il secondo bar è tornato. Sulla V40 Luca non vende più turbo, intercooler, centralina, frizione e
  preparazioni (chi li aveva li riavrà in soldi). Prezzi dei livelli rifatti sull'economia (€ 300/900/2.400). Test: 211.
- Aperto: estendere alle altre auto quando la V40 è a posto; Nico non ha ancora un disegno da Luca (stasera la sua storia);
  vendendo la V40 i pezzi montati sopra se ne vanno con lei (da decidere se tornano in magazzino).

## 20/11/2026 · cognato (**il Pistone diventa un progetto in prova, separato**)
- Il proprietario ha passato al cognato la gestione dei motori. I motori costruiti da Nico sono un **progetto in prova**:
  cartella `pistone/` (prima `motori/`), separata dal tuning di Luca che resta la modifica dei motori di sempre.
  Interruttore nella scheda Sviluppatori (spento: niente tappa e niente swap, i motori restano salvati); ogni aggancio
  fuori dalla cartella è segnato `[PISTONE]`; in `pistone/LEGGIMI.md` le due sezioni e come togliere il Pistone del tutto.
- Anche: Mario sulla mappa è la O (Officina) e ha la M sulla tuta; «Sblocca tutto» non tocca più i livelli di Nico.

## 20/11/2026 · cognato (**riordino dei motori**)
- Controllato il lavoro di tutti e due sui motori: nessun ramo con lavoro non unito, niente file doppi. Tutto in
  `motori/` con la guida `motori/LEGGIMI.md` (sezione «Da non confondere»: tuning di Luca, banco prova contro banco di
  montaggio, revisioni di Mario contro motore rifatto al Pistone, `test/motori.test.js` che è il vecchio Banco Suono).
- Da Luca, con un motore del Pistone montato, ora c'è scritto che turbo, intercooler, centralina, camme e frizione sono
  quelli del motore di Nico (prima i pezzi di Luca sembravano montati ma non contavano). Vetrina del Pistone: RICOSTRUZIONI
  al posto di REVISIONI (le revisioni sono di Mario).

## 20/11/2026 · cognato (**motori a livelli, Nico e Mario**)
- Fatto: al Pistone **Nico** (era Ottone) insegna i pezzi a livelli 1-4, reparto per reparto, con requisiti (soldi, km,
  motori costruiti, livelli di altri reparti). Reparti nuovi: pompa dell'olio, intercooler, pompa della benzina,
  radiatore, frizione (14 in tutto). I pezzi devono andare d'accordo: intercooler piccolo col turbo grande = aria calda e
  battito; radiatore piccolo = l'acqua sale in strada, protezione della centralina, guarnizione che salta se insisti;
  frizione piccola slitta; pompa dell'olio o della benzina piccole si sentono. Bilancio di calore vero in `sim.js`, solo
  per i motori costruiti. L'officina dei tagliandi ora è di **Mario** (id interno sempre `niko`). Test: 208.
- Aperto: prezzi e requisiti dei livelli da provare giocando; sopra i ~480 CV nessun radiatore regge il gas pieno a lungo
  (si va in protezione, voluto); Nico ha ancora l'aspetto di Ottone (vecchio coi baffi bianchi).
- Per il proprietario: Niko → Mario e Ottone → Nico in tutti i testi, guarda se ti va bene.

## 20/11/2026 · proprietario → **AVVISO PER IL COGNATO**
- **Leggi `AVVISI.md`**: il gioco ora si installa come app sul PC da Edge o Chrome e si aggiorna da sola a ogni caricamento
  su `main`. Da adesso gli avvisi importanti stanno lì e l'hook di inizio sessione li mostra per primi.

## 20/11/2026 sera · proprietario (**costruzione del motore**, al posto del 3D)
- Fatto: locale nuovo **Il Pistone** (al posto del secondo bar di ogni giro, primo al km 14,6). Progetti un motore pezzo
  per pezzo (blocco 4/5/6 cilindri, albero, bielle, pistoni, testata, camme, turbo o volumetrico, iniettori, centralina)
  con CV, coppia, giri, peso, affidabilità e curva che cambiano; lo monti a mano sul cavalletto (si parte dal basso,
  Ottone ti corregge), lo accendi, e poi lo metti su **qualsiasi auto** (swap: cambiano guida, suono e peso). Motori
  troppo spinti si rompono tirandoli al limitatore. File `motori.js`, `motori2d.js`; test (200 in tutto).
- Anche: `strumenti/prova.js` (passo `entra`) aspetta la fine della camminata nei locali.
- Da provare sul PC: il suono dei motori swappati in strada e quanto costano i pezzi rispetto ai guadagni.

## 20/11/2026 sera · proprietario (**via il 3D**)
- Deciso dal proprietario: il 3D si toglie (servirebbero tutti i modelli delle auto). Cancellati `car3d.js`,
  `street3d.js`, `viaggio3d.js`, `models/supra_mk4.glb`; da `index.html` vista 3D/Abitacolo, Montagna, Vetrina,
  telecamera, modelli .glb, three.js; da `game.js` la guida in montagna; tasti C e G; crediti e licenze del modello.
  Tolto il test della Montagna (194). `sw.js` non toccato (la riga di three.js lì non fa più niente).
- Al posto del 3D: costruzione del motore in un locale nuovo (in corso).

## 20/11/2026 · proprietario (entrata nei locali)
- Fatto: entrando in un locale niente più teletrasporto. Ogni locale ha un **posto auto** accanto alla porta (strisce e P sul
  marciapiede; al benzinaio la pompa): l'auto ci entra con le ruote che girano (in retro se la porta l'hai passata), il
  protagonista **scende, va a piedi alla porta ed entra**, buio, interno. Uscendo esce dalla porta, risale e riparte. U
  durante la camminata la salta. Accostando, il cambio di corsia verso destra ora è deciso anche piano (prima si
  attraversavano le corsie a passo d'uomo e da dietro ti tamponavano: forse il problema di ieri del cognato).
- File nuovo `entrata2d.js`; in `game.js` posti e porte (`GAME_POSTI`) e tempi (`GAME_ENT`); un aggancio in `street2d.js`,
  una riga in `index.html` (U salta). Righe del cognato non toccate. Test `test/entrata.test.js` (195 in tutto).
- Aperto: nel 3D l'auto si ferma e basta (manovra e omino solo nel 2D).

## 20/11/2026 mattina · proprietario (app installabile)
- Fatto: il gioco si installa come app da Edge o Chrome (`manifest.json`, icone in `img/app/`): icona sul desktop, finestra
  sua, sempre aggiornato. Come si fa: `PASSAGGIO.md`, «Il gioco come app sul PC». Provato: Chromium la dà installabile.
- Deciso: l'exe per Steam più avanti (piano di `docs/pubblicazione/PERCORSO.md`). Weekend: proprietario sul 3D, cognato sul 2D.

## 20/11/2026 · proprietario (3D: locali, paesaggi, luci)
- Fatto: `viaggio3d.js` (file nuovo, `street3d.js` non toccato): nel 3D ci sono i locali del Viaggio con le stesse facciate
  del 2D (si entra anche dal 3D), i paesaggi (pianura, borgo, deserto, mare, montagna, autostrada) al posto della città
  sempre uguale, luci più belle (niente macchie bianche, coni sotto i lampioni). Provato con three.js preso da npm (il CDN
  qui è chiuso): notte, giorno, abitacolo, dentro un locale.
- Aperto: nel 3D l'auto è sempre la Supra (servono modelli .glb); paesaggi ancora semplici, da arricchire.
- Serve dal cognato: provarlo sul PC (vista 3D dal menu Vista) e dire cosa manca.

## 20/11/2026 · proprietario (controllo grande e scritte leggibili)
- Fatto: controllo della sera su 30 commit (polizia, banco, Jeshka, migliorie, caricamento): tutto provato nel browser, 191 test.
- Fatto: `leggibile.js`, file nuovo e separato: al telefono la finestra della polizia era coperta da STRUMENTI/DATI e gli
  avvisi finivano sotto la finestra e sulla striscia gialla. Ora la domanda sta sopra e gli avvisi che la coprirebbero
  aspettano. Nessun file del cognato toccato; sul PC non cambia niente se non c'è sovrapposizione.
- Prossimo: lavorare insieme sul 3D.

## 19/11/2026 · proprietario (autosalone e sfascio)
- Fatto: facciate rifatte anche per Autosalone Notte (`concessionario.js`: fascia scura con la scritta, portale col marchio,
  faretti sulle auto, ufficio vendite, porta scorrevole, bandiere e totem più bassi) e Sfascio Ruggine (`sfascio.js`: gru a
  traliccio col magnete, pile di carcasse fatte coi disegni veri ingialliti, lamiera col filo spinato, copricerchi,
  cancello a rete che scorre, ufficio nel container, ATTENTI AL CANE). Nuovo `lcWreck` in `locali2d.js`.
- PASSAGGIO: ora ci sono tutti e due gli artifact (proprietario e cognato), ognuno aggiorna il suo.

## 20/11/2026 notte · cognato (Jeshka e Luca)
- Fatto: storia secondaria «Ti tengo compagnia» (`jeshka.js`) dalla proposta di Codex, riscritta: sei scene nei
  negozi Neon e tuning, il cavo, Jeshka in macchina col messaggio falso, i cinque lampi, incontro e finale. 191 test.
- Aperto: Jeshka non è Rosa (la storia principale non cambia); entrate tramite Marco e incursione non fatte.
- Da provare: tutta la catena giocando dal km 20 in poi.

## 19/11/2026 sera · cognato (caricamento)
- Fatto: la grafica 3D (three.js dal CDN, car3d.js, street3d.js, circa 900 KB) si scarica solo se apri la vista 3D,
  la montagna o la vetrina; le registrazioni della Supra solo con la Supra; `sw.js` salva immagini, suoni e modelli
  nel browser (seconda volta più veloce, si gioca anche senza rete; il codice arriva sempre fresco).
- Banco prova: sui rulli c'è l'auto vera, col suo cambio (anche automatico) e il suo suono.
- Da provare: la vista 3D su GitHub Pages (qui non c'è rete verso il CDN per provarla).

## 19/11/2026 sera · cognato (banco prova)
- Fatto: banco prova a rulli da Da Luca Tuning (`banco.js`): auto sui rulli, acceleratore graduato, freno, marce,
  curva di CV e coppia con quella di prima in grigio per confrontare prima e dopo i pezzi. 187 test.
- Aperto: il banco non ha suono (il motore audio segue solo l'auto vera); se serve si collega dopo.

## 19/11/2026 sera · cognato (migliorie)
- Fatto: scuse assurde che a volte passano (anche il bagno); un evento ogni 8-10 km (incidente, controllo, foratura,
  uno che ha fretta); credito in rosso fino a 500 € per benzina, cibo e motel; nascondiglio con rischio (1 su 3 ti
  aspettano fuori); sirena e radio che seguono la distanza, volanti nel radar; statistiche nella scheda Partita;
  aquaplaning e frenate più corte per tutti sul bagnato; spie sul quadro; pensieri sullo stato dell'auto.
- Aperto: gli epiloghi A, C, D non li ho toccati (sono trama); il punto 4 (obiettivo vicino) da spiegare meglio.
- Da provare sul PC: grandezza delle spie sul quadro, volume della sirena.

## 20/11/2026 notte · proprietario (joystick, volante e pedali)
- Fatto: `joystick.js`. Il gioco leggeva solo il PRIMO dispositivo collegato e presumeva la mappa «standard»: con cambio a H, scheda pedali e pad insieme prendeva il
  cambio (niente assi) e il resto sembrava morto. Ora i comandi si assegnano premendo/muovendo il controllo giusto (Impostazioni → Comandi → Joystick e volante),
  ognuno su un dispositivo diverso, pedali calibrati, cambio a H (una marcia per pulsante, folle a nessuno premuto). Di serie vale solo il pad standard.
  `strumenti/prova_joystick.html` mostra cosa vede il browser. 7 test nuovi, 241 in tutto; provato nel browser con tre dispositivi finti (Hsifter, Maple, pad Xbox).
- Aperto: provarlo con i dispositivi veri (pedali Maple: quale asse è quale; cambio a H nel manuale con la frizione); nell'automatico solo la R del cambio a H serve.

## 19/11/2026 notte · proprietario (storia: blocco Elena di Codex)
- Fatto: integrato il pacchetto di Codex per Elena (`materiale5_01_*`, 8 file; rapporto in `docs/storia/RAPPORTO_CODEX_5_01_ELENA.md`). Dieci scene
  nuove (80 nodi, 124 risposte, ognuna con uno scontro: Pasta, Turno, Coinquilino, Cena, Bollette, Richiamo, Distanza, Riparazione, Nonno, Cena di ritorno)
  al posto di 96 vecchi nodi; prima sera e litigio restano come erano. Elena si apre alle soglie 25/50/75/100. `chat_dati.js`: 908 nodi, identico alla
  prova di Codex. L'importatore ora applica `rimuovi_nodi` e `sostituisci_unlock` (nuova attivazione: `materiale5_01_ingressi.json`). 183 test, cinque
  adattati a mano (Elena non parte più dai chilometri; ritirate le `V2_ELE_n*` e `s*`).
- Aperto: provarla giocando (scene e battute), approvare i dettagli [P1-P4] del rapporto (sedia, trapano, conto, piatto); i vecchi salvataggi con una chat
  aperta su un nodo ritirato non sono migrati (partita nuova). Blocchi B (Rosa e Livia), C (tre soste), D (presenza), E (contesti) ancora da fare a Codex.

## 19/11/2026 sera · cognato (inseguimenti)
- Fatto: da ricercato le volanti si sommano (quelle che bruci e i rinforzi da dietro) e ti fermano solo tagliandoti la
  strada: ti superano, ti si piazzano davanti, inchiodano fino a 50; sotto i 60 con una davanti ti prendono (multone,
  +400 € per ogni volante in più). Con tre fanno muro su tutte le corsie. `polizia.js`, 178 test.
- Da provare sul PC: quanto è facile scansarle con un'auto forte; i numeri sono in `POL.fuga` (sorpasso, taglio,
  frena, vTaglio, presa, reazione, rinforzi, max).

## 19/11/2026 pomeriggio · cognato (usato e polizia)
- Fatto: l'auto dell'usato col cartello VENDESI (e le facciate) ora sta dietro le auto in prima corsia (`street2d.js`,
  ordine a pari profondità). Inseguimenti: dopo «Scappa» sei ricercato; nessuna volante ti fa più accostare, quella che
  bruci ti insegue; si semina solo entrando in un locale o negozio, e lì il ricercato torna a zero (`polizia.js`).
- Aperto: l'inseguimento non ti prende più mai, quindi la multa da fuga oggi non arriva; dirlo se la si vuole indietro.
- Serve dal proprietario: provarlo sul PC (inseguimento con sirena, posto di blocco bruciato).

## 19/11/2026 sera · proprietario (storia: le proposte sono nel gioco)
- Fatto: le tre scene di prova di `docs/storia/REVISIONE_DIALOGHI.md` sono nelle chat. Elena, la prima sera (`ELE_ritiro_*`: temperino, trapano,
  bugia «domani la vendo», rinfaccio) e il litigio (`ELE_litigio_*`: ventisei ore di silenzio, niente scuse di manuale, riparazione più avanti col flag
  `elena_litigio`). Rosa e Livia in vivavoce (`ROS_vivavoce_*`, dopo il passato di Rosa). Dario (nuovo, [P]): il vero rinfaccia il trasloco saltato,
  la presenza lo imita più avanti (`ev_imitazione_dario`, Lisbona) e gli dà ragione subito: è il segno. Tutto da `materiale_chat/materiale4_01_*.txt`
  con l'importatore (`chat_dati.js` rigenerato, 1004 nodi); 180 test, uno nuovo per ogni regola (scelte finte, litigio, Dario, vivavoce).
- Ritirate: `V2_ELE_n3_01` (la foto promessa non esiste più nella nuova scena). Il flag `e08c` ora lo dà il «non mi va di spiegarlo» del litigio.
- Aperto: riscrivere il resto di Elena (altri 30 nodi di cortesie), Rosa, Livia e la presenza con le stesse regole; le tre soste di Codex nei file
  dedicati; le scene nel mondo (furgone di Rosa, banco pacchi, motel, piazzola). Serve dal cognato: approvare i fatti [P] (Dario, trapano, trasloco).

## 19/11/2026 pomeriggio · cognato (pubblicazione)
- Fatto: `docs/pubblicazione/PERCORSO.md`, il percorso per farne un gioco da installare (Electron, niente riscritture),
  costi (zero fino a Steam: 100 dollari recuperabili) ed esempi su cosa diventa più stabile. Collegato da `LICENZE.md` (punto 9).
- Serve dal proprietario: leggerlo e decidere insieme se e quando partire.

## 19/11/2026 pomeriggio · cognato (ritocchi)
- Fatto: "Come si gioca" riscritto per il gioco di oggi (viaggio, tappe, bisogni, documenti, polizia, leva) e tasti U, 0,
  Tab, P. Fermi davanti a un locale: l'inquadratura scivola avanti e la facciata si vede (street2d.js, `camT` tra 0,3 e
  0,5), gli avvisi a destra vanno a sinistra (`body.nearplace`, solo PC). Pensieri un po' più staccati dalla freccia D.
- Aperto: col motel (facciata larga) l'inquadratura è un compromesso: più a sinistra l'auto finirebbe sotto il quadro.

## 19/11/2026 pomeriggio · cognato (polizia)
- Fatto: `polizia.js`. Pattuglie in giro a 80-100 km/h (si superano). Al fermo l'agente guarda anche i documenti
  (assicurazione scaduta = la fai lì) e si può pagare, **contestare** (tre scuse a caso, risposte dell'agente, quattro esiti)
  o **scappare** (inseguimento, a volte posto di blocco dopo). **Autovelox e Tutor** rari, a volte niente per 7-12 km, V e T
  sulla mappa in basso, verbale sul telefono qualche km dopo. **Pattuglia in coda** ogni tanto. **Alcolici al bar** e
  etilometro fuori da un bar su cinque (si vede dalla vetrina); da brilli solo la testa che ciondola e qualche battuta.
- Da sapere per il proprietario: il posto di controllo in prima corsia ora ti fa accostare (prima era solo un avviso);
  `P.busted` e `P.payFine` di `game.js` sono sostituiti da `polizia.js`.
- Aperto: frequenze e multe sono a occhio; le battute sono segnaposto come gli altri pensieri.

## 19/11/2026 · cognato
- Fatto: polizia da autostrada: non ferma più chi è in sesta, ma chi le passa accanto oltre i 136 km/h (limite 130, tolleranza
  5 %). Multa a scaglioni come il codice della strada, moltiplicata dal livello di ricercato. Provato nel browser (149 km/h: € 170).
- Fatto: `strumenti/prova.js` dà per fatto il primo lavoro (dal tutorial obbligatorio `tappa:` e `km:` non saltavano più,
  il gioco riportava al Bar Sport); `--tutorial` per provarlo. Controllo della sera fatto.
- Da sapere: col borbottio nuovo gli scoppi della V40 sono tornati forti (copione `scoppi`: da −14,8 a −10,5 dB). Da sentire
  nel gioco prima di toccare `VOLVO_POP` o `burG`. Le facciate a 9 m dall'ingresso sono mezze fuori schermo a destra.

## 18/11/2026 notte · proprietario (facciate)
- Fatto: facciate dei locali rifatte in `locali2d.js`: bar, benzinaio, autogrill, motel, Niko, Luca e Neon Kustom con
  materiali, vetrine accese con la gente dentro, neon che sfarfallano, lampade, piante e luce sul marciapiede; di giorno
  neon spenti e vetri che riflettono. Insegne abbassate dove si vedono da fermi (lo zoom taglia la parte alta).
- Aperto: Autosalone e Sfascio sono rimasti come prima; ogni facciata costa 1-2,5 ms a fotogramma (prima 0,5-1,5).
- Serve dal cognato: niente; `drawTripPlace` ha un anello in più nella catena (vedi AGENTS).

## 18/11/2026 notte · proprietario (storia: revisione dei dialoghi)
- Fatto: letto lo zip «Le tre soste» di Codex e tutta la storia scritta (`STORIA_BOZZA_02.md`, `materiale_chat/`, `chat_dati.js`). Analisi misurata dei dialoghi di oggi
  (172 scelte su 783 sono finte, solo 28 righe su 758 con vero dissenso, litigi scritti come mediazioni), regole di scrittura, tre scene di prova
  (Elena, Rosa e Livia, Dario come prima imitazione) e piano: `docs/storia/REVISIONE_DIALOGHI.md`. Nel gioco non è cambiato niente.
- Idea guida: chi ti dà sempre ragione è la presenza; le persone vere ti contraddicono.
- Aperto: approvare il tono (proprietario, poi il cognato che scrive la storia), poi riscrivere Elena, Rosa, Livia e integrare le tre soste.

## 18/11/2026 notte · proprietario (ruote e borbottio)
- Fatto: **borbottio rifatto più forte**: il primo giro era inudibile (in abitacolo +0,5 dB: a gas mollato lo scarico normale è quasi muto e i pop restavano a -25 dB).
  Ora il borbottio ha voci e livello suoi in `dsp.js` (colpo basso che scende di nota + rumore cupo, raffiche "brrrap"), in abitacolo da -19 a circa -13 dB di RMS al
  rilascio. Sempre solo misurato, non ascoltato: il livello si regola con `burG` (e `lvl`/`rate` nel blocco "borbottio" di `cycle()`).
- Fatto: **scheda Sviluppatori** nel menu (`sviluppatori.js`): soldi a piacere e "Sblocca tutto" (pezzi dell'officina ed estetica, per l'auto in uso o per tutto il garage).
- Fatto: **tasto RIAVVIA** (`riavvia.js`) nella barra in alto, con domanda Sì / No; con Sì si cancella il Viaggio e si riparte dal titolo, editor del personaggio e prologo (stesso comportamento da "Nuovo viaggio" nel menu). Provato nel browser sul PC; al tocco solo "Nuovo viaggio" nel menu (non provato).
- Fatto: **ruote**. Controllate le 25 ruote disegnate contro la sagoma (`strumenti/centro_ruote.py`): il buco nel corpo e `ax/wy` combaciano, ma in
  cinque ruote il cerchio era fuori asse rispetto alla gomma (E30 di 3 px in alto, poi E34, R5, B2002, A112) e girando il mozzo ballava.
  `Street2D.wheelConc` (`street2d.js`) le rifà concentriche (cerchio al centro, corona di gomma uniforme); tabella `WHEEL_FIX`. Vale anche per
  traffico, concessionario e interni. Provate in gioco su 9 auto. Per nuove auto: `python3 strumenti/centro_ruote.py` e guardare l'ingrandimento.
- Fatto: **borbottio al rilascio** (`dsp.js`, `addBurble` e blocco in `cycle()`): mollato il gas sopra i 1300 giri il motore gorgoglia a raffiche
  (boato basso + colpetti irregolari + qualche raffichetta e ogni tanto un colpo grosso), si spegne in 2-4 s. Di serie è moderato, cresce con
  mappa pop & bang, taglio d'accensione e decat/scarichi aperti. Copione nuovo `rilascio` in `strumenti/ascolta.mjs` (conta gli schiocchi), test in
  `test/motori.test.js`. Provato solo con i numeri (4-5 schiocchi/s di serie, nessuna saturazione), **non ascoltato**: serve il tuo orecchio, i valori
  da ritoccare sono in `addBurble` e nel blocco "borbottio" (`lvl`, `rate`, ampiezze).

## 18/11/2026 notte · proprietario (modifiche di Codex)
- Fatto: recuperato il lavoro che il cognato aveva fatto con Codex (finito per errore nella sua copia del repository):
  850 R a cinque cilindri, «Carattere del motore» Originale / Codex · deciso nel menu Guida (di serie Originale, suono
  identico a prima), capitolo del Viaggio letto solo alla conferma. Tutto in `MODIFICHE_CODEX.md`, con come annullarlo.
- Lasciato fuori: consegne saltate spostate alla sede dopo (oggi si annullano apposta) e la copia dei salvataggi.
- Serve dal cognato: ascoltare la 850 R a cinque cilindri e il profilo deciso; chiudere la bozza n. 1 nella sua copia.

## 18/11/2026 notte · proprietario
- Fatto: radio nuova (`radio_ui.js`): pannellino in alto a destra con equalizzatore a 9 barre e striscia di spettro,
  frequenza ambra, nome della stazione e della canzone, titolo che scorre, barra del brano, sintonia animata con la neve.
  Le stazioni a una canzone hanno un nome di stazione inventato (`STA`: Redline Radio, Zona Rossa FM, Metallo Vivo,
  Radio Corda). Il pulsante dello schermo intero è sceso un po' sotto il pannello.
- Aperto: l'equalizzatore è finto (non legge l'audio). Serve dall'altro: niente.

## 18/11/2026 sera · fari (PR #14, unita su main la notte)
- Fatto: il fascio ora **parte dal faro vero** di ogni auto (`GE.head` dello sprite), disegnato sopra la carrozzeria, più largo sui mezzi grandi;
  il bagliore ovale vicino al faro è molto più piccolo (halo di `fxHeadlamp`, `light` del faro in `street2d.js`).
- Fatto: **fari rifatti** (`effetti2d.js`, `street2d.js`): niente più raggio laser. L'anabbagliante è una banda larga e piena che
  scende sulla strada con il taglio netto in alto; con gli abbaglianti si aggiunge una banda più alta e più lunga. Tolta la
  striscia orizzontale dei fari (`fl` e lama in `fxHeadlamp`). Provato sul PC (foto prima/dopo), non sul telefono.

## 18/11/2026 notte · cognato
- Fatto: scoppi dello scarico rifatti a voci (fino a 6 insieme): ogni scoppio cambia un po' altezza, crepitio e durata,
  ogni tanto un doppio «pa-pam» o una sgranata di schiocchi. Carattere per auto in `voice.pop` (`cars.js`): R5 e utilitarie
  acute e secche, E34 e 6 cilindri bassi e lunghi, diesel sordi. Fiammata: colori arancio, gialla, blu e una fiammella che
  resta accesa dopo gli scoppi. `ascolta.mjs` ha il copione `scoppi` e le variabili `PRESET`/`POPS`.
- Poi, su richiesta del cognato («sembra un petardo»): le Volvo (V40 e 850 R) hanno un boato basso (`boom` in `voice.pop`,
  `VOLVO_POP` in `cars.js`): BOOM grossi, bam medi, pim corti, meno schiocco. **La V40 quindi non suona più come prima negli
  scoppi** (solo lì: il motore è uguale). Per tornare indietro basta togliere `voice: { pop: VOLVO_POP }` dal `dsp` della V40.
- **Per il Claude di Nico**: la Supra non ha `voice.pop`, quindi lo scoppio medio è come prima, ma ora varia un po'
  da uno all'altro (è voluto). Se lo vuoi fisso: `voice.pop = { vary: 0 }`.
- Aperto: sentirlo nel gioco; i valori di `voice.pop` sono a orecchio sui numeri, non su un ascolto vero.

## 18/11/2026 sera · cognato
- Fatto: teaser rifatto (44 s): partenza senza controllo di trazione, gara al semaforo sotto la pioggia col gas dosato,
  telefono che sale con il messaggio dello Sconosciuto «Ho lasciato sei auto. Tu ne hai presa una.» (musica e motore si
  abbassano, vibrazione), Supra preparata (Big single) che tira la 3ª al limitatore, mette la 4ª e se ne va. Strumenti
  `teaser*` aggiornati (auto per ripresa, gomme gonfie e guida automatica spenta nelle riprese), `camHold` in `street2d.js`.
- Aperto: il cartello finale dice ancora «NIGHT RUN»; la frase del telefono si può cambiare in `SHOTS` di `strumenti/teaser.js`.
- Serve dal proprietario: il nome nuovo nel cartello (`strumenti/teaser_cartelli.py`) e rifare il montaggio.

## 18/11/2026 · cognato
- Fatto: comandi da telefono (pedali, palette del cambio, AVVIA, STRUMENTI e DATI, schermo intero, avviso in verticale),
  traffico da autostrada (caratteri dei guidatori, chi arriva da dietro rallenta, solo il distratto tampona, gomme che
  stridono, curiosi agli incidenti, uscite alle tappe, pullman che si sorpassano), qualità leggera per le prove da
  telefono, regola 7 in `AGENTS.md` (il gioco è pensato per il PC). Chiusa la PR #7 (vecchia: avrebbe cancellato
  `night-run-sera`).
- Aperto: lo stridio delle gomme va sentito nel gioco; decidere se togliere `create-game-assets` e il plugin ECC
  (proposte della PR #7).
- Risposta sulle gare: **ci saranno**, ma come attività secondaria per farsi due soldi (come le consegne), non come
  centro del gioco; le altre dinamiche per guadagnare sono ancora da valutare.
- **Per il Claude di Nico**: alle 17:55 il caricamento del cognato e la voce della sera del proprietario hanno toccato le
  stesse righe di `DIARIO.md` (conflitto di unione). Risolto a mano tenendo tutte e due le voci, quella del cognato sopra;
  `AGENTS.md`, `PASSAGGIO.md` e `INCORSO.md` si sono uniti da soli (unione `7ab72e7`). Controlla che la tua voce sia come
  la volevi (la riga "Deciso: … da mettere nel gioco" ora è superata dal "Fatto" sopra) e che nell'unione non manchi
  niente di tuo; se serve, sistemala tu.

## 18/11/2026 sera · proprietario
- Fatto: **due stazioni rap** con le 5 canzoni nuove del proprietario (Gemini, piano Pro, 18/11): FM 88.3 Rap di Strada
  (Asphalt Throne, Liquid Gold and Concrete, Midnight In The Street: intorno ai 90 BPM) e FM 106.7 Trap di Mezzanotte
  (Carbon Fiber Heart, Asphalt and Will: 808 più pesanti, tempo trap). Divise misurando tempo e sottobassi.
- Fatto: **retro sistemata**. Premendo U dopo la retro il pilota automatico dava gas in retromarcia e portava l'auto
  indietro fino al limite, bloccata (era il "mi porta indietro" e il "non riparte"): ora frena, mette la marcia avanti ed
  entra. Al limite dei 60 m l'auto si ferma davvero; retro al massimo 18 km/h; dopo R una E porta in D (o in prima).
- Fatto: **leva P R N D** del cambio automatico (E verso D, Q verso P, P blocca le ruote, avvio solo in P/N); in **folle** il
  gas fa solo salire i giri (niente più prima inserita da sola); **gomme** più vere (`gomme2d.js`): la V40 usa la ruota del
  disegno (prima i copricerchi a codice brillavano col bagliore), ombra del passaruota, fianco con le scritte, tasselli,
  rigonfiamento secondo la pressione vera (l'auto ereditata ha le gomme sgonfie: si vede), sfocatura in velocità.
- Fatto: **personaggio in pixel art vera** (prologo ed editor): contorno, luci e ombre, viso di profilo, pose animate (fermo,
  camminata a 8 fotogrammi, saluto, telefono, mani in tasca). In auto più grande e con contorno, sopracciglio e bocca; muove
  la testa a tempo con la radio e canticchia, col sonno ha gli occhi pesanti, sbadiglia e ciondola.
- Fatto: **editor del personaggio** (`personaggio.js`) prima del prologo e dal menu (Partita → Personaggio): pelle, capelli,
  cappellino/berretto, giubbotto/felpa/pelle/camicia, colori, barba, occhiali. Lo stesso personaggio nel prologo e in auto,
  dove ora sbatte gli occhi, respira, gira la testa con le frecce e verso lo specchietto, segue lo sterzo con la mano,
  mette il gomito fuori col finestrino giù e muove le spalle al cambio marcia. `strumenti/prova.js` conferma l'editor.
- Fatto: **cambio automatico vero** (cambia marcia da solo) e scelta Automatico/Manuale al km 0 dopo il prologo (anche dal
  menu Guida); **prologo** rifatto nelle scene: il protagonista scende dalla E36 ed entra dallo studio, è di spalle davanti
  al notaio, il notaio ha le chiavi nel garage (attrezzi, scaffali, calendario), l'auto scelta ha le ruote che girano e la
  città scorre a strati coi lampioni; corretti i palazzi che si vedevano attraverso il muro dello studio. Testi non toccati.
- Fatto (dal controllo del gioco): **partenza** (gas in folle da fermo mette la prima col cambio automatico), **avvisi in fila**
  (striscia gialla e messaggi a destra, due alla volta, prima quelli importanti), **cartelloni** illuminati in pianura e
  sulla Route 66 e **aree di servizio** lontane in pianura (`paesaggi2d.js`), schermata **Crediti** (`crediti.js`).
- Aperto: i testi dei crediti ("il proprietario e suo cognato") sono segnaposto: mettete i vostri nomi in `CREDITI`.
- Fatto: la **retromarcia** nel viaggio porta davvero indietro, fino a 60 m dal punto più lontano raggiunto (`GAME_BACK_MAX`
  in `game.js`): chi si ferma poco oltre un locale (anche nel primo lavoro) torna davanti e ci entra. Test `test/retro.test.js`.
- Fatto: il titolo **Night Run: The Last Highway** è nel gioco (titolo della pagina, scritta in alto, schermata iniziale,
  cartello alla fine del prologo); artifact aggiornato all'ultimo main. Restano le scritte del teaser.
- Fatto: controllo della sera (3 commit, solo documentazione e strumenti; 142 test passano, anche su GitHub).
- Deciso: il nome (da controllare nei marchi). La musica è fatta con Gemini, piano Google AI Pro: dettagli in `LICENZE.md`.
- Unione delle 17:55 controllata dal Claude del proprietario: non manca niente. Gare: risposta del cognato ricevuta.

## 18/11/2026 · proprietario
- Fatto: video teaser a velocità di gioco (strumenti `teaser*`), controllo delle licenze (`LICENZE.md`), il cognato carica
  su `main` senza approvazione, controllo della sera, `COMANDI.md`, test automatici su GitHub, hook di inizio sessione,
  `INCORSO.md` e questo diario.
- Aperto: nome definitivo del gioco ("Night Run" + una parola); provenienza della musica (Suno? quale piano?);
  la partenza al semaforo nel teaser mostra una gara, che nel gioco adesso non c'è.
- Serve dal cognato: dire se le gare torneranno; leggere `COMANDI.md` e le regole nuove in `AGENTS.md`.
