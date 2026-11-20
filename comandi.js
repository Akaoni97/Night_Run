// ============================================================================
//  Night Run · I comandi dell'auto (dopo storia.js)
//  Una seconda fila di pulsanti sotto quelli di guida (AUTO, TC, LAUNCH...), accanto al cambio e ai pedali. Compaiono solo quando servono:
//    RIMORCHIO  aggancia / sgancia (se hai comprato il gancio; lo sgancio controlla slot e chili rimasti in auto)
//    TURBO      pressione vera della turbina (cambia bar, coppia, fischio e calore): ECO 60 % · NORMALE · FORTE 120 % (solo con un turbo montato)
//    SCARICO    valvola di scarico: APERTO (rumore pieno e forte, scoppi e fiammate) o SILENZIO (niente fiamme, rumore più basso, scoppi rarissimi e smorzati) (dopo un po' di potenziamento)
//    NEON       accende e spegne il neon sotto l'auto (se l'hai montato da Neon Kustom)
//  Lo stato sta in `game.s.cmd` e si salva con la partita. Funzioni pure provate in test/comandi.test.js.
// ============================================================================
const CMD_BOOST = [{ id: 'eco', label: 'ECO', k: 0.6 }, { id: 'norm', label: 'NORMALE', k: 1 }, { id: 'forte', label: 'FORTE', k: 1.2 }];
const CMD_EXH_PW = 1.05;                                   // potenziamento (fattore di potenza) da cui compare la valvola di scarico
function cmdState(s) { if (!s.cmd) s.cmd = { boost: 1, exh: 1, neon: 1 }; return s.cmd; }
// cosa c'è da comandare adesso (sim = SupraSim, game = StreetGame, cos = abbellimenti dell'auto)
function cmdAvailable(game, sim, cos) {
  const v = (game.s && game.s.vg) || {}, tc = sim.tune && sim.tune.turbo;
  return {
    rimorchio: !!(v.trailer && !(typeof VG_CARGO !== 'undefined' && VG_CARGO[game.car])),
    turbo: !!(tc && tc.max > 0),
    scarico: !!(sim.tune && sim.tune.pw >= CMD_EXH_PW) || (sim.extraPw || 1) > 1,
    neon: !!(cos && cos.glow && cos.glow !== 'none'),
  };
}
function cmdBoostNext(s) { const c = cmdState(s); c.boost = (c.boost + 1) % CMD_BOOST.length; return CMD_BOOST[c.boost]; }
function cmdExhToggle(s) { const c = cmdState(s); c.exh = c.exh ? 0 : 1; return c.exh; }
function cmdNeonToggle(s) { const c = cmdState(s); c.neon = c.neon ? 0 : 1; return c.neon; }
// applica lo stato alla fisica e alla grafica
function cmdApply(game, sim, view2d) {
  const c = cmdState(game.s), a = cmdAvailable(game, sim, view2d && view2d.cos);
  sim.boostCtl = a.turbo ? CMD_BOOST[c.boost].k : 1;
  if (view2d) view2d.neonOff = !c.neon;
  return a;
}

