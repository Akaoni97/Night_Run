# Night Run · Storia, bozza 02 (rifinita)

Lavoro sulla versione estesa 02 mandata da Codex. Con il consenso del proprietario ho tolto i divieti, riempito i buchi e
scelto, quando serviva, una soluzione. Niente di questo è nel gioco: è un testo di lavoro, da approvare prima di
metterlo in `STORIA.md`.

Legenda:
- **[A]** deciso dall'autore (dal documento 02 o da `STORIA.md`).
- **[P]** mia proposta per chiudere un buco. Nomi provvisori in *corsivo*.
- **[S]** modifica sostanziale rispetto alla 02.
- **[R]** semplice rifinitura.

---

## 0. Cosa ho cambiato

**Sostanziali**
1. **[S] La persona tornata con Claudio non era la persona che lui credeva.** Si chiamava Irene, sua moglie. La vera Irene
   è rimasta nella galleria ed è la **figura alla porta**. Lega insieme tre cose che nella 02 erano separate: la figura che
   sorveglia, la foto nascosta e le uscite chiuse.
2. **[S] Il contatto di casa è la sorella minore, *Elena*.** Rapporto alla pari, scherzi, soprannomi condivisi: è il
   materiale giusto per l'imitazione. Claudio è per lei uno zio quasi sconosciuto, come per il protagonista.
3. **[S] Il finale Ospite diventa doppio:** B1 inconsapevole, B2 consapevole (vedi §10 e spiegazione sotto).
4. **[S] Sei proprietari, sei luoghi, ma i luoghi sono quelli già nel gioco** (`VG_ROUTE`: Bassa, San Gimignano, Positano,
   Hakone, Wangan, Route 66), non sei capitali. La galleria che li collega esiste già (`galleria2d.js`).
5. **[S] Sei auto nel testamento, ma se ne ritira una sola.** Sono quelle decise dal proprietario: Fiat Panda, Audi 80
   Avant, Fiat Grande Punto, Opel Corsa, Volkswagen Polo e Volvo V40 SW. Ognuna ha avuto un proprietario diverso, e quella
   che scegli decide il primo legame del viaggio. Le altre cinque finiscono in vendita all'**Autosalone Notte** (§3bis).
   Cade la mia formula precedente "la Volvo è di Claudio": la Volvo era di Ottavio, e l'auto di Claudio è l'Audi 80.

**Rifiniture**
- **[R]** Tutti i divieti della 02 sono tolti. Restano solo le cose che servono alla coerenza: la presenza non è onnisciente,
  le prove non cambiano a posteriori, nessun finale è imposto da una regola nuova all'ultimo.
- **[R]** Dialoghi riscritti e scene nuove (§11).
- **[R]** Conflitto tra uscita anticipata e numero di incursioni risolto (§9, §10).

**Perché il finale Ospite "per creduloni" era un problema.** Nella 02 B richiede di accompagnare la presenza *senza avere
riconosciuto la sostituzione*. Ma il gioco dà gli strumenti per verificare: chi li usa, e legge i messaggi, non ci arriva
mai. Quindi B diventa il finale che prendi se sei distratto, un "ti sta bene" nascosto, e un contenuto che il giocatore
attento non vede mai. Soluzione: due strade verso la stessa porta aperta. B1 è l'inganno riuscito; B2 è la resa
cosciente, per un motivo che il giocatore ha costruito (§10). Il giocatore attento può comunque finire a B, ma per una
scelta, non per una svista.

---

## 1. La verità (privata, il giocatore non la riceve mai intera)

**[A] La galleria** è un luogo alterato che collega punti del mondo lasciati accessibili dai viaggiatori precedenti.

**[P] Che cos'è.** Un vecchio tunnel stradale, chiuso da decenni, dove ci fu un incidente a catena con un incendio. Il
luogo non è stregato da una persona: ha imparato a **ripetere** quel che è successo, e a **copiare** chi ci passa. La
presenza è ciò che il luogo ha di più simile a una volontà: vuole uscire, e non sa farlo da sola. Non ha un nome e non è
un demone di nascita. È un'eco con un metodo.

**Regole (fisse, non cambiano per giustificare una sorpresa)**
1. La presenza **può copiare** voce, scrittura e modi di dire che ha davvero ascoltato o letto, passando da dispositivi
   toccati dalla strada (telefono, radio, messaggi).
2. **Non legge i pensieri**, non vede il mondo fuori dalla rete, non crea ricordi nuovi in chi non è esposto.
3. **Non può uscire da sola.** Esce solo se un vivo, in un varco aperto, la accompagna *riconoscendola* come qualcuno
   che conosce. È per questo che sceglie un volto e ne impara i rapporti.
4. Chi è esposto alla strada vede i propri ricordi spostarsi (un dettaglio, una data). Gli originali conservati **fuori
   dalla rete** non cambiano.
5. **Nessuna scelta ordinaria apre un varco.** Leggere, rispondere, dare un passaggio non basta: serve una decisione
   esplicita, con gli indizi sul tavolo.
6. **Il sangue è memoria della ripetizione.** Si concentra dove un evento si ripete e si fa fresco quando si ripete.
7. Intervenire non cambia il passato. Può **liberare** un residuo, **interrompere** una ripetizione o **salvare** un
   viaggiatore ancora vivo. Il gioco dice sempre quale dei tre casi sta mostrando (§7, indizio E).
8. **Chi resta a guardia di un varco viene dimenticato da chi sta fuori**, un poco alla volta. È il prezzo che pagano
   Claudio, Rosa e (nel finale D) il protagonista.

