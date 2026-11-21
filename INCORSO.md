# Lavori in corso

Chi sta lavorando su cosa, adesso. Serve a non toccare gli stessi file nello stesso momento (soprattutto
`index.html` e `street2d.js`, che sono enormi e li toccate tutti e due).

- **Quando cominci** un lavoro: aggiungi una riga e caricala subito su `main` (prima di tutto il resto).
- **Quando finisci**: togli la riga (e scrivi due righe in `DIARIO.md`).
- Se vedi un file che ti serve già occupato dall'altro: scriviglielo prima, o aspetta che finisca.
- L'hook di inizio sessione mostra questa tabella a Claude ogni volta: lui la tiene aggiornata da solo.

| Chi | Cosa | File che tocca | Da quando |
| --- | --- | --- | --- |
| cognato (Luca), con Claude (altra sessione) | Campioni audio dei pezzi del motore: scheda «Suoni» nell'officina, una cartella di suoni per componente (valvola, turbo, scarico, centralina, limitatore, cambio...) che si sentono quando monti il pezzo | nuovi: `campioni.js`, `audio/campioni/`, `strumenti/campioni_pezzi.py`, `test/campioni.test.js`; poche righe in `officina.js`, `dsp.js`, `index.html` (solo agganci audio, non i testi) | 21/11/2026 sera |
| cognato (Luca), con Claude | Pulizia del codice morto (punto 16), test motori → Test 1, alta definizione leggera di marciapiedi, oggetti e insegne | `index.html` (blocchi morti), `sim.js`, `soccorso.js`, `diario.js`, `interni.js`, `telefono.js`, `game.js`, `test/`, skill; grafica in `nitido2d.js` e file nuovo | 21/11/2026 sera |
