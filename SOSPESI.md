# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `- [area] cosa · perché conta · (da chi / chi decide)`.

Aggiornata il 20/11/2026 notte (briefing col proprietario e il cognato).

## Da decidere insieme
- [interni] **Gli interni nuovi** (tutti e nove in `interni_hd.js`): da guardare sul PC. Le persone usano la pixel art
  del protagonista, più grossa del resto della scena: rifarle più fini è un lavoro a parte. Nico da Luca: lo disegna il
  cognato quando decide com'è. (proprietario, cognato per Nico)
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
- [telefono] **Al telefono in verticale** il riquadro dei traguardi esce sopra «Gira il telefono». Il proprietario ha detto che va
  bene così (il gioco è per il PC): si lascia. (nessuno)
- [test] `test/motori.test.js` è il vecchio «Banco Suono 2JZ», non il motore di Nico (quelle prove sono in
  `test/motori-costruiti.test.js`). Rinominarlo vuol dire toccare due skill (ramo `skill`). (chi ha voglia)
- [pulizia] **Codice morto delle vecchie gare** e dei vecchi pezzi di storia: la coupé «rival» in 3D (il 3D non c'è più), `s.rep`
  (la reputazione di strada, che veniva dalle sfide al semaforo), i blocchi cambio e pedali nascosti nella scheda Guida, le app
  strane del telefono (Ultima Uscita, Segreteria, 03:07) e `TEL_ATTI`, la tabella dei momenti della vecchia storia. Non si vede in
  gioco: è roba che non fa più niente e confonde chi legge il codice. Toglierla è sicuro con i test; da fare quando c'è tempo. (Claude)
- [disegni] **Camion** (traffico lento, lavori pesanti): la logica c'è, il proprietario manda i disegni. (proprietario)
- [grafica] **Alta definizione di marciapiedi, pedoni, oggetti, scritte delle insegne**: si fa tra poco. (proprietario, Claude)

## Fatto di recente (si toglie al prossimo controllo)
- 20/11 (dal briefing): **AUTO 1 si inserisce dopo 5 s**; la leva ha la **S** (sport, giri più alti); i tasti **1-4 solo per mangiare e bere** (le
  marce non stanno più sui numeri); pannello di Nico **a schede**; **tetto di 100 pezzi** in magazzino; **niente turbo** nelle valigette;
  maschera della vernice rifatta per Golf GTI e 205 GTI; test di officina e 0-100 già a posto (Supra di serie 5,83 s, 400 m in 13,9 s).
- Il cognato ha letto gli avvisi del 3D tolto e dell'app installabile: tolti da `AVVISI.md`.
- Check completo del 20/11 sera: tutte le tappe, telefono, paesaggi, suono (V40 e Supra misurati), salvataggio vecchio
  col 3D ricaricato: nessun errore. Corretto il vento che velava di polvere anche la città (ora solo nel deserto).
- `AVVISI.md` aggiornato: niente più «Il Pistone tappa al km 14,6» né «il proprietario lavora sul 3D».
