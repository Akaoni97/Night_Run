# Progetto impennata · applicato in prova (v0.145)

Scritta il 24/11/2026 da Claude su richiesta di Luca (il cognato). Obiettivo: un'auto che alza il muso in partenza
**solo quando la fisica lo permette davvero**, con il mix giusto di pezzi, gomme, peso e trazione. Niente animazione
finta che parte da sola: se l'impennata arriva, è perché la macchina ha la coppia, la presa e l'assetto per farla.

Stato: **applicato in prova dalla v0.145**, spento di serie (Sviluppatori → «Progetto impennata»). La proposta
originale è sotto (§1-7); l'esito delle prove è qui subito.

## 0bis. Revisione v0.149: gomme da drag e impennata da film
Luca l'ha provata (E36 e 2002 Turbo preparate, «sembrava un aeroplano») e il muso non si muoveva. Aveva ragione lui su
un punto: le «Gomme da drag slick» del gioco avevano μ ≈ 1,7-2 sempre, come una slick da pista. Una slick da drag calda
in partenza (fianco morbido che si accartoccia e poi stende il battistrada, mescola tenera, burnout) arriva a μ 2,5-3:
è per questo che le auto da drag impennano. Cosa è cambiato (solo col progetto acceso):
- **Gomma da drag in partenza** (`IMP.DRAG`, `sim.js` Fmax): slick da drag ×1,6 sotto i 22 km/h, che torna a ×1 verso
  gli 80; radiali da drag (ET Street della Supra) ×1,25. Sul bagnato niente, anzi −30 % in più: una slick sull'acqua è
  una saponetta.
- **Impennata da film** (`IMP.scena`, `SupraSim.impennata`): quando la spinta che dura (media su 0,3 s, non il colpo della
  frizione) supera il 70 % del momento che serve, con 4-link o 4-link da drag, gomme da drag, asciutto, gas oltre l'85 %,
  prima o seconda, sotto i 90 km/h, il muso sale deciso (molla smorzata) fino al tetto e ci resta finché spinge; poi
  ricade col suo peso e rimbalza. Angolo dal 40 % al 100 % del tetto secondo quanto si è oltre la soglia.
- **Tetti**: senza wheelie bar 12° (paraurti dietro a terra: sbalzo ~0,85 m, paraurti a ~0,3 m), con la wheelie bar 3°.
- Restano a terra: motore di serie anche con gomme e 4-link (la spinta non dura), semislick o gomme normali, bagnato,
  trazione anteriore. Un motore enorme col turbo che non ha ancora pressione, partendo dal minimo, si siede: si parte
  coi giri alti (launch control o frizione lasciata in alto), come i veri.

Banco v0.149 (frizione lasciata a 3/4 dei giri, preparazione massima):

