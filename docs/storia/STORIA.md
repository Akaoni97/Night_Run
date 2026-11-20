# Night Run · La storia (nuova, in costruzione)

Qui si annota cosa è **deciso** e cosa **manca**. Si costruisce a sessioni con il proprietario: niente di nuovo senza
che lo chieda. La vecchia storia è stata cancellata il 17/11/2026 (è nella cronologia git, ma non si rimette).
Il 17/11/2026 sono state tolte anche le gare clandestine (sfide al semaforo con rivali e scala dei rivali, sfide con gli
abbaglianti, reputazione di strada): la storia di partenza è solo notaio, sei auto e autostrada.

## Come deve andare
Horror **graduale**. Prima tutto tranquillo e normale, poi una piccola cosa che non torna, poi sempre più macabro e
psicologico. Il telefono è lo strumento principale: lì si sviluppano le cose strane.

## Deciso
- **Prologo** (fatto, `prologo.js`): una lettera dello studio notarile Ferri invita a ritirare l'eredità di uno zio morto.
  La BMW E36 blu arriva all'edificio, il notaio fa scegliere una tra 6 auto del garage, e il giocatore
  ne sceglie una (vedi sotto). L'auto scelta imbocca l'autostrada.
- **Le altre cinque auto del garage** (deciso dal proprietario il 17/11/2026): Fiat Panda, Audi 80 Avant, Fiat Grande
  Punto, Opel Corsa, Volkswagen Polo, le più vecchie ed economiche del gioco. Il giocatore sceglie una delle sei (anche la Volvo):
  quella è l'auto con cui parte, malconcia. Le altre cinque finiscono in vendita all'Autosalone Notte, come le altre auto (lì c'è scritto che erano dello zio).
- **Lo zio morto si chiama Claudio.** (Il notaio non dice altro di lui che «di notte la strada si fa più lunga».)
- **L'autostrada** è infinita e va solo avanti. Le uscite sono bloccate (come, da vedere).
- **Il telefono** (fatto, `telefono.js`): all'inizio solo app normali (Telefono, Messaggi, Rubrica, Mappa, Foto,
  Orologio). Sull'autostrada compaiono cartelloni con una domanda; quando li superi spunta l'icona da scaricare
  (download finto) di Lavori, Passeggeri, Motel. Più avanti compaiono **da sole, senza scaricarle**, app horror e
  arrivano chiamate strane.
- **I pensieri del protagonista** (fatto, `pensieri.js`): ogni tanto scrive cosa pensa, sulla strada, 8-10 secondi, senza vignetta: la radio che non conosce le stazioni (km 1), il navigatore, fame, sete, sonno, igiene, pensieri a caso. Non si ripetono. I testi sono segnaposto.
- **Effetti pensati**: il bussare nel bagagliaio (poi non c'è niente), chiamate strane, app che compaiono da sole.

- **Storia secondaria «Ti tengo compagnia»** (chiesta dal cognato il 20/11/2026, dalla proposta di Codex, fatta in
  `jeshka.js`): Jeshka (meccanica russa, Neon Kustom) e Luca (Da Luca Tuning) si sono persi per un'ora a un'area di
  servizio e da allora ognuno si è fermato ad aspettare l'altro. Il giocatore li conosce nei due negozi, porta il cavo
  di lei con il nastro di lui, la accompagna e al piazzale del tuning lampeggia cinque volte (il segnale della signora
  del furgone). Jeshka è un personaggio nuovo: **non è Rosa**, che resta con Ottavio nella storia principale. Lungo il
  tragitto un numero sconosciuto scrive «Ti tengo compagnia» come lui: la strada imita le voci, e lei lo smaschera.
  Restano fuori, per ora: l'entrata tramite Marco e quella durante un'incursione.

## Da decidere
- Chi era Claudio, perché la strada, qual è il segreto.
- Le altre 5 auto del garage: nomi e quando si sbloccano.
- Gli atti, i chilometri dei momenti chiave, il finale.
- Se Mario, Luca, il barista, il benzinaio hanno un ruolo nella storia o restano negozi.
- Quali effetti e quando (sonno, specchietto, radio, cassa del motel...).

## Dove si attacca nel codice
- **Capitoli** ai km: `VG_CHAPTERS` (oggi solo la partenza). **Eventi strani**: `VG_ODD`, vuoto. **Passeggeri speciali**:
  `VG_STORY_PAX`, vuoto. Il formato è scritto sopra a ciascuno in `viaggio.js`.
- **Pensieri**: `PENS_KM`, `PENS_BISOGNI`, `PENS_ANIMO`, `game.vgThink(testo)` per dirne uno dalla storia.
- **Telefono**: `TEL_SMS` (messaggi per km), `TEL_ATTI` (momenti), `TEL_APP_OFFERS` (cartelloni), `window.telefono`.
- **Prologo**: `PRO_LETTERA`, `PRO_NOTAIO`, `PRO_AUTO`, `PRO_PARENTE`.
