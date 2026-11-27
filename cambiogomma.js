// ============================================================================
//  Night Run · Il cambio gomma con la ruota di scorta, fatto da te (dopo soccorso.js)
//  Tasto 9, «Usa» nel bagagliaio o avviso «Gomma a terra»: l'auto si sposta nella corsia di destra e si ferma
//  (`changeTyre` in viaggio.js, `ap.gomma`). Poi il protagonista scende, va al bagagliaio a prendere la scorta,
//  la porta alla ruota forata, si inginocchia: cric, bulloni, cambio, bulloni, giù. Torna al bagagliaio con la
//  gomma forata, la mette dentro, risale. Come il meccanico del soccorso, ma sei tu (`pgStanding` col tuo aspetto).
//  Tempi e punti in `CG`; la sequenza è pura (`cgTimeline`, `cgAt`) e provata in test/cambiogomma.test.js.
//  U durante il cambio lo accelera ×3 (e lo rimette normale).
// ============================================================================
const CG = {
  porta: 0.3,        // m dal centro dell'auto: dove scende (la portiera)
  baule: -2.1,       // m: il bagagliaio, dietro
  ruota: [1.4, 1.4, -1.5, -1.5],   // m: dove sta la ruota (anteriore sinistra, destra, posteriore sinistra, destra)
  walkV: 1.7,        // m/s a piedi
  scende: 0.78,       // s per scendere
  sale: 0.72,        // s per risalire
  prende: 0.9,       // s al bagagliaio per prendere la scorta
  posa: 0.7,         // s al bagagliaio per mettere dentro la forata
  lavoro: 6,         // s in ginocchio alla ruota
  fasi: [['crick', 0.22], ['svita', 0.2], ['cambio', 0.16], ['avvita', 0.24], ['giu', 0.18]],   // parti del lavoro (frazioni)
  fast: 3,           // con U
};

// la sequenza per la gomma i: [{ k, t0, t1, at | from,to, carry }]  (carry: 'scorta' | 'forata')
function cgTimeline(i) {
  const W = CG.ruota[i] ?? CG.ruota[0], segs = [], colpi = []; let t = 0;
  const lato = i % 2 === 1 ? 'vicino' : 'strada';
  const add = (o, d) => { segs.push(Object.assign(o, { t0: t, t1: t + d })); t += d; };
  const suono = (nome, ritardo) => colpi.push({ nome, t: t + ritardo });
  const walk = (from, to, lato, carry) => add({ k: 'walk', from, to, lato, carry }, Math.abs(to - from) / CG.walkV);
  suono('porta', 0.14); add({ k: 'out', at: CG.porta }, CG.scende);
  walk(CG.porta, CG.baule, 'strada');
  suono('baule', 0.15); add({ k: 'baule', at: CG.baule, carry: 'scorta' }, CG.prende);
  walk(CG.baule, W, lato, 'scorta');
  let da = 0;
  for (const [nome, frazione] of CG.fasi) {
    const durata = CG.lavoro * frazione;
    const battute = nome === 'cambio' ? [0.78] : [0.27, 0.53, 0.79];
    for (const beat of battute) suono(nome, da + beat * durata);
    da += durata;
  }
  add({ k: 'lavoro', at: W, lato }, CG.lavoro);
  walk(W, CG.baule, lato, 'forata');
  suono('baule', 0.54); add({ k: 'posa', at: CG.baule, carry: 'forata' }, CG.posa);
  walk(CG.baule, CG.porta, 'strada');
  suono('porta', 0.59); add({ k: 'in', at: CG.porta }, CG.sale);
  return { segs, colpi, end: t, ruota: W };
}
const cgDur = (i) => cgTimeline(i).end;
const cgEase = (u) => u * u * (3 - 2 * u);

// Posa e profondità del protagonista al secondo t. Fuori dalla sequenza restituisce null.
function cgAt(TL, t) {
  if (!TL || t < 0 || t >= TL.end) return null;
  const g = TL.segs.find((q) => t >= q.t0 && t < q.t1) || TL.segs[TL.segs.length - 1];
  const u = Math.max(0, Math.min(1, (t - g.t0) / Math.max(1e-3, g.t1 - g.t0)));
  if (g.k === 'walk') {
    const e = cgEase(u), x = g.from + (g.to - g.from) * e;
    const curva = Math.max(0, Math.min(1, (x - CG.baule) / 0.45));
    return { k: 'walk', x, lato: g.lato, z: (g.lato === 'strada' ? -1 : 1) * cgEase(curva), dir: Math.sign(g.to - g.from),
      walk: true, ph: Math.abs(g.to - g.from) * e / 1.1, carry: g.carry || null, u };
  }
  if (g.k === 'out' || g.k === 'in') {
    const ingresso = cgEase(g.k === 'out' ? u : 1 - u);
    return { k: g.k, x: g.at - ingresso * 0.26, lato: 'strada', z: -ingresso, dir: g.k === 'out' ? -1 : 1, ingresso, u };
  }
  if (g.k === 'lavoro') {
    let acc = 0, fase = CG.fasi[CG.fasi.length - 1][0], fu = 1;
    for (const [nome, f] of CG.fasi) { if (u < acc + f) { fase = nome; fu = (u - acc) / f; break; } acc += f; }
    const lift = fase === 'crick' ? cgEase(fu) : fase === 'giu' ? 1 - cgEase(fu) : 1;
    return { k: 'lavoro', x: g.at, lato: g.lato, z: g.lato === 'strada' ? -1 : 1, dir: 1, kneel: true,
      fase, fu, lift, smontata: fase === 'cambio' && fu >= 0.18 && fu < 0.79, u };
  }
  return { k: g.k, x: g.at, lato: 'baule', z: 0, dir: 1, carry: g.k === 'baule' ? (u > 0.48 ? 'scorta' : null) : (u < 0.55 ? 'forata' : null), u };
}

