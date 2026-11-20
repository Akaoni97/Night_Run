# Versione di Night Run

**Versione attuale: v0.52**

## Come si conta
Ogni **intervento** (una sessione con Claude, Codex, Kimi o chiunque, oppure un pacchetto di modifiche fatte insieme) fa salire la
versione di **un passo**: v0.51 → v0.52 → v0.53… Non conta quanti commit ci sono dentro, conta l'intervento. Il numero dopo lo
zero è il numero dell'intervento (la v1.0 la decidono il proprietario e il cognato, quando vogliono).

Chi fa l'intervento, **prima di chiuderlo**:
1. alza la versione qui sopra e aggiunge una riga nell'elenco sotto (versione, data, chi, cosa);
2. mette la versione nel titolo della voce in `DIARIO.md` (per esempio `## 20/11/2026 notte · proprietario · v0.51 (...)`);
3. la scrive nel messaggio di commit (per esempio `v0.51: Soccorso stradale...`).

Se due interventi arrivano insieme e i numeri si scontrano, chi unisce per secondo prende il numero dopo.

## Da dove siamo partiti
Il conto è nato il 20/11/2026. Le versioni prima di quel giorno non erano numerate: le abbiamo ricostruite dalle voci di `DIARIO.md`,
che erano **50** (dal 18/11/2026; il primo commit del repository è del 02/11/2026, su `main` ce n'erano 346). Quindi il
punto di partenza è **v0.50**, e il soccorso stradale è la **v0.51** e questo conteggio la **v0.52**. Il numero è approssimato: qualche intervento vecchio
non ha lasciato una voce nel diario.

## Elenco
| Versione | Data | Chi | Cosa |
| --- | --- | --- | --- |
| v0.52 | 20/11/2026 | proprietario | Conteggio delle versioni (`VERSIONE.md`, regola in `AGENTS.md`) |
| v0.51 | 20/11/2026 | proprietario | Soccorso stradale: app nel telefono, furgone con le quattro frecce, meccanico che ripara sul posto |
