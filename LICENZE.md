# Licenze e materiale di terzi in Night Run

Controllo fatto il 18/11/2026 su tutti i file del repository, in vista della pubblicazione (inizio 2027).
**Non è una consulenza legale**: è un elenco di cosa c'è, da dove viene e cosa conviene sistemare prima di uscire.
Prima di vendere il gioco conviene far vedere questa pagina a un avvocato (proprietà intellettuale).

## Riassunto

| Cosa | Stato | Da fare |
| --- | --- | --- |
| Nome "Night Run" | **Deciso, da controllare** | Il 18/11 il proprietario ha scelto **Night Run: The Last Highway** (il sottotitolo lo distingue dal "Night Run" di Thousand Ant). Già nel gioco; da controllare nelle banche dati dei marchi e su Steam/itch.io. |
| Nomi e marchi reali delle auto (27 mezzi) | **Rischio** | Marche e modelli veri nel gioco e sul quadro strumenti (TOYOTA, VOLVO, BMW); strisce M sulle BMW. |
| Marchi reali dei ricambi | **Rischio** | HKS, Apexi, Blitz, Garrett, Toyo Proxes, Bridgestone Potenza, Michelin Energy, Bilstein B14, Motronic. |
| Musica (13 canzoni) | **Quasi a posto** | Fatte dal proprietario con Gemini, piano a pagamento Google AI Pro, novembre 2026. Prima di vendere: conferma dei termini di Google sull'uso commerciale. |
| Modello 3D della Supra | Va bene con condizioni | CC BY 4.0: crediti obbligatori e visibili; il modello contiene i loghi Toyota. |
| Suono registrato del motore | Va bene | CC0 (Freesound). |
| three.js | Va bene | MIT. |
| Caratteri (Google Fonts) | Va bene | OFL / Apache; ma caricarli dai server di Google è un problema di privacy in UE: metterli nel repository. |
| Disegni delle auto, grafica, codice, storia | Va bene | Fatti dal proprietario, dal cognato e con Claude per loro. |
| Skill in `.claude/skills/` | Va bene | Apache 2.0 con NOTICE (strumenti di sviluppo, non vanno nel gioco). |

## 1. Il nome del gioco
Su Steam c'è [*Night Run*](https://store.steampowered.com/app/2496340) di Thousand Ant (in arrivo, con playtest) e su
Epic Games Store una versione gratuita già uscita: moto ad alta velocità in una città cyberpunk di notte. Stesso
nome e genere vicino: rischio di contestazione del marchio e soprattutto di confusione (chi cerca il vostro gioco
trova il loro). C'è anche *Nightrunner* (Planetary Gears, Steam, 2024).
**Consiglio**: scegliere un nome diverso o con un sottotitolo forte prima dei video, e controllare il nome scelto
nelle banche dati dei marchi (EUIPO, UIBM) e su Steam/itch.io. Il video si rifà in pochi minuti con un altro nome
(`strumenti/teaser_monta.sh`, scritte in `cartelli`).
**Deciso il 18/11/2026**: *Night Run: The Last Highway*. Nel gioco c'è già (titolo della pagina, scritta in alto, schermata
iniziale, cartello finale del prologo). Restano il controllo del nome completo (EUIPO, UIBM, Steam, itch.io) e le
scritte del teaser.

