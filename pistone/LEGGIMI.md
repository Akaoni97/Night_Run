# Nico e il motore (pezzi a livelli, banco di lavoro, motori costruiti)

**Stato (20/11/2026 sera): integrato da Luca, per ora solo sulla V40.** Il cognato (Luca) gestisce i motori: deciso
con il proprietario che il negozio dei pezzi motore è uno solo, **Da Luca Tuning**, dove lavora **Nico**. Il Pistone
non è più una tappa a parte (il secondo bar di ogni giro è tornato un bar). Quando la struttura sarà completa sulla V40
si estende alle altre auto. L'interruttore resta (scheda Sviluppatori): spento, tutto torna come prima del Pistone.

## Come si gioca adesso
- **Pezzi singoli a livelli.** Da Luca, nella parte di Nico, compri un pezzo alla volta (se Nico ti ha insegnato quel
  livello del reparto). Il pezzo va in **magazzino**: un pezzo, un posto (`game.s.vg.mot.pz`, ogni pezzo ha `dove`:
  `'mag'`, `'banco'` o l'id dell'auto). Si rivende al 55 %.
- **Sul motore originale della V40** si monta tutto tranne il blocco (`motPut(u, 'v40')`). Manodopera di Nico:
  € 380 per i pezzi dentro il motore (albero, bielle, pistoni, pompa dell'olio, testata, camme), € 90 per gli altri
  (`MOT_LAVORO`, `MOT_INTERNI`). Il motore di serie è descritto in `MOT_SERIE.v40` (blocco virtuale `s_v40` e i pezzi di
  serie che corrispondono a quelli veri): la curva vera della V40 resta la sua e i pezzi la cambiano in proporzione
  (`motCalcSerie`, `motApplySerie`); turbo, centralina, intercooler, frizione, calore e affidabilità come per i motori
  costruiti.
- **Banco di lavoro**: un motore sul cavalletto che ti aspetta sempre. Ci metti i pezzi man mano (`motPut(u, 'banco')`);
  quando ci sono tutti i 14 reparti si accende (`motBuildBanco`, scena del montaggio) e diventa un motore da montare su
  qualsiasi auto (swap). I pezzi usati escono dal magazzino.
- **Luca** sulla V40 non vende più turbo, intercooler, centralina e frizione (`MOT_LUCA_VIA`, `tuningNascosto`) né le
  preparazioni pronte: restano suoi scarico, aspirazione, limitatore, gomme, assetto, differenziale e alleggerimento.
  Chi li aveva comprati (salvataggi vecchi) se li vede rimborsati a prezzo pieno una volta sola (`motLucaMigra`).
- **Prezzi** tarati sull'economia (~€ 290 netti al km di lavoro): insegnare un livello costa € 300 / 900 / 2.400
  (livello 2, 3, 4) con km di viaggio (10 / 45 / 110), pezzi montati (4 per il 3, 10 per il 4) e un motore costruito
  per il 4. Una V40 sui 200 CV costa circa € 7.000 tra pezzi e livelli; un motore da 600 CV più di una Supra.

## I file di questa cartella
| File | Cosa c'è |
| --- | --- |
| `motori.js` | La logica, senza grafica: interruttore (`PISTONE`), pezzi e livelli (`MOT_PARTI`, `MOT_LIV`), il calcolo del motore (`motCalc`), i livelli che insegna Nico (`motNext`, `motUnlock`), pezzi e magazzino (`motBuyPart`, `motPut`, `motTake`, `motSellPart`), banco (`motBuildBanco`), motore di serie della V40 (`MOT_SERIE`, `motCalcSerie`, `motApplySerie`), Luca senza i pezzi motore della V40 (`tuningNascosto`, `motLucaMigra`), rotture e calore in strada (`motTick`, `motCalore`), lo swap (`motApply`). Caricata anche dai test. |
| `motori2d.js` | La grafica: il motore disegnato di lato (`drawEngine`), il pannello di Nico dentro Da Luca Tuning, a schede (Livelli, La mia auto, Negozio, Magazzino con tetto di 100 pezzi, Banco, Motori), la scena del montaggio a tutto schermo. La facciata e l'interno del vecchio Pistone ci sono ancora ma non si usano. |
| `LEGGIMI.md` | Questo file. |

## Accenderlo, spegnerlo, toglierlo
- **Interruttore**: scheda Sviluppatori del menu, riquadro «Il Pistone» (oppure `localStorage.nr_pistone = '0'` e
  ricarica). Spento: i motori costruiti e i pezzi sulla V40 non contano (restano nel salvataggio, riaccendendo tornano)
  e Luca torna a vendere i suoi pezzi motore della V40. Costante `PISTONE.on` in `motori.js`.
- **Ogni aggancio fuori da questa cartella è segnato `[PISTONE]`**: `git grep -n "\[PISTONE\]"` li trova tutti.
  Oggi sono:
  - `index.html`: i due `<script>`, `motApply` in `applySettings`, il pannello di Nico nel ramo `shop` di `openPlace`
    (e il vecchio ramo `motori`), i reparti motore della V40 nascosti da Luca e le preparazioni pronte nascoste
    (`renderTuning`, `mountPart`), il rimborso dei salvataggi vecchi (`motLucaMigra`), la lettera M sulla mappa
    (`PLACE_ICON`), l'avviso da Luca con un motore costruito montato, le registrazioni della Supra spente con un motore
    costruito (`dspCfg`);
  - `sim.js`: bilancio di calore (`tune.cool`), protezione (`hotK`), pressione dell'olio (`tune.oilRpm`) — senza un
    motore del Pistone non fanno niente;
  - `sviluppatori.js`: il riquadro del Pistone;
  - `valigette.js`, `sfascio.js`: niente pezzi motore di Luca della V40 tra i premi e i pezzi usati;
  - `test/motori-costruiti.test.js`.
- **Toglierlo del tutto**: cancellare la cartella `pistone/` e il test, togliere le righe `[PISTONE]` (in `sim.js` i
  tre punti tornano come prima togliendo il blocco `cool` e i due fattori), le righe di `pistone/` in `AGENTS.md`
  e il paragrafo in `PASSAGGIO.md`. Nei salvataggi resta `game.s.vg.mot`, che nessuno legge più. Il secondo bar di ogni
  giro torna da solo.

Fuori da questa cartella **non** fanno parte del Pistone (restano anche se lo togli): Officina Mario (era Niko),
la revisione dei documenti e del motore stanco delle usate, il tuning di Luca.

## Chi è chi
- **Nico**: il motorista del Pistone. Ti insegna i pezzi un livello alla volta e monta i motori con te sul cavalletto.
  Destinato a diventare un personaggio quasi principale.
- **Mario**: l'officina dei tagliandi, revisioni, gomme, carrozziere (nel codice l'id resta `niko` per i salvataggi).

