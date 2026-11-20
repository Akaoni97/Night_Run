# Blocco 01 — Elena

Consegna di scrittura del 19/11/2026 sul ramo `claude/stoic-mendel-9mgpun`.
La richiesta prevede blocchi separati: questo conclude **A**, non B–E.
Nessun file del gioco o del repository è stato modificato.

## Risultato editoriale

Dieci scene riscritte: **80 nodi narrativi, 124 risposte**. Sostituiscono un perimetro
di 176 nodi, contando i vecchi rami, le soglie e le sei conversazioni aggiuntive.
Vengono ritirati 96 ID, elencati esattamente nel JSON. Non ci sono nuovi ID narrativi:
si riusano quelli delle dieci scene originali. Le chiusure `*_08` restano disponibili.

In aggiunta, 20 override tecnici correggono il nucleo CASA 3. Non sono nuove scene.
Totale consegnato: 100 dichiarazioni, 167 risposte, tutte con tono manuale.
I nodi del campione corrente sono 1004, non 982: comprende già il quarto materiale.
Attribuiti a Elena nel generato letto: 391, inclusi verifiche e supporti.
Il composito dopo questa sostituzione ha 908 nodi. Le due scene protette restano identiche.

L’obiettivo non è far litigare Elena su ogni aggettivo. Ha un vantaggio concreto:
è fuori, ha il lavoro e conosce il fratello. Lo usa per insistere su una vendita che
non spetta a lei decidere. Lui usa la distanza, la vaghezza e qualche bugia per tenerla
fuori. Dire la verità non la rende subito contenta. Il rapporto resta praticabile.

## Scene e scontri

| Scena | Che cosa vuole Elena | Che cosa non ottiene / costo del protagonista |
| --- | --- | --- |
| `ELE_pasta_01` — Il posto sulla sedia | Che il fratello le dia ragione e mostri l’auto | Lui difende il gatto, la attacca o le nega la foto |
| `ELE_turno_01` — Dieci minuti di pausa | Che la sua pausa resti sua | Lui pretende attenzione subito o decide lui quando richiamarla |
| `ELE_coinquilino_01` — Il trapano | Un intervento concreto contro il coinquilino | Lui dà ordini da lontano oppure usa il rumore per svicolare dall’auto |
| `ELE_cena_01` — Il piatto | Che lui decida se lei debba aspettarlo | Una risposta definitiva sul ritorno |
| `ELE_bollette_01` — La busta | Che faccia il conto dell’eredità prima di difenderla | Il conto o la disponibilità ad ammettere che la scelta costa |
| `ELE_richiamo_01` — La sosta promessa | Un luogo concreto dopo il messaggio promesso | La posizione, oppure un’ammissione senza un’altra mezza promessa |
| `ELE_distanza_01` — La foto e l’ora | Che lui ammetta una foto falsa o un orario falso | Una spiegazione che faccia tornare insieme luogo e durata |
| `ELE_riparazione_01` — Dopo il turno | Che lui dica se la vendita era una bugia | Una scusa che cancelli il litigio o il diritto di scegliere per lui |
| `ELE_nonno_01` — Nonno | Che il fratello smetta di farle provare chi è | Il perché della domanda; lui vuole il ricordo senza spiegarsi |
| `ELE_cena_ritorno_01` — Il posto rimasto | Un gesto reale di ritorno, non un saluto | Una promessa pulita: lui torna oppure chiude lasciando lei in attesa |

## Cosa viene unito e cosa viene conservato

- Pasta assorbe “Pasta sulla tastiera”: il gatto porta a un disaccordo concreto sulla foto.
- Turno assorbe la soglia 25 e “Il dopo che non arriva”: ora la pausa ha un proprietario.
- La foto dell’auto di “La foto non bella” è un’azione dentro Pasta e il conto delle bollette.
- Riparazione assorbe la soglia 50, “Una scusa senza però” e “Oggi nessuna domanda”.
  Si riprende il contatto dopo il lavoro, senza dichiarare risolto il litigio.
- Nonno assorbe la soglia 75 e il ricordo del temperino: fa emergere la differenza
  fra lo scherzo di Elena e la tenerezza di Claudio. Non è una certificazione di identità.
- Cena di ritorno assorbe la soglia 100: lei prepara o rimette via un posto;
  il giocatore può ancora offenderla e non ottenere un commiato pulito.
- Prima sera `ELE_ritiro_*` e litigio `ELE_litigio_*`: **nessun override**.
- Restano intatti i quattro supporti `ELE_temperino_*` e `ELE_claudio_*`.
  I loro vecchi menu cosmetici sono fuori dal perimetro richiesto, non li dichiaro corretti.
