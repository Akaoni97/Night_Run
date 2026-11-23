---
name: night-run-sfruttamento
description: Sfruttamento del motore grafico di Night Run - misura quanto pesa ogni parte del gioco su un fotogramma (pilota, logica, asfalto bagnato, foschia, luci, fisica, città, passanti...) e dà la tabella a barre di carico col totale, aggiornando SFRUTTAMENTO.md. Usala quando l'utente chiede "sfruttamento motore", "a che punto siamo col motore", "quanto margine abbiamo", "lo stiamo inchiodando?", "quanto carico", "il gioco regge?", o prima di aggiungere effetti grafici grossi.
---

# Sfruttamento del motore grafico

Il «motore» di Night Run è il disegno a mano in `Street2D` su una tela del browser: il tetto è il tempo di un
fotogramma, **16,7 ms** a 60 al secondo. Lo schema con le barre sta in `SFRUTTAMENTO.md`.

## Rifare la misura (sul momento, ogni volta che lo chiedono)
1. Porta il repository in pari (`git fetch origin main`, `git merge`).
2. `node strumenti/carico.js --json /tmp/carico.json` (circa un minuto e mezzo). Se interessa la pioggia anche
   `--pioggia`. Stampa la tabella già pronta: parti, barra, stima sul PC medio, millesimi misurati.
3. Le altre risorse, se servono: suono (`node strumenti/ascolta.mjs v40 crociera /tmp/x.wav`, tempo impiegato ÷ 10 s
   di audio ÷ 2,2 per il PC medio), memoria e salvataggi (li stampa già `carico.js`).
4. Aggiorna `SFRUTTAMENTO.md`: sezione «Ultima misura» (data, versione, tabella) e una riga nello «Storico».
   Una parte nuova che pesa (un file di disegno nuovo)? Aggiungila in `PARTI` di `strumenti/carico.js`.
5. Rispondi con la tabella a barre (in un blocco di codice se il telefono la sfascia), il totale, cosa è salito o sceso
   rispetto all'ultima riga dello storico e perché (guarda i commit dal giorno della misura precedente), e dove c'è da
   recuperare. Commit e push (skill `night-run-pubblica`).

## Onestà
- In cloud non c'è scheda video: i millesimi sono veri lì, la colonna del PC medio è una stima (fattori `CONV` in
  `carico.js`: codice ÷ 2,2, effetti a tutto schermo ÷ 7). Dillo sempre: ±30-50 %.
- Se Nico o Luca danno un numero vero dal loro PC (fotogrammi al secondo, millesimi), quello vale più della stima:
  scrivilo nello storico e confrontalo.
- «Complessità del codice» è un giudizio, non una misura: va detto così.