## Da non confondere
Nel gioco ci sono cose con nomi simili che non sono i motori del Pistone:
- **Da Luca Tuning** (`tuning.js`, `cars.js`): i pezzi per il motore *di serie* di ogni auto (turbo, intercooler,
  centralina, camme, frizione, scarico, aspirazione, gomme, assetto...). Con un motore del Pistone montato, turbo,
  intercooler, centralina, camme e frizione li decide il motore del Pistone (`motApply`): quelli di Luca tornano a
  contare quando rimetti il motore di serie. Scarico, aspirazione (`pw`), gomme, assetto, differenziale, cambio e peso
  restano quelli di Luca: per questo in strada i CV possono essere un po' diversi da quelli della scheda del Pistone.
- **Banco prova a rulli** (`banco.js`, da Luca): misura i CV dell'auto vera sui rulli. Il **banco di montaggio** del
  Pistone (`motori2d.js`) è dove monti il motore pezzo per pezzo.
- **Revisioni**: la revisione dei documenti (`documenti.js`) e la revisione del motore stanco delle auto usate
  (`usato.js`) le fa **Mario**. Al Pistone un motore rotto si **rifà** (`motRepair`).
- **Test**: `test/motori.test.js` è il vecchio «Banco Suono 2JZ» (fisica e suono di tutte le auto), non il Pistone.
  Le prove del Pistone sono in `test/motori-costruiti.test.js`.
- **Nico**: è anche il nome del proprietario del repository; nel gioco è il motorista del Pistone.

## Come funziona
- Un motore è un pezzo per reparto, montati dal basso in alto (l'ordine di `MOT_PARTI` è l'ordine del banco di montaggio).
- Ogni pezzo ha un **livello** (`lv`, da 1 a 4). Si parte conoscendo il livello 1 di tutto. Nico insegna il livello dopo
  di un reparto per soldi, e dal 3 vuole anche km di viaggio e motori costruiti (`MOT_LIV`); alcuni livelli vogliono
  prima un certo livello di un altro reparto (`dip`). Stato in `game.s.vg.mot.liv`. Fuori dalla carriera è tutto sbloccato.
