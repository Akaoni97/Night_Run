# Sfruttamento del motore grafico

Quanto del «tetto» del gioco stiamo già usando: per ogni parte, quanto pesa su un fotogramma. A 60 fotogrammi al
secondo ce ne sono **16,7 ms** l'uno: se la somma va oltre il 100 %, il gioco scende sotto i 60 e scatta.

**Come si rifà la misura** (quando Nico o Luca chiedono «a che punto siamo con lo sfruttamento del motore»):
`node strumenti/carico.js` (anche `--pioggia`, `--secondi 15`, `--json file`). Guida 9 s in città di notte a densità
doppia, cronometra ogni funzione del disegno, la fisica e il resto del ciclo, e stampa la tabella qui sotto già fatta.
Poi si aggiorna la sezione «Ultima misura», si aggiunge una riga allo storico e si dice cosa è cambiato. Skill
`night-run-sfruttamento`.

**Quanto fidarsi.** Le misure si fanno sul computer in cloud di Claude (2 core Xeon a 2,1 GHz, **senza scheda video**):
lì i millesimi sono veri. La colonna «Stima» li converte per un **PC di gamma media** (Ryzen 5 / i5 recente con GTX 1660
o RTX 3060): il codice ~2,2 volte più veloce, gli effetti a tutto schermo ~7 volte (li fa la scheda video). È una stima:
±30-50 %. Per un numero vero serve misurare sul PC di casa (contatore in Sviluppatori: da fare).

## Ultima misura · 28/11/2026 · v0.177 · città di notte, densità doppia (dopo il recupero)

Misurato in cloud: 41,5-42,6 ms a fotogramma (24 al secondo; prima del recupero 46,8-49,3). Stima sul PC medio: **~53-55 % del
fotogramma** (prima ~60 %); con la pioggia **~57 %** (prima ~64 %).
**Dato vero**: il 24/11 (v0.137) Nico ha misurato **58-60 fps sul suo PC**.

| Parte | Carico sul fotogramma (PC medio) | Stima | Misurato in cloud |
|---|---|---|---|
| Ingrandimento allo schermo | `█▎░░░░░░░░` | ~13 % | 14,9 ms |
| Logica, traffico, quadro, polizia | `▊░░░░░░░░░` | ~8 % | 3,0 ms |
| Luci notturne e bagliore | `▋░░░░░░░░░` | ~7 % | 8,2 ms |
| Pilota in auto | `▋░░░░░░░░░` | ~7 % | 2,5 ms |
| Foschia sulle auto | `▌░░░░░░░░░` | ~6 % | 7,2 ms |
| Asfalto bagnato e riflessi | `▎░░░░░░░░░` | ~3 % | 3,1 ms |
| Fisica (motore, gomme, turbo) | `▎░░░░░░░░░` | ~3 % | 0,9 ms |
| Città, palazzi, cielo | `▏░░░░░░░░░` | ~2 % | 0,8 ms |
| Fumo, gomme, fiamme, marmitta | `▏░░░░░░░░░` | ~1,4 % | 0,5 ms |
| Vita (stormi, foglie, falene) | `░░░░░░░░░░` | ~1,1 % | 0,4 ms |
| Passanti | `░░░░░░░░░░` | ~1,0 % | 0,4 ms |
| Scritte, radar, specchietto | `░░░░░░░░░░` | ~0,9 % | 0,3 ms |
| Altro disegno 2D | `░░░░░░░░░░` | ~0,6 % | 0,2 ms |
| **Totale** | `█████▎░░░░` | **~53 %** | 42,4 ms |

**Il recupero del 28/11 (v0.177)**, stessa grafica (foto prima e dopo, asciutto e pioggia, identiche):
- asfalto a specchio (`wetHD` in `nitido2d.js`): la tela capovolta sta alla risoluzione del riflesso (era 4 volte più grande e
  conteneva solo pixel ingranditi); sull'asciutto, dove si vede appena, si rifà un fotogramma sì e uno no: 9,9 → 3 ms in cloud;
