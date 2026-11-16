// ============================================================================
//  Icone degli oggetti (bagagliaio, negozio, locali, cassa del motel), in pixel art 32×32.
//  NR_ICON(kind) dà una tela 32×32 (in cache); NR_ICON_TAG(kind) un <img> pronto per i pulsanti.
//  Ogni icona è fatta di forme piene a tre toni (luce in alto a sinistra), poi un contorno scuro e un'ombra.
//  Per un oggetto nuovo: una voce in DRAW con lo stesso nome di INV.
// ============================================================================
(() => {
  const N = 32, INK = [11, 13, 22];
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  // tavolozza a tre toni per colore: luce, base, ombra
  const tone = (h, k) => { const c = hex(h); return '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))).toString(16).padStart(2, '0')).join(''); };

  function painter(x) {
    const P = {
      r(col, a, b, w, h) { x.fillStyle = col; x.fillRect(a, b, w, h); },
      // ellisse piena (centro, raggi) a pixel netti
      e(col, cx, cy, rx, ry) { x.fillStyle = col; for (let y = -Math.floor(ry); y <= ry; y++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); if (w > 0) x.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2, 1); } },
      // scatola a tre toni: faccia, luce sopra/sinistra, ombra sotto/destra
      box(col, a, b, w, h) { P.r(col, a, b, w, h); P.r(tone(col, 0.28), a, b, w, 2); P.r(tone(col, 0.18), a, b, 2, h); P.r(tone(col, -0.3), a, b + h - 2, w, 2); P.r(tone(col, -0.2), a + w - 2, b, 2, h); },
      line(col, pts) { x.fillStyle = col; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let k = 0; k <= n; k++) x.fillRect(Math.round(x0 + (x1 - x0) * k / n), Math.round(y0 + (y1 - y0) * k / n), 1, 1); } },
    };
    return P;
  }

  const DRAW = {
    tanica(P) {                                                    // tanica rossa con la croce in rilievo e il tappo
      P.box('#c42a1a', 7, 7, 18, 21); P.r('#8a1a10', 10, 12, 12, 2); P.r('#8a1a10', 10, 22, 12, 2);
      P.line('#e04a35', [[10, 14], [21, 21]]); P.line('#e04a35', [[21, 14], [10, 21]]);
      P.r('#2a2d38', 18, 3, 6, 5); P.r('#5a5f6c', 19, 3, 4, 2); P.r('#c42a1a', 8, 4, 8, 3); P.r('#0b0d16', 10, 5, 4, 2);
    },
    kit(P) {                                                       // cassetta degli attrezzi arancione con la chiave inglese
      P.box('#e58a12', 4, 13, 24, 15); P.r('#a85e06', 4, 19, 24, 2); P.r('#2a2d38', 14, 18, 4, 4); P.r('#c9ced6', 15, 19, 2, 2);
      P.r('#2a2d38', 11, 8, 10, 2); P.r('#2a2d38', 11, 8, 2, 6); P.r('#2a2d38', 19, 8, 2, 6);
      P.line('#c9ced6', [[22, 4], [27, 11]]); P.line('#9aa0ae', [[23, 4], [28, 11]]); P.e('#c9ced6', 21, 4, 2.5, 2); P.r('#0b0d16', 20, 3, 2, 2);
    },
    scorta(P) {                                                    // ruota: battistrada, cerchio, bulloni
      P.e('#1d1f27', 16, 16, 13, 13); P.e('#2c2f3a', 15, 15, 11, 11);
      for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; P.r('#3a3e4b', Math.round(16 + Math.cos(t) * 12.2), Math.round(16 + Math.sin(t) * 12.2), 1, 1); }
      P.e('#9aa3b2', 16, 16, 7, 7); P.e('#c9d0dc', 15, 15, 5.5, 5.5); P.e('#6a7282', 16, 16, 2.5, 2.5);
      for (let a = 0; a < 5; a++) { const t = a / 5 * Math.PI * 2; P.r('#3a404e', Math.round(16 + Math.cos(t) * 4.2), Math.round(16 + Math.sin(t) * 4.2), 1, 1); }
    },
    forata(P) {                                                    // ruota sgonfia, schiacciata in basso, col chiodo
      P.e('#1d1f27', 16, 17, 13, 11); P.r('#1d1f27', 3, 22, 26, 6); P.e('#2c2f3a', 15, 16, 11, 9);
      P.e('#9aa3b2', 16, 16, 6.5, 6); P.e('#c9d0dc', 15, 15, 5, 4.5); P.e('#6a7282', 16, 16, 2, 2);
      P.r('#c9ced6', 24, 6, 2, 7); P.r('#8a909c', 23, 5, 4, 2); P.line('#ffe14d', [[27, 3], [30, 1]]); P.line('#ffe14d', [[28, 6], [31, 5]]);
    },
    pacco(P) {                                                     // scatola di cartone col nastro
      P.box('#b07a3a', 4, 9, 24, 19); P.r('#8a5a26', 4, 9, 24, 3); P.r('#e8d8a8', 14, 9, 4, 19); P.r('#f4ead0', 14, 9, 1, 19);
      P.r('#f4f1e6', 6, 18, 6, 5); P.r('#2a2d38', 7, 19, 4, 1); P.r('#2a2d38', 7, 21, 3, 1);
    },
    scatola(P) { DRAW.pacco(P); P.r('#c42a1a', 20, 18, 6, 5); P.r('#f4f1e6', 21, 19, 1, 3); P.r('#f4f1e6', 22, 21, 3, 1); },
    missione(P) {                                                  // pacco sigillato con la ceralacca e la stella
      P.box('#6a4a2a', 4, 9, 24, 19); P.r('#3a2a18', 4, 17, 24, 3); P.r('#3a2a18', 15, 9, 3, 19);
      P.e('#a8141c', 16, 18, 6, 6); P.e('#d8343a', 15, 17, 4.5, 4.5);
      const star = [[16, 14], [17, 17], [20, 17], [17.5, 19], [18.5, 22], [16, 20], [13.5, 22], [14.5, 19], [12, 17], [15, 17]];
      P.line('#ffd23f', star.concat([star[0]]).map(([a, b]) => [Math.round(a), Math.round(b)]));
      P.r('#ffe14d', 26, 4, 2, 2); P.r('#ffe14d', 28, 8, 1, 1); P.r('#ffe14d', 3, 5, 1, 1);
    },
    bancale(P) {                                                   // bancale con i colli avvolti nel film
      P.r('#8a6440', 2, 25, 28, 3); P.r('#6b4a2e', 4, 28, 4, 3); P.r('#6b4a2e', 14, 28, 4, 3); P.r('#6b4a2e', 24, 28, 4, 3);
      P.box('#b07a3a', 3, 15, 13, 10); P.box('#c08a48', 16, 15, 13, 10); P.box('#a8703a', 9, 5, 14, 10);
      P.r('rgba(200,230,255,.35)', 3, 5, 26, 20); P.line('rgba(255,255,255,.6)', [[5, 8], [8, 24]]);
    },
    trofeo(P) {                                                    // coppa d'oro
      P.e('#d8a018', 16, 11, 9, 8); P.r('#d8a018', 7, 4, 18, 7); P.r('#ffe270', 9, 4, 3, 10); P.r('#a87410', 22, 4, 2, 10);
      P.e('#0b0d16', 5, 9, 3, 4); P.e('#d8a018', 5, 9, 2, 3); P.e('#0b0d16', 27, 9, 3, 4); P.e('#d8a018', 27, 9, 2, 3);
      P.r('#d8a018', 14, 18, 4, 5); P.box('#5a3a1a', 9, 23, 14, 6); P.r('#ffd23f', 12, 25, 8, 2);
    },
    zavorra(P) {                                                   // sacco di sabbia legato
      P.e('#b8a274', 16, 19, 12, 10); P.e('#cdb88a', 14, 17, 8, 7); P.r('#8a7650', 6, 26, 20, 2);
      P.r('#6b5a3a', 13, 7, 6, 4); P.r('#4a3a22', 12, 10, 8, 2); P.e('#b8a274', 16, 6, 4, 3);
      P.r('#8a7650', 10, 18, 12, 1); P.r('#8a7650', 11, 22, 10, 1);
    },
    panino(P) {                                                    // panino: pane, insalata, pomodoro, formaggio
      P.e('#d89a4a', 16, 11, 13, 6); P.r('#d89a4a', 3, 11, 26, 3); P.r('#f0c070', 8, 7, 8, 2);
      P.r('#5ab83a', 3, 15, 26, 2); P.r('#c42a1a', 4, 17, 24, 2); P.r('#ffd23f', 5, 19, 22, 2);
      P.r('#c8823a', 3, 21, 26, 4); P.r('#a8642a', 3, 24, 26, 2);
      for (const [a, b] of [[10, 10], [15, 8], [20, 10], [24, 9]]) P.r('#fff2d8', a, b, 1, 1);
    },
    acqua(P) {                                                     // bottiglia d'acqua con l'etichetta
      P.r('#2a5fa8', 13, 2, 6, 4); P.r('#9fd0ff', 14, 6, 4, 3); P.e('#9fd0ff', 16, 11, 6, 3);
      P.box('#7fc0f0', 10, 11, 12, 18); P.r('#c8e8ff', 11, 11, 2, 16); P.r('#2a5fa8', 10, 17, 12, 6); P.r('#f4f1e6', 13, 19, 6, 2);
      P.r('#5aa0dc', 10, 27, 12, 2);
    },
    caffe(P) {                                                     // thermos col tappo-tazza e il vapore
      P.box('#5a6070', 10, 9, 12, 20); P.r('#8a90a6', 11, 9, 2, 20); P.r('#c42a1a', 10, 16, 12, 4);
      P.r('#2a2d38', 9, 5, 14, 4); P.r('#454a58', 10, 5, 12, 1);
      P.line('#e8e4d6', [[13, 3], [12, 1], [13, 0]]); P.line('#e8e4d6', [[18, 3], [19, 1], [18, 0]]);
    },
    energetico(P) {                                                // lattina con il fulmine
      P.box('#163a8c', 10, 6, 12, 22); P.r('#c9ced6', 10, 4, 12, 2); P.r('#9aa0ae', 10, 28, 12, 1); P.r('#2a5fd0', 11, 6, 2, 22);
      P.line('#ffe14d', [[18, 9], [14, 17], [18, 17], [14, 25]]); P.line('#ffd23f', [[19, 9], [15, 17], [19, 17], [15, 25]]);
    },
    salviette(P) {                                                 // pacchetto di salviette con la salvietta che esce
      P.box('#3ab0a0', 4, 12, 24, 14); P.r('#2a8a7e', 4, 22, 24, 4); P.r('#f4f1e6', 11, 9, 10, 6); P.r('#d8d4c8', 12, 13, 8, 2);
      P.e('#f4f1e6', 9, 19, 2, 2); P.r('#2a8a7e', 17, 18, 8, 1); P.r('#2a8a7e', 17, 20, 6, 1);
    },
    bomboletta(P) {                                                // bomboletta gonfia e ripara
      P.box('#e8e4d6', 11, 9, 11, 20); P.r('#c42a1a', 11, 15, 11, 6); P.r('#f4f1e6', 12, 9, 2, 20);
      P.r('#5a6070', 13, 5, 7, 4); P.r('#2a2d38', 19, 3, 6, 2); P.r('#2a2d38', 23, 3, 2, 4);
      P.r('#f4f1e6', 14, 17, 5, 1); P.r('#f4f1e6', 14, 19, 3, 1);
    },
    // servizi dei locali
    tazzina(P) {                                                   // tazzina di caffè col piattino e il vapore
      P.e('#e8e4d6', 16, 26, 12, 3); P.r('#f4f1e6', 8, 14, 15, 10); P.r('#d8d4c8', 20, 14, 3, 10); P.e('#f4f1e6', 15, 24, 7, 2);
      P.r('#5a3a1a', 9, 14, 13, 2); P.e('#0b0d16', 25, 18, 3, 3); P.e('#f4f1e6', 25, 18, 2, 2);
      P.line('#c8c0b0', [[12, 11], [11, 8], [12, 5]]); P.line('#c8c0b0', [[17, 11], [18, 8], [17, 5]]);
    },
    cornetto(P) {                                                  // cornetto a spicchi, lucido
      P.e('#d8902a', 16, 18, 13, 7); P.e('#f0b048', 15, 16, 10, 5);
      for (const a of [9, 14, 19, 24]) P.r('#a8641a', a, 13, 1, 10);
      P.e('#d8902a', 4, 22, 3, 3); P.e('#d8902a', 28, 22, 3, 3); P.r('#ffe0a0', 12, 13, 6, 1);
    },
    pasto(P) {                                                     // piatto con forchetta e coltello
      P.e('#e8e4d6', 16, 18, 11, 10); P.e('#c8c4b8', 16, 18, 8, 7); P.e('#c42a1a', 14, 17, 4, 3); P.e('#5ab83a', 19, 20, 3, 2); P.e('#e8c060', 18, 15, 3, 2);
      P.r('#9aa0ae', 2, 8, 2, 20); P.r('#9aa0ae', 1, 8, 1, 6); P.r('#9aa0ae', 4, 8, 1, 6);
      P.r('#9aa0ae', 28, 8, 2, 20); P.r('#c9ced6', 28, 8, 1, 10);
    },
    doccia(P) {                                                    // soffione con le gocce
      P.r('#8a90a6', 6, 3, 14, 2); P.r('#8a90a6', 6, 3, 2, 8); P.e('#c9ced6', 21, 9, 7, 4); P.r('#9aa0ae', 14, 9, 14, 3);
      for (const [a, b] of [[15, 15], [19, 17], [23, 15], [27, 18], [17, 21], [21, 24], [25, 22], [16, 27], [23, 28]]) { P.r('#7fc0f0', a, b, 1, 2); P.r('#c8e8ff', a, b, 1, 1); }
    },
    letto(P) {                                                     // letto del motel con cuscino e coperta
      P.r('#5a3a1a', 2, 12, 3, 16); P.r('#5a3a1a', 27, 17, 3, 11);
      P.box('#ff5fa8', 4, 18, 24, 7); P.r('#f4f1e6', 5, 14, 9, 5); P.r('#d8d4c8', 5, 17, 9, 2); P.r('#c03a80', 4, 23, 24, 2);
      P.r('#ffd23f', 22, 4, 4, 4); P.r('#fff2a0', 23, 4, 1, 1);
    },
    sapone(P) {                                                    // saponetta con le bolle
      P.box('#ffb0d0', 6, 16, 20, 10); P.r('#ffd8e8', 8, 16, 10, 2);
      P.e('#c8e8ff', 10, 10, 3, 3); P.e('#f4f8ff', 9, 9, 1, 1); P.e('#c8e8ff', 18, 7, 4, 4); P.e('#f4f8ff', 17, 5, 1.5, 1.5); P.e('#c8e8ff', 25, 11, 2, 2);
    },
  };
  // oggetti senza disegno proprio: una cassetta di legno
  const crate = (P) => { P.box('#9a7a4a', 4, 8, 24, 20); P.r('#6b5230', 4, 15, 24, 2); P.r('#6b5230', 4, 21, 24, 2); P.line('#6b5230', [[5, 9], [27, 27]]); };

  const cache = {}, tags = {};
  window.NR_ICON = function (kind) {
    if (cache[kind]) return cache[kind];
    const c = document.createElement('canvas'); c.width = N; c.height = N;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    (DRAW[kind] || crate)(painter(x));
    // contorno scuro attorno alla figura e ombra in basso a destra
    const im = x.getImageData(0, 0, N, N), d = im.data, a = new Uint8Array(N * N);
    for (let i = 0; i < N * N; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
    for (let y = 0; y < N; y++) for (let xx = 0; xx < N; xx++) {
      const i = y * N + xx; if (a[i]) continue;
      const near = (xx > 0 && a[i - 1]) || (xx < N - 1 && a[i + 1]) || (y > 0 && a[i - N]) || (y < N - 1 && a[i + N]);
      const shade = !near && xx > 0 && y > 0 && a[i - N - 1];
      if (near) { d[i * 4] = INK[0]; d[i * 4 + 1] = INK[1]; d[i * 4 + 2] = INK[2]; d[i * 4 + 3] = 255; }
      else if (shade) { d[i * 4] = 0; d[i * 4 + 1] = 0; d[i * 4 + 2] = 0; d[i * 4 + 3] = 90; }
    }
    x.putImageData(im, 0, 0);
    return (cache[kind] = c);
  };
  window.NR_ICON_TAG = function (kind) {
    if (!tags[kind]) tags[kind] = `<img class="ico" src="${window.NR_ICON(kind).toDataURL()}" alt="" width="32" height="32">`;
    return tags[kind];
  };
  window.NR_ICON_KINDS = Object.keys(DRAW);
})();
