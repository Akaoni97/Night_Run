# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `- [area] cosa · perché conta · (da chi / chi decide)`.

Aggiornata il 20/11/2026 sera (check completo del gioco, 43/55, col proprietario).

## Da decidere insieme
- [motori] **Vendere la V40 coi pezzi di Nico montati**: oggi i pezzi se ne vanno con l'auto. Tornano in magazzino o
  alzano il valore dell'auto all'Autosalone e allo sfascio? (cognato)
- [motori] **Estendere i pezzi singoli alle altre auto** (oggi solo la V40, `MOT_SERIE` in `pistone/motori.js`). Per
  ogni auto serve il suo motore di serie descritto coi pezzi di Nico. La Supra resta col suo catalogo. Quando? (cognato)
- [motori] **Il vecchio Pistone**: facciata, interno con Nico e pannello del progetto sono ancora in
  `pistone/motori2d.js` ma non si usano più. Cancellarli o riusarli per la scena di Nico da Luca? (cognato)
- [personaggi] **Nico**: storia stasera. Non ha ancora un disegno nell'interno di Luca (c'è solo Luca); nel vecchio
  Pistone era Ottone (vecchio coi baffi bianchi). Aspetto, carattere, come si sblocca. (cognato)
- [personaggi] **Mario** al posto di Niko (officina dei tagliandi): nome cambiato in tutti i testi, lettera O sulla
  mappa, M sulla tuta. Va bene al proprietario? (proprietario)
- [menu] **Il resto delle idee sul menu** (proposte il 20/11, fatte solo Impostazioni e meteo): pausa a due livelli
  (Riprendi, Mappa, Garage, Officina, Impostazioni, Esci), sfondo vivo dietro il menu, controller e menu da tastiera,
  garage vero con le auto in fila, diario di viaggio con mappa e foto, confronto prima/dopo sui pezzi, salvataggi a
  tre slot. Quali e in che ordine? (proprietario)
- [meteo] **Il vento spinge davvero?** Oggi le raffiche fanno sbandare l'auto solo nel disegno (corsie, urti e
  traffico non cambiano). Se deve spingere davvero, serve tenere il volante. (proprietario)
- [meteo] **Neve e nebbia anche in città?** Oggi in «dinamico» in città non arriva niente (restano pioggia e neon);
  scelte a mano dal menu ci sono dappertutto. (tutti e due)
- [storia] **Testi segnaposto ancora nel gioco**: pensieri del protagonista (`pensieri.js`), testi del prologo
  (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D (`STORIA_EPI` in `storia.js`, scritti da Claude). Chi li riscrive e
  quando? (cognato, la storia è sua)
- [avvisi] In `AVVISI.md` c'è ancora l'avviso del 3D tolto per il cognato: il cognato deve dire che l'ha letto, poi si
  toglie. (cognato)

## Da provare giocando (sul PC)
- [motori] **Prezzi**: livelli di Nico € 300 / 900 / 2.400 con km e pezzi montati; una V40 sui 200 CV costa circa
  € 7.000. Troppo, poco? (tutti e due)
- [motori] **Suono** della V40 col turbo di Nico e dei motori costruiti montati in strada: va ascoltato. (proprietario)
- [motori] **Calore**: sopra i ~480 CV nessun radiatore regge il gas pieno a lungo, si va in protezione (voluto, è
  fisica vera). In coda dopo una tirata l'acqua resta alta; da fermi un motore sano non bolle (scelta: niente guasti
  finti). Da sentire se è giusto così. (cognato)
- [meteo] **Nebbia di notte**: si vede abbastanza per guidare? E il fruscio del vento (fatto senza poterlo
  ascoltare). (proprietario)
- [locali] **Entrata coi posti auto e la camminata** (5-6 s in tutto, U la salta): troppo lunga? (tutti e due)
- [motori] **Salvataggi vecchi**: chi aveva turbo, centralina, intercooler o frizione di Luca sulla V40 li riceve in
  soldi una volta sola (avviso di Luca). Controllare che il messaggio arrivi e i conti tornino. (tutti e due)

## Da sistemare
- [guida] **Leva in D uscendo da un locale a motore spento**: entrando, l'accosto automatico mette la leva in D; se il
  motore era spento, uscendo l'avviamento viene rifiutato («metti la leva in P») finché non premi Q. C'era già prima,
  si vede soprattutto con `strumenti/prova.js`. Meglio rimettere la leva in P quando si entra da fermi. (Claude)
- [avvisi] **Troppi messaggi insieme**: traguardi, avvisi a destra, pensieri e telefono possono uscire tutti nello
  stesso momento (si vede bene saltando di km, ma succede anche giocando dopo una tappa). Una fila unica con le
  priorità. (Claude)
- [telefono] **Al telefono in verticale** il riquadro dei traguardi esce sopra «Gira il telefono». (Claude, piccolo)
- [motori] **Valigette sulla V40**: il premio «kit turbo» non trova più pezzi di Luca e dà altro. Meglio che dia un
  turbo di Nico in magazzino. (Claude, quando si decide)
- [motori] **Il pannello di Nico è lunghissimo** (livelli, motore, pezzi in vendita, magazzino, banco, motori): sul
  telefono si scorre molto. Schede o sezioni chiudibili. (Claude)
- [motori] **Magazzino senza limite**: i motori costruiti sono massimo 4, i pezzi no. Serve un limite? (cognato)
- [test] `test/motori.test.js` è il vecchio «Banco Suono 2JZ», non il motore di Nico (quelle prove sono in
  `test/motori-costruiti.test.js`). Rinominarlo vuol dire toccare due skill (ramo `skill`). (chi ha voglia)

## Fatto di recente (si toglie al prossimo controllo)
- Check completo del 20/11 sera: tutte le tappe, telefono, paesaggi, suono (V40 e Supra misurati), salvataggio vecchio
  col 3D ricaricato: nessun errore. Corretto il vento che velava di polvere anche la città (ora solo nel deserto).
- `AVVISI.md` aggiornato: niente più «Il Pistone tappa al km 14,6» né «il proprietario lavora sul 3D».