- Restano intatti i luoghi, tutti i `PRE_*`/`SPORCO_*`, Rosa, Livia, Dario, finali e stati.
  La rettifica delle risposte false del CASA 3 non è una riscrittura del blocco Presenza.

I 96 nodi ritirati non vanno convertiti in 96 “inoltri” con un solo pulsante.
Vanno tolti dal composito prima della rigenerazione. Nessun arco dei nodi conservati
punta a quegli ID; sono controllati anche i riferimenti `fatto`, `sblocca` e `chiude`.

## Soglie e ingressi

Le quattro soglie restano; cambiano i destinatari, perché ora sono scene vive:

| Soglia Elena | Ingresso | Condizione mantenuta sul nodo |
| --- | --- | --- |
| 25 | `ELE_turno_01` | Nessuna; è una scena ordinaria |
| 50 | `ELE_riparazione_01` | `elena_litigio` |
| 75 | `ELE_nonno_01` | `e5_ripresa`, da una risposta della riparazione |
| 100 | `ELE_cena_ritorno_01` | `ev_fase_v` |

Si eliminano le partenze automatiche delle stesse quattro scene: altrimenti arrivano
sia dai chilometri sia dalla soglia. Le conversazioni sbloccate aspettano il loro
requisito grazie al comportamento già presente nel `chat.js` letto.
Nessuna nuova soglia richiede un nuovo evento di gameplay.

Nonno viene etichettata III: può arrivare dopo la riparazione e prima dell’imitazione
di Elena. Raccoglie un ricordo ordinario, non svela il confine né anticipa una prova forte.
La scena della soglia 100 può restare in coda fino a `ev_fase_v`.
Le restanti partenze conservano i chilometri del manifest, inclusi gli `ev_*`.
La rimozione di partenze non può ridurre le distanze fra quelle libere rimaste.

## Bugie, lettori e memorie

La bugia principale è già stata introdotta da Claude: `bugia_vendita`.
Torna nella cena, nella foto impossibile e nella riparazione. Un’ammissione non cancella
il fatto che Elena l’abbia sentita. `e5_vendita_ammessa` non è uno stato di vendita.
Nessuna scelta qui vende davvero un’auto, modifica soldi, inventario, patto o varco.

I flag canonici `elena_sosta_promessa`, `elena_non_aspettare`, `distanza_confermata`
e `nonno_uso_fissato` mantengono il significato precedente. Le scuse del litigio restano
nel file protetto. I nuovi flag `e5_*` registrano soltanto cose dette o fatte nella scena.
Ogni nuovo flag ha un lettore e non è un bonus arbitrario per distinguere due parafrasi.
Le alternative in uno stesso nodo sono ordinate: il rancore specifico prevale sul generico.

| Flag | Impostato da | Letto da |
| --- | --- | --- |
| `e5_aspetto_turno` | ELE_turno_03 A, ELE_turno_07 A | ELE_cena_01, ELE_turno_08 |
| `e5_auto_tenuta` | ELE_cena_02 B, ELE_riparazione_01 A, ELE_riparazione_04 A | ELE_bollette_01 |
| `e5_conto_mostrato` | ELE_bollette_01 A, ELE_bollette_03 B | ELE_bollette_08, ELE_cena_ritorno_02 |
| `e5_foto` | ELE_pasta_03 A, ELE_pasta_04 A, ELE_pasta_05 A | ELE_distanza_03 |
| `e5_foto_no` | ELE_pasta_03 B, ELE_pasta_04 B, ELE_pasta_05 B | ELE_bollette_01 |
| `e5_foto_rottura` | ELE_distanza_05 B, ELE_distanza_07 A | ELE_riparazione_01 |
| `e5_gatto_taglio` | ELE_pasta_01 C | ELE_pasta_08, ELE_turno_01 |
| `e5_nonno_stop` | ELE_nonno_01 B | ELE_nonno_08 |
| `e5_piatto_attesa` | ELE_cena_01 B | ELE_cena_ritorno_01 |
| `e5_piatto_respinto` | ELE_cena_01 C, ELE_cena_03 B | ELE_cena_ritorno_01 |
| `e5_ripresa` | ELE_riparazione_01 A, ELE_riparazione_01 B, ELE_riparazione_01 C | ELE_nonno_01 |
| `e5_scelta_ripicca` | ELE_riparazione_05 B | ELE_riparazione_08 |
| `e5_seconda_foto` | ELE_distanza_03 A, ELE_distanza_04 A | ELE_distanza_05 |
| `e5_soglia_ricatto` | ELE_cena_ritorno_03 B | ELE_cena_ritorno_08 |
| `e5_soldi_muro` | ELE_bollette_01 B, ELE_bollette_04 B | ELE_riparazione_01 |
| `e5_sonno_detto` | ELE_riparazione_03 A | ELE_nonno_01 |
| `e5_sosta_foto` | ELE_richiamo_01 A, ELE_richiamo_03 B, ELE_richiamo_04 A | ELE_richiamo_08 |
| `e5_sosta_nascosta` | ELE_richiamo_01 B | ELE_cena_ritorno_04 |
| `e5_tavola` | ELE_cena_ritorno_01 B | ELE_cena_ritorno_05 |
| `e5_trapano_messaggio` | ELE_coinquilino_01 A | ELE_coinquilino_08 |
| `e5_trapano_solo` | ELE_coinquilino_01 B | ELE_coinquilino_08 |
| `e5_turno_detto` | ELE_turno_05 A | ELE_richiamo_01 |
| `e5_turno_rimando` | ELE_turno_05 B | ELE_richiamo_01 |
| `e5_turno_rinfaccio` | ELE_turno_02 B, ELE_turno_04 A, ELE_turno_06 A | ELE_richiamo_01, ELE_turno_08 |
| `e5_vendita_ammessa` | ELE_cena_02 A, ELE_riparazione_02 B | ELE_cena_08, ELE_cena_ritorno_02, ELE_distanza_04 |
| `e5_vendita_rinvio` | ELE_cena_02 C | ELE_cena_ritorno_01 |