**In parole semplici: il riconoscimento.** La presenza non può uscire dalla galleria da sola. Deve farsi guardare da
una persona viva che dica «ti conosco, sei tu» e se ne vada con lei. Per questo si traveste da qualcuno che quella
persona conosce. La porta funziona al contrario: Irene la tiene chiusa da dentro, ed è l'unica cosa che ferma la
presenza. Per chiudere la porta per sempre, un vivo deve fare il gesto opposto: **riconoscere Irene** (dire il suo
nome, con la foto che prova chi è) così che lei possa smettere di montare la guardia.
Quindi: **A** = esci dal vero svincolo, da solo. **B** = apri la porta e accompagni la presenza. **C** = riconosci
Irene e chiudi. **D** = resti tu a guardia del varco, così gli altri possono uscire.

---

## 2. Cronologia privata

Anni relativi al presente della storia (anno 0 = la lettera dello studio).

| Anno | Fatto |
| --- | --- |
| −41 | Incidente a catena nel tunnel, poi chiuso. Il luogo comincia a ripetersi. **[P]** |
| −30, −24, −14 | Tre proprietari (*provvisori*: *il ragazzo del Wangan*, *la coppia di Hakone*, *la donna della Route 66*) incontrano la galleria in momenti diversi. Nessuno tornerà intero. |
| −19 | **Claudio e Irene** tornano di notte da una cena, imboccano la galleria. Lei scende dall'auto e va verso una porta (per tenerla chiusa mentre lui esce, ma lui non lo saprà mai). Claudio esce da solo. Irene è data per dispersa. |
| −17 | "Irene" si presenta a casa di Claudio, con ricordi incompleti. Lui l'accetta. **È la presenza.** |
| −16 → −12 | Piccole contraddizioni: un nome, una data. Claudio le corregge lui. |
| −12 | Claudio sviluppa una pellicola dimenticata nel vano portaoggetti. Prima foto: **la sera della galleria, Irene alla porta, di spalle**, mentre lui è fermo in auto. Capisce che la donna a casa non può essere lei. Nasconde la foto. Non la mostra. Non la distrugge. |
| −11 | Comincia a rintracciare gli altri proprietari. Recupera le auto. Tiene Irene (la presenza) con sé, senza dirle di aver capito: ha paura di perderla una seconda volta. |
| −6 | *Rosa* e *Ottavio* entrano insieme. Lei esce, lui resta dentro. Lei resta sulla strada per tornare a prenderlo. |
| −5 | Claudio incontra *Livia*, sorella di Ottavio, e le affida in custodia gli originali (foto, nastri, documenti): **fuori dalla rete**. Scrive il testamento, convinto di poter rendere innocue le auto richiudendo i collegamenti. |
| −4 → −2 | Claudio richiude dall'interno i collegamenti che riesce a raggiungere: lascia cartelli scritti a mano e le **uscite chiuse**. |
| −1 | Ultima scoperta: dentro la galleria vede la vera Irene alla porta, e capisce che è lei a tenere il varco chiuso. Ha il tempo di registrare un nastro, e ne lascia una copia nella radio di ciascuna delle sei auto. Muore di notte, di malore, in un autogrill: ufficialmente una morte naturale. |
| −1 | La presenza perde la maschera di Irene. Torna sulla strada. Dai discorsi di Claudio conosce già un nipote e una sorella, *Elena*. |
| 0 | Lettera dello studio Ferri. Il protagonista eredita e sceglie l'auto. **[A]** |

Il **notaio** esegue un incarico autentico e non sa nulla. **[A]**

---

## 3. Personaggi (nomi provvisori)

### Il protagonista [A]
Senza nome, parla poco, ironia normale. Vuole portare a casa l'auto e nient'altro. Con Claudio si è visto tre volte (un
temperino regalato a una di queste). La paura lo rende prima irritabile, poi attento a particolari che prima ignorava.
Nel ramo più esposto comincia a usare parole e ricordi che non sono suoi.

### *Elena*, sorella minore (contatto di casa) [P]
Vive in città, lavora, ha una giornata vera: un lavoro con orari assurdi, un gatto di nome *Pasta*, un coinquilino
noioso. Lo prende in giro. Usa il soprannome **«Nonno»** per il protagonista (glielo aveva dato Claudio quando lui aveva otto
anni, perché brontolava per tutto). Il protagonista non la chiama in nessun modo particolare: il soprannome è a senso
unico, da lei a lui. Elena lo usa **solo per prenderlo in giro** («Ok, Nonno, calmati»), mai con dolcezza. Claudio,
nel nastro, lo dice **con dolcezza**. Se qualcuno al telefono dice «Nonno» con tenerezza, non è Elena: è chi ha
imparato quella parola da Claudio.
- *Sa:* che il protagonista è a ritirare un'eredità e che sta guidando.
- *Non sa:* della galleria. Non lo sa mai, nemmeno alla fine di A.
- Alcuni dettagli di lei, fissati nelle prime telefonate (il gatto, il turno, il soprannome), servono più avanti per
  distinguere l'Elena vera da un'imitazione.

### *Rosa*, alleata della strada [P]
Cinquant'anni, meccanica, ha un furgone-officina fermo alle aree di sosta. Competente e sboccata, mai crudele.
Insulta quando ha paura. Sa **dove è stata lei**, non dove sei tu.
- *Perché resta:* una promessa. Sei anni fa è entrata nella galleria con Ottavio, un collega rappresentante. Lei è uscita,
  lui no. Ha promesso a Livia di riportarlo. Non c'è ancora riuscita.
