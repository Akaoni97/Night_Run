# Night Run — Rapporti dei cambi di serie

## Righe per `GEN_CAMBI`

Le marce sono in ordine dalla prima all'ultima. Il rapporto è espresso come riduzione `giri a monte / giri a valle`. I denti dei finali, dove documentati, sono riportati nelle note come pignone × corona. Una riga con `non trovato` richiede ancora una fonte per compilare il cambio completo.

```text
panda: 4.100 2.158 1.480 1.121 0.897 | finale 3.438 | 175/65 R14 | cambio C514 | sicurezza alta | fonti: [1]
panda141: 3.909 2.056 1.344 0.978 0.837 | finale 3.867 | 135 SR 13 | cambio 5 marce, codice non trovato | sicurezza alta | fonti: [2], [3]
polo: 3.769 1.955 1.212 0.881 0.740 | finale 4.929 | 185/65 R15 | cambio 0DF SND (MQ200-5F) | sicurezza alta | fonti: [4], [5], [6], [7], [8], [49], [50]
twingo: 3.364 1.864 1.321 0.967 0.756 | finale 3.733 | 155/70 R13 | cambio JB1-132 | sicurezza alta | fonti: [9], [10]
p206: 3.455 1.870 1.360 1.051 0.860 | finale 3.789 | 195/55 R15 | cambio BE4/5S DM16–DM17 | sicurezza media | fonti: [12], [13]
p308: 2.875 1.920 1.219 0.861 0.702 0.596 | finale 4.177 | 205/55 R16 | cambio MCM/6H | sicurezza media | fonti: [14], [15]
a3: 3.778 2.118 1.360 1.029 0.857 0.733 | finale 3.647 | 205/55 R16 | cambio 02S RMH (MQ250) | sicurezza alta | fonti: [16], [17], [18], [19], [51], [52]
a80: 3.545 2.105 1.429 1.029 0.838 | finale 4.111 | 195/65 R15 | cambio 012 CCF | sicurezza alta | fonti: [20], [21]
a112: 3.909 2.055 1.342 0.963 0.828 | finale 4.462 | 135 SR 13 | cambio 5 marce, codice non trovato | sicurezza alta | fonti: [22], [23], [24]
doblo: 4.154 2.118 1.361 0.978 0.756 0.622 | finale 3.833 | 185/65 R15 | cambio manuale 6 marce, codice non confermato | sicurezza alta per Cargo Euro 5+ 2013 | fonti: [25], [26], [27]
v850: 3.070 1.770 1.190 0.870 0.700 | finale 4.000 | 205/45 R17 | cambio M56H | sicurezza alta per T-5R 2.3 240 | fonti: [29], [30], [31]
```

## Versioni e controllo della velocità

Calcolo con la circonferenza geometrica della gomma: `v = 0,06 × giri/min × circonferenza in metri / (rapporto marcia × finale)`. La percentuale confronta il valore teorico alla potenza massima con la punta dichiarata. La soglia del ±10% è indicata per ogni auto. Oltre soglia riporto anche il regime in ultima alla punta dichiarata o una marcia più corta, quando calcolabile. I rapporti sono arrotondati a tre decimali e i calcoli usano le frazioni originali quando disponibili. Per la marcatura storica `135 SR 13` ho usato 135/80 R13 come approssimazione geometrica.

### `panda` — Fiat Panda III 1.2 FIRE 8V 69 CV

- Tipo 319, benzina, Pop/Easy/Lounge al lancio. RM 3.818, 940 kg DIN, passo 2.300 mm, 0–100 in 14,2 s. La scheda Fiat riporta anche 185/55 R15 come opzione. [1]
- A 5.500 giri/min: **196,0 km/h in 5ª contro 164 km/h (+19,5%, fuori soglia)**. A 164 km/h la 5ª è a circa 4.600 giri/min, mentre in 4ª a 5.500 giri/min si calcolano 156,9 km/h. La 5ª lunga è documentata nella colonna del 1.2. [1]

### `panda141` — Fiat Panda 1000 FIRE 45 CV

