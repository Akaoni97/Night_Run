---
name: night-run-storia
description: Dove e come si scrive la storia di Night Run (horror graduale) - capitoli ai km, eventi strani, passeggeri speciali, pensieri del protagonista, messaggi e app del telefono, prologo. Usala quando si lavora sulla trama, sui testi dei personaggi o sugli effetti horror, e per sapere cosa NON fare se la storia non è tua.
---

# La storia di Night Run

## Di chi è
**La storia la scrive il cognato del proprietario e la carica lui.** Un assistente non inventa trama, nomi o
battute dei personaggi della storia, a meno che chi scrive la storia lo chieda esplicitamente in quella sessione.
Quello che è deciso è in `docs/storia/STORIA.md`; si aggiorna solo quando lo chiede chi scrive la storia.

Venditori, meccanici, commessi dei negozi nuovi restano **generici** (nessun nome, nessun ruolo nella trama): così
chi scrive la storia può dargliene uno.

## Il tono
Horror **graduale**: prima tutto tranquillo e normale, poi una piccola cosa che non torna, poi sempre più macabro e
psicologico. Il telefono è lo strumento principale. La vecchia storia è stata cancellata: non rimetterla.

## Dove si attacca nel codice
| Cosa | Dove | Formato |
| --- | --- | --- |
| Prologo | `prologo.js` | `PRO_LETTERA`, `PRO_NOTAIO`, `PRO_AUTO`, `PRO_PARENTE` |
| Capitoli ai km | `viaggio.js` | `VG_CHAPTERS` (formato scritto sopra la costante) |
| Eventi strani | `viaggio.js` | `VG_ODD` (vuoto) |
| Passeggeri speciali | `viaggio.js` | `VG_STORY_PAX` (vuoto) |
| Pensieri del protagonista | `pensieri.js` | `PENS_KM`, `PENS_BISOGNI`, `PENS_ANIMO`; dalla storia `game.vgThink(testo)` |
| Messaggi | `telefono.js` | `TEL_SMS` (per km), `window.telefono.sms(da, testo)` |
| Atti | `telefono.js` | `TEL_ATTI` (km da cui comincia ogni atto) |
| Chiamate | `telefono.js` | `window.telefono.ring(...)` |
| App che compaiono | `telefono.js` | `window.telefono.install(id)` / `addApp(...)` |
| Cartelloni sulla strada | `telefono.js` | `TEL_APP_OFFERS` |

Nei testi si può scrivere `{Auto}` / `{auto}` (l'auto scelta nel garage, con l'articolo: «La Panda», «l'Audi») e
`{tipo}` («un'utilitaria», «una station wagon»): li sostituisce `vgTesto` in `viaggio.js`.

## Provare un momento della storia
Senza guidare per ore: `node strumenti/prova.js km:150 aspetta:3000 foto:momento stato` (skill `night-run-prova`).
Per un messaggio: `js:telefono.sms('Sconosciuto','...')`. Per un pensiero: `js:g.vgThink('...')`.
Testi del gioco in italiano, con gli accenti giusti (i testi a pixel sulla strada invece solo maiuscole ASCII).