```
% = quanta della coppia che serve per alzare il muso c'è (100 % = si alza). g = accelerazione massima
auto       b/h  serve | di serie          | max, ponte serie   | max, 4-link        | max, 4-link drag   | drag + bar         | drag, bagnato      | drag + controllo trazione
supra      2.82 1.76g | no 24%        0.66g | no 82%        2.53g | SU 5.8° 0.89s 2.68g | SU 10.8° 1.08s 2.79g | SU 2.9° 0.97s 2.79g | no 31%        0.60g | SU 0.6° 0.20s 2.40g
r5         2.11 1.32g | no 35%        0.74g | SU 0.1° 0.02s 2.52g | SU 7.6° 1.26s 2.57g | SU 12.0° 1.36s 2.60g | SU 3.0° 1.24s 2.60g | no 48%        0.70g | SU 5.5° 1.64s 2.42g
b2002      2.60 1.62g | no 23%        0.61g | no 71%        2.01g | SU 11.2° 0.74s 2.15g | SU 12.0° 0.92s 2.39g | SU 3.0° 0.81s 2.39g | no 28%        0.49g | SU 0.2° 0.11s 1.99g
e30        2.83 1.77g | no 22%        0.63g | no 63%        1.97g | SU 5.4° 0.71s 1.97g | SU 12.0° 0.94s 2.25g | SU 3.0° 0.82s 2.25g | no 26%        0.50g | SU 5.0° 0.55s 1.95g
e36        2.88 1.80g | no 23%        0.65g | no 63%        1.98g | no 85%        1.98g | SU 12.0° 0.88s 2.18g | SU 3.0° 0.75s 2.18g | no 26%        0.52g | no 102%       2.02g
e34        2.87 1.79g | no 23%        0.65g | no 62%        1.95g | no 84%        1.95g | SU 12.0° 0.86s 1.99g | SU 3.0° 0.73s 1.99g | no 26%        0.51g | no 102%       2.00g
bus        1.87 1.17g | no 32%        0.59g | no 99%        1.92g | SU 0.7° 0.23s 1.92g | SU 4.3° 0.79s 1.94g | SU 1.7° 0.44s 1.94g | no 45%        0.55g | SU 4.0° 0.76s 1.91g
ambulanza  2.07 1.29g | no 26%        0.54g | no 92%        2.00g | SU 11.3° 0.82s 2.12g | SU 12.0° 0.90s 2.14g | SU 3.0° 0.79s 2.14g | no 35%        0.48g | SU 10.9° 0.87s 2.09g
```

## 0. Esito delle prove (v0.145, banco `node strumenti/impennata.js`)
Dove sta: fisica in `sim.js` (`SupraSim.impennata`, segnata `[IMPENNATA]`), pezzi e interruttore in `impennata.js`,
grafica in `street2d.js` (cassa che ruota attorno alle ruote dietro, ruota davanti che si stacca, muso leggero),
niente cambio corsia con le ruote davanti per aria (`game.steer`), test in `test/impennata.test.js`.

Partenze vere col motore e le gomme del gioco: frizione lasciata a 3/4 del limitatore, gomme in temperatura,
preparazione massima (slick, motore al massimo, volano pesante). «serve» = accelerazione della cassa che alza il muso
col 4-link da drag (G 1,6); la percentuale = quanta ne arriva davvero.

```
% = quanta della coppia che serve per alzare il muso c'è (100 % = si alza). g = accelerazione massima
auto       b/h  serve | di serie          | max, ponte serie   | max, 4-link        | max, 4-link drag   | drag + bar         | drag, bagnato      | drag + controllo trazione
supra      2.82 1.76g | no 24%        0.66g | no 40%        1.24g | no 54%        1.24g | no 64%        1.24g | no 64%        1.24g | no 48%        0.92g | no 66%        1.28g
r5         2.11 1.32g | no 35%        0.74g | no 63%        1.47g | no 86%        1.47g | SU 0.1° 0.00s 1.53g | SU 0.1° 0.00s 1.53g | no 75%        1.09g | no 95%        1.38g
b2002      2.60 1.62g | no 23%        0.61g | no 38%        1.06g | no 51%        1.06g | no 60%        1.06g | no 60%        1.06g | no 45%        0.79g | no 62%        1.09g
e30        2.83 1.77g | no 22%        0.63g | no 33%        1.02g | no 44%        1.02g | no 52%        1.02g | no 52%        1.02g | no 39%        0.76g | no 56%        1.09g
e36        2.88 1.80g | no 23%        0.65g | no 33%        1.05g | no 45%        1.05g | no 53%        1.05g | no 53%        1.05g | no 40%        0.79g | no 57%        1.13g
e34        2.87 1.79g | no 23%        0.65g | no 33%        1.04g | no 45%        1.04g | no 53%        1.04g | no 53%        1.04g | no 40%        0.78g | no 57%        1.11g
bus        1.87 1.17g | no 32%        0.59g | no 58%        1.13g | no 78%        1.13g | no 93%        1.13g | no 93%        1.13g | no 69%        0.84g | no 93%        1.13g
ambulanza  2.07 1.29g | no 26%        0.54g | no 45%        0.98g | no 61%        0.98g | no 72%        0.98g | no 72%        0.98g | no 54%        0.73g | no 75%        1.02g
```

