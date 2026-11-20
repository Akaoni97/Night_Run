// ============================================================================
//  Night Run · Il Viaggio nel 3D (caricato con street3d.js da carica3d() in index.html)
//  Non cambia street3d.js: lo avvolge. Tre cose:
//  1. I LOCALI del Viaggio (bar, benzinaio, autogrill, motel, Niko, Luca, Neon, autosalone, sfascio): la stessa facciata
//     del 2D (Street2D.drawTripPlace, locali2d.js) disegnata su una tela e messa in piedi sul marciapiede dalla parte della
//     lontano, quello di fronte alla telecamera (dalla parte della corsia 0 la telecamera ci starebbe dentro), con un volume
//     scuro dietro. Il locale vicino si ridisegna 4 volte al secondo (neon che sfarfallano,
//     porte che si aprono). Come nel 2D, la facciata si legge nel senso di marcia (+x).
//  2. I PAESAGGI del Viaggio (VG.locAt → GAME_LOCS.bg): pianura, borgo, deserto, mare, montagna, autostrada sopraelevata.
//     Fuori città spariscono i palazzi e il fondale dei grattacieli, compaiono terreno, alberi, case, colline e il resto.
//  3. LE LUCI: aloni dei lampioni e dei distributori più piccoli e colorati (prima erano macchie bianche), cono di luce
//     sotto ogni lampione nell'aria, nebbia del colore del paesaggio.
// ============================================================================
(function () {
  if (typeof Street3D === 'undefined' || typeof VG === 'undefined') return;
  const P = Street3D.prototype, PX = 20, FZ = -8.25;           // 20 pixel del 2D = 1 metro; facciata a z −8,25: il marciapiede di fronte alla telecamera (come in fondo al 2D)
  const CROP = { l: 158, r: 232, top: 30, gy: 216 };          // tela: da x−158 a x+232 (a sinistra c'è l'auto VENDESI), da y 30 a 216
  const R = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const BGS = ['plain', 'village', 'desert', 'sea', 'mountain', 'highway'];

  // ---------------------------------------------------------------- 1. i locali
  P.v3Facade = function (st, e) {
    const T = this.T, view = window.nightRun && window.nightRun.view2d; if (!view || !view.drawTripPlace) return null;
    const W = CROP.l + CROP.r, H = CROP.gy - CROP.top, K = 2;
    const c = document.createElement('canvas'); c.width = W * K; c.height = H * K;
    const draw = () => {
      const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
      g.setTransform(K, 0, 0, K, 0, -CROP.top * K); g.imageSmoothingEnabled = false;
      try { view.drawTripPlace(g, e, CROP.l, { t: this.t || 0 }, false, st.open || 0); } catch (err) { /* una facciata che non si disegna non ferma il 3D */ }
      g.setTransform(1, 0, 0, 1, 0, 0);
    };
    draw();
    // il corpo dell'edificio: colonne piene alla base e altezza al centro (per il volume dietro)
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, rowY = (CROP.gy - 12 - CROP.top) * K, a = (x, y) => d[(y * c.width + x) * 4 + 3];
    let l = CROP.l * K, r = CROP.l * K; while (l > 0 && a(l - 1, rowY) > 200) l--; while (r < c.width - 1 && a(r + 1, rowY) > 200) r++;
    let top = 0; const cx = Math.round((l + r) / 2); while (top < rowY && a(cx, top) < 200) top++;
    const tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; tex.magFilter = T.NearestFilter; tex.anisotropy = 4;
    const g = new T.Group();
    const plane = new T.Mesh(new T.PlaneGeometry(W / PX, H / PX), new T.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, toneMapped: false, side: T.FrontSide }));
    plane.position.set((W / 2 - CROP.l) / PX, H / PX / 2 + 0.16, 0); g.add(plane);       // guarda la strada (+z)
    const bw = (r - l) / K / PX, bh = (rowY - top) / K / PX + 12 / PX, bx = ((l + r) / 2 / K - CROP.l) / PX;
    if (bw > 2 && bh > 1) {
      const box = new T.Mesh(new T.BoxGeometry(bw, bh, 5), new T.MeshStandardMaterial({ color: lin(T, 0x14151c), roughness: 0.9, envMapIntensity: 0.1 }));
      box.position.set(bx, bh / 2 + 0.16, -2.6); g.add(box);
      const roof = new T.Mesh(new T.BoxGeometry(bw + 0.3, 0.25, 5.3), new T.MeshStandardMaterial({ color: lin(T, 0x24262e), roughness: 0.8, envMapIntensity: 0.1 }));
      roof.position.set(bx, bh + 0.28, -2.6); g.add(roof);
    }
    g.position.z = FZ;
    return { g, tex, draw, day: this.dayK || 0, t: 0 };
  };
  P.v3Places = function (game, dist) {
    const T = this.T, M = this.v3P || (this.v3P = new Map());
    const on = game && game.s.vg && game.track === 'city' && this.track !== 'mountain';
    const seen = new Set();
    if (on) for (const e0 of game.placesBetween(dist - 140, dist + 320)) {
      if (e0.kind !== 'place') continue;
      const key = e0.id + ':' + Math.round(e0.x); seen.add(key);
      let F = M.get(key);
      if (!F) { const st = { open: 0 }; F = this.v3Facade(st, e0); if (!F) continue; F.st = st; F.e = e0; this.scene.add(F.g); M.set(key, F); }
      F.g.position.x = e0.x - dist;
      // il locale vicino è vivo: porte, neon; tutti si ridisegnano se cambia la luce del giorno
      const near = Math.abs(e0.x - dist) < 90, I = game.inside, mine = I && Math.abs(I.x - e0.x) < 1;
      F.st.open += ((mine || (Math.abs(e0.x - dist) < 30 && Math.abs(game.sim.v) < 6) ? 1 : 0) - F.st.open) * 0.08;
      F.t -= 1 / 60;
      if ((near && F.t <= 0) || Math.abs((this.dayK || 0) - F.day) > 0.06) { F.draw(); F.tex.needsUpdate = true; F.t = 0.25; F.day = this.dayK || 0; }
    }
    for (const [k, F] of M) if (!seen.has(k)) { this.scene.remove(F.g); F.tex.dispose(); M.delete(k); }
    // niente luce puntiforme davanti al locale: la facciata è già illuminata da sé, e sull'asfalto lucido faceva una macchia bianca
  };

  // ---------------------------------------------------------------- 2. i paesaggi
  const mats = {};
  // il 3D lavora in luce lineare e schiarisce alla fine: i colori scritti qui (sRGB, come nel 2D) vanno convertiti, sennò
  // di notte i prati e le rocce vengono verde acqua e grigi chiari
  const lin = (T, hex) => new T.Color(hex).convertSRGBToLinear();
  const M = (T, k, c, o) => mats[k] || (mats[k] = new T.MeshStandardMaterial(Object.assign({ roughness: 0.9, envMapIntensity: 0.12 }, o || {}, { color: lin(T, c), emissive: o && o.emissive ? lin(T, o.emissive) : 0x000000 })));   // poco riflesso dell'ambiente (sennò di notte sembrano azzurri)
  P.v3Land = function (bg) {
    const T = this.T, L = this.v3L || (this.v3L = {});
    if (L[bg]) return L[bg];
    const g = new T.Group(), items = [], add = (o, x0, z) => { o.position.z = z; g.add(o); items.push({ o, x0 }); return o; };
    const ground = (col, far, only) => { for (const s of (only ? [only] : [1, -1])) { const p = new T.Mesh(new T.PlaneGeometry(700, 300), M(T, 'gr' + col, col)); p.rotation.x = -Math.PI / 2; p.position.set(100, -0.01, s * (158 + (far || 0))); p.receiveShadow = true; g.add(p); } };
    const tree = (k, h, col) => { const t = new T.Group(); const tr = new T.Mesh(new T.CylinderGeometry(0.1, 0.16, h * 0.4, 5), M(T, 'trunk', 0x2a1d14)); tr.position.y = h * 0.2; t.add(tr);
      const cr = new T.Mesh(k === 'pop' ? new T.CylinderGeometry(0.15, 0.9, h * 0.85, 6) : k === 'pine' ? new T.ConeGeometry(1.4, h * 0.8, 7) : new T.IcosahedronGeometry(h * 0.28, 0), M(T, 'leaf' + col, col)); cr.position.y = k === 'pop' ? h * 0.55 : h * 0.58; t.add(cr); return t; };
    const house = (s, lit, roofCol) => { const h = new T.Group(), w = 6 + R(s) * 4, d = 6, hh = 3.2 + R(s + 1) * 2.4;
      const b = new T.Mesh(new T.BoxGeometry(w, hh, d), M(T, 'house' + (s % 3), [0x4a3a2c, 0x5a4a38, 0x3e3830][s % 3])); b.position.y = hh / 2; h.add(b);
      const sh = new T.Shape(); sh.moveTo(-w / 2 - 0.3, 0); sh.lineTo(0, 2); sh.lineTo(w / 2 + 0.3, 0); sh.lineTo(-w / 2 - 0.3, 0);
      const rg = new T.ExtrudeGeometry(sh, { depth: d + 0.4, bevelEnabled: false }); rg.translate(0, 0, -(d + 0.4) / 2); const rf = new T.Mesh(rg, M(T, 'roof' + roofCol, roofCol)); rf.position.y = hh; h.add(rf);
      if (lit) { const wm = new T.Mesh(new T.PlaneGeometry(0.9, 0.8), new T.MeshBasicMaterial({ color: 0xffb060 })); wm.position.set(w * 0.2, hh * 0.6, -d / 2 - 0.02); wm.rotation.y = Math.PI; h.add(wm);
        const gl = new T.Sprite(this.glowMat('#ffb060', 0.35)); gl.scale.set(1.8, 1.8, 1); gl.position.set(w * 0.2, hh * 0.6, -d / 2 - 0.3); h.add(gl); }
      return h; };
    // fondale lontano: colline, monti o città, disegnato su tela (fermo, come quello dei grattacieli)
    const backdrop = (draw, col) => { const tx = this.tex(2048, 256, draw); for (const z of [-140, 140]) { const bd = new T.Mesh(new T.PlaneGeometry(900, 90), new T.MeshBasicMaterial({ map: tx, transparent: true, fog: true, color: col || 0xffffff }));
      bd.position.set(100, 30, z); if (z > 0) bd.rotation.y = Math.PI; g.add(bd); } };
    const hills = (cols, lights) => (c, w, h) => { c.clearRect(0, 0, w, h); cols.forEach((col, k) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, h);
      for (let x = 0; x <= w; x += 16) c.lineTo(x, h - (40 + k * 30) - Math.sin(x * 0.004 + k * 2) * (30 + k * 12) - Math.sin(x * 0.017 + k) * 10); c.lineTo(w, h); c.fill(); });
      if (lights) for (let n = 0; n < lights; n++) { const x = R(n * 3.3) * w, y = h - 20 - R(n * 7.1) * 60; c.fillStyle = `rgba(255,${190 + R(n) * 50},120,${0.5 + R(n + 2) * 0.5})`; c.fillRect(x, y, 2, 2); } };
    if (bg === 'plain' || bg === 'village') {
      ground(0x0e1a10);
      for (let k = 0; k < 40; k++) add(tree('pop', 9 + R(k) * 4, 0x0a1a0e), k * 12 + R(k * 2) * 4, (k % 2 ? 1 : -1) * (11 + R(k + 9) * 2));      // filari di pioppi
      for (let k = 0; k < 8; k++) add(house(k, R(k + 4) > 0.3, 0x5a2a1e), 30 + k * 60 + R(k) * 20, (k % 2 ? 1 : -1) * (28 + R(k * 5) * 30));
      for (let k = 0; k < 18; k++) { const b = new T.Mesh(new T.CylinderGeometry(0.8, 0.8, 1.2, 10), M(T, 'hay', 0x8a7438)); b.rotation.x = Math.PI / 2; b.position.y = 0.8; add(b, k * 27 + R(k) * 10, (k % 2 ? 1 : -1) * (18 + R(k + 3) * 40)); }
      if (bg === 'village') {
        // il borgo sulla collina con le torri illuminate da sotto
        const hill = new T.Mesh(new T.SphereGeometry(60, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(T, 'hill', 0x0c160e)); hill.scale.set(1.6, 0.35, 1); add(hill, 200, -120);
        for (let k = 0; k < 9; k++) { const h = 14 + R(k) * 16, tw = new T.Mesh(new T.BoxGeometry(3, h, 3), M(T, 'tower', 0x6a5a44, { emissive: 0x3a2410, emissiveIntensity: 0.6 })); tw.position.y = 18 + h / 2; add(tw, 160 + k * 9 + R(k) * 4, -112 + R(k + 1) * 10); }
      }
      backdrop(hills(['#0e1a14', '#0a120e'], 120));
    } else if (bg === 'desert') {
      ground(0x3a2a1a);
      for (let k = 0; k < 26; k++) { const cg = new T.Group(), cm = M(T, 'cactus', 0x1e3a22), h = 2.5 + R(k) * 2.5;
        const s = new T.Mesh(new T.CylinderGeometry(0.28, 0.32, h, 8), cm); s.position.y = h / 2; cg.add(s);
        for (const sd of [1, -1]) if (R(k + sd) > 0.3) { const a = new T.Mesh(new T.CylinderGeometry(0.18, 0.2, 1.2, 6), cm); a.position.set(0, h * 0.55 + 0.6, sd * 0.6); cg.add(a); const j = new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.6, 6), cm); j.rotation.x = Math.PI / 2; j.position.set(0, h * 0.55, sd * 0.3); cg.add(j); }
        add(cg, k * 19 + R(k) * 8, (k % 2 ? 1 : -1) * (12 + R(k + 2) * 30)); }
      for (let k = 0; k < 20; k++) { const pg = new T.Group(); const pole = new T.Mesh(new T.CylinderGeometry(0.1, 0.12, 8, 5), M(T, 'wood', 0x3a2a1a)); pole.position.y = 4; pg.add(pole);
        const bar = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 1.6), M(T, 'wood', 0x3a2a1a)); bar.position.y = 7.6; pg.add(bar); add(pg, k * 24, 10.5); }
      for (let k = 0; k < 5; k++) { const mh = 18 + R(k) * 20, me = new T.Mesh(new T.CylinderGeometry(22 + R(k) * 10, 30 + R(k) * 12, mh, 7), M(T, 'mesa', 0x5a3424)); me.position.y = mh / 2; add(me, k * 100 + R(k) * 40, (k % 2 ? 1 : -1) * (90 + R(k + 1) * 30)); }
      backdrop(hills(['#3a2016', '#2a1610'], 0), 0xd8a080);
    } else if (bg === 'sea') {
      ground(0x14120e, 0, 1);                                                             // terra solo dalla parte delle rocce
      // il mare da una parte, con la scia della luna; le rocce dall'altra
      const sea = new T.Mesh(new T.PlaneGeometry(700, 300), new T.MeshStandardMaterial({ color: lin(T, 0x0a1424), roughness: 0.15, metalness: 0.6, envMapIntensity: 1.5 })); sea.rotation.x = -Math.PI / 2; sea.position.set(100, -0.005, -162); g.add(sea);
      const glit = this.tex(64, 512, (c, w, h) => { for (let y = 0; y < h; y += 3) { const a = (1 - y / h) * 0.9; c.fillStyle = `rgba(255,240,200,${a * Math.random()})`; c.fillRect(Math.random() * w * 0.6 + w * 0.2, y, 4 + Math.random() * 10, 2); } });
      const gl = new T.Mesh(new T.PlaneGeometry(14, 160), new T.MeshBasicMaterial({ map: glit, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); gl.rotation.x = -Math.PI / 2; gl.position.set(140, 0.01, -70); g.add(gl); this.v3Glit = gl;
      // la scogliera: un muretto basso tra la strada e il mare, e le luci delle barche al largo
      for (let k = 0; k < 8; k++) { const bt = new T.Mesh(new T.SphereGeometry(0.25, 6, 4), new T.MeshBasicMaterial({ color: k % 3 ? 0xffd27a : 0xff4a3a })); bt.position.y = 0.4; add(bt, k * 60 + R(k) * 30, -40 - R(k + 2) * 60); }
      for (let k = 0; k < 14; k++) { const rk = new T.Mesh(new T.DodecahedronGeometry(4 + R(k) * 6, 0), M(T, 'rock', 0x2a2620)); rk.position.y = 2; rk.scale.y = 1.4 + R(k + 1); add(rk, k * 36 + R(k) * 10, 16 + R(k + 3) * 10); }
      for (let k = 0; k < 60; k++) { const rail = new T.Mesh(new T.BoxGeometry(8, 0.35, 0.1), M(T, 'rail', 0x8a8e96, { metalness: 0.7, roughness: 0.3 })); rail.position.y = 0.7; add(rail, k * 8, -8.6); }
      backdrop(hills(['#101620'], 30), 0x8090b0);
    } else if (bg === 'mountain') {
      ground(0x0c140e);
      for (let k = 0; k < 44; k++) add(tree('pine', 8 + R(k) * 8, 0x0a1a10), k * 11 + R(k) * 6, (k % 2 ? 1 : -1) * (12 + R(k + 5) * 28));
      for (let k = 0; k < 10; k++) { const w = new T.Mesh(new T.BoxGeometry(18, 7 + R(k) * 8, 3), M(T, 'cliff', 0x2a2a26)); w.position.y = 4; add(w, k * 50 + R(k) * 10, 12); }
      backdrop((c, w, h) => { c.clearRect(0, 0, w, h); for (const [col, k] of [['#1a2028', 0], ['#121820', 1]]) { c.fillStyle = col; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 24) c.lineTo(x, h - 80 - k * 20 - Math.abs(Math.sin(x * 0.006 + k * 3)) * 120); c.lineTo(w, h); c.fill(); }
        c.fillStyle = 'rgba(230,236,255,.5)'; for (let x = 0; x < w; x += 24) { const y = h - 80 - Math.abs(Math.sin(x * 0.006)) * 120; if (Math.abs(Math.sin(x * 0.006)) > 0.85) c.fillRect(x, y, 10, 6); } }, 0xb0c0e0);
    } else if (bg === 'highway') {
      ground(0x08090c);
      // barriere antirumore trasparenti e piloni: l'autostrada sopraelevata sulla baia
      const pm = new T.MeshBasicMaterial({ color: lin(T, 0x2a3a50), transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false });
      // dalla parte della telecamera le barriere stanno più lontane (a z 14), sennò coprono la vista
      for (let k = 0; k < 60; k++) for (const z of [14, -9.2]) { const p = new T.Mesh(new T.PlaneGeometry(7.6, 2.6), pm); p.position.y = 1.5; add(p, k * 8, z);
        const post = new T.Mesh(new T.BoxGeometry(0.12, 3, 0.12), M(T, 'post', 0x3a3e48, { metalness: 0.6 })); post.position.set(-3.9, 1.5, 0); p.add(post); }
      for (let k = 0; k < 12; k++) for (const z of [12, -12]) { const pil = new T.Mesh(new T.BoxGeometry(2, 20, 2), M(T, 'pil', 0x2a2c32)); pil.position.y = -9; add(pil, k * 40, z); }
    }
    g.visible = false; this.scene.add(g);
    return (L[bg] = { g, items });
  };
  P.v3Scenery = function (game, dist) {
    const km = dist / 1000, id = game && game.s.vg && game.s.vg.on !== false && game.s.vg ? VG.locAt(km) : null;
    const loc = id && typeof GAME_LOCS !== 'undefined' ? GAME_LOCS.find((l) => l.id === id) : null;
    const bg = this.track === 'mountain' ? 'city' : loc && BGS.includes(loc.bg) ? loc.bg : 'city';
    if (bg !== this.v3Bg) {
      this.v3Bg = bg;
      const city = bg === 'city';
      for (const b of this.blocks || []) b.g.visible = city;
      for (const o of this.v3Back || []) o.visible = city || bg === 'highway';
      for (const l of this.lamps || []) l.g.visible = city || bg === 'highway' || bg === 'village';
      for (const p of this.props || []) { if (city) { if (!p.o.parent) this.scene.add(p.o); } else if (p.o.parent) this.scene.remove(p.o); }   // fuori città gli arredi escono dalla scena
      for (const k of BGS) if (this.v3L && this.v3L[k]) this.v3L[k].g.visible = false;
      if (!city) this.v3Land(bg).g.visible = true;
      const fog = { city: 0x04060b, plain: 0x060a0a, village: 0x060a0a, desert: 0x0c0806, sea: 0x050812, mountain: 0x05080c, highway: 0x05060c }[bg];
      this.v3Fog = fog;
    }
    const L = this.v3L && this.v3L[bg];
    if (L) for (const it of L.items) it.o.position.x = ((it.x0 - dist) % 480 + 480) % 480 - 120;
  };

  // ---------------------------------------------------------------- 3. le luci
  P.v3Lights = function () {
    const T = this.T;
    // fondali dei grattacieli (per nasconderli fuori città)
    this.v3Back = this.scene.children.filter((o) => o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.width === 700 && o.geometry.parameters.height === 85);
    // aloni: più piccoli e del colore della lampada; cono di luce nell'aria sotto ogni lampione
    const coneTex = this.tex(16, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(0.5, 'rgba(255,255,255,.3)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    this.v3ConeMat = new T.MeshBasicMaterial({ color: 0xffb35c, alphaMap: coneTex, transparent: true, opacity: 0.05, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: true });
    for (const l of this.lamps || []) {
      const halo = l.g.children.find((o) => o.isSprite); if (halo) { halo.scale.set(1.6, 1.6, 1); halo.material.color.set(0xffa040); }
      const bulb = l.g.children[2]; if (!bulb) continue;
      const cg = new T.ConeGeometry(2.6, 7.6, 20, 1, true); cg.translate(0, -3.8, 0);
      const cone = new T.Mesh(cg, this.v3ConeMat); cone.position.copy(bulb.position); cone.position.y -= 0.1; l.g.add(cone);
    }
    // distributori automatici: l'alone era un disco bianco grande
    this.scene.traverse((o) => { if (o.isSprite && o.material && o.material.color && o.material.color.getHex() === 0xcfe4ff && o.scale.x === 3) { o.scale.set(1.4, 1.6, 1); o.material.opacity = 0.18; } });
  };

  // ---------------------------------------------------------------- aggancio
  // Garage3D.update disegna il fotogramma alla fine (specchietto e scena): il lavoro di questo file va fatto subito prima,
  // dentro renderMirror/draw, una volta per fotogramma (dopo che street3d ha messo a posto strada, lampioni e arredi)
  P.v3Frame = function () {
    const game = this.v3Game; if (this.v3T === this.t) return; this.v3T = this.t;
    // dentro un locale la scena dell'interno (interni.js) è pensata sopra il 2D: la vista 3D sotto si mescolava, si nasconde
    if (this.canvas) { const hide = !!(game && game.inside); if (this.v3Hid !== hide) { this.v3Hid = hide; this.canvas.style.visibility = hide ? 'hidden' : ''; } }
    if (!game || game.track === 'mountain') return;
    try { this.v3Scenery(game, this.dist); this.v3Places(game, this.dist); } catch (e) { if (!this.v3Err) { this.v3Err = true; console.warn('viaggio3d', e); } }
    if (this.v3ConeMat) this.v3ConeMat.opacity = 0.022 * (1 - (this.dayK || 0)) * (this.rainOn ? 1.8 : 1);
    if (this.v3Glit) this.v3Glit.visible = (this.dayK || 0) < 0.4;
    // aloni dei fari più piccoli: col bagliore facevano una macchia bianca davanti al muso
    for (const b of this.headGlow || []) { b.material.opacity *= 0.45; b.scale.multiplyScalar(0.7); }
  };
  const upd = P.update;
  P.update = function (dt, s, game) {
    if (!this.v3Init) { this.v3Init = true; try { this.v3Lights(); } catch (e) { console.warn('viaggio3d: luci', e); } }
    this.v3Game = game;
    upd.call(this, dt, s, game);
  };
  for (const k of ['renderMirror', 'draw']) { const f = P[k]; if (typeof f === 'function') P[k] = function (...a) { this.v3Frame(); return f.apply(this, a); }; }
  const day = P.setDaylight;
  P.setDaylight = function (d, ss, wet) {
    day.call(this, d, ss, wet);
    if (this.v3Fog && this.v3Bg && this.v3Bg !== 'city' && this.track !== 'mountain' && d < 0.5) { const c = new this.T.Color(this.v3Fog); this.scene.background = c; this.scene.fog.color.copy(c); }
  };
})();
