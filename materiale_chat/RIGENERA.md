# Sorgenti delle chat (materiale di Codex, terzo giro)

La storia e le richieste a Codex stanno in `docs/storia/`.

`chat_dati.js` si rigenera da qui (l'ultimo ID dichiarato prevale; la tabella dei toni è nel file 01):

```bash
cat materiale_chat/materiale3_01_toni.txt materiale_chat/materiale4_00_toni.txt > /tmp/toni_tot.txt
python3 strumenti/importa_chat.py materiale_chat/materiale3_0{1,2,3,4,5,6,7,8}_*.txt materiale_chat/materiale4_01_revisione_dialoghi.txt --toni /tmp/toni_tot.txt --attivazione materiale_chat/11_ATTIVAZIONE.json --out chat_dati.js
```

`materiale4_01_revisione_dialoghi.txt` (19/11/2026) si legge per ultimo e sostituisce i nodi con lo stesso ID: la prima sera con Elena (`ELE_ritiro_*`), il litigio (`ELE_litigio_*`), Rosa e Livia in vivavoce (`ROS_vivavoce_*`), Dario e la sua imitazione (`DAR_*`). I suoi toni sono in `materiale4_00_toni.txt` (le righe dopo valgono sopra la tabella 01). Le regole di scrittura sono in `docs/storia/REVISIONE_DIALOGHI.md`.

`11_ATTIVAZIONE.json` decide chi parte da solo (56 ingressi originali, 18 conversazioni nuove col loro flag, 12 città col flag `luogo_<città>`).
Casa, vicino, Marco, fallimenti, uscita, guardia, varco ed epiloghi EPI_B1/B2 sono ingressi manuali della regia (non ancora collegati al gioco).
Il file 08 finisce con «Per Claude»: montaggio, stati enum di patto/varco/affidamento, costi di Marco, regole di CASA.
