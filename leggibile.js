// ============================================================================
//  Night Run · Niente scritte una sopra l'altra (l'ultimo script della pagina)
//  Non cambia il lavoro degli altri file: guarda dove sono, cinque volte al secondo, le cose che si leggono
//  (la finestra delle domande #promptBox, la striscia gialla #msg, gli avvisi a destra #toasts, l'avviso del telefono
//  .tel-toast) e, solo se due si coprono, sposta in giù quella meno importante con la proprietà CSS `translate` (che non
//  tocca i `transform` già usati); se spostata finirebbe fuori schermo o sopra la domanda, la nasconde finché c'è posto.
//  La domanda aperta sta sempre sopra a tutto (anche ai pulsanti STRUMENTI e DATI al tocco). Quando non c'è niente
//  che si copre, tutto resta esattamente com'era.
// ============================================================================
(() => {
  if (typeof document === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = '.prompt:not([hidden]){z-index:80}.nr-leg-off{visibility:hidden!important}';
  document.head.appendChild(css);

  const vis = (el, masked = false) => { if (!el || el.hidden) return null; const s = getComputedStyle(el); if (s.display === 'none' || (!masked && s.visibility === 'hidden') || +s.opacity < 0.05) return null;
    const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 ? r : null; };
  const hit = (a, b, m = 4) => a && b && a.left < b.right + m && b.left < a.right + m && a.top < b.bottom + m && b.top < a.bottom + m;
  // il riquadro "vero" degli avvisi: la loro colonna, non tutto il contenitore
  const box = (el, masked) => { if (el.id === 'toasts') { let r = null; for (const c of el.children) { const q = vis(c, masked); if (!q) continue; r = r ? { left: Math.min(r.left, q.left), right: Math.max(r.right, q.right), top: Math.min(r.top, q.top), bottom: Math.max(r.bottom, q.bottom) } : { left: q.left, right: q.right, top: q.top, bottom: q.bottom }; } return r; } return vis(el, masked); };
  const shift = new WeakMap();
  const set = (el, dy, off) => {
    const prev = shift.get(el);
    if ((prev?.dy || 0) !== dy) el.style.translate = dy ? `0 ${dy}px` : '';
    if ((prev?.off || false) !== off) el.classList.toggle('nr-leg-off', off);
    shift.set(el, { dy, off });
  };
  setInterval(() => {
    const prompt = document.getElementById('promptBox'), msg = document.getElementById('msg'), toasts = document.getElementById('toasts'), tel = document.querySelector('.tel-toast');
    // dall'alto in basso per importanza: chi è più importante resta dov'è
    const order = [msg, tel, toasts].filter(Boolean);
    const pR = vis(prompt), H = window.innerHeight;
    const fixed = pR ? [pR] : [];
    // Prima tutte le misure. La posizione di partenza si ricava dallo spostamento già applicato.
    const measures = order.map((el) => {
      const prev = shift.get(el), r = box(el, prev?.off), dy = prev?.dy || 0;
      return { el, r: r && { left: r.left, right: r.right, top: r.top - dy, bottom: r.bottom - dy } };
    });
    for (const { el, r } of measures) {
      if (!r) { set(el, 0, false); continue; }
      let dy = 0, off = false;
      for (let k = 0; k < 4; k++) {
        const over = fixed.find((f) => hit({ left: r.left, right: r.right, top: r.top + dy, bottom: r.bottom + dy }, f));
        if (!over) break;
        if (over === pR) { off = true; break; }                              // sopra la domanda non si scrive: aspetta
        dy = over.bottom + 6 - r.top;
      }
      if (!off && r.bottom + dy > H - 4) off = true;
      if (!off && pR && hit({ left: r.left, right: r.right, top: r.top + dy, bottom: r.bottom + dy }, pR)) off = true;
      set(el, off ? 0 : Math.round(dy), off);
      if (!off) fixed.push({ left: r.left, right: r.right, top: r.top + dy, bottom: r.bottom + dy });
    }
  }, 200);
})();
