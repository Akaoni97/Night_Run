# Night Run · La storia (nuova, bozza 1)

Qui si annota cosa è **deciso**, cosa è **proposto** (da approvare) e cosa **manca**. La storia è di chi la scrive: un
assistente non aggiunge niente senza che lo chieda. La vecchia storia è stata cancellata il 17/11/2026 (è nella
cronologia git, ma non si rimette).

## Come deve andare
Horror **graduale**. Prima tutto tranquillo e normale, poi una piccola cosa che non torna, poi sempre più macabro e
psicologico. Il telefono è lo strumento principale: lì si sviluppano le cose strane.

## Deciso (fatto nel gioco)
- **Prologo** (`prologo.js`): una lettera dello studio notarile Ferri invita a ritirare l'eredità di uno zio morto. La
  BMW E36 blu arriva all'edificio, il notaio fa scegliere una tra 6 auto del garage, tutte sotto un telo. Per ora si
  può prendere solo la **Volvo V40**; le altre cinque aspettano. La Volvo imbocca l'autostrada. (La sigla con la
  Supra è stata tolta: resta solo una schermata col titolo.)
- **Lo zio morto si chiama Claudio.** Il notaio dice solo che «di notte la strada si fa più lunga».
- **L'autostrada** è infinita e va solo avanti. Le uscite sono bloccate.
- **Il telefono** (`telefono.js`): all'inizio solo app normali (Telefono, Messaggi, Rubrica, Mappa, Foto, Orologio).
  Sull'autostrada compaiono cartelloni con una domanda; quando li superi spunta l'icona da scaricare (download finto)
  di Lavori, Passeggeri, Motel. Più avanti compaiono **da sole, senza scaricarle**, app horror e arrivano chiamate strane.
- **I pensieri del protagonista** (`pensieri.js`): scrive cosa pensa, sulla strada, 8-10 secondi, senza vignetta. Non si
  ripetono. Il primo, al km 1, è la radio che non conosce le stazioni.
