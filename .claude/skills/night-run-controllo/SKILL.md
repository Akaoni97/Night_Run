---
name: night-run-controllo
description: Controllo generale di Night Run con un voto per area (guida, grafica, suono, locali, telefono, progressione, telefonino, prestazioni, test) e una lista di miglioramenti ordinata per impatto. Usala quando l'utente chiede "cosa miglioreresti?", "cosa manca?", "fai un controllo del gioco", o prima di decidere la prossima novità.
---

# Controllo del gioco

Metodo adattato dalla skill `improve-game` di OpusGameLabs (licenza MIT, github.com/opusgamelabs/game-creator),
riscritto per Night Run.

## 1. Guarda il gioco, non solo il codice
Con `strumenti/prova.js` (skill `night-run-prova`), su computer e su telefono:
- partenza: `foto:inizio`, poi `tieni:KeyW:4000 foto:guida`;
- una tappa per tipo: `tappa:bar entra foto:bar esci`, e così per `grill niko shop style motel dealer junk`;
- telefono: `tel foto:telefono`, e le app principali;
- quartieri e paesaggi: `km:5`, `km:12`, `km:40`, `km:120` con una foto ciascuno.
Annota gli errori della console e le cose che si vedono male (testi tagliati, elementi sotto il pannello, buchi).

## 2. Voto per area (1 rotto, 3 funziona ma povero, 5 rifinito)
| Area | Cosa guardare |
| --- | --- |
| Guida | risposta ai tasti, sensazione di velocità, cambio, guida automatica, frenate |
| Grafica della strada | quartieri, luci, traffico, effetti, coerenza del pixel art |
| Locali e interni | scene vive, pannelli chiari, cose da fare in ogni tappa |
| Telefono | app utili, avvisi giusti, niente spam |
| Progressione | soldi, auto, pezzi: c'è sempre un prossimo obiettivo? ritmo dei premi |
| Storia e atmosfera | tensione graduale, pensieri, eventi (la storia la scrive il cognato: solo osservazioni) |
| Suono | motore (`strumenti/ascolta.mjs`), ambienti, effetti (nel browser di prova non si sentono: dillo) |
| Telefonino | tocco, pedali, pannelli leggibili a 390 px |
| Prestazioni | fluidità, qualità bassa (`SS = 1`), dispositivi lenti |
| Salvataggi | partite vecchie che si caricano senza errori dopo le novità |
| Test | logica coperta dai test, conteggio che non scende |

Totale su 55.

## 3. Proposte
Al massimo 5, ordinate per impatto sul giocatore, ognuna con: cosa cambia per chi gioca, quanto lavoro (piccolo,
medio, grande), quali file. Niente proposte che inventano veicoli (solo dai disegni) o pezzi di storia.

## 4. Rapporto
In italiano, semplice: la tabella dei voti, le proposte, e cosa non hai potuto controllare. Non cambiare niente
nel gioco finché l'utente non sceglie.
