# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, da Luca, il cognato): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

**22/11 sera (Nico)**: approvati e tolti il 3 (scheda del pezzo), il 5 (Prestazioni), il 6 e il 7 (Windows), il 13 (camminata). Numeri cambiati: 4→3, 8→4, 9→5, 10→6, 11→7, 12→8, 14→9, 15→10, 16→11, 17→12, 18→13, 19→14, 20→15, 21→16.

**Riordinata il 22/11/2026 (Nico con Claude): divisa per priorità e per blocchi, TUTTI i numeri sono cambiati.** Vecchio → nuovo: 1→20, 2→21, 3→12, 4→16, 5→17, 6→15, 7→11, 8→9, 9→10, 10→6, 11→8, 12→18, 13→13, 14→4, 15→7, 16→5, 17→2, 18→3, 19→1, 20→19, 21→14. v0.82 (Luca con Claude): il 19 non è più bloccato, ora è «auto e camion nuovi» da guardare; numeri uguali.

## Priorità alta · cose nuove non ancora verificate (si fanno prima)

### Suono
1. [suono] **Suoni diversi per ogni auto, scarichi a cinque livelli e collettore** (v0.79-v0.80, `suoni.js`): famiglie città, berlina, sportiva, tricilindrico, turbo, cinque cilindri, diesel, autobus; scarichi originale / terminale / catback / senza centrale / da gara; cat a 400, 200 e 100 celle e decat che alzano il tono e rendono il suono più cattivo. Misurati ma **non ascoltati**: da sentire sul PC auto per auto (passi tra un livello e l'altro, «cattivo» del tubolare e del decat, volumi). Manca il fischio del turbo sulle auto col turbo di serie. (tutti e due)
2. [suono] **Campioni dei pezzi** (v0.78, rifatti meno robotici nella v0.83 su richiesta di Luca, `strumenti/campioni_pezzi.py`): 42 kit fatti a codice. Prima i botti e i fischi erano toni puri («da tastiera»); ora i botti sono aria che risuona nel tubo, i fischi aria intonata che ondeggia, i «tu-tu» sbuffi; volumi percepiti come prima. Misurati ma **non ascoltati** da Claude: da sentire sul PC in cuffia. Confronto pronto: prima e dopo, kit per kit (file mandato a Nico il 22/11). Se un kit è ancora finto: si ritocca la sua ricetta (`POPS`, `BANGP`, `FLUP`, `BOVP`, anelli) e il livello in `LIVELLO`. (cognato, Luca)

### Officina
3. [officina] **Rimborso di Nico**: chi aveva speso dal vecchio Nico (livelli, pezzi, motori costruiti) riceve i soldi una
    volta sola, con un messaggio di Luca (`offPistoneRimborso`). Controllare messaggio e conti su una partita vera. (tutti e due)

## Priorità media · decisioni e tarature

### Officina
4. [officina] **Officina nuova** (Modifiche e Swap motore), **assetto a livelli**, **pezzi nuovi della V40 e pallini verde/rosso** (verde monta, rosso compra): CV, prezzi e km tarati a occhio; la preparazione «Drag 450» arriva a ~520 CV. **Vendita**: un'auto elaborata vale metà di quello speso in pezzi e swap (v0.74, `DL.modPezzi`, `DL.modSwap`): giusto? (tutti e due)
5. [officina] **Schede tecniche e pezzi per ogni auto** (v0.66, `schede.js`): ogni auto ha motore, cilindri e potenza veri e i suoi pezzi (diesel senza camme e downpipe, tricilindrici Polo/Clio/308, reparto speciale a due livelli). Provata a vista solo la V40; le altre auto col catalogo nuovo vanno aperte da Luca e guardate (prezzi, km e rese sono tarati a occhio). (tutti e due)
6. [officina] **Voci della scheda da rivedere**: la V40 dice 140 CV a 5500 (vero) mentre il riquadro dell'officina ne stima 140 a 6000; l'autobus ha 390 CV perché la curva del gioco li dà (la scheda segue il gioco). Il turbo di serie di A3, 308, Clio, 850 R e diesel è già dentro la curva: i kit turbo si aggiungono sopra. (proprietario)
7. [officina] **Idee di Codex NON fatte** (file Night_Run_Tuning_per_Claude, 21/11): pressione fissa / manuale / elettronica con due profili Strada e Spinta; tre turbo «Pronto / Stradale / Allungo» rifatti su ogni auto con la loro risposta e un limite di portata agli alti; anteprima dell'altezza che muove subito l'auto mentre trascini; barre di erogazione bassi/medi/alti; freni a tre livelli; confronto della risposta (non solo dei picchi). Sono lavori grossi: quali ci interessano? (tutti e due)

### Menu e locali
8. [menu] **Resto delle idee sul menu** (fatte solo Impostazioni e meteo): pausa a due livelli, sfondo vivo, controller e
   tastiera, garage vero, diario con mappa e foto, confronto prima/dopo sui pezzi, tre slot di salvataggio. Quali e in
   che ordine? (proprietario)
### Personaggi e storia
9. [personaggi] **Aspetto dei personaggi** (v0.76): Nico giovane con canotta, braccia tatuate, catenina e occhiali da sole (anche sul furgone del soccorso); Tito vecchio e pazzo (capelli bianchi sparati, occhi sbarrati, ghigno); Rocco fisicato (spalle larghe, canotta, catenina); Massimo barbone (berretto, barba lunga, toppe, bottiglia). Da guardare sul PC. (tutti e due)
10. [storia] **Testi segnaposto**: pensieri (`pensieri.js`), prologo (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D
   (`STORIA_EPI`, scritti da Claude). Chi li riscrive e quando? (cognato)

## Priorità bassa · rifiniture

### Meteo
11. [meteo] **Il vento spinge davvero?** Oggi sbanda solo nel disegno. (proprietario)
12. [meteo] **Neve e nebbia anche in città?** Oggi in «dinamico» no. (tutti e due)
13. [meteo] **Nebbia di notte** e fruscio del vento (fatto senza poterlo ascoltare). (proprietario)

## Da guardare · arrivati il 22/11

### Disegni del proprietario
14. [disegni] **Auto e camion nuovi** (v0.82): le 25 auto da disegno rifatte dai disegni ad alta definizione con le ruote disegnate a parte, versioni tuning col «Kit completo» di Russian Kùstòm (€ 1.600), 12 mezzi pesanti nel traffico (autoarticolati, cisterna, bisarca, portacontainer con 7 livree, carro attrezzi, che fa anche il traino di Nico). Da guardare sul PC: guidatore nei finestrini, colore delle auto ridipinte, quanti camion ci sono in autostrada. (tutti e due)

## In pausa fino alla fine (deciso da Luca il 21/11: non si tocca ora)

### Economia e guida
15. [economia] **Soldi ed economia in generale**: si toccano verso la fine del lavoro, non prima. Prova dei primi 200 km
   (giocatore automatico, `strumenti/giocatore.js`, 20/11): ~2 h 20 di gioco, € 28.000 guadagnati (70 % dalle missioni),
   € 16.700 in tasca al km 200; benzina, cibo e motel non pesano quasi niente. (tutti e due)
16. [guida] **Danni**: 4 tamponamenti in 94 km anche con l'AUTO 1, carrozziere fino a € 2.600 a volta, gomme bucate ogni
   ~30 km. Luca (21/11): per ora si lascia così, si tara giocando. (tutti e due)

## Fatto di recente (si toglie al prossimo controllo)
- 22/11 sera, decisioni di Nico: scheda del pezzo al tocco ok, Prestazioni ok, Windows (installatore, portatile e aggiornamenti) ok, camminata nei locali va bene così.
- 22/11 controllo della sera (Nico con Claude): 318 test passano, prova di fumo senza errori in tutte le tappe, foto di strada, Autosalone, Officina Nico e Russian Kùstòm a posto. Lista riordinata per priorità e blocchi (numeri tutti cambiati, vedi in cima); avvisi v0.74 e v0.75 letti e tolti.
- 21/11 notte (v0.79-v0.81, Luca): suoni diversi per ogni auto, scarichi a cinque livelli e collettore; scheda del pezzo al tocco; 25 auto rifatte dai disegni in alta definizione con le versioni tuning.
- 21/11 notte (v0.78, Luca): campioni audio dei pezzi del motore, scheda Suoni nell'officina (42 kit, 10 componenti, fatti a codice); build di Windows di nuovo in piedi (`desktop/copia-gioco.js` cercava ancora `pistone/`).
- 21/11 sera (v0.77, Luca): codice morto tolto (scene vecchie degli interni, vecchie consegne della città e reputazione, sfide, traguardo ARRIVO, pedali e cambio nascosti nella scheda Guida, calore e motore rotto del Pistone); `test/motori.test.js` → `test/test1.test.js` («Test 1»); insegne grandi e oggetti del marciapiede in alta definizione leggera (`insegne2d.js`). Il riquadro dei traguardi in verticale si lascia così.
- 21/11 sera (v0.76, Luca): aspetto dei personaggi (Nico giovane e tatuato, Tito pazzo, Rocco fisicato, Massimo barbone).
- 21/11 sera (v0.75, Luca): Nico al posto di Mario (Officina Nico, tagliandi) e col carro attrezzi del soccorso; Neon Kustom → Russian Kùstòm; Motel Ovunque → Motel 4Ever con Tito; Nabir al bar, Rossana al benzinaio, Phill Grill all'autogrill, Rocco Lostallone all'Autosalone, Massimo Lo Sfascio allo sfascio.
- 21/11 sera (v0.74, Luca): missione del signore della valigetta a 38 km resta così; vecchio Pistone cancellato (`pistone/`, il
  peso del motore per lo swap ora è in `officina.js`, rimborso una volta sola); sezione Prestazioni; auto elaborate valgono di più.
