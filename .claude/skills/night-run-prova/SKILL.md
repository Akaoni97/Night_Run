---
name: night-run-prova
description: Prova una modifica di Night Run come un giocatore prima di dire che è fatta - test automatici, gioco nel browser con lo strumento a copione (strumenti/prova.js), foto su computer e telefono, errori della console, rapporto onesto. Usala dopo ogni modifica al gioco, quando l'utente chiede "provalo", "funziona?", "fammi vedere", o prima di un commit.
---

# Provare Night Run

Regola del proprietario: **prima di dire che una cosa è fatta, provala (test e browser) e di' chiaramente cosa
funziona e cosa no.** Questa skill è il modo standard di farlo.

## 1. Test automatici
Dalla radice del repository (Node 22+):
```bash
node --test test/*.test.js 2>&1 | grep -E '^# (pass|fail)'
```
Il numero dei test che passano non deve scendere (è scritto in `AGENTS.md`, sezione "Come provare"). Se aggiungi
una funzione con logica (soldi, probabilità, stati salvati), aggiungi un file `test/<nome>.test.js` sul modello
di `test/usato.test.js`: concatena i file del gioco con `new Function(src + ';return {...}')()`, crea
`new StreetGame(new SupraSim(), () => 0.5)`, `game.startTrip()`, e prova la logica senza il browser.

## 2. Nel browser, a copione
`strumenti/prova.js` avvia da solo un piccolo server, apre il gioco in Chromium (Playwright), cancella il
salvataggio, salta prologo e domande iniziali, poi esegue i passi in ordine:

```bash
node strumenti/prova.js --out <cartella-foto> soldi:40000 tappa:junk foto:fuori entra foto:dentro stato
node strumenti/prova.js --mob --out <cartella-foto> tappa:dealer entra foto:dealer
```

| Passo | Cosa fa |
| --- | --- |
| `tappa:<id>` | 9 m prima della prossima tappa di quel tipo (`bar fuel grill niko shop style motel dealer junk`), da fermo: si vede la facciata |
| `km:<n>` | al km n, da fermo |
| `entra` / `esci` | entra nella tappa più vicina (aspetta la scena dell'interno) / esce |
| `soldi:<n>` | imposta i soldi |
| `tel` / `tel:<app>` | apre/chiude il telefono / apre un'app (`usa`, `trg`, `rta`, ...) |
| `tasto:<Key>` / `tieni:<Key>:<ms>` | preme / tiene premuto un tasto (`KeyW` gas, `KeyS` freno, `Digit0` telefono, `Tab` menu) |
| `clic:<selettore>` / `clic:testo=<testo>` | clic su un elemento o sul primo pulsante visibile con quel testo |
| `js:<espressione>` | valuta nella pagina (`g` = game, `sim`, `v2` = view2d) e stampa il risultato |
| `foto:<nome>` | salva `desk-<nome>.png` o `mob-<nome>.png` |
| `stato` | stato del gioco in JSON: km, kmh, soldi, auto, garage, benzina, danni, bisogni, locale, interno |

Alla fine stampa lo stato e **gli errori della console e i file mancanti (404)**; esce con codice 1 se ce ne sono.

Regole pratiche:
- Il primo lavoro (tutorial) è dato per fatto, altrimenti il gioco riporta sempre al Bar Sport e `tappa:`/`km:` non
  saltano. Per provare il tutorial: `--tutorial`.
- Metti le foto nella cartella temporanea della sessione, non nel repository.
- **Guarda sempre le foto** (strumento Read sull'immagine): un test verde non dice se un disegno è nel posto giusto.
- Prova sia su computer (1280×720) che su telefono (`--mob`, 390×844): il pannello dei locali e il telefono cambiano
  posizione.
- Le facciate si vedono solo da vicino (entro ~10 m); a 25 m sono fuori schermo.
- Saltare di km mette l'auto in mezzo al traffico: può capitare un urto ("Strisciata contro..."). Non è un errore.
- three.js (vista 3D) viene bloccato apposta: la vista 3D non si prova così.
- Per cose che il copione non sa fare scrivi uno script Playwright tuo partendo da `strumenti/prova.js`.

## 3. Audio
Nel browser di prova non c'è audio. Per il motore usa la skill `night-run-audio` (`strumenti/ascolta.mjs`).
Per i suoni sintetizzati in Web Audio (valigette, ruota, interni) puoi solo controllare che il codice non dia errori:
dillo nel rapporto.

## 4. Rapporto all'utente (in italiano)
Sempre tre parti, brevi:
- **Funziona (provato)**: cosa hai visto davvero, con le foto mandate all'utente se aiutano.
- **Non provato**: cosa non hai potuto provare e perché (suoni, vista 3D, casi rari).
- **Da sapere**: scelte fatte, compromessi, salvataggi vecchi.
Mai scrivere "fatto" se una prova è fallita o non è stata fatta.
