# Campioni audio dei pezzi del motore

Ogni pezzo montato da Luca Tuning porta la sua voce, sopra il motore sintetizzato (`dsp.js`). Qui ci sono i suoni, una
cartella per componente e una sottocartella per kit. Li suona `campioni.js`; nel gioco si ascoltano, si comprano e si
montano dalla scheda **Suoni** dell'officina.

Sono **fatti a codice** da `strumenti/campioni_pezzi.py` (sintesi: rumore dipinto nello spettro, toni che scendono, modi del
tubo, saturazione): nessuna registrazione di altri, nessun file preso da mod. Si possono usare come si vuole.
Dal 22/11 (v0.83) senza toni puri dove nella realtà c'è aria: botti che risuonano nel tubo, fischi soffiati che ondeggiano, «tu» a sbuffi.

## Come sono fatti i nomi
- `1.wav`, `2.wav`... colpi singoli. Nella valvola e nell'aspirazione vanno dal più leggero al più forte: il gioco
  sceglie quello giusto con la pressione del turbo (o con quanto spalanchi il gas). Negli altri sono varianti a caso.
- `loop.wav` anello di 2 secondi che gira senza fine (turbo, compressore, urlo della wastegate, cambio): il gioco lo
  intona sulla girante, sui giri o sulla velocità degli ingranaggi.
- `chatter1.wav`... (wastegate che sbatte), `innesto1.wav`... (clack del cambio), `aria1.wav`... (soffio dell'attuatore).

## Le cartelle
| Componente | Kit | Quando suona |
| --- | --- | --- |
| `valvola/` | ricircolo, pssh, pssh_grossa, trombetta, doppio_pistone, sbuffo, stututu, stututu_lungo, mitraglia, gufo, mezzo | quando molli il gas col turbo in pressione |
| `turbo/` | fischio, sibilo, ululato, sirena | sempre, intonato sulla girante |
| `compressore/` | volumetrico, centrifugo, vite | sempre, intonato sui giri |
| `wastegate/` | screamer, libera | a pieno boost (urlo) e in rilascio (chatter) |
| `aspirazione/` | fungo, cornetti, airbox | quando spalanchi il gas |
| `scarico/` | borbottio, cupo, scoppiettio, gorgoglio, pentola, titanio | quando molli sopra i 2.200 giri |
| `mappa/` | crackle, pop_bang, mitraglia, petardi, antilag | in rilascio e al limitatore, con la mappa pop & bang accesa |
| `limitatore/` | colpi, due_step, fucilata, stutter | a ogni taglio d'accensione: limitatore, launch, cambiate col 3-step |
| `cambio/` | denti_dritti, sequenziale | fischio con la velocità, clack a ogni marcia |
| `spurgo/` | classico, doppio | quando armi il launch |

## Mettere una registrazione tua
1. Stesso nome e stessa cartella del file che vuoi sostituire (WAV, meglio mono; la frequenza non conta).
2. Gli anelli (`loop.wav`) devono richiudersi senza scatto e restare intonati: il gioco li accelera e rallenta.
3. Alza `CMP_VER` in `campioni.js`: i browser che avevano il vecchio file in memoria (`sw.js`) lo riscaricano.
4. `node --test test/campioni.test.js` controlla che ci siano tutti i file e che non saturino.

## Rifarli, o aggiungere un kit
- `python3 strumenti/campioni_pezzi.py` rifà tutto (sempre uguale), `python3 strumenti/campioni_pezzi.py valvola/gufo` un
  kit solo; `--grafici cartella` salva uno spettrogramma per file da guardare.
- Kit nuovo: la ricetta in `strumenti/campioni_pezzi.py` (funzione `kit(...)`) e la voce in `CMP_KIT` di `campioni.js`
  (nome, nota col Verdetto, prezzo, quanti file). Il test dice se catalogo e cartella non coincidono.
- Per sentire come stanno sopra il motore: `node strumenti/ascolta_campioni.js <auto> '<pezzi>' giro /tmp/prova.wav`
  (mix di fisica, sintesi e campioni, con i livelli ogni mezzo secondo).
