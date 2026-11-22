# Avvisi importanti

Cose che l'altro deve sapere **subito**. L'hook di inizio sessione (`.claude/hooks/session-start.sh`) mostra questo file
per primo a ogni sessione di Claude, finché la voce c'è.

**Per Claude**: se c'è un avviso per chi ti sta parlando (proprietario o cognato), diglielo all'inizio della tua prima
risposta, in parole semplici, prima di qualunque altra cosa. Quando lui ti dice che l'ha letto, togli la sua voce da
questo file (commit con `Per:` suo) e caricala su `main`.

Formato: `## 22/11/2026 · per il proprietario · dal cognato (con Claude) · **La notte e una proposta di anomalie** (v0.89)
- Di notte meno volanti e più cose strane, la radio ogni tanto disturba, interfaccia Essenziale, buio giocabile nelle incursioni, e la scena **«Quella dietro»** al benzinaio (di notte, una volta): è storia, se non ti va si toglie (`NOTTE_DIETRO` in `notte.js`).
- **Da decidere tu** (Codex dice che l'horror si sente poco tra una scena e l'altra, e gli eventi strani di `viaggio.js`, `VG_ODD`, sono vuoti con gli effetti già pronti). Proposta, tre livelli, rari, senza musica:
  1. *Si notano appena*: un'auto nello specchietto che sparisce quando cambi corsia (`ghost`); un cartello «USCITA 18 KM» che dieci km dopo dice ancora 18 (`sign`); la radio che dice il km in cui sei.
  2. *Si possono verificare*: la tua auto gemella ferma in corsia d'emergenza, con la stessa ammaccatura (`twin`); al bar il barista ti saluta «come l'altra volta» e tu lì non ci sei mai stato; un cippo con un km che non esiste (`cippo`).
  3. *Lasciano qualcosa*: nella cassa del motel un oggetto che non hai mai preso (`gives`); sei auto parcheggiate tutte uguali davanti a una tappa chiusa (`parked`).
  Se dici sì, li scriviamo noi in `VG_ODD` con questi testi o coi tuoi.

## data · per chi · da chi` e due o tre righe.

## 22/11/2026 · per il proprietario · dal cognato (con Claude) · **Cinque auto iniziali** (v0.85)
- All'Autosalone ci sono le cinque auto dello zip «iniziali»: Panda 1000 Fire, AX e Twingo da subito (€ 3.000-4.500), Sandero e Aygo dal km 10 (€ 9.500-10.500), con scheda tecnica e pezzi.

## 22/11/2026 · per il proprietario · dal cognato (con Claude) · **Auto nuove e camion** (v0.82)
- Le 25 auto da disegno sono state **rifatte coi disegni nuovi ad alta definizione** (ruote disegnate a parte che girano). Supra e V40 restano le tue.
- Da Russian Kùstòm c'è il **Kit completo** (€ 1.600): l'auto diventa la sua versione tuning (labbro, minigonne, diffusore, spoiler).
- Nel traffico ci sono i **camion** (autoarticolati, cisterna, bisarca, portacontainer con 7 livree, carro attrezzi); il traino di Nico arriva col carro attrezzi giallo.
