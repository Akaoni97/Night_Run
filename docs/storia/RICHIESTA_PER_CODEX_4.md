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

## 1. Dove prendere tutto (non serve allegare niente)

Il repository è **pubblico**: `https://github.com/Akaoni97/Night_Run`. Tutto quello che serve sta nel ramo `claude/stoic-mendel-9mgpun` (contiene anche le scene di esempio, ancora non su `main`).
Ogni file si legge in chiaro da `RAW/<percorso>` con `RAW = https://raw.githubusercontent.com/Akaoni97/Night_Run/claude/stoic-mendel-9mgpun/`. Se Codex non riesce ad aprire i link, il proprietario gli allega i file (o lo zip del repository) e basta.

Ordine di lettura (percorso: a cosa serve):
1. `docs/storia/REVISIONE_DIALOGHI.md`: analisi, regole, tre scene di prova (leggere per prima)
1. `docs/storia/STORIA_BOZZA_02.md`: IL CANON: verità privata, personaggi, capitali, regole di riconoscimento, finali (§11 ha i dialoghi rifiniti)
1. `docs/storia/STORIA.md`: storia di base
1. `docs/storia/LIMITI.md`: limiti del gioco
1. `materiale_chat/materiale4_01_revisione_dialoghi.txt`: ESEMPI del tono e del formato (anche in appendice qui sotto)
1. `materiale_chat/materiale4_00_toni.txt`: esempio di tabella toni
1. `materiale_chat/11_ATTIVAZIONE.json`: ingressi (quando parte ogni conversazione)
1. `materiale_chat/RIGENERA.md`: come si rigenera tutto
1. `materiale_chat/materiale3_02_bivi.txt`: ELE_*, ROS_*, LIV_* attuali (da riscrivere)
1. `materiale_chat/materiale3_03_confidenza.txt`: chat di soglia
1. `materiale_chat/materiale3_04_luoghi.txt`: capitali
1. `materiale_chat/materiale3_05_auto_casa.txt`: auto e domande di casa
1. `materiale_chat/materiale3_06_scene.txt`: Marco, fallimenti, uscita, varco
1. `materiale_chat/materiale3_07_rosa_livia.txt`: offese di Rosa e Livia
1. `materiale_chat/materiale3_08_nuove.txt`: 18 conversazioni nuove (V2_*)
1. `materiale_chat/materiale3_01_toni.txt`: toni delle risposte originali
1. `chat.js`: motore e formato dei nodi (testa del file)
1. `strumenti/importa_chat.py`: come si legge il materiale
1. `test/chat.test.js`: vincoli controllati dai test

Gli **esempi essenziali** e il **canon in sintesi** sono anche qui sotto (Appendice A e B), così il file regge da solo per cominciare; per i dettagli fa fede `STORIA_BOZZA_02.md`.

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

---

## Appendice A · Canon in sintesi (se qualcosa qui contraddice `STORIA_BOZZA_02.md`, vale la bozza)

