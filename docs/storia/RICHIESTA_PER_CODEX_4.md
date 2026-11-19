# Night Run · Richiesta a Codex n. 4 · Riscrivere i dialoghi (quarto giro)

Da dare a Codex insieme ai file elencati al §1. Chi scrive qui è Claude, per conto del proprietario; la storia è anche del cognato.
Tutto quello che è **[P]** è una proposta, da approvare. Il gioco non va toccato: si consegna solo materiale di scrittura nel formato del §4.

## 0. Perché questo giro

I dialoghi di oggi (982 nodi scritti nei giri precedenti) sono tecnicamente in ordine ma suonano finti. Misurato sul codice:
- 22 % delle scelte sono finte (tutte le risposte portano allo stesso nodo, con lo stesso effetto);
- solo 28 righe su 758 dei personaggi contengono un vero dissenso;
- i litigi sono scritti come mediazioni da manuale («Non ti sto chiedendo di…», «Non mi piace essere il bersaglio»);
- le parolacce di Rosa sono un'etichetta, mai rivolte a una persona che ha sbagliato;
- nessuno ha un interesse suo, un torto, un segreto che morde: tutti vogliono solo che il protagonista stia bene.

Il proprietario vuole: discorsi **veri**, gente che non è d'accordo e litiga, dinamiche da libro e da film, **niente banalità**, nessuno che si dà ragione da solo,
**seguire il canon già scritto senza inventare di sana pianta**, recuperare il recuperabile, atmosfera **horror cupa e realistica** (come discorsi reali, contesto verosimile).

## 1. Cosa deve avere sotto mano Codex (da allegare)

Dal repository `Akaoni97/Night_Run` (ramo `main`):
1. `docs/storia/REVISIONE_DIALOGHI.md` (analisi, **regole di scrittura §2**, tre scene di prova) ← da leggere per prima.
2. `docs/storia/STORIA_BOZZA_02.md` (il canon: Claudio, Irene, Elena, Rosa, Livia, la presenza, le dodici capitali, le regole di riconoscimento, i finali), `docs/storia/STORIA.md`, `docs/storia/LIMITI.md`.
3. `materiale_chat/` per intero, soprattutto `materiale4_01_revisione_dialoghi.txt` (**gli esempi di come va fatto**), `materiale4_00_toni.txt`, `materiale3_*`, `11_ATTIVAZIONE.json`, `RIGENERA.md`.
4. `chat_dati.js` (stato attuale, solo da leggere: è generato), `chat.js` (motore e formato dei nodi in testa al file), `strumenti/importa_chat.py` (come si legge il materiale), `test/chat.test.js` (i vincoli).
5. Il suo stesso pacchetto «Le tre soste» (`scene-dati.js` ecc.) per il punto C del §3.

Se non può allegare tutto: i primi tre punti sono indispensabili, il quarto serve per controllare il formato.

## 2. Il lavoro, in ordine di importanza

Consegnare **a blocchi**, uno alla volta, per non perdere qualità: ogni blocco è un file di testo separato (§5). Non serve fare tutto in un colpo.

### A · Elena (blocco 1)
Oggi ha 567 nodi, quasi tutti variazioni di tono. **Rimangono come sono** la prima sera e il litigio (già riscritti da me: `ELE_ritiro_*`, `ELE_litigio_*`).
Da riscrivere con le stesse regole: `ELE_pasta`, `ELE_turno`, `ELE_coinquilino`, `ELE_cena`, `ELE_bollette`, `ELE_richiamo`, `ELE_riparazione`, `ELE_nonno`, `ELE_distanza`, `ELE_cena_ritorno`, le chat di soglia `V2_ELE_s25/s50/s75/s100` e le `V2_ELE_n*`.
Per un rapporto vero bastano 8-12 scene con scontro: **meno nodi, scritti meglio**. Si possono cancellare e unire conversazioni; si indica quali nel rapporto (§5).
Elena (canon): sorella del protagonista, gatto Pasta, turno di notte, coinquilino col trapano, lo chiama «Nonno». Vuole che venda l'auto e torni a casa. **Non perdona subito, rinfaccia, non consola**:
la presenza che la imita ha le parole ma non il rancore, e «Va bene, hai ragione tu» è il segno.

