# Versioni di Night Run

**Versione attuale: v0.167**

## Come si conta
Ogni **intervento** (una sessione con Claude, Codex, Kimi o chiunque, oppure un pacchetto di modifiche fatte insieme) fa salire la
versione di **un passo**: v0.53 → v0.54 → v0.55… Non conta quanti commit ci sono dentro, conta l'intervento. Il numero dopo lo
zero è il numero dell'intervento (si resta su v0 anche dopo la .99: v0.99 → v0.100 → v0.101…; la v1.0 la decidono il proprietario e il cognato, quando vogliono).

Chi fa l'intervento, **prima di chiuderlo**:
1. alza la versione qui sopra e aggiunge **in fondo** all'elenco una riga: versione, data, chi, cosa (una riga sola, breve);
2. mette la versione nel titolo della voce in `DIARIO.md` (per esempio `## 20/11/2026 notte · proprietario · v0.51 (...)`);
3. la scrive nel messaggio di commit (per esempio `v0.51: Soccorso stradale...`).

Se due interventi arrivano insieme e i numeri si scontrano, chi unisce per secondo prende il numero dopo.

## Da dove siamo partiti
Il conto è nato il 20/11/2026. Le versioni prima di quel giorno non erano numerate: le ho ricostruite dalle **50** voci di `DIARIO.md`
(dal 18/11/2026; il primo commit del repository è del 02/11/2026). Quelle da v0.01 a v0.50 sono quindi **approssimate**: l'ordine è
quello delle date del diario (dentro lo stesso giorno, per momento: mattina, pomeriggio, sera, notte) e qualche intervento vecchio
non ha lasciato una voce. Dalla v0.51 il conto è esatto.

