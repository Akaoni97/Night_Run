# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, da Luca, il cognato): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

**23/11 notte (Luca)**: approvati e tolti 1, 2, 3, 4, 8, 9, 12, 17, 19, 23; il 25 fatto come chiesto (vignette a versi, v0.126). Nuovo il 26 (schermata iniziale al telefono, staccata dal 19). Gli altri numeri non cambiano.

**23/11 sera, check (Luca con Claude)**: il 19 cambia (ora è la schermata iniziale con la chiave, col problema del telefono); nuovi il 24 (capitali da guardare) e il 25 (fiamme, marmitta, nuvolette, vapore). Nessun altro numero è cambiato.

**22/11 sera, decisioni (Nico)**: 1-4 si provano stasera giocando; 5 sì come l'ha proposto Luca; 6 da provare; media dopo; bassa decisa (vedi 14-16). Numeri invariati.

**22/11 sera, check (Nico)**: nuovi il 5 (anomalie, decidi tu) e il 6 (la notte); dal vecchio 5 in poi tutto scala di due (il 5 ora è il 7... il 17 è il 19).

**22/11 notte (Nico)**: nuovo il 3 (fisica e trazione vere, v0.86); dal vecchio 3 in poi tutto scala di uno (il 3 ora è il 4... il 16 è il 17).

**22/11 sera (Nico)**: approvati e tolti il 3 (scheda del pezzo), il 5 (Prestazioni), il 6 e il 7 (Windows), il 13 (camminata). Numeri cambiati: 4→3, 8→4, 9→5, 10→6, 11→7, 12→8, 14→9, 15→10, 16→11, 17→12, 18→13, 19→14, 20→15, 21→16.

**Riordinata il 22/11/2026 (Nico con Claude): divisa per priorità e per blocchi, TUTTI i numeri sono cambiati.** Vecchio → nuovo: 1→20, 2→21, 3→12, 4→16, 5→17, 6→15, 7→11, 8→9, 9→10, 10→6, 11→8, 12→18, 13→13, 14→4, 15→7, 16→5, 17→2, 18→3, 19→1, 20→19, 21→14. v0.82 (Luca con Claude): il 19 non è più bloccato, ora è «auto e camion nuovi» da guardare; numeri uguali.

## Priorità alta · cose nuove non ancora verificate (si fanno prima)

