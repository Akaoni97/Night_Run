# Comandi utili per Night Run

Per il proprietario e il cognato: i comandi di Claude Code con la barra (`/`), le skill di Night Run, gli strumenti
del progetto e le scorciatoie da tastiera, con la spiegazione accanto.

- **I comandi si scrivono all'inizio del messaggio.** Quello che segue il nome del comando ne diventa l'argomento,
  per esempio `/compact tieni le decisioni sulla storia`.
- **Scrivendo solo `/` compare l'elenco** dei comandi disponibili; continuando a scrivere lo si filtra.
- **Non tutti i comandi esistono dappertutto.** Alcuni funzionano solo nel terminale (Claude Code sul computer) e non
  nell'app o sul sito (claude.ai/code). Se un comando non compare nell'elenco, lì non c'è.

Elenco preso dalla documentazione ufficiale il 18/11/2026: https://code.claude.com/docs/en/commands
Claude Code si aggiorna spesso: `/release-notes` mostra le novità.

---

## 1. I più utili per noi

| Comando | A cosa serve |
| --- | --- |
| `/compact [istruzioni]` | Riassume la conversazione per liberare spazio quando diventa lunga e Claude rallenta o "dimentica". Le istruzioni dicono cosa tenere nel riassunto: `/compact tieni i nomi dei file toccati e cosa resta da fare`. |
| `/clear` | Conversazione nuova e vuota, per un lavoro diverso. Le regole del progetto (`AGENTS.md`, skill) restano. La vecchia si ritrova con `/resume`. |
| `/context` | Mostra quanto è piena la memoria della conversazione e cosa la occupa. Utile per capire quando fare `/compact`. |
| `/resume` | Riapre una conversazione di prima, scegliendola da un elenco o col nome. |
| `/rename [nome]` | Dà un nome alla sessione (es. `/rename teaser`), così con `/resume` la si ritrova. |
| `/rewind` | Torna indietro a un punto della conversazione e/o del codice, se Claude ha preso una strada sbagliata. Si apre anche con `Esc` due volte a prompt vuoto. |
| `/plan [cosa fare]` | Modalità piano: prima di toccare i file Claude propone un piano e aspetta l'ok. Per lavori grossi. |
| `/diff` | Mostra le modifiche fatte ai file finora, prima di caricarle. |
| `/code-review` | Controlla le modifiche in cerca di errori. Con `--fix` le corregge, con un numero di pull request controlla quella. `/review` è lo stesso comando. |
| `/model` | Cambia il modello di Claude (più potente, o più veloce ed economico). |
| `/effort [livello]` | Quanto "ragiona" Claude: da `low` (veloce) a `xhigh`/`max` (lento, per i problemi difficili). |
| `/fast` | Attiva o spegne la modalità veloce (risposte più rapide). |
| `/usage` | Quanto avete usato del piano e quanto manca ai limiti. `/cost` e `/stats` fanno lo stesso. |
| `/btw [domanda]` | Domanda veloce a margine, che non entra nella conversazione (non la sporca e non occupa memoria). |
| `/copy` | Copia l'ultima risposta di Claude negli appunti. |
| `/export [file]` | Salva la conversazione come testo. |
| `/skills` | Elenco delle skill disponibili (anche quelle di Night Run). |
| `/help` | Aiuto ed elenco dei comandi. |

---

## 2. Comandi di Night Run (le nostre skill)

Le skill del progetto stanno in `.claude/skills/`. Claude le usa da solo quando servono, ma si possono chiamare a mano
con la barra. Al posto del comando basta anche dirlo a parole ("facciamo il check", "provalo", "pubblica").

| Comando | A cosa serve |
| --- | --- |
| `/night-run-sera` | **Controllo della sera**, prima di un lavoro nuovo: cosa è cambiato su `main` dall'ultima volta (chi, cosa, quali file, cosa è stato eliminato), test, prova nel browser, rapporto. Alla fine si segna come fatto. |
| `/night-run-prova` | Prova una modifica come un giocatore: test automatici, gioco nel browser, foto su computer e telefono, errori. |
| `/night-run-pubblica` | Commit in italiano, caricamento su `main` (senza approvazione), copia giocabile su claude.ai, `PASSAGGIO.md`. |
| `/night-run-funzione` | Aggiungere una novità di gioco (negozio, app del telefono, tappa, sistema) nel modo in cui è fatto il gioco. |
| `/night-run-pixel` | Regole per disegnare in pixel art nel 2D (coordinate, luci, facciate, interni). |
| `/night-run-auto` | Un'auto nuova dai disegni (zip di PNG): ruote, immagini, dati, traffico, prova. |
| `/night-run-audio` | Ascoltare e misurare il suono del motore senza audio nel browser. |
| `/night-run-storia` | Dove si scrive la storia (capitoli, messaggi, pensieri) e cosa un assistente non deve fare. |
| `/night-run-controllo` | Controllo generale del gioco con un voto per area e le proposte di miglioramento. |
| `/game-feel`, `/pixel-art`, `/create-game-assets` | Skill di grafica prese da altri progetti (licenza Apache 2.0): "succo" del gioco, pixel art, disegni coerenti. |