## Elenco
| Versione | Giorno | Chi | Cosa |
| --- | --- | --- | --- |
| v0.01 | 18/11 | proprietario | Teaser a velocità di gioco, licenze, test su GitHub, hook di sessione |
| v0.02 | 18/11 | cognato | Comandi da telefono e traffico da autostrada |
| v0.03 | 18/11 | proprietario | Due stazioni rap con le canzoni del proprietario |
| v0.04 | 18/11 | cognato | Video teaser rifatto (44 s) |
| v0.05 | 18/11 | PR #14 | Fari: il fascio parte dal faro vero (PR #14) |
| v0.06 | 18/11 | cognato | Scoppi dello scarico a voci, carattere per ogni auto |
| v0.07 | 18/11 | proprietario | Radio nuova con equalizzatore e titolo che scorre |
| v0.08 | 18/11 | proprietario | Modifiche di Codex: Volvo 850 R a cinque cilindri, carattere «deciso» |
| v0.09 | 18/11 | proprietario | Ruote concentriche e borbottio del motore più forte |
| v0.10 | 18/11 | proprietario | Storia: revisione dei dialoghi dopo «Le tre soste» |
| v0.11 | 18/11 | proprietario | Facciate dei locali rifatte |
| v0.12 | 19/11 | cognato | Polizia: pattuglie, contesta e scappa, autovelox, etilometro |
| v0.13 | 19/11 | cognato | «Come si gioca» riscritto e inquadratura sui locali |
| v0.14 | 19/11 | cognato | Percorso per pubblicare il gioco (Electron) |
| v0.15 | 19/11 | cognato | Usato dietro il traffico e inseguimenti da ricercato |
| v0.16 | 19/11 | cognato | Polizia da autostrada: limite 130 e multe a scaglioni |
| v0.17 | 19/11 | proprietario | Facciate rifatte di Autosalone e Sfascio |
| v0.18 | 19/11 | proprietario | Storia: le scene di prova nelle chat |
| v0.19 | 19/11 | cognato | Inseguimenti: le volanti ti fermano tagliandoti la strada |
| v0.20 | 19/11 | cognato | Scuse assurde, evento ogni 8-10 km, credito in rosso, nascondiglio |
| v0.21 | 19/11 | cognato | Banco prova a rulli da Luca |
| v0.22 | 19/11 | cognato | Caricamento più leggero: 3D e registrazioni solo quando servono |
| v0.23 | 19/11 | proprietario | Storia: blocco Elena di Codex (dieci scene) |
| v0.24 | 20/11 | proprietario | Il gioco si installa come app da Edge o Chrome |
| v0.25 | 20/11 | proprietario | Controllo grande e scritte che non si sovrappongono |
| v0.26 | 20/11 | proprietario | 3D del Viaggio: locali, paesaggi, luci (poi tolto) |
| v0.27 | 20/11 | proprietario | Entrata nei locali: posto auto e protagonista che va a piedi |
| v0.28 | 20/11 | proprietario | Avviso al cognato: AVVISI.md mostrato per primo a ogni sessione |
| v0.29 | 20/11 | cognato | Motori a livelli: Nico insegna i pezzi, Mario fa l'officina |
| v0.30 | 20/11 | cognato | Riordino dei motori, niente doppioni |
| v0.31 | 20/11 | cognato | Il Pistone diventa un progetto in prova (cartella pistone/) |
| v0.32 | 20/11 | cognato | Nico lavora da Luca: pezzi motore singoli sulla V40 |
| v0.33 | 20/11 | proprietario | Tolto il 3D: il gioco è solo 2D |
| v0.34 | 20/11 | proprietario | Costruzione del motore pezzo per pezzo (Il Pistone) |
| v0.35 | 20/11 | proprietario | Menu Impostazioni e meteo nuovo: nebbia, neve, vento |
| v0.36 | 20/11 | proprietario | Interno del bar in alta definizione (prototipo) |
| v0.37 | 20/11 | proprietario | Tutti gli interni in alta definizione con scritte leggibili |
| v0.38 | 20/11 | proprietario | Giocatore automatico per provare ritmo ed economia (200 km) |
| v0.39 | 20/11 | proprietario | La cassa pesante non blocca più le missioni |
| v0.40 | 20/11 | proprietario | Joystick, volante e pedali assegnabili |
| v0.41 | 20/11 | cognato | Storia secondaria «Ti tengo compagnia» (Jeshka e Luca) |
| v0.42 | 20/11 | proprietario | AUTO 1 dopo 5 s, leva con S sport, tasti 1-4, pannello di Nico a schede |
| v0.43 | 20/11 | proprietario | Mappa del turbo vera, scarico aperto/chiuso, negozio dei pezzi a categorie |
| v0.44 | 20/11 | proprietario | Fiamme secondo il tuning: botto, fiamma libera, ossidrica |
| v0.45 | 20/11 | proprietario | Fiamme al rilascio più frequenti, bella fiammata sopra i 5.000 giri |
| v0.46 | 20/11 | proprietario | Grafica più nitida e ruote della trazione anteriore |
| v0.47 | 20/11 | proprietario | Estetica premium: icone disegnate, vetro scuro, banner dei quartieri |
| v0.48 | 20/11 | proprietario | Posti di controllo che multano al passaggio, autovelox, Tutor e mappa |
| v0.49 | 20/11 | proprietario | Meno scatti: tele preparate una volta, niente letture dalla scheda video |
| v0.50 | 20/11 | proprietario | Palazzi preparati prima di entrare nello schermo: meno scatti |
| v0.51 | 20/11 | proprietario | Soccorso stradale: app nel telefono, furgone con le quattro frecce, meccanico che ripara sul posto |
| v0.52 | 20/11 | proprietario | Conteggio delle versioni (regola in `AGENTS.md`) |
| v0.53 | 20/11 | proprietario | Questo elenco delle versioni (`VERSIONI.md`, al posto di `VERSIONE.md`) |
| v0.54 | 20/11 | proprietario | Officina semplice (Modifiche e Swap, anteprima), Tutor ogni 10-15 km, prova di fumo su GitHub, pausa, suggerimenti, prossimo traguardo, qualità ricordata e FPS |
| v0.55 | 20/11 | proprietario | Assicurazione con franchigia e sinistri, traino e domande sui guasti, diario di viaggio |
| v0.56 | 20/11 | proprietario | Sviluppatori: «Disabilita polizia» (non ferma, non multa, non insegue; autovelox e Tutor spenti) |
| v0.57 | 20/11 | proprietario | Sviluppatori: vai a km o tappa, riempi bisogni, ripara, indistruttibile, meteo e ora, flag della storia, tutte le app |
| v0.58 | 20/11 | proprietario | Due bisogni nuovi: pipì (12 ore di viaggio) e cacca (24), bagno gratis nei locali |
| v0.59 | 20/11 | proprietario | Pipì e cacca: frasi serie e comiche (pensieri, avvisi, incidente) |
| v0.60 | 20/11 | proprietario | La piazzetta: ogni 2-3 tappe due negozi affiancati (mai Luca e Neon Kustom insieme) |
| v0.61 | 21/11 | proprietario | Assetto a livelli: altezza e rigidità regolabili da Luca (cursori nella nuova officina), fisica e disegno che seguono |
| v0.62 | 21/11 | proprietario | Night Run per Windows (Electron, da Codex): gioco senza rete, caratteri locali, salvataggi su file con backup |
| v0.63 | 21/11 | proprietario | Officina di Luca: V40 con turbo da 0,5/1,0/1,5 bar, downpipe, terminale, camme, cambio, gomme da drag (oltre 450 CV); pallino verde (monta) e rosso (compra) |
| v0.64 | 21/11 | proprietario | Luca Garage: app del telefono che ti porta da Luca Tuning per € 150, sbloccabile da Sviluppatori |
| v0.65 | 21/11 | cognato | Sospesi numerati (regola), economia, valigetta e danni in pausa fino alla fine |
| v0.66 | 21/11 | cognato | Schede tecniche e pezzi con personalità per ogni auto (`schede.js`), tricilindrici veri (Polo, Clio, 308), tolto il carattere audio «Codex · deciso» |
| v0.67 | 21/11 | cognato | Sezione «Chi è chi» in AGENTS.md (Nico e Luca sono sviluppatori e personaggi), attribuzioni corrette nei documenti |
| v0.68 | 21/11 | cognato | Aggiornamenti del programma Windows: pulsante nel menu (Cerca, Scarica, Installa e riavvia), release automatiche su GitHub a ogni caricamento su main |
| v0.69 | 21/11 | cognato | L'installatore Windows si chiama «installatore Luca» (file `Night-Run-Luca-<versione>-...`, release «Night Run Luca»), per distinguerlo da quello di Nico |
| v0.70 | 21/11 | proprietario | Editor della storia (`strumenti/editor_storia.html`): mappa a bivi delle chat, testo originale e nuovo affiancati, file di modifiche che Claude assorbe in `chat_modifiche.js` |
| v0.71 | 21/11 | cognato | Più sprint in accelerazione: le auto potenti non perdono più la spinta quando sgommano (gomma, trasferimento di carico, controllo di trazione, cambiate); 0-100 del Supra 6,1 → 5,8 s, E36 6,6 → 6,1 s |
| v0.72 | 21/11 | proprietario | Controllo della sera del 21/11 (sospesi senza doppioni, decisioni di Nico) e pedoni in alta definizione leggeri (`quartieri2d.js`: chi cammina è disegnato come il protagonista, pose in memoria) |
| v0.73 | 21/11 | cognato | Frizione: il kit frizione e volano non slitta più (terzo livello «da corsa» su ogni auto, bidisco della Supra con la sua capacità); quella di serie slitta solo su un motore molto potente |
| v0.74 | 21/11 | cognato | Vecchio Pistone di Nico cancellato (peso del motore e rimborso in `officina.js`), Prestazioni nelle impostazioni (`prestazioni.js`: scelte pronte, gradini automatici, tetto ai fotogrammi), le auto elaborate valgono metà di pezzi e swap |
| v0.75 | 21/11 | cognato | Nomi nuovi: Officina Nico al posto di Mario (anche il carro attrezzi del soccorso è di Nico), Russian Kùstòm, Motel 4Ever con Tito, Nabir, Rossana, Phill Grill, Rocco Lostallone, Massimo Lo Sfascio |
| v0.76 | 21/11 | cognato | Aspetto dei personaggi: Nico giovane e tatuato, Tito vecchio e pazzo, Rocco fisicato, Massimo barbone (tratti speciali `L.x` in `personaggio.js`) |
| v0.77 | 21/11 | cognato | Pulizia del codice morto (scene vecchie degli interni, consegne della città, reputazione, sfide, pedali nascosti, resti del Pistone), Test 1, insegne e oggetti del marciapiede in alta definizione leggera (`insegne2d.js`) |
| v0.78 | 21/11 | cognato | Campioni audio dei pezzi del motore: scheda Suoni in officina, 42 kit in 10 componenti (valvola, turbo, scarico, centralina, limitatore, cambio...), fatti a codice |
| v0.79 | 21/11 | cognato | Suoni diversi per ogni auto: famiglie di motore (`suoni.js`) dalla scheda vera, scarichi sportivi e inerzia di famiglia |
| v0.80 | 21/11 | cognato | Scarichi a cinque livelli per ogni auto (terminale, catback, senza centrale, da gara) e collettore/cat da 200 celle che alza il tono e rende il suono più cattivo (`cat.len/tone/bark/edge/rasp/jet`) |
| v0.81 | 21/11 | cognato | Chicche dell'officina (idee di Codex): scheda del pezzo al tocco con un solo pulsante, carattere dei pezzi dai dati, giri a 130 km/h, decimali sui piccoli guadagni, il FORTE non supera la centralina |
| v0.82 | 22/11 | cognato | Auto nuove dai disegni ad alta definizione (25 auto, ruote disegnate a parte, versioni tuning col kit di Russian Kùstòm) e 12 mezzi pesanti nel traffico; il traino di Nico col carro attrezzi vero |
| v0.83 | 22/11 | proprietario | Campioni dei pezzi meno robotici (chiesto dal cognato): botti col tubo che risuona invece dei seni, fischi di turbo, compressore e cambio come aria che ondeggia, «tu-tu» della valvola a sbuffi, un po' di spazio intorno; volumi percepiti uguali a prima (`LIVELLO`), `CMP_VER` 2 |
| v0.84 | 22/11 | proprietario | Correzione dei campioni della v0.83 (a Nico sembravano stridii): fischi di turbo, compressori e cambio rimessi come prima, botti di nuovo pieni di bassi (tubo più cupo, tonfo più forte), niente soffio acuto in più nello stu-tu-tu; volumi di nuovo uguali a prima, `CMP_VER` 3 |
| v0.85 | 22/11 | cognato | Cinque auto «iniziali» dai disegni del proprietario: Fiat Panda 1000 Fire, Citroën AX 1.1, Renault Twingo 1.2 (da km 0), Dacia Sandero 1.2 16V e Toyota Aygo 1.0 (da km 10), con scheda tecnica, pezzi e prezzo |
| v0.86 | 22/11 | proprietario | Fisica e trazione vere delle auto da disegno (la V40 resta com'è): passo, baricentro, peso sull'asse motore, aderenza delle gomme di serie e peso delle ruote di ogni auto (`GEN_TELAIO` in `cars.js`), attriti di trasmissione in scala per le piccole (`P.lossK` in `sim.js`, di serie 1), finale vero della M3 E30 (3,25: 237 km/h); test `test/telaio.test.js` |
| v0.87 | 22/11 | proprietario | Rapporti veri del cambio e del finale per dieci auto (Golf GTI, 205 GTI, Clio Williams, 850 R, Aygo, AX, Grande Punto, Sandero, Clio, Corsa: `GEN_CAMBI` in `cars.js`, con le fonti); le altre tengono i cambi comuni finché non si trovano dati sicuri |
| v0.88 | 22/11 | proprietario | Rapporti veri del cambio per tutte le auto da disegno (ricerca di Codex in `docs/fisica/RAPPORTO_CODEX_CAMBI.md`): Panda, Panda 141, Polo, Twingo, 206, 308, A3, Audi 80, A112, Doblò, 850 R (M56H della T-5R); corretti i finali di AX, Clio, Corsa, Sandero e Punto; raggio delle ruote dalla misura vera delle gomme di serie (`genRaggio`) |
| v0.89 | 22/11 | cognato | La notte: di notte meno volanti e più cose strane, radio che disturba ripetendo avvisi già sentiti, scena «Quella dietro» al benzinaio, interfaccia Essenziale/Meccanico, buio giocabile nelle incursioni, prova dei finali |
| v0.90 | 22/11 | proprietario | Meteo deciso da Nico: il vento entra nella fisica (`sim.windV` contro/a favore, `sim.windX` di traverso, di serie 0), neve e nebbia anche in città, tempo dinamico secondo paesaggio e ora (`meteoPesi`), di notte nebbia solo ogni tanto e nei momenti horror (incursioni, cose strane), fruscio del vento più basso e morbido; test `test/meteo.test.js` |
| v0.91 | 22/11 | cognato | Luca Tuning rifatto da meccanico (auto da disegno e V40): aspirazione a scelta (pannello, cono, fungo, airbox con presa fredda, corpi farfallati coi cornetti che ululano), cilindrata con la maggiorazione +300 cc come ultimo passo, cinque turbo nuovi (piccolo che tira dal basso, grosso che tira in alto, biturbo sequenziale, geometria variabile, drag a 2 bar), reparto Benzina e iniettori (quanta pressione regge il motore), cambio sport con un rapporto regolabile per tutte le marce e da corsa regolabile marcia per marcia (cursori in officina, cambiate più rapide), slick da drag anche su Supra e V40, voci dei campioni per i pezzi nuovi; test `test/lucatuning.test.js` |
| v0.92 | 22/11 | proprietario | Gratta e vinci (tre biglietti da 2, 5 e 10 €: si vince circa una volta su quattro, tornano 70-80 cent per euro) e sigarette (meno sonno) all'autogrill (`tabacchi.js`); occhi che si chiudono col sonno al posto della vignetta, fischio nelle orecchie, udito ovattato e schermo buio dopo un incidente forte (`sensi.js`) |
| v0.93 | 22/11 | cognato | Scritte da fumetto anime più varie (oltre 60 voci, forme diverse, scintille) e interruttore «Grafiche anime» in Impostazioni → Grafica |
| v0.94 | 22/11 | cognato | Lo swap motore porta con sé la frizione del donatore (prima restava quella dell'auto e slittava sempre), avviso in officina e in guida se la frizione non regge la coppia |
| v0.95 | 22/11 | cognato | Fisica dello scatto: controllo di trazione progressivo, bagnato meno punitivo (−20 %, aquaplaning −7 %), dopo il picco la gomma tiene di più: l'E36 da 600 CV spinge anche quando sgomma |
| v0.96 | 22/11 | proprietario | Illustrazioni dei componenti dallo zip del proprietario (`img/componenti/`, `componenti.js`): nella scheda del pezzo e accanto a ogni reparto dell'officina di Luca (la Supra coi disegni esatti, le altre auto col pezzo dello stesso reparto a livello simile) e nelle valigette, dove il pezzo vinto esce nella cornice della sua rarità |
| v0.97 | 22/11 | proprietario | Le illustrazioni dei componenti sono una libreria comune a tutte le auto (la Supra non fa da modello): stesse regole per ognuna (nome del pezzo, poi livello nel suo catalogo), biturbo col disegno dei due turbo, scarico dritto solo a quelli da gara |
| v0.98 | 22/11 | proprietario | Prologo rifatto alla qualità del gioco: stessa risoluzione (densità doppia, disegni HD delle auto, presentazione come il gioco), via dei Cantieri sotto la pioggia con le facciate, i lampioni e le luci del gioco, la E36 che parcheggia e lui che scende davvero, studio del notaio ridisegnato, garage con le auto una alla volta sotto la lampada; corretti la lettera (intestazione, firma, righe spezzate), il camion che era un rettangolo nero, la scelta dell'auto che poteva saltare il finale, il prologo che partiva due volte |
| v0.99 | 22/11 | cognato | Officina di Luca più chiara: pallino verde solo sul montato, grigio su quello tuo smontato, rosso su quello da comprare o bloccato (anche nei Suoni); nei Suoni un kit non tuo prima si ascolta e poi si compra («Compra e monta»); intercooler da competizione aria-acqua (auto da disegno, V40, Supra); turbo coi nomi da catalogo (GT2560R Quick Spool, PT6266 Top End, Twin RHF5 Sequential, VNT Rally Spec, GTX4294R Drag Monster, kit GT2871R e compressore TVS R900); la schermata non saltella più passando sopra i pezzi |
| v0.100 | 22/11 | proprietario | Le anomalie di Luca nella storia (otto, su tre livelli, in `VG_ODD`: specchietto, cartello «USCITA 18 KM» che non cambia, radio che dice il km, la tua gemella ferma in corsia d'emergenza, il barista che ti riconosce, il cippo di un km che non esiste, il thermos nella cassa del motel, sei auto uguali); fruscio della radio che si vede; la prova di fumo entra davvero nello sfascio; test dei campioni che non fallisce più per caso |
| v0.101 | 22/11 | proprietario | Tre salvataggi: tre partite del Viaggio separate sullo stesso computer (ognuna con auto, soldi, pezzi montati, personaggio e foto del diario), si scelgono sulla schermata iniziale e nel menu (Partita → Salvataggi); la partita di prima è la Partita 1 |
| v0.102 | 22/11 | proprietario | Schermata iniziale rifatta: sfondo animato in stile Night Run alla risoluzione del gioco (autostrada di notte, città con la luna, lampioni, portale, traffico e camion, la tua auto in primo piano coi fari e qualche botto), logo nuovo, pannello con «Continua il viaggio» per le partite già cominciate; tornato il link Crediti; i traguardi non spuntano più sopra il titolo |
| v0.103 | 22/11 | proprietario | Schermata iniziale: al posto dell'animazione (scattava e le ruote sembravano ferme) un quadro fermo disegnato una volta sola: la tua auto in corsia d'emergenza con le quattro frecce, il protagonista col telefono acceso, le scie del traffico a lunga posa, il cartello USCITA 18 KM, un lampione spento; si muove solo la telecamera, piano, con un effetto della pagina che non può scattare |
| v0.104 | 22/11 | cognato | Gomme che sgommavano da sole passando da in movimento a fermi: oltre il picco la gomma, con lo slittamento all'indietro (freno motore, scalata, ruote lanciate su un'auto fermata), spingeva in avanti invece di frenare (errore dalla v0.71); `sim.ferma()` per quando il gioco ferma l'auto di colpo (Luca Garage, tutorial, «Vai a», fondo della retro); controllo della fisica e dei motori di tutte le auto; volume per ogni componente nei Suoni di Luca Tuning (0-200 %). |
| v0.105 | 22/11 | cognato | Da Luca Tuning: il pop & bang non è più una spunta del menu di pausa ma una mappa in più sulla centralina più potente (ultimo livello, niente sui diesel, chi l'aveva accesa la ritrova montata); il volano è un reparto suo, separato dalla frizione, con quattro livelli (originale, pesante, alleggerito, superleggero: salita e discesa dei giri, minimo, tintinnio; chi aveva la frizione rinforzata o da corsa ritrova l'alleggerito); antistallo della frizione automatica sul minimo vero (con volano superleggero le partenze si spegnevano); nelle anomalie non resta più scritto «{Auto}»; numerazione tornata su v0 (v1.00-v1.04 → v0.100-v0.104). |
| v0.106 | 22/11 | cognato | Turbo più vero: la girante la muove l'energia dei gas di scarico (il turbo «entra»), wastegate che apre poco prima del target e in ritardo (picco e assestamento, un filo di tremolio), meno pressione a gas parziale, depressione sul manometro a gas chiuso; suono: soffio dell'aria nel compressore udibile, fischio che resta e cala in rilascio, valvola nitida (sintesi e campioni rifatti), turbo e valvola udibili anche in abitacolo. |
| v0.107 | 22/11 | cognato | Pezzi per tutti i motori: la Supra ha anche aspirazioni (pannello, cono, airbox, cornetti), cilindrata, benzina e cambi sport e da corsa regolabili; cambi più lunghi per tutte: il da corsa al limitatore in ultima tira a 350 km/h sulle belle (≥ 200 CV: Supra, M3...), 320 sulle normali, 300 sulle piccole e sui mezzi pesanti, il cambio sport tutto lungo a 300/275/255 e il bus a 200; compressori volumetrici e centrifughi a cinghia (niente ritardo, niente valvola), il turbo nuovo vale per ogni motore. |
| v0.108 | 23/11 | proprietario | Check della sera: gli avvisi a destra (per esempio «Valigetta di bronzo») non compaiono più sopra la schermata iniziale e il prologo, aspettano. 384 test e prova di fumo senza errori. |
| v0.109 | 23/11 | proprietario | Pulizia del codice: tolte due funzioni mai usate dell'officina vecchia (`renderUps`, `suspLabels`) e una della polizia; tolta una foto di prova finita nel repository per sbaglio. 384 test e prova di fumo senza errori. |
| v0.110 | 23/11 | proprietario | Pausa a due livelli (Esc: finestrella con Continua, Menu completo, Impostazioni, Salvataggi, Salva e torna al titolo); premi (traguardi e valigette) come avvisi del telefono, in fila; salvataggi con nome e «ultima volta»; diario con la mappa del Viaggio e foto ingrandibili. 388 test. |
| v0.111 | 23/11 | proprietario | Proposta per Luca sulle dodici capitali (`docs/storia/PROPOSTA_CITTA.md`, avviso e sospeso 23). Solo documenti, il gioco non cambia. |
| v0.112 | 23/11 | proprietario | Le capitali con l'aspetto delle città vere: Roma, Parigi, Londra, Stoccolma, Berlino, Praga, Vienna, Madrid, Lisbona, Atene e Washington hanno i loro palazzi (17 stili di facciata), le loro insegne nella lingua del posto, i loro quartieri e monumenti illuminati sullo sfondo (Colosseo, Eiffel, Big Ben, Fernsehturm, Partenone, Campidoglio...). Tokyo resta com'è. In più gli strumenti del reel di presentazione (`strumenti/reel/`) e la leva in D nelle riprese del teaser. 394 test. |
| v0.113 | 23/11 | proprietario | Più carattere alle capitali: oggetti del marciapiede di ogni città (pini e nasone a Roma, colonne Morris e metrò Guimard a Parigi, cabine rosse e LOOK RIGHT a Londra, Ampelmännchen e Döner a Berlino, bandiere, ulivi, ciliegi...), targhe delle vie, pub, bucato, bandiere e graffiti sulle facciate, otto monumenti in più (Pantheon, Notre-Dame, Tower Bridge, duomo di Berlino, Karlskirche, toro, Belem, Lincoln), segni sull'asfalto. 397 test. |
| v0.114 | 23/11 | proprietario | Monumenti delle capitali ad alta definizione e con tanti dettagli (pietra a conci, colonne scanalate, cupole a spicchi, rosoni, quadrante del Big Ben, quadriga di Brandeburgo, tetto a losanghe dello Stephansdom, London Eye e Riesenrad, toro di Osborne...): 28 monumenti ridisegnati al doppio della risoluzione in `citta_monumenti.js`. 397 test. |
| v0.115 | 23/11 | proprietario | Video «di serie e preparate»: strumenti per registrare tre auto (E30, 205 GTI, Golf) prima e dopo swap di motore, pezzi, kit, neon e cerchi, con il suono vero dei campioni dei pezzi (`strumenti/reel/preparate.js`, `suono_preparate.js`, `cartelli_preparate.js`, `monta_preparate.py`) |
| v0.116 | 23/11 | proprietario | Video «di serie e preparate»: la 205 e la Golf preparate fanno sgasate da ferme e poi una tirata in marcia lunga (2ª-5ª a gas pieno); aderenza delle gomme maggiorata solo nelle riprese |
| v0.117 | 23/11 | proprietario | Disegno più leggero di fiammate, fumo e fumetti, con meno aggiornamenti della posizione degli avvisi. |
| v0.117 | 23/11 | proprietario | Fiamme dal punto vero dello scarico (anche laterale) per 23 auto col kit; gomme del kit più piccole su E30 e Golf (`wk`); video con accelerazione-rilascio-accelerazione |
| v0.118 | 23/11 | proprietario | Livelli del 2D: facciate dei locali dietro i passanti (non spariscono più dietro gli edifici), riflessi di luce sull'asfalto sotto le auto (`vitaRiflessi`) |
| v0.119 | 23/11 | proprietario | Il protagonista in pixel art e reazioni al motore (nuvolette di pensiero, stupore in faccia: `reazioni.js`), vapore dai tombini e dai locali di ramen, fari sul bagnato |
| v0.120 | 23/11 | cognato | Fiamme e terminale allineati su tutte le auto (fiamma 2 pixel troppo bassa, terminale fisso al paraurti anche col kit laterale, punti delle auto di serie misurati); marmitta che si arroventa tenendo i giri alti (15 s di serie, 10 media, 2-5,5 s spinta); `strumenti/scarichi.js` |
| v0.121 | 23/11 | proprietario | Schermata iniziale viva: traffico, frecce, lampione che sfarfalla, stelle, tempo a caso (sereno, pioggia, nebbia), «Accendi e parti» che gira la chiave con l'avviamento, frasi che cambiano sotto il logo, partite come schede con auto, luogo, km e soldi |
| v0.122 | 23/11 | proprietario | Aggiornamenti subito: `sw.js` chiede sempre al sito se i file sono cambiati (`no-cache`), niente più codice vecchio per 10 minuti dopo un caricamento |
| v0.123 | 23/11 | proprietario | Schermata iniziale: tolti i fari che passano; sfondo animato (luna, nuvole, fari di ricerca, aereo, luci rosse, finestre che si accendono, lampioni che sfarfallano); al posto del pannello il blocchetto d'accensione con la chiave da girare tenendo premuto; avviamento reso col motore vero del gioco |
| v0.124 | 23/11 | proprietario | Schermata iniziale: blocchetto d'accensione ridisegnato (chiave vista di taglio, ghiera cromata), niente insegna SOLO AVANTI (ora sul dirigibile), cartello «ULTIMA USCITA», fari di ricerca ritagliati nel cielo, case sulle colline, ruota panoramica, dirigibile, stelle cadenti, uccelli, più finestre che si accendono; via il fascio dei fari dell'auto e il cono del lampione dietro il blocchetto |
| v0.125 | 23/11 | proprietario | Chiave del blocchetto vista da sopra: una barretta verticale centrata nel cilindro che ruota; i fari di ricerca non sbordano più sul blocchetto (ritaglio `contain: paint`) |
| v0.126 | 23/11 | cognato | Vignette del protagonista solo a versi (niente parole): secondo il momento, il motore dell'auto (tre cilindri, diesel, cinque, sei, turbo, utilitaria) e, negli scoppi, quanto è preparata (POP! → PUPUPU! → TRATATAN!); lettere che escono una alla volta e ballano, vignetta a punte per scoppi, limitatore e partenze |
| v0.127 | 23/11 | proprietario | Schermata iniziale: tolto il riflesso di luce del pulsante premium (`.go::after`, `pShine`) che passava sopra il blocchetto d'accensione |
| v0.128 | 23/11 | proprietario | Blocchetto d'accensione rifatto sul modello del proprietario: pannello «ACCENSIONE» in metallo spazzolato con viti, spie BAT/OLIO/MOT, arco LOCK-ACC-ON-START col puntino ambra, chiave vista da sopra con presa a righe, riga di stato e barra a segmenti |
| v0.129 | 23/11 | cognato | Marmitta rovente rifatta: metallo che si arroventa a pixel (bocca più calda, tubo che si spegne a scalini, buco che brilla, faville al massimo), alone piccolo e solo di notte |
| v0.130 | 23/11 | cognato | Marmitta rovente più calma: di serie da 13 a 21 s, media da 9,5 a 15, spinta da 3 a 7 |
| v0.131 | 23/11 | cognato | Sfruttamento del motore grafico: `strumenti/carico.js` (barre di carico per parte sul fotogramma), `SFRUTTAMENTO.md`, skill `night-run-sfruttamento`, avviso per Nico |
- v0.132 · 23/11/2026 · cognato · prestazioni, primo giro: niente scritture inutili sulla pagina (`leggero.js`), pilota a 20 Hz, ingrandimento senza tela rifatta e senza mipmap, riflesso bagnato in pochi tratti, bagliore e colori sulla tela interna, niente strada sotto gli interni, contatore FPS coi millisecondi
- v0.133 · 23/11/2026 · cognato · il contatore FPS dice quale scheda video usa il browser; se è un rendering software, avviso all'avvio con come riaccendere l'accelerazione grafica
- v0.134 · 23/11/2026 · proprietario · prestazioni, secondo giro: la tela dello schermo è un multiplo intero della scena (al massimo 1440 righe, anche su 4K o con lo zoom di Windows) e il browser la porta alla misura vera con la scheda video, in una passata invece di due; bagliore, colori e vignettatura sulla tela interna anche con lo zoom della ripresa; bagliore sommato in una passata; quadro strumenti grande quanto si vede; gradino delle Prestazioni rimisurato una volta; `strumenti/misura_fps.js`. Al gradino più basso da ~20 a ~47 fps, a densità doppia da ~11 a ~18 (browser di prova senza scheda video)
- v0.135 · 23/11/2026 · cognato · risposte di Luca alla proposta sulle capitali (`PROPOSTA_CITTA.md`), bivi come progetto futuro in `SOSPESI.md` (28, 29), avviso per Nico
- v0.136 · 24/11/2026 · cognato · proposta del progetto impennata (`docs/fisica/IMPENNATA.md`): fisica, pezzi, grafica, interruttore, piano e domande; solo documento
- v0.137 · 24/11/2026 · proprietario · prestazioni, terzo giro: i rettangoli disegnati uno a uno si riempiono in una figura sola (pioggia, nuvole della pioggia e tutte le ellissi a righe, riflessi sull'asfalto, riflesso dei lampioni, sampietrini di Roma): da ~3.900 a ~900 fillRect a fotogramma, stessi pixel
- v0.138 · 24/11/2026 · proprietario · paesaggi fuori città disegnati in figure invece che pixel per pixel (da 3.100-6.700 a 830-1.900 comandi a fotogramma: autostrada, borgo, pianura, montagna, mare, deserto), scritte a pixel in una figura sola, controllo dei comandi nella prova di fumo (`comandi:2600`); schermata iniziale: al telefono in orizzontale non esce più dallo schermo (sospeso 26), l'auto prende la luce della scena, col contorno e il riflesso, la E36 blu del prologo per le partite nuove, foschia e bagliore all'orizzonte, riflessi della città sull'asfalto
- v0.139 · 24/11/2026 · proprietario · tre interruttori in Impostazioni → Grafica → Scritte sulla strada: scritte da fumetto (scoppi della marmitta, urti, frenate; era «Grafiche anime»), versi del pilota (le vignette sopra la testa) e pensieri (tutti, solo la storia, spenti)
- v0.140 · 24/11/2026 · proprietario · quadri distinti per V40, Supra ed E30, chilometri della singola auto visibili anche nel quadro grande
- v0.141 · 24/11/2026 · proprietario · interfaccia Street Racing, menu in pixel art, icone e banner distinti per tipo
- v0.142 · 24/11/2026 · cognato · suono di turbo (girante vera, corpo, spool, nota che segue i giri), aria più cupa, cambiate, fischio degli ingranaggi e aspirazione rifatti; anelli di turbo, compressore e cambio rifatti; scarichi e collettori non toccati
- v0.143 · 24/11/2026 · proprietario · fiamme dello scarico a scelta da Luca Tuning (scheda Fiamme dell'officina): Ossidrica blu, Lanciafiamme, Mitraglia, Smeraldo, Neon viola, più «come viene»; anteprima animata, si comprano una volta e si montano auto per auto
- v0.144 · 24/11/2026 · cognato · **motore muto riparato**: dalla v0.142 il worklet non aveva le costanti DSP_TB/DSP_CB e il motore sintetizzato taceva (si sentivano solo i campioni); ora si copiano, rete di sicurezza che passa al motore sulla pagina se il worklet va in errore, test `test/worklet.test.js`
- v0.145 · 24/11/2026 · cognato · **progetto impennata in prova**: fisica del muso che si alza (sim.js, solo trazione posteriore), barre di reazione/4-link e wheelie bar in officina, grafica, interruttore in Sviluppatori (spento di serie), banco `strumenti/impennata.js`: su strada solo la R5 ci arriva vicino
- v0.146 · 24/11/2026 · cognato · testi delle chat riscritti in italiano più naturale (stessa trama, stessi bivi; 908 nodi in `chat_modifiche.js`), gatto di Elena Fufi al posto di Pasta, ritocchi agli epiloghi e ai sottotitoli delle incursioni
- v0.147 · 24/11/2026 · cognato · **rulli dal vivo da Luca Tuning**: «Attiva rulli» mette l'auto sui rulli davanti al negozio con una barra del gas in basso; i pezzi si montano col motore in tiro e si sentono subito, fiamme e marmitta vere sulla macchina
- v0.148 · 24/11/2026 · cognato · **da Luca Tuning il gas è libero**: appena entrato si sgasa (fermo, freno tirato, marcia in folle che torna uscendo) e i pezzi montati si sentono subito; il banco a rulli torna in fondo al pannello e apre la schermata grande
- v0.149 · 24/11/2026 · cognato · **impennata da film**: col progetto acceso le gomme da drag in partenza tengono come quelle vere (μ 2,5-3) e con 4-link, potenza vera e asciutto il muso sale fino a 12° e ci resta finché spingi; motore di serie, gomme normali o bagnato restano a terra
- v0.150 · 24/11/2026 · cognato · forature in due: lenta ogni 15-20 km, scoppio ogni 42-45 km (± 5) con botto, PSSSHHH e gomma a terra che sbatte (`forature.js`)
- v0.151 · 24/11/2026 · cognato · **impennata secca**: il muso va su in un quinto di secondo e resta piantato al tetto finché spingi (niente su e giù); confermato che le trazioni anteriori non impennano mai
- v0.152 · 24/11/2026 · cognato · lo scoppio della gomma sopra gli 83 km/h ti butta in una corsia accanto, a caso (`foraSbanda` in `forature.js`)
- v0.153 · 24/11/2026 · proprietario · **Nottolino Racing** al titolo: trascina fino a START e rilascia, oppure premi Invio o Spazio.
- v0.154 · 24/11/2026 · cognato · **impennata in partenza da fermo**: nel gioco vero (dal minimo, cambio che attacca da solo, turbo senza pressione) non partiva mai; ora decide la potenza per tonnellata con gomme da drag e 4-link: da fermi, gas a fondo, il muso va su appena le gomme mordono e resta su fino a circa 60 km/h
- v0.155 · 24/11/2026 · proprietario · sul computer quadro strumenti e pulsanti (AVVIA, AUTO, TC, LAUNCH...) salgono in alto a sinistra sotto il riquadro del viaggio: dietro l'auto restano libere fiamme e volanti; la colonna si rimpicciolisce da sola nelle finestre strette
- v0.156 · 24/11/2026 · cognato · i campioni dei pezzi si sentono di nuovo (livello generale da 1,1 a 3,2, +9 dB): erano 18-20 dB sotto il motore e i cursori dei volumi nella scheda Suoni non cambiavano niente all'orecchio
- v0.157 · 24/11/2026 · cognato · lo schermo del banco prova da Luca Tuning mostra i dati veri dell'auto in uso (CV e giri, Nm e giri, limitatore, turbo o aspirato, peso, kg/CV) e le sue curve di CV e Nm, invece dei numeri a caso
- v0.158 · 24/11/2026 · cognato · **scoppiettii coi pezzi di scarico**: di serie niente scoppi al rilascio, col primo livello di scarico o collettore cominciano e crescono fino al massimo; volumi a parte per scoppiettii e scoppi al limitatore nella scheda Suoni di Luca; launch spento = nessun limite di giri (lo stutter box limitava anche spento), si accende solo se la centralina lo ha
- v0.159 · 24/11/2026 · cognato · **impennata rifatta sulla fisica**: niente più mossa da fermo; il muso si alza quando la spinta del momento supera quella che serve a quell'auto (baricentro, passo, peso dietro, 4-link, CV per tonnellata, gomme da drag): prima la cassa si siede, dopo qualche metro sale, cala al limitatore e nelle cambiate, col colpo di frizione in seconda a bassa velocità si alza, a 60 km/h fa solo cenno; tetto 10°
- v0.160 · 24/11/2026 · cognato · **Luca Tuning più pulito e con le fiamme**: CV, Nm, kg/CV e 400 m solo sullo schermo del banco (spostato a sinistra, dove si vede), con +6 CV / −0,2 s del pezzo sotto il puntatore; nel pannello a destra spariscono i doppioni; le fiamme dello scarico escono anche sulla macchina in officina mentre sgasi
- v0.161 · 24/11/2026 · cognato · **Bagagliaio a portata di mano e cambio gomma vero**: pulsante BAGAGLIAIO tra MENU e TELEFONO (anche a schermo intero); «Usa» sulla ruota di scorta (o 9) e l'auto accosta a destra, il protagonista scende, prende la scorta dal bagagliaio, crick e bulloni alla ruota forata, rimette la forata nel bagagliaio e risale (U accelera)
- v0.162 · 25/11/2026 · proprietario · **Nottolino a due posizioni**: tieni premuto per girare la chiave da OFF a START e sentire il motore accendersi.
- v0.163 · 25/11/2026 · proprietario · **Auto 2D**: rimosse le righe sotto la carrozzeria e riallineate le dimensioni delle ruote sui modelli fuori scala.
- v0.164 · 25/11/2026 · proprietario · due auto nuove dai disegni: Fiat Uno Turbo i.e. prima serie (turbo IHI vero da 0,6 bar, 105 CV, cambio C510) e Fiat Punto 75 prima serie (1.2 8V da 73 CV), con telaio, rapporti, gomme, freni, scheda, pezzi propri, traffico e Autosalone
- v0.165 · 25/11/2026 · proprietario · **Scarichi nella vista laterale**: terminali integrati nel disegno, con la verifica che restino lontani dalle gomme
- v0.166 · 25/11/2026 · proprietario · **Quadro, bagagliaio e schermata iniziale**: sul computer i pulsanti sopra e il quadro sotto (proposta di Luca), tasto ⤢ che raddoppia il quadro e lo rimette piccolo; B apre e chiude il bagagliaio; scritte sotto la chiave leggibili su un fondo scuro
- v0.167 · 26/11/2026 · proprietario · **Schermata iniziale senza pioggia**: il tempo a caso è solo sereno o nebbia, niente più righe della pioggia che attraversano lo schermo (resta con `?meteo=pioggia`)
