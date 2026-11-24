// Riprese del video «di serie / preparata» (v0.115): la stessa auto prima com'è in fabbrica e poi con tutto: motore di un'altra
// auto (swap), pezzi, kit carrozzeria, neon, cerchi. Ferma al semaforo fa le sgasate (limitatore a raffica, scoppi), poi parte e
// cambia a fondo. Come strumenti/reel/riprese.js (tempo finto, 30 fps, fisica vera), ma salva anche lo stato della fisica a ogni passo
// (`q`) e i pezzi montati: strumenti/reel/suono_preparate.js ci rifà il suono col motore, i campioni dei pezzi (turbina, valvola,
// scoppi, limitatore) e lo stesso compressore del gioco.
// Uso: node strumenti/reel/preparate.js CARTELLA   (SOLO=e30 ne rifà una sola; PROVA=1 un fotogramma per ripresa)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(process.argv[2] || '.');
const FPS = 30, W = 1920, H = 1080, PREP = 1.0;

// Le tre auto (donatore = l'auto di cui si prende il motore) e il loro aspetto preparato.
const COS_FULL = { kit: 'tuning', tint: 'dark', decal: 'NIGHT RUN' };
const AUTO = [
  { id: 'e30', donor: 'supra', lim: 'stutter', paint: '#d9a82e', cos: Object.assign({ glow: '#2ee6ff', rims: '#1c1d22', caliper: '#d0141e', stripe: '#0d0e10' }, COS_FULL) },
  { id: 'p205', tira: 1, donor: 'v850', lim: 'msd', paint: '#c81d11', cos: Object.assign({ glow: '#ff2e88', rims: '#d9a82e', caliper: '#2e6bff', stripe: '#f2f2ee' }, COS_FULL) },
  { id: 'golf', tira: 1, donor: 'e36', lim: 'stutter', paint: '#36c5d6', cos: Object.assign({ glow: '#b8ff3a', rims: '#1c1d22', caliper: '#d0141e', stripe: '#0d0e10' }, COS_FULL) },
];
// sgasate: [da, a, gas] in secondi dall'inizio; poi, a `go`, via a gas pieno con le cambiate
const GAS0 = [[0.5, 0.8, 0.55], [1.2, 1.55, 0.7], [2.0, 3.1, 1], [3.5, 3.8, 0.8]];
const GAS1 = [[0.4, 0.7, 0.7], [1.0, 1.3, 0.85], [1.9, 3.8, 1], [4.2, 4.5, 0.9], [4.7, 4.95, 1]];
// accelera / rilascia / accelera: gas pieno e gas tolto (da `a` a `b`, in secondi), così si sente il rilascio (borbottio, scoppi, fiammate)
const ONDE_SERIE = [[0, 1.6, 1], [1.6, 2.6, 0], [2.6, 4.2, 1], [4.2, 5.3, 0], [5.3, 6.6, 1]];             // dopo il via, per le auto di serie
const ONDE = [[0, 1.5, 1], [1.5, 2.6, 0], [2.6, 4.2, 1], [4.2, 5.4, 0], [5.4, 7.2, 1], [7.2, 8.4, 0], [8.4, 10, 1]];   // tirata in marcia, per le preparate
const SHOTS = [];
for (const A of AUTO) {
  const prep = { id: A.id, tipo: 'full', donor: A.donor, lim: A.lim, paint: A.paint, cos: A.cos };
  SHOTS.push({ name: A.id + '_a_serie', km: 1.5, sec: 11.0, t0: 50, lane: 2, env: 1, tc: true, car: { id: A.id, tipo: 'stock' }, drive: { mode: 'sgasate', gas: GAS0, go: 4.4, waves: ONDE_SERIE } });
  // preparata: sgasate ferme (con rilascio) e poi tirata in marcia a ondate. Le auto leggere, a trazione anteriore o no, hanno più aderenza
  // (`grip`, solo per il video): con 600-800 CV le gomme non reggono e il motore resterebbe inchiodato al limitatore
  SHOTS.push({ name: A.id + '_b_preparata', km: 1.5, sec: 6.4, t0: 50, lane: 2, env: 1, tc: true, car: prep, drive: { mode: 'sgasate', gas: GAS1, go: 99 } });
  SHOTS.push({ name: A.id + '_c_tira', km: 1.5, sec: 10.0, t0: 50, lane: 2, env: 1, tc: true, grip: 1.8, car: prep, drive: { mode: 'tira', gear: 3, rpm0: 3200, waves: ONDE } });
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

// ---------------------------------------------------------------- nella pagina: pilota, regia degli eventi, registro del motore
function regia([w, h]) {
  const v2 = nightRun.view2d, c = v2.canvas, sim = nightRun.sim, g = nightRun.game;
  g.s.vg.firstDone = true;                                             // tutorial del primo pacco già fatto: si può andare ovunque
  document.body.appendChild(c); c.hidden = false; c.dataset.teaser = '1';
  { const st = document.createElement('style'); st.textContent = 'body.teaserPh > *:not(#telefonoHost):not([data-teaser]){visibility:hidden!important}'; document.head.appendChild(st); }
  c.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;z-index:99999`;
  v2.resize(); v2.laneRadar = false; v2.drawTripFx = null; v2.districtBanner = null; v2.quality = 'alta'; v2.slow = false;
  v2.setDaylight = function () {}; v2.setRain = function () {};
  { const sc = v2.setCosmetics.bind(v2); v2.setCosmetics = (c) => sc(window.__COS ? Object.assign({ dirt: 0 }, window.__COS) : c); }   // il gioco li rimette ogni mezzo secondo: qui valgono quelli della ripresa
  const R = window.__R = { shot: null, t: 0, log: [] };
  const lim = () => sim.P.limiter || 6500;
  const top = () => sim.topGear();
  // velocità → marcia sensata (giri tra 1800 e 3200) e ruote in presa, per cominciare una ripresa già in movimento
  R.setSpeed = (v) => {
    sim.v = v; sim.ww = v / sim.P.r; sim.wo = sim.ww;
    if (v < 0.5) { sim.gear = 0; return; }
    let gr = 1; for (let k = 1; k <= top(); k++) { const rpm = sim.ww * sim.ratio(k) * 9.5493; if (rpm > 1700) gr = k; }
    sim.gear = gr;
  };
  // pilota a copione: gas, freno, cambiate (come farebbe un giocatore)
  const shiftUp = (at) => { if (sim.gear > 0 && sim.gear < top() && !sim.shiftSeq && sim.rpm > at) sim.shift(sim.gear + 1); };
  const shiftDown = () => { if (sim.gear > 1 && !sim.shiftSeq && sim.rpm < 1350) sim.shift(sim.gear - 1); };
  const hold = (vt, t) => {                                            // tiene una velocità: gas proporzionale, freno se serve
    const v = sim.v; let thr = Math.max(0, Math.min(0.7, 0.18 + (vt - v) * 0.35)), br = 0;
    if (v > vt + 1.2) { thr = 0; br = Math.min(0.6, (v - vt) * 0.12); }
    if (sim.gear === 0 && vt > 0.5) sim.shift(1);
    shiftUp(3000); shiftDown();
    return [thr, br];
  };
  R.drive = (t) => {
    const s = R.shot, d = s.drive; let thr = 0, br = 0;
    if (d.mode === 'cruise') [thr, br] = hold(d.v, t);
    else if (d.mode === 'start') {
      if (sim.running && sim.rpm > 600 && R.runAt === undefined) R.runAt = t;
      if (t < d.ign) { sim.setIgnition(false); R.runAt = undefined; }
      else if (t < d.go || R.runAt === undefined || t < R.runAt + 0.5) { sim.setStarter(R.runAt === undefined && t < d.ign + 3); thr = R.runAt !== undefined && t > R.runAt + 0.15 && t < R.runAt + 0.35 ? 0.45 : 0; br = 0.3; }   // avviamento, una sgasata e via
      else { sim.setStarter(false); if (sim.gear === 0) sim.shift(1); if (sim.v < d.vmax - 0.5) { thr = Math.min(1, d.thr + Math.max(0, t - R.runAt - 1.5) * 0.25); shiftUp(lim() * (thr > 0.9 ? 0.85 : 0.62)); } else [thr, br] = hold(d.vmax, t); }
    } else if (d.mode === 'drag') {
      if (t < d.go) { if (sim.gear !== 0 && !sim.shiftSeq) sim.shift(0); br = 1; thr = (t % 0.9) > 0.45 && (t % 0.9) < 0.62 && t > 0.6 ? 0.75 : 0.12; }   // al rosso: in folle, sgasate
      else {
        if (sim.gear === 0) sim.shift(1);
        if (d.wet) {
          // sul bagnato: gas dosato come un pilota, per tenere lo slittamento lì (le ruote pattinano e schizzano, l'auto va)
          const dt = Math.max(0, t - (R.tPrev ?? t)), slip = sim.slipNow || 0;
          R.thr = Math.max(0.3, Math.min(1, (R.thr ?? 0.85) + (slip < d.wet ? 2.2 : -5) * dt));
          thr = sim.shiftSeq ? 0 : R.thr; shiftUp(lim() * 0.93);
        } else { thr = 1; shiftUp(lim() * 0.95); }
      }
    } else if (d.mode === 'pull') {
      // a fondo nella marcia di partenza fino al limitatore, lo si tiene `hold` secondi, poi marcia dopo e via; poco dopo la
      // cambiata la telecamera si ferma e l'auto esce dallo schermo
      thr = t < 0 ? 0.12 : 1;                                          // prima della ripresa tiene i giri, poi a fondo
      if (t >= 0 && R.limAt === undefined && sim.rpm > lim() - 150) R.limAt = t;
      if (R.limAt !== undefined && !R.shifted && t > R.limAt + d.hold) { sim.shift(d.gear + 1); R.shifted = t; }
      if (R.shifted && R.camAt === undefined && t > R.shifted + 0.3) R.camAt = t;
      if (R.shifted && !sim.shiftSeq) shiftUp(lim() * 0.95);
    } else if (d.mode === 'sgasate') {
      if (t < d.go) {                                                  // fermo al semaforo, in folle: sgasate e limitatore
        if (R.leva === 'D') { window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true })); }
        if (R.leva !== 'N') { nightRun.leva('N'); R.leva = 'N'; }      // la leva in D rimetterebbe la prima da sola
        if (sim.gear !== 0 && !sim.shiftSeq) sim.shift(0);
        br = 1; thr = 0; for (const [a, b, v] of d.gas) if (t >= a && t < b) thr = v;
      } else {                                                         // gas anche per il cambio automatico del gioco: lo vede a zero e cambierebbe a 3.000 giri
        if (R.leva !== 'D') { nightRun.leva('D'); R.leva = 'D'; window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true })); }
        if (sim.gear === 0) sim.shift(1); thr = sim.shiftSeq ? 0 : 1; shiftUp(lim() * 0.96);
        if (d.waves) for (const [a, b, v] of d.waves) if (t - d.go >= a && t - d.go < b) thr = v;   // gas pieno / gas tolto
      }
    } else if (d.mode === 'tira') {                                    // marcia lunga a gas pieno fino al limitatore, poi la dopo, e via: il motore canta
      if (R.leva !== 'D') { nightRun.leva('D'); R.leva = 'D'; window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true })); }
      thr = t < 0 ? 0.15 : 1; if (sim.gear === 0) sim.shift(d.gear); shiftUp(lim() * 0.97);
      if (d.waves && t >= 0) for (const [a, b, v] of d.waves) if (t >= a && t < b) thr = v;   // gas pieno / gas tolto (rilascio)
    } else if (d.mode === 'pass') {
      const u = Math.max(0, Math.min(1, (t - d.at) / d.dur)), vt = t < d.back ? d.v0 + (d.vlow - d.v0) * (u * u * (3 - 2 * u)) : d.vlow + (t - d.back) * 2.2;
      [thr, br] = hold(vt, t);
    }
    if (d.mode !== 'start' && !sim.running) sim.setStarter(true); else if (d.mode !== 'start' && sim.starter) sim.setStarter(false);
    sim.in.thr = thr; sim.in.brake = br; sim.in.clutch = 0; R.tPrev = t;
  };
  // ogni passo della fisica: prima il pilota, dopo si salva quello che serve al suono
  const upd = sim.update.bind(sim);
  sim.update = function (dt) {
    const s = R.shot;
    if (s) { R.t += dt; this.cfg.tc = s.tc !== false; this.wet = s.rain ? 1 : 0; this.tyreK = 1; R.drive(R.t - PREP_S); }   // gomme gonfie (l'auto ereditata le ha sgonfie)
    const r = upd(dt);
    if (s && R.t >= PREP_S) R.log.push({ t: +(R.t - PREP_S).toFixed(4), q: { running: this.running, rpm: this.rpm, thr: this.thr, cut: this.cut, v: this.v, tur: this.tur, wg: this.wg, gear: this.gear, ww: this.ww, ovr: this.ovr, pops: !!this.cfg.pops, shiftSeq: this.shiftSeq ? 1 : null, launchArmed: this.launchArmed, kmh: this.kmh, ratio: this.ratio(this.gear) }, p: this.audioParams(), ev: this.events.map((e) => Object.assign({}, e)), far: R.far || 0 });   // far: metri da cui la telecamera si è fermata
    return r;
  };
  const PREP_S = window.__PREP;
  // la guida automatica del gioco (dopo 3 s senza tasti) cambierebbe marcia da sola: un tasto che il gioco non usa resta premuto
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F24', bubbles: true }));
  if (window.telefono) telefono.setAtto(0);                            // niente chiamate della storia durante le riprese (si vede solo il messaggio voluto)
  // ogni momento: niente cartelloni e oggetti della storia, niente polizia che ti insegue, la scena come la vuole la ripresa
  setInterval(() => {
    const s = R.shot; if (!s) return;
    g.siren = false; v2.comicsOn = v2.reaOn = !!window.__COMICS; v2.day = s.day || 0; v2.sunset = s.sunset || 0; v2.slow = false; v2.tAvg = 0; v2.rainOn = !!s.rain;
    sim.fuel = Math.max(sim.fuel, 0.7); sim.damage = 0; sim.tireWear = 0; g.lane = s.lane; g.ap = null; g.blocked = false;
    if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ }
    if (g.ents) g.ents = g.ents.filter((e) => e.kind === 'place' || e.kind === 'station' || e._teaser
      || (e.kind === 'traffic' && !e.hazard && !(e.lane === g.lane && e.x > g.s.dist - 30 && e.x < g.s.dist + 160)));
    const tt = R.t - PREP_S;
    if (s.phone && window.telefono) {
      // il telefono sale da sotto a destra, grande, con la notifica sullo schermo bloccato
      const host = document.getElementById('telefonoHost');
      if (tt >= s.phone.at && !R.phoneOn) { R.phoneOn = true; telefono.open(); }
      if (host && R.phoneOn) {
        const u = Math.min(1, (tt - s.phone.at) / 0.5), e = 1 - Math.pow(1 - u, 3);
        const nt = host.shadowRoot && host.shadowRoot.querySelector('.notif');
        if (nt && !nt.dataset.tz) { nt.dataset.tz = '1'; nt.innerHTML = `<b>${s.phone.from}<small>ora</small></b><p>${s.phone.text}</p>`; }
        host.style.right = Math.round(w * 0.14) + 'px'; host.style.bottom = '0px'; host.style.transformOrigin = 'bottom right';
        const k = h * 0.84 / 620, up = (h - 620 * k) / 2;              // intero sullo schermo, centrato in altezza
        host.style.transform = `translateY(${Math.round((1 - e) * h * 0.95 - up)}px) scale(${k.toFixed(3)}) rotate(${(-4 * e).toFixed(2)}deg)`;
      }
    }
    if (R.camAt !== undefined && s.drive.mode === 'pull') {
      // la telecamera rallenta in 1,6 s fino a fermarsi: l'auto si stacca e se ne va verso destra
      if (R.cam0 === undefined) { R.cam0 = v2.st.cam; R.camX = g.s.dist; R.camT = tt; v2.camHold = (c, dist, W) => R.cam0 + (dist - R.camX) * 30 / W; }
      const f = Math.max(0, 1 - (tt - R.camAt) / 1.6); R.camX += sim.v * f * Math.max(0, tt - R.camT); R.camT = tt;
      R.far = g.s.dist - R.camX;
    }
    if (R.rival) { R.rival.lane = s.rival.lane; R.rival.v = R.t - PREP_S < s.drive.go + 0.12 ? 0 : sim.v * s.rival.k; R.rival.vT = R.rival.v; }
  }, 4);
}

// ripresa: prepara il posto, gli eventi e l'auto, poi lascia che la scena si assesti per PREP secondi
function prepara(s) {
  const g = nightRun.game, v2 = nightRun.view2d, sim = nightRun.sim, R = window.__R;
  g.s.dist = s.km * 1000; { const lid = VG.locAt(s.km); if (!g.loc || g.loc.id !== lid) g.setLoc(lid); }   // il luogo giusto subito (cambiandolo il gioco svuota la strada)
  v2.rainOn = !!s.rain; v2.st.t = s.t0; v2.day = s.day || 0; v2.sunset = s.sunset || 0; v2._deb = []; v2.marks = [];
  g.lane = s.lane; g.laneZ = GAME_LANE_Z[s.lane]; v2.st.lz = g.laneZ; v2.st.lzV = 0; g.ents = g.ents.filter((e) => e.kind === 'place' || e.kind === 'station');
  window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w', code: 'KeyW', bubbles: true })); R.rival = null; R.leva = null; R.t = 0; R.log = []; R.limAt = R.shifted = R.camAt = R.cam0 = R.camX = R.camT = R.thr = R.tPrev = undefined; R.far = 0; R.phoneOn = false; v2.camHold = null;
  // auto della ripresa: di serie (preparazione «stock») oppure preparata (preparazione «full» + motore di un'altra auto + limitatore),
  // montata come fa il gioco in applySettings: catalogo con i pezzi del donatore, parametri, swap, massa
  { const A = s.car, id = A.id, C = CARS[id], last = (cat) => cat.items[cat.items.length - 1].id;
    g.s.carId = id; g.s.swap = g.s.swap || {}; setActiveCar(id);
    let sel;
    if (A.tipo === 'stock') { sel = Object.assign({}, C.presets[0].sel); delete g.s.swap[id]; window.__COS = null; }
    else {
      sel = Object.assign({}, (C.presets.find((q) => q.id === 'full') || C.presets[C.presets.length - 1]).sel);
      sel.ecu = last(C.tuning.ecu); sel.limiter = A.lim;
      if (A.donor) {
        const D = CARS[A.donor], dp = (D.presets.find((q) => q.id === 'full') || D.presets[D.presets.length - 1]).sel;
        g.s.swap[id] = A.donor;
        for (const k of OFF_MOTORE) {
          if (D.tuning[k]) sel[k] = A.donor + ':' + (k === 'ecu' ? last(D.tuning.ecu) : dp[k] || last(D.tuning[k]));
          else if (C.tuning[k]) sel[k] = C.tuning[k].items[0].id;
        }
      } else delete g.s.swap[id];
      window.__COS = Object.assign({ glow: 'none', rims: 'none', caliper: 'none', stripe: 'none', tint: 'none', decal: 'none', wheels: 'none', kit: 'none', spoiler: 'none', st_door: 'none', st_rear: 'none', st_glass: 'none' }, A.cos);
    }
    offCatalog(g, id);                                                 // con lo swap il catalogo ha i pezzi del motore montato
    const TPs = tuningParams(sel);
    sim.setCar(Object.assign({}, C.P));
    const MOTE = offSwapApply(g, id, TPs, sim, sel);
    if (TPs.sim.boostK === undefined) TPs.sim.boostK = 1; if (!TPs.sim.clutchMax) TPs.sim.clutchMax = sim.P.clutchMax;
    if (s.grip) TPs.sim.mu = (TPs.sim.mu || sim.P.mu || 1.1) * s.grip;      // solo per il video: a trazione anteriore con 600 CV le gomme da strada non tengono, il motore resterebbe inchiodato al limitatore
    sim.setTune(TPs.sim); g.applyMass(TPs.sim.dm || 0, TPs.sim.rearOff);
    sim.cfg.pops = !!TPs.sim.ecuPops; sim.cfg.launch = false; sim.cfg.autoClutch = true;
    const est = sim.estimatePeak();
    R.car = { id, tipo: A.tipo, sel, donor: A.donor && A.tipo !== 'stock' ? A.donor : null, hp: Math.round(est.cv), nm: Math.round(est.nm), motore: MOTE ? MOTE.tipo : null };
    if (!R.car0) R.car0 = { id: v2.carId, look: v2.carLook, paint: v2.carId === 'supra' ? v2.paintHex : v2.v40Paint };
    v2.setCosmetics(window.__COS || {}); v2.setCar(id, TPs.look, A.paint); }
  // telefono: per la sua ripresa il messaggio è l'ultimo arrivato; la tela resta sotto il telefono e il resto della pagina sparisce
  const ph = document.getElementById('telefonoHost');
  if (window.telefono) telefono.close();
  document.body.classList.toggle('teaserPh', !!s.phone); v2.canvas.style.zIndex = s.phone ? '59' : '99999';
  if (ph) { ph.style.right = '16px'; ph.style.bottom = '16px'; ph.style.transform = ''; ph.style.transformOrigin = 'bottom right'; }
  if (s.phone) TEL_SMS.push({ from: s.phone.from, text: s.phone.text, km: s.km + 0.001, bad: 1 });
  sim.setIgnition(true); sim.setStarter(false);
  if (s.light) {
    // semaforo: ci si ferma col muso sulla linea d'arresto, il rosso diventa verde proprio al "via"
    const m = Math.floor((g.s.dist - 130) / 260) * 260 + 130 + 260;
    g.s.dist = m - 4.2;
    const tGo = window.__PREP + s.drive.go;                             // da qui al via
    v2.st.t = ((14 - ((tGo + m * 0.013) % 14)) % 14) + 14 * 3 + 0.05;   // fase del semaforo 0 (verde) proprio al via
  }
  if (s.drive.mode !== 'start') { sim.setIgnition(true); sim.running = true; sim.starter = false; sim.we = 900 / 9.5493; }
  R.setSpeed(s.drive.mode === 'cruise' ? s.drive.v : s.drive.mode === 'pass' ? s.drive.v0 : 0);
  if (s.drive.mode === 'pull' || s.drive.mode === 'tira') { const v = s.drive.rpm0 / 9.5493 / sim.ratio(s.drive.gear) * sim.P.r; R.setSpeed(v); sim.gear = s.drive.gear; sim.we = sim.ww * sim.ratio(s.drive.gear); }   // motore già ai giri della marcia
  if (s.drive.mode === 'start') { sim.setIgnition(false); sim.running = false; sim.we = 0; }
  if (s.rival) { const e = { id: g.id++, kind: 'traffic', vt: s.rival.vt, len: 4.4, lane: s.rival.lane, x: g.s.dist + 0.6, v: 0, vT: 0, vBase: 0, color: 'orig', _teaser: true }; g.ents.push(e); R.rival = e; }
  if (s.block) {
    // posto di blocco in prima corsia: volante coi lampeggianti dietro a un'auto ferma con le quattro frecce
    const x = g.s.dist + s.block;
    g.ents.push({ id: g.id++, kind: 'traffic', vt: 'clio', len: 4.2, lane: 1, x: x + 6.5, v: 0, vT: 0, vBase: 0, hazard: true, still: true, color: 'orig', _teaser: true });
    g.ents.push({ id: g.id++, kind: 'police', lane: 1, x, v: 0, busy: true, still: true, hazard: true, _teaser: true });
  }
  R.shot = s;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const URL = `http://127.0.0.1:${server.address().port}/index.html`;
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.route('**cdn.jsdelivr.net**', (r) => r.abort());
  await page.clock.install({ time: new Date('2027-01-01T21:00:00') });
  // il ciclo del gioco prende il tempo dal timestamp di requestAnimationFrame: col tempo finto quel valore non torna
  // (il gioco andava 4-5 volte più veloce del video). Ogni fotogramma del gioco = 1/60 s del tempo finto, sempre.
  await page.addInitScript(() => { window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 1000 / 60); window.cancelAnimationFrame = (id) => clearTimeout(id); });
  await page.clock.pauseAt(new Date('2027-01-01T21:00:01'));             // tempo fermo: avanza solo con run(), non da solo mentre si salvano i fotogrammi
  await page.goto(URL);
  const run = (ms) => page.clock.runFor(ms);
  await run(1500);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* niente */ } const b = document.getElementById('goBtn'); b && b.click(); });
  await run(2500);
  await page.evaluate(() => { if (window.NightPrologo && NightPrologo.playing) NightPrologo.finish(); });
  await run(800);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { const g = nightRun.game; if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ } }); await run(150); }
  await page.evaluate((p) => { window.__PREP = p; }, PREP);
  await page.evaluate(regia, [W, H]);
  await page.evaluate(() => { try { nightRun.leva('D'); } catch (e) { /* niente */ } });   // la leva dopo il prologo è in P: l'auto non si muoverebbe

  for (const sh of SHOTS) {
    if (process.env.SOLO && !new RegExp(process.env.SOLO).test(sh.name)) continue;
    await page.evaluate(prepara, sh);
    await run(PREP * 1000);
    const file = path.join(OUT, sh.name + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = process.env.PROVA ? 3 : Math.round(sh.sec * FPS);
    const step = process.env.PROVA ? sh.sec * 1000 / 3 : 1000 / FPS;
    const tv = [];                                                      // tempo del registro a ogni fotogramma (per mettere il suono a tempo)
    for (let i = 0; i < n; i++) {
      await run(step);
      tv.push(await page.evaluate(() => window.__R.t - window.__PREP));
      const buf = sh.phone ? await page.screenshot({ type: 'png' }) : Buffer.from((await page.evaluate(() => nightRun.view2d.canvas.toDataURL('image/png'))).slice(22), 'base64');
      if (!ff.stdin.write(buf)) await new Promise((ok) => ff.stdin.once('drain', ok));
    }
    ff.stdin.end(); await new Promise((ok) => ff.on('close', ok));
    if (process.env.DEBUG) console.log(await page.evaluate(() => JSON.stringify({ ents: nightRun.game.ents.map((e) => [e.kind, e.lane, Math.round(e.x - nightRun.game.s.dist), !!e._teaser]), lim: window.__R.limAt, shift: window.__R.shifted, cam: window.__R.camAt, car: nightRun.view2d.carId })));
    const log = await page.evaluate(() => { const R = window.__R, l = R.log; R.shot = null; R.log = []; return l; });
    const env = sh.env || 0;                                            // 1: città (riverbero dei palazzi)
    const car = await page.evaluate(() => window.__R.car);
    fs.writeFileSync(path.join(OUT, sh.name + '.json'), JSON.stringify({ sec: sh.sec, env, tv0: tv[0] - step / 1000, car, phone: sh.phone ? sh.phone.at : null, log }));
    const last = log[log.length - 1] || { p: {} };
    console.log('ripresa', sh.name, n, 'fotogrammi ·', log.length, 'passi del motore · fine a', Math.round((last.p.speed || 0) * 3.6), 'km/h,', Math.round(last.p.rpm || 0), 'giri');
  }
  console.log(errs.length ? 'errori: ' + errs.join(' | ') : 'nessun errore in console');
  await b.close(); server.close();
})().catch((e) => { console.error(e); process.exit(1); });
