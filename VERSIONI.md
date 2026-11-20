# Versioni di Night Run

**Versione attuale: v0.59**

## Come si conta
Ogni **intervento** (una sessione con Claude, Codex, Kimi o chiunque, oppure un pacchetto di modifiche fatte insieme) fa salire la
versione di **un passo**: v0.53 → v0.54 → v0.55… Non conta quanti commit ci sono dentro, conta l'intervento. Il numero dopo lo
zero è il numero dell'intervento (la v1.0 la decidono il proprietario e il cognato, quando vogliono).

Chi fa l'intervento, **prima di chiuderlo**:
1. alza la versione qui sopra e aggiunge **in fondo** all'elenco una riga: versione, data, chi, cosa (una riga sola, breve);
2. mette la versione nel titolo della voce in `DIARIO.md` (per esempio `## 20/11/2026 notte · proprietario · v0.51 (...)`);
3. la scrive nel messaggio di commit (per esempio `v0.51: Soccorso stradale...`).

Se due interventi arrivano insieme e i numeri si scontrano, chi unisce per secondo prende il numero dopo.

## Da dove siamo partiti
Il conto è nato il 20/11/2026. Le versioni prima di quel giorno non erano numerate: le ho ricostruite dalle **50** voci di `DIARIO.md`
(dal 18/11/2026; il primo commit del repository è del 02/11/2026). Quelle da v0.01 a v0.50 sono quindi **approssimate**: l'ordine è
quello delle date del diario (dentro lo stesso giorno, per momento: mattina, pomeriggio, sera, notte) e qualche intervento vecchio
non ha lasciato una voce. Dalla v0.51 il conto è esatto.

