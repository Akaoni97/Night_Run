# Night Run · Revisione dei dialoghi e «Le tre soste»

Lavoro del 18/11/2026 su richiesta del proprietario. Non cambia ancora niente nel gioco: è l'analisi, le regole di scrittura,
tre scene di prova da approvare e il piano. I nomi e i fatti nuovi sono **[P]** (proposta, da approvare), come in `STORIA_BOZZA_02.md`.

Cosa ho letto: lo zip di Codex (`Night_Run_Le_tre_soste_CODEX.zip`: progetto, copione completo, motore, demo, rapporto),
`STORIA.md`, `STORIA_BOZZA_02.md` (la storia di Claudio, Irene, Elena, Rosa, Livia), `LIMITI.md`, il materiale delle chat
(`materiale_chat/`) e i 982 nodi di `chat_dati.js`.

---

## 1. Perché i dialoghi di oggi suonano finti (misurato)

Su `chat_dati.js`:

| Cosa | Numero |
| --- | --- |
| Nodi con una scelta | 783 |
| **Scelte finte**: tutte le risposte portano allo stesso nodo dopo | **172** (22 %) |
| Nodi con sole due risposte | 650 su 783 |
| Righe dei personaggi con vero dissenso («no», «smettila», «non ci credo», «mi hai mentito»...) | **28 su 758** |
| Righe con formule da mediatore («non ti chiedo di…», «non devi…», «capisco», «posso dirti…») | 95 su 758 |

Tre difetti, tutti con esempi veri:

1. **Tutti si danno ragione.** Le risposte A e B del giocatore sono la stessa frase in due toni, e il personaggio le accetta
   entrambe. Esempio, Livia: *«Questo coincide. Al resto non ho ancora trovato una risposta.»* → «Mi serve questa distinzione.» /
   «Non trasformiamola in una risposta a tutto.» (le due battute dicono la stessa cosa, finiscono nello stesso nodo).
2. **Parlano come terapeuti.** Anche quando litigano. `ELE_litigio` è il litigio con Elena: *«Va bene essere stanco. Non mi
   piace essere il bersaglio.» / «Dimmi cosa posso fare adesso, senza tirare a indovinare.» / «Possiamo anche sentirci dopo.
   Senza sparire per dispetto.»* Nessuno al mondo litiga così: è una mediazione scritta da un manuale. Livia dice «Non ti sto
   chiedendo di rimanere senza niente» e «Ci resto male, non divento il notaio».
3. **Le parolacce sono un'etichetta, non un carattere.** Rosa: *«Questo, porca troia?»*, *«La fiducia tienila. Passami gli
   attrezzi, testa di cazzo.»* Sono sempre rivolte a un attrezzo, mai a una persona che ha sbagliato davvero. Insulta a vuoto e
   poi si lascia aiutare. Una meccanica di cinquant'anni, con una promessa non mantenuta, sotto pressione non è così.

