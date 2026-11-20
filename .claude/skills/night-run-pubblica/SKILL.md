---
name: night-run-pubblica
description: Porta il lavoro su Night Run al giocatore - commit in italiano con le righe finali, push diretto su main (GitHub Pages, senza pull request), aggiorna la copia giocabile come artifact su claude.ai e PASSAGGIO.md. Usala a fine lavoro, quando l'utente dice "pubblica", "carica", "unisci", o quando c'è un ramo da portare su main.
---

# Pubblicare Night Run

## Prima di tutto
- `git fetch origin main` e porta il tuo ramo in pari: il cognato (`cestinomail98-collab`) lavora in parallelo.
- `git ls-remote origin` mostra anche i rami e le pull request aperte (`refs/pull/N/head`). Il `fetch` normale
  prende solo `main`: per un altro ramo `git fetch origin <ramo>:refs/remotes/origin/<ramo>`.
- **Su `main` si carica direttamente**, chiunque dei due lavori (proprietario o cognato): niente pull request, niente
  approvazione. Il cognato ha piena libertà di aggiungere, cambiare ed eliminare.
- Prima del push: `git fetch origin main` e `git merge` (mai `push --force`, mai riscrivere la storia di `main`).
  In caso di conflitti, risolvili tenendo il lavoro di tutti e due e dillo. Test che passano e, se tocchi il gioco,
  prova nel browser (`night-run-prova`).
- Un ramo a parte (anche `kimi/...` o una pull request aperta per abitudine) si unisce su `main` direttamente da chi
  ci lavora. Il controllo lo fanno insieme la sera (`night-run-sera`).

## All'inizio del lavoro
- Una riga in `INCORSO.md` (chi, cosa, file che tocchi, da quando), caricata subito su `main`.

## Commit
- Messaggio in italiano: prima riga che dice cosa cambia per il giocatore, poi i dettagli.
- Ultima riga prima di Co-Authored-By: `Per: proprietario` o `Per: cognato` (chi ha chiesto il lavoro: se non lo sai,
  chiedilo una volta all'inizio della sessione).
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

## A fine lavoro
- Togli la tua riga da `INCORSO.md`.
- In cima a `DIARIO.md` (sotto il titolo) una voce `## gg/mm/aaaa · proprietario|cognato` con 2-3 righe: fatto, aperto,
  cosa serve dall'altro.
- Dopo il push, se puoi, guarda che i test su GitHub siano verdi.

## Documentazione
Ogni funzione nuova va in `AGENTS.md` (tabella dei file, conteggio dei test) e `PASSAGGIO.md` ("Com'è fatto il
gioco", lavori aperti). `docs/storia/STORIA.md` si tocca solo se lo chiede il proprietario.

## Rapporto finale
In italiano: cosa è cambiato per il giocatore, cosa è stato provato e cosa no, link all'artifact e, se ci sono,
link alle pull request scritti per intero (`https://github.com/Akaoni97/Night_Run/pull/N`).
