# Versioni di Night Run

**Versione attuale: v0.99**

## Come si conta
Ogni **intervento** (una sessione con Claude, Codex, Kimi o chiunque, oppure un pacchetto di modifiche fatte insieme) fa salire la
versione di **un passo**: v0.53 → v0.54 → v0.55… Non conta quanti commit ci sono dentro, conta l'intervento. Il numero dopo lo
zero è il numero dell'intervento (la v1.0 la decidono il proprietario e il cognato, quando vogliono).

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
| v1.00 | 22/11 | proprietario | Le anomalie di Luca nella storia (otto, su tre livelli, in `VG_ODD`: specchietto, cartello «USCITA 18 KM» che non cambia, radio che dice il km, la tua gemella ferma in corsia d'emergenza, il barista che ti riconosce, il cippo di un km che non esiste, il thermos nella cassa del motel, sei auto uguali); fruscio della radio che si vede; la prova di fumo entra davvero nello sfascio; test dei campioni che non fallisce più per caso |
| v1.01 | 22/11 | proprietario | Tre salvataggi: tre partite del Viaggio separate sullo stesso computer (ognuna con auto, soldi, pezzi montati, personaggio e foto del diario), si scelgono sulla schermata iniziale e nel menu (Partita → Salvataggi); la partita di prima è la Partita 1 |
| v1.02 | 22/11 | proprietario | Schermata iniziale rifatta: sfondo animato in stile Night Run alla risoluzione del gioco (autostrada di notte, città con la luna, lampioni, portale, traffico e camion, la tua auto in primo piano coi fari e qualche botto), logo nuovo, pannello con «Continua il viaggio» per le partite già cominciate; tornato il link Crediti; i traguardi non spuntano più sopra il titolo |
| v1.03 | 22/11 | proprietario | Schermata iniziale: al posto dell'animazione (scattava e le ruote sembravano ferme) un quadro fermo disegnato una volta sola: la tua auto in corsia d'emergenza con le quattro frecce, il protagonista col telefono acceso, le scie del traffico a lunga posa, il cartello USCITA 18 KM, un lampione spento; si muove solo la telecamera, piano, con un effetto della pagina che non può scattare |
