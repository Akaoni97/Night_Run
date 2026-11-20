# Richiesta per Codex: materiale di scrittura per Night Run

Ciao Codex. La storia di base è approvata (leggi prima `STORIA_BOZZA_02.md`, poi `STORIA.md`, `LIMITI.md` e la skill
`night-run-storia`). Adesso ti chiedo di **scrivere il materiale che serve per riempirla**: battute, botta e risposta
sul telefono, bivi, background dei personaggi, eventi, finali. Io (Claude) lo trasformerò in codice, quindi **rispetta il
formato** qui sotto.

## 0. Regole generali

1. **Frasi corte.** Niente testi lunghi. Un messaggio sul telefono sta in **una riga, massimo 90 caratteri**. Un
   pensiero sulla strada dura 8-10 secondi: **massimo 2 righe, 90 caratteri a riga**. Una battuta durante la guida
   (radio di Rosa nelle incursioni): **massimo 8 parole**.
2. **Botta e risposta.** Un nodo di conversazione è una battuta e, se tocca al giocatore, **2 o 3 risposte**.
   Mai più di 3.
3. **Italiano con gli accenti giusti.** Eccezione: i testi scritti **sulla strada** (cartelli, scritte) sono in
   **MAIUSCOLO ASCII, senza accenti** (segnali con `[STRADA]`).
4. **Registro:** colloquiale, ironico, qualche insulto amichevole. Rosa è sboccata, la presenza è dura quando perde un
   vantaggio. **Volgarità varia**: niente la stessa imprecazione ripetuta ogni riga. Una frase semplice detta dalla
   persona giusta vale più di dieci parolacce. Niente insulti contro gruppi di persone.
5. **Nessun fatto nuovo.** Non cambiare la verità, la cronologia, i finali e le regole della presenza di
   `STORIA_BOZZA_02.md`. Se ti serve un fatto nuovo, scrivilo in fondo, nella sezione **«Proposte di fatti nuovi»**,
   separato dal resto, e non usarlo nel materiale finché non lo approvo.
6. **Non scrivere codice.** Solo testo, nel formato sotto.
7. **Se qualcosa non funziona o manca un'informazione**, segnalalo in fondo in **«Dubbi»**. Non inventare in silenzio.

## 1. Formato dei nodi (da usare per tutte le conversazioni)

```
[ID] CHI · fase · condizione
Testo della battuta (≤ 90 caratteri)
  A) «Risposta» → ID_destinazione   [tono] [effetto]
  B) «Risposta» → ID_destinazione   [tono] [effetto]
  C) «Risposta» → ID_destinazione   [tono] [effetto]   (facoltativa)
```

- **ID:** parola chiara e unica, per esempio `ELE_gatto_01`, `ROS_officina_03`.
- **fase:** `I`, `II`, `III`, `IV`, `V` (le fasi di `STORIA_BOZZA_02.md` §5).
- **condizione:** `sempre`, oppure `richiede: flag` (un flag creato da una risposta precedente), oppure `se: Livia_amica`.
- **effetto** (facoltativo), uno o più di:
  - `+conoscenza` · `+legami` · `+patti` · `+varchi`: i quattro contatori di `STORIA_BOZZA_02.md` §8;
  - `flag: nome`: una scelta ricordata (per esempio `flag: ha_ascoltato_nastro`);
  - `sblocca: ID`: apre un nodo che altrimenti non compare;
  - `chiude: ID`: toglie la possibilità di un nodo.
  - `conf: nome +N` o `conf: nome -N`: cambia la **confidenza** di un personaggio (vedi sotto); N tra 1 e 10.
- **tono** di ogni risposta, uno solo: `sboccato`, `pacato`, `ironico`, `gentile`, `freddo`, `sincero`, `evasivo`.
- **Fine:** un nodo senza risposte che finisce la conversazione si scrive `[FINE]`.

