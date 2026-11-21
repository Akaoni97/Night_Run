# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, dal proprietario): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

Aggiornata il 21/11/2026 (proprietario, con Claude).

## In pausa fino alla fine (deciso dal proprietario il 21/11: non si tocca ora)
1. [economia] **Soldi ed economia in generale**: si toccano verso la fine del lavoro, non prima. Prova dei primi 200 km
   (giocatore automatico, `strumenti/giocatore.js`, 20/11): ~2 h 20 di gioco, € 28.000 guadagnati (70 % dalle missioni),
   € 16.700 in tasca al km 200; benzina, cibo e motel non pesano quasi niente. (tutti e due)
2. [missioni] **Il signore della valigetta va alla Sosta 24 dopo: 38 km**, a meno di 120 e senza frenate forti; in tutte e
   due le prove ha pagato il 30 %. Meta più vicina? In sospeso. (proprietario)
3. [guida] **Danni**: 4 tamponamenti in 94 km anche con l'AUTO 1, carrozziere fino a € 2.600 a volta (spesa più grossa
   della prova, € 8.400), gomme bucate ogni ~30 km. Troppo? In sospeso. (tutti e due)

## Da decidere insieme
4. [grafica] **Pedoni in alta definizione**: gli omini del marciapiede (`districtPeople` in `quartieri2d.js`) sono la cosa
   più a blocchi della strada. Rifarli come il protagonista (`pgStanding`) con aspetti a caso per quartiere? (proprietario)
5. [grafica] **Dispositivi lenti**: se il disegno resta sopra i 30 ms per tre secondi la grafica nitida si spegne (`slow` in
   `street2d.js`). Se sul PC sembra «sgranato», è questo: si guarda insieme. (tutti e due)
6. [interni] **Interni nuovi** (`interni_hd.js`): da guardare sul PC; le persone sono più grosse del resto della scena. (proprietario)
7. [motori] **Vendere la V40 coi pezzi di Nico**: oggi i pezzi se ne vanno con l'auto. Tornano in magazzino o alzano il
   valore? (cognato; Nico è spento di serie dopo l'officina nuova del 21/11, da rivedere se ha ancora senso)
8. [motori] **Pezzi singoli sulle altre auto** (oggi solo V40, `MOT_SERIE`). Quando? (cognato; stessa nota del 7)
9. [motori] **Vecchio Pistone**: facciata, interno e pannello in `pistone/motori2d.js` non si usano più. Cancellare o
   riusare? (cognato)
10. [personaggi] **Nico**: nessun disegno nell'interno di Luca; aspetto, carattere, come si sblocca. (cognato)
11. [personaggi] **Mario** al posto di Niko: va bene al proprietario? (proprietario)
12. [menu] **Resto delle idee sul menu** (fatte solo Impostazioni e meteo): pausa a due livelli, sfondo vivo, controller e
    tastiera, garage vero, diario con mappa e foto, confronto prima/dopo sui pezzi, tre slot di salvataggio. Quali e in
    che ordine? (proprietario)
13. [meteo] **Il vento spinge davvero?** Oggi sbanda solo nel disegno. (proprietario)
14. [meteo] **Neve e nebbia anche in città?** Oggi in «dinamico» no. (tutti e due)
15. [storia] **Testi segnaposto**: pensieri (`pensieri.js`), prologo (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D
    (`STORIA_EPI`, scritti da Claude). Chi li riscrive e quando? (cognato)
16. [officina] **Cosa riportare di Nico nell'officina semplice** (interni della V40, banco, motori costruiti). (tutti e due)

## Da provare giocando (sul PC)
17. [windows] **Night Run per Windows (Codex, v0.62)**: installatore e portatile non provati. Controllare ascolto del
    motore, guida lunga, installazione e disinstallazione. (proprietario)
18. [officina] **Officina nuova** (Modifiche e Swap motore) e **assetto a livelli**: valori tarati a occhio. (tutti e due)
19. [motori] **Prezzi** dei livelli di Nico e **suono**/**calore** dei motori costruiti: contano solo se Nico torna acceso. (cognato)
20. [meteo] **Nebbia di notte** e fruscio del vento (fatto senza poterlo ascoltare). (proprietario)
21. [locali] **Entrata coi posti auto**: camminata di 5-6 s (U la salta), troppo lunga? (tutti e due)
22. [motori] **Salvataggi vecchi**: chi aveva turbo, centralina, intercooler o frizione di Luca sulla V40 li riceve in
    soldi una volta sola. Controllare messaggio e conti. (tutti e due)

## Da sistemare
23. [pulizia] **Codice morto** delle vecchie gare e della vecchia storia (coupé «rival», `s.rep`, blocchi nascosti nella
    scheda Guida, app strane del telefono, `TEL_ATTI`). Sicuro con i test. (Claude, quando c'è tempo)
24. [test] `test/motori.test.js` è il vecchio «Banco Suono 2JZ»: rinominarlo tocca due skill. (chi ha voglia)
25. [disegni] **Camion**: la logica c'è, il proprietario manda i disegni. (proprietario)
26. [grafica] **Alta definizione di marciapiedi, pedoni, oggetti, insegne**: si fa tra poco. (proprietario, Claude)
27. [telefono] Riquadro dei traguardi sopra «Gira il telefono» in verticale: si lascia. (nessuno)

## Fatto di recente (si toglie al prossimo controllo)
- 21/11: officina semplice di Luca (`officina.js`), assetto a livelli, Tutor ogni 10-15 km, Night Run per Windows (v0.62).
- 20/11: AUTO 1 dopo 5 s, leva con la S, tasti 1-4 solo per mangiare e bere, niente turbo nelle valigette, check completo
  del 20/11 sera senza errori.
