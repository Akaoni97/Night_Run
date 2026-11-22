# Richiesta per Codex · rapporti veri del cambio delle auto di Night Run

Da: Nico (il proprietario), preparata con Claude il 22/11/2026.
Lavoro chiesto: **solo ricerca**. Non modificare il codice del gioco: i dati li mette Claude in `cars.js` (tabella
`GEN_CAMBI`), con i test. Il tuo risultato è un file di testo.

## Perché
Night Run ha una fisica vera (motore, frizione, cambio, gomme). Da v0.87 dieci auto hanno i rapporti veri del cambio;
le altre usano ancora due cambi «comuni» uguali per tutte (5 marce: 3,55 · 1,95 · 1,32 · 1,03 · 0,82; 6 marce:
3,77 · 2,12 · 1,36 · 1,03 · 0,81 · 0,65), e così le velocità in ogni marcia, la ripresa e la velocità massima non sono
quelle dell'auto vera. Servono i numeri giusti, con la fonte.

## Cosa cercare
Per ogni auto della tabella: la versione indicata (se trovi solo una versione molto vicina, va bene, ma scrivi quale).

| id nel gioco | Auto e versione | Cambio |
| --- | --- | --- |
| `panda` | Fiat Panda III (tipo 319, dal 2012), 1.2 Fire 8V 69 CV | manuale 5 marce (Fiat C514?) |
| `panda141` | Fiat Panda prima serie (141), 1000 Fire 45 CV (1986-2003) | manuale 5 marce |
| `polo` | Volkswagen Polo VI (AW, dal 2017), 1.0 MPI 75 CV | manuale 5 marce (MQ100 / 0CF?) |
| `twingo` | Renault Twingo I, 1.2 8V 58 CV (D7F) | manuale 5 marce (JB1 o JH1?) |
| `p206` | Peugeot 206 GTI 2.0 16V 136-138 CV | manuale 5 marce BE4 |
| `p308` | Peugeot 308 II (T9), 1.2 PureTech 130 | manuale 6 marce |
| `a3` | Audi A3 Sportback 8V, 1.5 TFSI 150 CV (COD) | manuale 6 marce (MQ250?) |
| `a80` | Audi 80 B4 (Avant), 2.0 E 115 CV (ABK) | manuale 5 marce |
| `a112` | Autobianchi A112 Abarth 70 HP | manuale 5 marce (dal 1979) |
| `doblo` | Fiat Doblò II (dal 2010), 1.6 Multijet 105 CV | manuale 6 marce |
| `v850` | Volvo 850 R / T-5R manuale | **M56H**: oggi nel gioco ci sono i rapporti M56L della 850 normale (3,38 · 1,90 · 1,19 · 0,87 · 0,70, finale 4,00) |

Se resta tempo, **verifica** anche questi già nel gioco (fonti deboli, da forum o da modelli vicini):

| id | Auto | Valori attuali (marce · finale) |
| --- | --- | --- |
| `ax` | Citroën AX 1.1 60 CV | 3,416 · 1,950 · 1,357 · 1,054 · 0,853 · finale 3,937 |
| `clio` | Renault Clio IV 0.9 TCe 90 | 3,727 · 2,048 · 1,393 · 1,029 · 0,756 · finale 4,500 |
| `corsa` | Opel Corsa D 1.2 Twinport 70-80 CV | 3,727 · 2,136 · 1,414 · 1,121 · 0,892 · finale 3,94 |
| `sandero` | Dacia Sandero II 1.2 16V 75 CV | 3,727 · 2,048 · 1,393 · 1,029 · 0,795 · finale 4,214 |
| `punto` | Fiat Grande Punto 1.4 8V 77 CV | 3,909 · 2,158 · 1,480 · 1,121 · 0,921 · finale 4,07 |

## Cosa serve per ogni auto
1. **Rapporti delle marce**, dalla prima all'ultima (es. 3,909 · 2,158 · 1,480 · 1,121 · 0,921).
2. **Rapporto finale** (al ponte, coppia conica, final drive). Se la fonte dà i denti (es. 15×61) scrivi anche quelli.
3. **Misura delle gomme di serie** (es. 175/65 R14).
4. Se ci sono: retromarcia, codice del cambio, peso a vuoto, passo, velocità massima e 0-100 dichiarati.
5. **Fonte** per ogni numero (link o titolo e pagina: libretto, manuale d'officina, catalogo ricambi, prova su strada
   di Quattroruote/auto motor und sport/Autocar, forum del modello) e **quanto è sicura**: `alta` (documento della casa o
   prova d'epoca), `media` (forum o sito tecnico con i denti contati), `bassa` (modello vicino, valori dedotti).

## Regole
- **Non inventare.** Se un numero non lo trovi, scrivi `non trovato`. Meglio un'auto senza dati che un dato sbagliato.
- Se le fonti non sono d'accordo, riporta tutte le versioni e di' quale ti sembra quella della versione richiesta.
- Controllo di buon senso (fallo tu e scrivilo): con la gomma di serie, a quanti km/h arriva l'auto al regime di potenza
  massima in ultima marcia? Deve essere vicino (±10 %) alla velocità massima dichiarata; se è molto lontano, uno dei
  numeri è sbagliato o è di un'altra versione.
- Testi in italiano. Niente dati personali.

## Cosa consegnare
Un file `docs/fisica/RAPPORTO_CODEX_CAMBI.md` con:
1. una riga per auto in questo formato (Claude lo copia così com'è):
   ```
   panda: 4.100 2.158 1.345 0.974 0.766 | finale 3.438 | 175/65 R14 | cambio C514 | sicurezza media | fonti: [1], [2]
   ```
   (i numeri qui sopra sono solo un esempio del formato, non dati veri)
2. per ogni auto due o tre righe: versione trovata, controllo della velocità massima, dubbi;
3. l'elenco delle fonti numerate con i link.

Grazie! Per domande: chiedi a Nico.
