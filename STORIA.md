# Night Run · La storia (nuova, in costruzione)

Qui si annota cosa è **deciso** e cosa **manca**. Si costruisce a sessioni con il proprietario: niente di nuovo senza
che lo chieda. La vecchia storia è stata cancellata il 17/11/2026 (è nella cronologia git, ma non si rimette).

## Come deve andare
Horror **graduale**. Prima tutto tranquillo e normale, poi una piccola cosa che non torna, poi sempre più macabro e
psicologico. Il telefono è lo strumento principale: lì si sviluppano le cose strane.

## Deciso
- **Prologo** (fatto, `prologo.js`): una lettera dello studio notarile Ferri invita a ritirare l'eredità di uno zio morto.
  La BMW E36 blu arriva all'edificio, il notaio fa scegliere una tra 6 auto del garage, tutte sotto un telo. Per ora si
  può prendere solo la **Volvo V40**; le altre cinque si vedranno più avanti. La Volvo imbocca l'autostrada.
- **Lo zio morto si chiama Claudio.** (Il notaio non dice altro di lui che «di notte la strada si fa più lunga».)
- **L'autostrada** è infinita e va solo avanti. Le uscite sono bloccate (come, da vedere).
- **Il telefono** (fatto, `telefono.js`): all'inizio solo app normali (Telefono, Messaggi, Rubrica, Mappa, Foto,
  Orologio). Sull'autostrada compaiono cartelloni con una domanda; quando li superi spunta l'icona da scaricare
  (download finto) di Lavori, Passeggeri, Motel. Più avanti compaiono **da sole, senza scaricarle**, app horror e
  arrivano chiamate strane.
- **Effetti pensati**: il bussare nel bagagliaio (poi non c'è niente), chiamate strane, app che compaiono da sole.

## Da decidere
- Chi era Claudio, perché la strada, qual è il segreto.
- Le altre 5 auto del garage: nomi e quando si sbloccano.
- Gli atti, i chilometri dei momenti chiave, il finale.
- Se Niko, Luca, il barista, il benzinaio hanno un ruolo nella storia o restano negozi.
- Quali effetti e quando (sonno, specchietto, radio, cassa del motel...).

## Dove si attacca nel codice
- **Capitoli** ai km: `VG_CHAPTERS` (oggi solo la partenza). **Eventi strani**: `VG_ODD`, vuoto. **Passeggeri speciali**:
  `VG_STORY_PAX`, vuoto. Il formato è scritto sopra a ciascuno in `viaggio.js`.
- **Telefono**: `TEL_SMS` (messaggi per km), `TEL_ATTI` (momenti), `TEL_APP_OFFERS` (cartelloni), `window.telefono`.
- **Prologo**: `PRO_LETTERA`, `PRO_NOTAIO`, `PRO_AUTO`, `PRO_PARENTE`.