- Panda 1000 CL/S 2WD della gamma 1986, nella configurazione a 5 marce. Finale **15 × 58**, RM 3.727, passo 2.159 mm, massa di riferimento 674 kg nel catalogo olandese e 0–100 in 16,0 s. Il catalogo indica disponibilità sia a 4 sia a 5 marce. [2], [3]
- A 5.000 giri/min: **159,1 km/h in 5ª contro 140 km/h (+13,6%, fuori soglia)**. In 4ª risulta 136,1 km/h, mentre a 140 km/h la 5ª è a circa 4.400 giri/min. I rapporti si riferiscono al 1000 2WD documentato, con il 4×4 in una colonna distinta. [2], [3]

### `polo` — Volkswagen Polo VI 1.0 MPI 75 CV

- AW europeo, CHYB, 0DF SND. La scheda SEAT dell'Ibiza V 1.0 MPI 75 CV dà le cinque marce e RM 3.454. Ibiza e Polo europee condividono motore CHYB, codice SND e ricambio completo **0DF300045F**. Il catalogo OEM dà il finale **14 × 69** e l'omologazione svizzera Polo 1VG552 lo arrotonda a 4,93. Comfortline: 1.105 kg in ordine di marcia UE, passo 2.551 mm e 0–100 in 14,9 s. [4], [5], [6], [7], [8], [49], [50]
- A 6.200 giri/min: **199,2 km/h in 5ª contro 164 km/h (+21,4%, fuori soglia)**. In 4ª si calcolano 167,3 km/h (+2,0%). La Polo brasiliana MY2018 1.0 MPI Total Flex usa **4.167 2.300 1.433 0.975 0.776**, RM 3.182, col medesimo finale dichiarato. Quella serie è specifica del mercato brasiliano. [4], [8], [39], [49]

### `twingo` — Renault Twingo I 1.2 8V 58 CV

- D7F C066/C067 della prima fase con JB1-132. Finale **15 × 56**, RM 3.545 (11 × 39). La Twingo Pack D7F 58 CV di riferimento ha passo 2.350 mm, 895 kg in ordine di marcia con conducente convenzionale di 75 kg e 0–100 in 13,4 s. [9], [10]
- A 5.250 giri/min: **191,8 km/h in 5ª contro 151 km/h (+27,0%, fuori soglia)**. In 4ª risultano 150,0 km/h. Il manuale Renault 2001 riporta gli stessi rapporti e finale per JH1-002. JH1-003 ha 4ª 0.967, 5ª 0.821 e finale 3.867 (15 × 58). JH1-007 ha 4ª 1.029, 5ª 0.821 e finale 4.067 (15 × 61). L'abbinamento di questi ultimi due indici alla specifica Pack 58 CV resta non verificato. [9], [10], [11]

### `p206` — Peugeot 206 GTI 2.0 16V

- EW10J4 RFN 100 kW/136 CV, BE4/5S DM16–DM17. Rapporti ricavati dai denti, finale **19 × 72**, RM 3.333. La tabella tecnica dà gli stessi rapporti anche con 205/45 R16. Quattroruote riporta per la GTI 195/55 R15, passo 2.440 mm, 1.125 kg in ordine di marcia con conducente convenzionale di 75 kg e 0–100 in 8,4 s. [12], [13]
- A 6.000 giri/min: **206,5 km/h in 5ª contro 210 km/h (−1,6%, entro soglia)**. La colonna del precedente RFR riporta quasi gli stessi rapporti sotto forma di reciproci arrotondati, finale 19 × 72 e 185/55 R15. La riga per il gioco segue il RFN. [12], [13]

### `p308` — Peugeot 308 II 1.2 PureTech 130

- T9 berlina prima fase, EB2DTS/HNY, 96 kW, MCM/6H. RM 3.308. Ho invertito i valori della RTA, compreso il finale pubblicato come 0,2394. Peugeot indica passo 2.620 mm, massa a vuoto con liquidi 1.090 kg e 0–100 in 9,6 s con conducente solo nella configurazione indicata in scheda. [14], [15]
- A 5.500 giri/min: **263,1 km/h in 6ª contro 207 km/h (+27,1%, fuori soglia)**. A 207 km/h risultano circa 4.330 giri/min in 6ª o 5.100 in 5ª. In 5ª a 5.500 giri/min risultano 223,4 km/h (+7,9%). La velocità teorica in 6ª descrive lo sviluppo lungo del rapporto. [14], [15]

