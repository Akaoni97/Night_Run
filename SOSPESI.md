# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, da Luca, il cognato): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

Aggiornata il 21/11/2026 sera (proprietario, con Claude).

## In pausa fino alla fine (deciso da Luca il 21/11: non si tocca ora)
1. [economia] **Soldi ed economia in generale**: si toccano verso la fine del lavoro, non prima. Prova dei primi 200 km
   (giocatore automatico, `strumenti/giocatore.js`, 20/11): ~2 h 20 di gioco, € 28.000 guadagnati (70 % dalle missioni),
   € 16.700 in tasca al km 200; benzina, cibo e motel non pesano quasi niente. (tutti e due)
2. [missioni] **Il signore della valigetta va alla Sosta 24 dopo: 38 km**, a meno di 120 e senza frenate forti; in tutte e
   due le prove ha pagato il 30 %. Meta più vicina? In sospeso. (proprietario)
3. [guida] **Danni**: 4 tamponamenti in 94 km anche con l'AUTO 1, carrozziere fino a € 2.600 a volta (spesa più grossa
   della prova, € 8.400), gomme bucate ogni ~30 km. Troppo? In sospeso. (tutti e due)

## Da decidere insieme
4. [grafica] **Pedoni in alta definizione**: Luca ha detto «è per Nico», cioè decide il proprietario (Nico). Da riportare a lui. (proprietario)
5. [grafica] **Dispositivi lenti**: si vede man mano che il gioco si sviluppa, con ottimizzazioni e scelte su cosa lasciare o ridurre (21/11). Se la grafica sembra «sgranata» sul PC è `slow` in `street2d.js`. (tutti e due)
6. [motori] **Vendere la V40 coi pezzi di Nico montati**: da vedere (21/11). Oggi i pezzi se ne vanno con l'auto. (cognato)
7. [motori] **Vecchio Pistone**: è il codice del vecchio negozio di Nico (facciata, interno, pannello del progetto in `pistone/motori2d.js`), che non si usa più dopo l'officina semplice. Si può cancellare o tenere per la scena di Nico da Luca. Da decidere. (cognato)
8. [personaggi] **Nico**: nessun disegno nell'interno di Luca; aspetto, carattere, come si sblocca. (cognato)
9. [personaggi] **Mario** al posto di Niko: va bene al proprietario? (proprietario)
10. [menu] **Resto delle idee sul menu** (fatte solo Impostazioni e meteo): pausa a due livelli, sfondo vivo, controller e
    tastiera, garage vero, diario con mappa e foto, confronto prima/dopo sui pezzi, tre slot di salvataggio. Quali e in
    che ordine? (proprietario)
11. [meteo] **Il vento spinge davvero?** Oggi sbanda solo nel disegno. (proprietario)
12. [meteo] **Neve e nebbia anche in città?** Oggi in «dinamico» no. (tutti e due)
13. [storia] **Testi segnaposto**: pensieri (`pensieri.js`), prologo (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D
    (`STORIA_EPI`, scritti da Claude). Chi li riscrive e quando? (cognato)
14. [officina] **Cosa riportare di Nico nell'officina semplice** (interni della V40, banco, motori costruiti): i pezzi nuovi della V40 (v0.63) coprono già parte di quello che faceva Nico. (tutti e due)

## Da provare giocando (sul PC)
- [windows] **Aggiornamenti dal programma** (v0.65): dopo la prima release `v0.2.1` installarla a mano, farne uscire una seconda e provare Cerca, Scarica, Installa e riavvia con una partita di prova (copia della cartella `%APPDATA%\\night-run` prima). Controllare anche senza rete, «Più tardi» e il portatile. Le impostazioni di GitHub Actions (permessi di scrittura ai workflow) vanno verificate alla prima esecuzione. (cognato, Luca)
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
15. [officina] **Schede tecniche e pezzi per ogni auto** (v0.66, `schede.js`): ogni auto ha motore, cilindri e potenza veri e i suoi pezzi (diesel senza camme e downpipe, tricilindrici Polo/Clio/308, reparto speciale a due livelli). Provata a vista solo la V40; le altre auto col catalogo nuovo vanno aperte da Luca e guardate (prezzi, km e rese sono tarati a occhio). (tutti e due)
16. [officina] **Voci della scheda da rivedere**: la V40 dice 140 CV a 5500 (vero) mentre il riquadro dell'officina ne stima 140 a 6000; l'autobus ha 390 CV perché la curva del gioco li dà (la scheda segue il gioco). Il turbo di serie di A3, 308, Clio, 850 R e diesel è già dentro la curva: i kit turbo si aggiungono sopra. (proprietario)
17. [windows] **Night Run per Windows (Codex, v0.62)**: installatore e portatile non provati. Controllare ascolto del
    motore, guida lunga, installazione e disinstallazione. (proprietario)
18. [officina] **Officina nuova** (Modifiche e Swap motore), **assetto a livelli**, **pezzi nuovi della V40 e pallini verde/rosso** (verde monta, rosso compra): CV, prezzi e km tarati a occhio; la preparazione «Drag 450» arriva a ~520 CV. (tutti e due)
19. [telefono] **Luca Garage** (v0.64): app che ti porta da Luca per € 150, cartellone al km 26. «Luca Garage» è un'interpretazione: prezzo e cartellone in `LG` e `TEL_APP_OFFERS`; il pulsante non è stato cliccato col mouse. Va bene così? (proprietario)
20. [motori] **Prezzi** dei livelli di Nico e **suono**/**calore** dei motori costruiti: contano solo se Nico torna acceso. (cognato)
21. [meteo] **Nebbia di notte** e fruscio del vento (fatto senza poterlo ascoltare). (proprietario)
22. [locali] **Entrata coi posti auto**: camminata di 5-6 s (U la salta), troppo lunga? (tutti e due)
23. [motori] **Salvataggi vecchi**: chi aveva turbo, centralina, intercooler o frizione di Luca sulla V40 li riceve in
    soldi una volta sola. Controllare messaggio e conti. (tutti e due)

## Da sistemare
24. [pulizia] **Codice morto** delle vecchie gare e della vecchia storia (coupé «rival», `s.rep`, blocchi nascosti nella
    scheda Guida, app strane del telefono, `TEL_ATTI`). Sicuro con i test. (Claude, quando c'è tempo)
25. [test] `test/motori.test.js` è il vecchio «Banco Suono 2JZ»: rinominarlo tocca due skill. (chi ha voglia)
26. [disegni] **Camion**: la logica c'è, il proprietario manda i disegni. (proprietario)
27. [grafica] **Alta definizione di marciapiedi, pedoni, oggetti, insegne**: si fa tra poco. (proprietario, Claude)
28. [telefono] Riquadro dei traguardi sopra «Gira il telefono» in verticale: si lascia. (nessuno)

## Fatto di recente (si toglie al prossimo controllo)
- 21/11 sera (v0.66): schede tecniche e pezzi con personalità per tutte le auto, tricilindrici veri (Polo, Clio, 308), carattere audio «Codex · deciso» tolto. Interni nuovi guardati da Luca: belli.
- 21/11: Luca Garage (v0.64), pezzi nuovi V40 con pallini (v0.63), officina semplice di Luca (`officina.js`), assetto a livelli, Tutor ogni 10-15 km, Night Run per Windows (v0.62).
- 20/11: AUTO 1 dopo 5 s, leva con la S, tasti 1-4 solo per mangiare e bere, niente turbo nelle valigette, check completo
  del 20/11 sera senza errori.