Il motivo di fondo: ogni personaggio vuole la stessa cosa (che il giocatore stia bene e che l'atmosfera resti calma). **Nessuno
ha un interesse suo, un torto, un segreto che morde.** Senza conflitto non c'è scena, c'è solo uno scambio di cortesie con
un'ombra sullo sfondo.

---

## 2. Le regole di scrittura (da qui in avanti)

1. **Ogni personaggio entra in scena volendo qualcosa che il giocatore non vuole dargli.** Elena vuole che venda l'auto.
   Rosa vuole sapere da dove viene l'auto. Livia vuole l'originale in mano sua. Il giocatore vuole andare avanti. La scena è lo
   scontro.
2. **Si può non essere d'accordo, e restare in disaccordo.** Una scena può finire con una porta sbattuta, una telefonata
   chiusa, un «fa' come ti pare». La riconciliazione, se c'è, arriva due soste dopo, per un'altra ragione.
3. **Le risposte del giocatore sono posizioni, non toni.** Mai due risposte con lo stesso contenuto. Ogni risposta cambia
   qualcosa: cosa sa l'altro, cosa pensa di te, cosa si ricorda dopo. Se non cambia niente, la scelta si toglie.
4. **Si dice una cosa e se ne pensa un'altra.** Elena non dice «sono preoccupata», dice «hai mangiato?». Rosa non dice «ho
   paura», dice «metti la cintura, cazzo». Livia non dice «ho speranza», chiede la data di una bolla.
5. **Si mente, e la bugia torna.** Le bugie del giocatore (e dei personaggi) sono flag che ricompaiono dopo, in bocca a chi le
   ha sentite («Domani la vendi, mi avevi detto»).
6. **Linguaggio vero.** Frasi che si interrompono, battute che non rispondono alla domanda, cose dette a metà, ripetizioni,
   cambi di argomento per non affrontare il punto. Volgarità solo quando serve a ferire o quando scappa: contro una persona,
   per una ragione, e raramente.
7. **L'horror sta nel verosimile.** Niente frasi «inquietanti» dette apposta. L'orrore è un dettaglio che non torna dentro
   una conversazione normale: un nome sbagliato, una pausa troppo lunga, qualcuno che non litiga.
8. **Prima il concreto.** Ogni scena parte da un oggetto, un luogo, un'ora, un lavoro (il turno di Elena, un tubo fesso, la
   bolla di un archivio), mai dal sentimento.

### L'idea che regge tutto: chi ti dà sempre ragione è la presenza

La bozza dice che la presenza copia voce e scrittura ma non sa litigare come litigano due persone che si conoscono: non ha una
storia di torti reciproci. Quindi **le persone vere ti contraddicono, la copia ti accontenta.** Il difetto dei dialoghi di oggi
diventa il meccanismo dell'horror: se tutti gli NPC discutono, quello che ti dà ragione al primo colpo, che si scusa subito, che
non rinfaccia mai niente, è quello sbagliato.

Questo fa anche da «domanda di casa» senza menu: non serve chiedere il nome del gatto, basta accorgersi che *Elena non ti ha
rinfacciato il compleanno saltato*. Il giocatore attento lo vede; l'altro no, e arriva a B1.

---

## 3. «Le tre soste» di Codex: cosa si tiene, cosa si cambia

Il pacchetto è ordinato e il motore (stato serializzabile, rami, ripristino) è utile. Il **copione** però ha lo stesso difetto
dei dialoghi di oggi: *«Mandamela. Controllo quanto siamo peggiorati.»*, *«Con gli interessi adesso mi devi un distributore.»*,
poi un amico che dice sempre la cosa giusta («Non ti chiedo di ricordarti adesso. La prossima volta che resti a piedi mi
chiami lo stesso»). Nessuno ha torto, nessuno ha un conto aperto.

**Da tenere (è buono):**
- Le scene sono *situazioni nel mondo*, non solo chat: «accosta», la piazzola, il cortile dietro il muro, il pacco che pesa
  36 chili, il motel con una finestra di troppo. È proprio quello che chiedi con «accosta, fermati qui».
- Contraddizioni **verificabili** invece di spaventi: la serranda che l'auto dietro non può vedere; la ricevuta a 8 chili contro
  la bilancia a 36; sette finestre e sei stanze. Il giocatore ragiona, non subisce.
- Nessuna spiegazione del pacco. Nessun timeout. Il ramo prudente sempre disponibile. Si può rifiutare e andarsene.
- Il prezzo al motel: una sera vissuta, non l'amicizia intera, con doppia conferma.

**Da cambiare:**
- **Dario come "amico nuovo" scollegato.** Nella storia scritta il contatto di casa è Elena, ed è lei che la presenza imita.
  Proposta **[P]**: Dario resta (nome rinominabile) ma diventa la **prima imitazione**: una prova a basso costo (un gettone)
  prima della scena grossa di Elena. Insegna al giocatore la regola che la scena di Elena userà davvero. Vedi scena C sotto.