### `a3` — Audi A3 Sportback 8V 1.5 TFSI COD 150 CV

- 8VA DADA manuale, 02S RMH. La Seat Leon 5F 1.5 TSI Evo 150 DADA impiega lo stesso **02S300051F/FX RMH**. La scheda SEAT fornisce tutte le marce e RM 3.600, con finale 3.647. Il manuale 02S conferma **17 × 62** per RMH/TJW e l'omologazione svizzera dell'A3 m6 arrotonda a 3,65. Per il gioco ho scelto l'applicazione RMH documentata. [16], [17], [18], [51], [52]
- A 6.000 giri/min: **267,3 km/h in 6ª contro 220 km/h (+21,5%, fuori soglia)**. In 5ª si calcolano 228,7 km/h (+3,9%). A 220 km/h in 6ª il regime teorico è circa 4.940 giri/min. Il listino italiano riporta 1.230 kg, 205/55 R16 e 0–100 in 8,2 s. Passo 2.621–2.627 mm secondo la configurazione omologata. [18], [19], [40], [51]

### `a80` — Audi 80 B4 Avant 2.0 E 115 CV

- ABK 85 kW, trazione anteriore, 012 CCF, finale **9 × 37** e RM 3.500. Il manuale Audi riporta anche CVB/CPB con 1ª 3.500, 2ª 2.118 e RM 3.444 per varianti successive. Esiste un CVB svedese con le stesse marce del CCF. [20]
- A 5.400 giri/min: **187,5 km/h in 5ª contro 186 km/h (+0,8%, entro soglia)** con 195/65 R15. Per l'Avant tedesca ADAC riporta 1.270 kg in ordine di marcia UE, passo 2.612 mm e 0–100 in 12,2 s. [20], [21]

### `a112` — Autobianchi A112 Abarth 70 HP

- V serie stradale a 5 marce, dal 1979. Il libretto Autobianchi riporta 3ª **1.342** e RM 3.615. Newsauto riporta 3ª **1.348**, quinta 0.828, finale 4.461 e 135 SR 13 di serie (155/70 R13 a richiesta). La fiche FIA 5606 di base ha quattro marce, 3ª 1.348 e finale **13 × 58** (4.462). Per la riga ho preferito la 3ª del libretto stradale e il finale derivato dai denti, coerente con l'arrotondamento della scheda V serie. [22], [23], [24]
- A 6.600 giri/min: **183,9 km/h in 5ª contro 160 km/h (+15,0%, fuori soglia)**. In 4ª si calcolano 158,2 km/h (−1,2%) e il libretto indica espressamente la punta in 4ª. Massa in ordine di marcia 700 kg nel libretto. Newsauto riporta passo 2.038 mm, 154 km/h e 0–100 in 12 s. [22], [24]

### `doblo` — Fiat Doblò II 1.6 Multijet 105 CV

- Cargo corto Euro 5+ ottobre 2013, 1.6 diesel 77 kW, RM 4.000, passo 2.755 mm per il passo corto. La scheda italiana ha due refusi interni: stampa 5 + RM pur elencando sei marce e ripete 1.500 giri/min nella riga della potenza. Il press kit Fiat 2010 conferma sei marce, 77 kW a 4.000 giri/min e 164 km/h per il Cargo. La scheda Fiat in tedesco ripete i rapporti del 105 CV. Fiat documenta la famiglia C635 su alcuni Doblò Cargo del periodo. L'abbinamento puntuale al gruppo di rapporti della scheda e i denti del finale rimangono non confermati. [25], [26], [27], [53]
- A 4.000 giri/min: **196,5 km/h in 6ª contro 164 km/h (+19,8%, fuori soglia)**. In 5ª si calcolano 161,7 km/h (−1,4%). Per il vicino Kombi Emotion 2010 ADAC dà 195/60 R16, 1.485 kg in ordine di marcia UE, passo 2.755 mm, 164 km/h e 0–100 in 13,4 s. Massa e 0–100 dichiarato per il Cargo della riga: non trovato nelle fonti utilizzate. [25], [26], [28]

