# Come pubblicare Night Run: The Last Highway

Scritto il 19/11/2026 su richiesta del cognato. È il percorso scelto per trasformare il gioco da pagina web a gioco
da installare (e, un domani, da vendere su Steam). Le questioni legali (nome, marchi delle auto, musica fatta con
Gemini, crediti) stanno in [`LICENZE.md`](../../LICENZE.md): vanno sistemate prima di vendere, qualunque sia il percorso.
**Da decidere insieme al proprietario**: questo è un piano, non è ancora partito niente.

## In breve

- **Electron**: il gioco resta com'è (HTML + JavaScript) e viene chiuso dentro un programma per Windows (e volendo Linux
  e Mac). Non si riscrive niente: si aggiunge un "guscio" e si sistemano tre o quattro cose.
- **Costo**: zero per fare il programma e girarlo agli amici. L'unica spesa è Steam (100 dollari per gioco, che tornano
  indietro quando il gioco incassa 1.000 dollari). C'è anche itch.io, dove pubblicare è gratis.
- **Godot o altri motori**: scartati per ora. Vorrebbe dire riscrivere tutto, compreso il motore audio sintetizzato e la
  fisica: mesi di lavoro per arrivare allo stesso gioco.

## Cos'è Electron, detto semplice

Oggi il gioco gira dentro Chrome (o un altro browser), come una pagina. Electron è un programma che ha **dentro** il suo
Chrome personale, solo per il gioco: niente barra degli indirizzi, niente schede, niente internet. Per il giocatore è un
gioco come gli altri: lo installa, fa doppio clic sull'icona, si apre a schermo intero.

Il codice che scriviamo oggi è lo stesso che gira lì dentro. Per questo **non va riscritto**: quello che funziona nel
browser funziona anche lì, perché il motore è lo stesso. Così sono usciti su Steam diversi giochi fatti in HTML e
JavaScript.

Alternative valutate:
| Strada | Pro | Contro | Verdetto |
| --- | --- | --- | --- |
| **Electron** | Stesso Chrome di oggi, versione bloccata: zero sorprese. Molto usato, tanta documentazione. Libreria pronta per Steam (`steamworks.js`). | Il programma pesa 150-200 MB (si porta dietro Chrome). | **Scelta** |
| Tauri | Programma leggero (pochi MB). | Usa il browser già installato sul computer: su Windows va bene, su Linux e Mac è un altro motore e l'audio (AudioWorklet) potrebbe comportarsi diversamente. | Forse più avanti |
| NW.js | Simile a Electron. | Meno usato, meno aiuto in giro. | No |
| Godot, Unity | Motori "veri", editor visuale, console. | Si riscrive tutto da zero, in un altro linguaggio. | No, per ora |

## Cosa migliora davvero con Electron (esempi sulla stabilità)

La parola "stabilità" qui vuol dire: **il gioco si comporta sempre allo stesso modo, sul computer di chiunque, anche tra
un anno**. Nel browser tante cose non dipendono da noi. Esempi concreti, presi dal nostro gioco:

1. **Gli aggiornamenti di Chrome.** Chrome si aggiorna da solo ogni poche settimane. Se un giorno cambia come funziona
   l'audio (per esempio le regole sull'audio che parte da solo, o l'AudioWorklet dove gira `dsp.js`), il motore della
   macchina può restare muto finché qualcuno non se ne accorge e lo sistema. Dentro Electron la versione di Chrome la
   scegliamo noi e resta quella finché non decidiamo di cambiarla, dopo averla provata.
2. **I salvataggi.** Oggi il viaggio è salvato nella memoria del browser (`localStorage`). Basta che il giocatore faccia
   "cancella dati di navigazione", usi la finestra in incognito o un programma di pulizia, e la partita sparisce. Con
   Electron il salvataggio diventa un file vero nella cartella del gioco o in Documenti, con una copia di riserva.
3. **Quando cambi scheda o finestra.** Il browser rallenta apposta le pagine che non sono in primo piano (i timer vanno a
   un colpo al secondo): se il giocatore passa un attimo a un'altra finestra, al ritorno il gioco può dare uno scatto o
   saltare dei pezzi. In Electron questo rallentamento si spegne.
4. **Le estensioni del browser.** Bloccatori di pubblicità, traduttore automatico, gestori di password: lavorano dentro
   la pagina. Il traduttore di Chrome, per dire, può tradurre i testi del gioco o rompere le scritte. In Electron non ce
   ne sono.
