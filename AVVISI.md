# Avvisi importanti

Cose che l'altro deve sapere **subito**. L'hook di inizio sessione (`.claude/hooks/session-start.sh`) mostra questo file
per primo a ogni sessione di Claude, finché la voce c'è.

**Per Claude**: se c'è un avviso per chi ti sta parlando (proprietario o cognato), diglielo all'inizio della tua prima
risposta, in parole semplici, prima di qualunque altra cosa. Quando lui ti dice che l'ha letto, togli la sua voce da
questo file (commit con `Per:` suo) e caricala su `main`.

Formato: `## data · per chi · da chi` e due o tre righe.

## 20/11/2026 sera · per il cognato · dal proprietario · **IL 3D NON C'È PIÙ**
- Il proprietario ha deciso di **togliere il 3D**: farebbero tutti i modelli 3D delle auto, troppo lungo e costoso.
  Il gioco ora è **solo 2D**. Spariti: vista 3D e Abitacolo, la modalità **Montagna** (era solo 3D), la Vetrina (G),
  la telecamera (C), il caricamento di modelli .glb e three.js. Cancellati `car3d.js`, `street3d.js`, `viaggio3d.js`
  e `models/`. Se un giorno servisse, sono nella storia di git.
- Al posto del 3D: **la costruzione del motore**. Oggi i motori li gestisci tu (Nico da Luca, cartella `pistone/`).
- Il weekend quindi è tutto 2D: segnate in `INCORSO.md` cosa toccate.

## 20/11/2026 · per il cognato · dal proprietario
- **Il gioco ora si installa come app sul PC** (Edge o Chrome: menu → «App» → «Installa Night Run»; in Chrome l'icona col
  monitor in fondo alla barra degli indirizzi). Icona sul desktop e nel menu Start, finestra sua, salvataggi uguali al sito.
- **Si aggiorna da sola**: ogni caricamento su `main` arriva nell'app alla prossima apertura (o con Ctrl+R), dopo il
  minuto o due che serve a GitHub Pages. Niente da reinstallare. I dettagli: `PASSAGGIO.md`, «Il gioco come app sul PC».
- L'exe vero (Electron, per Steam) si fa più avanti, come nel tuo `docs/pubblicazione/PERCORSO.md`.
- Weekend: il 3D non c'è più (vedi l'avviso sopra), si lavora tutti e due sul 2D. Segnate in `INCORSO.md` cosa toccate, soprattutto `index.html`.
