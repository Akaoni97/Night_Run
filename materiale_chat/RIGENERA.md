# Sorgenti delle chat (materiale di Codex, terzo giro)

La storia e le richieste a Codex stanno in `docs/storia/`.

`chat_dati.js` si rigenera da qui (l'ultimo ID dichiarato prevale; la tabella dei toni è nel file 01):

```bash
cat materiale_chat/materiale3_01_toni.txt materiale_chat/materiale4_00_toni.txt materiale_chat/materiale5_01_toni.txt > /tmp/toni_tot.txt
python3 strumenti/importa_chat.py materiale_chat/materiale3_0{1,2,3,4,5,6,7,8}_*.txt materiale_chat/materiale4_01_revisione_dialoghi.txt materiale_chat/materiale5_01_elena.txt --toni /tmp/toni_tot.txt --attivazione materiale_chat/materiale5_01_ingressi.json --out chat_dati.js
```

`materiale4_01_revisione_dialoghi.txt` (19/11/2026) si legge per ultimo e sostituisce i nodi con lo stesso ID: la prima sera con Elena (`ELE_ritiro_*`), il litigio (`ELE_litigio_*`), Rosa e Livia in vivavoce (`ROS_vivavoce_*`), Dario e la sua imitazione (`DAR_*`). I suoi toni sono in `materiale4_00_toni.txt` (le righe dopo valgono sopra la tabella 01). Le regole di scrittura sono in `docs/storia/REVISIONE_DIALOGHI.md`.

`11_ATTIVAZIONE.json` decide chi parte da solo (56 ingressi originali, 18 conversazioni nuove col loro flag, 12 città col flag `luogo_<città>`).
Casa, vicino, Marco, fallimenti, uscita, guardia, varco ed epiloghi EPI_B1/B2 sono ingressi manuali della regia (non ancora collegati al gioco).
Il file 08 finisce con «Per Claude»: montaggio, stati enum di patto/varco/affidamento, costi di Marco, regole di CASA.

**Quarto giro (19/11/2026, blocco A: Elena).** `materiale5_01_elena.txt` (dieci scene: Pasta, Turno, Coinquilino, Cena, Bollette, Richiamo, Distanza, Riparazione, Nonno, Cena di ritorno, più 20 correzioni del nucleo CASA 3) si legge per ultimo.
Toni in `materiale5_01_toni.txt`. **L'attivazione adesso è `materiale5_01_ingressi.json`** (manifest completo, sostituisce `11_ATTIVAZIONE.json`, che resta come storico): contiene anche, sotto `intervento_materiale5_blocco01`, i 96 nodi ritirati (`rimuovi_nodi`) e le soglie nuove di Elena (`sostituisci_unlock`), che l'importatore ora applica da solo.
Elena si apre a 25, 50, 75 e 100 di confidenza con `ELE_turno_01`, `ELE_riparazione_01` (dopo il litigio), `ELE_nonno_01` e `ELE_cena_ritorno_01` (da fase V); non partono più dai chilometri.
`materiale5_01_verifica.py` e `materiale5_01_prova_motore.cjs` rifanno i controlli di Codex su una copia (`python3 materiale_chat/materiale5_01_verifica.py --repo . --work <cartella fuori dal repo>`; controlla anche l'impronta di `chat_dati.js`: dopo averlo rigenerato non coincide più, serve solo per la consegna originale). Rapporto: `docs/storia/RAPPORTO_CODEX_5_01_ELENA.md`.