if (typeof window !== 'undefined') Object.assign(window, { CG, cgTimeline, cgAt, cgDur });
if (typeof module !== 'undefined') module.exports = { CG, cgTimeline, cgAt, cgDur };

// Piccoli colpi filtrati di portiera, attrezzi e ruota, sul volume generale del gioco.
const cgTimbri = { porta: [275, 0.12, 0.2], baule: [430, 0.10, 0.16], crick: [1250, 0.07, 0.15],
  svita: [1870, 0.055, 0.13], avvita: [2330, 0.06, 0.15], cambio: [190, 0.11, 0.2], giu: [970, 0.065, 0.10] };
let cgNoise;
function cgAudio(audio, nome, vol, muto) {
  const ctx = audio?.ctx, timbro = cgTimbri[nome];
  if (muto || vol <= 0 || !timbro || ctx?.state !== 'running') return;
  if (!cgNoise || cgNoise.sampleRate !== ctx.sampleRate) {
    cgNoise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.13), ctx.sampleRate);
    const data = cgNoise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const [frequenza, durata, forza] = timbro, t = ctx.currentTime;
  const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), amp = ctx.createGain();
  source.buffer = cgNoise; filter.type = 'bandpass'; filter.frequency.value = frequenza; filter.Q.value = frequenza > 800 ? 2.5 : 0.85;
  amp.gain.setValueAtTime(forza * vol, t); amp.gain.exponentialRampToValueAtTime(0.0001, t + durata);
  source.connect(filter); filter.connect(amp); amp.connect(audio.comp || ctx.destination);
  source.onended = () => { source.disconnect(); filter.disconnect(); amp.disconnect(); };
  source.start(t, 0, durata);
}