(function comandiUI() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  let row = null, btn = {}, lastExh = null, pan = null, pbtn = {};
  const NR = () => window.nightRun;
  const css = document.createElement('style');
  css.textContent = '.dash-btns.cmd{margin-top:4px}.dash-btns.cmd button b{font-weight:700;letter-spacing:.04em}';
  document.head.appendChild(css);
  const make = () => {
    const dash = document.getElementById('dash'), base = dash && dash.querySelector('.dash-btns'); if (!base) return false;
    row = document.createElement('div'); row.className = 'dash-btns cmd'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Comandi dell\'auto'); row.hidden = true;
    const add = (id, title, fn) => { const b = document.createElement('button'); b.type = 'button'; b.id = 'cm' + id; b.title = title; b.addEventListener('click', fn); row.appendChild(b); btn[id] = b; };
    add('Trailer', 'Rimorchio: aggancia o sgancia', () => { const g = NR().game, r = g.vgTrailer(!(g.s.vg && g.s.vg.trailerOn)); if (!r.ok) g.say(r.why, 'bad'); else { g.say(g.s.vg.trailerOn ? 'Rimorchio agganciato' : 'Rimorchio sganciato', 'info'); } refresh(); });
    add('Boost', 'Pressione della turbina', () => { const n = NR(), g = n.game, b = cmdBoostNext(g.s), bar = n.sim && n.sim.tune && n.sim.tune.turbo ? ` · fino a ${(n.sim.tune.turbo.max * b.k).toFixed(2).replace('.', ',')} bar` : ''; g.say(`Turbo: ${b.label}${bar}`, 'info'); refresh(); });
    add('Exh', 'Valvola di scarico: aperto o silenzio', () => { const g = NR().game, e = cmdExhToggle(g.s); g.say(e ? 'Scarico aperto' : 'Scarico in silenzio', 'info'); refresh(); });
    add('Neon', 'Neon sotto l\'auto', () => { const g = NR().game, n = cmdNeonToggle(g.s); g.say(n ? 'Neon acceso' : 'Neon spento', 'info'); refresh(); });
    base.parentNode.insertBefore(row, base.nextSibling);
    // lo stesso comando anche nella scheda Guida del menu, dove prima c'erano cambio e pedali (tolti: da lì non si potevano usare)
    const deck = document.querySelector('section.deck .panel.drive');
    if (deck) {
      pan = document.createElement('div'); pan.className = 'panel'; pan.innerHTML = '<h2>Comandi dell\'auto <em id="cmInfo"></em></h2><div class="keyrow" id="cmPanRow"></div><p class="hint">Compaiono quando l\'auto li ha: rimorchio dopo il gancio, turbo dopo un turbo, scarico dopo un po\' di potenza, neon dopo Neon Kustom. Sono anche sulla strada, sotto AUTO e TC.</p>';
      deck.parentNode.insertBefore(pan, deck.nextSibling);
      for (const id of Object.keys(btn)) { const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.addEventListener('click', () => btn[id].click()); pan.querySelector('#cmPanRow').appendChild(b); pbtn[id] = b; }
    }
    return true;
  };
  const refresh = () => {
    const n = NR(); if (!n || !n.game || !n.game.s) return;
    if (!row && !make()) return;
    const g = n.game, c = cmdState(g.s), a = cmdApply(g, n.sim, n.view2d);
    const on = (id, show, html, pressed) => { const b = btn[id]; b.hidden = !show; if (show) { b.innerHTML = html; b.setAttribute('aria-pressed', String(!!pressed)); } const p = pbtn[id]; if (p) { p.hidden = !show; p.innerHTML = html.replace(/<b>(.*?)<\/b>/, '<small>$1</small>'); p.classList.toggle('on', !!pressed); } };
    on('Trailer', a.rimorchio, g.s.vg && g.s.vg.trailerOn ? 'RIMORCHIO <b>AGG.</b>' : 'RIMORCHIO <b>—</b>', g.s.vg && g.s.vg.trailerOn);
    on('Boost', a.turbo, `TURBO <b>${CMD_BOOST[c.boost].label}</b>`, c.boost !== 1);
    on('Exh', a.scarico, `SCARICO <b>${c.exh ? 'APERTO' : 'SILENZIO'}</b>`, !c.exh);
    on('Neon', a.neon, `NEON <b>${c.neon ? 'ON' : 'OFF'}</b>`, c.neon);
    row.hidden = !(a.rimorchio || a.turbo || a.scarico || a.neon);
    if (pan) pan.querySelector('#cmInfo').textContent = row.hidden ? 'nessuno disponibile' : '';
    if (lastExh !== c.exh) { lastExh = c.exh; if (n.applySettings) n.applySettings(); if (n.audioCfg) n.audioCfg(); }              // scoppi e volume seguono la valvola              // il volume dello scarico passa al motore audio
  };
  setInterval(() => { try { refresh(); } catch (e) { /* il gioco non è ancora pronto */ } }, 400);
  window.comandi = { refresh, state: () => cmdState(window.nightRun.game.s) };
})();
