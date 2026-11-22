// ============================================================================
//  Night Run · Meteo nuovo: nebbia, neve, vento (dopo vita2d.js; la pioggia resta quella di street2d.js)
//  - nebbia: un velo grigio-azzurro (di giorno chiaro) che mangia il fondo e la strada lontana, banchi che scorrono,
//    i fari e i lampioni che si vedono nell'aria;
//  - neve: fiocchi che cadono e girano (veloci verso sinistra quanto vai forte), bordi della strada e marciapiede
//    bianchi, aderenza giù del 38 % (sim.wet 1,4: la pioggia è 1);
//  - vento: polvere o sabbia che corre (nel deserto color sabbia), velo caldo, raffiche laterali che spostano l'auto
//    (sbandate solo nel disegno: corsie e urti non cambiano) e un fruscio sintetizzato.
//  Scelta: menu Impostazioni → Grafica → Meteo (o tasto K): dinamico, sereno, pioggia, nebbia, neve, vento. In
//  «dinamico» arrivano da sole secondo il paesaggio E l'ora (22/11, decisioni di Nico): nebbia all'alba e la sera in
//  pianura, nei paesi e anche in città, di notte solo ogni tanto e nei momenti horror (incursioni, cose strane); neve in
//  montagna e a volte in città e in pianura, più facile di notte; vento soprattutto di pomeriggio. Mai con la pioggia.
//  Il vento entra nella fisica (sim.windV contro/a favore, sim.windX di traverso: velocità massima e consumi cambiano). index.html chiama NightMeteo.apply(scelta) e
//  NightMeteo.tick(dt, info) dentro tickAtmosphere. Si disegna agganciato a Street2D.drawComics (dopo vitaFront).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const P = Street2D.prototype, rnd = Street2D.rnd;
  const KINDS = { nebbia: 'nebbia', neve: 'neve', vento: 'vento' };
  const M = { kind: null, forced: false, k: 0, timer: 40 + Math.random() * 60, gust: 0, gustT: 4, gustV: 0, snd: null };
  const say = (t) => { const g = window.nightRun && window.nightRun.game; if (g && g.say) g.say(t, 'info'); };
  const MSG = {
    nebbia: ['Banco di nebbia: si vede poco, occhio a chi frena davanti', 'La nebbia si dirada'],
    neve: ['Nevica: strada bianca, frena prima e piano', 'Smette di nevicare'],
    vento: ['Vento forte: raffiche laterali, tieni il volante', 'Il vento cala'],
  };
  function start(kind, quiet) { if (M.kind === kind) return; if (M.kind && !quiet) say(MSG[M.kind][1]); M.kind = kind; if (kind && !quiet) say(MSG[kind][0]); }
  function stop(quiet) { if (!M.kind) return; if (!quiet) say(MSG[M.kind][1]); M.kind = null; }

  // la scelta del giocatore (dal menu o dal tasto K): sereno/pioggia/dinamico spengono quello forzato
  function apply(scelta) {
    if (KINDS[scelta]) { M.forced = true; start(scelta, true); M.k = Math.max(M.k, 0.35); }
    else { if (M.forced) stop(true); M.forced = false; if (scelta === 'sereno') stop(true); }
  }
  // probabilità di ogni tempo per paesaggio e ora (0-24): nebbia all'alba (5-9) e la sera (18-22), di notte (22-5) solo
  // ogni tanto (il resto lo fanno i momenti horror); neve più facile di notte e fuori dalla montagna rara; vento di giorno,
  // soprattutto di pomeriggio. Pura: provata in test/meteo.test.js
  function meteoPesi(bg, hour) {
    const h = ((hour % 24) + 24) % 24, alba = h >= 5 && h < 9, sera = h >= 18 && h < 22, notte = h >= 22 || h < 5, pom = h >= 12 && h < 18;
    const neb = alba ? 1.4 : sera ? 1 : notte ? 0.25 : 0.4, nev = notte ? 1.3 : alba ? 1.1 : 0.7, ven = pom ? 1.4 : notte ? 0.5 : 1;
    const base = { plain: { nebbia: 0.45, neve: 0.06, vento: 0.1 }, village: { nebbia: 0.4, neve: 0.08, vento: 0.06 }, mountain: { neve: 0.55, nebbia: 0.2, vento: 0.08 },
      desert: { vento: 0.55 }, highway: { vento: 0.22, nebbia: 0.18, neve: 0.04 }, city: { nebbia: 0.22, neve: 0.1, vento: 0.06 }, sea: { vento: 0.3, nebbia: 0.15 } }[bg] || {};
    const k = { nebbia: neb, neve: nev, vento: ven }, out = [];
    for (const t of ['nebbia', 'neve', 'vento']) if (base[t]) out.push([t, Math.min(0.75, base[t] * k[t])]);
    const tot = out.reduce((a, x) => a + x[1], 0);
    return tot > 0.85 ? out.map(([t, w]) => [t, w * 0.85 / tot]) : out;
  }
  // nebbia horror: di notte, durante un'incursione della storia o subito dopo una cosa strana (una volta su due), sale la
  // nebbia e se ne va qualche minuto dopo
  function horrorFog(dt, info) {
    const g = window.nightRun && window.nightRun.game, vg = g && g.s && g.s.vg;
    if (!vg || (info.hour != null && info.hour >= 6 && info.hour < 20)) { M.odd0 = vg ? vg.oddCount : 0; return; }
    const att = !!(vg.story && vg.story.att), odd = (vg.oddCount || 0) > (M.odd0 ?? (vg.oddCount || 0));
    M.odd0 = vg.oddCount || 0;
    if ((att || (odd && Math.random() < 0.5)) && M.kind !== 'nebbia') { start('nebbia', true); M.horror = true; M.timer = 120 + Math.random() * 90; }
    if (M.horror && M.kind !== 'nebbia') M.horror = false;
  }
  // ogni fotogramma (da tickAtmosphere): info = { auto, rain, bg, vol, hour }
  function tick(dt, info) {
    const sim = window.nightRun && window.nightRun.sim, game = window.nightRun && window.nightRun.game;
    if (!M.forced && info.auto) {
      if (info.rain && M.kind) stop(true);                               // con la pioggia niente nebbia, neve o vento
      else if (!info.rain) {
        // fuori dal suo paesaggio la neve smette (la nebbia e il vento possono seguirti un po')
        if (M.kind === 'neve' && (info.bg === 'desert' || info.bg === 'sea')) stop();   // nel deserto e al mare la neve smette
        horrorFog(dt, info);
        if ((M.timer -= dt) <= 0) {
          if (M.kind) { stop(); M.timer = 90 + Math.random() * 120; }
          else {
            const p = meteoPesi(info.bg, info.hour ?? 22);
            let r = Math.random(), pick = null; for (const [k, w] of p) { if (r < w) { pick = k; break; } r -= w; }
            if (pick) { start(pick); M.timer = 60 + Math.random() * 90; } else M.timer = 50 + Math.random() * 60;
          }
        }
      }
    }
    M.k += ((M.kind ? 1 : 0) - M.k) * Math.min(1, dt / 6);                // entra ed esce in qualche secondo
    if (M.k < 0.002 && !M.kind) M.k = 0;
    M.shown = M.kind || (M.k > 0.01 ? M.shown : null);
    // neve: asfalto che non tiene (la pioggia lo mette a 1, la neve a 1,4)
    if (sim) {
      if (M.shown === 'neve') sim.wet = Math.max(info.rain ? 1 : 0, 1.4 * M.k);
      else if (M._snowWas) sim.wet = info.rain ? 1 : 0;
      M._snowWas = M.shown === 'neve';
    }
    // vento: raffiche che spingono l'auto di lato (sopra i 50 km/h), poi il guidatore la riporta in corsia
    const windK = M.shown === 'vento' ? M.k : 0;
    if ((M.gustT -= dt) <= 0) { M.gustT = 2.5 + Math.random() * 5; M.gustV = windK * (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7); }
    M.gust += (M.gustV - M.gust) * Math.min(1, dt * 1.2); M.gustV *= Math.pow(0.7, dt);   // la raffica arriva in un attimo e cala in qualche secondo
    // il vento nella fisica: ogni episodio ha la sua direzione (contro o a favore della marcia), le raffiche lo rinforzano
    if (windK > 0.02 && M.windDir == null) M.windDir = Math.random() < 0.6 ? 1 : -1;
    if (!windK) M.windDir = null;
    if (sim) { sim.windV = windK ? windK * (M.windDir || 1) * (7 + 6 * Math.abs(M.gust)) : 0; sim.windX = windK ? windK * (10 + 14 * Math.abs(M.gust)) : 0; }
    M.sway = game && sim && windK > 0.05 && !game.inside && !game.ap ? M.gust * 0.9 * Math.min(1, Math.max(0, (Math.abs(sim.v) - 8) / 20)) : 0;   // metri di sbandamento
    sound(windK * (0.6 + Math.abs(M.gust) * 0.35) * (info.vol ?? 0.8));   // fruscio: le raffiche si sentono, ma senza sbalzi
  }
  // fruscio del vento: rumore filtrato, più forte sulle raffiche
  function sound(level) {
    if (level < 0.01 && !M.snd) return;
    try {
      if (!M.snd) {
        const ac = new (window.AudioContext || window.webkitAudioContext)(), len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        let b = 0; for (let i = 0; i < len; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 4; }
        const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), gg = ac.createGain();
        src.buffer = buf; src.loop = true; bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.5; gg.gain.value = 0;
        const lpf = ac.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 1400;   // niente sibili: il vento si sente, non fischia
        src.connect(bp).connect(lpf).connect(gg).connect(ac.destination); src.start();
        M.snd = { ac, bp, gg };
      }
      const S = M.snd; if (S.ac.state !== 'running') S.ac.resume().catch(() => {});
      const t = S.ac.currentTime; S.gg.gain.setTargetAtTime(Math.min(0.04, level * 0.035), t, 0.8); S.bp.frequency.setTargetAtTime(340 + level * 260, t, 1.2);   // più basso e lento (22/11: «non fastidioso»)
    } catch (e) { /* senza audio va bene lo stesso */ }
  }

  // le raffiche si vedono: l'auto sbanda di lato e il guidatore la riporta (solo nel disegno: corsie, urti e traffico
  // restano dove sono)
  const up = P.update;
  P.update = function (dt, s, game) {
    const off = game && M.sway ? M.sway : 0;
    if (off) game.laneZ += off;
    try { return up.call(this, dt, s, game); } finally { if (off) game.laneZ -= off; }
  };
  // ---------------------------------------------------------------- disegno (sopra la scena, sotto le scritte)
  const dc = P.drawComics;
  P.drawComics = function (g, dt) {
    try { if (M.k > 0.01 && M.shown) draw.call(this, g, M.shown, M.k); } catch (e) { /* il meteo non deve mai rompere il disegno */ }
    return dc ? dc.call(this, g, dt) : undefined;
  };
  function draw(g, kind, k) {
    const W = this.LW, t = this.st.t, day = this.day || 0, night = 1 - day, v = Math.abs((window.nightRun && window.nightRun.sim && window.nightRun.sim.v) || 0);
    const lowQ = this.quality === 'bassa';
    g.save();
    if (kind === 'nebbia') {
      const col = day > 0.5 ? '205,210,218' : '120,132,156';
      // velo verticale: fitto sull'orizzonte e sulla strada lontana, più leggero vicino
      const gr = g.createLinearGradient(0, 40, 0, 360);
      gr.addColorStop(0, `rgba(${col},${0.35 * k})`); gr.addColorStop(0.45, `rgba(${col},${0.72 * k})`); gr.addColorStop(0.62, `rgba(${col},${0.5 * k})`); gr.addColorStop(1, `rgba(${col},${0.16 * k})`);
      g.fillStyle = gr; g.fillRect(0, 0, W, 360);
      // banchi che scorrono (più lenti in alto, più veloci in basso: sono più vicini)
      if (!lowQ) for (let i = 0; i < 7; i++) {
        const y = 120 + i * 32, sp = 6 + i * 3 + v * (0.3 + i * 0.25), w = 260 + rnd(i * 3.3) * 220, x = ((rnd(i * 7.1) * (W + w) - t * sp) % (W + w) + W + w) % (W + w) - w / 2;
        const bg = g.createRadialGradient(x, y, 4, x, y, w / 2); bg.addColorStop(0, `rgba(${col},${0.22 * k})`); bg.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = bg; g.save(); g.translate(x, y); g.scale(1, 0.22); g.translate(-x, -y); g.beginPath(); g.arc(x, y, w / 2, 0, 7); g.fill(); g.restore();
      }
      // di notte la luce si sparge nell'aria: un alone caldo intorno all'auto e davanti ai fari
      if (night > 0.3 && this.carPos) {
        const c = this.carPos; g.globalCompositeOperation = 'lighter';
        const hl = g.createRadialGradient(c.x + 90, c.y + 10, 6, c.x + 90, c.y + 10, 160); hl.addColorStop(0, `rgba(255,240,210,${0.16 * k * night})`); hl.addColorStop(1, 'rgba(255,240,210,0)');
        g.fillStyle = hl; g.fillRect(c.x - 80, c.y - 150, 400, 300);
      }
    } else if (kind === 'neve') {
      // velo freddo e bordi bianchi (marciapiede lontano, ciglio della strada, banchina vicina)
      g.fillStyle = `rgba(${day > 0.5 ? '230,236,245' : '150,165,195'},${0.14 * k})`; g.fillRect(0, 0, W, 360);
      { const hv = g.createLinearGradient(0, 110, 0, 216); hv.addColorStop(0, 'rgba(236,242,250,0)'); hv.addColorStop(1, `rgba(236,242,250,${0.3 * k})`); g.fillStyle = hv; g.fillRect(0, 110, W, 106); }   // colline imbiancate
      g.fillStyle = `rgba(236,242,250,${0.6 * k})`; g.fillRect(0, 216, W, 16); g.fillRect(0, 232, W, 3); g.fillRect(0, 334, W, 26);
      g.fillStyle = `rgba(236,242,250,${0.22 * k})`;
      for (let i = 0; i < 60; i++) { const x = ((rnd(i * 2.7) * W * 2 - (this.dist || 0) * 30) % W + W) % W; g.fillRect(Math.round(x), 236 + Math.round(rnd(i * 5.1) * 3), 6 + Math.round(rnd(i) * 14), 1); g.fillRect(Math.round(x * 1.3) % W, 330 - Math.round(rnd(i * 3.9) * 4), 8 + Math.round(rnd(i * 1.7) * 18), 1); }
      // i fiocchi: tre profondità, quelli vicini più grossi e veloci
      const n = lowQ ? 90 : 220;
      for (let i = 0; i < n; i++) {
        const depth = i % 3, sz = depth === 2 ? 3 : depth === 1 ? 2 : 1, fall = 18 + depth * 14 + rnd(i * 1.3) * 10, drift = v * (6 + depth * 10) + 8;
        const x = ((rnd(i * 3.1) * (W + 40) - t * drift + Math.sin(t * (0.6 + rnd(i) * 0.8) + i) * (6 + depth * 4)) % (W + 40) + W + 40) % (W + 40) - 20;
        const y = (rnd(i * 5.7) * 360 + t * fall) % 360;
        g.fillStyle = `rgba(255,255,255,${(0.6 + depth * 0.2) * k})`; g.fillRect(Math.round(x), Math.round(y), sz, sz); if (sz === 3) { g.fillStyle = `rgba(255,255,255,${0.25 * k})`; g.fillRect(Math.round(x) - 1, Math.round(y) + 1, 5, 1); g.fillRect(Math.round(x) + 1, Math.round(y) - 1, 1, 5); }
      }
    } else if (kind === 'vento') {
      const desert = (this._bg || '') === 'desert', col = desert ? '224,176,112' : day > 0.5 ? '200,196,186' : '120,118,130';
      if (desert) { g.fillStyle = `rgba(${col},${0.16 * k})`; g.fillRect(0, 0, W, 360); }   // il velo di sabbia solo nel deserto
      if (desert) { const dv = g.createLinearGradient(0, 150, 0, 360); dv.addColorStop(0, `rgba(${col},0)`); dv.addColorStop(0.45, `rgba(${col},${(desert ? 0.42 : 0.22) * k * (0.7 + 0.5 * Math.abs(M.gust))})`); dv.addColorStop(1, `rgba(${col},${(desert ? 0.18 : 0.1) * k})`); g.fillStyle = dv; g.fillRect(0, 150, W, 210); }   // polvere sollevata
      // strisce di polvere o sabbia che corrono, più fitte sulle raffiche
      const n = lowQ ? 40 : 110, gust = 0.6 + Math.abs(M.gust);
      for (let i = 0; i < n; i++) {
        const y = 150 + rnd(i * 2.3) * 210, len = 8 + rnd(i * 4.1) * 40 * gust, sp = 260 + rnd(i * 1.9) * 300 + v * 30;
        const x = ((rnd(i * 6.7) * (W + len) - t * sp) % (W + len) + W + len) % (W + len) - len;
        g.fillStyle = `rgba(${col},${(0.35 + rnd(i) * 0.4) * k * Math.min(1, gust)})`; g.fillRect(Math.round(x), Math.round(y + Math.sin(t * 3 + i) * 2), Math.round(len), i % 4 ? 1 : 2);
      }
      // granelli e foglie che rotolano basse sull'asfalto
      for (let i = 0; i < 18; i++) { const x = ((rnd(i * 9.1) * W * 1.5 - t * (180 + i * 9 + v * 30)) % W + W) % W, y = 300 + rnd(i * 2.2) * 50 - Math.abs(Math.sin(t * 6 + i)) * 6; g.fillStyle = `rgba(${desert ? '190,140,80' : '120,100,60'},${0.7 * k})`; g.fillRect(Math.round(x), Math.round(y), 2, 1); }
    }
    g.restore();
  }

  window.NightMeteo = { apply, tick, meteoPesi, get kind() { return M.kind; }, get k() { return M.k; }, get raffica() { return { gust: M.gust, sway: M.sway || 0 }; }, label: () => M.kind || '', start: (k) => { M.forced = false; start(k); }, stop: () => stop() };
})();
