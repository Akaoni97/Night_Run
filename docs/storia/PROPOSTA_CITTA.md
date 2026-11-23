# Le dodici capitali: da dare un'identità (proposta per Luca)

Scritta il 23/11/2026 da Claude su richiesta del proprietario. **Non cambia la trama e non inventa niente di nuovo sulla storia**:
la storia la scrive Luca (vedi `LIMITI.md`). Qui ci sono lo stato di oggi, quello che si potrebbe aggiungere come
contorno e le domande a cui deve rispondere lui. Gli esempi sono **solo per far capire la forma**, non sono decisioni.

## 1. Com'è oggi (letto dal codice)
- Il giro è di 504 km: dodici capitali da 12 km ciascuna e 30 km di paesaggio in mezzo (`VG_ROUTE` in `viaggio.js`).
  Giro: Tokyo, Roma, Parigi, Londra, Stoccolma, Berlino, Praga, Vienna, Madrid, Lisbona, Atene, Washington D.C.
- Ogni capitale ha già (`capitali.js`): un testo d'arrivo, **tre cartelli** sulla strada, **due quartieri** con il nome,
  **quattro eventi** (`CAP_EVT`: due quotidiani e due strani, ognuno con la sua fase e il suo posto: bar, strada, motel...),
  un pensiero all'uscita (`CAP_PENS`) e una conversazione che parte da sola all'arrivo (flag `luogo_<id>`).
- Fasi della storia (`STORIA_FASE` in `storia.js`): I Tokyo e Roma · II Parigi · III Londra, Stoccolma, Berlino, Praga, Vienna ·
  IV Madrid e Lisbona · V Atene e Washington.
- Momenti garantiti (`STORIA_BEATS`): Parigi (distanza impossibile), Stoccolma (indizio del sangue), Praga (foto originale),
  Lisbona (imitazione di Dario), Madrid (presenza scoperta), Atene (fase V). Le incursioni 1-4 partono dopo Londra e Atene.
  **Senza un momento garantito**: Tokyo, Roma, Londra (solo la prima incursione), Berlino, Vienna, Washington (la porta).

## 2. Cosa manca (ed è solo l'aspetto, non la trama)
1. **Le città sono tutte uguali da vedere e da sentire.** Nel codice sono tutte `bg: 'city'` (`GAME_LOCS`): stesso fondale, stessi
   palazzi e lo stesso traffico. Cambiano solo il testo e i cartelli. Oggi il giocatore le distingue leggendo.
2. **I 30 km di collegamento si ripetono**: San Gimignano 3 volte, Bassa, Hakone, Positano e Route 66 due volte. Dopo la quinta
   capitale il giro sembra rifatto.
3. **I momenti forti stanno tra Parigi e Madrid**; Tokyo, Roma, Berlino, Vienna e Washington hanno solo gli eventi di contorno.
4. **Il percorso è lineare**: nessuna scelta di strada, mentre la storia vive di scelte (Marco, patto, varco).

## 3. Proposte (da piccola a grossa)
**A. Una cosa da vedere per città** (**FATTO il 23/11, v0.112, dal proprietario: ogni capitale ha palazzi, insegne e monumenti suoi**; restano da decidere B, C e D) (solo grafica e suono, zero trama). Per ognuna, una di queste: una sagoma lontana
(il sistema dei punti di riferimento di `quartieri2d.js` ne ha: ruota panoramica, gru, ciminiere, guglia, cisterna, pagoda),
una luce o una tinta diversa del cielo, un meteo che torna spesso (nebbia a Londra), una stazione radio o un jingle suo.
Esempi di forma, da correggere: Tokyo pagoda, Parigi guglia, Londra nebbia, Stoccolma acqua che riflette le luci
(il testo d'arrivo già lo dice), Atene Acropoli lontana (già nel testo d'arrivo).

**B. I 30 km di collegamento come «gallerie» tutte diverse.** Ora ripetono un paesaggio vero. Si potrebbe dare a ognuno
un'ora, un meteo e una cosa strana sua, così la ripetizione diventa voluta (la strada che si ripete è già un tema).

**C. Un momento garantito per ogni capitale.** Gli eventi di `CAP_EVT` ci sono già; qui si tratta di decidere, per le
capitali senza momento forte, se serve un nodo di conversazione, una scena o solo un'anomalia.

**D. Un bivio** (grosso, per ultimo): dopo una capitale due uscite portano a prove diverse, e il finale dipende da quali
hai raccolto. Si può fare solo dopo che A, B e C sono chiari.

**E. Aggiungere città: no.** Dodici bastano e si allungherebbe il giro (già ~6 ore) senza dare storia in più.

## 4. Domande per Luca (rispondi per numero, anche solo «sì / no / dopo»)
1. **A**: ti va bene una sola cosa da vedere per città? Per ognuna dimmi la cosa, o scegli tra le mie.
2. **B**: i collegamenti li lasciamo paesaggi veri o li facciamo diventare gallerie strane, una diversa per tratto?
3. **C**: quali capitali senza momento forte (Tokyo, Roma, Berlino, Vienna, Washington) ne vogliono uno? Lo scrivi tu.
4. Gli eventi `CAP_EVT` strani sono già nelle fasi giuste, o ne sposti qualcuno?
5. **D**: il bivio ti interessa, o la storia resta lineare?
6. Gli atti: restano le cinque fasi di oggi, o le regoli?

Nota tecnica: A e B non toccano il salvataggio e si fanno in `street2d.js`, `quartieri2d.js` e `viaggio.js` senza cambiare la storia.
C e D sì: restano a te e al proprietario.

## 5. Risposte di Luca (23/11/2026, notte)
1. **Sì**: una cosa da vedere per città va bene (già fatta nella v0.112).
2. **I collegamenti: subito paesaggi veri, poi andando avanti nel viaggio diventano strani.**
3. **Momenti forti**: Roma al **Colosseo**, Washington all'**obelisco**, Tokyo alla **torre piena di luci**; Vienna da decidere. (Cosa succede in quei momenti lo scrive Luca, da confermare con Nico.)
4. Non so: da decidere.
5. **Qualche bivio sarebbe bello, inserito nella storia. Progetto futuro** (annotato in `SOSPESI.md`, punto 28).
6. Non so: **la storia è da confermare tutta con Nico.**
