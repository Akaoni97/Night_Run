---
name: night-run-pixel
description: Regole per disegnare in pixel art nel 2D di Night Run (Street2D) - coordinate a 640×360 con densità doppia, strada, metri, caso deterministico, testi a pixel, luci notturne, facciate dei locali, scene degli interni, auto dai disegni. Usala prima di disegnare o ritoccare qualsiasi cosa nel 2D.
---

# Disegnare in Night Run

## Coordinate
- Tela logica **640×360**. Con qualità alta la tela vera è a 720 righe (`Street2D.SS = 2`): ogni unità vale 2×2
  pixel. Disegna sempre in coordinate a 360; per un dettaglio fine usa mezze unità (`1 / this.SS`).
- Niente `g.setTransform` diretto: usa `this.tf(g, ...)`. Chi copia dalla tela `this.lo` moltiplica le coordinate
  sorgente per `SS`.
- Strada tra y 236 e 336. **30 px per metro** (`PPM`). Le auto guardano a destra.
- Con qualità bassa o dispositivo lento (`this.slow`) `SS` è 1: il disegno deve reggere anche lì.

## Stile
- Notte: colori scuri e desaturati, luci calde (sodio, neon) che spiccano. Il proprietario vuole un pixel "più
  moderno, senza esagerare".
- Luci: registra le sorgenti con `this.light(...)` / `lightAdd` durante il disegno; la mappa di luce (`luci2d.js`)
  le applica. Insegne al neon con alone, lampioni con cono (`lampCone`).
- Testi a pixel solo in **maiuscolo ASCII** (`PX_FONT`, `this.text`, `this.textW`): niente accenti, niente minuscole.
  Etichette dei locali con `this.placeTag`.
- **Caso deterministico**: `Street2D.rnd(n)` per ciò che deve restare fermo (finestre accese, pile di carcasse).
  `Math.random` solo per cose che si muovono e non devono restare uguali (scintille).
- Animazioni con il tempo `t` passato al disegno, non con contatori di fotogrammi.

## Prestazioni: i 60 fps (regola dal 24/11/2026, v0.137-v0.138)
La scheda video paga **ogni comando**, anche un rettangolo di un pixel: 6.000 `fillRect` a fotogramma bastavano a stare
sotto i 60 fps, anche se i pixel erano pochi. Quindi:
- **Niente forme disegnate a righe o a pixel a ogni fotogramma con un `fillRect` per riga.** Una forma di un colore è una
  figura sola: `g.beginPath(); ... g.rect(x, y, w, h); ... g.fill();`. Più colori insieme: `this.batch(g, (r) => { r(colore, x, y, w, h); })`
  (un comando per colore). `this.span`, `this.ridge` e `this.text` lo fanno già.
- Quello che non cambia (palazzi, insegne, monumenti, sprite): si disegna **una volta** in una tela e poi si copia con
  `drawImage` (tessere in cache, `this.sprite(...)`, `tileOf` di `nitido2d.js`).
- Niente tele nuove (`document.createElement('canvas')`) né cambi di misura (`c.width = ...`) a ogni fotogramma: si tengono.
- Niente `getImageData` a ogni fotogramma su una tela che sta sulla scheda video (se proprio serve: tela con `willReadFrequently: true`).
- Trasparenze che si sovrappongono (due linee che si incrociano) vanno in due figure diverse, se l'incrocio deve restare più chiaro.
- Controllo: `node strumenti/prova.js km:69 comandi:2600` conta i comandi a fotogramma; la prova di fumo fallisce sopra 2.600.
  Per trovare chi li fa: `node strumenti/misura_fps.js --sonda` e il conteggio per riga descritto in `DIARIO.md` (v0.137).

## Auto
- Solo dai disegni del proprietario (`img/<id>.png`, `_wheel.png`, `_paint.png`). **Mai inventare un veicolo**:
  se serve un camion e non c'è, si chiede lo zip.
- `this.trafficSprite(id, 'orig', k)` dà il disegno a grandezza piena con `.geo { ax, wy, wr }` e `.wheelImg`.
  Carrozzerie con `this.body(g, spr, x, y)`.
- Auto vecchie o rovinate (carcasse): stesso disegno con filtri (seppia, scurito) e ammaccature (`damaged` in
  `dettagli2d.js`), non un disegno nuovo.

## Facciate dei locali
Avvolgi `Street2D.prototype.drawTripPlace(g, e, x, st, near, open)`: disegna se `e.id` è il tuo, altrimenti chiama
il precedente. Le facciate stanno fuori schermo oltre ~10 m: provale con `strumenti/prova.js tappa:<id> foto:fuori`.

## Interni (`interni.js`)
`SCENE.<id>`: `static(g, r, S)` disegnato una volta (muri, arredi), `dyn(g, t, S)` a ogni fotogramma (persone che
si muovono, neon che sfarfallano, traffico fuori dalle finestre). Su computer il pannello copre la parte destra:
tieni le cose importanti tra x ≈ 105 e 490. `grade`/`gradeA` danno la tinta d'insieme.

## Niente copie
Niente grafica, nomi o personaggi di giochi esistenti; niente file presi da mod.

## Controllo
Guarda sempre il risultato su una foto (`night-run-prova`), su computer e telefono, e confrontalo con quello che
c'è accanto: stessa luce, stesso livello di dettaglio, stessa palette del quartiere.
