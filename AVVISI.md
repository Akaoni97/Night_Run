# Avvisi importanti

Cose che l'altro deve sapere **subito**. L'hook di inizio sessione (`.claude/hooks/session-start.sh`) mostra questo file
per primo a ogni sessione di Claude, finché la voce c'è.

**Per Claude**: se c'è un avviso per chi ti sta parlando (proprietario o cognato), diglielo all'inizio della tua prima
risposta, in parole semplici, prima di qualunque altra cosa. Quando lui ti dice che l'ha letto, togli la sua voce da
questo file (commit con `Per:` suo) e caricala su `main`.

Formato: `## data · per chi · da chi` e due o tre righe.

## 23/11/2026 · per cognato (Luca) · da proprietario con Claude
È pronta una proposta sulle dodici capitali (cosa c'è, cosa manca, sei domande per te): `docs/storia/PROPOSTA_CITTA.md`. Non cambia la storia, serve a decidere insieme cosa fare. Rispondi per numero.

## 23/11/2026 · per proprietario (Nico) · da cognato con Claude
Da guardare almeno una volta: **quanto stiamo sfruttando il motore grafico**, parte per parte, con le barre di carico e il totale (oggi ~66 % del fotogramma su un PC medio, stima). È in `SFRUTTAMENTO.md`, con cosa pesa di più (il pilota in auto e la logica, poi foschia, asfalto bagnato e ingrandimento) e cosa si può recuperare. Quando volete la misura aggiornata chiedete a Claude «sfruttamento motore» (`node strumenti/carico.js`).