## Rettifica del nucleo CASA 3

Prima le domande presupponevano un coinquilino che parlava troppo e una telefonata
non passata. Nella scena nuova il fatto esposto è un trapano a mezzanotte.
Lasciare i vecchi testi produrrebbe un falso sospetto sulla vera Elena.

- La seconda domanda diventa «Che faceva il coinquilino?» in tutti i selettori.
- Risposta vera: «Usava il trapano. A mezzanotte.»
- Risposta imitata: «Cucinava. Aspettavo che liberasse il tavolo.»
- Alla domanda sulla paura, Elena risponde: «No. Mi teneva sveglia.»
- La prima domanda, gli attori, le maschere, `q31/q32/q33` e le chiusure sono invariati.
- In tre risposte all’ultima domanda rimane un solo pulsante: prima “un’altra”
  portava alla stessa fine di “chiudo”. Non c’è un’altra domanda in quel sottoinsieme.
- Nessuna risposta di casa imposta `elena_verificata`.

## Fatti nuovi [P] e dettagli di messa in scena

**Nessun nuovo fatto centrale:** nessun nuovo parente, colpevole, incidente, potere,
segreto o indizio di trama. Sono proposte editoriali i seguenti dettagli ordinari:

- [P1] Pasta contende la sedia mentre Elena ha un piatto in mano. Si può usare il
  divano e un altro oggetto senza modificare il conflitto o gli archi.
- [P2] Un messaggio concreto al coinquilino e il fatto che il trapano smetta a fine
  scena. Sono una risoluzione locale del rumore già canonico; nessun segreto su di lui.
- [P3] Il conto della macchina mostrato come testo/foto, senza importi nuovi,
  e la busta della bolletta: supporti visivi sostituibili, non prove del mistero.
- [P4] Il piatto messo via/ripreso e l’invito a chiamare da sotto casa: azioni ordinarie,
  non un trasferimento o una nuova casa. Nessuna di esse cambia il finale assegnato.

Le risposte false del CASA 3 sono falsità della copia, non un nuovo passato di Elena.
Le battute possono essere sostituite mantenendo il fatto già stabilito: trapano,
coinquilino, mezzanotte. Approvare questi dettagli prima del montaggio definitivo.

## Dubbi e limiti dichiarati

1. **Il rancore non è una password.** Ho seguito il contrasto fra Elena e la copia,
   ma una persona reale può anche cedere, essere stanca o perdonare. Il dissenso è
   un indizio comportamentale; non sostituisce la verifica indipendente del canon.
   Altrimenti il giocatore riconoscerebbe la presenza da un solo «va bene».
2. **Elena non conosce la verità.** Nella distanza riceve una foto e contesta orari e
   racconti. Un accenno del protagonista a una galleria non le rivela regole o maledizione.
   Nessuna sua battuta certifica che l’uscita sia autentica.
