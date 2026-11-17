---
name: night-run-funzione
description: Aggiunge una funzione nuova a Night Run nel modo in cui è costruito il gioco - file nuovo agganciato a StreetGame e Street2D, nuova tappa o locale del viaggio, app del telefono, scena dell'interno, traguardo, stato salvato, test e documentazione. Usala quando l'utente chiede una novità di gioco (un negozio, un'app, un sistema come concessionario, ruota, usato, sfascio).
---

# Aggiungere una funzione a Night Run

Leggi prima `AGENTS.md` (tabella dei file e regole) e i file che tocchi **per intero**. HTML + JavaScript puro:
niente npm, niente build, niente framework.

## Forma di un file nuovo
Un file per funzione, caricato in fondo a `index.html` dopo quelli da cui dipende (oggi l'ordine finale è
`menu, telefono, prologo, valigette, interni, traguardi, ruota, concessionario, usato, sfascio`). Struttura
(modello: `sfascio.js`, `concessionario.js`):

1. Commento di testa: cosa fa, dove sta nel viaggio, dove sta lo stato.
2. **Costanti** in maiuscolo in cima (`JK`, `DL`, `US`): prezzi, probabilità, tempi. Così si ritoccano senza
   cercare nel codice.
3. **Logica** in `(function xLogica(){ if (typeof StreetGame === 'undefined') return; const P = StreetGame.prototype; ... })()`:
   funzioni `P.<prefisso>Nome` che leggono e scrivono `this.s` (stato salvato). Niente DOM qui: così i test in Node
   la caricano.
4. **Interfaccia** in un secondo blocco che esce subito se `typeof document === 'undefined'`.
5. In fondo `if (typeof window !== 'undefined') Object.assign(window, { COSTANTI })` per i test e la console.

Stato: dentro `game.s` (si salva da solo), di solito in `game.s.vg.<nome>` creato pigramente
(`P.jk = function () { return this.s.vg.sfascio || (this.s.vg.sfascio = {...}); }`). I salvataggi vecchi non ce
l'hanno: ogni lettura deve reggere il campo mancante.

Caso: per ciò che deve restare uguale (annunci di una tappa, merce di un negozio) usa `VG.hash(n)` o
`Street2D.rnd`, mai `Math.random`. Per i premi a sorte passa una funzione `rnd` come argomento, così i test la fissano.

## Nuova tappa del viaggio
- `VG_PATTERN` (12 tappe, una ogni 3,2 km da km 1,8: `VG.stopX(n) = 1800 + n*3200`). Una tappa nuova prende il posto
  di una esistente (`if (VG_PATTERN[9] === 'grill') VG_PATTERN[9] = 'junk';`). Di' all'utente cosa hai sostituito.
- `VG_PLACE.<id> = { name: () => 'Nome', what: 'tipo', col: '#colore' }`.
- Facciata: avvolgi `Street2D.prototype.drawTripPlace` (salva il precedente, disegna la tua se `e.id === '<id>'`,
  altrimenti chiama il precedente). Vedi la skill `night-run-pixel`.
- Pannello: ramo `else if (I.id === '<id>')` in `openPlace` di `index.html`, che chiama `Night<Nome>.panel(body, I, ctx)`
  con `ctx = { flash, refresh, save }` (copia il ramo di `junk`).
- Mappa in basso: `PLACE_ICON` e l'elenco `parts` in `index.html`.
- Interno: `SCENE.<id>` in `interni.js` (`focus`, `amb`, `static(g,r,S)`, `dyn(g,t,S)`, `hot:[{x,y,w,h,label,go}]`)
  e un suono d'ambiente in `AMB`. Gli elementi della scena vanno tra x ≈ 105 e 490, se no su computer finiscono
  sotto il pannello.
- Pezzi DOM spostati (niko, shop): non ridisegnare tutto `openPlace` da un'aggiunta, ridisegna solo il tuo contenitore.

## App del telefono
`window.telefono.addApp({ id, name, icon, color, css, badge, render, click })`: `icon` è un svg a tratto 24×24,
`render()` ritorna html, `click(dataset)` gestisce i `data-*`. Le app si installano da sole con
`window.telefono.install(id)` o arrivano coi cartelloni (`TEL_APP_OFFERS`).

## Traguardo
Una voce in `TRG_LIST` (`traguardi.js`): `{ id, name, text, prize: { soldi: 1000 } | { cassa: 'bronzo' }, check: (g) => ... }`.
`check` ritorna vero/falso, oppure `[valore, obiettivo]` per la barra di avanzamento nell'app.

## Premi
Riusa `CASE_GIVE` e `caseGrant(tipo, perché)` di `valigette.js` invece di scrivere premi nuovi.

## Chiudere il lavoro
1. Test in `test/<nome>.test.js` (vedi `night-run-prova`).
2. Prova nel browser con `strumenti/prova.js`, computer e telefono, e guarda le foto.
3. `AGENTS.md` (riga nella tabella dei file, conteggio test), `PASSAGGIO.md` (paragrafo in "Com'è fatto il gioco"),
   `README.md` se descrive il gioco.
4. Commit e pubblicazione: skill `night-run-pubblica`.

Non dare nomi o battute ai personaggi della storia: la storia la scrive il cognato (skill `night-run-storia`).
Commessi, venditori e meccanici nuovi restano generici.
