# Richiesta per Codex · terzo giro (completa e sostituisce la numero 2)

Ciao Codex. Questa richiesta **sostituisce** `RICHIESTA_PER_CODEX_2.md` (se l'avevi già cominciata, tieni quello che hai
fatto e completa con questa). Il pacchetto A–M è già dentro il gioco: le 28 conversazioni di Elena, Rosa e Livia (più la
presenza) girano nelle chat del telefono con la **barra di confidenza**. Quello che ti chiedo ora serve a far funzionare
davvero il sistema: bivi veri, toni, gusti, cosa si sblocca con la confidenza, i luoghi.

> **Una cosa che devi sapere su di te.** L'autore ha scelto per questo lavoro un modello capace e vuole che si veda: ti
> chiedo *giudizio*, non solo volume. Se una mia indicazione è sbagliata o contraddice un'altra, **dillo e proponi
> la tua** (nei «Dubbi»). Prima di consegnare, **controlla da solo il tuo lavoro con uno script** (§0.4) e riporta i
> numeri. Puoi leggere i file del repository (ramo `claude/wonderful-knuth-5ohwxa`): `chat_dati.js` (tutti i nodi già
> dentro), `chat.js` (il motore), `STORIA_BOZZA_02.md` (la storia, con §3ter i luoghi e §14 le risposte ai dubbi),
> `strumenti/importa_chat.py` (come leggo il tuo testo).

## 0. Come funziona (leggilo prima)

**0.1 Le chat.** Una persona ti scrive; tu scegli tra **2 o 3 risposte** (mai di più). Ogni risposta ha un **tono**:
`sboccato · pacato · ironico · gentile · freddo · sincero · evasivo`. A ogni persona piacciono toni diversi: se la
risposta le piace, la **barra di confidenza** sale; se no, scende (poco). Il giocatore **non è obbligato** a rispondere a
nessuno e può coltivare tutti. A **25 · 50 · 75 · 100** si sbloccano conversazioni nuove. I gusti si **scoprono**
dalle reazioni, non sono scritti.

**0.2 Formato** (lo legge un programma: rispettalo alla lettera). Righe di nodo:

```
[V2_ROS_s25_01] ROSA · II · richiede: promessa_rosa
Passa dalla sosta, ti guardo il liquido.
  ALT se: conf:Rosa>=50 → Passa, testone, ti aspetto.
  A) «Arrivo.» → V2_ROS_s25_02   [flag: rosa_guarda_auto; +legami]
  B) «Se c'è da fare lo faccio.» → V2_ROS_s25_02   [se: promessa_rosa; flag: rosa_ha_visto_buona_volonta]
  C) «Gratis un cazzo, che c'è sotto?» → V2_ROS_s25_02

[V2_ROS_s25_02] ROSA · II · sempre
Niente. Mi piace l'odore dell'olio. Muoviti.
[FINE]

UNLOCK: Rosa 25 → V2_ROS_s25_01
```