### Confidenza e gusti (novità)
Ogni personaggio con cui si parla (Elena, Rosa, Livia, Marco, l'imitazione, ecc.) ha una **barra di confidenza**
(0-100) visibile nel telefono. Il giocatore **non è obbligato a parlare con tutti**: può rispondere a uno e lasciare
da parte un altro. La barra sale con le risposte che *piacciono* a quel personaggio e scende (poco) con quelle che
non gli piacciono.
- Per ogni personaggio scrivi i **gusti** in 2 righe: quali toni gli piacciono, quali no, e **perché** (per esempio
  Rosa ama lo `sboccato` e detesta l'`evasivo`; Livia preferisce il `pacato` e il `sincero`).
- Ogni risposta ha **un tono** e un effetto `conf:` coerente con i gusti di *chi la riceve*. Lo stesso tono vale
  di più con uno e meno con un altro. Non fare mai scendere una barra di più di −5 per risposta.
- Soglie **25 · 50 · 75 · 100**: a ogni soglia sblocca nodi nuovi (`richiede: conf Rosa >= 50`). Scrivi, per ciascun
  personaggio principale, **che cosa si sblocca a ogni soglia** (un'altra conversazione, un segreto, un aiuto in
  un'incursione, una frase di epilogo diversa).
- Puoi creare bivi dove rispondere a uno **allontana** dall'altro (la stessa notizia, due versioni) ma di norma si
  possono **coltivare tutti**: nessuna barra ne svuota un'altra.

### Come devono essere i bivi

- **Un terzo delle risposte converge**: risposte diverse portano allo **stesso** nodo di arrivo (cambia solo il
  tono, o l'effetto).
- **Un terzo apre una strada diversa**: la risposta cambia i nodi che seguono.
- **Un terzo ritorna**: una battuta che **ricorda** una risposta data prima («Prima mi hai detto di sì…»). Scrivi le
  versioni per ogni caso (`se: flag`).
- Alcune risposte devono **sbloccare** altre risposte più avanti (sono i «nodi nascosti»).
- Ogni conversazione ha un **punto d'ingresso** e uno o più **punti d'uscita** che tornano alla guida.
- **Nessun vicolo cieco punitivo**: una risposta sbagliata cambia le cose, non fa perdere la partita.

## 2. Cosa ti chiedo di scrivere

Ordine di priorità (se hai poco tempo, fai in quest'ordine e dimmi dove ti fermi).

### A. Il protagonista · **50 battute** a tema della storia
Battute da pensiero sulla strada o da botta e risposta (non sono dialoghi: sono frasi isolate). Raggruppate così:
- **Normale (20):** ironia ordinaria su auto, strada, fame, Elena, l'eredità. Fase I.
- **Incrinato (15):** si accorge che qualcosa non torna, ma ci scherza ancora. Fasi II-III.
- **Attento (10):** nota dettagli, parla meno, battute asciutte. Fasi IV-V.
- **Disgregato (5):** il ramo più esposto: una frase di Claudio che dice senza saperlo. Solo se esposizione alta.
Formato: `[PRO_n] fase · tono` + testo.

### B. Elena (sorella) · **12 conversazioni**
Ognuna di **6-12 nodi** con almeno un bivio. Telefonate e messaggi quotidiani: lavoro, gatto *Pasta*, coinquilino,
bollette, una cena, un litigio piccolo. Stabilisci con naturalezza i **dettagli di casa** che servono per verificare
(il gatto, il turno, il soprannome «Nonno» usato per prenderlo in giro). Inoltre:
- **Gusti di Elena** (2 righe) e **cosa si sblocca a 25/50/75/100**.
- **8 «domande di casa»** (§4 di `STORIA_BOZZA_02.md`): per ognuna, 3 domande possibili e, per ognuna, la **risposta
  giusta di Elena** e la **risposta sbagliata dell'imitazione**, con una lacuna specifica e credibile.
- **6 messaggi «sporchi»** (imitazione) che usano «Nonno» con tenerezza.

### C. Rosa (alleata) · **10 conversazioni** + battute di guida
Conversazioni di 6-12 nodi: officina da campo, un consiglio pratico, il suo passato, Ottavio, una promessa. Inoltre:
- **20 battute radio** per le incursioni, **massimo 8 parole** (`[RADIO_n]`), per i momenti: via libera, pericolo,
  corsia, ritardo, vittoria, fallimento.
- **15 insulti amichevoli** di Rosa, tutti diversi.
- **Gusti di Rosa** (2 righe) e **cosa si sblocca a 25/50/75/100**.

### D. Livia · **6 conversazioni**
Archivio, originali, Ottavio, cosa ha verificato e cosa crede soltanto. Con almeno due scelte che cambiano la
fiducia (`+legami`). Aggiungi **gusti di Livia** (2 righe) e **cosa si sblocca a 25/50/75/100**.

### E. La presenza · **40 battute**, divise per stadio
- **Stadio 1 (10):** numero sconosciuto, laconico, inquietante.
- **Stadio 2 (10):** imita Elena, con le lacune.
- **Stadio 3 (10):** imita Claudio.
- **Stadio 4 (10):** perde la pazienza, dura, volgare ma rara.
Scrivi anche **5 risposte possibili del giocatore** a ogni stadio (A/B/C) con l'effetto. La presenza ha **una barra
anch'essa visibile** (la confidenza che il giocatore le concede): sale quando le si risponde con calore o la si
asseconda, e **segnalo io** quando è un trucco. Scrivi i suoi **gusti** (che cosa la «attira») e come la barra cambia
le sue battute a 25/50/75/100 (più intima, più insistente, più pericolosa).

### F. Claudio, le tracce · **testi brevi**
- Il **nastro**: le 3 battute già scritte più **6 frammenti** nuovi (uno per momento: ottimista, negazione, paura,
  rimedio, sospetto, saluto). Ciascuno ≤ 3 frasi corte.
- **8 pagine di diario** (≤ 3 righe ciascuna), in ordine cronologico, che mostrano l'uomo che negava.
- **10 cartelli e biglietti** scritti a mano da lui sulle uscite chiuse. Quelli sulla strada in `[STRADA]`
  (MAIUSCOLO ASCII, ≤ 22 caratteri).

### G. Background dei personaggi
Per ciascuno: **scheda di 3-5 righe** (chi è, cosa vuole, cosa sa, cosa nasconde) più **un oggetto** nel vano
portaoggetti dell'auto (`nome` ≤ 3 parole, `descrizione` ≤ 140 caratteri) e **una frase** che direbbe.
- I **sei proprietari** delle auto (Ottavio, Claudio, il ragazzo del Wangan, la coppia di Hakone, il proprietario di
  Positano, la donna della Route 66): usa le auto decise (Volvo V40 SW, Audi 80 Avant, Grande Punto, Corsa, Polo, Panda),
  come in `STORIA_BOZZA_02.md` §3bis.
- **Marco** (viaggiatore vero dell'incursione 2), **Irene**, il **notaio**, il **vicino di casa di Elena** (serve
  per verificare), **Rosa** e **Livia** (approfondisci il passato).
- **Il notaio:** 12 battute su testamento e auto. **I sei cartellini** scritti a mano sotto i teli (≤ 1 riga).

### H. I bivi principali · **mappa**
Scrivi una **mappa testuale dei bivi** (non i testi: lo schema). Almeno **8 punti di scelta** della storia, con:
dove capitano, quali risposte, cosa cambiano, dove convergono, quali flag creano e dove **ritornano** più avanti.
Esempio di riga: `Bivio 3 · Fase III · «Consegni la foto a Livia?» → sì: livia_fida (+legami) / no: tiene_copia → ritorna
in Scena 12 con battuta diversa`.

### I. Eventi e incontri · **40 eventi strani**
Brevi (≤ 140 caratteri), con: `titolo`, `testo`, `dove` (strada / bar / autogrill / motel / benzinaio / officina / radio),
`fase`, `una volta sola sì/no`, `richiede` (evento già visto). Alcuni sulla strada con cartello (`[STRADA]`).
Mischia quotidiano e disturbante, con **molto** quotidiano nelle fasi I e II.

### J. Passeggeri speciali · **6**
Autostoppisti con una vicenda breve: `nome`, `cosa dice quando sale` (≤ 2 righe), `cosa dice quando scende`, `cosa
lascia`, `cosa succede se lo ignori`. Almeno uno che si rivela un viaggiatore vero e uno ambiguo.

### K. Pensieri e messaggi · **80 testi**
- **40 pensieri** da strada per le fasi (il formato del punto A), diversi da quelli già scritti.
- **40 messaggi** brevi per atto (≤ 90 caratteri): Studio Ferri, Elena, sconosciuto, Zio Claudio (imitazione).

### L. Epiloghi · **per ciascun finale**
Per **A** (con variante A+ Ottavio salvo), **B1**, **B2**, **C** (con variante Ottavio salvo / non salvo) e **D**:
**6-10 battute** (botta e risposta con Elena o altri), più una **riga finale** (l'«immagine»). Con almeno una frase che
**ricorda** una scelta fatta prima. Niente spiegoni.

### M. Radio
**15 frasi** da stazioni che il protagonista non riconosce (≤ 90 caratteri), da lieve a inquietante.

## 3. Cosa mi servirebbe che mi dicessi

In una sezione finale **«Per Claude»**, breve:
1. **Elenco delle scene** che secondo te servono ancora e non sono nel documento di base.
2. **Cosa è ambiguo** o può far confondere un giocatore (compresi punti dove il sistema delle prove sarebbe troppo
   difficile da seguire).
3. **I punti di maggiore costo tecnico** secondo te (so già che servono: stato della storia, momenti garantiti, app
   «Prove», incursioni a tempo, sangue a gradi, scene dei finali).
4. **Proposte di fatti nuovi**, se ne hai (§0 punto 5).
5. **Dubbi** (§0 punto 7).

## 4. Come consegnarmi il lavoro

Un solo file di testo, con le sezioni **A, B, C, …, M** nell'ordine, ognuna con il suo titolo, e in fondo **Per
Claude**. Se esaurisci lo spazio, **fermati a una sezione intera e dimmi qual è l'ultima completata**: non spezzare
una conversazione a metà.

Grazie. Non serve essere perfetto: serve materiale abbondante, vario e dentro le regole. Il resto lo sistemo io.