- **Claudio**, zio del protagonista ed **Elena**: ha raccolto sei auto di sei viaggiatori e le ha lasciate in eredità; lascia un temperino (consegnato dal notaio con le chiavi), un avvertimento, una grafia riconoscibile (il parasole, i cartelli), un nastro nella radio. Era assente ai Natali: Elena gliene fa una colpa.
- **Elena**: sorella del protagonista, lo chiama «Nonno», gatto Pasta, turno di notte, coinquilino col trapano a mezzanotte. Vuole che venda e torni.
- **Rosa**: meccanica, con Ottavio da sei anni (era un rappresentante), ha promesso a Livia di riportarlo e non l'ha fatto. Sottotitoli durante le incursioni.
- **Livia**: archivista, metodica, sbaglia a testa alta; **Ottavio è suo fratello**. La Volvo (una delle sei auto) è stata ritrovata a un autogrill; nell'auto il tesserino di Ottavio e caramelle alla menta. Custodisce la foto originale di Irene.
- **Irene**: la donna che bussa alla porta («L'ultima porta», Washington D.C.); smise di essere cercata.
- **La presenza**: imita voce e scrittura delle persone care (Elena, Claudio, Dario), non sa litigare come due che si conoscono, concede subito. Barra rossa di «fiducia»; patto, varco e affidamento sono stati della storia (non toccare).
- **Mondo**: dodici capitali collegate da una galleria (Tokyo, Roma, Parigi, Londra, Stoccolma, Berlino, Praga, Vienna, Madrid, Lisbona, Atene, Washington); incursioni a tempo con lampade che si spengono; finali A, B1, B2, C, D.
- **Fasi**: I (Tokyo-Roma), II (Parigi), III (Londra-Vienna), IV (Madrid-Lisbona), V (Atene-Washington).

## Appendice B · Esempi di scrittura già nel gioco (file `materiale4_01_revisione_dialoghi.txt`)

Sono la misura del tono e del formato: la prima sera con Elena, il litigio, Rosa e Livia in vivavoce, Dario e la sua imitazione.

```
Nota · NIGHT RUN · REVISIONE DEI DIALOGHI (18-19/11/2026)

Si legge DOPO gli otto file materiale3_*: un ID già visto viene sostituito (vale l'ultimo). Regole di scrittura in docs/storia/REVISIONE_DIALOGHI.md:
ognuno vuole qualcosa che l'altro non gli dà, le risposte sono posizioni (non toni), nessuno ti dà ragione al primo colpo, la riconciliazione arriva dopo.
Chi ti dà subito ragione è la presenza.
I nomi e i fatti nuovi sono [P], proposte da approvare. Toni delle risposte: materiale4_00_toni.txt.

Nota · SCENA A · ELENA, LA PRIMA SERA (sostituisce ELE_ritiro_*). Il nodo ELE_ritiro_08 resta la fine (altri nodi aspettano «fatto:ELE_ritiro_08»).
Ritirata: V2_ELE_n3_01 «La foto non bella» (aspettava il flag e01b, la foto promessa nella vecchia scena: nella nuova non c’è). Flag nuovi: bugia_vendita (hai detto «domani la vendo»), elena_dura (le hai risposto male), elena_ferita, litigio_vero. elena_sosta_promessa: come prima.

[ELE_ritiro_01] ELENA · I · sempre
Dimmi che l’hai già messa su un carroattrezzi.
Ho dieci minuti. Rispondi.
  A) «Parte. Vado avanti.» → ELE_ritiro_02
  B) «Domani la vendo.» → ELE_ritiro_03 [flag:bugia_vendita]
  C) «Non voglio parlarne adesso.» → ELE_ritiro_04


[ELE_ritiro_02] ELENA · I · sempre
Parte. Un’auto che parte non è un’auto, è una scommessa.
Era di uno che a Natale non c’era mai.
  A) «Era nostro zio, Elena.» → ELE_ritiro_05
  B) «E tu a Natale dov’eri?» → ELE_ritiro_05 [flag:elena_dura]


[ELE_ritiro_03] ELENA · I · sempre
Domani. Perfetto. Scrivimi l’ora.
Così quando domani diventa dopodomani ho un orario da rinfacciarti.
  A) «Te la scrivo.» → ELE_ritiro_05
  B) «Non fare la maestrina.» → ELE_ritiro_05 [flag:elena_dura]


[ELE_ritiro_04] ELENA · I · sempre
Certo. Parliamone quando sei sotto un camion.
  A) «Elena.» → ELE_ritiro_05


[ELE_ritiro_05] ELENA · I · sempre
Ti ha regalato un temperino. Mi hai detto un temperino.
E per questo stai guidando di notte una macchina che non sai neanche se ha le gomme.
  ALT se: elena_dura → Non cambiare discorso. Un temperino, mi hai detto. Per un temperino guidi di notte.
  A) «Non è per il temperino.» → ELE_ritiro_06
  B) «Non ti devo spiegazioni.» → ELE_ritiro_06 [flag:elena_dura]


[ELE_ritiro_06] ELENA · I · sempre
E per cosa? Dimmelo. Ho dieci minuti e non voglio sprecarli a indovinare.
(si sente un trapano, dall’altra stanza)
Ecco. Io qui ho tutto che funziona e tutto che mi rompe.
Tu hai un’auto che non sai se parte e fai il misterioso. Non è un affare, Nonno.
  ALT se: elena_dura → Non mi devi spiegazioni, infatti non me ne dai mai. Non è un affare, Nonno.
  A) «Perché è l’unica cosa che mi ha lasciato.» → ELE_ritiro_07 [flag:elena_ferita]
  B) «Perché tu non c’eri quando me l’hanno detto.» → ELE_ritiro_07b [flag:litigio_vero]
  C) «Fai sempre così: decidi tu cosa devo fare.» → ELE_ritiro_07c [flag:elena_dura]


[ELE_ritiro_07] ELENA · I · sempre
Ok.
Mandami un messaggio quando ti fermi per dormire. Non per me. Per sapere dove cercarti.
  A) «Ti scrivo.» → ELE_ritiro_08 [flag:elena_sosta_promessa]
  B) «Se c’è campo.» → ELE_ritiro_08


[ELE_ritiro_07b] ELENA · I · sempre
Mi hai chiamato alle due di notte. Mentre lavoravo, con tre tavoli aperti.
Ho fatto finta di niente per un’ora.
Poi ho chiuso il turno e non ti ho richiamato: avevi già deciso tu come andava.
Mandami un messaggio quando ti fermi per dormire. Non per me. Per sapere dove cercarti.
  A) «Ti scrivo.» → ELE_ritiro_08 [flag:elena_sosta_promessa]
  B) «Se c’è campo.» → ELE_ritiro_08


[ELE_ritiro_07c] ELENA · I · sempre
Perché tu decidi benissimo da solo, si vede.
Mandami un messaggio quando ti fermi per dormire. Non per me. Per sapere dove cercarti.
  A) «Ti scrivo.» → ELE_ritiro_08 [flag:elena_sosta_promessa]
  B) «Se c’è campo.» → ELE_ritiro_08


[ELE_ritiro_08] ELENA · I · sempre
Vai. E mangia qualcosa.
  ALT se: elena_sosta_promessa → Vai. E mangia qualcosa. Poi mi scrivi.
[FINE]


Nota · LITIGIO (sostituisce ELE_litigio_*). Chi non risponde per ventisei ore e poi si difende: niente scuse di manuale.
Qualunque strada si prenda il flag elena_litigio dice che il litigio c’è stato: apre «Ci siamo calmati?» (ELE_riparazione_01) più avanti.

[ELE_litigio_01] ELENA · II · sempre
Ventisei ore.
Ti ho scritto sei volte. Sei, e tu hai visualizzato tutte.
  A) «Guidavo. Non rispondo in tempo reale.» → ELE_litigio_02
  B) «Non sapevo cosa scriverti.» → ELE_litigio_03
  C) «Ho visto. Non avevo voglia di sentirmi dire di venderla.» → ELE_litigio_04 [flag:elena_dura]


[ELE_litigio_02] ELENA · II · sempre
Non ti ho chiesto il tempo reale. Ti ho chiesto un pollice. Uno, con la mano.
Un pollice costa meno del fiato che usi per dirmi che guidavi.
  A) «Mi stai controllando.» → ELE_litigio_05 [flag:elena_dura]
  B) «Hai ragione. Un pollice lo facevo.» → ELE_litigio_06 [flag:elena_scuse]


[ELE_litigio_03] ELENA · II · sempre
Non sapevi cosa scrivere. Sono tua sorella, non l’avvocato dell’eredità.
Scrivi «ciao» e basta.
  A) «Se scrivo ciao poi parte l’interrogatorio.» → ELE_litigio_05
  B) «Ho paura che tu abbia ragione sulla macchina.» → ELE_litigio_06 [flag:litigio_vero;flag:elena_scuse]


[ELE_litigio_04] ELENA · II · sempre
Non avevi voglia. Ok.
Sei uguale a lui, lo sai? Sparisci per mesi e poi l’offeso sei tu.
  A) «Non paragonarmi a lui.» → ELE_litigio_05 [flag:elena_dura]
  B) «Forse sì.» → ELE_litigio_06 [flag:elena_scuse]


[ELE_litigio_05] ELENA · II · sempre
Ho il turno. Mi stai mangiando la pausa.
  A) «Elena, aspetta.» → ELE_litigio_07 [flag:elena_litigio]
  B) «Vai. Ci sentiamo.» → ELE_litigio_09 [flag:elena_litigio;flag:elena_dura]


[ELE_litigio_06] ELENA · II · sempre
Non mi serviva che avessi torto io. Mi serviva sapere che stai bene.
Dimmelo. Come stai?
  A) «Sto bene.» → ELE_litigio_08 [flag:elena_litigio]
  B) «Non lo so. E non mi va di spiegarlo.» → ELE_litigio_10 [flag:elena_litigio;flag:litigio_vero;flag:e08c]


[ELE_litigio_07] ELENA · II · sempre
Aspetto cosa? Che mi dici di nuovo che va tutto bene?
Ci sentiamo quando ci sentiamo.
[FINE]


[ELE_litigio_08] ELENA · II · sempre
Bugiardo. Ma ok.
Mangia qualcosa.
[FINE]


[ELE_litigio_09] ELENA · II · sempre
Vado.
(Elena non è più in linea.)
[FINE]


[ELE_litigio_10] ELENA · II · sempre
Non te lo chiedo.
Ma io il telefono lo tengo acceso. Anche in pausa. Anche dopo.
[FINE]


Nota · SCENA B · ROSA E LIVIA IN VIVAVOCE (nuova, fase III). Rosa ha promesso a Livia di riportarle Ottavio e non l’ha fatto: nessuna delle due ne ha mai parlato apertamente. Stasera sì.
Nessuna delle due ha ragione. Le date non salvano nessuno (Rosa), ma senza le date si finisce come Claudio, a correggere i nomi a mano (Livia).
Flag: vv_livia, vv_rosa, vv_neutro. Le righe di Livia sono segnate nel testo: la conversazione è quella di Rosa.

[ROS_vivavoce_01] ROSA · III · sempre
(Rosa ti ha messo in vivavoce. Il furgone è fermo a un’area di sosta, col cofano alzato.)
LIVIA: Ho trovato la data. La Volvo l’hanno recuperata il quattordici, non il diciassette.
LIVIA: Tre giorni di differenza.
ROSA: Livia, non è ora di date.
LIVIA: Per me è sempre ora. C’è scritto «pioggia». Ottavio non usciva mai con la pioggia.
ROSA: Eri tu quella che non voleva sapere cosa faceva Ottavio quando usciva.
LIVIA: Ripetilo.
ROSA: No.
LIVIA: Tu sei lì. Dimmi tu: la mia teoria regge, o sto cercando una cosa che non c’è?
ROSA: Non tirarlo in mezzo.
  A) «Per me regge. Una data sbagliata è una data sbagliata.» → ROS_vivavoce_02 [flag:vv_livia]
  B) «Rosa ha ragione: adesso il pezzo.» → ROS_vivavoce_03 [flag:vv_rosa]
  C) «Non lo so. Non ero lì.» → ROS_vivavoce_04 [flag:vv_neutro]


[ROS_vivavoce_02] ROSA · III · sempre
ROSA: Lo sapevo. Chi ti ha insegnato a fare la spia.
LIVIA: Non è una spia, è un testimone.
ROSA: Il pezzo arriva domani. Tu stai fermo dove sei.
[FINE]


[ROS_vivavoce_03] ROSA · III · sempre
LIVIA: Va bene. Fammi sapere quando c’è un’ora per le date.
ROSA: Lo vedi? Basta saper aspettare.
LIVIA: Non è aspettare. È rimandare.
[FINE]


[ROS_vivavoce_04] ROSA · III · sempre
ROSA: Almeno è onesto.
LIVIA: È comodo.
ROSA: Anche tu eri comoda, quando c’era da firmare.
(Nessuna delle due ti scrive più, per un po’.)
[FINE]


Nota · SCENA C · DARIO, LA PRIMA IMITAZIONE (nuovo personaggio [P], vero amico con un conto aperto). Il Dario vero rinfaccia e non perdona subito:
per questo «lascia stare» detto dall’imitazione è il segno. Flag: dario_bugia (ha mentito), dario_scuse, dario_duro, dario_scartato.

[DAR_traslochi_01] DARIO · II · sempre
Ho trovato una tua foto. Sei dentro un giubbotto enorme.
Sembri un cinghiale in un sacco a pelo.
  A) «Mandamela.» → DAR_traslochi_02
  B) «Non adesso, guido.» → DAR_traslochi_08 [flag:dario_scartato]


[DAR_traslochi_02] DARIO · II · sempre
Dopo. Prima voglio sapere perché non ti sei fatto vedere al trasloco.
  A) «Avevo da fare.» → DAR_traslochi_03 [flag:dario_bugia]
  B) «Non ce la facevo a vedere la casa vuota.» → DAR_traslochi_04
  C) «Il trasloco è un tuo problema, non mio.» → DAR_traslochi_05 [flag:dario_duro]


[DAR_traslochi_03] DARIO · II · sempre
Avevi da fare. Hai da fare da due anni.
Io ti ho dato un gettone dell’autolavaggio perché quella sera eri rimasto a piedi.
Io ero tornato indietro. E tu al trasloco no.
  A) «Non è la stessa cosa.» → DAR_traslochi_06 [flag:dario_duro]
  B) «Hai ragione.» → DAR_traslochi_07 [flag:dario_scuse]


[DAR_traslochi_04] DARIO · II · sempre
Casa vuota. Era casa mia, cretino.
Io la vedevo vuota da dentro, tu potevi almeno stare sul marciapiede.
  A) «Hai ragione, dovevo esserci.» → DAR_traslochi_07 [flag:dario_scuse]
  B) «Non ti chiedo di capire.» → DAR_traslochi_06 [flag:dario_duro]


[DAR_traslochi_05] DARIO · II · sempre
Un problema mio. Il gettone dell’autolavaggio era un problema mio, quella sera?
Eri a piedi e io sono tornato indietro.
Al trasloco ti ho aspettato fino alle otto.
  A) «Non ti ho chiesto di tornare indietro.» → DAR_traslochi_06 [flag:dario_duro]
  B) «Lo so. Scusa.» → DAR_traslochi_07 [flag:dario_scuse]


[DAR_traslochi_06] DARIO · II · sempre
Ok. Allora siamo pari: io ti ho aspettato, tu non sei venuto.
Nessuno deve niente a nessuno.
Quando arrivi a Roma chiamami. Non perché ti perdoni.
[FINE]


[DAR_traslochi_07] DARIO · II · sempre
Non perdono in due righe.
Certe cose si perdonano in macchina, altre vogliono i cinque minuti di una stanza.
Quando arrivi a Roma chiamami. Non perché ti perdoni.
[FINE]


[DAR_traslochi_08] DARIO · II · sempre
Guidi. Come sempre. Hai da fare da due anni.
Quando smetti di guidare io sono ancora qui, scemo.
[FINE]


[DAR_imit_01] IMITAZIONE DI DARIO · IV · richiede: ev_imitazione_dario
Ho un problema.
Sono alla prossima piazzola. Accosta.
  A) «Sei dietro di me?» → DAR_imit_02
  B) «Come mi hai trovato?» → DAR_imit_03
  C) «Non mi fermo.» → DAR_imit_04 [flag:imit_dario_rifiuto]


[DAR_imit_02] IMITAZIONE DI DARIO · IV · sempre
Sì. Non ti preoccupare del trasloco, davvero. Lascia stare.
Sono io. Accosta.
  ALT se: dario_bugia → Sì. Avevi da fare, lo so, hai fatto bene. Lascia stare. Sono io, accosta.
  ALT se: dario_scuse → Sì. Il trasloco, le scuse, tutto. Lascia stare. Sono io, accosta.
  A) «Dario non perdona così in fretta.» → DAR_imit_05 [flag:imit_dario_smascherata]
  B) «Ok. Accosto.» → DAR_imit_06 [flag:imit_dario_accosta]


[DAR_imit_03] IMITAZIONE DI DARIO · IV · sempre
Ti ho visto sulla mappa. Hai condiviso la posizione, ricordi?
  A) «Non ho condiviso niente.» → DAR_imit_05 [flag:imit_dario_smascherata]
  B) «Ok. Accosto.» → DAR_imit_06 [flag:imit_dario_accosta]


[DAR_imit_04] IMITAZIONE DI DARIO · IV · sempre
Va bene. Come vuoi. Hai ragione tu, non fermarti.
[FINE]


[DAR_imit_05] IMITAZIONE DI DARIO · IV · sempre
Hai ragione. Scusa. Non so perché l’ho detto così.
[FINE]


[DAR_imit_06] IMITAZIONE DI DARIO · IV · sempre
Bene. Spegni i fari quando arrivi, così non ci vedono.
[FINE]
```
