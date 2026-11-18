# Diario di Night Run

Due o tre righe a fine sessione, le più recenti in alto: cosa è stato fatto, cosa resta aperto, cosa serve
dall'altro. Lo scrive Claude a fine lavoro (skill `night-run-pubblica`); l'hook di inizio sessione mostra le ultime
due voci, e il controllo della sera le legge.

## 18/11/2026 notte · cognato
- Fatto: scoppi dello scarico rifatti a voci (fino a 6 insieme): ogni scoppio cambia un po' altezza, crepitio e durata,
  ogni tanto un doppio «pa-pam» o una sgranata di schiocchi. Carattere per auto in `voice.pop` (`cars.js`): R5 e utilitarie
  acute e secche, E34 e 6 cilindri bassi e lunghi, diesel sordi. Fiammata: colori arancio, gialla, blu e una fiammella che
  resta accesa dopo gli scoppi. `ascolta.mjs` ha il copione `scoppi` e le variabili `PRESET`/`POPS`.
- **Per il Claude di Nico**: Supra e V40 non hanno `voice.pop`, quindi lo scoppio medio è come prima, ma ora varia un po'
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
