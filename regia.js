// ============================================================================
//  Night Run · La regia delle conversazioni (dopo capitali.js)
//  Tutto ciò che sta attorno ai nodi di chat e non è un nodo: stati attuali (patto, varco, affidamento) con i flag-specchio, domande di casa
//  (router per nucleo, attore e domande già fatte), scene a ingresso manuale (Marco, fallimenti, uscita, guardia, varco, vicino), gli epiloghi
//  B1 e B2 (8 battute ciascuno, a tutto schermo) e le conseguenze che durano. Funzioni pure sullo stato `game.s.chat` (provate in test/regia.test.js);
//  l'unica grafica è il lettore degli epiloghi. Il testo viene dal materiale di Codex (materiale_chat/materiale3_0*.txt).
//  Regole prese dal «Per Claude» del file 08: lo stato è un valore attuale, non un mucchio di flag; ogni effetto si applica una sola volta.
// ============================================================================
const REGIA_EPI = {
"B1": [
[
"ELENA",
"Ho messo un posto in più. È venuta zia Irene."
],
[
"TU",
"Irene?"
],
[
"ELENA",
"La vedova di Claudio. È qui, non la sto inventando."
],
[
"TU",
"Tu l’hai fatta entrare?"
],
[
"ELENA",
"Sì. Era sulla porta. Perché me lo chiedi così?"
],
[
"TU, PENSIERO",
"Ho aperto senza finire le domande. Adesso è a tavola."
],
[
"TU, PENSIERO",
"Nel fascicolo Irene è scomparsa da anni. Claudio non lasciò una moglie."
],
[
"ELENA",
"Vieni? Non voglio lasciarla sola in cucina."
]
],
"B2": [
[
"LIVIA",
"È qui. Ottavio è qui."
],
[
"PRESENZA COME OTTAVIO",
"Livia."
],
[
"LIVIA",
"Aspetta. Non riesco neanche a decidere cosa chiederti prima."
],
[
"TU, PENSIERO",
"Sapevo chi avrebbe attraversato con noi. Non è una voce sbagliata."
],
[
"LIVIA",
"Entra. La cena possiamo anche rovinarla, stasera."
],
[
"PRESENZA COME OTTAVIO",
"Come vuoi tu, sorella."
],
[
"TU, PENSIERO",
"Mi aveva chiesto di non portarle un sostituto. L’ho fatto lo stesso."
],
[
"TU, PENSIERO",
"Elena è al sicuro. Non è il suo posto quello che ho venduto."
]
]
};
const REGIA_STATI = { patto: ['nessuno', 'esplicito', 'sospeso', 'rifiutato'], varco: ['chiuso', 'aperto', 'richiuso'], affidamento: ['fiducia', 'interrotto', 'riparato'] };
const REGIA_PREFISSO = { patto: 'patto_', varco: 'varco_', affidamento: 'aff_' };
// domande di casa: nucleo → nodo dopo il quale si propone (le domande sono tre per nucleo, flag q<n>1..3)
const REGIA_CASA = { 1: 'ELE_pasta_08', 2: 'ELE_turno_08', 3: 'ELE_coinquilino_08', 4: 'ELE_nonno_08', 5: 'ELE_nonno_08', 6: 'ELE_claudio_risposta', 7: 'ELE_temperino_risposta', 8: 'ELE_ritiro_08' };
const REGIA_CASA_KM = 430;                                 // le domande di casa sono della fase IV
// scene a ingresso manuale: nodo → flag di regia che il nodo si aspetta
const REGIA_SCENE = { V2_MARCO_costo_01: 'ev_marco_costo', V2_FAL_1_01: 'ev_fallimento_1', V2_FAL_2_01: 'ev_fallimento_2', V2_FAL_3_01: 'ev_fallimento_3', V2_FAL_4_01: 'ev_fallimento_4',
  V2_USCITA_01: 'ev_uscita_autentica', V2_GUARDIA_01: 'ev_prezzo_guardia', V2_VARCO_01: 'ev_scelta_varco', V2_VICINO_01: 'ev_verifica_vicino' };

