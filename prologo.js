// ============================================================================
//  Night Run · Il prologo (dopo intro.js, prima di partire)
//  Si vede a inizio partita, dopo "Accendi e parti": una lettera dello studio notarile (l'eredità di un parente),
//  la BMW E36 blu che arriva davanti all'edificio, il colloquio col notaio, la scelta dell'auto (per ora si può
//  prendere solo la Volvo V40) e la Volvo che imbocca l'autostrada. Poi comincia il Viaggio.
//  Scene in pixel art su tela 640×360 (le stesse proporzioni del gioco), testi in HTML sopra.
//  Clic, Invio o Spazio vanno avanti; Esc o SALTA chiudono tutto. Si salta anche in automatico dalle partite già iniziate.
//  Dal resto del gioco: NightPrologo.shouldPlay(game), NightPrologo.play({ onDone, ctx }), NightPrologo.jump(n).
// ============================================================================
const PRO_PARENTE = 'Remo';                      // il parente morto: SEGNAPOSTO, si cambia qui (e in telefono.js)
const PRO_LETTERA = [
  'STUDIO NOTARILE FERRI',
  'Via dei Cantieri 12',
  '',
  'Gentile erede,',
  '',
  `con profondo dispiacere le comunichiamo che suo zio ${PRO_PARENTE} è venuto a mancare.`,
  'Ha lasciato disposizioni precise a suo nome: un\'eredità, che si può ritirare soltanto di persona.',
  '',
  'La aspettiamo stasera alle 21:00. Porti un documento.',
  '',
  'Distinti saluti,',
  'Avv. D. Ferri',
];
// il colloquio: chi parla e cosa dice (segnaposto, si cambia qui)
const PRO_NOTAIO = [
  'Si accomodi. Mi dispiace per suo zio.',
  `${PRO_PARENTE} non ha lasciato soldi. Ha lasciato un garage, e sei auto.`,
  'Una sola potrà portarsela via stasera. Le altre aspetteranno.',
  'Scelga con calma. Ma non troppa: suo zio diceva che di notte la strada si fa più lunga.',
];
// le sei auto del garage: per ora solo la Volvo si può scegliere. Le altre cinque restano sotto il telo (nomi in arrivo).
const PRO_AUTO = [
  { id: 'telo', nome: 'Sotto un telo' }, { id: 'telo', nome: 'Sotto un telo' }, { id: 'v40', nome: 'Volvo V40 SW', ok: true },
  { id: 'telo', nome: 'Sotto un telo' }, { id: 'telo', nome: 'Sotto un telo' }, { id: 'telo', nome: 'Sotto un telo' },
];
// si gioca il prologo solo all'inizio di un Viaggio nuovo (km 0, mai visto)
const proShould = (s) => !!(s && s.vg && s.vg.on && !s.vg.prologo && (s.dist || 0) < 50);

