# Skill di Night Run

Le skill sono istruzioni per gli assistenti. Claude Code le legge da sola: guarda la descrizione in testa a ogni
`SKILL.md` e carica la skill quando il lavoro ci assomiglia. Si possono anche chiamare per nome, con `/` seguito dal
nome (per esempio `/night-run-prova`). Kimi e gli altri assistenti devono aprire a mano il `SKILL.md` giusto prima
di cominciare. Nessuna skill cambia il gioco da sola: dicono come lavorare.

Ordine di importanza: prima `AGENTS.md`, poi le skill di Night Run, poi quelle generiche.

## Skill del progetto (scritte per Night Run, in italiano)

| Skill | Cosa fa | Come si comporta |
| --- | --- | --- |
| `night-run-prova` | Prova una modifica come un giocatore: test, gioco nel browser a copione, foto su computer e telefono, errori della console. | Parte dopo ogni modifica o quando si chiede "provalo". Usa `strumenti/prova.js` (Playwright) e finisce con un rapporto onesto su cosa va e cosa no. |
| `night-run-funzione` | Aggiunge una novità di gioco nel modo in cui è costruito: file nuovo, tappa, locale, app del telefono, interno, traguardo, stato salvato, test. | Parte quando si chiede un negozio, un'app o un sistema nuovo. Fa seguire l'ordine dei file, i test e la documentazione. |
| `night-run-pixel` | Regole per disegnare nel 2D: coordinate 640×360 a densità doppia, strada, metri, luci notturne, facciate, interni. | Parte prima di disegnare o ritoccare qualcosa nel 2D. Per il disegno comanda lei. |
| `night-run-audio` | Ascolta e misura il motore fuori dal browser: salva un WAV e stampa volume, saturazione e frequenza degli scoppi. | Parte quando si tocca `dsp.js`, la voce di un'auto, cambio, limitatore o turbo. Usa `strumenti/ascolta.mjs`. |
| `night-run-auto` | Aggiunge un'auto o un veicolo dai disegni del proprietario (zip di PNG). | Parte quando arriva un disegno nuovo. Non inventa mai un veicolo: se manca il disegno, lo chiede. |
| `night-run-storia` | Dove e come si scrive la storia horror: capitoli, eventi strani, passeggeri, pensieri, telefono, prologo. | Parte quando si lavora alla trama. Dice anche cosa non deve fare chi non scrive la storia. |
| `night-run-controllo` | Controllo generale con un voto per area e una lista di miglioramenti ordinata per importanza. | Parte con domande come "cosa miglioreresti?" o "fai un controllo". Guarda il gioco con le foto, non solo il codice. |
| `night-run-pubblica` | Porta il lavoro al giocatore: unisce le pull request, commit in italiano, push su `main`, artifact su claude.ai, `PASSAGGIO.md`. | Parte con "pubblica", "unisci" o quando arriva una pull request. Prima legge il diff e prova. |

## Skill generiche (prese da fuori, in inglese)

Copiate senza modifiche, licenza Apache 2.0. Provenienza in `FONTI.md`.

| Skill | Cosa fa | Come si comporta |
| --- | --- | --- |
| `game-feel` | Dà il "succo" a un'azione che già funziona: scossa dello schermo, fermo immagine sui colpi, movimenti morbidi (easing), schiacciamento, lampi ed effetti a strati. | Parte quando un'azione sembra piatta o senza peso (urti, cambiate, sgasate, premi). È generica: le regole di disegno restano quelle di `night-run-pixel`, e niente lampi forti e ripetuti a schermo intero. |
| `pixel-art` | Principi generali di pixel art: palette limitate, rampe di colore, dithering, contorni selettivi, animazione a pixel. | Parte quando si parla di pixel art in generale. Fa da libro di teoria: dove dice altro rispetto a `night-run-pixel` (per esempio palette da console vecchie), vale `night-run-pixel`. |

## Strumenti usati dalle skill

- `node strumenti/prova.js [--mob] [--out cartella] passo...`: gioco nel browser a copione (elenco dei passi in testa
  al file).
- `node strumenti/ascolta.mjs <auto> <copione> <file.wav> [vista] [ambiente]`: motore fuori dal browser.

## Aggiungere una skill

Una cartella in `.claude/skills/<nome>/` con un `SKILL.md` che comincia con `name` e `description`. La descrizione
deve dire chiaramente quando usarla. Aggiorna questo catalogo e la tabella in `AGENTS.md`. Se è presa da fuori,
segna repository, commit e licenza in `FONTI.md` e copia la licenza nella cartella.