function regiaState(s) {
  const c = chatState(s);
  if (!c.regia) c.regia = { patto: 'nessuno', varco: 'chiuso', affidamento: 'fiducia', casa: {}, fatto: {} };
  return c.regia;
}
// assegna uno stato attuale e sincronizza i flag-specchio, togliendo quelli incompatibili (patto_esplicito, varco_aperto, aff_riparato...)
function regiaSet(s, chiave, valore) {
  const r = regiaState(s), c = chatState(s);
  if (!REGIA_STATI[chiave] || !REGIA_STATI[chiave].includes(valore)) return false;
  r[chiave] = valore;
  for (const v of REGIA_STATI[chiave]) delete c.flags[REGIA_PREFISSO[chiave] + v];
  c.flags[REGIA_PREFISSO[chiave] + valore] = 1;
  c.flags.vc_richiudibile = r.varco === 'aperto' ? 1 : 0; if (!c.flags.vc_richiudibile) delete c.flags.vc_richiudibile;
  return true;
}
// chiamata dal motore chat ogni volta che una risposta imposta un flag: i flag di decisione diventano stati attuali
function regiaOnFlag(s, nome) {
  const r = regiaState(s);
  if (nome === 'patto_esplicito' || nome === 'patto_sospeso' || nome === 'patto_rifiutato') regiaSet(s, 'patto', nome.slice(6));
  else if (nome === 'vc_apro') regiaSet(s, 'varco', 'aperto');
  else if (nome === 'vc_richiudo') { if (r.varco === 'aperto') regiaSet(s, 'varco', 'richiuso'); }
  else if (nome === 'vc_rifiuto') { /* rifiutare un'altra apertura non cambia lo stato: chiuso resta chiuso, aperto resta aperto */ }
  else if (nome === 'livia_fiducia_riparata') regiaSet(s, 'affidamento', 'riparato');
}
// un effetto che conta una volta sola, comunque lo si chieda
function regiaUnaVolta(s, id, fn) { const r = regiaState(s); if (r.fatto[id]) return false; r.fatto[id] = 1; fn(); return true; }

// ---- domande di casa
function regiaCasaMask(s, n) { const f = chatState(s).flags; let m = 7; for (let k = 1; k <= 3; k++) if (f['q' + n + k]) m &= ~(1 << (k - 1)); return m; }
// il nodo d'ingresso della domanda di casa n (1-8) adesso: ingresso normale o _P (la voce che chiama è imitata); null se non resta niente da chiedere
function regiaCasaEntry(s, n) {
  const m = regiaCasaMask(s, n); if (!m) return null;
  const base = 'V2_CASA_0' + n + (chatState(s).flags.ev_voce_imitata ? '_P' : '');
  return m === 7 ? base : base + '_M' + m;
}
// ogni secondo (chiamata da chatTick): propone le domande di casa dopo la loro conversazione, una alla volta, quando Elena è libera
function regiaTick(s, km) {
  const c = chatState(s), r = regiaState(s), ev = [];
  if (km < REGIA_CASA_KM) return ev;
  for (const n of Object.keys(REGIA_CASA)) {
    if (r.casa[n] || !Object.values(c.th).some((t) => t.done[REGIA_CASA[n]])) continue;
    const id = regiaCasaEntry(s, n); if (!id) { r.casa[n] = 1; continue; }
    const nodo = CHAT_NODES[id], tk = chatKey(nodo); if (!nodo || (c.th[tk] || {}).at) continue;
    r.casa[n] = 1; ev.push(...chatEnter(s, km, tk, id)); break;
  }
  return ev;
}