- **I dialoghi**: riscritti con le regole del §2. La struttura a nodi di Codex si mantiene, il testo no.
- **Collocazione**: tra la Fase II e la Fase III di `STORIA_BOZZA_02.md` (prima di Livia, dopo Rosa), non appena finito il
  tutorial. La bozza dice di non fargli concorrere con le incursioni a lampade: è un requisito del motore di Codex, lo teniamo.
- **Il pacco** si lega a Rosa e a Ottavio (la Volvo, l'autogrill dove ritrovarono l'auto) invece di restare un enigma
  isolato: resta irrisolto, ma qualcuno sulla strada ha una **teoria sbagliata e sicura** (vedi scena B).

---

## 4. Tre scene di prova (per fissare il tono)

Sono bozze: non sono nel gioco, non toccano `chat_dati.js`. Per ogni risposta c'è scritto *cosa cambia dopo*.

### Scena A · Elena, la prima sera (al posto di `ELE_ritiro` e `ELE_litigio`)

**Contesto.** Prima sosta, un autogrill. Il protagonista ha l'auto dello zio che parte, a fatica. Elena è al turno di notte; ha
dieci minuti di pausa e il coinquilino che usa il trapano a mezzanotte (cose già fissate nella bozza: il gatto *Pasta*, il turno,
il coinquilino). Vuole che il fratello la venda e torni a casa. Il giocatore, per ora, non sa spiegare perché non vuole.

> **ELENA:** Dimmi che l'hai già messa su un carroattrezzi.
> **ELENA:** Ho dieci minuti. Rispondi.

- **«Parte. Vado avanti.»** — *Elena:* «Parte. Un'auto che parte non è un'auto. È una scommessa.» *(Pausa.)* «Era di uno che a Natale non c'era mai.»
- **«Domani la vendo.»** *(bugia)* — *Elena:* «Domani. Perfetto. Scrivimelo.» **Effetto:** flag `bugia_vendita`; torna in una telefonata dopo.
- **«Non voglio parlarne adesso.»** — *Elena:* «Certo. Parliamone quando sei sotto un camion.»

Qualunque sia la risposta, la scena arriva qui (il giocatore sceglie *come*, non *se*):

> **ELENA:** Ti ha regalato un temperino. Mi hai detto *un temperino*. Per questo stai guidando di notte una macchina che non sai
> neanche se ha le gomme.
> **TU:** Non è per il temperino.
> **ELENA:** E per cosa? Dimmelo, ho dieci minuti e non li voglio sprecare a indovinare.
> *(Il coinquilino, dall'altra stanza, accende il trapano. Si sente.)*
> **ELENA:** Ecco. Vedi? Io qui ho tutto che funziona **e** tutto che mi rompe. Tu hai un'auto che non sai se parte e fai il
> misterioso. Non è un affare, Nonno.

- **«Perché è l'unica cosa che mi ha lasciato.»** — *Elena* resta in silenzio. Poi: «Ok.» *(riaggancia senza salutare.)* **Effetto:** flag `elena_ferita`; lei richiama dopo un'ora, e fa finta di niente.
- **«Perché tu non c'eri quando me l'hanno detto.»** — è un colpo basso e funziona. *Elena:* «Mi hai chiamato alle due di notte, mentre lavoravo.» Effetto: `litigio_vero`; sblocca una scena di riparazione più avanti, che non è una scusa: è lei che vuole sapere com'è andata davvero.
- **«Fai sempre così: decidi tu cosa devo fare.»** — attacco. Lei lo accetta e lo ritorce: *«Perché tu decidi benissimo da solo, si vede.»* Effetto: `elena_dura`.

> **ELENA** *(finale per tutti i casi, secco):* Mandami un messaggio quando ti fermi per dormire. Non per me. Per sapere dove
> cercarti.

**Nota di regia (la verifica che viene dopo).** In questa scena Elena rinfaccia, non consola. La presenza, più avanti, ha
imparato le parole ma non il rancore: quando «Elena?» dice *«Va bene, hai ragione tu»*, è il segno. Chi ha letto questa scena lo
sente stonare prima di aver fatto una sola domanda di casa.

---

### Scena B · Rosa e Livia al telefono, in vivavoce, sul furgone-officina

**Contesto.** Fase III. Rosa ha il furgone fermo a un'area di sosta; il protagonista sta aspettando un pezzo. Livia (archivista:
metodica, precisa, sbaglia a testa alta) chiama. Le due si conoscono: Rosa ha *promesso* a Livia di riportare Ottavio e non
l'ha fatto. Nessuna delle due ha mai litigato apertamente per questo. Stasera sì.

