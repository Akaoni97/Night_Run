---
name: night-run-pubblica
description: Porta il lavoro su Night Run al giocatore - unisce le pull request del cognato, commit in italiano con le righe finali, push su main (GitHub Pages), aggiorna la copia giocabile come artifact su claude.ai e PASSAGGIO.md. Usala a fine lavoro, quando l'utente dice "pubblica", "carica", "unisci", o quando arriva una pull request del cognato.
---

# Pubblicare Night Run

## Prima di tutto
- `git fetch origin main` e porta il tuo ramo in pari: il cognato (`cestinomail98-collab`) lavora in parallelo.
- `git ls-remote origin` mostra anche i rami e le pull request aperte (`refs/pull/N/head`). Il `fetch` normale
  prende solo `main`: per un altro ramo `git fetch origin <ramo>:refs/remotes/origin/<ramo>`.
- Pull request del cognato verso `main`: si uniscono quando il proprietario lo chiede. Prima leggi il diff, fai
  girare i test e, se tocca il gioco, provala nel browser (`night-run-prova`). In caso di conflitti, risolvili tenendo
  il lavoro di tutti e due e dillo.
- Il cognato a volte usa Kimi Code (rami `kimi/...`): se tocca gli stessi file, chiedi al proprietario prima di unire.

## Commit
- Messaggio in italiano: prima riga che dice cosa cambia per il giocatore, poi i dettagli.
- Righe finali come chiedono le istruzioni della sessione (Co-Authored-By e Claude-Session).
- Niente file di prova, foto o WAV nel repository; niente file presi da mod o senza licenza.

## Push
`main` è pubblicato su GitHub Pages (https://akaoni97.github.io/Night_Run/), si aggiorna in qualche minuto.
Push con fino a 4 tentativi se la rete sbaglia. Il messaggio "This repository moved" è normale.

## Artifact (copia giocabile su claude.ai)
URL: https://claude.ai/artifact/PstSTNEs7iTjYCtRfTKodD (versione attuale in `PASSAGGIO.md`).
1. In una sessione nuova, prima **leggi** l'artifact (azione `read`).
2. Costruisci la pagina:
   ```bash
   tail -n +6 index.html | grep -v -x -e '</head>' -e '<body>' -e '</body>' -e '</html>' > <cartella>/night_run.html
   ```
3. Pubblica con lo stesso `url`, passando in `files` i `.js` (e le immagini di `img/`) cambiati.
4. Aggiorna il numero di versione in `PASSAGGIO.md` e committalo.

## Documentazione
Ogni funzione nuova va in `AGENTS.md` (tabella dei file, conteggio dei test) e `PASSAGGIO.md` ("Com'è fatto il
gioco", lavori aperti). `docs/storia/STORIA.md` si tocca solo se lo chiede il proprietario.

## Rapporto finale
In italiano: cosa è cambiato per il giocatore, cosa è stato provato e cosa no, link all'artifact, link alle pull
request scritti per intero (`https://github.com/Akaoni97/Night_Run/pull/N`).