### Notte e storia
5. [storia] **Anomalie di Luca** (fatte nella v0.100, otto su tre livelli in `VG_ODD`): i testi brevi li ha scritti Claude dalle idee di Luca, **da rivedere da Luca**; da provare giocando se sono troppo rare o troppo frequenti. (cognato)
6. [notte] **La notte** (v0.89, `notte.js`): di notte meno volanti e più cose strane, radio che disturba, scena «Quella dietro» al benzinaio, interfaccia Essenziale, buio nelle incursioni. Provato nel check: interfaccia e radio funzionano; i caratteri del fruscio (▒) che uscivano come spazi vuoti ora sono segni che si vedono (# % * / ~, v0.100). Da provare giocando un'incursione intera e la scena del benzinaio. (tutti e due)

## Priorità media · decisioni e tarature

### Officina
7. [officina] **Officina nuova** (Modifiche e Swap motore), **assetto a livelli**, **pezzi nuovi della V40 e pallini verde/rosso** (verde monta, rosso compra): CV, prezzi e km tarati a occhio; la preparazione «Drag 450» arriva a ~520 CV. **Vendita**: un'auto elaborata vale metà di quello speso in pezzi e swap (v0.74, `DL.modPezzi`, `DL.modSwap`): giusto? (tutti e due)
10. [officina] **Idee di Codex NON fatte** (file Night_Run_Tuning_per_Claude, 21/11): pressione fissa / manuale / elettronica con due profili Strada e Spinta; tre turbo «Pronto / Stradale / Allungo» rifatti su ogni auto con la loro risposta e un limite di portata agli alti; anteprima dell'altezza che muove subito l'auto mentre trascini; barre di erogazione bassi/medi/alti; freni a tre livelli; confronto della risposta (non solo dei picchi). Sono lavori grossi: quali ci interessano? (tutti e due)
10b. [officina] **Potenze al massimo dei pezzi** (controllo dei motori, v0.104): ogni pezzo da solo dà un guadagno
   sensato, ma si moltiplicano tutti senza freno: E36 1.393 CV, E34 1.532, A112 da 70 a 595 (×8,5). Si mette un
   rendimento che cala quando il motore è già tirato, o si lascia così perché è un gioco? (cognato)

### Menu e locali
11. [menu] **Resto delle idee sul menu** (fatte solo Impostazioni e meteo): **tre slot di salvataggio fatti (v0.101)**; **pausa a due livelli fatta (v0.110)**, **nomi dei salvataggi, mappa del diario e foto fatte (v0.110)**; restano sfondo vivo, controller e
   tastiera, garage vero, diario con mappa e foto, confronto prima/dopo sui pezzi. Quali e in
   che ordine? (proprietario)
### Personaggi e storia
13. [storia] **Testi segnaposto**: pensieri (`pensieri.js`), prologo (`PRO_LETTERA`, `PRO_NOTAIO`), finali A, C, D
   (`STORIA_EPI`, scritti da Claude). Chi li riscrive e quando? (cognato)

## Priorità bassa · rifiniture

### Meteo
14. [meteo] **Il vento spinge davvero?** Deciso da Nico (22/11): sì. **Fatto (v0.90)**: il vento contro frena, a favore spinge. Da provare guidando. (tutti e due)
15. [meteo] **Neve e nebbia anche in città?** Deciso da Nico (22/11): sì, e il dinamico secondo l'ora. **Fatto (v0.90)**. (tutti e due)
16. [meteo] **Nebbia di notte** e fruscio del vento. Deciso da Nico (22/11): nebbia di notte sì, nei momenti horror e ogni tanto; fruscio del vento sì ma non fastidioso. **Fatto (v0.90)**: il fruscio va sentito sul PC. (proprietario)

## Da guardare · arrivati il 22/11 (Nico)

18. [prologo] **Prologo nuovo** (v0.98): stessa risoluzione del gioco, arrivo sotto la pioggia, studio, garage con le auto una alla volta, autostrada. Da guardare sul PC: ritmo dell'arrivo (14 s) e volume della pioggia. (proprietario)
20. [menu] **Tre salvataggi** (v0.101): da provare anche nel programma per Windows. Gli avvisi a destra sulla schermata iniziale: sistemato nel check del 23/11 (v0.108), aspettano. (proprietario)

## Da guardare · arrivati il 23/11

24. [città] **Capitali con l'aspetto delle città vere** (v0.112-v0.114): palazzi, insegne, quartieri, oggetti del marciapiede, bandiere e 28 monumenti ad alta definizione. Roma guardata nel check (quartiere EUR): a posto. Le altre da guardare sul PC. (tutti e due)
25. [grafica] **Fiamme, marmitta e reazioni** (vignette rifatte a soli versi nella v0.126, chiesto da Luca) (v0.117-v0.120): fiamme dal punto vero dello scarico e allineate al terminale, marmitta che si arroventa ai giri alti (Luca), protagonista in pixel art con le nuvolette di pensiero (WOW!, SORPASSO!...), vapore dai tombini e dai ramen, fari che si specchiano sul bagnato, locali dietro i passanti (Nico). Da guardare guidando sul PC: le nuvolette ogni 7-11 s sono troppe? (tutti e due)

## In pausa fino alla fine (deciso da Luca il 21/11: non si tocca ora)

### Economia e guida
21. [economia] **Soldi ed economia in generale**: si toccano verso la fine del lavoro, non prima. Prova dei primi 200 km
   (giocatore automatico, `strumenti/giocatore.js`, 20/11): ~2 h 20 di gioco, € 28.000 guadagnati (70 % dalle missioni),
   € 16.700 in tasca al km 200; benzina, cibo e motel non pesano quasi niente. (tutti e due)
22. [guida] **Danni**: 4 tamponamenti in 94 km anche con l'AUTO 1, carrozziere fino a € 2.600 a volta, gomme bucate ogni
   ~30 km. Luca (21/11): per ora si lascia così, si tara giocando. (tutti e due)

## Proposte nuove

30. [fisica] **Progetto impennata** (proposta del 24/11, `docs/fisica/IMPENNATA.md`): da leggere e rispondere alle 5 domande del §7 prima di scrivere codice; interruttore in Sviluppatori, spento di serie. (Luca)

28. [storia] **Bivi nella storia** (progetto futuro, da Luca il 23/11): qualche bivio inserito nella storia, dopo una capitale due uscite con prove diverse e il finale che ne tiene conto (proposta D di `docs/storia/PROPOSTA_CITTA.md`). Si fa dopo i collegamenti e i momenti forti delle capitali. (Luca, da confermare con Nico)
29. [città] **Capitali, risposte di Luca** (`PROPOSTA_CITTA.md`, sezione 5): collegamenti veri all'inizio e strani più avanti; momenti forti a Roma (Colosseo), Washington (obelisco), Tokyo (torre di luci), Vienna da decidere; da confermare con Nico. (tutti e due)

## Fatto di recente (si toglie al prossimo controllo)
- 24/11 (v0.138, Nico): schermata iniziale al telefono sistemata (sospeso 26 chiuso), auto e sfondo più belli; paesaggi fuori città da 3.100-6.700 a 830-1.900 comandi a fotogramma; controllo dei comandi nella prova di fumo.
- 24/11 (v0.131-v0.137, Nico e Luca): prestazioni in tre giri; **sul PC di Nico 58-60 fps** (erano 11-24). Il 27 è chiuso.
- 23/11 notte (Luca): approvati suoni per auto e campioni, fisica vera, rimborso di Nico, schede, voci delle schede, aspetto dei personaggi, auto e camion nuovi, schermata iniziale, proposta delle capitali. Vignette a versi (v0.126).
- 23/11, check (Luca con Claude): 408 test, prova di fumo, foto di schermata iniziale (computer e telefono), Roma e guida.
- 23/11 (v0.113-v0.123, Nico): capitali più vere, video «di serie e preparate», fluidità di fiammate e scritte, livelli del 2D, protagonista in pixel art con nuvolette, schermata iniziale con la chiave, aggiornamenti subito (`sw.js`).
- 23/11 (v0.120, Luca): fiamme allineate allo scarico, marmitta rovente.
- 22/11 (v0.85, Luca): cinque auto iniziali all'Autosalone.