### Strumenti del progetto (si lanciano dal terminale, nella cartella del gioco)

| Comando | A cosa serve |
| --- | --- |
| `strumenti/controllo_sera.sh` | Novità su `main` dall'ultimo controllo e test. |
| `strumenti/controllo_sera.sh fatto` | Segna il controllo della sera come fatto (vale per tutti e due). |
| `node --test test/*.test.js` | Tutti i test automatici. |
| `node strumenti/prova.js passo passo ...` | Prova a copione nel browser (es. `tappa:bar entra foto:dentro stato`). Elenco dei passi in testa al file. |
| `node strumenti/ascolta.mjs v40 allungo prova.wav 1` | Suono del motore di un'auto in un file WAV. |
| `node strumenti/teaser.js CARTELLA` | Riprese del video teaser (poi `teaser_audio.mjs`, `teaser_cartelli.py`, `teaser_monta.sh`). |
| `python3 -m http.server 8765` | Il gioco in locale su http://localhost:8765/index.html |

---

## 3. Tutti gli altri comandi di Claude Code

### Conversazione e sessioni
| Comando | A cosa serve |
| --- | --- |
| `/branch [nome]` | Crea un ramo della conversazione per provare un'altra strada senza perdere quella di adesso. |
| `/fork [istruzione]` | Copia la conversazione in una sessione in sottofondo che lavora da sola, mentre tu continui qui. |
| `/background [istruzione]` | Manda la sessione in sottofondo e libera il terminale (`/bg`). |
| `/subtask <compito>` | Un aiutante in sottofondo che conosce tutta la conversazione e porta qui il risultato. |
| `/tasks` | Lavori in sottofondo della sessione (comandi e aiutanti). |
| `/stop` | Ferma la sessione in sottofondo a cui sei collegato. |
| `/recap` | Riassunto di una riga della sessione. |
| `/goal [condizione]` | Claude continua a lavorare finché la condizione non è vera (`/goal clear` la toglie). |
| `/loop [intervallo] [istruzione]` | Ripete un'istruzione a intervalli finché la sessione è aperta (es. `/loop 10m controlla il deploy`). |
| `/schedule [descrizione]` | Attività programmate nel cloud (es. ogni sera alle 21). |
| `/autocompact [auto\|dimensione]` | Quando fare il riassunto automatico della conversazione. |
| `/teleport` | Porta nel terminale una sessione partita nel cloud (`/tp`). |
| `/remote-control` | Rende questa sessione del computer comandabile da claude.ai o dal telefono (`/rc`). |
| `/desktop` | Continua la sessione nell'app Claude Code per computer. |
| `/exit` | Esce (`/quit`). |

### Controllo del codice
| Comando | A cosa serve |
| --- | --- |
| `/security-review` | Cerca problemi di sicurezza nelle modifiche del ramo. |
| `/simplify` | Rivede le modifiche per semplificarle e pulirle (non cerca errori: per quelli `/code-review`). |
| `/ultrareview` | Revisione profonda con più agenti nel cloud (poche gratis, poi a pagamento). È `/code-review ultra`. |
| `/batch <istruzione>` | Modifiche grandi divise tra molti aiutanti in parallelo, dopo un piano da approvare. |
| `/run`, `/verify` | Lanciano il progetto per vedere che una modifica funziona davvero. Per Night Run c'è già `/night-run-prova`. |
| `/debug [problema]` | Attiva il registro di debug di Claude Code e lo legge per capire un problema dello strumento. |
| `/deep-research <domanda>` | Ricerca sul web con molte fonti e un rapporto con le citazioni. |