- I livelli si possono mescolare: conta che i pezzi vadano d'accordo. `motCalc` controlla:
  - **robustezza**: `reg` = CV che regge un pezzo per cilindro; blocco, albero, bielle e pistoni. Oltre, l'affidabilità
    scende e tirandolo al limitatore si rompe;
  - **benzina**: iniettori (CV per cilindro) e pompa (CV in tutto). Se non bastano va magro e la potenza si ferma;
  - **aria**: col turbo, i bar oltre quelli che l'intercooler raffredda (`caldo`) = aria calda, battito, più calore;
  - **battito**: compressione alta col turbo, la 2618 oltre i 2 bar, aria troppo calda; la centralina da gara lo
    sente (`knockCtl`);
  - **olio**: giri del limitatore oltre quelli della pompa (`oilOver`) = bronzine che soffrono;
  - **frizione**: coppia del motore oltre quella che tiene = slitta (lo fa davvero la fisica: `clutchMax`);
  - **calore**: kW che il motore butta nell'acqua a piena potenza (`qIn`, il 60 % della potenza, di più col turbo,
    magro o aria calda) contro i kW del radiatore e del radiatore dell'olio a 100 all'ora con l'acqua a 105 °C (`qOut`).
- In strada `sim.js` integra la temperatura dell'acqua: calore che entra dalla potenza vera, calore che esce dal
  radiatore secondo l'aria (ventola da fermi, vento in corsa) e il termostato. Oltre `prot` (112-118 °C secondo il
  radiatore) la centralina taglia la potenza fino al 45 %; oltre `prot + 8` per `MOT.cottura` secondi salta la
  guarnizione della testata e il motore è da rifare. Al minimo da fermo la ventola lo raffredda.
- I motori costruiti prima dei reparti nuovi (olio, intercooler, benzina, radiatore, frizione) li prendono da soli,
  i più economici che non li limitano (`motFill`, `MOT_NUOVI`).

## Ritoccare i numeri
- Prezzi dei livelli e requisiti: `MOT_LIV` in `motori.js`.
- Calore: `MOT.quotaAcqua` (quota della potenza che va nell'acqua), `MOT.capTermica` (più alta = scalda e raffredda più
  piano), `MOT.cottura` (secondi prima che salti la guarnizione).
- Ogni pezzo: i suoi numeri in `MOT_PARTI` (il significato di ogni campo è nel commento sopra l'elenco).

## Aggiungere un pezzo
1. Una voce nel reparto giusto di `MOT_PARTI` con `id` nuovo (mai cambiare gli `id` vecchi: sono nei salvataggi),
   `lv`, `name`, `price`, `kg`, `note` e i campi del reparto (guarda gli altri pezzi dello stesso reparto).
2. Se cambia l'aspetto, un ramo in `drawEngine` (`motori2d.js`).
3. Una prova in `test/motori-costruiti.test.js`, poi `node --test test/*.test.js`.

## Aggiungere un reparto
1. Un elemento in `MOT_PARTI` al punto giusto dell'ordine di montaggio, coi livelli da 1 a 4 (il primo pezzo è quello
   di serie) e `dip` se serve.
2. Il suo id in `MOT_NUOVI` (così i motori già costruiti lo ricevono) e la regola in `motFill`.
3. Il suo effetto in `motCalc` (ed eventualmente in `motApply` e `sim.js`, con un default che lascia le auto di serie
   come sono), il disegno in `drawEngine`, gli avvisi in `sheet` (`motori2d.js`), i test.

## I pezzi oggi
(La fonte vera è `MOT_PARTI` in `motori.js`: se cambi i pezzi aggiorna anche questa tabella.)

### Blocco (`blocco`)

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | 4 cilindri 1.6 in alluminio (`b4_16`) | 900 | Leggero e piccolo: sale di giri volentieri, regge poco (sui 280 CV). |
| 1 | 4 cilindri 2.0 in ghisa (`b4_20`) | 1400 | Pesante ma duro: la base classica per il turbo, regge sui 440 CV. |
| 2 | 5 cilindri 2.3 in alluminio (`b5_23`) | 2600 | Cinque cilindri: uno scoppio ogni 144°, la voce rauca e storta. |
| 2 | 6 cilindri 2.5 in alluminio (`b6_25`) | 3200 | Sei in linea: liscio come la seta, urla in alto. |
| 3 | 6 cilindri 3.0 in ghisa (`b6_30`) | 4800 | Sei in linea di ghisa con sette supporti di banco: regge sui 700 CV. |
| 4 | 4 cilindri 2.0 closed deck (`b4_20cd`) | 4200 | Canne chiuse in testa e camicie in acciaio: le guarnizioni non si muovono più. Sui 680 CV. |
| 4 | 6 cilindri 3.0 closed deck (`b6_30cd`) | 7500 | Il blocco da mille cavalli: canne chiuse, camicie in acciaio, banco rinforzato. |