// ---- scene a ingresso manuale
function regiaScena(s, km, id) {
  const n = CHAT_NODES[id], flag = REGIA_SCENE[id]; if (!n) return [];
  if (flag) chatState(s).flags[flag] = 1;
  return chatEnter(s, km, chatKey(n), id);
}
// quali costi di Marco si possono mostrare (almeno due praticabili, altrimenti la sosta va preparata prima)
function regiaMarcoCosti(s, d) {                       // d = { lavoro: bool, copie: n, lampade: n }
  const f = chatState(s).flags; delete f.ev_marco_carico;
  const costi = [];
  if (d.lavoro) { f.ev_marco_carico = 1; costi.push('carico'); }
  if (d.copie > 0) costi.push('copia');
  if (d.lampade > 0) costi.push('lampada');
  return { costi, ok: costi.length >= 2 };
}
// i quattro fallimenti: le conseguenze vengono dal gameplay, una volta sola, e poi si apre la scena
function regiaFallimento(s, km, n) {
  const c = chatState(s);
  regiaUnaVolta(s, 'fal' + n, () => {
    c.flags['ev_fallimento_' + n] = 1;
    if (n === 1) { c.flags.copia_nastro_perduta = 1; }                                  // originale salvo, si può riascoltare
    if (n === 2) { chatSetConf(s, km, 'Rosa', -5); c.flags.marco_dentro = 1; }          // né morte né salvezza certificate
    if (n === 3) { delete c.flags.ottavio_salvo; c.flags.ottavio_non_salvo = 1; }
    if (n === 4) { regiaSet(s, 'varco', 'aperto'); c.cnt.varchi = (c.cnt.varchi || 0) + 1; }
  });
  return regiaScena(s, km, 'V2_FAL_' + n + '_01');
}
// il vicino ha raggiunto la porta e il recapito esterno lo conferma: solo adesso Elena è verificata
function regiaVicinoConfermato(s) { const f = chatState(s).flags; f.ev_verifica_vicino = 1; f.elena_verificata = 1; }

// ---- epiloghi (B1: zia Irene a cena; B2: la presenza al posto di Ottavio con Livia)
const regiaEpiNome = (w) => ({ TU: 'Tu', ELENA: 'Elena', LIVIA: 'Livia', ROSA: 'Rosa' }[w] || (w.startsWith('PRESENZA') ? 'La presenza' : w.charAt(0) + w.slice(1).toLowerCase()));
function regiaEpilogo(id, fine) {
  if (typeof document === 'undefined' || !REGIA_EPI[id]) return false;
  const righe = REGIA_EPI[id]; let i = 0;
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#05060a;color:#e8e8f0;display:grid;place-items:center;font:20px/1.5 Georgia,serif;cursor:pointer;padding:24px;text-align:center';
  box.innerHTML = '<div style="max-width:560px"><div id="rgW" style="font:700 12px system-ui;letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin-bottom:10px"></div><div id="rgT"></div><div style="font:12px system-ui;opacity:.4;margin-top:28px">clic o spazio per continuare</div></div>';
  const mostra = () => {
    const [w, t] = righe[i], pens = /PENSIERO/.test(w);
    box.querySelector('#rgW').textContent = pens ? 'Pensiero' : regiaEpiNome(w.split(',')[0]);
    const T = box.querySelector('#rgT'); T.textContent = t; T.style.fontStyle = pens ? 'italic' : 'normal'; T.style.opacity = pens ? '.75' : '1';
  };
  const avanti = () => { if (++i >= righe.length) { document.removeEventListener('keydown', tasto); box.remove(); if (fine) fine(); } else mostra(); };
  const tasto = (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); avanti(); } };
  box.addEventListener('click', avanti); document.addEventListener('keydown', tasto, true);
  document.body.appendChild(box); mostra(); return true;
}
if (typeof window !== 'undefined') window.regiaDebug = {
  stato: () => { const g = window.nightRun && window.nightRun.game; return g && g.s ? regiaState(g.s) : null; },
  scena: (id) => { const g = window.nightRun.game; return regiaScena(g.s, (g.s.dist || 0) / 1000, id); },
  fallimento: (n) => { const g = window.nightRun.game; return regiaFallimento(g.s, (g.s.dist || 0) / 1000, n); },
  casa: (n) => { const g = window.nightRun.game; const id = regiaCasaEntry(g.s, n); return id && chatEnter(g.s, (g.s.dist || 0) / 1000, 'Elena', id); },
  epilogo: (id) => regiaEpilogo(id),
};
