---
name: night-run-audio
description: Ascolta e misura il suono del motore di Night Run senza audio nel browser - strumenti/ascolta.mjs fa girare fisica e motore audio veri di un'auto, salva un WAV e stampa volume, picchi, saturazione, giri e frequenza degli scoppi. Usala quando tocchi dsp.js, la voce di un'auto (voice in GEN_CARS), cambio, limitatore, turbo, punti d'ascolto o ambiente.
---

# Il suono del motore

Il motore audio è `dsp.js` (classe `EngineDSP`, gira in un AudioWorklet). Riceve:
- `{ cfg: { tune, view, vol, pops, fx } }`: configurazione dell'auto (`tuningParams(sel).dsp`, con `voice`, cilindri,
  turbo) e punto d'ascolto (0 abitacolo, 1 esterno, 2 vano motore);
- `{ env: 0|1|2 }`: strada aperta, città, galleria;
- `{ p: sim.audioParams(), ev: [...] }` a ogni fotogramma (giri, carico, gas, turbo, eventi come cambiata e valvola).

## Ascoltare fuori dal browser
```bash
node strumenti/ascolta.mjs <auto> <copione> <file.wav> [vista] [ambiente]
node strumenti/ascolta.mjs e30 allungo /tmp/e30.wav 1
```
Copioni: `minimo`, `sgasate` (in folle), `allungo` (da fermo a gas pieno, cambia vicino al limitatore),
`crociera` (4ª a 100 km/h, gas parziale), `limitatore` (in folle sul limitatore).

Stampa una riga ogni mezzo secondo (o secondo): giri, marcia, RMS e picco in dB, frequenza attesa degli scoppi
(giri/60 × cilindri/2) e fondamentale misurata. Alla fine: volume totale e **campioni saturati**.

Come leggerlo:
- **Saturazione** oltre 0,1 %: il suono gracchia. Da sistemare.
- **Fondamentale vicina agli scoppi attesi** (o a metà/doppio): il motore "suona" ai giri giusti. Un "—" vuol dire
  rumore senza nota chiara (normale in rilascio o sulla cambiata).
- **Livelli**: confronta con un'auto che va bene (Supra e V40). Al minimo circa −27/−34 dB, in tiro −11/−18 dB.
  Una differenza di oltre 6 dB tra auto simili si sente.
- Prima e dopo: fai girare lo stesso copione prima e dopo la modifica e confronta le tabelle.

Il WAV si può mandare all'utente (strumento per inviare file) perché lo ascolti lui: è l'unico modo di sapere se
"suona bene". Dillo chiaramente: i numeri dicono che non è rotto, non che è bello.

## Regole
- Parametri nuovi del suono con valori predefiniti che **lasciano Supra e V40 come sono**.
- `dsp.js` sa fare 4 o 6 cilindri (la Volvo 850 R a 5 cilindri oggi suona da 4 o 6).
- I test in `test/motori.test.js` controllano già alcune cose del suono: falli girare.
- Suoni presi da mod o senza licenza non entrano nel repository: il giocatore li carica in locale (`samples.js`).

## Gli altri suoni
Valigette, ruota, interni, traguardi usano Web Audio direttamente (`window.valigette.SND`, `AMB` in `interni.js`):
nel browser di prova non si sentono. Si può solo controllare che non diano errori e dirlo nel rapporto.