5. **Internet.** Oggi three.js (vista 3D) e i caratteri arrivano da internet (jsdelivr e Google Fonts). Senza connessione,
   o se quei server hanno un problema, la vista 3D non parte e le scritte cambiano carattere. Nel programma tutto sta
   dentro la cartella del gioco. (Mettere i caratteri dentro serve anche per la privacy: vedi `LICENZE.md`, punto 7.)
6. **Tasti del browser.** Nel browser F5 ricarica la pagina (e perdi quello che non è salvato), Ctrl+W chiude la scheda,
   Esc esce dallo schermo intero, Backspace a volte torna indietro. In Electron questi tasti li decidiamo noi.
7. **La memoria.** Un browser con trenta schede aperte si divide la memoria tra tutte. Il gioco in Electron è un programma
   suo, con la memoria tutta per sé.

**Cosa Electron NON migliora** (va detto, per non illudersi):
- **I nostri errori nel codice.** Un errore resta un errore anche lì dentro. La stabilità del codice viene dai test (oggi
  sono 175), dalle prove nel browser e dall'ordine: `index.html` è enorme e tanti file si agganciano uno sopra l'altro.
  Sistemare questo a poco a poco conta più di qualunque piattaforma.
- **La velocità del disegno.** Il 2D oggi lo disegna il processore, un rettangolino alla volta (canvas 2D). Se un giorno
  aggiungiamo tantissimi effetti e il gioco rallenta, la cura è far disegnare la scheda video (WebGL, per esempio con la
  libreria PixiJS), un pezzo alla volta e sempre senza riscrivere il resto. Vale uguale nel browser e in Electron.

## Il percorso, passo per passo

| Passo | Cosa si fa | Costo |
| --- | --- | --- |
| 0 | Decidere insieme (proprietario e cognato) e sistemare le cose di `LICENZE.md` che servono per vendere. | 0 |
| 1 | Preparare il gioco: caratteri e three.js dentro il repository invece che da internet; il gioco deve partire anche senza connessione. Serve comunque, anche restando sul web. | 0 |
| 2 | Il guscio Electron in una cartella a parte (per esempio `desktop/`): un file che apre la finestra a schermo intero e carica `index.html`. npm e i pacchetti stanno **solo** lì: il gioco resta senza npm, come dice `AGENTS.md`. | 0 |
| 3 | Salvataggi su file (al posto di `localStorage`, con la copia di riserva), tasti del browser spenti, niente rallentamento in secondo piano. | 0 |
| 4 | Costruire l'eseguibile per Windows (`electron-builder`, gratis) e provarlo sui vostri PC e su quelli di qualche amico. Windows mostrerà "app non riconosciuta": si va avanti con "Esegui comunque". Toglierlo vorrebbe un certificato di firma a pagamento: non serve. | 0 |
| 5 | Facoltativo: pubblicarlo su itch.io (gratis) come prova, anche a prezzo libero. | 0 |
| 6 | Steam: account Steamworks, Steam Direct, pagina del negozio con immagini e trailer (il teaser c'è già), modulo sui contenuti fatti con l'IA, traguardi collegati a quelli del gioco con `steamworks.js`, periodo "in arrivo" prima dell'uscita. | 100 dollari per gioco, recuperati a 1.000 dollari di incassi; poi Steam tiene il 30 % delle vendite |

Lavoro stimato per i passi 1-4: un paio di sessioni con Claude. Il passo 6 è soprattutto burocrazia e materiale per la
pagina (testi, immagini, video).

## Costi, controllati il 19/11/2026

- Electron, electron-builder, steamworks.js: gratis (programmi liberi).
- Steam Direct: 100 dollari per ogni gioco, non rimborsabili, ma recuperati quando il gioco arriva a 1.000 dollari di
  incassi; niente costi fissi per server o banda. Fonte: [Steamworks, Steam Direct Fee](https://partner.steamgames.com/doc/gettingstarted/appfee).
- Quota di Steam sulle vendite: 30 % (scende sopra i 10 milioni di dollari di incassi).
- itch.io: pubblicare è gratis e la percentuale che tengono la sceglie chi pubblica (da ricontrollare quando servirà).
- Certificato per firmare l'eseguibile su Windows: a pagamento, facoltativo, non serve per Steam.

## Collegamenti

- Questioni legali e crediti: [`LICENZE.md`](../../LICENZE.md).
- Regole del progetto (niente npm nel gioco, il gioco è pensato per il PC): [`AGENTS.md`](../../AGENTS.md).
