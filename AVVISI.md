# Avvisi importanti

Cose che l'altro deve sapere **subito**. L'hook di inizio sessione (`.claude/hooks/session-start.sh`) mostra questo file
per primo a ogni sessione di Claude, finché la voce c'è.

**Per Claude**: se c'è un avviso per chi ti sta parlando (proprietario o cognato), diglielo all'inizio della tua prima
risposta, in parole semplici, prima di qualunque altra cosa. Quando lui ti dice che l'ha letto, togli la sua voce da
questo file (commit con `Per:` suo) e caricala su `main`.

Formato: `## data · per chi · da chi` e due o tre righe.

## 21/11/2026 · per il cognato · dal proprietario (con Claude) · **Officina da Luca rifatta, Nico spento di serie**
- Il proprietario ha chiesto un'officina **semplice** (una schermata, due schede: **Modifiche** e **Swap motore**, `officina.js`): troppe cose da scorrere. Da Luca non si vede più il vecchio Nico (livelli, magazzino, banco, motori costruiti). *Aggiornamento del 21/11 sera: la cartella `pistone/` è stata cancellata (v0.74).*
- Lo swap è ora tra i motori delle auto del gioco (monti il motore della Supra sulla V40). I livelli 1 e 2 dei pezzi sono sempre sbloccati, i km servono dal 3 in su. 
- In più: **Tutor ogni 10-15 km, lungo 500 m-1 km** (`polizia.js`).

## 21/11/2026 sera · per il proprietario · dal cognato (con Claude) · **Pistone cancellato, Prestazioni, auto elaborate** (v0.74)
- Il vecchio banco dei motori di Nico (cartella `pistone/`) **non c'è più**: Luca ha deciso di cancellarlo. Da Luca resta l'officina semplice; chi aveva speso da Nico riceve i soldi indietro una volta sola. Nico, il personaggio, cerca un'altra mansione (punto 3 di `SOSPESI.md`).
- Nuovo: **Impostazioni → Grafica → Prestazioni**. Se il gioco scatta, scegli «Fluida». «Automatica» spegne da sola una cosa alla volta se il computer non ce la fa, e lo scrive nel riquadro.
- Un'auto elaborata, venduta all'Autosalone, vale **metà di quello speso in pezzi e swap** (prima un terzo, e lo swap non contava).
- Missione del signore della valigetta: resta a 38 km. Danni: si tarano giocando.