### Albero motore (`albero`)
Prima di: livello 3: Blocco 2 · livello 4: Blocco 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | In ghisa (`fuso`) | 400 | Di serie: va bene finché non esageri. |
| 2 | Forgiato (`forg`) | 1300 | Acciaio forgiato e temprato: regge giri e potenza. |
| 3 | Forgiato a corsa lunga (`stroker`) | 1900 | +10 % di cilindrata: più coppia in basso, ma i pistoni corrono di più e sale meno di giri. |
| 4 | Ricavato dal pieno (billet), equilibrato (`billet`) | 2900 | Fresato da un blocco di acciaio e bilanciato al grammo: niente vibrazioni fino a 9500 giri. |

### Bielle (`bielle`)
Prima di: livello 3: Albero motore 2 · livello 4: Albero motore 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie, in ghisa (`fuse`) | 300 | Il punto debole di ogni motore spinto: sopra i 45 CV a cilindro si piegano. |
| 2 | Forgiate ad H (`h`) | 900 | Le prime da mettere se vuoi il turbo. |
| 3 | Forgiate ad H con viti ARP (`harp`) | 1400 | Le viti delle bielle sono quelle che cedono per prime in alto: queste no. |
| 4 | In titanio (`ti`) | 2200 | Leggerissime: meno massa che va su e giù, il motore prende giri come una moto. |

### Pistoni (`pistoni`)
Prima di: livello 3: Bielle 2 · livello 4: Bielle 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Fusi, compressione 10:1 (`std`) | 350 | Di serie: un po' di turbo lo reggono, non tanto. |
| 2 | Ipereutettici, compressione 10:1 (`ipe`) | 600 | Lega con più silicio: dilatano meno e reggono più calore di quelli fusi. |
| 3 | Forgiati, compressione bassa 8,5:1 (`low`) | 1000 | Fatti per il turbo: meno spinta da aspirato, reggono pressioni alte senza battere. |
| 3 | Forgiati, compressione alta 11,5:1 (`high`) | 1100 | Per l'aspirato: +6 % di coppia. Col turbo battono in testa. |
| 4 | Forgiati 2618, 9,5:1, cielo rivestito (`g2618`) | 2200 | Lega 2618 e rivestimento ceramico sul cielo: buoni da aspirato, col turbo battono solo oltre i 2 bar. |

### Pompa dell'olio (`olio`)
Prima di: livello 3: Albero motore 2 · livello 4: Albero motore 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie (`serie`) | 120 | Sopra i 7000 giri la pressione cala: le bronzine lavorano col film d'olio sottile. |
| 2 | Maggiorata (alta portata) (`hv`) | 450 | Più olio a ogni giro: pressione piena fino a 8000. |
| 3 | Maggiorata con radiatore dell'olio (`hvr`) | 1100 | Il radiatore dell'olio porta via calore anche lui: l'acqua respira. |
| 4 | Carter secco a tre stadi (`secco`) | 3800 | Serbatoio a parte e pompa a stadi: l'olio non sbatte in curva e non manca mai. |

### Testata (`testata`)
Prima di: livello 3: Alberi a camme 2 · livello 4: Alberi a camme 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | 2 valvole per cilindro, monoalbero (`v2`) | 600 | Coppia in basso, tranquilla: in alto finisce presto. |
| 2 | 4 valvole per cilindro, bialbero (`v4`) | 1500 | Il giusto mezzo: piena dappertutto. |
| 3 | 4 valvole, condotti lucidati a mano (`v4p`) | 2600 | Respira meglio in alto: allunga e spinge fino in fondo. |
| 4 | 4 valvole al sodio, molle doppie (`v4r`) | 4300 | Valvole cave col sodio dentro che le raffredda, molle doppie: niente sfarfallio fino a 8700. |

### Alberi a camme (`camme`)
Prima di: livello 2: Testata 2 · livello 3: Testata 3 · livello 4: Testata 4

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie (`serie`) | 250 | Minimo regolare, guidabile. |
| 2 | Sportivi (264°) (`sport`) | 700 | Il minimo comincia a scalciare, in alto c'è di più. |
| 3 | Da gara (280°) (`gara`) | 1300 | Minimo che galoppa, in basso vuoto, in alto esplode. |
| 4 | Con variatore di fase continuo (`vvt`) | 2600 | La centralina sposta le camme coi giri: piena in basso come le serie, in alto quasi come le gara. |

