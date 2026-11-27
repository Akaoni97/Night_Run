# Cose in sospeso e da rivedere

Lista viva: al **controllo della sera** (quando qualcuno chiede «il check») Claude la legge e la riporta nel rapporto,
poi la aggiorna con chi c'è (toglie quello che è fatto, aggiunge quello che salta fuori). In cima le cose più urgenti.
Formato: `N. [area] cosa · perché conta · (da chi / chi decide)`.

**REGOLA (21/11/2026, da Luca, il cognato): ogni sospeso si riporta SEMPRE come elenco numerato, un punto per voce, con la
numerazione continua in tutta la lista.** Così si risponde con «punto 3 voglio questo, punto 5 voglio quello». Nel
rapporto della sera e in ogni risposta sui sospesi: un punto = una cosa da decidere, frasi corte, niente paragrafi.
Quando una voce cambia numero, si dice nel rapporto («il 7 ora è il 5»).

**25/11 sera (Nico)**: fatti il 36 (quadro sotto i pulsanti e tasto ⤢), il 37 (B chiude) e il 39 (scritte della chiave), v0.166. Gli altri numeri invariati.

**25/11 sera, check (Nico con Claude)**: nuovi il 38 (Uno Turbo e Punto 75: da sentire) e il 39 (schermata iniziale: due scritte poco leggibili). Gli altri numeri invariati.

**25/11 mattina, check (Nico con Claude)**: niente di nuovo su `main` dal check di Luca; nuovi il 36 (proposta di Luca sul quadro, decide Nico) e il 37 (tasto B). Gli altri numeri invariati.

**24/11 sera, check (Luca con Claude)**: nuovi il 32 (cambio gomma e pulsante bagagliaio), il 33 (Luca Tuning coi rulli dal vivo), il 34 (quadro in alto a sinistra), il 35 (forature: ogni quanto). Gli altri numeri invariati.

**23/11 notte (Luca)**: approvati e tolti 1, 2, 3, 4, 8, 9, 12, 17, 19, 23; il 25 fatto come chiesto (vignette a versi, v0.126). Nuovo il 26 (schermata iniziale al telefono, staccata dal 19). Gli altri numeri non cambiano.

**23/11 sera, check (Luca con Claude)**: il 19 cambia (ora è la schermata iniziale con la chiave, col problema del telefono); nuovi il 24 (capitali da guardare) e il 25 (fiamme, marmitta, nuvolette, vapore). Nessun altro numero è cambiato.

**22/11 sera, decisioni (Nico)**: 1-4 si provano stasera giocando; 5 sì come l'ha proposto Luca; 6 da provare; media dopo; bassa decisa (vedi 14-16). Numeri invariati.

**22/11 sera, check (Nico)**: nuovi il 5 (anomalie, decidi tu) e il 6 (la notte); dal vecchio 5 in poi tutto scala di due (il 5 ora è il 7... il 17 è il 19).

**22/11 notte (Nico)**: nuovo il 3 (fisica e trazione vere, v0.86); dal vecchio 3 in poi tutto scala di uno (il 3 ora è il 4... il 16 è il 17).

**22/11 sera (Nico)**: approvati e tolti il 3 (scheda del pezzo), il 5 (Prestazioni), il 6 e il 7 (Windows), il 13 (camminata). Numeri cambiati: 4→3, 8→4, 9→5, 10→6, 11→7, 12→8, 14→9, 15→10, 16→11, 17→12, 18→13, 19→14, 20→15, 21→16.

**Riordinata il 22/11/2026 (Nico con Claude): divisa per priorità e per blocchi, TUTTI i numeri sono cambiati.** Vecchio → nuovo: 1→20, 2→21, 3→12, 4→16, 5→17, 6→15, 7→11, 8→9, 9→10, 10→6, 11→8, 12→18, 13→13, 14→4, 15→7, 16→5, 17→2, 18→3, 19→1, 20→19, 21→14. v0.82 (Luca con Claude): il 19 non è più bloccato, ora è «auto e camion nuovi» da guardare; numeri uguali.

## Priorità alta · cose nuove non ancora verificate (si fanno prima)

### Bagagliaio e gomme
32. [gomme] **Cambio gomma animato e pulsante BAGAGLIAIO** (v0.161, `cambiogomma.js`): da provare sul PC il ritmo (~15 s, U accelera), se si capisce che è in ginocchio, e se in corsia di destra il traffico da dietro si comporta bene con l'auto ferma. (cognato)

