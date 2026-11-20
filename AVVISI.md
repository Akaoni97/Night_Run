# Avvisi importanti

Cose che l'altro deve sapere **subito**. L'hook di inizio sessione (`.claude/hooks/session-start.sh`) mostra questo file
per primo a ogni sessione di Claude, finché la voce c'è.

**Per Claude**: se c'è un avviso per chi ti sta parlando (proprietario o cognato), diglielo all'inizio della tua prima
risposta, in parole semplici, prima di qualunque altra cosa. Quando lui ti dice che l'ha letto, togli la sua voce da
questo file (commit con `Per:` suo) e caricala su `main`.

Formato: `## data · per chi · da chi` e due o tre righe.

## 20/11/2026 sera · per tutti e due · dal check completo · **COSA È CAMBIATO OGGI (da collaudare stasera)**
- **Menu**: c'è la scheda **Impostazioni** (Grafica, Audio, Comandi, Guida) con tutte le regolazioni. Le schede Vista ed
  Extra non ci sono più: colore, mappa, foto, replay e «Come si gioca» stanno in **Partita**.
- **Meteo nuovo**: nebbia, neve e vento (menu Impostazioni → Grafica → Meteo, o tasto **K**, che ora ha 6 scelte). La
  neve fa scivolare più della pioggia. In «dinamico» arrivano secondo il paesaggio, mai in città.
- **Entrare nei locali**: ogni locale ha il suo posto auto con le strisce; l'auto parcheggia, il protagonista scende ed
  entra a piedi (U salta la camminata). Accostando, il passaggio alla corsia di destra ora è deciso: niente più tamponi.
- **Motori**: li gestisce il cognato. Da Luca c'è Nico coi pezzi a livelli; l'officina dei tagliandi è di **Mario**.
- Check: nessun errore in tutte le tappe, 211 test passati. Le cose da decidere sono in `SOSPESI.md`.

## 21/11/2026 · per il cognato · dal proprietario (con Claude) · **Officina da Luca rifatta, Nico spento di serie**
- Il proprietario ha chiesto un'officina **semplice** (una schermata, due schede: **Modifiche** e **Swap motore**, `officina.js`): troppe cose da scorrere. Da Luca non si vede più il vecchio Nico (livelli, magazzino, banco, motori costruiti): il codice e i test restano in `pistone/`, ma **di serie è spento** (interruttore nella scheda Sviluppatori, acceso torna il vecchio negozio).
- Lo swap è ora tra i motori delle auto del gioco (monti il motore della Supra sulla V40). I livelli 1 e 2 dei pezzi sono sempre sbloccati, i km servono dal 3 in su. Da decidere insieme: cosa riportare di Nico nell'officina semplice (interni della V40, banco, motori costruiti).
- In più: **Tutor ogni 10-15 km, lungo 500 m-1 km** (`polizia.js`).