3. **Turno e casa:** sono conversazioni separate. Montare Coinquilino quando Elena è
   a casa, non far sentire il trapano dietro i tavoli del lavoro. La scena non richiede
   che il protagonista senta davvero l’audio: Elena lo riferisce per messaggio.
   Il calendario narrativo va allineato al gioco nel blocco E; il solo km non dà un’ora.
4. **La vendita:** i richiami riguardano la decisione e la promessa sulla macchina
   ereditata. Se il giocatore l’ha davvero venduta fra due scene, serve il fatto reale
   dal concessionario, non la sola presenza di `bugia_vendita`. Questi ingressi vanno
   collocati mentre il filo della vendita è ancora aperto; non attribuire una nuova
   menzogna a chi ha effettivamente venduto. Il blocco non cambia la logica delle vendite.
5. **[P] del documento precedente:** Dario, il trasloco e le scene protette sono qui
   assunti come ultimo materiale presente nel ramo indicato. Non ho cambiato la loro
   approvazione o aggiunto elementi al loro passato. Lo storico promemoria del 18/11
   diceva ancora “Dario non attivo”: è superato da questa sorgente per questo lavoro.
6. **Livia e l’originale:** la richiesta di revisione dice “vuole l’originale”, ma il
   canon assegna già gli originali a Livia. Non ho introdotto il trasferimento vietato;
   il punto va mantenuto nel blocco B, quando toccherà a lei.

## Come importare senza lasciare i vecchi rami

`materiale5_01_ingressi.json` è un manifest completo compatibile con `--attivazione`.
Contiene anche il delta esatto sotto `intervento_materiale5_blocco01`.
La lista `baseline_starts_da_preservare` è appiattita: contiene tutti i 79 ingressi
conservati, città e T9 comprese. Le liste operative T9/luoghi sono vuote per evitare
duplicazioni; i loro cataloghi descrittivi sono conservati con un altro nome.
Così anche i chilometri delle città restano identici al generato corrente.
Il vecchio parser **non consuma** `rimuovi_nodi` o `sostituisci_unlock`: sovrascrivere
solo gli 80 nodi e lanciare il vecchio comando lascerebbe attivi i vecchi sblocchi.

Il verificatore/compositore allegato legge lo snapshot generato e gli override,
filtra i 96 ID, consolida le tabelle e i quattro UNLOCK, poi prova l’importatore
originale su file temporanei. Non modifica file del repository. Claude può applicare
lo stesso filtro alle sorgenti già lette dal proprio importatore. Non servono cambi
alla logica di `chat.js`, `regia.js`, ai finali o ai salvataggi in questo pacchetto.

Se si montano le varianti finali ancora redazionali del materiale3_08, il loro
`fatto:V2_ELE_s100_01` va riferito a `fatto:ELE_cena_ritorno_01`: la soglia è la stessa,
il vecchio ingresso è stato fuso. Non cambia la condizione del finale o il suo esito.

Per i vecchi salvataggi che hanno una chat aperta su un ID ritirato occorre decidere
una migrazione all’ingresso corrispondente. Il JSON non è una migrazione automatica.
Non aggiungo 96 alias al copione per nascondere questa necessità. Partita nuova per
la prova narrativa; eventuale compatibilità dei salvataggi da gestire in integrazione.

## Controlli

I numeri e gli esiti ripetibili sono in `materiale5_01_verifica.json`.
Controllati testo, formato, destinazioni, origini/lettori dei flag, differenze delle
risposte, terminazione, toni e preservazione delle due scene protette.
Il motore puro è provato in Node su tutte le diramazioni dei dieci ingressi e sui
quattro nuovi sblocchi. L’importatore è quello letto dal ramo, senza modifiche.

Non dichiaro passati i 180 test del gioco: questa è una consegna di scrittura.
Alcuni test strutturali vanno aggiornati intenzionalmente: la presenza degli ID
`V2_ELE_n*`/`V2_ELE_s*`, i vecchi ingressi automatici di Turno/Riparazione/Nonno/Ritorno
e il destinatario Elena 25. Conservare le prove di comportamento (soglie una volta,
attesa dei prerequisiti, rami che finiscono), cambiandone i dati di riferimento.
Il blocco non è stato provato nella UI o in una partita. Quel passaggio spetta
all’integrazione di Claude, come previsto dalla richiesta.

## Dove mi fermo

**Blocco A concluso.** Restano B (Rosa/Livia), C (tre soste), D (presenza), E (regia).
Li lascio ai blocchi successivi per rispettare la consegna a scene, senza riempimento.