### `v850` — Volvo 850 T-5R 2.3 manuale

- T-5R 2.3 britannica da 240 bhp, M56H, finale 4.000 e RM 3.300. Il manuale Volvo mostra la differenza rispetto a M56L in **1ª e 2ª**. Il press kit T-5R indica 205/45 ZR17, 5.600 giri/min, 155 mph (249,4 km/h) e 0–62 mph in 6,9 s berlina o 7,0 s familiare. Auto Motor und Sport indica passo 2.670 mm e 1.451 kg a vuoto per la familiare manuale. [29], [30], [31], [54]
- A 5.600 giri/min: **232,3 km/h in 5ª contro 249,4 km/h (−6,9%, entro soglia)**. La successiva **850 R manuale 250** usa un **M59 con finale 4.000** secondo Volvo. Il press kit R indica 250 bhp a 5.400 giri/min, 205/45 ZR17, 155 mph e 0–62 mph in 6,7 s. I singoli rapporti M59 restano non trovati in una tabella specifica. Per la riga del gioco ho scelto la T-5R. [30], [31], [32]

## Verifica delle cinque auto già nel gioco

```text
ax: 3.417 1.950 1.357 1.054 0.854 | finale 3.765 | 155/70 R13 | cambio MA5 2CB63 | sicurezza alta per HDZ AM94 export | fonti: [33], [34]
clio: 3.725 1.956 1.233 0.903 0.660 | finale 4.214 | 185/65 R15 | cambio JH3 335 (Euro 5) | sicurezza media | fonti: [35], [36], [37]
corsa: 3.727 2.136 1.414 1.121 0.892 | finale 4.294 | 185/70 R14 | cambio F13+ CR (M24) | sicurezza media | fonti: [38], [41], [42]
sandero: 3.727 2.048 1.393 1.029 0.795 | finale 4.500 | 185/65 R15 | cambio JH3 090 | sicurezza alta | fonti: [43], [44], [45]
punto: 3.909 2.158 1.480 1.121 0.921 | finale 4.071 | 175/65 R15 | cambio C514.5 | sicurezza alta | fonti: [46], [47], [48]
```

### `ax` — Citroën AX 1.1i 60 CV

- TU1M/HDZ anno modello 1994, MA5. Il bollettino Citroën assegna all'export **17 × 64 = 3.765** (2CB63) e alla Francia **17 × 61 = 3.588** (2CB53), con lo stesso treno di marce e RM 3.583. Cita **14 × 60 = 4.286** come finale sostituito. Il **16 × 63 = 3.938** del gioco compare nella stessa documentazione per altre motorizzazioni, fra cui K2A. [33]
- A 5.200 giri/min: **166,9 km/h in 5ª con il finale export o 175,1 con il francese**, contro 168 km/h (−0,7% o +4,2%, entrambi entro soglia). Autotitre indica 155/70 R13, 691 kg e 0–100 in 12,4 s per la 1.1i 1992–95. Il passo resta non trovato nella scheda citata. [33], [34]

### `clio` — Renault Clio IV 0.9 TCe 90

- H4B 400 Euro 5, JH3 335. Rapporti ricavati dai valori già arrotondati della RTA dividendo il reciproco del finale (0,2373) per il reciproco della riduzione totale di ciascuna marcia. RM circa 3.547. Renault dichiara due sviluppi in 5ª al lancio: **38,29 km/h ogni 1.000 giri/min per Energy TCe 90 standard**, **40,88 per Energy TCe 90 99 g**. In 1ª sono 6,78 e 7,23. I due treni risultano proporzionali e sono compatibili rispettivamente con finali circa **4.500** e **4.214** a circonferenza di rotolamento uguale. Il 4.500 del gioco è quindi plausibile per la standard, mentre le marce centrali e la 5ª del gioco differiscono dalla RTA. [35], [36]
- A 5.250 giri/min: **221,3 km/h nominali in 5ª contro 182 km/h (+21,6%, fuori soglia)** per il JH3 335 della riga. Applicando gli sviluppi pubblicati da Renault si ottengono 201,0 km/h (standard) o 214,6 km/h (99 g). La RTA indica per H4B 408 Euro 6 il **JR5 357**, rapporti interni quasi uguali, finale circa **4.929** (reciproco di 0,2029) e RM circa 3.547. A parità di gomma e regime il JR5 darebbe 189,2 km/h (+3,9%). Per l'Energy italiana 2014 Quattroruote riporta 1.084 kg in ordine di marcia con conducente convenzionale, passo 2.590 mm, 185/65 R15 e 12,2 s sullo 0–100. [35], [36], [37]