// ---------------------------------------------------------------- la scena sulla strada (solo nel browser)
(function cgScena() {
  if (typeof Street2D === 'undefined' || typeof document === 'undefined') return;
  const P = Street2D.prototype;
  const ink = '#10121c';
  const label = {
    out: 'SCENDI DAL LATO STRADA', baule: 'PRENDI LA RUOTA DI SCORTA', posa: 'RIPONI LA GOMMA FORATA', in: 'RISALI IN AUTO',
    crick: 'ALZI L AUTO', svita: 'SVITI I BULLONI', cambio: 'MONTI LA RUOTA DI SCORTA', avvita: 'STRINGI I BULLONI', giu: 'ABBASSI L AUTO',
  };
  const blend = (a, b, u) => a + (b - a) * u;

  function ruota(g, x, y, r, piatta, forata) {
    const ry = piatta ? r * 0.34 : r * (forata ? 0.84 : 1);
    for (const [col, f] of [[ink, 1.13], ['#292e38', 1], ['#4b5260', 0.78], ['#abb5c6', 0.57], ['#3b4352', 0.28]]) {
      g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r * f, ry * f, 0, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#d2dbea';
    g.fillRect(Math.round(x - 1), Math.round(y - ry * 0.48), 2, 1);
  }

  P.cgStart = function (G) { return G && G.go ? cgAt(G.tl, G.t) : null; };

  // Il disegno della strada chiama i due piani ai lati della carrozzeria: lo sprite copre davvero il lato lontano.
  P.cgDraw = function (g, m, c, dietro) {
    const far = m.lato === 'strada' && (m.k !== 'walk' || m.z < -0.13);
    if (far !== dietro) return;
    const { rear, front, left, ground, door, scale, radius, wheel, hubY } = c;
    const trunk = left - scale * 16;
    const depth = m.z * (far ? 28 : 13) * scale;
    let px = m.x < CG.ruota[2]
      ? blend(trunk, rear, (m.x - CG.baule) / (CG.ruota[2] - CG.baule))
      : blend(rear, front, (m.x - CG.ruota[2]) / (CG.ruota[0] - CG.ruota[2]));
    let py = ground + depth, pose, ph = m.ph || 0;
    const work = m.k === 'lavoro', tool = ['crick', 'svita', 'avvita', 'giu'].includes(m.fase);
    if (m.ingresso != null) {
      px = door - 8 * scale * m.ingresso;
      py -= 11 * scale * (1 - m.ingresso);
      ph = m.ingresso * 0.48;
    }

    g.save();
    if (work) {
      const jack = wheel + (wheel === front ? -1 : 1) * radius * 1.04;
      const tip = py - 4 - m.lift * radius * 0.42, base = py - 1;
      g.fillStyle = ink; g.fillRect(Math.round(jack - 10), Math.round(base - 2), 20, 4);
      g.fillStyle = '#cf4541'; g.fillRect(Math.round(jack - 8), Math.round(base - 2), 16, 2);
      g.strokeStyle = '#b4a7a1'; g.lineWidth = 1.35; g.beginPath();
      g.moveTo(jack - 6, base - 2); g.lineTo(jack + 3, tip); g.lineTo(jack + 6, base - 2);
      g.moveTo(jack - 5, base - 2); g.lineTo(jack - 2, tip); g.lineTo(jack + 5, base - 2); g.stroke();
      g.fillStyle = '#d88974'; g.fillRect(Math.round(jack - 4), Math.round(tip - 2), 8, 2);
      px = wheel - radius * 1.12;
      pose = 'tyreWork'; ph = m.fu * (tool ? 3 : 1);
      if (m.fase !== 'crick' && m.fase !== 'svita') {
        const moved = cgEase(Math.min(1, Math.max(0, (m.fu - 0.18) / 0.35)));
        const x = wheel - radius * 2.3, y = py - radius * 0.34;
        if (m.fase === 'cambio' && m.fu >= 0.18 && moved < 1) ruota(g, blend(wheel, x, moved), blend(hubY, y, moved), radius * 0.80, false, true);
        else if (m.fase !== 'cambio' || moved >= 1) ruota(g, x, y, radius * 0.80, true, true);
      }
    }
    if (m.carry) {
      pose = 'tyreCarry';
      if (m.walk) px -= radius * 1.12 * cgEase(Math.max(0, 1 - Math.abs(m.x - (wheel === front ? CG.ruota[0] : CG.ruota[2])) / 0.5));
    }
    px = Math.round(px); py = Math.round(py);
    const r = radius * 0.78;
    if (m.ingresso == null || m.ingresso > 0.64) this.shadow(g, px, py + 1, 12 * scale, 2);
    g.save();
    if (m.dir < 0) { g.translate(px * 2, 0); g.scale(-1, 1); }
    const look = window.NightPG ? NightPG.now() : null;
    pgStanding(g, px, py, scale * 0.48, ph, m.walk || m.ingresso != null, look, 0.23, this.st.t, pose);
    g.restore();
    if (m.carry) {
      const pick = m.k === 'baule' ? cgEase((m.u - 0.48) / 0.52) : m.k === 'posa' ? cgEase(1 - m.u / 0.55) : 1;
      ruota(g, px + m.dir * 12 * scale, py - scale * (18 + 5 * pick) + Math.sin(ph * Math.PI * 2) * scale, r, false, m.carry === 'forata');
    }
    if (work && tool) {
      const bolt = m.fase === 'svita' || m.fase === 'avvita';
      const tx = bolt ? wheel : wheel - radius * 0.6;
      const ty = bolt ? hubY : py - 3;
      const sweep = (0.5 - 0.5 * Math.cos(ph * Math.PI * 2)) * radius * 0.62;
      g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx - radius * 0.95, ty - 5 - sweep); g.stroke();
      g.strokeStyle = '#d0d9e5'; g.lineWidth = 1.3; g.stroke();
    }
    if (work && m.fase === 'cambio' && m.fu > 0.49 && m.fu < 0.79) {
      const take = cgEase((m.fu - 0.49) / 0.30);
      ruota(g, blend(px + radius * 0.2, wheel, take), blend(py - r, hubY, take), r, false, false);
    }
    g.restore();
  };

  P.cgStatus = function (g, m, center, y) {
    const text = label[m.fase || m.k] || (m.carry === 'scorta' ? 'PORTI LA RUOTA DI SCORTA' : m.carry === 'forata' ? 'RIPORTI LA GOMMA FORATA' : 'CAMBIO GOMMA');
    const w = this.textW(text, 1), left = Math.round(center - w / 2 - 10);
    g.fillStyle = 'rgba(9,13,22,.91)'; g.fillRect(left, y, w + 20, 14);
    g.fillStyle = '#eaa652'; g.fillRect(left, y + 13, Math.round((w + 20) * m.u), 1);
    this.text(g, text, left + 10, y + 4, '#fff0d3', 1);
  };
})();

// ---------------------------------------------------------------- U accelera (solo nel browser)
(function cgTasti() {
  if (typeof window === 'undefined') return;
  window.addEventListener('keydown', (e) => {
    const g = window.nightRun && window.nightRun.game, G = g && g.ap && g.ap.gomma;
    if (!G || e.repeat || (e.key !== 'u' && e.key !== 'U')) return;
    e.preventDefault(); e.stopImmediatePropagation(); G.fast = G.fast > 1 ? 1 : CG.fast;
    if (g.say) g.say(G.fast > 1 ? 'Cambio gomma accelerato ×' + CG.fast : 'Cambio gomma a velocità normale', 'info');
  }, true);
})();