Cosa dicono i numeri, da R&D:
- **Il limite è la gomma, non il motore.** Già di serie la Supra pattina in prima: tutta la coppia in più finisce in
  fumo. Con slick (μ ≈ 1,97) e il 47 % del peso dietro l'accelerazione massima possibile è μ·0,47/(1 − μ·h/wb) ≈ 1,47 g
  in teoria, 1,24-1,28 g nel gioco (sensibilità al carico, gomma non sempre allo slittamento giusto). Per alzare il muso
  ne servirebbero 1,76: **la Supra non impenna su strada, punto.** Le BMW (b/h 2,6-2,9) men che meno.
- **La R5 Turbo 2 è l'unica che ci arriva**: motore centrale (60 % del peso sulle ruote che spingono), corta e leggera.
  Col 4-link da drag il muso **tentenna**: si alleggerisce (86-95 %) e nella partenza migliore si stacca per un attimo
  (0,1°). È quello che succederebbe a una vera.
- **Bus** al 93 %: baricentro alto e peso dietro, ma la gomma non tiene abbastanza. Ambulanza 72 %.
- **Bagnato**: −20 % di presa, nessuna ci va vicino. **Trazione anteriore**: mai, nemmeno forzando la geometria.
- **Cosa servirebbe a una Supra**: una pista da drag preparata (μ 2,5 e oltre con gomme da drag) o il baricentro
  spostato molto indietro. Nessuna delle due esiste nel gioco oggi: se un giorno arriva una pista da drag, l'impennata
  arriva da sola.

Una correzione rispetto alla proposta: G (la geometria del ponte) **non** aumenta il carico sulle gomme. Il peso che
passa dietro dipende solo da accelerazione, baricentro e passo; la geometria cambia il colpo che la cassa riceve nella
partenza. Nella prima versione G entrava anche nel carico e faceva tenere di più le gomme (R5 fino a 5°): non era vero
e l'ho tolto. Il carico dietro in partenza ora può salire fino a tutto il peso (prima il tetto era 1,9 volte quello da
fermo), ma solo con il progetto acceso.

