# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, da Luca, il cognato): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

Aggiornata il 21/11/2026 notte (v0.78, Luca con Claude): nuovo punto 16, i campioni dei pezzi da ascoltare. **Numeri cambiati**: il camion (16 nella v0.77) ora è il 17, l'aspetto dei personaggi (17) è il 18.
Prima: aggiornata il 21/11/2026 sera (v0.77, Luca con Claude): fatti il 16 (codice morto), il 17 (Test 1) e il 19 (alta definizione leggera); il 20 si lascia così. **Numeri cambiati**: il 18 (camion) ora è il 16, il 21 (aspetto dei personaggi) è il 17.

## In pausa fino alla fine (deciso da Luca il 21/11: non si tocca ora)
1. [economia] **Soldi ed economia in generale**: si toccano verso la fine del lavoro, non prima. Prova dei primi 200 km
   (giocatore automatico, `strumenti/giocatore.js`, 20/11): ~2 h 20 di gioco, € 28.000 guadagnati (70 % dalle missioni),
   € 16.700 in tasca al km 200; benzina, cibo e motel non pesano quasi niente. (tutti e due)
2. [guida] **Danni**: 4 tamponamenti in 94 km anche con l'AUTO 1, carrozziere fino a € 2.600 a volta, gomme bucate ogni
   ~30 km. Luca (21/11): per ora si lascia così, si tara giocando. (tutti e due)

## Da decidere insieme
3. [menu] **Resto delle idee sul menu** (fatte solo Impostazioni e meteo): pausa a due livelli, sfondo vivo, controller e
   tastiera, garage vero, diario con mappa e foto, confronto prima/dopo sui pezzi, tre slot di salvataggio. Quali e in
   che ordine? (proprietario)