(function prologo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const W = 640, H = 360, E36 = { w: 196, h: 58, ax: [39.4, 158.7], wy: 44.4, wr: 14.1, refL: 48.3 };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  // ------------------------------------------------------------ immagini (E36 ridipinta di blu, V40 com'è)
  const IMG = {};
  const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(i); i.src = src; });
  async function prepare() {
    if (IMG.ready) return;
    const [body, wheel, mask, v40] = await Promise.all([load('img/e36.png'), load('img/e36_wheel.png'), load('img/e36_paint.png'), load('img/v40.png')]);
    const c = document.createElement('canvas'); c.width = E36.w; c.height = E36.h; const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingEnabled = false; x.drawImage(body, 0, 0);
    if (mask.width) {
      const m = document.createElement('canvas'); m.width = E36.w; m.height = E36.h; const mx = m.getContext('2d', { willReadFrequently: true }); mx.drawImage(mask, 0, 0);
      const d = x.getImageData(0, 0, E36.w, E36.h), p = d.data, mk = mx.getImageData(0, 0, E36.w, E36.h).data, R = 0x1c, G = 0x4a, B = 0xc4;     // blu
      for (let i = 0; i < p.length; i += 4) {
        if (mk[i + 3] < 128 || !p[i + 3]) continue;
        const k = Math.max(0.15, Math.min(1.9, ((p[i] + p[i + 1] + p[i + 2]) / 3) / 140)), lift = k > 1 ? (k - 1) * 0.6 : 0;   // luci e ombre del disegno restano
        p[i] = Math.min(255, R * Math.min(k, 1.1) + (255 - R) * lift); p[i + 1] = Math.min(255, G * Math.min(k, 1.1) + (255 - G) * lift); p[i + 2] = Math.min(255, B * Math.min(k, 1.1) + (255 - B) * lift);
      }
      x.putImageData(d, 0, 0);
    }
    IMG.e36 = c; IMG.wheel = wheel; IMG.v40 = v40; IMG.ready = true;
  }
  // la E36 con le ruote, che girano; x,y = angolo in alto a sinistra; s = scala
  function drawE36(g, x, y, s, ang) {
    g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(s, s);
    for (const a of E36.ax) { g.save(); g.translate(a, E36.wy); g.rotate(ang); g.drawImage(IMG.wheel, -E36.wr, -E36.wr, E36.wr * 2, E36.wr * 2); g.restore(); }
    g.drawImage(IMG.e36, 0, 0); g.restore();
  }

  // ------------------------------------------------------------ audio: pochi suoni sintetizzati
  let actx = null;
  function motor(f0, f1, dur, vol) {
    try {
      if (!actx || actx.state === 'closed') return; const t = actx.currentTime;
      const o = actx.createOscillator(), o2 = actx.createOscillator(), lp = actx.createBiquadFilter(), g = actx.createGain();
      o.type = 'sawtooth'; o2.type = 'square'; lp.type = 'lowpass'; lp.frequency.value = 520; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f1, t + dur); o2.frequency.setValueAtTime(f0 / 2, t); o2.frequency.linearRampToValueAtTime(f1 / 2, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(actx.destination); o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
    } catch (e) { /* senza audio si va avanti lo stesso */ }
  }
  function thump(vol = 0.2) {
    try {
      if (!actx || actx.state === 'closed') return; const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.25); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.35);
    } catch (e) { /* ignora */ }
  }

  // ------------------------------------------------------------ pezzi di scena (rettangoli e sfumature, pixel netti)
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  function glow(g, x, y, r, col, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function sky(g) {
    const gr = g.createLinearGradient(0, 0, 0, 230); gr.addColorStop(0, '#04050b'); gr.addColorStop(0.7, '#141226'); gr.addColorStop(1, '#2b1a2e'); g.fillStyle = gr; g.fillRect(0, 0, W, 240);
    for (let i = 0; i < 46; i++) R(g, hash(i) * W, hash(i + 90) * 130, 1, 1, `rgba(255,255,255,${0.25 + hash(i + 7) * 0.5})`);
  }
  function skyline(g, y0, seed, col, wins) {
    for (let i = 0, x = -10; x < W + 20; i++) {
      const w = 28 + hash(seed + i) * 40, h = 40 + hash(seed + i + 40) * 90; R(g, x, y0 - h, w, h, col);
      if (wins) for (let yy = y0 - h + 6; yy < y0 - 6; yy += 9) for (let xx = x + 4; xx < x + w - 4; xx += 8) if (hash(seed + xx * 3 + yy) > 0.72) R(g, xx, yy, 3, 4, hash(xx + yy) > 0.5 ? '#ffb347' : '#ffe9a8');
      x += w + 2;
    }
  }
  function street(g, off) {
    R(g, 0, 238, W, 16, '#272630'); R(g, 0, 238, W, 2, '#3b3946');           // marciapiede
    R(g, 0, 254, W, 106, '#14151b'); R(g, 0, 254, W, 2, '#07080b');
    for (let x = -((off || 0) % 48) - 48; x < W; x += 48) R(g, x, 312, 26, 3, '#8d8776');
    for (let x = -((off || 0) % 160) - 160; x < W; x += 160) { R(g, x + 70, 150, 3, 90, '#1d1d24'); R(g, x + 62, 148, 20, 4, '#1d1d24'); R(g, x + 63, 152, 18, 3, '#ffe9a8'); }
  }
  function lampGlow(g, off) { for (let x = -((off || 0) % 160) - 160; x < W; x += 160) glow(g, x + 72, 160, 70, 'rgba(255,200,120,A)', 0.35); }
  function beam(g, x, y, len, a) { const gr = g.createLinearGradient(x, 0, x + len, 0); gr.addColorStop(0, `rgba(255,236,170,${a})`); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, y - 3); g.lineTo(x + len, y - 26); g.lineTo(x + len, y + 22); g.lineTo(x, y + 6); g.fill(); }
  function banner(g, txt, x, y, col = '#e8d8b0', size = 11) { g.font = `${size}px "Share Tech Mono", monospace`; g.fillStyle = col; g.textAlign = 'center'; g.fillText(txt, x, y); g.textAlign = 'left'; }

  // ------------------------------------------------------------ le scene
  // ognuna: dur (s, 0 = aspetta un clic), draw(g, t), enter() opzionale
  const SC = {};
  SC.lettera = { dur: 0, draw(g, t) {
    R(g, 0, 0, W, H, '#0a0807'); const gr = g.createRadialGradient(W / 2, 140, 20, W / 2, 180, 380); gr.addColorStop(0, '#3a2814'); gr.addColorStop(1, '#0a0807'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let y = 250; y < H; y += 7) R(g, 0, y, W, 1, 'rgba(0,0,0,.25)');                               // venature del tavolo
    glow(g, 520, 90, 170, 'rgba(255,190,100,A)', 0.28 + 0.03 * Math.sin(t * 5));
  } };
  SC.arrivo = { dur: 8, enter() { motor(70, 40, 6.5, 0.07); }, draw(g, t) {
    sky(g); skyline(g, 232, 3, '#0b0b16', true);
    // l'edificio dello studio
    R(g, 380, 70, 250, 190, '#2b2230'); R(g, 380, 70, 250, 4, '#3d3042'); R(g, 372, 62, 266, 10, '#1c1620');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const lit = (r + c) % 3 === 1; R(g, 400 + c * 56, 96 + r * 48, 30, 28, lit ? '#ffcf7a' : '#141018'); R(g, 400 + c * 56, 96 + r * 48 + 13, 30, 2, 'rgba(0,0,0,.35)'); }
    R(g, 436, 196, 90, 12, '#0e0b10'); banner(g, 'STUDIO FERRI', 481, 206, '#ffcf7a', 10);
    const open = ease((t - 5.2) / 1.2); R(g, 410, 214, 150, 46, '#0c0a0e'); R(g, 410, 214, 150, 46 * (1 - open * 0.78), '#3b3640');           // saracinesca che sale
    glow(g, 485, 240, 90, 'rgba(255,200,110,A)', 0.14 + open * 0.3);
    street(g, 0); lampGlow(g, 0);
    const x = lerp(-230, 150, ease(t / 4.8)), braking = t > 3.2 && t < 6.5, ang = t * lerp(14, 0, ease(t / 4.8)) * 2;
    glow(g, x + 90, 330, 110, 'rgba(0,0,0,A)', 0.5);
    beam(g, x + 190, 296, 170 * (1 - 0.3 * ease((t - 4.8) / 1)), 0.38);
    drawE36(g, x, 270, 1, ang); if (braking) { R(g, x + 3, 288, 5, 3, '#ff3a2a'); glow(g, x + 6, 289, 22, 'rgba(255,40,30,A)', 0.4); }
    banner(g, 'Via dei Cantieri 12 · le nove di sera', W / 2, 346, 'rgba(240,230,210,.8)', 11);
  } };
  SC.studio = { dur: 0, draw(g, t) {
    R(g, 0, 0, W, H, '#211a24'); R(g, 0, 250, W, 110, '#2a1f1a'); R(g, 0, 248, W, 3, '#14100e');
    for (let x = 0; x < W; x += 36) R(g, x, 0, 1, 248, 'rgba(0,0,0,.18)');
    R(g, 40, 50, 120, 130, '#0b0d18'); skyline(g, 180, 11, '#06070f', true); R(g, 40, 50, 120, 4, '#3b2c2a'); R(g, 98, 50, 4, 130, '#3b2c2a'); R(g, 40, 180, 120, 5, '#3b2c2a');      // finestra sulla città
    R(g, 40, 50, 120, 130, 'rgba(10,12,28,.0)');
    R(g, 470, 40, 130, 190, '#17110e'); for (let i = 0; i < 5; i++) { R(g, 470, 70 + i * 36, 130, 4, '#3a2a1a'); for (let k = 0; k < 9; k++) R(g, 476 + k * 14, 44 + i * 36, 10, 26, ['#5a2a2a', '#2a3a4a', '#4a3d1a', '#2c2c36'][(k + i) % 4]); }  // libreria
    glow(g, 300, 160, 230, 'rgba(255,190,110,A)', 0.2);
    // il notaio dietro la scrivania
    const talk = t % 0.4 < 0.2;
    R(g, 270, 150, 100, 110, '#15151d'); R(g, 300, 150, 40, 70, '#e6e1d6'); R(g, 316, 152, 8, 60, '#7a1c24');                  // giacca, camicia, cravatta
    R(g, 298, 102, 44, 50, '#d9a98a'); R(g, 296, 96, 48, 18, '#9a9a9a'); R(g, 294, 104, 6, 22, '#9a9a9a'); R(g, 340, 104, 6, 22, '#9a9a9a');     // testa e capelli grigi
    R(g, 304, 124, 14, 8, '#101018'); R(g, 322, 124, 14, 8, '#101018'); R(g, 306, 126, 10, 4, '#cfe0f0'); R(g, 324, 126, 10, 4, '#cfe0f0'); R(g, 318, 128, 4, 2, '#101018');    // occhiali
    R(g, 312, 140, 16, talk ? 4 : 2, '#6a2a24');
    R(g, 190, 220, 260, 14, '#4a3220'); R(g, 190, 234, 260, 40, '#2e1f14'); R(g, 200, 274, 12, 40, '#2e1f14'); R(g, 428, 274, 12, 40, '#2e1f14');   // scrivania
    R(g, 330, 212, 50, 8, '#e4dccb'); R(g, 240, 208, 10, 12, '#ffcf7a'); glow(g, 245, 208, 60, 'rgba(255,210,130,A)', 0.4);                     // pratiche e lampada
  } };
  SC.garage = { dur: 0, draw(g, t) {
    R(g, 0, 0, W, H, '#14151a'); R(g, 0, 250, W, 110, '#1b1c22'); for (let x = 0; x < W; x += 80) R(g, x, 0, 3, 250, '#0c0d11');
    const fl = hash(Math.floor(t * 9)) > 0.93 ? 0.5 : 1;
    for (let x = 80; x < W; x += 160) { R(g, x - 40, 20, 80, 5, '#d8e8ff'); glow(g, x, 24, 150, 'rgba(190,215,255,A)', 0.2 * fl); }
    R(g, 0, 246, W, 3, '#0c0d11');
  } };
  SC.strada = { dur: 13, enter() { motor(90, 160, 6, 0.1); }, draw(g, t) {
    // uscita dal garage e poi l'autostrada: scorre tutto verso sinistra, la Volvo sta quasi ferma
    sky(g); const sp = ease(t / 3) * 380, off = sp * t * 0.5;
    skyline(g, 215, 21, '#08080f', false);
    for (let i = 0; i < 40; i++) { const x = ((hash(i) * 1400 - off * 0.12) % 1400 + 1400) % 1400 - 380; if (x > -10 && x < W) R(g, x, 188 + hash(i + 8) * 24, 2, 2, hash(i + 3) > 0.5 ? '#ffcf7a' : '#ff6a4a'); }   // luci lontane
    R(g, 0, 232, W, 128, '#0d0e13'); R(g, 0, 232, W, 3, '#2a2a33');
    R(g, 0, 262, W, 98, '#121319'); for (let x = -((off) % 110) - 110; x < W; x += 110) R(g, x, 306, 58, 4, '#cfc7a8'); R(g, 0, 330, W, 3, '#cfc7a8'); R(g, 0, 262, W, 2, '#cfc7a8');   // strisce
    for (let x = -((off * 1.4) % 90) - 90; x < W; x += 90) { R(g, x, 226, 3, 22, '#3a3a44'); R(g, x - 4, 232, 30, 3, '#555563'); }                                   // guardrail
    const gx = 700 - (t - 4.2) * 300;                                                                                                                             // cartello a portale
    if (gx > -260 && gx < W + 20) { R(g, gx, 60, 240, 84, '#0b4a2a'); R(g, gx + 3, 63, 234, 78, '#0e5c34'); R(g, gx - 8, 60, 6, 220, '#2a2a33'); R(g, gx + 242, 60, 6, 220, '#2a2a33'); banner(g, 'AUTOSTRADA', gx + 120, 94, '#f2f2e6', 18); banner(g, 'SOLO AVANTI', gx + 120, 122, '#f2f2e6', 18); glow(g, gx + 120, 110, 160, 'rgba(160,255,200,A)', 0.12); }
    const vx = t < 3 ? lerp(-260, 130, ease(t / 3)) : 130 + Math.sin(t * 2) * 1.5, vy = 232 + (t < 3 ? 0 : Math.sin(t * 9) * 0.6);
    glow(g, vx + 100, 322, 120, 'rgba(0,0,0,A)', 0.5);
    beam(g, vx + 196, 288, 240, 0.4); g.drawImage(IMG.v40, Math.round(vx), Math.round(vy)); R(g, vx + 2, 258, 4, 3, '#ff3a2a');
    glow(g, vx + 198, 289, 50, 'rgba(255,240,190,A)', 0.4);
    const fade = clamp((t - 9.5) / 1.5, 0, 1); if (fade > 0) { R(g, 0, 0, W, H, `rgba(0,0,0,${fade})`); if (t > 10.5) { g.globalAlpha = clamp((t - 10.5) / 1, 0, 1); g.font = '44px "Saira Stencil One", "Russo One", Impact, sans-serif'; g.fillStyle = '#f0e6d2'; g.textAlign = 'center'; g.fillText('NIGHT RUN', W / 2, 190); g.font = '12px "Share Tech Mono", monospace'; g.fillStyle = '#ffb347'; g.fillText('km 0', W / 2, 216); g.textAlign = 'left'; g.globalAlpha = 1; } }
  } };
  const ORDER = ['lettera', 'arrivo', 'studio', 'garage', 'strada'];

  // ------------------------------------------------------------ sipario (HTML sopra la tela)
  const CSS = `
.pro{position:fixed;inset:0;z-index:95;background:#000;display:grid;place-items:center;font:16px/1.5 "Barlow Semi Condensed",system-ui,sans-serif;color:#f0e6d2;user-select:none;-webkit-user-select:none;cursor:pointer;overflow:hidden;transition:opacity .8s}
.pro.out{opacity:0}
.pro canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;image-rendering:pixelated;background:#000}
.pro .skip{position:absolute;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:3;border:0;background:rgba(10,9,7,.7);color:#a8936a;font:600 12px "Share Tech Mono",monospace;letter-spacing:.1em;padding:8px 12px;cursor:pointer;box-shadow:inset 0 0 0 1px #3a342a}
.pro .skip:hover{color:#ffb347}
.pro .hint{position:absolute;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));text-align:center;font:12px "Share Tech Mono",monospace;letter-spacing:.12em;color:#a8936acc;z-index:2;animation:pr 1.6s ease-in-out infinite}
@keyframes pr{50%{opacity:.35}}
.pro .letter{position:relative;z-index:2;width:min(520px,calc(100% - 32px));background:#e9e0c8;color:#2a2418;padding:28px 30px 30px;box-shadow:0 20px 50px #000c,inset 0 0 40px rgba(120,90,40,.25);transform:rotate(-1.2deg);font:17px/1.55 "Special Elite","Courier New",monospace;white-space:pre-wrap}
.pro .letter b{display:block;font-size:15px;letter-spacing:.14em}
.pro .dlg{position:absolute;z-index:2;left:50%;bottom:max(46px,calc(env(safe-area-inset-bottom) + 30px));transform:translateX(-50%);width:min(640px,calc(100% - 28px));background:linear-gradient(180deg,rgba(30,27,22,.96),rgba(12,11,9,.96));padding:14px 18px 16px;box-shadow:inset 0 0 0 1px #4a4234,inset 0 2px 0 #ffb347,0 18px 40px #000a}
.pro .dlg h4{margin:0 0 4px;font:400 14px "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#ffb347}
.pro .dlg p{margin:0;font-size:18px;color:#f7e6c8;min-height:3.2em}
.pro .cars{position:absolute;z-index:2;inset:0;display:grid;grid-template-columns:repeat(3,minmax(0,200px));grid-auto-rows:min-content;gap:14px;justify-content:center;align-content:center;padding:40px 16px 110px}
.pro .car{background:rgba(14,13,11,.88);box-shadow:inset 0 0 0 1px #3a342a;padding:8px;display:grid;gap:5px;justify-items:center;cursor:default;min-width:0;transition:box-shadow .2s,transform .2s}
.pro .car canvas{position:static;width:100%;height:auto;aspect-ratio:200/90;object-fit:contain;background:transparent}
.pro .car b{font:400 13px "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#a8936a}
.pro .car.ok{cursor:pointer;box-shadow:inset 0 0 0 2px #ffb347,0 0 24px rgba(255,179,71,.35)}.pro .car.ok b{color:#ffb347}.pro .car.ok:hover{transform:translateY(-3px)}
.pro .car.no{opacity:.65}
.pro .shake{animation:sh .3s}@keyframes sh{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@media (max-width:560px){.pro .cars{grid-template-columns:repeat(2,minmax(0,160px))}.pro .letter{font-size:15px;padding:20px}}
@media (prefers-reduced-motion:reduce){.pro .hint{animation:none}}`;

  let root = null, cv = null, g = null, raf = 0, T0 = 0, cur = -1, done = false, opts = {}, typer = 0, lineI = 0, canNext = false, pickLocked = false;
  const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
  const clearUI = () => { clearInterval(typer); for (const n of [...root.querySelectorAll('.letter,.dlg,.cars,.hint')]) n.remove(); };
  const hint = (t) => root.appendChild(el(`<div class="hint">${t}</div>`));

  function type(node, text, cb) {      // macchina da scrivere: tocca di nuovo per finire subito
    clearInterval(typer); let i = 0; node.textContent = ''; canNext = false;
    typer = setInterval(() => { i += 2; node.textContent = text.slice(0, i); if (i >= text.length) { clearInterval(typer); node.textContent = text; canNext = true; cb && cb(); } }, 28);
    node._finish = () => { clearInterval(typer); node.textContent = text; canNext = true; cb && cb(); };
  }

  function enterScene(i) {
    cur = i; const name = ORDER[i], sc = SC[name]; T0 = performance.now(); clearUI(); lineI = 0; canNext = false;
    if (sc.enter) sc.enter();
    if (name === 'lettera') {
      const L = el('<div class="letter"></div>'); root.appendChild(L); type(L, PRO_LETTERA.join('\n'), () => hint('CLIC PER CONTINUARE'));
      // la prima riga in grassetto resta uguale: lo stile si dà con il testo intero, quindi niente HTML dentro
    } else if (name === 'studio') speak(0);
    else if (name === 'garage') showCars();
  }
  function speak(n) {
    clearUI(); lineI = n;
    const d = el('<div class="dlg"><h4>Il notaio</h4><p></p></div>'); root.appendChild(d); type(d.querySelector('p'), PRO_NOTAIO[n], () => hint(n < PRO_NOTAIO.length - 1 ? 'CLIC PER CONTINUARE' : 'CLIC PER SCEGLIERE L\'AUTO'));
  }
  function carThumb(c, a) {
    const k = c.getContext('2d'); c.width = 200; c.height = 90; k.imageSmoothingEnabled = false; R(k, 0, 0, 200, 90, 'rgba(0,0,0,0)');
    if (a.ok) { glow(k, 100, 70, 90, 'rgba(255,230,170,A)', 0.2); k.drawImage(IMG.v40, 0, 8, 200, 71); }
    else {      // un'auto sotto il telo: gobba grigia con le pieghe
      k.fillStyle = '#3a3d48'; k.beginPath(); k.moveTo(10, 78); k.quadraticCurveTo(14, 40, 60, 34); k.quadraticCurveTo(100, 16, 140, 34); k.quadraticCurveTo(186, 42, 192, 78); k.closePath(); k.fill();
      k.strokeStyle = '#2a2c35'; k.lineWidth = 2; for (let i = 0; i < 6; i++) { k.beginPath(); k.moveTo(30 + i * 26, 76); k.quadraticCurveTo(34 + i * 26, 52, 40 + i * 24, 30 + (i % 3) * 3); k.stroke(); }
      R(k, 40, 78, 24, 8, '#0c0d11'); R(k, 140, 78, 24, 8, '#0c0d11'); k.font = '28px "Saira Stencil One", Impact, sans-serif'; k.fillStyle = 'rgba(240,230,210,.25)'; k.textAlign = 'center'; k.fillText('?', 100, 62);
    }
  }
  function showCars() {
    const box = el('<div class="cars"></div>');
    PRO_AUTO.forEach((a, i) => { const c = el(`<div class="car ${a.ok ? 'ok' : 'no'}" data-i="${i}"><canvas></canvas><b>${a.nome}</b></div>`); carThumb(c.querySelector('canvas'), a); box.appendChild(c); });
    root.appendChild(box); const d = el('<div class="dlg"><h4>Il notaio</h4><p></p></div>'); root.appendChild(d); type(d.querySelector('p'), 'Sei auto. Una sola, stasera.');
  }
  function pick(i, node) {
    const a = PRO_AUTO[i]; if (pickLocked) return;
    if (!a.ok) { node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake'); thump(0.1); const p = root.querySelector('.dlg p'); if (p) type(p, 'Quella no. Non ancora.'); return; }
    pickLocked = true; thump(0.2); const p = root.querySelector('.dlg p'); type(p, 'Le chiavi sono nel cruscotto. Come sempre. Buona strada.', () => setTimeout(() => go(cur + 1), 1500));
  }

  // clic / Invio / Spazio: va avanti dove ha senso
  function advance() {
    if (done) return; const name = ORDER[cur], d = root.querySelector('.letter,.dlg p');
    if (!canNext && d && d._finish) { d._finish(); return; }
    if (name === 'lettera') go(1);
    else if (name === 'arrivo') go(2);
    else if (name === 'studio') { if (lineI < PRO_NOTAIO.length - 1) speak(lineI + 1); else go(3); }
  }
  function go(i) { if (i >= ORDER.length) return finish(); enterScene(i); }
  function frame(now) {
    if (done) return; raf = requestAnimationFrame(frame);
    const t = (now - T0) / 1000, sc = SC[ORDER[cur]]; if (!sc) return;
    g.imageSmoothingEnabled = false; sc.draw(g, t);
    if (sc.dur && t >= sc.dur) go(cur + 1);
  }
  function finish() {
    if (done) return; done = true; cancelAnimationFrame(raf); clearInterval(typer); root.classList.add('out');
    window.removeEventListener('keydown', keys, true); const cb = opts.onDone;
    setTimeout(() => { root.remove(); root = null; if (cb) cb(); }, 800);
  }
  function keys(e) {
    if (!root) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); finish(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); advance(); }
    else e.stopImmediatePropagation();                // durante il prologo i tasti del gioco non fanno niente
  }

  async function play(o = {}) {
    if (root) return; opts = o; done = false; pickLocked = false; await prepare();
    actx = (typeof o.ctx === 'function' ? o.ctx() : o.ctx) || null;
    if (!document.getElementById('proCss')) { const s = document.createElement('style'); s.id = 'proCss'; s.textContent = CSS; document.head.appendChild(s); }
    root = el('<div class="pro" role="dialog" aria-label="Prologo"><canvas></canvas><button type="button" class="skip">SALTA ›</button></div>');
    document.body.appendChild(root); cv = root.querySelector('canvas'); cv.width = W; cv.height = H; g = cv.getContext('2d');
    root.addEventListener('click', (e) => {
      if (e.target.closest('.skip')) { finish(); return; }
      const car = e.target.closest('.car'); if (car) { pick(+car.dataset.i, car); return; }
      if (!e.target.closest('.cars')) advance();
    });
    window.addEventListener('keydown', keys, true);
    enterScene(0); raf = requestAnimationFrame(frame);
  }

  window.NightPrologo = { play, shouldPlay: (game) => proShould(game && game.s), jump: (n) => { if (root) enterScene(n); }, get playing() { return !!root; }, finish };
})();
if (typeof window !== 'undefined') Object.assign(window, { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, proShould });