La grafica (prova nel browser forzando l'angolo): fino a 2,5° (wheelie bar) si legge pulito; a 7,5° la cassa a pixel
fa i gradini della rotazione ma si capisce bene il muso su e la ruota davanti staccata. Il «muso leggero» sopra
l'85 % è un filo di salita della cassa (0,8°) senza staccare la ruota.

---

---

## 1. Verdetto in breve
- **Si può fare bene** perché `sim.js` ha già quasi tutto: trasferimento di carico in accelerazione col beccheggio a
  molla (`pz`, `pzV`), altezza del baricentro (`cgH`, `dcg` dell'assetto), passo (`wb`), peso sull'asse motore
  (`rearW`/`driveW`), gomme Pacejka con temperatura e pioggia (`tireGrip`), frizione con capacità (`clutchMax`),
  volano (`VOLANO_LV`), launch control, slick da drag (`genSlick`).
- **La cosa onesta da dire subito**: un'auto da strada sull'asfalto **non** impenna per la sola presa delle gomme. Serve
  che la gomma spinga più di `b/h` volte il peso (vedi §2), e con i numeri delle nostre auto è 2,1-2,9: nessuna gomma
  stradale ci arriva. Le auto vere che impennano (drag) ci arrivano con **slick, sospensioni che alzano la cassa
  (anti-squat sopra il 100 %, 4-link, barre di reazione), tanto peso dietro, baricentro alto e il colpo della frizione**.
  Quindi nel gioco l'impennata sarà **rara e guadagnata**: è proprio quello che la rende bella.
- **Trazione anteriore: mai** (si autoannulla: alzando il muso togli peso alle ruote che spingono). È fisica, non un
  limite messo a mano. Oggi nel gioco sono a trazione posteriore solo la Supra, R5 Turbo 2, BMW 2002 Turbo, E30, E36,
  E34 (più bus e ambulanza, per ridere): le candidate sono quelle.
- **Pioggia**: presa −20 % (`sim.wet`) → la gomma pattina prima di alzare il muso. Esce da sola dal modello.

## 2. La fisica (con i nomi delle variabili del gioco)
Auto vista di lato, ruote posteriori motrici. `W = m·g` peso, `h` = altezza del baricentro (`cgE` = `cgH + dcg`),
`wb` = passo, `b` = distanza del baricentro dall'asse posteriore = `wb · (1 − rearW)` (`rearW` = quota di peso dietro).

**Carichi sugli assi in accelerazione** (già così in `sim.js`, righe del trasferimento):
- `Nf = W·(1 − rearW) − m·a·h/wb` (davanti)  `Nr = W·rearW + m·a·h/wb` (dietro)
- Il muso si stacca quando `Nf = 0`, cioè quando `a ≥ g · b / h`.

**Quanta spinta può dare la gomma**: `Ft ≤ μ_eff · Nr`. Nel momento del distacco tutto il peso è dietro (`Nr = W`),
quindi serve `μ_eff ≥ b / h`. Con il fattore delle sospensioni (sotto) la condizione diventa:

```
μ_eff · G ≥ b / h          G = geometria della sospensione posteriore (1 = di serie, fino a ~1,6 col 4-link)
μ_eff = mu · tr · gomma · tireGrip    (nel gioco: mu dell'auto × 1,08 × 1,5 con le slick × fino a 1,03 se calde)
```

**Il fattore G (anti-squat).** Le barre che tengono il ponte posteriore spingono sulla cassa quando la gomma tira: con
una geometria «da drag» (centro istantaneo alto e corto) la spinta della gomma alza il muso più di quanto farebbe il solo
baricentro. Di serie le nostre auto sono sotto il 100 % (la coda si siede: `G` = 1, come oggi). Il pezzo nuovo
«barre di reazione / 4-link regolabile» porta `G` a 1,15 / 1,35 / 1,6.

**I numeri delle nostre auto a trazione posteriore** (da `cars.js`; `μ_eff` con slick calde, asciutto):

| Auto | Peso dietro | b/h (serve) | μ_eff con slick | G che serve | Coppia al motore che serve con G 1,6 (stima) |
|---|---|---|---|---|---|
| R5 Turbo 2 (motore centrale) | 60 % | **2,11** | 1,80 | **1,17** | ~320 Nm (di serie 189: con un po' di turbo ci arriva) |
| BMW 2002 Turbo | 46 % | 2,60 | 1,67 | 1,56 | da calcolare |
| Supra | 47 % | 2,82 | 1,84 | 1,53 | ~800 Nm (2JZ preparato al massimo: sì) |
| BMW M3 E30 | 47 % | 2,83 | 1,75 | 1,62 | ~575 Nm (di serie 287: serve uno swap o turbo grosso) |
| BMW M5 E34 | 48 % | 2,87 | 1,79 | 1,61 | da calcolare |
| BMW M3 E36 | 49 % | 2,88 | 1,79 | 1,61 | da calcolare |
| Bus (per ridere) | 62 % | 1,87 | 0,9 di serie | — | servirebbe una slick da autobus: no |

Lettura: **la R5 Turbo 2 è la regina** (motore dietro, è vero anche nella realtà), la **Supra** ci arriva solo
preparata al massimo con slick e 4-link, le BMW aspirate di serie mai (serve potenza). Senza slick non impenna nessuno.
Sul bagnato nemmeno con tutto. Le cifre «da calcolare» le fa lo strumento del passo 1 del piano (§6).

**Il colpo della frizione.** In partenza la coppia vera non è quella della curva del motore: lasciando la frizione a
giri alti il volano scarica la sua energia (`½·Ie·ω²`) e la frizione passa fino alla sua capacità (`clutchMax`). Quindi:
- **volano pesante** (×1,4) = colpo più forte = impenna meglio (vero nel drag: si usano volani pesanti per partire);
  il superleggero aiuta il motore a salire di giri ma impenna peggio;
- **frizione da corsa** (regge ×3): passa tutto il colpo; quella di serie slitta e lo mangia;
- **launch control** a giri alti: il colpo arriva sempre uguale;
- tutto questo **c'è già** nel gioco: l'impennata lo userà, non lo rifà.

**Il moto del muso** (fase per fase, passo della fisica 1/4000 s come il resto):
1. *Si siede*: il beccheggio esistente (`pz`) carica il dietro, la sospensione davanti si allunga (corsa ~6-8 cm).
2. *Stacca*: quando `Nf` arriva a zero la ruota davanti lascia l'asfalto. Da qui l'auto ruota attorno al punto di
   contatto delle gomme dietro: `I·θ'' = Ft·h·G − W·(b·cosθ − h·sinθ) − c·θ'` (I = momento d'inerzia di beccheggio
   attorno alle ruote dietro ≈ m·(1,1² + b² + h²); `c` smorzamento).
3. *Tetto*: con la **wheelie bar** l'angolo si ferma a ~2-3° (le rotelline toccano: scintille). Senza, a ~7-8° tocca il
   paraurti posteriore: strisciata, scintille e un po' di danno. **Non si ribalta mai** (limite duro).
4. *Ricade*: cambiata, gas mollato o presa che finisce → il muso scende per gravità e la sospensione davanti lo prende:
   botta (`bump`), rimbalzo, e se la caduta è da più di ~5° un po' di danno all'avantreno.

**Cosa cambia nella guida mentre il muso è su**: niente sterzo (non cambi corsia finché la ruota non tocca), in frenata
lavora solo il dietro (frena peggio, come vero), la spinta resta tutta dietro (l'accelerazione non cala: anzi, il carico
è tutto sulle ruote motrici).

## 3. Come si vede (pixel art, senza schifezze)
- **Inclinazione a «taglio verticale», non rotazione**: ruotare un disegno a pixel lo sporca (scalette). Il disegno
  dell'auto ha già un `skew` nel tf (`frame` di `street2d.js`): per angoli fino a 7-8° un taglio verticale attorno al
  punto di contatto dietro è indistinguibile da una rotazione e tiene i pixel netti. Oltre si vedrebbe allungato: ecco
  un motivo in più per il tetto a 8°.
- **Ruota davanti staccata**: le ruote sono disegnate a parte (`genWheel`): la anteriore sale col muso e in più «pende»
  di 1-2 pixel (la sospensione tutta allungata). Smette di girare per attrito? No: gira ancora per inerzia, rallenta
  piano. Bel dettaglio.
- **Ombra**: davanti si accorcia e si schiarisce, sotto la ruota sollevata la luce dell'asfalto torna.
- **Fari**: il fascio (`fxBeam`) si alza col muso e illumina più lontano: di notte si vede l'impennata anche dal fascio.
- **Effetti**: fumo dalle gomme dietro (già c'è), scintille dalla wheelie bar o dal paraurti, polvere all'atterraggio,
  piccola scossa della telecamera alla ricaduta (regola di `game-feel`: senza esagerare).
- **Suono**: gomma che stride, colpo sordo all'atterraggio, sfregamento delle rotelline (sintetizzati, niente campioni presi da altri).
- **Pilota**: si schiaccia sul sedile (testa indietro di 1 pixel) e fa la faccia di stupore (`awe` di `pgDriver` già c'è); la
  nuvoletta di `reazioni.js` può avere i suoi versi.

## 4. Pezzi e regolazioni (da Luca Tuning)
Nuovi (proposta, prezzi e km da decidere):
- **Barre di reazione / 4-link regolabile**: tre livelli, `G` 1,15 / 1,35 / 1,6. Effetto anche senza impennata: partenze
  migliori (meno saltellamento, più carico dietro). Solo trazione posteriore.
- **Wheelie bar**: sì/no. Con la barra l'impennata resta bassa e controllata (più veloce sul 400 m); senza, più alta e
  scenica ma ruba tempo e rischia il paraurti.
- **Ammortizzatori anteriori 90/10** (da drag): il muso si alza più in fretta e ricade morbido. Cambia il *come*, non il *se*.
- **Zavorra dietro / batteria nel bagagliaio**: +2-3 % di peso dietro (abbassa `b`).

Già nel gioco e che contano (niente da rifare): slick da drag, volano pesante, frizione da corsa, launch control,
assetto (altezza da terra → `dcg`: **più alta = baricentro alto = impenna meglio**, il contrario di quello che si fa per
le curve: scelta vera da preparatore), turbo e centralina per la coppia.

## 5. Interruttore «Progetto impennata»
- Scheda **Sviluppatori**, riquadro «Progetto impennata · in prova», pulsante acceso/spento; `localStorage nr_impennata`,
  **di serie spento**. Come il vecchio Pistone: ogni aggancio fuori dal file nuovo segnato `[IMPENNATA]`.
- **Spento = gioco identico a oggi**: stessi limiti di carico in `sim.js` (`Nr ≤ 1,9·Nr0`, `Nf ≥ 0,15·W`), stessa grafica,
  stessi test che passano. I pezzi nuovi non compaiono in officina.
- Acceso: si tolgono quei due limiti per le auto a trazione posteriore, entra il moto del muso e la grafica.

## 6. Piano di lavoro (a passi, ognuno provato prima del successivo)
1. **Strumento di calcolo** `strumenti/impennata.js`: per ogni auto e preparazione dice `b/h`, `μ_eff`, coppia alle
   ruote in prima, se impenna e a che angolo; completa la tabella del §2. Nessun cambio al gioco.
2. **Fisica** in un file nuovo `impennata.js` (dopo `sim.js`): `θ`, `θ'`, contatto davanti, tetto, ricaduta, eventi
   (`wheelieUp`, `wheelieLand`); aggancio in `sim.js` solo dietro l'interruttore. Test in `test/impennata.test.js`:
   trazione anteriore mai; slick fredde no, calde sì (sulla R5 preparata); bagnato no; Supra di serie no, Supra al
   massimo col 4-link sì; con wheelie bar angolo ≤ 3°; spento = numeri di `sim.js` identici a oggi.
3. **Pezzi** (4-link, wheelie bar, ammortizzatori 90/10, zavorra) in `cars.js`/`tuning.js` dietro l'interruttore.
4. **Grafica**: taglio verticale, ruota davanti, ombra, fari, scintille, scossa; foto con `strumenti/prova.js` a 0, 2, 5,
   8° prima di dire che è fatto. Se a occhio è una porcata, si ferma qui e si dice.
5. **Suono** e reazione del pilota.
6. **Taratura sul PC vero** (Luca e Nico): quanto spesso succede, quanto dura, quanto è alto.

## 7. Domande per domani (rispondi per numero)
1. Impennata **rara e guadagnata** (come proposto: serve il mix giusto) o un po' più facile per divertimento?
2. Solo le auto a trazione posteriore (fisica vera) o la vuoi anche su qualche trazione anteriore «per scena»? (Sconsigliato.)
3. Senza wheelie bar a 7-8° deve rovinare il paraurti (danno vero) o solo scintille?
4. I quattro pezzi nuovi del §4 vanno bene? Prezzi e km li decidi tu.
5. Sul banco a rulli e nel 400 m deve contare (con la barra si va più forte, senza si perde tempo)?