- **Effetti pensati**: il bussare nel bagagliaio (poi non c'è niente), chiamate strane, app che compaiono da sole.

## Proposta (mia, da approvare o cambiare): «Ovunque»

### In una frase
La strada è una piattaforma di lavoretti che **assume chi la guida**, e nessuno si è mai licenziato.

### Il giocatore crede / è vero
- **Crede**: ha ereditato un'auto e un modo per fare soldi con l'app, come un corriere qualunque.
- **È vero** *(da approvare)*: lo studio Ferri non gli ha dato solo la Volvo, lo ha **iscritto** a Ovunque al posto
  di Claudio. Da quel momento l'app lo chiama Claudio, ha il suo turno e il suo conto. Claudio non è «morto» come lo
  intende la famiglia: il suo turno non è mai finito. Le sei auto sotto il telo sono di sei autisti; ognuno aspetta
  qualcuno che guidi al posto suo.

### I fili
- **Ovunque** è il nome di tutto: Motel *Ovunque*, e le app Lavori, Passeggeri, Motel. Una sola ditta, mai vista in faccia.
- **Il turno**: le ore passano sull'app anche quando dormi. La **valutazione** sale con le consegne fatte bene.
- **Le sei auto**: la Volvo è di Claudio. Le altre cinque si sbloccano con la storia, una per volta, ognuna con un
  autista che non c'è più (nomi **da decidere**: per ora «auto 2…6»).
- **Il bagagliaio** (e la cassa del motel): è dove la strada «lascia» le cose. Lì bussa qualcuno.

### Atti (km indicativi, da tarare giocando)
| Atto | Km | Cosa succede | Dove si vede |
| --- | --- | --- | --- |
| 1 · Il lavoro | 0-30 | Tutto normale: cartelloni, app che si scaricano, primi lavori. Un lavoro risulta **già pagato** prima della consegna (km ~15). | telefono, soldi |
| 2 · Il turno | 30-120 | L'app ti chiama **Claudio** (km ~30). Pensiero: «Un errore dell'eredità, sicuro.» Primo **bussare nel bagagliaio** (km ~50), aprendo non c'è niente. Una **chiamata di Claudio** (km ~80): nessuno parla, cade dopo un minuto. | pensieri, suono, chiamata |
| 3 · I colleghi | 120-300 | In Rubrica compaiono gli altri autisti: ti scrivono come se tornassi dopo un'assenza. In Messaggi si sbloccano i **messaggi vecchi di Claudio**, con date dopo la sua morte. Nella cassa del motel c'è roba che non hai messo tu. | telefono, cassa |
| 4 · Ovunque | 300-600 | Compaiono **da sole** *Ultima Uscita* (conto alla rovescia verso un'uscita che non c'è) e *Segreteria* (vocali di Claudio). *Passeggeri* mostra un posto occupato. Il bussare diventa una voce. Si sblocca la **seconda auto**. | app strane, effetti |
| 5 · Il rinnovo | 600+ | L'app propone il **rinnovo del contratto**. Qui si decide il finale. | scelta |

### Gli effetti, con le loro regole
- **Bussare nel bagagliaio**: tre colpi di notte, solo mentre guidi, mai due volte nello stesso tratto; sempre seguito da
  un pensiero («Sarà un assestamento»). Non c'è mai niente. Cresce: più colpi, poi un ritmo, poi parole.
- **Chiamate strane**: arrivano a orari fissi, durano poco, non si sente niente; più avanti si sente respirare, poi
  un rumore di motore. Sempre dal contatto «Zio Claudio».
- **App che compaiono da sole**: mai con un avviso. Le noti dopo, perché prima non c'erano.
- **Pensieri**: prima spiegazioni razionali, poi dubbi, poi smettono di spiegare. Mai due eventi a meno di 60 km.

### Finali (idee, tutte da decidere)
1. **Firmare il rinnovo**: tieni il turno, la strada non finisce. Il gioco continua senza fine.
2. **Far uscire Claudio**: accompagni «quello che bussa» all'uscita che non c'era. Lui esce, tu resti.
3. **Spegnere il telefono**: se ci arrivi con valutazione bassa, la strada smette di chiamarti. Silenzio.

### Personaggi
- **Claudio**: lo zio. Non lo vedi mai. Cosa voleva, **da decidere**.
- **Il notaio (Ferri)**: ha fatto l'iscrizione. Sa tutto, dice poco. Altri incontri, **da decidere**.
- **Niko, Luca, il barista, il benzinaio**: restano generici (negozi), a meno che tu non decida altro.

## Da decidere
- Ti piace «Ovunque», o la strada è altro (un'app che assume, un patto, un luogo)?
- Chi era Claudio e cosa vuole davvero.
- I nomi degli autisti delle altre 5 auto e come le incontri.
- I finali, e se il primo (strada senza fine) esiste.
- I km degli atti: sono stime.

## Dove si attacca nel codice
- **Capitoli** ai km: `VG_CHAPTERS` (oggi solo la partenza). **Eventi strani**: `VG_ODD`, vuoto. **Passeggeri speciali**:
  `VG_STORY_PAX`, vuoto. Il formato è scritto sopra a ciascuno in `viaggio.js`.
- **Pensieri**: `PENS_KM`, `PENS_BISOGNI`, `PENS_ANIMO`, `game.vgThink(testo)` per dirne uno dalla storia.
- **Telefono**: `TEL_SMS` (messaggi per km), `TEL_ATTI` (momenti), `TEL_APP_OFFERS` (cartelloni), `window.telefono.sms/ring/install`.
- **Prologo**: `PRO_LETTERA`, `PRO_NOTAIO`, `PRO_AUTO`, `PRO_PARENTE`.
- **Mancano nel codice**: il bussare nel bagagliaio (suono + pensiero), le app che compaiono da sole come app vere
  (Ultima Uscita, Segreteria, Passeggeri strano), il contatto «Zio Claudio» che chiama a un km preciso.