### Sovralimentazione (`sovra`)
Prima di: livello 2: Pistoni 2, Iniettori 2 · livello 3: Centralina 3, Intercooler 2 · livello 4: Intercooler 3, Bielle 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Aspirato (`na`) | 0 | Nessun turbo: risposta immediata. |
| 1 | Turbo piccolo (0,7 bar) (`tp`) | 2200 | Si sveglia presto, spinta dolce. |
| 2 | Compressore volumetrico (0,6 bar) (`sc`) | 3000 | Spinta subito e sempre, col fischio acuto. |
| 2 | Turbo medio (1,1 bar) (`tm`) | 3600 | Un po' di ritardo, poi una bella botta. |
| 3 | Turbo grande (1,6 bar) (`tg`) | 5200 | Sotto i 3500 giri dorme. Poi una catapulta. |
| 4 | Turbo a cuscinetti a sfere (1,8 bar) (`tgs`) | 7400 | La girante gira sulle sfere invece che sull'olio: grande ma pronto come un medio. |

### Intercooler (`intercooler`)

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Nessuno (`no`) | 0 | L'aria compressa entra calda: meno ossigeno, più battito, più calore nel motore. |
| 2 | Frontale piccolo (`fms`) | 700 | Basta fino a 0,8 bar. |
| 3 | Frontale grande (`fmg`) | 1500 | Fino a 1,5 bar l'aria resta fresca. Tubi lunghi: un filo di ritardo in più. |
| 4 | Aria-acqua, con pompa e radiatorino (`aa`) | 3200 | Vicino al collettore, tubi corti: aria fredda e risposta pronta. |

### Iniettori (`iniettori`)
Prima di: livello 3: Pompa della benzina 2 · livello 4: Pompa della benzina 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | 250 cc (`i250`) | 200 | Bastano per un aspirato tranquillo (42 CV a cilindro). |
| 2 | 440 cc (`i440`) | 600 | Per un turbo normale (75 CV a cilindro). |
| 3 | 750 cc (`i750`) | 1100 | Benzina per tutto quello che vuoi fare (135 CV a cilindro). |
| 4 | 1000 cc (`i1000`) | 1700 | Da gara: 175 CV a cilindro. Al minimo vanno tarati bene. |

### Pompa della benzina (`benzina`)

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie (`serie`) | 150 | Porta benzina per circa 230 CV in tutto. |
| 2 | Maggiorata, 255 litri l'ora (`p255`) | 450 | La classica: fino a circa 420 CV. |
| 3 | Doppia pompa nel serbatoio (`dop`) | 1100 | Due pompe insieme: fino a circa 650 CV. |
| 4 | Meccanica, con regolatore e polmone (`mecc`) | 2400 | Trascinata dal motore: la portata sale coi giri, non resta mai a secco. |

### Centralina (`centralina`)
Prima di: livello 3: Iniettori 2 · livello 4: Sovralimentazione 3

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie (`serie`) | 300 | Non sopra 0,6 bar, niente launch e scoppi. |
| 2 | Di serie rimappata (`rimap`) | 700 | Mappe riscritte: fino a 1,2 bar e +150 giri. |
| 3 | Programmabile (`prog`) | 1600 | Tutta la pressione del turbo, +300 giri, launch control, pop & bang. |
| 4 | Da gara, col sensore di battito (`gara`) | 3400 | Sente il battito cilindro per cilindro e ritarda l'anticipo prima che il pistone si buchi. |

### Radiatore (`radiatore`)

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Di serie, plastica e alluminio (`serie`) | 150 | Smaltisce circa 70 kW a 100 all'ora: un motore sui 160 CV lo tiene a gas pieno. |
| 2 | Alluminio, due ranghi (`all2`) | 550 | Circa 105 kW: per motori sui 240 CV tirati. |
| 3 | Alluminio, tre ranghi, ventola grande (`all3`) | 1200 | Circa 150 kW e da fermo la ventola tira di più. |
| 4 | Da gara, doppia ventola, tappo a 1,5 bar (`gara`) | 2600 | Circa 210 kW. Il tappo in pressione alza il punto di ebollizione: la protezione scatta più tardi. |

### Frizione (`frizione`)

| Liv. | Pezzo | € | Note |
| --- | --- | --- | --- |
| 1 | Organica di serie (`org`) | 250 | Morbida: oltre 330 Nm slitta. |
| 2 | Rinforzata, spingidisco maggiorato (`rinf`) | 600 | Pedale più duro: tiene 480 Nm. |
| 3 | Cerametallica a pastiglie (`cer`) | 1100 | Attacca di colpo, partire piano è un'arte: tiene 700 Nm. |
| 4 | Bidisco da gara, volano alleggerito (`bid`) | 2600 | Due dischi piccoli: tiene 1050 Nm e il motore sale di giri di scatto. In folle tintinna. |
