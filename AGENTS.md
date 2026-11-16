# Night Run · guida per gli assistenti (Kimi, Claude e altri)

Stato del lavoro, lavori aperti e procedure (artifact, nuovi disegni di auto): vedi `PASSAGGIO.md`.
Gli strumenti per trasformare i disegni in auto del gioco sono in `strumenti/`.

Gioco di guida notturna nel browser, in italiano, fatto per due persone (il proprietario del repository e suo
cognato). Repository `Akaoni97/Night_Run` (solo il gioco, alla radice); si gioca da GitHub Pages:
https://akaoni97.github.io/Night_Run/ (pubblicato dal ramo `main`). Fino al 16/11/2026 il gioco stava in
`Akaoni97/RandomEgg-s`, cartella `motori/`: lì non si lavora più.

## Com'è fatto
HTML + JavaScript puro: niente build, niente npm, niente framework. Solo three.js 0.147 da CDN per la vista 3D.
`index.html` carica gli script in quest'ordine, e le costanti globali di un file si usano dagli altri
(per esempio `CARS`, `CLUSTERS`, `GAME_LANE_Z`, `GAME_LOCS`):

| File | Cosa contiene |
| --- | --- |
| `dsp.js` | Motore audio sintetizzato (classe `EngineDSP`, gira in un AudioWorklet): cilindri, collettori, scarico, turbo, valvola, aspirazione, carattere per auto (`voice`). |
| `sim.js` | Fisica (classe `SupraSim`, passo 1/4000 s): motore, turbo, frizione, cambio, gomme Pacejka, differenziale, beccheggio, wheel hop, TRC, ABS, tipi di limitatore. |
| `tuning.js` | Catalogo pezzi della Supra, reparto Limitatore comune (`LIMITER_CAT`, `applyLimiter`), `tuningParams()`. |
| `cars.js` | Tutte le auto. V40 col suo catalogo; le auto da disegno con il costruttore comune `GEN_CARS` + `GEN_DATA` + `genCar()`. Quadri strumenti in `CLUSTERS`. |
| `samples.js` | Lettore di campioni audio caricati dall'utente (solo Supra). |
| `car3d.js`, `street3d.js` | Vista 3D. |
| `street2d.js` | Tutta la grafica 2D in pixel art (classe `Street2D`), sfondi dei luoghi (`drawScenery`, `drawNearSide`), traffico, radar delle corsie. |
| `quartieri2d.js` | Quartieri della città (dopo `street2d.js`): elenco `Street2D.DISTRICTS` (tipi di palazzo, colori, insegne, foschia, lampioni, tinta), `districtAt`/`districtMix`, palazzi nuovi (`kindExtra`), punti di riferimento lontani (`landmark`), degrado (`decayTile`), cartello col nome (`districtBanner`). |
| `pilota2d.js` | Il protagonista (dopo `street2d.js`): guidatore di profilo col cappellino visto attraverso i vetri (`drawDriver`, `glassMasks` trova i vetri e la loro altezza sul disegno), contorno dell'auto del giocatore (`heroOutline`), foschia sul traffico (`hazeOf`). |
| `galleria2d.js` | Gallerie del Viaggio dove cambia il paesaggio (`VG_ROUTE`): `tunnelSpan`, `drawTunnelBack` (volta, piastrelle, luci, imbocchi nella montagna), `drawTunnelFront` (bordo vicino e penombra). |
| `luci2d.js` | Luci (dopo `street2d.js`): mappa di luce notturna (`lightAdd` raccoglie le sorgenti durante il disegno, `lightPass` le applica sotto i palazzi), coni dei lampioni (`lampCone`), bagliore a due livelli (`glowPass`). |
| `effetti2d.js` | Effetti del 2D (si aggancia a `Street2D`, va caricato dopo `street2d.js`): fumo a sbuffi, fiammata dello scarico, scintille, ombre proiettate, fascio dei fari, luci sulla carrozzeria (`fxCar`, `fxParts`, `fxFlame`, `fxShadow`, `fxBeam`, `fxBodyLight`), mattonella dell'asfalto (`roadTile`). |
| `dettagli2d.js` | Dettagli a densità doppia (dopo `effetti2d.js`): `tileHD` porta le tessere dei palazzi a 720 righe (spigoli arrotondati con Scale2x, grana, mattoni, riflessi sui vetri); `damaged` costruisce i danni sul disegno dell'auto. |
| `icone.js` | Icone degli oggetti in pixel art 32×32 (`NR_ICON(kind)`, `NR_ICON_TAG(kind)`): bagagliaio, negozio, locali, bacheca. Un oggetto nuovo vuole una voce in `DRAW` con lo stesso nome di `INV`. |
| `intro.js` | Sigla in 2D. |
| `radio.js` | Radio. |
| `game.js` | Carriera (`StreetGame`): soldi, km, luoghi del mondo (`GAME_LOCS`), traffico (`GAME_TRAFFIC`), negozi e officine, polizia, gare. |
| `viaggio.js` | Il Viaggio (modalità principale): tappe, paesaggi, bisogni del guidatore, Motel Ovunque e la cassa, lavori, autostoppisti, capitoli ed eventi strani. Si aggancia a `StreetGame`; stato in `game.s.vg`. |
| `missioni.js` | Missioni del Viaggio dopo il primo lavoro (`VG_MISSIONS`, poi generate): bacheca, regole (fragile, tempo, calmo, pesante, sfida), obiettivo a schermo, stato in `game.s.vg.mis`. Caricato anche dai test. |
| `strada.js` | Sfide lanciate con gli abbaglianti (2 km), reputazione e vantaggi, eventi in prima corsia, comportamento del traffico. |
| `viaggio2d.js` | Grafica 2D del viaggio: bar, autogrill, motel, autostoppisti, cippi, cartelli, rimorchio, colpi di sonno. |
| `menu.js` | Schermata di gioco compatta (dopo lo script principale): sposta i pannelli della pagina in un menu a schede (Tab o pulsante MENU, Esc chiude), messaggi sopra la strada, pedali GAS/FRENO al tocco. `window.gameMenu.open('bagagliaio')`. |
| `telefono.js` | Il telefono (dopo `menu.js`): smartphone sopra la strada, tasto 0 o pulsante TELEFONO. App Telefono, Messaggi, Rubrica, Lavori (bacheca e consegne vere), Mappa, Foto, Orologio; app strane (Passeggeri, Ultima Uscita, Segreteria) con la storia. `TEL_SMS` (messaggi per km), `TEL_ATTI` (km dei momenti della storia), `window.telefono.sms/ring/open/setAtto`. Grafica in Shadow DOM. Test in `test/telefono.test.js`. |
| `valigette.js` | Le valigette (dopo `telefono.js`): app Valigette nel telefono (negozio bronzo/argento/oro, le mie, premi), sei rarità (`CASE_RAR`), probabilità e prezzi (`CASE_TYPES`), premi (soldi, oggetti, ticket tagliando e modifica, potenziamenti a tempo e per sempre via `sim.extraPw`, pezzi veri, kit turbo, auto in regalo), garanzia, ricompense dai lavori e dalle sfide (`caseRewards`), scena d'apertura a tutto schermo con suoni sintetizzati (`window.valigette.play`, prova: `window.valigette.demo('oro', 5)`). Stato in `game.s.cases`. Test in `test/valigette.test.js`. |
| `index.html` | Interfaccia, quadro strumenti, impostazioni, mappa del mondo, ciclo principale (molto grande). |
| `img/` | Disegni delle auto: `<id>.png`, `<id>_wheel.png`, `<id>_paint.png`; `img/stickers/manifest.json`. |
| `audio/`, `models/` | Suoni e modelli 3D liberi già nel progetto. |