### `corsa` — Opel Corsa D 1.2 Twinport 70–80 CV

- Per la 80 CV **Z12XEP F13+ CR** i rapporti del gioco coincidono, ma il finale documentato è **17 × 73**. Il 3.944 (**18 × 71**) compare per Astra H con F13+ CR. Il manuale Opel/Vauxhall elenca per Z12XEP anche **F13+ WR 4.29**, e varianti **F17+ CR/WR 4.19**. Il treno F13+ WR standard è **3.727 1.960 1.303 0.946 0.761**. Il 70 CV A12XEL è elencato con F13+ WR 4.29 o F17+ WR 4.19. RM per F13+ 3.308. [38], [41]
- A 5.600 giri/min con 185/70 R14: **169,4 km/h in 5ª CR contro 168 km/h (+0,8%, entro soglia)**. Con la 5ª WR e lo stesso finale si ottengono 198,6 km/h (+18,2%, fuori soglia). Il libretto Opel ammette anche il 185/65 R15 sullo Z12XEP. Massa, passo e 0–100 per lo specifico allestimento CR: non trovati nelle fonti citate. [38], [41], [42]

### `sandero` — Dacia Sandero II 1.2 16V 75 CV

- B52 1.2 benzina, JH3 090 da catalogo Dacia. I denti riportati da Motorsport Ireland per il cambio di serie confermano tutte e cinque le marce del gioco e danno RM 3.545. L'omologazione svizzera 1DC926 riporta **4.500** per la 1.2 75 benzina. La scheda Dacia francese conferma 185/65 R15, massa 941 kg senza conducente, 162 km/h e 0–100 in 14,5 s. [43], [44], [45]
- A 5.500 giri/min: **180,1 km/h geometrici in 5ª contro 162 km/h (+11,2%, fuori soglia)**. Lo sviluppo Dacia di **31,77 km/h per 1.000 giri/min** dà **174,7 km/h (+7,9%, entro soglia)**. Il finale 4.214 attuale darebbe 192,3 km/h con la stessa gomma geometrica. [43], [44], [45]

### `punto` — Fiat Grande Punto 1.4 8V 77 CV

- Tipo 199, C514.5. Gli ingranaggi del gioco coincidono con eLearn, che precisa il finale come **4.071** e indica RM 3.818. Fiat riporta 175/65 R15 o 185/65 R15 a seconda della versione, passo 2.510 mm e peso a vuoto 1.025 kg (3 porte) o 1.040 kg (5 porte). 0–100 non trovato nel libretto. [46], [47], [48]
- A 6.000 giri/min con 175/65 R15: **183,5 km/h in 5ª contro 165 km/h (+11,2%, fuori soglia)**. A 165 km/h risultano circa 5.390 giri/min in 5ª. La documentazione Fiat conferma l'intera trasmissione. [46], [47], [48]

## Fonti numerate