> **LIVIA:** Ho trovato la data. La Volvo l'hanno recuperata il quattordici, non il diciassette. Tre giorni di differenza.
> **ROSA** *(senza alzare la testa dal motore)*: Livia, non è ora di date.
> **LIVIA:** Per me è sempre ora. C'è scritto *pioggia*. Ottavio non era mai stato fuori con la pioggia.
> **ROSA:** Eri tu quella che non voleva sapere cosa faceva Ottavio quando era fuori.
> **LIVIA:** *(pausa)* Ripetilo.
> **ROSA:** No.

*(Il protagonista ha in mano una chiave da dodici. Nessuna delle due gli parla, finché una non gli parla.)*

> **LIVIA:** Tu sei lì. Dimmi tu: la mia teoria regge, o sono io che sto cercando una cosa che non c'è.
> **ROSA:** Non tirarlo in mezzo.

- **«Per me regge. Una data sbagliata è una data sbagliata.»** — dai ragione a Livia. *Rosa:* «Lo sapevo. Chi ti ha insegnato a fare la spia.» **Effetti:** `livia+1`, `rosa_fredda` (Rosa per un po' risponde a monosillabi).
- **«Rosa ha ragione: adesso il pezzo.»** — dai ragione a Rosa. *Livia:* «Va bene. Fammi sapere quando c'è un'ora per le date.» **Effetti:** `rosa+1`, `livia_ferita` (l'originale arriva più tardi).
- **«Non lo so. Non ero lì.»** *(non ti schieri)* — *Rosa:* «Almeno è onesto.» *Livia:* «È comodo.» Nessuno è contento. **Effetto:** nessun contatore, ma entrambe ti ricorderanno come uno che non c'è mai.
- *(Tacere.)* — il silenzio dura troppo. La radio del furgone, spenta, fa due secondi di rumore di stazione, poi niente. Né Rosa né Livia lo commentano. **Effetto:** nessuno; è la presenza, e il giocatore lo capisce solo se riascolta il nastro.

**Regola.** Nessuna delle due ha «ragione». Rosa ha ragione sul fatto che le date non salvano nessuno; Livia ha ragione sul fatto che
senza date si finisce come Claudio, a correggere i nomi a mano.

---

### Scena C · «Dario», la prima imitazione (al posto di «Prima che la strada impari» e «Ti vedo. Accosta.»)

**Cambio rispetto a Codex.** Dario non è un'anima gentile che porta caffè: è un vecchio amico con un conto aperto. Il gettone e
la sera alla pensilina restano (il ricordo che si può cedere al motel), ma ora hanno un peso:

> **DARIO** *(vero, scena preparatoria)*: Ho trovato una tua foto. Sei dentro un giubbotto enorme.
> **TU:** Mandamela.
> **DARIO:** Dopo. Prima voglio sapere perché non ti sei fatto vedere al trasloco.
> **TU:** Avevo da fare.
> **DARIO:** Avevi da fare. Hai da fare da due anni. Io ti ho dato un gettone dell'autolavaggio perché quella sera eri rimasto a piedi
> e io *ero tornato indietro*. E tu al trasloco no.

È un litigio vero: il giocatore può scusarsi, può difendersi, può chiudere. Dario non perdona subito. Alla fine chiude *a metà*:
«Quando arrivi a Roma chiamami. Non perché ti perdoni.»

**Il tranello (la presenza, più avanti, sullo stesso numero):**

> **«DARIO»:** Ho un problema. Sono alla prossima piazzola, accosta.
> **TU:** Sei dietro di me?
> **«DARIO»:** Sì. Non ti preoccupare del trasloco, davvero. Lascia stare.

**Questo è il segno.** Il Dario vero non avrebbe mai detto «lascia stare». Il giocatore che ha letto la scena preparatoria, o
che ricorda il rancore, lo coglie: *chi ti perdona subito è la presenza.* Poi restano i fatti verificabili di Codex (la serranda
che l'auto dietro non può vedere, la telefonata al numero salvato, la piazzola, i fari). Nessuna di queste serve a «vincere»:
sono modi diversi di accorgersi.

**Se il giocatore ha mentito a Dario** (ad esempio «avevo il lavoro») e poi dice la stessa bugia all'imitazione, l'imitazione la
ripete: sa solo ciò che ha letto. **Il giocatore si accorge che gli dà ragione su una cosa su cui Dario non gliel'ha mai data.**

---

## 5. Contesti fuori dalla chat (da costruire nel gioco)

Tutti derivano dai discorsi sopra; nessuno richiede grafica nuova di auto.

| Contesto | Da quale scena | Cosa deve vedere/fare il giocatore |
| --- | --- | --- |
| **Autogrill con telefono, ore di notte** | Scena A | Fermarsi davvero, chiamare da fermo; il coinquilino con il trapano come suono lontano nella chiamata. |
| **Il furgone-officina di Rosa** | Scena B | Tappa fissa con interno (`interni.js`): furgone con cofano aperto, radio che sfarfalla; Rosa e Livia in sottotitoli. |
| **La piazzola protetta e il cortile dietro il muro** | Scena C (Codex) | Muro e serranda realmente disegnati; l'auto dietro che resta oltre l'angolo (geometria leggibile, da `docs/03`). |
| **Il banco dei pacchi con la bilancia** | «La consegna che pesa» | Pannello bilancia; peso 8→36→68; ricevuta fotografabile. |
| **Il motel con la finestra di troppo** | Motel di Codex | Sette finestre / pianta di sei stanze; corridoio con la striscia di luce. |
| **Il cartello scritto a mano di Claudio** | già in `STORIA_BOZZA_02` | Stessa grafia del parasole; si trova vicino a un'uscita chiusa. |

---

## 6. Piano di lavoro (in ordine)

1. **Questo documento** (fatto): analisi, regole, tre scene di prova.
2. **Approvazione del tono** (proprietario, poi il cognato che scrive la storia): scelgo con loro cosa tenere e cosa cambiare.
3. **Riscrittura del nucleo**: Elena, Rosa, Livia, la presenza. Non 982 nodi: meno e meglio. Oggi 387 nodi di Elena sono quasi
   tutti variazioni di tono; per un rapporto vero bastano, a occhio, 8-12 scene con scontro. Si riscrive nei file sorgente
   (`materiale_chat/`) e si rigenera `chat_dati.js` con l'importatore (`strumenti/importa_chat.py`): niente modifiche a mano.
4. **Integrare «Le tre soste»** come file dedicati (`scene-dati.js`, `scene-core.js`, `scene-bridge.js`), col copione
   riscritto, collocato nella Fase II-III, con test e senza toccare `patto`/`varco`/finali né tutorial né consegne.
5. **Le scene nel mondo** della tabella al §5, una alla volta, con foto e prova nel browser.
6. **Rilettura di tutta la storia** contro le regole del §2: via le frasi inquietanti dette apposta, via le riconciliazioni facili.

## 7. Decisioni che servono

1. **Dario**: resta un personaggio a parte (la prima imitazione) o lo fondiamo con Elena? Io propongo che resti, perché Elena deve
   restare per la scena grossa.
2. **Il tono delle parolacce**: lo tengo alto (Rosa e anche altri) ma sempre *contro qualcuno e per una ragione*. Va bene?
3. **Quanto litigano**: le tre scene di prova sono il livello. Più duro? Meno?
4. **Chi scrive cosa**: la storia è del cognato. Io propongo e riscrivo i dialoghi con queste regole; i fatti nuovi sono
   marcati **[P]** e li decidete voi due.