4. [meteo] **Il vento spinge davvero?** Oggi sbanda solo nel disegno. (proprietario)
5. [meteo] **Neve e nebbia anche in città?** Oggi in «dinamico» no. (tutti e due)
6. [storia] **Testi segnaposto**: pensieri (`pensieri.js`), prologo (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D
   (`STORIA_EPI`, scritti da Claude). Chi li riscrive e quando? (cognato)

## Da provare giocando (sul PC)
7. [officina] **Schede tecniche e pezzi per ogni auto** (v0.66, `schede.js`): ogni auto ha motore, cilindri e potenza veri e i suoi pezzi (diesel senza camme e downpipe, tricilindrici Polo/Clio/308, reparto speciale a due livelli). Provata a vista solo la V40; le altre auto col catalogo nuovo vanno aperte da Luca e guardate (prezzi, km e rese sono tarati a occhio). (tutti e due)
8. [officina] **Voci della scheda da rivedere**: la V40 dice 140 CV a 5500 (vero) mentre il riquadro dell'officina ne stima 140 a 6000; l'autobus ha 390 CV perché la curva del gioco li dà (la scheda segue il gioco). Il turbo di serie di A3, 308, Clio, 850 R e diesel è già dentro la curva: i kit turbo si aggiungono sopra. (proprietario)
9. [windows] **Night Run per Windows (Codex, v0.62)**: installatore e portatile non provati. Controllare ascolto del
    motore, guida lunga, installazione e disinstallazione. (proprietario)
10. [officina] **Officina nuova** (Modifiche e Swap motore), **assetto a livelli**, **pezzi nuovi della V40 e pallini verde/rosso** (verde monta, rosso compra): CV, prezzi e km tarati a occhio; la preparazione «Drag 450» arriva a ~520 CV. **Vendita**: un'auto elaborata vale metà di quello speso in pezzi e swap (v0.74, `DL.modPezzi`, `DL.modSwap`): giusto? (tutti e due)
11. [meteo] **Nebbia di notte** e fruscio del vento (fatto senza poterlo ascoltare). (proprietario)
12. [locali] **Entrata coi posti auto**: camminata di 5-6 s (U la salta), troppo lunga? (tutti e due)
13. [officina] **Rimborso di Nico**: chi aveva speso dal vecchio Nico (livelli, pezzi, motori costruiti) riceve i soldi una
    volta sola, con un messaggio di Luca (`offPistoneRimborso`). Controllare messaggio e conti su una partita vera. (tutti e due)
14. [windows] **Aggiornamenti dal programma** (v0.65): dopo la prima release `v0.2.1` installarla a mano, farne uscire una seconda e provare Cerca, Scarica, Installa e riavvia con una partita di prova (copia della cartella `%APPDATA%\\night-run` prima). Controllare anche senza rete, «Più tardi» e il portatile. Le impostazioni di GitHub Actions (permessi di scrittura ai workflow) vanno verificate alla prima esecuzione. (cognato, Luca)
15. [grafica] **Scatti, fluidità e Prestazioni** (v0.74): Impostazioni → Grafica → **Prestazioni** (Automatica, Massima,
    Equilibrata, Fluida, Minima o voce per voce, tetto a 30/60 fotogrammi). «Automatica» scende un gradino alla volta se il
    disegno è lento (prima il bagliore, poi vita e passanti, la densità per ultima) e lo dice nel riquadro; «Riprova al
    massimo» lo azzera. Da provare sul PC guidando in città: se scende senza motivo, si alza `PREST.ms` (24 ms). (tutti e due)

16. [suono] **Campioni dei pezzi** (v0.78, scheda Suoni da Luca, `campioni.js`): 42 kit fatti a codice, misurati ma **non ascoltati** da Claude. Da sentire sul PC in cuffia: valvole (soprattutto gli stu-tu-tu), borbottii, botti della centralina, 2-step e fucilata, fischi di turbo e compressore. Se qualcosa è troppo forte o finto si tara `CMP.g` o si rifà la ricetta in `strumenti/campioni_pezzi.py`; prezzi dei kit a occhio. (cognato, Luca)

## Da sistemare
17. [disegni] **Camion**: la logica c'è, i disegni del proprietario arrivano tra poco. (proprietario)
18. [personaggi] **Aspetto dei personaggi** (v0.76): Nico giovane con canotta, braccia tatuate, catenina e occhiali da sole (anche sul furgone del soccorso); Tito vecchio e pazzo (capelli bianchi sparati, occhi sbarrati, ghigno); Rocco fisicato (spalle larghe, canotta, catenina); Massimo barbone (berretto, barba lunga, toppe, bottiglia). Da guardare sul PC. (tutti e due)

## Fatto di recente (si toglie al prossimo controllo)
- 21/11 notte (v0.78, Luca): campioni audio dei pezzi del motore, scheda Suoni nell'officina (42 kit, 10 componenti, fatti a codice); build di Windows di nuovo in piedi (`desktop/copia-gioco.js` cercava ancora `pistone/`).
- 21/11 sera (v0.77, Luca): codice morto tolto (scene vecchie degli interni, vecchie consegne della città e reputazione, sfide, traguardo ARRIVO, pedali e cambio nascosti nella scheda Guida, calore e motore rotto del Pistone); `test/motori.test.js` → `test/test1.test.js` («Test 1»); insegne grandi e oggetti del marciapiede in alta definizione leggera (`insegne2d.js`). Il riquadro dei traguardi in verticale si lascia così.
- 21/11 sera (v0.76, Luca): aspetto dei personaggi (Nico giovane e tatuato, Tito pazzo, Rocco fisicato, Massimo barbone).
- 21/11 sera (v0.75, Luca): Nico al posto di Mario (Officina Nico, tagliandi) e col carro attrezzi del soccorso; Neon Kustom → Russian Kùstòm; Motel Ovunque → Motel 4Ever con Tito; Nabir al bar, Rossana al benzinaio, Phill Grill all'autogrill, Rocco Lostallone all'Autosalone, Massimo Lo Sfascio allo sfascio.
- 21/11 sera (v0.74, Luca): missione del signore della valigetta a 38 km resta così; vecchio Pistone cancellato (`pistone/`, il
  peso del motore per lo swap ora è in `officina.js`, rimborso una volta sola); sezione Prestazioni; auto elaborate valgono di più.
- 21/11: pedoni in alta definizione, leggeri (come il protagonista, 34 aspetti, pose in memoria, 2 nuove al massimo per fotogramma).
- 21/11 decisioni di Nico: Mario al posto di Niko va bene; Luca Garage a € 150 va bene; pedoni in alta definizione sì, purché leggeri.
- 20/11 notte: estetica premium (icone disegnate, pannelli a vetro, banner; interruttore Premium/Classico), meno scatti e più fluidità. Controllo del 21/11: nessun errore nelle tappe, 299 test.
- 21/11 sera (v0.66): schede tecniche e pezzi con personalità per tutte le auto, tricilindrici veri (Polo, Clio, 308), carattere audio «Codex · deciso» tolto. Interni nuovi guardati da Luca: belli.
- 21/11: Luca Garage (v0.64), pezzi nuovi V40 con pallini (v0.63), officina semplice di Luca (`officina.js`), assetto a livelli, Tutor ogni 10-15 km, Night Run per Windows (v0.62).
- 20/11: AUTO 1 dopo 5 s, leva con la S, tasti 1-4 solo per mangiare e bere, niente turbo nelle valigette, check completo
  del 20/11 sera senza errori.