- *Errore suo:* ha già lasciato qualcuno dentro. Può rifarlo, per paura.
- Alla fine dà a D il suo motivo: se qualcuno resta a guardia, lei può tornare a casa.

### *Livia*, chi cerca un disperso [P]
Sorella di Ottavio, archivista in un archivio comunale. Sincera, metodica, non infallibile. Tiene in custodia **gli
originali** che Claudio le diede: foto, nastri, documenti. Il suo archivio è **l'unico luogo fuori dalla rete che il
giocatore può sentire attendibile**. Per questo contatta il protagonista quando sente il nome Claudio.
- *Ha verificato:* gli originali, le date, il nome di Ottavio nelle carte di Claudio.
- *Crede soltanto:* che Ottavio sia ancora vivo. Si basa su una telefonata dopo che avevano smesso di cercarlo.

### La presenza [A]
Voce senza nome, all'inizio solo un numero sconosciuto. Imita, prova, sbaglia e impara. Diventa aggressiva quando perde
un vantaggio. Parolacce rare e dure: irritazione, appropriazione, disprezzo. Un po' di ironia fredda all'inizio, che poi
sparisce.

### Claudio, attraverso le tracce [A]
Tre versioni dello stesso uomo, ognuna con una traccia:
- **L'uomo che amava:** il nastro nella radio, il temperino, la grafia.
- **L'uomo che negava:** il diario, la correzione dei nomi, la foto nascosta.
- **L'uomo che rimediava:** i cartelli, le chiusure, l'avvertimento.

### Irene, alla porta [P]
Non parla, non cerca il protagonista. Sorveglia un varco. Le sue apparizioni sembrano ostili finché non si vede che
guarda **oltre** il protagonista, verso l'ingresso della galleria.

### Gli altri cinque proprietari (provvisori)
Servono a sbloccare le altre auto e a dare un posto a ogni luogo della rotta. Ognuno ha una vicenda breve, una traccia
nel luogo e una prova che aggiunge un pezzo al contenimento. Ne scrivo la funzione, non i nomi.

| Luogo | Funzione |
| --- | --- |
| San Gimignano | **L'auto di Claudio** e la sua prima chiusura. Qui c'è il primo cartello scritto a mano. |
| Bassa | **La Volvo V40: l'auto di Ottavio** (un rappresentante: una station wagon da lavoro). L'autogrill dove la ritrovarono. |
| Wangan | Il ragazzo: il primo esempio di una ripetizione con sangue fresco. |
| Hakone | La coppia: la prima porta che si apre dall'esterno. Mostra che si può **richiudere**. |
| Positano | Nessun proprietario: un luogo dove l'uscita cambia paese ma torna al solito svincolo. |
| Route 66 | La donna: la prima a capire cosa vuole la presenza. Ha lasciato una nota. |

---

## 3bis. Le sei auto: ne ritiri una sola

**[A] come scritto dall'autore.** Ti chiamano, ti dicono che nel testamento c'è un'auto per te, arrivi, e il notaio ti
dice che puoi sceglierne **una** tra sei. Il resto è mio.

**[P] Perché una sola.** Una clausola scritta da Claudio nel testamento: *«Una sola. Le altre restano dov'è giusto che
restino.»* Il notaio la legge senza capirla e senza interpretarla.

**[P] Come si gestisce.**
1. **La scelta.** Sei auto sotto un telo, ognuna con un cartellino di una riga scritto a mano (non c'è il nome del
   proprietario). Il protagonista può sollevare un telo, guardare l'interno, e scegliere. Le chiavi arrivano con una busta
   col temperino.
2. **Cosa decide la scelta:** il **primo legame** del viaggio (§3 e tabella sotto), l'ordine di alcuni indizi, l'oggetto
   ordinario che trova nell'auto. La struttura principale è condivisa: nessuna delle sei porta a una storia a parte.
3. **Le altre cinque** finiscono in vendita all'**Autosalone Notte**, dove c'è scritto che erano dello zio (così è già
   deciso nel gioco). Chi ne compra una trova nel vano portaoggetti **l'oggetto del suo vecchio proprietario**: avvia o
   rinforza il filo di quella persona. Così si arriva a ogni legame anche senza averlo scelto all'inizio, e ricomprare
   le cinque diventa anche una piccola indagine.
4. **Nessuna scelta rende un finale impossibile.** Qualunque auto si scelga, la catena principale (Claudio, Irene,
   Livia, l'archivio, la porta) è raggiungibile. Cambia l'ordine e *chi si conosce per primo*.

| Auto (luogo) | Proprietario (provvisorio) | Primo legame se la scegli |
| --- | --- | --- |
| **Volvo V40 SW** (Bassa) | *Ottavio*, rappresentante | Livia e Rosa arrivano presto; l'incursione 3 è più vicina. |
| **Audi 80 Avant** (San Gimignano) | Claudio | Si sente prima il nastro e si trova prima la foto sbiadita. |
| **Fiat Grande Punto** (Wangan) | *il ragazzo del Wangan* | La prima ripetizione con sangue fresco arriva prima. |
| **Opel Corsa** (Hakone) | *la coppia di Hakone* | Si impara presto che una porta si può richiudere. |
| **Volkswagen Polo** (Positano) | *proprietario provvisorio* | Si incontra presto l'uscita che cambia paese e torna allo svincolo. |
| **Fiat Panda** (Route 66) | *la donna della Route 66* | Si legge presto la nota che spiega cosa vuole la presenza. |

Il prologo oggi permette di scegliere una qualsiasi delle sei. Ogni auto porta con sé il proprio oggetto ordinario e
il proprio piccolo avvio di storia: cambia solo da dove si comincia a tirare il filo.

---

## 4. Il telefono come motore

**[P]** Il telefono fa tre cose nuove senza trasformarsi in un sistema pesante.

1. **Archivio «Prove».** Una lista di oggetti: foto, nastri, messaggi, documenti. Ognuno ha una **fonte**: *originale
   (fuori rete)* o *copia (da qui)*. L'etichetta si ricava giocando, non è un cartello tecnico: gli originali
   arrivano da Livia, le copie dal telefono.
2. **Domande di casa.** Quando una persona nota chiama o scrive in modo strano, si può scegliere «Chiedi qualcosa che sa
   solo lei». Tre domande a scelta, basate su cose già dette nei messaggi (il gatto, il turno, il soprannome). La
   risposta giusta cita un dettaglio coerente; l'imitazione ne sbaglia uno **specifico** (per esempio dice «Nonno» con
   dolcezza). Funziona anche a memoria: il giocatore può rileggere i messaggi.
