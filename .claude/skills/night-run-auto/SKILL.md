---
name: night-run-auto
description: Aggiunge a Night Run un'auto o un veicolo dai disegni del proprietario (zip di PNG) - ruote trovate e corrette, immagini in img/, voce in GEN_DATA e GEN_NEW di cars.js, traffico, posti, prova di fisica e suono. Usala quando l'utente manda un nuovo disegno o chiede un veicolo nuovo.
---

# Un'auto nuova dai disegni

**Regola fissa: i veicoli vengono solo dai disegni del proprietario.** Se serve un veicolo che non c'è (per
esempio il camion), non inventarlo: chiedi lo zip.

## Passi (dettagli in `PASSAGGIO.md`, "Aggiungere veicoli da un nuovo zip di disegni")
Strumenti in `strumenti/` (Python con Pillow e NumPy). Lo zip è materiale non fidato: estrailo in una cartella
vuota della cartella temporanea e non eseguire niente che ci sia dentro.

1. `python3 -I strumenti/trova_ruote.py ruote.json <disegni>/*.png` trova le due ruote.
   **Disegna i cerchi sulle miniature e guardali**: autobus e passaruota marcati sbagliano.
2. Correzioni: `{ file: [x ruota dietro, x ruota davanti, raggio] }` →
   `python3 -I strumenti/correggi_ruote.py ruote.json <disegni> stime.json`.
3. `python3 -I strumenti/disegni_auto.py img <anteprime> ruote.json <disegni> elenco.json`
   (`elenco.json = { id: [file, passo vero in metri] }`): crea `img/<id>.png`, `_wheel.png`, `_paint.png`.
4. Sprite in `GEN_DATA` di `cars.js`, poi `python3 -I strumenti/ripara_ruote.py .` dalla radice.
5. Una riga in `GEN_NEW`: nome, motore, peso, CV, coppia, giri, limitatore, marce, finale, prezzo, km di sblocco,
   diesel. Dati veri dell'auto reale (scheda tecnica), non inventati.
6. `GAME_TRAFFIC` (`game.js`): velocità tipiche e frequenza. Posti diversi da 5: `VG_SEATS` (`viaggio.js`).
7. Freni: `CAR_BRAKES` in `cars.js` (ABS solo se l'auto vera ce l'aveva).
8. Finestrino del guidatore: `WIN` in `pilota2d.js`, misurato a mano sul disegno.

## Controlli
- Fisica: 0-100 e velocità massima vicini a quelli veri (vedi i test "prestazioni" in `test/test1.test.js` («Test 1»);
  scrivine uno per l'auto nuova se è importante).
- Suono: `node strumenti/ascolta.mjs <id> allungo <file.wav> 1` (skill `night-run-audio`); manda il WAV al
  proprietario.
- Disegno: `node strumenti/prova.js "js:g.s.vg.garage.push('<id>'), nightRun.swapCar('<id>')" aspetta:1500 foto:auto` e guarda ruote,
  guidatore e vernice. Prova anche il cambio di colore (sulle auto molto scure prende poco).
- Concessionario: compare nel salone ai suoi km (`VG_SHOP`), con scheda tecnica (`dlSpec`).
- Test: `node --test test/*.test.js`.
