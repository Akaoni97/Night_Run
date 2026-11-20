# Modifiche fatte da Codex

Registro di quello che viene da Codex e come è entrato nel gioco. Il codice nasce da Codex; Claude lo ha ricopiato a
mano su `main`, adattandolo al gioco di oggi. Le modifiche del cognato e del proprietario non sono di Codex, anche
quando stanno negli stessi file.

## 18/11/2026 · audio, capitoli (adattati da Claude la stessa notte)

**Da dove viene.** Il cognato ha chiesto a Codex: affidabilità di missioni e salvataggi, un carattere del motore più
deciso, modifiche riconoscibili e annullabili. Codex ha lavorato sulla copia personale `cestinomail98-collab/Night_Run`
(ramo `codex/missioni-salvataggi-audio-20261118`, bozza di pull request n. 1 lì, mai unita), partita dal gioco del 16/11
(`64e0577`), 173 commit indietro. Ha poi preparato uno zip per Claude (`Night_Run_Codex_per_Claude.zip`: patch,
sorgenti, prove). Niente è stato applicato alla cieca: le parti utili sono state riscritte sul codice attuale.

### Preso

| Commit su `main` | Cosa | File e funzioni |
| --- | --- | --- |
| `3c2c10c` | **Volvo 850 R a cinque cilindri**: ordine 1-2-4-5-3, uno scoppio ogni 144°, collettore suo. Prima la descrizione diceva «cinque cilindri» ma il motore ne aveva sei. | `dsp.js` (`configure`: `nCyl` 5, lunghezze `L`), `cars.js` (riga `v850` di `GEN_NEW`; `cyl >= 5` per scarico di serie e catback) |
| `3c2c10c` | **Carattere del motore «Codex · deciso»**, opzionale: più corpo verso i 180 Hz e presenza verso i 1150 Hz, dosati col carico, con saturazione morbida e passaggio graduale. Solo sulla sintesi dello scarico: radio, campioni caricati, potenza e scoppi non cambiano. Di serie è **Originale**. | `dsp.js` (`codexBody`, `codexEdge`, `codexLoad`, `mixT.character`, blocco in `render`), `index.html` (menu Guida → «Carattere del motore», `S.character`, `dspCfg`), `strumenti/ascolta.mjs` (`CARATTERE=codex`) |
| `f85064a` | **Capitolo letto alla conferma**: il capitolo del Viaggio si segna con «Parti»/«Continua» o allo scadere dei 40 s, non appena compare. Se la pagina si ricarica a capitolo aperto, o un locale chiude la domanda, il capitolo ritorna. Non scavalca un'altra domanda aperta. | `viaggio.js` (`vgChapter`; `startTrip` azzera la domanda prima del capitolo 0) |

Test: `test/codex-audio.test.js` (i cinque di Codex, senza cambiarli) e `test/codex-capitoli.test.js` (quattro, scritti
da Claude; tre falliscono sul codice di prima). Suite completa: 166 passati su 166.

### Lasciato fuori, e perché

- **Consegne e ritiri saltati spostati alla sede dopo** (`VG.nextStop`, `VG.ahead`, `vgRecoverDeliveries`, recupero in
  `missioni.js`): oggi vale il contrario, scelto apposta. Nel tutorial ti riporta davanti al locale; dopo, l'uscita
  saltata annulla la consegna.
- **Copia di sicurezza dei salvataggi** (`salvataggi.js`): serviva prima di provare le modifiche sulla copia vecchia e
  copriva tre chiavi su cinque (mancano `nr_pg` e `nr_tasti`). Se serve, meglio un «esporta/importa partita» vero.
- **Gli otto test di affidabilità e i tre dei salvataggi**: pretendono il recupero delle consegne o il file escluso.
- **I due documenti di Codex** (`MODIFICHE_CODEX.md` e `PASSAGGIO.md` della copia vecchia): sostituiti da questo file.

### Prove

- Supra, V40, E30 e Golf in «Originale»: uscita del motore audio identica, campione per campione, a quella di prima.
- 850 R a 4956 giri: scoppi a 207 Hz (cinque cilindri) invece di 248 Hz (sei), come deve essere.
- «Deciso» sull'allungo: circa +0,3/0,5 dB, nessun campione saturato, picchi sotto −0,9 dB.
- Browser: la scelta nel menu Guida si salva, la console non ha errori.
- Non provato: l'ascolto vero in auto, sul PC (i file WAV sono fatti con `strumenti/ascolta.mjs`).

### Come annullare

Su `main`, con un commit nuovo (mai `reset` o `push --force`):

```bash
git revert 3c2c10c
```

toglie solo l'audio: 850 R di nuovo a sei cilindri, niente «Carattere del motore». Una partita salvata con «Codex · deciso»
torna da sola a Originale.

```bash
git revert f85064a
```

toglie solo i capitoli letti alla conferma. Si possono annullare uno o tutti e due; questo documento resta.