- **ID:** unici, con prefisso `V2_` (se vuoi **correggere un nodo che esiste già**, riscrivilo **con lo stesso ID**:
  l'ultimo vince). Nodo senza risposte = la chat finisce. Nodo con `[FINE]` esplicito idem.
- **Testata:** `CHI · FASE · CONDIZIONE`. Chi: `ELENA`, `ROSA`, `LIVIA`, `NUMERO SCONOSCIUTO`, `PRESENZA SCOPERTA`,
  `IMITAZIONE DI ELENA`, `IMITAZIONE DI CLAUDIO`. Fase `I`…`V`. Condizione: `sempre` · `richiede: flag` · `se: flag`.
- **`ALT se: …  → testo`**: versione diversa della battuta se quella condizione è vera. Condizioni ammesse: un flag
  (`elena_scuse`), `conf:Rosa>=50`, `fatto:ID_NODO`, `!flag:x` (negato), `km>=300`. Metti **le alternative dopo il testo e
  prima delle risposte**. Il richiamo di una scelta passata si fa **così**.
- **Risposta:** `A) «testo» → ID_destinazione   [effetti]`. Effetti separati da `;`: `flag: nome` · `+conoscenza` ·
  `+legami` · `+patti` · `+varchi` · `sblocca: ID` (apre quella conversazione più avanti) · `chiude: ID` ·
  **`se: flag`** (la risposta **compare solo se** quel flag è vero: è il «nodo nascosto»).
- **`UNLOCK: Persona SOGLIA → ID`**: a quella soglia si apre quella conversazione (`ID` è l'ingresso).
- **Flag speciali che crea il gioco** (puoi usarli nelle condizioni): `auto_panda · auto_a80 · auto_v40 · auto_punto ·
  auto_corsa · auto_polo` (l'auto scelta dal notaio), `luogo_roma · luogo_parigi …` (il giocatore è arrivato in quella
  città, vedi §T4). Qualunque altro flag lo crei tu con `flag:` in una risposta.
- **Limiti duri:** ogni riga **≤ 90 caratteri**; **massimo 3 risposte**; **toni scelti tra i sette**; accenti giusti.
  I testi **sulla strada** (cartelli) in MAIUSCOLO ASCII senza accenti, segnalati `[STRADA]`, ≤ 22 caratteri a riga.
- **Tabella dei toni** (§T1): una riga per nodo: `ELE_ritiro_01 · A ironico · B sincero · C sboccato`.

**0.3 Regole di storia.** Tutta la storia è in `STORIA_BOZZA_02.md`. Rispetta soprattutto: **regola 9** (la presenza
prende solo il posto di chi non c'è: può imitare Elena al telefono, mai sostituirla); i **dodici luoghi** (§3ter); le
risposte a D01–D17 (§14). **Nessun fatto nuovo**: se te ne serve uno, mettilo in **«Proposte di fatti nuovi»** in fondo,
separato, e **non usarlo** finché non lo approvo. Elena non sa mai la verità della galleria. Irene non parla.

**0.4 Auto-controllo (obbligatorio).** Scrivi uno script (Python o Node, come preferisci) che controlli il **tuo** file e
riporta in fondo i numeri: ID unici · ogni `→` punta a un ID esistente (nel tuo file o in `chat_dati.js`) · nessuna riga
oltre 90 caratteri · nessun nodo con più di 3 risposte · nessuna risposta senza tono nella tabella · ogni flag usato in
`richiede/se/ALT` è impostato da qualche risposta (o è uno dei flag speciali) · ogni conversazione, comunque si
risponda, arriva in fondo · conteggio dei toni per persona. **Dichiara quanti nodi/risposte/conversazioni hai consegnato.**

## 1. Cosa mi serve, in ordine di priorità (se finisci lo spazio, fermati a una sezione intera)

### T1 · Toni di tutte le risposte esistenti — *la più importante*
Leggi `chat_dati.js`: ci sono ~433 risposte (comprese 17 che ho aggiunto io per avere qualche `sboccato` subito).
**Consegna la tabella dei toni per tutte**, una riga per nodo, con `A`, `B` e, dove c'è, `C`. I toni che ho messo io sono
provvisori e fatti con delle regole sulle parole: **correggili senza riguardi**. Se una mia terza risposta è peggiore di
una che scrivi tu, riscrivi il nodo con lo stesso ID.

### T2 · Bivi veri (oggi sono quasi tutti cosmetici)
Su 433 risposte, la gran parte sono parafrasi che portano allo stesso nodo: **53 flag su 62 non cambiano niente**.
Per **ognuna delle 28 conversazioni** (le trovi in `chat_dati.js`; quelle di Elena, Rosa, Livia):
1. **Un ramo che cambia strada davvero:** almeno una risposta porta a **due o tre nodi nuovi** (`V2_…`) che non sono una
   variante degli stessi, e poi **rientra** nella conversazione o finisce in modo diverso.
2. **Un richiamo con `ALT`:** almeno un nodo dello stesso incontro o di uno successivo ha una versione diversa se prima
   hai scelto una certa cosa. **Ogni flag che imposti deve servire a qualcosa**: o un `ALT`, o un `se:` su una risposta,
   o un `richiede:` su un'altra conversazione.
3. **Una risposta nascosta (`se:`)** che compare solo se prima hai fatto qualcosa (o se la confidenza è alta).
4. **Una risposta che costa:** una terza opzione con conseguenza visibile (un flag che altera una scena futura).
Riscrivi i nodi toccati **con lo stesso ID**, aggiungi i nuovi con `V2_`. Dimmi per ogni conversazione che cosa hai
cambiato in una riga.

### T3 · Gusti, voce a livelli e cosa si sblocca con la confidenza
Per **Elena, Rosa, Livia e la presenza** (la presenza ha una barra anche lei, «fiducia», rossa: sale quando le si
risponde con calore):
1. **Gusti** (2 righe ciascuno): quali toni le piacciono, quali no, **e perché**, con riferimento a ciò che già sappiamo di lei.
2. **Quattro conversazioni sbloccate** per persona (**25, 50, 75, 100**): 6-8 nodi, 2-3 risposte, **un tono per risposta**,
   con `UNLOCK:`. Ognuna dice qualcosa di **nuovo sul personaggio** (un'abitudine, una paura, un ricordo ordinario, un
   gesto), mai un fatto di trama nuovo. La conversazione a **100** è la più personale, ha una frase che il giocatore
   ricorda e può cambiare un epilogo (dì quale).
3. **Per la presenza** le soglie funzionano al contrario (più la lasci avvicinare, più è vicina e pericolosa): **25 · 50 ·
   75** (tre conversazioni) che mostrano come cambia la sua voce: da laconica a intima a insistente. La barra non è mai
   un premio: scrivila in modo che **non convenga riempirla**.
4. **Voce a livelli:** per ciascuna delle quattro, **12 battute già esistenti** (indica l'ID) con un `ALT se: conf:Nome>=N`
   che la fa suonare più calda/più scoperta quando la confidenza è alta. Esempio: Rosa a 50+ dice «testone» con affetto,
   a 0 dice «tu».
Consegna anche, per ciascuna persona, **una riga** su come cambia la **soglia dei finali** (chi ha 100 con Rosa può…?).

### T4 · I dodici luoghi (le capitali)
Leggi §3ter di `STORIA_BOZZA_02.md`: **Tokyo, Roma, Parigi, Londra, Stoccolma, Berlino, Praga, Vienna, Madrid, Lisbona,
Atene, Washington D.C.**, in questo ordine, poi il giro ricomincia. Fra una capitale e l'altra restano i paesaggi che il
gioco ha già (Bassa, San Gimignano, Positano, Hakone, Wangan, Route 66) come **tratti di collegamento**. Nessuna
capitale è esplorabile a piedi: sono tratti di Viaggio con un cielo, un nome e una tappa. Per **ogni capitale** scrivi:
1. **Arrivo** (come compare, ≤ 2 righe, 90 caratteri a riga): cosa si vede e cosa non torna senza spiegarlo.
2. **Tre cartelli** `[STRADA]` (MAIUSCOLO ASCII, ≤ 22 caratteri a riga, massimo due righe): quello che si legge sulla strada
   (in lingua locale se ha senso, ma **solo lettere senza accenti**).
3. **Due nomi** per i cartelli di quartiere (strade o piazze reali **famose**, tipo «Via del Corso»: niente luoghi inventati).
4. **Una riga di radio** in lingua locale, con traduzione italiana tra parentesi (≤ 90 caratteri in tutto).
5. **Quattro eventi** (`id`, `dove`: strada/bar/autogrill/motel/benzinaio, `fase`, `una volta sola`, `testo` ≤ 140
   caratteri): due **quotidiani**, due **strani**. Nelle fasi I e II **molto** quotidiano.
6. **Una conversazione di telefono** `V2_LUOGO_<città>_01…05` (5 nodi, 2-3 risposte, toni) con **Elena, Rosa o Livia**
   (scegli chi ha più senso lì: Elena chiede cosa si vede, Rosa conosce la città, Livia ci ha lavorato…), condizione
   `richiede: luogo_<città>` (il gioco imposta il flag all'arrivo).
7. **Per le sei capitali con un proprietario** (Roma, Stoccolma, Lisbona, Berlino, Vienna, Washington D.C.): **la traccia**:
   l'oggetto lasciato (nome ≤ 3 parole, descrizione ≤ 140 caratteri) e **una scena breve** (≤ 6 righe) che aggiunge il suo
   pezzo al contenimento, usando le funzioni di §3bis.
Più: **11 pensieri** (`PENS_TRATTO_n`, ≤ 2 righe di 90 caratteri) per i tratti **tra** una capitale e l'altra. Proponi
**quale dei sei paesaggi esistenti sta tra quali capitali** e dì se ha senso narrativo.

### T5 · Sei avvii, uno per auto
Il giocatore sceglie **una tra sei auto** (`auto_panda`, `auto_a80`, `auto_v40`, `auto_punto`, `auto_corsa`, `auto_polo`),
e ognuna ha il suo **primo legame** (§3bis). Scrivi per **ognuna** (6 × 6):
- **3 `ALT se: auto_xxx → …`** su righe delle prime conversazioni di Elena (`ELE_ritiro_01/02/05`) e di Rosa
  (`ROS_attrezzi_01`), in cui **si parla di quell'auto** (com'è, cosa ha dentro, cosa fa).
- **Un oggetto** nel vano portaoggetti (nome ≤ 3 parole, descrizione ≤ 140) e **un pensiero** (≤ 2 righe di 90 caratteri)
  quando lo si trova.
Così lo stesso viaggio suona diverso a seconda dell'auto, senza scrivere sei campagne.

### T6 · Le «domande di casa» come conversazioni vere
Oggi (B13 del pacchetto) sono solo elenchi. Riscrivile come **conversazioni giocabili**: per ognuno degli 8 nuclei, un
nodo in cui il **giocatore** sceglie **una di 3 domande** (le tre domande del nucleo) e la risposta cambia se il flag
`ev_voce_imitata` è vero (la presenza risponde sbagliando un dettaglio) o falso (risponde la vera Elena).
Regole: **ogni domanda funziona una volta** (`chiude:` dopo l'uso); la risposta giusta **non certifica** nulla; la
verifica forte è solo quella indipendente. Aggiungi la conversazione del **vicino di Elena** (verifica esterna vera, 6
nodi: chi può raggiungerlo e che cosa può vedere) che, se completata, imposta `elena_verificata`.
Nomi: `V2_CASA_01…08`, `V2_VICINO_01…06`.

### T7 · Scene che mancano o vanno rifatte
1. **B1** (`EPI_B1_*`): a cena viene **zia Irene**, la vedova di Claudio, persona fisica accolta da Elena (§14 D02).
2. **B2** (`EPI_B2_*`): la presenza prende il posto di **Ottavio** con Livia; Elena è al sicuro; il protagonista tace (D03).
3. **Costo per portare Marco** (`V2_MARCO_costo_01…06`): i tre costi concreti di D07 (il carico, la copia di una prova,
   una lampada in più) prima del menu.
4. **Quattro scene di fallimento** (`V2_FAL_1…4`, 4 nodi ciascuna, con la conseguenza persistente di §14 D15).
5. **L'avvicinamento all'uscita autentica**: come si distingue dallo svincolo che ritorna (`V2_USCITA_01…06`).
6. **Il prezzo della guardia** (D, prima del finale): una scena breve che lo renda tangibile (`V2_GUARDIA_01…06`).
7. **Apertura, rifiuto e richiusura di un varco** (`V2_VARCO_01…06`).
Per ogni scena: condizioni di ingresso nella testata.

### T8 · Rosa più sboccata, Livia meno ufficio, correzioni
1. **20 insulti di Rosa** (`ROS_INS2_01…20`), **almeno 12 con parolacce vere** (cazzo, merda, puttana, culo, minchia,
   rottura di palle…), tutti diversi; 4 dolci mentre insultano; 4 secchi e corti, quando ha paura. Niente contro gruppi
   di persone, religione, origini, malattia o disabilità. Una frase giusta vale più di dieci parolacce.
2. **Livia:** riscrivi **20 righe o risposte** in modo meno procedurale (oggi è *fonte, riscontro, prova, verificare* in
   quasi ogni riga): una persona che si perde, fa una battuta sbagliata, parla di cibo o di lavoro. **Massimo una parola
   tecnica per nodo.** Stessi fatti. Riscrivi con lo stesso ID.
3. **Telefono a testo:** cambia «Ti sento ridere» (`ELE_pasta_05`), «Ti sento parlare» (`ROS_ricontrollo_03`) e simili in
   forme da messaggio. Cerca da solo gli altri casi simili. Le righe `RADIO` restano voce.
4. **Refusi:** «Vuoleva» → «Voleva» (3 volte). Cerca altri refusi.

### T9 · Allungare i discorsi (la parte più grande: qui conta il giudizio)
Voglio **più materiale per lo stesso sistema**, ma senza riempimento. Proponi e scrivi **6 conversazioni nuove per
ciascuna** di Elena, Rosa e Livia (**18 in tutto**, 6-8 nodi, 2-3 risposte, un tono per risposta, **bivi veri**, almeno
due con ritorno di una scelta passata). Prima consegna una **scaletta** (una riga per conversazione: titolo, fase,
a che soglia di confidenza o in che condizione si apre, che cosa cambia nel personaggio) e poi i testi. Temi liberi ma
coerenti col personaggio: Elena (lavoro, gatto, litigi piccoli e grandi, ricordi d'infanzia con Claudio), Rosa (officina,
cibo, il suo modo di avere paura, una cosa che ha rifatto), Livia (archivio, lavoro quotidiano, un'abitudine, un
errore suo). **Umorismo vero**: almeno un terzo con una battuta che faccia ridere davvero (Elena e Rosa anche
volgare). Se la storia permette un'altra persona che scrive al protagonista, proponila in **«Proposte di fatti nuovi»**.

## 2. Come consegnare

Più file numerati, ognuno autonomo (se un file è lungo, spezzalo a **una sezione intera**): ad esempio
`materiale3_01_toni.txt` (T1), `materiale3_02_bivi.txt` (T2), `materiale3_03_confidenza.txt` (T3), `materiale3_04_luoghi.txt`
(T4), `materiale3_05_auto_casa.txt` (T5-T6), `materiale3_06_scene.txt` (T7), `materiale3_07_rosa_livia.txt` (T8),
`materiale3_08_nuove.txt` (T9). Il programma li legge **in ordine**: un ID che compare due volte vale l'ultimo.
In fondo all'**ultimo** file una sezione **«Per Claude»** con: i numeri dell'auto-controllo (§0.4), i **Dubbi**, le
**Proposte di fatti nuovi** (separate, non attive), e **dove ti sei fermato** se non hai finito.

Se esaurisci lo spazio: **la T1 (i toni) è indispensabile e viene per prima**; poi T2, T3, T8; T4 e T9 sono le più
grosse e possono venire dopo. Grazie, e non risparmiarti sul giudizio.