## 2. Auto e marchi reali
Nel gioco ci sono marche e modelli veri: Toyota Supra RZ, Volvo V40 SW 2.0, Volvo 850 R, BMW 2002 Turbo, BMW M3 E30,
BMW M3 E36, BMW M5 E34, Audi 80 Avant, Audi A3 Sportback, Autobianchi A112 Abarth, Fiat Panda, Fiat Grande Punto,
Fiat Doblò, Volkswagen Golf GTI, Volkswagen Polo, Opel Corsa, Peugeot 205 GTI, 206 GTI, 308, Renault 5 Turbo 2,
Renault Clio, Renault Clio Williams (`CARS[*].name` in `cars.js`). La marca è scritta anche sul quadro strumenti
(`cluster.brand` in `cars.js`), e le BMW E30 e 2002 hanno le strisce dei colori M.
I disegni sono vostri (diritto d'autore vostro), ma nomi, loghi e forme riconoscibili delle auto sono marchi e
design registrati: i giochi commerciali li prendono in licenza dalle case. In un gioco gratuito il rischio è più
basso, in uno a pagamento è alto.
**Consiglio** (quello che fanno quasi tutti gli indie): nomi inventati che richiamano l'originale (marca e modello),
niente marca sul quadro strumenti, niente strisce M; i disegni possono restare, ma un po' distanti dagli originali.
Lo stesso per i ricambi in `tuning.js` e `cars.js`: nomi generici ("terminale singolo grande", "semi-slick").

## 3. Musica
In `audio/` ci sono 13 canzoni (Apex to Apex, Metal Alive, Red Zone Needles, Redline at Midnight; in `audio/house/`
Midnight Apex, Midnight Gearbox, Midnight Redline, Redline Ascent; in `audio/rap/` Asphalt Throne, Liquid Gold and
Concrete, Midnight In The Street, Carbon Fiber Heart, Asphalt and Will), indicate come canzoni del proprietario.
Le cinque rap sono state fatte il **18/11/2026** con **Gemini, piano Google AI Pro** (come le altre).
- Se le avete suonate e registrate voi: sono vostre, nessun problema.
- Se sono fatte con un generatore (Suno, Udio...): conta il piano che avevate **quando** le avete create. Con Suno,
  le canzoni fatte col piano gratuito non si possono usare in modo commerciale, e abbonarsi dopo non le sistema;
  con Pro o Premier sì. Inoltre una canzone fatta solo da un'IA in molti paesi non è protetta da diritto d'autore
  (chiunque potrebbe riusarla). Il video teaser usa *Redline at Midnight*: vale la stessa domanda.

**Risposta del 18/11/2026**: le canzoni le ha fatte il proprietario con **Gemini** (Google, modelli musicali Lyria).
Cosa si sa (da fonti non ufficiali, da verificare sui termini di Google):
- Google non rivendica la proprietà di quello che generi; si possono usare nel rispetto della sua politica sugli
  usi vietati.
- Sull'uso commerciale (gioco venduto, video monetizzati) le fonti non sono d'accordo e le pagine dei piani non lo
  dicono chiaramente: va letto il testo dei termini aggiuntivi delle app Gemini in vigore quando sono state create,
  e conta il piano usato (gratuito o a pagamento).
- Le canzoni portano la filigrana invisibile SynthID: si riconoscono come fatte da un'IA.
- Una canzone fatta solo da un prompt in molti paesi non è protetta da diritto d'autore: potete usarla, ma non
  potete impedire ad altri di riusarla.
- Su Steam va dichiarato che il gioco contiene contenuti generati da un'IA (modulo al momento della pubblicazione).
**Piano e date** (detto dal proprietario il 18/11/2026): tutte fatte col piano a pagamento **Google AI Pro**, nella
prima metà di novembre 2026 (una o due settimane prima). Il piano a pagamento è il caso più favorevole.
**Da fare**: salvare una copia (PDF o schermata) dei termini aggiuntivi delle app Gemini in vigore a novembre 2026
e della ricevuta dell'abbonamento; per un gioco a pagamento, chiedere conferma (Google o un avvocato) prima di uscire.
Le canzoni nuove fatte più avanti vanno segnate qui con piano e data.

## 4. Modello 3D della Supra (`models/supra_mk4.glb`)
*Toyota Supra MK4 (LowPoly)* di Mike Farrant (Sketchfab), licenza CC BY 4.0, modificato (scala, ruote separate,
texture ridotte). La licenza permette anche l'uso commerciale, ma chiede il credito: oggi c'è nel README e
nell'etichetta della vista 3D, ma solo quando la si apre. **Fatto (18/11/2026)**: schermata Crediti nel gioco (`crediti.js`). La licenza
CC copre il modello ma non il marchio: la texture contiene i loghi Toyota. Se la vista 3D non serve all'uscita,
la cosa più semplice è non pubblicarla.

## 5. Suono registrato del motore (`audio/supra/`)
Anelli ricavati da "Import car revs on chassis dyno with turbo" di editboy23 (Freesound 496171), CC0: si può usare
per tutto, senza obbligo di crediti (citarlo è gentile). Da qui la pagina di Freesound non era raggiungibile:
controllare una volta la licenza sulla pagina.

## 6. Codice di altri
- three.js 0.147.0 (MIT) da cdn.jsdelivr.net, solo per la vista 3D. Va bene; nei crediti: "three.js, licenza MIT".
- Nient'altro: niente pacchetti npm nel gioco.

## 7. Caratteri
Russo One, Barlow Semi Condensed, Share Tech Mono, Saira Stencil One, Bangers, Black Ops One (SIL Open Font License
1.1) e Permanent Marker (Apache 2.0) da Google Fonts: si possono usare in giochi e video, anche venduti.
**Privacy**: caricarli dai server di Google manda l'indirizzo IP del giocatore a Google senza consenso; in Germania un
tribunale (LG München I, 20/01/2022) l'ha considerato una violazione del GDPR. Conviene mettere i file dei caratteri
nel repository e caricarli da lì (lo stesso, meno grave, per three.js da jsdelivr).

## 8. Il repository
Non c'è un file LICENSE: tutto è "tutti i diritti riservati", ma se il repository è pubblico chiunque vede codice,
disegni, musica e **tutta la storia** (`docs/storia/`, `materiale_chat/`, `storia.js`, `chat_dati.js`): spoiler
prima dell'uscita. Se il gioco andrà venduto, valutare di rendere privato il repository della storia o il
repository intero.

## Crediti da mostrare nel gioco
- Modello 3D Toyota Supra MK4 (LowPoly) di Mike Farrant, CC BY 4.0, modificato.
- Suono del motore: editboy23 (Freesound), CC0.
- three.js, licenza MIT.
- Caratteri: Russo One, Barlow Semi Condensed, Share Tech Mono, Saira Stencil One, Bangers, Black Ops One (OFL);
  Permanent Marker (Apache 2.0).