- pilota (`pilota2d.js`): la figura grande si rimpicciolisce una volta per ridisegno e poi si copia a misura; a finestrino chiuso
  niente più tela dei riflessi sul vetro (tre passate su tutta la figura che non disegnavano niente): 2,4 → 1,7 ms;
- la foschia sembra salita, ma non è vero: copia un pezzo della scena e paga l'attesa del disegno che la precede (spenta, il
  gioco non va più veloce). Lo stesso vale in parte per bagliore e ingrandimento: per questo si confronta il totale.

Le altre risorse (tetti diversi dal fotogramma):

| Risorsa | Carico | Stima |
|---|---|---|
| Suono del motore (va su un processore a parte; 10 s di audio fatti in 2,2 s in cloud) | `█░░░░░░░░░` | ~10 % di un core |
| Memoria del gioco (28-40 MB) | `▍░░░░░░░░░` | ~4 % |
| Salvataggi, partita nuova (19 KB sui ~5 MB del browser) | `░░░░░░░░░░` | ~0,5 % |
| Salvataggi a fine gioco (3 partite e 40 foto del diario ciascuna) | `███▌░░░░░░` | ~35 % (stima) |
| Complessità del codice (giudizio, non una misura: 89 file, `index.html` di 3.700 righe, disegno dell'auto in 5-6 file) | `███████▌░░` | ~75 % |

## Cosa vuol dire
- **Margine**: sul PC medio resta circa un terzo del fotogramma. Due o tre effetti grossi a tutto schermo e si riempie.
- **Quasi gratis** (si può aggiungere quanto si vuole): pezzi, auto, missioni, storia, chat, negozi, fisica, suono.
- **Costa**: tutto quello che si disegna in più a ogni fotogramma su tutto lo schermo (passanti, luci, meteo, riflessi).
- **Recuperato il 28/11** (v0.177): asfalto a specchio e pilota, ~6-7 % del fotogramma. **Resta**: l'ingrandimento allo schermo e il
  bagliore sono lavoro della scheda video (sul PC costano molto meno che in cloud); il resto è già piccolo.
- **Il PC vero**: il 23/11 Luca vedeva 11-24 fotogrammi al secondo; dopo i tre giri sulle prestazioni (v0.131-v0.137) Nico ne misura **58-60** sul suo PC (24/11). Il numero vero vale più della stima: oggi il gioco ci sta.
- **Cosa è cambiato dal 23/11**: i pezzi fatti di codice sono scesi (pilota 12 → 9 %, logica 12 → 8 %, fisica 6 → 3 %) grazie alla pagina leggera e alle figure al posto dei pixel (v0.132-v0.138); è salito l'ingrandimento (7 → 13 %), perché dalla v0.134 la tela dello schermo è un multiplo intero della scena: in cloud, senza scheda video, costa; sul PC lo fa la scheda video. Le novità di questi giorni (fiamme nuove, estetica di tutte le auto, traino) pesano poco: fiamme e fumo ~1,6 %, i pezzi estetici si disegnano una volta e restano in memoria.

## Storico
| Data | Versione | Scena | Cloud (ms) | Stima PC medio | Note |
|---|---|---|---|---|---|
| 23/11/2026 | v0.130 | città di notte | 40,5 | ~66 % | prima misura; pilota e logica i pezzi più pesanti |
| 24/11/2026 | v0.137 | PC di Nico | — | 58-60 fps veri | misura sul PC vero dopo i tre giri sulle prestazioni (prima 11-24 fps sul PC di Luca) |
| 28/11/2026 | v0.176 | città di notte | 46,8 | ~60 % | codice più leggero (pilota, logica, fisica), ingrandimento più caro in cloud; con la pioggia 50,4 ms, ~64 % |
| 28/11/2026 | v0.177 | città di notte | 41,5-42,6 | ~53-55 % | recupero: asfalto a specchio e pilota; con la pioggia 44,3 ms, ~57 % |