3. **Chiamate come scambi di testo** con suoni semplici originali (squillo, rumore di linea, silenzio). Nessuna voce
   registrata obbligatoria.

Regola di affidabilità (spiegata giocando, non in un cartello): *il telefono mostra una copia; solo un originale fuori
dalla rete è sicuro.* Un identificativo si può imitare. Una verifica vale se usa informazioni o incontri
indipendenti.

---

## 5. Progressione

Le fasi hanno **condizioni**, non chilometri fissi. I chilometri possono comunque essere usati come soglie minime.

**FASE I · L'EREDITÀ.** Scelta dell'auto, prime telefonate con Elena, primi lavori, primi cartelli «SOLO AVANTI». Una
prima anomalia piccola, poi normalità. Il **nastro** di Claudio nella radio (vedi §6): primo avvertimento. Nessun contatto
demoniaco esplicito.
Si chiude quando: il giocatore ha ascoltato il nastro *o* ha letto l'avvertimento da una delle altre due vie (§6) e ha
incontrato almeno una uscita chiusa.

**FASE II · LA DISTANZA IMPOSSIBILE.** La galleria porta in un luogo irraggiungibile in quel tempo. Si chiama Elena e si
verifica con un dettaglio attuale (§11, scena 04). Si incontra Rosa. Primo messaggio dello sconosciuto.
Si chiude quando: la distanza è stata confermata da una persona esterna e Rosa ha aiutato per la prima volta.

**FASE III · I PRECEDENTI VIAGGIATORI.** Oggetti, persone e prove collegano le auto. Per ora sembra un'infestazione
persecutoria. Livia compare. Prima incursione. Prima apparizione della figura alla porta.
Si chiude quando: Livia ha consegnato almeno un originale e la prima incursione è conclusa (anche fallita).

**FASE IV · LE CHIUSURE.** Almeno tre prove indipendenti (cartelli, nastro, un luogo dove una chiusura ostacola
davvero la presenza) fanno capire il contenimento. La presenza spinge per un'apertura specifica, presentandola come un
salvataggio: «Elena» chiama dalla galleria (§11, scena 12). Il giocatore può verificare.
Si chiude quando: il giocatore ha preso una posizione sulla proposta (verificata, ignorata o accettata).

**FASE V · CHI FAR TORNARE.** Seconda incursione, con una persona da riportare. Scelta sul confine: attraversare o
richiudere. Chi ha preso patti o varchi aperti può avere la terza e la quarta. Le condizioni dei finali maturano qui.

---

## 6. L'avvertimento di Claudio

**[P]** Esiste in **tre forme**, così non dipende da un oggetto perso.

1. **Il nastro nella radio dell'auto** (in ognuna delle sei). Una stazione che non conosce nessuno, che si può ascoltare cercando in banda.
   Dura pochi secondi, spezzato in tre battute.
2. **Una frase sul parasole** dell'auto, scritta a mano da Claudio: *«Chiedi una cosa che sa solo lui.»*
3. **Un messaggio dello studio Ferri** a una soglia del viaggio: hanno trovato in un faldone una lettera di Claudio con
   le stesse parole, aggiunta dopo il testamento.

Chiunque ne trovi una ha l'idea. Nessuna delle tre dice **perché**.

Testo del nastro (spezzato in tre):
> **CLAUDIO:** «Se stai ascoltando questo, la macchina è tua e io no. Scusa. Non ho avuto il tempo di sistemare le cose
> per bene.»
> «Una cosa sola, per ora. Se ti chiama qualcuno che conosci e ti chiede una cosa che non faresti mai, non devi capire chi
> è. Devi fermarti e chiedergli qualcosa che sa solo lui.»
> «E se risponde bene, chiediglielo di nuovo domani. Nonno, ti prego.»

Il «Nonno» detto con **dolcezza** serve in seguito: è l'unica volta, e permette di smascherare una presenza che lo ha
imparato da lui (§11, scena 09).

---

## 7. Indizi: prima lettura, seconda lettura, conseguenza giocabile