### Luca Tuning e quadro
40. [fiamme] **Fiamme con carattere, tipo e colore nel menu** (v0.169-v0.175, `fiamme2d.js`; rifatte con bagliore nella v0.175; scheda Fiamme da Luca con tipi e colori): da guardare sul PC guidando: rally (anti-lag con grumi e scintille), drag (foglio blu lungo), tuner (crackle), race (stella), e i kit di Luca (Lanciafiamme, Mitraglia). Troppe o troppo grandi? Manopole nei copioni di `fiammaCopione` (lunghezze, `cool` = pausa tra scene). Anche l'anteprima della scheda Fiamme. (cognato)
33. [officina] **Luca Tuning dal vivo** (v0.147-v0.160): rulli dentro il negozio, gas libero mentre monti i pezzi, numeri solo sullo schermo del banco, fiamme anche in officina. Visto nel check (foto): lo schermo del banco si legge. Da provare sul PC sgasando con un kit di fiamme. (cognato)
34. [interfaccia] **Quadro e pulsanti in alto a sinistra** (v0.155): visto nel check su 1280×720, non copre la strada. Da guardare su una finestra stretta del PC (si rimpicciolisce fino a 0,6). (tutti e due)
35. [gomme] **Forature: ogni quanto?** (v0.149-v0.152): una lenta ogni 15-20 km e uno scoppio ogni 37-50 km. Coi 4 tamponamenti in 94 km del 22 rischia di essere troppo: da decidere giocando. (tutti e due)

### Notte e storia
5. [storia] **Anomalie di Luca** (fatte nella v0.100, otto su tre livelli in `VG_ODD`): i testi brevi li ha scritti Claude dalle idee di Luca, **da rivedere da Luca**; da provare giocando se sono troppo rare o troppo frequenti. (cognato)
6. [notte] **La notte** (v0.89, `notte.js`): di notte meno volanti e più cose strane, radio che disturba, scena «Quella dietro» al benzinaio, interfaccia Essenziale, buio nelle incursioni. Provato nel check: interfaccia e radio funzionano; i caratteri del fruscio (▒) che uscivano come spazi vuoti ora sono segni che si vedono (# % * / ~, v0.100). Da provare giocando un'incursione intera e la scena del benzinaio. (tutti e due)

### Auto nuove e schermata iniziale (25/11)
38. [auto] **Fiat Uno Turbo i.e. e Punto 75** (v0.164): viste nel check sulla strada a 1920×1080, ferme e in corsa, disegno pulito e ruote in scala, nessun errore. Da sentire sul PC i WAV dell'allungo; i rapporti e la pressione dell'Uno sono una media tra fonti che non concordano: vanno bene così? (proprietario)

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

31. [suono] **Turbo, cambiate e aspirazione rifatti** (v0.142, Luca): da ascoltare sul PC con un turbo grosso (Supra big single, V40 Drag 450) fuori e in abitacolo; manopole in `DSP_TB`/`DSP_CB` di `dsp.js` se qualcosa è troppo o troppo poco. (Luca)

30. [fisica] **Progetto impennata** (v0.145, in prova, spento di serie: Sviluppatori → «Progetto impennata»): da provare sul PC con la R5 Turbo 2 preparata (l'unica che su strada ci arriva vicino, vedi `docs/fisica/IMPENNATA.md` §0). Decidere poi se lasciarlo acceso per tutti. (Luca)

28. [storia] **Bivi nella storia** (progetto futuro, da Luca il 23/11): qualche bivio inserito nella storia, dopo una capitale due uscite con prove diverse e il finale che ne tiene conto (proposta D di `docs/storia/PROPOSTA_CITTA.md`). Si fa dopo i collegamenti e i momenti forti delle capitali. (Luca, da confermare con Nico)
29. [città] **Capitali, risposte di Luca** (`PROPOSTA_CITTA.md`, sezione 5): collegamenti veri all'inizio e strani più avanti; momenti forti a Roma (Colosseo), Washington (obelisco), Tokyo (torre di luci), Vienna da decidere; da confermare con Nico. (tutti e due)

## Fatto di recente (si toglie al prossimo controllo)
- 25/11 sera (v0.166, Nico): 36 quadro sotto i pulsanti col tasto ⤢ per ingrandirlo (da guardare sul PC), 37 il B chiude il bagagliaio, 39 scritte sotto la chiave su fondo scuro.
- 25/11 sera, check (Nico con Claude): 6 commit nuovi (v0.162-v0.164, tutti di Nico), 437 test verdi, nessun file eliminato. Nel browser: schermata iniziale col blocchetto nuovo (computer e telefono), Uno Turbo e Punto 75 ferme e in corsa a 1920×1080, nessun errore in console.
- 25/11 (v0.162, Nico): chiave da tenere premuta sulla schermata iniziale (OFF/START, anche Invio e Spazio).
- 25/11 (v0.163, Nico): tolte le righe sotto dieci auto e corrette le ruote fuori scala.
- 25/11 (v0.164, Nico): Fiat Uno Turbo i.e. e Punto 75 prima serie.
