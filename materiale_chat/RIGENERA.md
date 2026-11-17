# Sorgenti delle chat (materiale di Codex, terzo giro)

`chat_dati.js` si rigenera da qui (l'ultimo ID dichiarato prevale; la tabella dei toni è nel file 01):

```bash
python3 strumenti/importa_chat.py materiale_chat/materiale3_0{1,2,3,4,5,6,7,8}_*.txt --toni materiale_chat/materiale3_01_toni.txt --attivazione materiale_chat/11_ATTIVAZIONE.json --out chat_dati.js
```

`11_ATTIVAZIONE.json` decide chi parte da solo (56 ingressi originali, 18 conversazioni nuove col loro flag, 12 città col flag `luogo_<città>`).
Casa, vicino, Marco, fallimenti, uscita, guardia, varco ed epiloghi EPI_B1/B2 sono ingressi manuali della regia (non ancora collegati al gioco).
Il file 08 finisce con «Per Claude»: montaggio, stati enum di patto/varco/affidamento, costi di Marco, regole di CASA.