| | Prima lettura | Seconda lettura | Verifica | Conseguenza giocabile |
| --- | --- | --- | --- | --- |
| **A** Legame con le auto | Oggetti di chi guidava l'auto prima (nella Volvo: il tesserino di Ottavio, caramelle alla menta). Il temperino che il notaio consegna con le chiavi. | Le auto sono di sei viaggiatori, Claudio ne ha raccolte sei. | Documenti di Claudio + Livia che conosce un altro proprietario. | Sblocca la conoscenza dei sei luoghi; Livia compare. |
| **B** Uscite chiuse | Deviazioni, poi prigionia. | Sono state chiuse **da dentro**, a mano, da Claudio. La grafia è la stessa del parasole. | Un cartello nuovo vicino a una chiusura che davvero ostacola la presenza. | La presenza insiste su una chiusura precisa: si può capire quale. |
| **C** Figura alla porta | Una donna aspetta il protagonista per aggredirlo. | Guarda oltre di lui, verso l'ingresso: sorveglia. | Stessa scena vista in un contesto più ampio, e la foto originale. | La porta diventa riconoscibile; apre C. |
| **D** Voce familiare | Elena, o Claudio, è riuscito a raggiungerlo. | Alcuni frammenti sono imitati con **lacune specifiche** (un soprannome usato male). | Domande di casa + un originale di Livia. | Smascherare il contatto cambia l'uso del telefono. |
| **E** Sangue | Qualcuno ha tentato di scappare. | Era tornato indietro **per qualcuno**: Rosa, per Ottavio. | Registrazione + il segno sul lato esterno della porta. | Rende possibile (e leggibile) la terza incursione. |

I tre casi del sangue (§1 regola 7) si distinguono con **colore e posizione**:
- macchia vecchia scura, fuori dalla porta: *residuo* da liberare;
- macchia fresca che cresce mentre si guarda: *ripetizione* da interrompere;
- macchia fresca con un suono dietro la porta: *viaggiatore vivo* da recuperare.

La prova più importante, la foto originale di Irene alla porta, **non sta in un solo posto**: Livia la custodisce, e una
copia sbiadita si trova nel vano portaoggetti dell'auto di Claudio (ma sembra solo un rullino sovraesposto finché non la si
confronta con l'originale).

---

## 8. Scelte ed esposizione

Quattro contatori **separati** (nessuna barra di bontà):
- **Conoscenza:** prove verificate.
- **Legami:** persone aiutate (Rosa, Livia, Marco, Ottavio).
- **Patti:** impegni presi con la presenza.
- **Varchi:** accessi aperti o modificati.

**L'esposizione aumenta con:** incursioni extra, patti mantenuti, restare volontariamente in un'area contaminata,
coinvolgere contatti esterni dopo avvertimenti verificabili.

**L'esposizione non aumenta con:** leggere lentamente, mettere in pausa, chiudere il browser, riparare l'auto, saltare
una chiamata non vista, usare strumenti di accessibilità. **Nessuna penalità per il tempo reale.**

Esposizione visibile (solo come fatti): sangue sempre più presente nella galleria, spazi che si comportano in modo
diverso, e per il ramo più esposto il linguaggio del protagonista (§11, scena 14).

**Le cinque scelte** (rispetto alla 02: invariate nella sostanza, aggiunte conseguenze).

1. **Conservare o consegnare una prova.** Livia la vuole per un motivo valido. Si può darle l'originale o tenere una
   copia. *Conseguenza:* chi consegna avrà una testimone indipendente più avanti; chi conserva ha la prova ma perde Livia
   come alleata finché non la recupera.