## Elenco
| Versione | Giorno | Chi | Cosa |
| --- | --- | --- | --- |
| v0.01 | 18/11 | proprietario | Teaser a velocità di gioco, licenze, test su GitHub, hook di sessione |
| v0.02 | 18/11 | cognato | Comandi da telefono e traffico da autostrada |
| v0.03 | 18/11 | proprietario | Due stazioni rap con le canzoni del proprietario |
| v0.04 | 18/11 | cognato | Video teaser rifatto (44 s) |
| v0.05 | 18/11 | PR #14 | Fari: il fascio parte dal faro vero (PR #14) |
| v0.06 | 18/11 | cognato | Scoppi dello scarico a voci, carattere per ogni auto |
| v0.07 | 18/11 | proprietario | Radio nuova con equalizzatore e titolo che scorre |
| v0.08 | 18/11 | proprietario | Modifiche di Codex: Volvo 850 R a cinque cilindri, carattere «deciso» |
| v0.09 | 18/11 | proprietario | Ruote concentriche e borbottio del motore più forte |
| v0.10 | 18/11 | proprietario | Storia: revisione dei dialoghi dopo «Le tre soste» |
| v0.11 | 18/11 | proprietario | Facciate dei locali rifatte |
| v0.12 | 19/11 | cognato | Polizia: pattuglie, contesta e scappa, autovelox, etilometro |
| v0.13 | 19/11 | cognato | «Come si gioca» riscritto e inquadratura sui locali |
| v0.14 | 19/11 | cognato | Percorso per pubblicare il gioco (Electron) |
| v0.15 | 19/11 | cognato | Usato dietro il traffico e inseguimenti da ricercato |
| v0.16 | 19/11 | cognato | Polizia da autostrada: limite 130 e multe a scaglioni |
| v0.17 | 19/11 | proprietario | Facciate rifatte di Autosalone e Sfascio |
| v0.18 | 19/11 | proprietario | Storia: le scene di prova nelle chat |
| v0.19 | 19/11 | cognato | Inseguimenti: le volanti ti fermano tagliandoti la strada |
| v0.20 | 19/11 | cognato | Scuse assurde, evento ogni 8-10 km, credito in rosso, nascondiglio |
| v0.21 | 19/11 | cognato | Banco prova a rulli da Luca |
| v0.22 | 19/11 | cognato | Caricamento più leggero: 3D e registrazioni solo quando servono |
| v0.23 | 19/11 | proprietario | Storia: blocco Elena di Codex (dieci scene) |
| v0.24 | 20/11 | proprietario | Il gioco si installa come app da Edge o Chrome |
| v0.25 | 20/11 | proprietario | Controllo grande e scritte che non si sovrappongono |
| v0.26 | 20/11 | proprietario | 3D del Viaggio: locali, paesaggi, luci (poi tolto) |
| v0.27 | 20/11 | proprietario | Entrata nei locali: posto auto e protagonista che va a piedi |
| v0.28 | 20/11 | proprietario | Avviso al cognato: AVVISI.md mostrato per primo a ogni sessione |
| v0.29 | 20/11 | cognato | Motori a livelli: Nico insegna i pezzi, Mario fa l'officina |
| v0.30 | 20/11 | cognato | Riordino dei motori, niente doppioni |
| v0.31 | 20/11 | cognato | Il Pistone diventa un progetto in prova (cartella pistone/) |
| v0.32 | 20/11 | cognato | Nico lavora da Luca: pezzi motore singoli sulla V40 |
| v0.33 | 20/11 | proprietario | Tolto il 3D: il gioco è solo 2D |
| v0.34 | 20/11 | proprietario | Costruzione del motore pezzo per pezzo (Il Pistone) |
| v0.35 | 20/11 | proprietario | Menu Impostazioni e meteo nuovo: nebbia, neve, vento |
| v0.36 | 20/11 | proprietario | Interno del bar in alta definizione (prototipo) |
| v0.37 | 20/11 | proprietario | Tutti gli interni in alta definizione con scritte leggibili |
| v0.38 | 20/11 | proprietario | Giocatore automatico per provare ritmo ed economia (200 km) |
| v0.39 | 20/11 | proprietario | La cassa pesante non blocca più le missioni |
| v0.40 | 20/11 | proprietario | Joystick, volante e pedali assegnabili |
| v0.41 | 20/11 | cognato | Storia secondaria «Ti tengo compagnia» (Jeshka e Luca) |
| v0.42 | 20/11 | proprietario | AUTO 1 dopo 5 s, leva con S sport, tasti 1-4, pannello di Nico a schede |
| v0.43 | 20/11 | proprietario | Mappa del turbo vera, scarico aperto/chiuso, negozio dei pezzi a categorie |
| v0.44 | 20/11 | proprietario | Fiamme secondo il tuning: botto, fiamma libera, ossidrica |
| v0.45 | 20/11 | proprietario | Fiamme al rilascio più frequenti, bella fiammata sopra i 5.000 giri |
| v0.46 | 20/11 | proprietario | Grafica più nitida e ruote della trazione anteriore |
| v0.47 | 20/11 | proprietario | Estetica premium: icone disegnate, vetro scuro, banner dei quartieri |
| v0.48 | 20/11 | proprietario | Posti di controllo che multano al passaggio, autovelox, Tutor e mappa |
| v0.49 | 20/11 | proprietario | Meno scatti: tele preparate una volta, niente letture dalla scheda video |
| v0.50 | 20/11 | proprietario | Palazzi preparati prima di entrare nello schermo: meno scatti |
| v0.51 | 20/11 | proprietario | Soccorso stradale: app nel telefono, furgone con le quattro frecce, meccanico che ripara sul posto |
| v0.52 | 20/11 | proprietario | Conteggio delle versioni (regola in `AGENTS.md`) |
| v0.53 | 20/11 | proprietario | Questo elenco delle versioni (`VERSIONI.md`, al posto di `VERSIONE.md`) |
| v0.54 | 20/11 | proprietario | Officina semplice (Modifiche e Swap, anteprima), Tutor ogni 10-15 km, prova di fumo su GitHub, pausa, suggerimenti, prossimo traguardo, qualità ricordata e FPS |
| v0.55 | 20/11 | proprietario | Sviluppatori: «Disabilita polizia» (non ferma, non multa, non insegue; autovelox e Tutor spenti) |
| v0.56 | 20/11 | proprietario | Sviluppatori: vai a km o tappa, riempi bisogni, ripara, indistruttibile, meteo e ora, flag della storia, tutte le app |
| v0.57 | 20/11 | proprietario | Due bisogni nuovi: pipì (12 ore di viaggio) e cacca (24), bagno gratis nei locali |
| v0.58 | 20/11 | proprietario | Pipì e cacca: frasi serie e comiche (pensieri, avvisi, incidente) |
| v0.59 | 20/11 | proprietario | La piazzetta: ogni 2-3 tappe due negozi affiancati (mai Luca e Neon Kustom insieme) |