Densità doppia: con qualità alta la tela interna è a 720 righe (`Street2D.SS = 2`, `fitLo()`), ma le coordinate
di disegno restano quelle a 360: ogni unità vale 2×2 pixel veri. Quindi: niente `g.setTransform` diretto sulla tela
(usa `this.tf(g, ...)`), le carrozzerie si disegnano con `this.body(g, spr, x, y)` (pesca dal disegno a grandezza
piena), per un dettaglio fine si disegna a mezze unità (`1 / this.SS`), e chi copia dalla tela `this.lo` deve
moltiplicare le coordinate sorgente per `SS`. Con qualità bassa, o se il dispositivo è lento (`this.slow`), `SS` è 1.

Convenzioni della grafica 2D: canvas logico alto 360 px, strada tra y 236 e 336, 30 px per metro (`PPM`),
`Street2D.rnd(n)` per il caso deterministico (niente `Math.random` per ciò che deve restare fermo), testi a pixel
solo in maiuscolo ASCII (`PX_FONT`). Le auto guardano a destra.

Per aggiungere un'auto: voce in `GEN_CARS` (motore, cambio, turbo, `voice`, `shiftK`, `hesK`), sprite e coppia in
`GEN_DATA`, immagini in `img/`, voce in `CLUSTERS`.

## Regole
1. `main` è il ramo pubblicato su GitHub Pages: non ci si lavora sopra direttamente. Lavora su un ramo tuo
   (es. `kimi/lavoro`, o quello che ti assegna la sessione) e porta le modifiche su `main` con una pull request,
   che il proprietario approva. Prima di cominciare aggiorna il tuo ramo da `main`.
2. Commenti, testi del gioco e messaggi di commit in italiano, nello stile del codice esistente.
3. Nel repository niente file presi da mod di giochi o senza licenza (suoni, modelli, immagini): l'utente li carica
   in locale nel browser (IndexedDB). Niente copie di grafica, nomi o personaggi di giochi esistenti.
4. Modifiche mirate: non riscrivere file interi senza motivo, non cambiare ciò che funziona se non è richiesto.
   Parametri nuovi del suono e della fisica con valori di default che lasciano Supra e V40 come sono.
5. Modificando un file con uno script: leggi tutto, cambia in memoria, scrivi una volta sola (una scrittura a metà
   ha già troncato dei file).
6. Prima di cambiare qualcosa leggi per intero i file coinvolti: un'auto o un pezzo passano da più file.

## Come provare
- Test automatici (dalla radice del repository, Node 22+): `node --test test/motori.test.js test/telefono.test.js test/valigette.test.js`.
  Oggi passano tutti i 47 test (36 + 3 del telefono + 8 delle valigette). Non peggiorare il conteggio.
- Nel browser: dalla radice del repository lancia `python3 -m http.server 8765` e apri
  http://localhost:8765/index.html. Tab apre il menu (officina, bagagliaio, guida, vista...). Comandi: I quadro, Invio avviamento, W gas, S freno, E/Q marce, A/D corsie,
  T mappa del mondo, J strumenti, L launch, Z schermo intero. Controlla che la console non abbia errori.
- Alla fine scrivi un riassunto breve: cosa hai cambiato e dove, cosa hai provato, cosa non hai potuto provare.