2. **Verificare una voce.** «Elena» chiede aiuto con urgenza credibile. *Verificare* costa tempo e un vantaggio (Rosa
   perde un'ora, un cantiere si chiude); *non verificare* non porta al finale peggiore, ma apre un rischio.
3. **Tornare per qualcuno.** Rende disponibile la terza incursione. Il recupero **può riuscire**.
4. **Aprire un varco.** Decisione esplicita, mai implicita. Prima di agire esistono prove per sospettare. Dopo averlo
   aperto, c'è una possibilità (costosa) di richiuderlo.
5. **Il rientro anticipato.** Quando compare l'uscita autentica, lasciare la rete conserva di più il protagonista ma
   interrompe alcune storie.

---

## 9. Le incursioni

Tutte condividono la stessa regola di tempo: **le lampade della galleria si spengono una dopo l'altra**. Quando si
spegne l'ultima, la porta si chiude. Aprire il menu o il telefono **ferma** il tempo. Le comunicazioni durante la guida
sono sottotitoli brevi, mai più di otto parole.

**Fallimento:** rifugio (l'area di sosta di Rosa, o una stanza del motel), scena di uscita alternativa e **una
conseguenza persistente non economica**: un oggetto perso, un contatto che non risponde più, una porta che resta
aperta. L'incursione **non si ripete** come nuova visita.

| # | Nome | Condizione | Obiettivo | Funzione |
| --- | --- | --- | --- | --- |
| 1 | **Il passaggio** | Fase III | Seguire una corsia libera fino alla porta prima che si spenga l'ultima lampada. Rosa guida via radio. | Fiducia in Rosa; primo ordine osservabile del luogo. |
| 2 | **Tornare con qualcuno** | Fase V | Portare fuori *Marco* (provvisorio), viaggiatore vero con l'auto rotta. Prima si decide cosa lasciare indietro (la foto, il nastro, un posto). | Dare un volto a ciò che si rischia di perdere; la presenza prova ad accompagnarsi. |
| 3 | **Recuperare chi è stato lasciato** | Facoltativa: promessa a Rosa/Livia | Arrivare al punto d'attesa **prima** che il percorso cambi. | Rischio scelto, salvataggio possibile. |
| 4 | **Il varco della presenza** | Facoltativa: patto o tentativo deliberato | Raggiungere il confine tenendo la possibilità di scegliere chi attraversa. | Massima compromissione, controllo ancora possibile. |

Le quattro **non sono gare identiche**: la 1 è silenzio e ascolto, la 2 è protezione, la 3 è anticipo, la 4 è scelta.
Le immagini più esplicite stanno nelle ultime due, ma le prime hanno già una loro identità.

**Conflitto risolto.** L'**uscita autentica** compare dopo la **seconda incursione** e dopo almeno tre prove indipendenti
(non serve completare tutte e sei le vicende). Chi sceglie A con meno informazioni riceve un epilogo con una lettera di
Livia che riassume ciò che sa, così il finale breve non lascia senza risposta.

---

## 10. I finali

Il finale si decide nella scena **«L'ultima porta»**, dove sono sempre disponibili quattro azioni tra cui scegliere
(*Esci · Apri · Chiudi · Resta*); alcune risultano grigie con il motivo scritto («Non sai ancora chi sta dietro»).
Il punto di non ritorno è segnalato dal telefono: una chiamata di Elena, vera o no.

**Stato necessario** (valori memorizzati): `uscitaAperta`, `foto`, `portaNota`, `livia`, `ottavioSalvo`, `patti`,
`varchi`, `elenaVerificata`, `incursioni`.

### A · RIENTRO
- **Condizioni:** `uscitaAperta`, nessun accompagnatore, almeno 2 incursioni.
- **Esito:** il protagonista torna solo. Perde alcune storie ma conserva i legami principali.
- **Variante A+:** `ottavioSalvo` → Ottavio telefona a Livia.
- **Epilogo:** una conversazione con Elena procede senza interruzioni. Dove nel viaggio avrebbe fatto una battuta, stavolta
  racconta una cosa vera. Rosa resta sulla strada.

### B1 · OSPITE INCONSAPEVOLE
- **Condizioni:** varco aperto *senza* aver mai verificato Elena (o la voce in cui si riconosce), e almeno tre indizi
  ignorati.
- **Esito:** il ritorno sembra riuscito.
- **Epilogo:** Elena nomina con naturalezza «la zia Irene» e racconta una cena di famiglia. Nessuna Irene c'è mai stata.
  Il protagonista confronta con un originale conservato fuori dalla rete: il rapporto prima non esisteva.

### B2 · OSPITE CONSAPEVOLE
- **Condizioni:** almeno tre prove indipendenti **e** un motivo costruito: `ottavioSalvo` è falso e Rosa o Livia
  sono bloccate dentro, oppure un patto è stato preso per salvare qualcuno. Il protagonista **sa** chi è la presenza.
- **Esito:** apre il varco per far uscire una persona vera e accetta che la presenza esca con lei.
- **Epilogo:** a una cena la presenza ha il posto di Elena (o di un'altra persona cara): il protagonista la guarda
  e **non dice nulla**. Non è una sconfitta cieca, è un prezzo pagato con gli occhi aperti.

### C · CHIUSURA
- **Condizioni:** `foto` (originale), `portaNota`, almeno 2 incursioni, rifiuto del patto e un rapporto con Livia.
- **Meccanica:** davanti alla porta, il protagonista **riconosce Irene** (le dice il nome, con la foto e le prove). È
  la simmetria del §1: la porta si chiude quando un vivo riconosce chi la sorveglia.
- **Esito:** la presenza resta confinata. Alcuni escono (Ottavio, se `ottavioSalvo`), altri no.
- **Epilogo:** la porta resta ferma. Il rumore di mani dall'altra parte si ferma. L'assenza di una voce che il
  giocatore conosceva già mostra chi è uscito e chi è rimasto.

### D · IL VIAGGIO CONTINUA
- **Condizioni:** comprensione del prezzo (un custode viene dimenticato), una persona concreta da far uscire (Rosa o
  Ottavio) e una promessa fatta in un momento comprensibile.
- **Esito:** il protagonista resta a guardia del varco. Rosa torna a casa.
- **Epilogo:** Elena risponde a una chiamata senza riconoscerlo. Lui non insiste. Poco dopo aiuta un nuovo viaggiatore
  con una frase pratica, diversa da quella ricevuta all'inizio. Non diventa la presenza: resta un uomo che ha scelto
  un posto. Poi inizia la guida libera.

**Dopo il finale:** un campo `fine` nel salvataggio memorizza quale finale è stato scelto; la partita può
continuare in guida libera (in D subito, negli altri dopo una schermata).

---

## 11. Dialoghi e scene rifiniti

Nelle scene ho tolto i commenti e lasciato i fatti. I testi a pixel sulla strada, in maiuscolo ASCII, sono a parte.

### Scena 01 · Le condizioni dell'auto
> **ELENA:** «Allora, com'è?»
> **TU:** «Parte.»
> **ELENA:** «Mi dici solo le cose belle?»
> **TU:** «Le ho finite.»

*Pensiero dopo un rumore meccanico:* «Va bene. Un problema alla volta. Questo faccia la fila.»

Con le chiavi il notaio consegna un **temperino**: Claudio lo regalò al protagonista una sera, anni prima, e glielo ha lasciato in una busta. Un pensiero breve, non più di
due righe, e niente di più.

### Scena 02 · Un aiuto concreto (Rosa)
> **ROSA:** «Smettila di accenderla ogni trenta secondi.»
> **TU:** «Controllavo.»
> **ROSA:** «Ho visto. Si ripara con gli attrezzi, non con la fiducia. Passami quello.»
> **TU:** «Questo?»
> **ROSA:** «No. Quello che sto indicando, porca puttana.»

Dopo la riparazione Rosa controlla un dettaglio che il protagonista aveva ignorato (il livello del liquido, un tubo
fesso) e gli evita un altro guaio. La scena non finisce sulla battuta.

### Scena 03 · L'uscita che non arriva
> **ELENA:** «Prendi la prossima e richiamami da fermo.»
> **TU:** «La prossima è chiusa.»
> **ELENA:** «Anche quella dopo?»
> **TU:** «Non lo so ancora.»

Da una sosta, più tardi:
> **ELENA:** «Hai trovato?»
> **TU:** «No.»

Silenzio. Nessun insulto.

### Scena 04 · Una distanza impossibile
Il protagonista manda a Elena la foto di un luogo riconoscibile (non un'apparizione: un luogo vero).
> **ELENA:** «Questa da dove l'hai presa?»
> **TU:** «Sono qui.»
> **ELENA:** «Dai, seriamente.»
> **TU:** «Ti sto chiamando da qui.»

Elena controlla, trova un riferimento attuale del luogo (un manifesto, un negozio) e dice solo: «Ok. Resta lì. Non fare cose.»

### Scena 05 · Il primo messaggio
> **NUMERO SCONOSCIUTO:** «Quella non era una cosa tua.»

Risposte: «Chi sei?» · «Di che cosa parli?» · (niente). La presenza non risponde subito. Poi cita un dettaglio che ha
potuto osservare davvero (l'oggetto toccato): **solo quello**.

### Scena 06 · I colpi nella galleria
Colpi che non seguono il ritmo delle ruote. Si rallenta in un punto sicuro. I colpi continuano.
> **TU** *(pensiero)*: «Non viene dalla macchina.»

Una donna presso una porta guarda oltre l'auto, verso il punto da cui si è arrivati.

### Scena 07 · Livia
> **LIVIA:** «La macchina l'hanno trovata. Lui no.»
> **TU:** «E tu pensi che sia ancora lì?»
> **LIVIA:** «Penso che quando mi ha chiamato sapesse ancora chi ero.»
> **TU:** «Quando?»
> **LIVIA:** «Dopo che avevano smesso di cercarlo.»

Livia ha un nastro. Non lo fa solo ascoltare: chiede di andare con lei a controllare una sosta dove Ottavio ha lasciato
un oggetto.

### Scena 08 · Il passaggio (prima incursione)
> **ROSA:** «Mi senti?»
> **TU:** «Sì.»
> **ROSA:** «Dimmi cosa hai davanti.»
> **TU:** «Una corsia libera. Le altre sono ferme.»
> **ROSA:** «Resta su quella.»
> **TU:** «Sai dove sono?»
> **ROSA:** «So dov'ero io. Tu guarda avanti.»

Più avanti, un'auto con lo sportello aperto e nessuno al volante:
> **TU:** «Quella macchina è vuota.»
> **ROSA:** «Lasciala andare. Non ti fermare anche per lei, cazzo.»

### Scena 09 · L'imitazione
Prima: le telefonate vere con Elena hanno fissato un uso: **«Nonno» detto per prenderlo in giro**, mai con affetto. Il
nastro di Claudio ha il «Nonno» **detto con dolcezza**.
> **ELENA?:** «Nonno, torna a casa.»
> **TU:** «Perché mi hai chiamato così?»
> **ELENA?:** «Ti dà fastidio adesso?»
> **TU:** «Non era una risposta.»

Il giocatore può confrontare con una domanda di casa o con l'originale di Livia: quel tono **non è di Elena**, è di Claudio.
La presenza l'ha imparato da lui.

### Scena 10 · Il sangue e la porta
Una registrazione mostra che Rosa, dopo essersi messa in salvo, tornò alla porta per recuperare chi aveva lasciato dentro.
I segni sul lato esterno sono di quel tentativo.
> **TU:** «Era già uscita.»
> **LIVIA:** «Sì.»
> **TU:** «Allora perché è tornata?»

La risposta è un nome già conosciuto: Ottavio. Durante la ripetizione la persona dietro la porta può essere un residuo
oppure un viaggiatore vivo (e il sangue lo dice, §7).

### Scena 11 · Un frammento di Claudio
> **CLAUDIO** *(registrazione)*: «All'inizio erano cose piccole. Una parola, una data. Le correggevo io. Mi sembrava
> normale farlo.»
> *(pausa)*
> «Poi ho trovato la prima foto. E l'ho nascosta. Non perché non capissi.»

Si lega alla foto del rullino. Il giocatore capisce che lui ha scelto di non vedere.

### Scena 12 · «Elena» chiama dalla galleria
Fase IV. La presenza sfrutta la voce di Elena, ma con una **lacuna**: dice di essere ferma «in galleria» con un'auto che
Elena non ha.
> **ELENA?:** «Sono nella galleria. Ti prego, vieni a prendermi.»
> **TU:** «Dimmi cosa hai mangiato ieri sera.»
> **ELENA?:** «Non è il momento.»
> **TU:** «È l'unico momento.»

Il giocatore può verificare con una chiamata a un vicino di casa di Elena (indipendente) o con le domande di casa. Se
non verifica, la scena non assegna alcun finale: apre solo il rischio.

### Scena 13 · La presenza perde la pazienza
Dopo un rifiuto motivato.
> **TU:** «Tu non sei lei.»
> **PRESENZA:** «Finché ti servivo non facevi tutte queste domande.»
> **TU:** «Non ti porto fuori.»
> **PRESENZA:** «Apri quella porta, pezzo di merda.»

La porta è quella di Irene, e la presenza **non può aprirla da sola**. Se il giocatore rifiuta, la presenza cambia
tattica: usa un contatto compromesso (**Marco**, **Zio Claudio** nel telefono) o prova un altro accesso. L'aggressione
diretta resta **rara**.

### Scena 14 · Umorismo, quando si torna a respirare
> **ROSA:** «Sei ferito?»
> **TU:** «Non credo.»
> **ROSA:** «Controlla, porca miseria. La macchina la vedo da qui. Tu mi devi rispondere.»

Dopo il controllo:
> **TU:** «L'auto?»
> **ROSA:** «Quella invece adesso mi insulta quando apro il cofano.»

Se nella scena prima è morto qualcuno, **niente battuta**.

### Scena 15 · Il linguaggio si contamina (ramo esposto)
Il protagonista dice una frase di Claudio, senza saperlo.
> **ELENA:** «Questa da quando la dici?»
> **TU:** «Cosa?»
> **ELENA:** *(ripete)*
> **TU:** «Non lo so.»

Un originale di Livia mostra che quella frase è di Claudio. I comandi non cambiano.

### Scena 16 · Il frammento di Irene (nuova)
Il giocatore sa già, da A e C, che c'è una donna alla porta. Con la foto originale e il nome, la porta mostra per la prima
volta il viso: lei si volta verso di lui.
> **TU:** «Irene.»

Non risponde. Per un secondo smette di guardare l'ingresso.

### Scena 17 · «L'ultima porta» (nuova)
Il telefono squilla. Elena. Il giocatore non sa se è lei.
> **ELENA:** «Sei ancora lì?»
> **TU:** *(sceglie una domanda di casa o no)*

Dopo la risposta, le quattro azioni: **Esci · Apri · Chiudi · Resta**. Ognuna ha il motivo scritto se è grigia.

---

## 12. Funzioni nuove: indispensabili e versione semplice

Ho controllato nel codice cosa esiste. **Verificato:**
- **Esistono:** `TEL_SMS` (messaggi per km), `window.telefono.ring/sms`, `game.vgThink` (pensieri), `VG_ODD` con
  `once`, `need`, `minStops`, effetti `sign`, `cippo`, `parked`, `twin`, `ghost`, `glitch`, `gives`, i prompt `ask`.
- **Non esistono:** stato delle scelte, eventi obbligatori per condizione, archivio prove, domande di casa, incursioni a
  tempo, sangue a gradi, scene finali.

| # | Funzione | Serve a | Versione semplice |
| --- | --- | --- | --- |
| 1 | **Stato della storia** (`game.s.vg.story`: contatori e flag) | tutto | Oggetto con booleani e quattro numeri, salvato col resto. |
| 2 | **Momenti garantiti** (`STORY_BEATS`) | Fasi, scene, avvertimento | Tabella con condizioni (km minimi + flag + tappa), controllata ogni secondo, scatta una volta. Usa `ask`, `vgThink` e `telefono.sms`. Oggi gli eventi sono casuali e non possono garantire una scena. |
| 3 | **Nastro nella radio** | avvertimento | Una stazione in `radio.js` con righe in sottotitolo. Alternativa: messaggio sul telefono. |
| 4 | **App «Prove»** | indizi e verifica | Lista testuale con etichetta *originale* / *copia*. |
| 5 | **Domande di casa** | smascherare | Scelta a tre risposte, scritta a mano per ogni scena. |
| 6 | **Sangue a gradi** | indizio E | In `galleria2d.js`: macchie dello stesso disegno in posizioni fisse (`Street2D.rnd`), 3 livelli di scurezza e uno "fresco". |
| 7 | **Figura alla porta** | indizio C | Disegno fisso sul lato della galleria a punti noti, in pixel art. |
| 8 | **Svincolo che ritorna** | uscite chiuse | Cartello «CHIUSO» più uno svincolo con cartello fisso; l'uscita riporta al km noto. |
| 9 | **Incursioni** | gameplay nuovo | Tratto di guida con lampade che si spengono; usa traffico e `ghost` già esistenti; il menu **ferma** il tempo. |
| 10 | **Scene dei finali** | finali | Stile del prologo: tela 640×360 con testo HTML sopra. |
| 11 | **Dopo il finale** | guida libera | Campo `fine` nel salvataggio e ritorno al gioco. |

Con il consenso del proprietario le implementerò quando decidi di cominciare: dichiaro che finora **non è fatto nulla**.

---

## 13. Da approvare e da verificare

**Decisioni che cambiano identità o tono (le sottopongo, poche):**
1. **Irene.** La persona tornata con Claudio era la presenza e la vera Irene è la figura alla porta. (§0, §2)
2. **Elena è la sorella.** Con il soprannome «Nonno», che serve da prova. (§3)
3. **Il finale Ospite doppio.** (§10)
4. **Le sei auto e i sei proprietari** (§3bis): quale auto va a quale proprietario è una mia proposta.

**Non verificato nel codice:** se il menu di pausa ferma davvero i timer del gioco; se l'oggetto del vecchio proprietario nel vano portaoggetti delle auto comprate all'Autosalone (da inserire nelle
schede delle auto, non ancora verificato); il comportamento della vendita delle auto con gli oggetti di storia (la V40 risulta
«non in vendita»); la capacità dell'app Foto di reggere la scena 04; la resa di sangue e volti in 2D a 720 righe.

**Da calibrare giocando:** durata delle incursioni, numero di lampade, lunghezza dei sottotitoli, tempo delle pause.
