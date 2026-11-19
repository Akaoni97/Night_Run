# Diario di Night Run

Due o tre righe a fine sessione, le più recenti in alto: cosa è stato fatto, cosa resta aperto, cosa serve
dall'altro. Lo scrive Claude a fine lavoro (skill `night-run-pubblica`); l'hook di inizio sessione mostra le ultime
due voci, e il controllo della sera le legge.

## 19/11/2026 pomeriggio · cognato (usato e polizia)
- Fatto: l'auto dell'usato col cartello VENDESI (e le facciate) ora sta dietro le auto in prima corsia (`street2d.js`,
  ordine a pari profondità). Inseguimenti: dopo «Scappa» sei ricercato; nessuna volante ti fa più accostare, quella che
  bruci ti insegue; si semina solo entrando in un locale o negozio, e lì il ricercato torna a zero (`polizia.js`).
- Aperto: l'inseguimento non ti prende più mai, quindi la multa da fuga oggi non arriva; dirlo se la si vuole indietro.
- Serve dal proprietario: provarlo sul PC (inseguimento con sirena, posto di blocco bruciato).

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
