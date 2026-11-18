---
name: night-run-sera
description: Controllo della sera di Night Run, prima di cominciare un lavoro nuovo - cosa è cambiato su main dall'ultimo controllo (commit, file toccati ed eliminati, chi), test, prova nel browser delle parti toccate, rapporto per il proprietario e il cognato, poi controllo segnato come fatto. Usala quando l'utente dice "facciamo il check", "controllo della sera", "cosa è cambiato", o all'inizio di una sessione di lavoro la sera.
---

# Il controllo della sera

Il proprietario e il cognato caricano tutti e due direttamente su `main`, senza approvazione. Il controllo non è un
permesso: serve a sapere cosa è cambiato e ad accorgersi in tempo se qualcosa si è rotto.

1. `strumenti/controllo_sera.sh`: novità su `main` dal segnalibro `controllo-sera` (un ramo: non ci si lavora) (la prima volta: ultime 24 ore),
   file toccati ed eliminati, test sul `main` aggiornato.
2. Leggi le voci nuove di `DIARIO.md` e la tabella di `INCORSO.md` (lavori rimasti a metà?). Leggi i diff dei commit nuovi (`git show <commit>`), almeno quelli che toccano il gioco. Per ogni novità che si
   vede, provala nel browser con `night-run-prova` (foto su computer e telefono, errori della console).
3. Rapporto in italiano, breve, diviso in: **novità** (cosa cambia per chi gioca, chi l'ha fatta se si capisce dai
   messaggi), **cosa funziona**, **cosa si è rotto o sembra strano** (con la prova), **file eliminati** (solo da
   segnalare: eliminare è libero). Niente giudizi sul lavoro dell'altro: si segnala, si decide insieme.
4. Se qualcosa è rotto, si propone la correzione ma **non si annulla il lavoro del cognato** senza che lo chiedano.
5. Quando hanno guardato: `strumenti/controllo_sera.sh fatto` (sposta il segnalibro `controllo-sera` su GitHub,
   vale per tutti e due).