### Impostazioni e configurazione
| Comando | A cosa serve |
| --- | --- |
| `/config` | Impostazioni (tema, modello, editor...). `/config chiave=valore` le cambia al volo. |
| `/permissions` | Regole su cosa Claude può fare senza chiedere. Nell'app apre solo la scelta della modalità. |
| `/fewer-permission-prompts` | Trova i comandi innocui che vi chiede spesso e li permette, per meno domande. |
| `/update-config [richiesta]` | Cambia `settings.json` a parole (permessi, variabili, hook). |
| `/memory` | Modifica i file `CLAUDE.md` (istruzioni che Claude legge sempre) e la memoria automatica. |
| `/init` | Crea un `CLAUDE.md` iniziale per un progetto. Night Run ha già `AGENTS.md`. |
| `/status` | Versione, modello, account, connessione. |
| `/doctor` | Controllo dell'installazione e delle impostazioni, con proposte di correzione. |
| `/mcp` | Collegamenti ai servizi esterni (connettori MCP). |
| `/plugin` | Plugin installati (es. ECC): installa, attiva, disattiva. |
| `/reload-skills`, `/reload-plugins` | Ricaricano skill e plugin cambiati senza riavviare. |
| `/skill-doctor` | Quanto "pesa" ogni skill e quanto viene usata. |
| `/hooks` | Comandi automatici legati alle azioni di Claude. |
| `/output-style [stile]` | Stile delle risposte (es. più conciso). |
| `/advisor [modello\|off]` | Un secondo modello che dà consigli nei momenti chiave. |
| `/add-dir <cartella>` | Aggiunge un'altra cartella a quelle che Claude può leggere. |
| `/cd <cartella>` | Sposta la sessione in un'altra cartella. |
| `/theme`, `/color`, `/statusline`, `/tui`, `/focus` | Aspetto: tema, colore della barra, riga di stato, modo dello schermo, vista ridotta. |
| `/keybindings`, `/terminal-setup` | Scorciatoie da tastiera personali; `Shift+Invio` per andare a capo in alcuni terminali. |
| `/voice` | Dettatura a voce. |
| `/login`, `/logout` | Entra ed esce dall'account. |
| `/install-github-app` | Collega l'app GitHub di Claude a un repository. |
| `/web-setup` | Collega GitHub per le sessioni nel cloud. |
| `/remote-env` | Ambiente cloud predefinito. |
| `/import` | Porta la configurazione da altri assistenti (Codex, Gemini, Cursor). |

### Artifact, grafica e documenti
| Comando | A cosa serve |
| --- | --- |
| `/artifacts` | Le pagine pubblicate su claude.ai (come la copia giocabile di Night Run): aprirle, copiarne il link. |
| `/design [richiesta]` | Bozze grafiche (schermate, locandine) su una tela modificabile. |
| `/slides [richiesta]` | Una presentazione. |
| `/dataviz` | Guida per grafici e tabelle. |

### Account e varie
| Comando | A cosa serve |
| --- | --- |
| `/usage-credits`, `/upgrade`, `/rate-limit-options` | Crediti in più, piano superiore, cosa fare quando si raggiunge il limite. |
| `/release-notes` | Le novità di Claude Code. |
| `/feedback`, `/bug` | Segnalare un problema di Claude Code ad Anthropic. |
| `/insights` | Rapporto su come usi Claude Code (solo sul computer). |
| `/powerup` | Lezioni interattive sulle funzioni di Claude Code. |
| `/mobile` | Codice QR per scaricare l'app sul telefono. |

---

## 4. Scorciatoie e simboli

### Simboli all'inizio del messaggio
| Simbolo | A cosa serve |
| --- | --- |
| `/` | Comando o skill. |
| `!` | Esegue direttamente un comando del terminale e mostra il risultato a Claude (es. `!git status`). |
| `@` | Cita un file del progetto, con completamento automatico (es. `@street2d.js`). |
| `?` | A prompt vuoto mostra l'elenco delle scorciatoie. |

### Tasti (terminale)
| Tasti | A cosa servono |
| --- | --- |
| `Esc` | Ferma Claude mentre lavora, per correggerlo. Il lavoro fatto fin lì resta. |
| `Esc` `Esc` | Con testo scritto: lo cancella. A prompt vuoto: apre il menu per tornare indietro (come `/rewind`). |
| `Shift+Tab` | Cambia modalità: normale (chiede i permessi), accetta le modifiche, piano, e dove c'è la modalità automatica. |
| `Ctrl+C` | Interrompe; a prompt vuoto, premuto due volte, esce. |
| `Ctrl+D` | Esce (due volte). |
| `Ctrl+R` | Cerca tra i messaggi scritti prima. |
| `↑` / `↓` | Messaggi precedenti. |
| `Ctrl+O` | Mostra nel dettaglio cosa ha fatto Claude (comandi, file). |
| `Ctrl+T` | Mostra o nasconde la lista delle cose da fare di Claude. |
| `Ctrl+B` | Manda in sottofondo un comando lungo. |
| `Ctrl+S` | Mette da parte il testo che stai scrivendo; premuto di nuovo lo riprende. |
| `Ctrl+G` | Scrive il messaggio nell'editor di testo. |
| `Ctrl+V` (Mac: `Cmd+V` in iTerm2, Windows: `Alt+V`) | Incolla un'immagine (es. una foto del gioco con un difetto). |
| `Ctrl+L` | Ridisegna lo schermo se è "sporco". |
| `Alt+P` (Mac: `Option+P`) | Cambia modello senza cancellare quello che stai scrivendo. |
| `Alt+O` (Mac: `Option+O`) | Modalità veloce sì/no. |
| `Ctrl+Invio` | Manda subito i messaggi in coda mentre Claude lavora. |
| `\` + `Invio`, oppure `Ctrl+J` | Va a capo senza mandare il messaggio, in tutti i terminali. `Shift+Invio` funziona in molti terminali, negli altri serve `/terminal-setup`. |

Mentre Claude lavora si possono scrivere altri messaggi: vanno in coda e li legge appena finisce.