### B · Rosa e Livia (blocco 2)
Rosa (meccanica, ha lavorato con Ottavio sei anni, ha promesso a Livia di riportarlo e non l'ha fatto) e Livia (archivista, metodica, sbaglia a testa alta, Ottavio è suo fratello).
Da riscrivere: `ROS_*`, `LIV_*`, `V2_ROS_*`, `V2_LIV_*`, e le 20 offese di Rosa (file 07): Rosa insulta **una persona per una ragione**, non un attrezzo. Rosa e Livia **litigano tra loro** davanti al protagonista (modello: `ROS_vivavoce_*`).
Nessuna delle due ha ragione: le date non salvano nessuno (Rosa), ma senza le date si finisce come Claudio, a correggere i nomi a mano (Livia).

### C · «Le tre soste» (blocco 3)
Tenere il motore e la struttura a nodi; **riscrivere il copione**: `accosta`, `pacco`, `motel`, e l'episodio `amico` che diventa **Dario** (non più un amico nuovo e gentile, ma un vecchio amico con un conto aperto: gettone dell'autolavaggio, trasloco saltato; vedi `DAR_*`).
Dario è la **prima imitazione**: la presenza, sullo stesso numero, gli fa dire «lascia stare» e dargli ragione sulla bugia che lui non ha mai accettato. Restano i fatti verificabili (serranda, ricevuta 8 → bilancia 36, sette finestre per sei stanze), nessuna spiegazione del pacco, il ramo prudente sempre disponibile, il prezzo al motel (una sera, non l'amicizia) con doppia conferma.
Il pacco si lega a Rosa e a Ottavio (la Volvo, l'autogrill dove ritrovarono l'auto); chi sulla strada ne parla ha **una teoria sbagliata e sicura**.

### D · La presenza (blocco 4)
`PRE_*`, `SPORCO_*`, `V2_*_presenza`. Regola: **chi ti dà sempre ragione è la presenza**. Imita voce e scrittura, non sa litigare come due che si conoscono, non ha una storia di torti reciproci: concede subito, si scusa subito, non rinfaccia, o rinfaccia una cosa sbagliata (un nome, una data, un compleanno che non c'è mai stato).

### E · Contesti fuori dalla chat (blocco 5, solo descrizioni)
Per ogni scena grossa, una pagina che dica cosa deve **vedere e fare** il giocatore nel mondo (luogo, ora, oggetti, suoni, cosa succede se non risponde, cosa cambia se mente). Esempi attesi: l'autogrill di notte con il trapano del coinquilino nella telefonata, il furgone di Rosa a un'area di sosta, la piazzola con il muro e la serranda, il banco pacchi con la bilancia, il motel con la finestra di troppo. Non serve grafica: serve la **regia** (cosa, dove, quando, con quali condizioni e flag).

## 3. Criteri di scrittura (valgono per tutto)

1. **Ogni personaggio entra in scena volendo qualcosa che il giocatore non vuole dargli** (Elena: che venda; Rosa: da dove viene l'auto; Livia: l'originale; Dario: spiegazioni sul trasloco). La scena è lo scontro.
2. **Si può restare in disaccordo.** Una scena può finire con una porta sbattuta, una telefonata chiusa, un «fa' come ti pare». La riconciliazione, se c'è, arriva due soste dopo, per un'altra ragione.
3. **Le risposte del giocatore sono posizioni, non toni.** Mai due risposte con lo stesso contenuto. Ogni risposta cambia qualcosa (cosa sa l'altro, cosa pensa di te, cosa si ricorderà). Se non cambia niente, si toglie la scelta. Nodo con una sola risposta va benissimo.
4. **Si dice una cosa e se ne pensa un'altra.** Elena non dice «sono preoccupata», dice «hai mangiato?». Rosa non dice «ho paura», dice «metti la cintura». Livia non dice «spero», chiede la data di una bolla.
5. **Si mente, e la bugia torna.** Le bugie sono flag che ricompaiono dopo in bocca a chi le ha sentite (come `bugia_vendita`, `dario_bugia`).
6. **Linguaggio vero.** Frasi che si interrompono, battute che non rispondono alla domanda, ripetizioni, cambi di argomento per non affrontare il punto. Volgarità solo per ferire o quando scappa: **contro una persona, per una ragione, raramente**.
7. **L'horror sta nel verosimile.** Mai frasi «inquietanti» dette apposta. L'orrore è un dettaglio che non torna in una conversazione normale: un nome sbagliato, una pausa troppo lunga, qualcuno che non litiga.
8. **Prima il concreto.** Ogni scena parte da un oggetto, un luogo, un'ora, un lavoro (il turno, un tubo fesso, la bolla di un archivio), mai dal sentimento.
9. **Vietato:** formule da mediatore («non ti chiedo di…», «non devi…», «capisco», «posso dirti…»), terapeuti, frasi che spiegano il sentimento, personaggi che si danno ragione, scuse al primo colpo, chiusure di cortesia.
10. **Canon prima di tutto.** Non inventare fatti centrali. Se serve un fatto nuovo (un nome, un luogo, un oggetto, un passato) è **[P]**, elencato nel rapporto, e tutto il resto della scena deve reggersi anche senza.
11. Non toccare: patto / varco / affidamento, finali A, B1, B2, C, D, tutorial, consegne, regole di riconoscimento. Le conversazioni che aspettano questi eventi mantengono i flag `ev_*` già usati.

## 4. Formato (lo legge `strumenti/importa_chat.py`)

Modello: `materiale_chat/materiale4_01_revisione_dialoghi.txt`. In breve:

```
[ELE_esempio_01] ELENA · II · sempre
Prima riga del messaggio.
Seconda riga (un messaggio a parte).
  ALT se: bugia_vendita → Versione diversa (una sola riga) se quel flag è vero.
  A) «Risposta del giocatore.» → ELE_esempio_02 [flag:nome_flag]
  B) «Altra risposta, altra posizione.» → ELE_esempio_03 [flag:altro;se:condizione]
[FINE]
```
- Intestazione `[ID] PERSONA · fase · condizione`. Persone ammesse: ELENA, ROSA, LIVIA, DARIO, NUMERO SCONOSCIUTO, PRESENZA SCOPERTA, IMITAZIONE DI ELENA / DARIO / CLAUDIO. Fase I-V. Prefissi degli ID: `ELE_`, `ROS_`, `LIV_`, `DAR_`, `PRE_`, `SPORCO_`, `V2_`.
- **Un ID già esistente viene sostituito dall'ultimo che compare**: per riscrivere un nodo basta ridefinire lo stesso ID. Un ID nuovo è un nodo nuovo.
- Un nodo termina con `[FINE]` (nessuna risposta) oppure con 1-3 risposte `A) B) C)`. Effetti tra parentesi quadre separati da `;`: `flag:x`, `sblocca:ID`, `chiude:ID`, `+conoscenza|legami|patti|varchi`. Condizione di una risposta: `se:flag`.
- **Un commento tra due nodi deve cominciare con la parola `Nota`** (altrimenti l'importatore lo attacca al nodo prima). Niente righe che iniziano per `[`, `Ingresso`, `Uscita`, `Nucleo`.
- **Più persone nello stesso nodo** (scena a tre): la conversazione è quella di una sola persona e le altre si segnano nel testo (`LIVIA: …`, `ROSA: …`) come in `ROS_vivavoce_01`.
- **Toni** delle risposte, uno per risposta, scelti solo tra: `sboccato pacato ironico gentile freddo sincero evasivo`. In un file a parte, righe `ID · A ironico · B sincero · C freddo` (modello: `materiale4_00_toni.txt`). Elena e Livia non amano freddo/evasivo, Rosa ama sboccato/sincero: il tono muove la barra di confidenza, quindi va scelto con cura.
- **Ingressi** (quando una conversazione parte): in un JSON a parte con voci `{id, th, node, km, req}` come in `11_ATTIVAZIONE.json`; `req` può contenere `flag:x`, `conf:Rosa>=15`, `fatto:ID_NODO`. Un flag richiesto **deve essere impostato da qualche risposta** (o essere `ev_*` / `luogo_*`).

### Vincoli che i test del gioco controllano
- ogni **riga di testo ≤ 90 caratteri** (anche la riga di un `ALT`; spezzare in più righe, ognuna è un messaggio);
- ogni **risposta ≤ 90 caratteri** e **al massimo 3 risposte** per nodo;
- ogni destinazione esiste; ogni flag richiesto è impostato altrove;
- due risposte dello stesso nodo non devono portare allo stesso punto con gli stessi effetti (scelta finta);
- partenze (senza `flag`/`fatto`) distanziate di **almeno 9 km**; la prima non prima del km 18;
- il nodo `ELE_ritiro_08` è la fine della prima sera e altri nodi aspettano `fatto:ELE_ritiro_08`: non cambiargli ID.

## 5. Cosa consegnare

Per **ogni blocco** (si può fare uno alla volta, in questo ordine: Elena, Rosa e Livia, tre soste, presenza):
1. `materiale5_0N_<nome>.txt` : i nodi nel formato del §4;
2. `materiale5_0N_toni.txt` : i toni delle risposte;
3. `materiale5_0N_ingressi.json` : gli ingressi nuovi o cambiati (e quelli da togliere);
4. `materiale5_0N_rapporto.md` : cosa è stato sostituito, cosa cancellato e perché, i flag nuovi (chi li imposta, chi li legge), i **fatti nuovi [P]**, i dubbi sul canon, e una riga per ogni scena che dice **qual è lo scontro** (cosa vuole il personaggio, cosa non ottiene).
5. Per il blocco E, un solo `materiale5_05_contesti.md`.

Autocontrollo prima di consegnare: ogni riga ≤ 90 caratteri, nessun «non ti chiedo di», nessun nodo con due risposte uguali, ogni scena ha uno scontro, nessuno chiede scusa al primo colpo, le parolacce sono contro persone.

## 6. Cosa fa Claude dopo

Claude metterà i file in `materiale_chat/`, rigenererà `chat_dati.js` con l'importatore, farà girare i test (oggi 180) e proverà le scene nel browser. Se qualcosa non rispetta il §4 lo rimanda indietro con l'errore preciso.
