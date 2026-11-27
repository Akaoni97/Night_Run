'use strict';
// ============================================================================
// La schermata iniziale viva (v0.174, scelta da Nico tra cinque sfondi): dietro il nottolino, al posto del quadro fermo di
// titolo.js, il motore del gioco disegna Roma di notte, in via del Corso, in tempo reale. L'auto della partita (la E36 blu
// del prologo se la partita è nuova, quella che guidi se è cominciata) va piano nella corsia di destra; nelle altre due
// passano auto del traffico vere (`spawnTraffic` del gioco), luci, insegne, passanti e la cupola sullo sfondo.
// La partita non si tocca: si disegna con una copia del gioco (`Object.create(game)`) che ha km, luogo, corsia e traffico
// suoi; la tela è un secondo Street2D. Si ferma quando la schermata iniziale se ne va. `?titolo=fermo` rimette il quadro
// di prima (prove). `window.NightTitoloVivo` = { on, stato }.
// ============================================================================
(function titoloVivo() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof Street2D === 'undefined') return;
  const gate = document.getElementById('gate'), cam = gate && gate.querySelector('.nt-cam');
  if (!gate || !cam || /[?&]titolo=fermo\b/.test(location.search)) return;
  const TV = {
    luogo: 'roma', km: [49.2, 53.4],   // via del Corso, con la cupola; arrivati in fondo si riparte dall'inizio
    v: 8.5,                            // m/s dell'auto (~30 km/h: si guarda la città)
    corsia: 1, traffico: [2, 3],       // l'auto nella corsia di destra, il traffico nelle altre
    maxAuto: 5,
  };
  const css = document.createElement('style');
  css.textContent = '.gate.nt.nt-vivo .nt-bg,.gate.nt.nt-vivo .nt-scena{display:none!important}'
    + '.gate.nt .nt-vivo-tela{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.4s}'
    + '.gate.nt.nt-vivo.nt-on .nt-vivo-tela{opacity:1}';
  document.head.appendChild(css);
  const cv = document.createElement('canvas'); cv.className = 'nt-vivo-tela'; cv.setAttribute('aria-hidden', 'true');
  cam.insertBefore(cv, cam.firstChild);
  gate.classList.add('nt-vivo');

  let v = null, st = null, last = 0, raf = 0, attivo = true;
  // la copia del gioco: eredita metodi e dati, ma km, luogo, corsia, entità ed effetti sono suoi
  function prepara() {
    const NR = window.nightRun, G = NR && NR.game;
    if (!G || !G.s || typeof GAME_LOCS === 'undefined') return false;
    st = Object.create(G);
    st.s = Object.assign({}, G.s, { dist: TV.km[0] * 1000 });
    st.loc = GAME_LOCS.find((l) => l.id === TV.luogo) || G.loc;
    st.ents = []; st.fx = []; st.out = []; st.inside = null; st.ap = null; st.prompt = null;
    st.laneZ = GAME_LANE_Z[TV.corsia]; st.lane = TV.corsia;
    v = new Street2D(cv);
    v.camFx = true; v.comicsOn = false; v.reaOn = false;
    try { v.quality = document.getElementById('q3d').value || 'alta'; } catch (e) { v.quality = 'alta'; }
    v.paintMirror = () => {}; v.drawLaneRadar = () => {};     // niente specchietto né radar delle corsie: è uno sfondo
    // l'auto: come il quadro di prima (titolo.js), la E36 blu a partita nuova, altrimenti quella che guidi col suo aspetto
    const iniziata = !!(G.s.vg && G.s.vg.prologo), M = NR.view2d;
    if (iniziata && M && M.carId) { v.setCar(M.carId, M.carLook, M.carId === 'supra' ? M.paintHex : M.v40Paint); if (M.cos && v.setCosmetics) v.setCosmetics(M.cos); }
    else v.setCar('e36', {}, '#1c4ac4');
    return true;
  }
  // il traffico: nasce davanti se va più piano di noi, dietro se va più forte; sparisce lontano dallo schermo
  function traffico(dt) {
    const d = st.s.dist;
    for (const e of st.ents) e.x += (e.v || 0) * dt;
    st.ents = st.ents.filter((e) => e.x > d - 45 && e.x < d + 60);   // lo schermo mostra ~21 m di strada
    if (st.ents.length < TV.maxAuto && Math.random() < dt * 0.6) {
      const lane = TV.traffico[Math.random() < 0.5 ? 0 : 1], davanti = Math.random() < 0.5;
      const e = st.spawnTraffic(d + (davanti ? 30 + Math.random() * 14 : -28 - Math.random() * 10), lane);
      if (e) { e.v = e.vT = e.vBase = davanti ? TV.v * (0.25 + Math.random() * 0.3) : TV.v * (1.6 + Math.random() * 0.9); e.acc = 0; }
    }
  }
  function frame(now) {
    raf = 0;
    if (!attivo) return;
    if (gate.hidden) { ferma(); return; }
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60); last = now;
    if (!v && !prepara()) { raf = requestAnimationFrame(frame); return; }
    st.s.dist += TV.v * dt;
    if (st.s.dist > TV.km[1] * 1000) { st.s.dist = TV.km[0] * 1000; st.ents = []; }
    traffico(dt);
    try { v.update(dt, { v: TV.v, acc: 0, pz: 0, rpm: 1700, thr: 0.12, gear: 2, running: true }, st); }
    catch (e) { console.warn('Titolo vivo: torno al quadro fermo', e); ferma(true); return; }
    raf = requestAnimationFrame(frame);
  }
  function ferma(torna) {
    attivo = false; if (raf) cancelAnimationFrame(raf); raf = 0;
    if (torna) gate.classList.remove('nt-vivo');   // se qualcosa va storto si rivede il quadro di prima
  }
  raf = requestAnimationFrame(frame);
  window.NightTitoloVivo = { get on() { return attivo; }, stato: () => ({ km: st ? st.s.dist / 1000 : null, auto: st ? st.ents.length : 0 }), TV };
})();
