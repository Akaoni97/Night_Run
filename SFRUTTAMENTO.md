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

## Ultima misura · 23/11/2026 · v0.130 · città di notte, densità doppia

Misurato in cloud: 40,5 ms a fotogramma (25 al secondo). Stima sul PC medio: **~66 % del fotogramma**.

| Parte | Carico sul fotogramma (PC medio) | Stima | Misurato in cloud |
|---|---|---|---|
| Pilota in auto (la figura a pixel della v0.119) | `█▏░░░░░░░░` | ~12 % | 4,4 ms |
| Logica, traffico, quadro, polizia | `█▏░░░░░░░░` | ~12 % | 4,3 ms |
| Ingrandimento allo schermo | `▋░░░░░░░░░` | ~7 % | 8,6 ms |
| Asfalto bagnato e riflessi | `▋░░░░░░░░░` | ~7 % | 8,3 ms |
| Foschia sulle auto | `▋░░░░░░░░░` | ~7 % | 8,1 ms |
| Fisica (motore, gomme, turbo) | `▌░░░░░░░░░` | ~6 % | 2,1 ms |
| Luci notturne e bagliore | `▎░░░░░░░░░` | ~4 % | 4,3 ms |
| Città, palazzi, cielo | `▎░░░░░░░░░` | ~3 % | 1,2 ms |
| Passanti | `▏░░░░░░░░░` | ~2 % | 0,9 ms |
| Fumo, gomme, fiamme, marmitta | `▏░░░░░░░░░` | ~2 % | 0,8 ms |
| Vita (stormi, foglie, falene) | `▏░░░░░░░░░` | ~2 % | 0,7 ms |
| Scritte, radar, specchietto | `░░░░░░░░░░` | ~1 % | 0,3 ms |
| Altro disegno 2D | `░░░░░░░░░░` | ~0,5 % | 0,2 ms |
| **Totale** | `██████▌░░░` | **~66 %** | 44 ms |

Le altre risorse (tetti diversi dal fotogramma):

| Risorsa | Carico | Stima |
|---|---|---|
| Suono del motore (va su un processore a parte; 10 s di audio fatti in 2,2 s in cloud) | `█░░░░░░░░░` | ~10 % di un core |
| Memoria del gioco (28 MB) | `▎░░░░░░░░░` | ~3 % |
| Salvataggi, partita nuova (24 KB sui ~5 MB del browser) | `░░░░░░░░░░` | ~0,5 % |
| Salvataggi a fine gioco (3 partite e 40 foto del diario ciascuna) | `███▌░░░░░░` | ~35 % (stima) |
| Complessità del codice (giudizio, non una misura: 89 file, `index.html` di 3.700 righe, disegno dell'auto in 5-6 file) | `███████▌░░` | ~75 % |

## Cosa vuol dire
- **Margine**: sul PC medio resta circa un terzo del fotogramma. Due o tre effetti grossi a tutto schermo e si riempie.
- **Quasi gratis** (si può aggiungere quanto si vuole): pezzi, auto, missioni, storia, chat, negozi, fisica, suono.
- **Costa**: tutto quello che si disegna in più a ogni fotogramma su tutto lo schermo (passanti, luci, meteo, riflessi).
- **Da recuperare** (stessa grafica, meno lavoro): il pilota viene ridisegnato da capo a ogni fotogramma (le sue pose si
  possono preparare una volta e copiare: ~8-10 %); foschia e asfalto bagnato girano anche quando non piove (~5-10 %).
- **Attenzione**: Luca dice che sul suo PC vede **11-24 fotogrammi al secondo** (lavoro in corso del 23/11 in
  `INCORSO.md`): molto peggio della stima. O il suo PC/browser non usa la scheda video per il disegno, o la stima è
  ottimista. Finché non c'è il contatore sul PC vero, i numeri veri sono i suoi.

## Storico
| Data | Versione | Scena | Cloud (ms) | Stima PC medio | Note |
|---|---|---|---|---|---|
| 23/11/2026 | v0.130 | città di notte | 40,5 | ~66 % | prima misura; pilota e logica i pezzi più pesanti |
