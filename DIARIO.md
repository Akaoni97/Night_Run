## 21/11/2026 · proprietario · v0.65 (**editor della storia**)
- Fatto: pagina personale `strumenti/editor_storia.html` (fuori dal gioco): conversazioni per persona e fase, mappa a bivi con frecce, a destra testo originale e «come lo vorrei» (messaggi, varianti, risposte). Bozza salvata nel browser; «Copia modifiche» / «Scarica file» dà il JSON. Si assorbe con `node strumenti/assorbi_modifiche.mjs <file>`, che lo unisce in `chat_modifiche.js` (caricato dopo `chat_dati.js`, quindi sopravvive alla rigenerazione). Cambia solo le parole, non bivi, condizioni, effetti.
- Poi: lista **in sequenza di gioco** (scheda Sequenza: capitali, fasi, km) e striscia in alto con una corsia per persona e un pallino per ogni conversazione che parte (clic = ci va). I km sono quelli segnaposto di `CHAT_START`; le conversazioni con flag `luogo_*` o `ev_*` si posano sull'arrivo della capitale. Senza km: quelle a confidenza e quelle che partono da scelte o regia.
- Aperto: la storia secondaria di Jeshka e Luca sta in `jeshka.js` (`JL_SCENE`), non nelle chat: non è nell'editor. Non provato il tasto Copia negli appunti (nel browser di prova); Scarica file sì come logica.

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