1. [Fiat, cartella stampa Nuova Panda, pp. 31–33, colonna 1.2 8V 69 CV](https://www.media.stellantis.com/uploads/ch/CH/2011/FIAT/PRESS/20111213/Panda_IT.pdf).
2. [Fiat, Panda — Dati tecnici, cap. 00.21–27, pp. 27–28, e 00.44 Ruote](https://www.casasostenibile.org/panda_4x4/Manutenzione/Manuale_officina/00%20GENERALITA%27%20E%20DATI%20TECNICI.pdf).
3. [Fiat Panda, catalogo olandese 1986, tabella finale Technische gegevens, 1000 CL/S](https://autocatalogarchive.com/wp-content/uploads/2016/08/Fiat-Panda-1986-NL.pdf).
4. [Volkswagen, SSP 571 Der Polo 2018, pp. 16–19, abbinamento motore/cambio e dati CHYB](https://esperformance.net/ssp/vw/SSP_571_DE.pdf).
5. [Volkswagen, manuale 0DF/0D0 per Polo 2018, edizione 03/2018, p. 3](https://www.scribd.com/document/848588640/5-speed-manual-gearboxes-0DF-and-0D0-installed).
6. [Omologazione svizzera Polo 1.0 MPI 1VG552, sezione Émissions, fumée et bruit](https://typenscheine.ch/fr/Info/1VG552-VWPolo1_0MPI).
7. [WW Spares, voce catalogo 0DF300045F, SND 69:14](https://www.wwspares.co.uk/gb/products/0df300045f) e [Autoparts24, applicazione SND su CHYB 75 CV](https://www.autoparts24.eu/item/H_0001_23333287/?pos=8).
8. [ADAC, Polo AW 1.0 MPI Comfortline 75 CV, 11/2017–08/2018](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/polo/vi/282423/).
9. [Renault, Special Features of the Twingo Fitted with the D7F Engine, cap. 21, p. 21-1](https://www.scribd.com/document/325977091/SPECIAL-FEATURES-OF-THE-TWINGO-FITTED-WITH-THE-D7F-ENGINE).
10. [Quattroruote, Twingo 1.2 Pack 58 CV, scheda agosto 1998](https://www.quattroruote.it/auto/renault/twingo-1-serie/twingo-12-pack-043224199808).
11. [Renault, manuale JH/JR 2001, p. 21-4, indici JH1-002/003/007](https://www.manualslib.com/manual/823867/Renault-Twingo-Clio.html?page=6).
12. [Étude Peugeot 206 (09/1998→), cap. Boîte de vitesses mécanique, p. 66–67, tabella EW10J4 RFR/RFN](https://www.todomecanica.com/component/k2/download/5819_b5ccc8a21e2f17b99609ac4fa465a244.html).
13. [Quattroruote, Peugeot 206 2.0 16V 3p. GTI 136 CV, scheda maggio 2003](https://www.quattroruote.it/auto/peugeot/206/206-20-16v-3p-gti-047775200305).
14. [Revue Technique Automobile n. 833, gennaio 2019, p. 197, MCM/6H per EB2DTS](https://fr.scribd.com/document/786176562/RTA-Revue-Technique-Automobile-Peugeot-308-T9-Phase-1-2013-2017-1-2i-110cv-130cv-PDF-FR).
15. [Peugeot, Caractéristiques techniques 308 essence, marzo 2014, colonna 1.2 e-THP 130 BVM6](https://www.forum-peugeot.com/wp-content/uploads/2016/08/caractech308essencemars2014.pdf).
16. [Volkswagen, manuale 02S edizione 09/2019, pp. 3–4, codici RMH/TJW](https://www.scribd.com/document/961540265/D4B8041D495-6-speed-manual-gearbox-02S).
17. [RRR/Ovoko, 02S300051F/FX RMH da A3 8V 1.5 DADA](https://rrr.lt/en/used-part/asn28690-02s300051fx-audi-a3-s3-8v-manual-6-speed-gearbox).
18. [Omologazione svizzera Audi A3 Sportback DADA 1AF432, cambio m6 e dati motore](https://typenscheine.ch/de/Info/1AF432).
19. [alVolante, A3 Sportback 8VA 1.5 TFSI COD manuale, scheda 2017–2018](https://www.alvolante.it/fuori-listino/audi-a3-sportback-serie-3-8va-2012-2020/1.5-tfsi-150-cv-cylinder-on-demand-108639).
20. [Audi, manuale Audi 80 1992, 5 marce 012, ed. 02/1998, gruppo 00, pp. 5–6, CCF/CVB/CPB](https://www.scribd.com/document/526985417/5-Speed-manual-gearbox-012-Front-wheel-drive).
21. [ADAC, Audi 80 Avant B4 2.0 E 115 CV, 07/1992–03/1996](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/80/b4/962215/).
22. [Autobianchi, A112 Uso e manutenzione 1979, pp. 64–67, varianti Abarth 70 HP](https://www.iw1axr.eu/manuali_uso/Autobianchi%20A112%201979%20tutte%20le%20versioni%2C%20uso%20e%20manutenzione.pdf).
23. [FIA, fiche A112 Abarth 70 HP n. 5606, p. 6, voci 603 e 605](https://trofeo112.it/wp-content/uploads/2020/04/Scheda-di-omologazione-01.01.1982.pdf).
24. [Newsauto, scheda tecnica A112 Abarth V serie](https://www.newsauto.it/scheda-tecnica/abarth/abarth-a112-v-serie-caratteristiche-tecniche/).
25. [Fiat Professional, Doblò Trasporto Merci/Combi, 10/2013, pp. 9–10, 1.6 Multijet 105 Euro 5+](https://www.burianivaienti.it/attachments/article/273/Scheda%20tecnica%20Doblo.pdf).
26. [Fiat Professional, cartella stampa Doblò Cargo 2010, motori e schede tecniche](https://www.media.stellantis.com/uploads/ch/CH/2010/OTHERS/12E7DB66-C29F-7F28-C40653395D67AFE7.pdf).
27. [Fiat Professional, Doblò, scheda tedesca 1.6 Multijet 105 PS Euro 5+](https://doczz.net/doc/5932645/fiat-dobl%C3%B2---fiat-professional).
28. [ADAC, Fiat Doblò Kombi 1.6 JTD Multijet 105 Emotion, 02/2010–08/2013](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/fiat/doblo/263/221789/).
29. [Volvo, scheda tecnica 850, sezione 4, gruppo 43, M56L e M56H](https://www.volvoclub.org.uk/tech/data/850SeriesDataSheet92-94-Sec4.pdf) e [libretto 850 MY1995, Specifiche](https://manualzilla.com/doc/7300184/volvo-850-glt-operating-instructions?page=18).
30. [Volvo Car UK, cartella stampa T-5R, gennaio 1995, 850 T-5R Specification](https://www.volvoclub.org.uk/press/pdf/850T5R-PressRelease1995.pdf).
31. [Volvo, manuale d'officina 850, varianti motore MY1997, B5234T4 manuale M59](https://workshop-manuals.com/volvo/850_1992_factory/0_administration/00_general_information/design_and_function/volvo_850/).
32. [Volvo Car UK, cartella stampa MY1996, 850R Specification](https://www.volvoclub.org.uk/press/pdf/presskits/1996MY-PressKit.pdf).
33. [Citroën, documentazione post-vendita AX 330-00/1 e addendum AX 330-00/1a del 30/06/1993, versione 1.1i HDZ](https://fr.scribd.com/document/737684303/RTA-Citroen-AX).
34. [Autotitre, Citroën AX 1.1i 1992–95](https://www.autotitre.com/fiche-technique/Citro%C3%ABn/AX/1.1i/1992-1995).
35. [Revue Technique Automobile n. 828, luglio/agosto 2018, p. 229, JH3 335 e JR5 357](https://fr.scribd.com/document/822050443/Clio-4-0-9tce-1-2tce).
36. [Renault, New Clio Technical Specifications Europe, 2012, Energy TCe 90 e 90 99 g](https://www.caroto.gr/static/media/2012/10/new_clio_tech_specs_en.pdf).
37. [Quattroruote, Clio IV Energy 0.9 TCe 90 del 2014](https://www.quattroruote.it/auto/renault/clio-4-serie/clio-09-tce-12v-90-cv-s%26s-5p-energy-096623201407).
38. [Opel/Vauxhall, manuale d'officina Corsa D, Manual Transmission and Differential](https://workshop-manuals.com/vauxhall/corsa-d/k__clutch_and_transmission/manual_transmission_front_wheel_drive/transmission_housing/specifications/manual_transmission_and_differential/).
39. [Volkswagen do Brasil, ficha técnica Polo 1.0 MPI Total Flex MY2018, transmissão](https://carroscomcamanzi.com.br/wp-content/uploads/2017/09/Ficha-T%C3%A9cnica-Novo-Polo-1.0-1.pdf).
40. [Rupteur, scheda di omologazione Audi A3 Sportback 1AF431, configurazioni e passo](https://www.rupteur.ch/it/targa/1af431).
41. [Opel-infos, F13+, denti e abbinamenti per modello](https://www.opel-infos.de/technik/getriebe/f13plus.html).
42. [Opel, libretto Corsa D MY07.5, Dati tecnici, motore Z12XEP, velocità e pneumatici](https://www.opel-niedersachsen.de/media/files/Corsa-D-01-2007-MY07_5.pdf).
43. [Dacia, catalogo francese Sandero luglio 2014, dati 1.2 16V 75](https://autocatalogarchive.com/wp-content/uploads/2016/05/Dacia-Sandero-2014-FR.pdf).
44. [Motorsport Ireland, Dacia Sandero Challenge Cup 2026, p. 14, sezione 17, denti del JH3 090](https://static1.squarespace.com/static/663b3cf4741ad911571c3637/t/694557f0501d7b3d550687e6/1766152176635/MI%2BDacia%2BSandero%2BTechnical%2BRegs%2B2026.pdf).
45. [Omologazione svizzera Sandero II 1.2 75 1DC926, rapporto al ponte 4.50](https://www.dauto.ch/it/typenscheine/1dc926-dacia-sandero-1-2-75).
46. [Fiat eLearn, Grande Punto, voce 199002239 GEARBOX](https://4cardata.info/elearn/199/2/199000000/199000004/199000002/199002239).
47. [Fiat eLearn, Grande Punto, voce 199002240 DIFFERENTIAL](https://4cardata.info/elearn/199/2/199000000/199000003/199000002/199002240).
48. [Fiat, Grande Punto Uso e manutenzione, Dati tecnici: motore, ruote, dimensioni, prestazioni e pesi](https://aftersales.fiat.com/eLumData/IT/00/199_GRANDEPUNTOACTUAL/00_199_GRANDEPUNTOACTUAL_603.81.201_IT_01_07.06_L_LG/00_199_GRANDEPUNTOACTUAL_603.81.201_IT_01_07.06_L_LG.pdf).
49. [SEAT, Dati tecnici nuova Ibiza 2017, p. 1, colonna 1.0 MPI 75 CV S/S](https://www.newsauto.it/wp-content/uploads/2017/05/Technical-Data-New-SEAT-Ibiza_IT.pdf).
50. [Ham Car Parts, cambio Ibiza V CHYB 55 kW, 0DF300045F SND](https://www.hamcarparts.com/en/part/seat/ibiza/gearbox/19242143).
51. [SEAT, Leon Technical Specifications, marzo 2019, trasmissione 1.5 TSI Evo 150 manuale](https://www.seat.com/content/dam/public/seat-website/car-shopping-tools/brochure-download/brochures/leon/other-shoppingtools-brochure-leon-specs-final-march-2019.pdf) e [scheda SEAT Leon per il mercato sloveno, stessa colonna](https://www.porscheinterauto.net/f/docs/avto-testi/SEAT-Leon-tehnicni-podatki-mere-dimenzije.pdf).
52. [Catalogo ricambi OEM VW, 02S300051F RMH per Audi A3 8V e SEAT Leon 5F](https://www.oemvwshop.com/02s300051f-6-speed-manual-transmission-p1502971/?cid=3280), [Ecooparts, corrispondenza Leon 1.5 TSI DADA/RMH](https://ecooparts.com/en/used-auto-part/gearbox/seat/leon-5f1/123377350_gearbox-rmh-seat-leon-5f1-15-tsi.html) e [AutoGear, famiglia MQ250, 02S RMH](https://www.autogear.fi/en/transmissions/manual-gearbox-02s-mq250-rmh-rebuilt/p/02S300051F/).
53. [Fiat eLearn, campagna 5808, 4 aprile 2014, Doblò Cargo e Bravo Van con cambio C635](https://aftersales.fiat.com/elearnsections/ContentPdf.aspx?Pdfid=198000788).
54. [Auto Motor und Sport, dati tecnici Volvo 850 T5-R Kombi manuale](https://www.auto-motor-und-sport.de/oldtimer/volvo-850-t5-r-1995/technische-daten/).
