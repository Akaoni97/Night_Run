// ============================================================================
//  Night Run · Tre salvataggi (v0.101, chiesti da Nico): tre partite del Viaggio separate sullo stesso computer
//  (per esempio una di Nico, una di Luca e una di prova), che non si cancellano a vicenda.
//  Come funziona: la partita in uso sta dove è sempre stata (`nightrun-viaggio`, le foto del diario `nr_diario_foto`,
//  l'ultimo personaggio `nr_pg`, e i pezzi montati dentro `banco2jz`: tunes, coss, adj, paint), così il resto del gioco
//  non cambia. Le altre due aspettano da parte con le chiavi `<chiave>@<n>` e `nr_pezzi@<n>`. Cambiando partita
//  quella in uso va da parte, l'altra torna al suo posto e la pagina si ricarica (si riparte dal titolo).
//  Una partita vuota parte da capo: editor del personaggio, prologo, km 0. Il numero della partita in uso è `nr_slot`
//  (di partenza 1: chi giocava prima ritrova la sua partita nella 1). Impostazioni, tasti, volume e prestazioni sono
//  del computer e valgono per tutte. «Nuovo viaggio» (riavvia.js) cancella solo la partita in uso.
//  Dove si sceglie: sulla schermata iniziale (sopra «Accendi e parti») e nel menu, scheda Partita (riquadro Salvataggi).
//  Funzioni pure provate in test/salvataggi.test.js: slotRiassunto, slotScambia.
// ============================================================================
const SLOT = { n: 3, chiavi: ['nightrun-viaggio', 'nr_diario_foto', 'nr_pg'], pezzi: ['tunes', 'coss', 'adj', 'paint'] };

// il riassunto di una partita salvata (testo JSON di game.save()), o null se è vuota o illeggibile
function slotRiassunto(json, cars, luogoDi) {
  if (!json) return null;
  try {
    const o = JSON.parse(json), s = o && o.s; if (!s || !s.vg) return null;
    const id = s.carId, C = cars && cars[id], km = Math.max(0, (s.dist || 0) / 1000);
    let luogo = ''; try { luogo = (luogoDi && luogoDi(km)) || ''; } catch (e) { luogo = ''; }   // v0.120: dove sei arrivato (la capitale o il tratto)
    return { km, soldi: Math.round(s.money || 0), auto: C ? (C.short || C.name) : (id || ''), prologo: !!s.vg.prologo, luogo, marce: s.vg.dia ? s.vg.dia.length : 0 };
  } catch (e) { return null; }
}

// il nome scelto per una partita (o «Partita n») e quando è stata giocata l'ultima volta (v0.110)
function slotNome(meta, n) { const m = meta && meta[n]; const t = m && typeof m.nome === 'string' ? m.nome.trim().slice(0, 14) : ''; return t || 'Partita ' + n; }
function slotQuando(ts, now) {
  if (!ts) return ''; const g = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 86400000);
  return g <= 0 ? 'oggi' : g === 1 ? 'ieri' : g < 7 ? g + ' giorni fa' : g < 30 ? Math.floor(g / 7) + (g < 14 ? ' settimana fa' : ' settimane fa') : 'più di un mese fa';
}

// lo scambio su uno spazio di chiavi (localStorage o un oggetto finto nei test): la partita `da` va da parte, `a` torna in uso
function slotScambia(L, da, a) {
  if (da === a) return false;
  const get = (k) => L.getItem(k), put = (k, v) => (v == null ? L.removeItem(k) : L.setItem(k, v));
  let S = {}; try { S = JSON.parse(get('banco2jz') || '{}') || {}; } catch (e) { S = {}; }
  // da parte la partita in uso
  for (const k of SLOT.chiavi) put(k + '@' + da, get(k));
  const P = {}; for (const k of SLOT.pezzi) if (S[k] !== undefined) P[k] = S[k];
  put('nr_pezzi@' + da, JSON.stringify(P));
  // al suo posto quella scelta (vuota: si parte da capo, come «Nuovo viaggio»)
  for (const k of SLOT.chiavi) put(k, get(k + '@' + a));
  let Q = null; try { Q = JSON.parse(get('nr_pezzi@' + a) || 'null'); } catch (e) { Q = null; }
  if (S.trip === false) { S.tunesOther = S.tunes; S.cossOther = S.coss; S.adjOther = S.adj; }   // veniva da una modalità libera: i suoi pezzi restano da parte
  S.trip = true; S.tunes = {}; S.coss = {}; S.adj = {};
  if (Q) for (const k of SLOT.pezzi) if (Q[k] !== undefined) S[k] = Q[k];
  put('banco2jz', JSON.stringify(S));
  put('nr_slot', String(a));
  return true;
}

(function salvataggi() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const L = (() => { try { const s = window.localStorage; s.getItem('x'); return s; } catch (e) { return null; } })();
  if (!L) return;
  const inUso = () => { const n = parseInt(L.getItem('nr_slot') || '1', 10); return n >= 1 && n <= SLOT.n ? n : 1; };
  const json = (n) => {
    if (n === inUso()) { try { const g = window.nightRun && window.nightRun.game; if (g && g.s && g.s.vg) return g.save(); } catch (e) { /* dal salvataggio */ } return L.getItem('nightrun-viaggio'); }
    return L.getItem('nightrun-viaggio@' + n);
  };
  // dove sei arrivato: il nome del luogo (la capitale, senza la via) dal km, quando viaggio.js e game.js ci sono
  const luogoDi = (km) => {
    if (typeof VG === 'undefined' || !VG.locAt || typeof GAME_LOCS === 'undefined') return '';
    const id = VG.locAt(km), L = GAME_LOCS.find((x) => x.id === id); return L ? String(L.name).split(' · ')[0] : '';
  };
  const riassunto = (n) => slotRiassunto(json(n), typeof CARS !== 'undefined' ? CARS : null, luogoDi);
  // nomi e ultima volta (sono del computer, non seguono lo scambio delle partite)
  const metaGet = () => { try { return JSON.parse(L.getItem('nr_slot_meta') || '{}') || {}; } catch (e) { return {}; } };
  const metaSet = (m) => { try { L.setItem('nr_slot_meta', JSON.stringify(m)); } catch (e) { /* pieno */ } };
  const tocca = () => { const m = metaGet(), n = inUso(); m[n] = Object.assign(m[n] || {}, { ora: Date.now() }); metaSet(m); };
  if (!window.__nrSlotOra) { window.__nrSlotOra = true; setInterval(tocca, 60000); window.addEventListener('pagehide', tocca); }
  const euro = (x) => '€ ' + x.toLocaleString('it-IT');
  const km = (x) => x.toLocaleString('it-IT', { maximumFractionDigits: x < 10 ? 1 : 0 });

  function vai(n) {
    const da = inUso(); if (n === da) return;
    if (window.nightRun && window.nightRun.game && window.nightRun.game.inside) return false;   // dentro un locale no: prima si esce
    try { if (window.nightRun && window.nightRun.save) window.nightRun.save(); } catch (e) { /* si va avanti */ }
    tocca();
    window.__nrRiavvia = true;                                   // il gioco non risalva mentre la pagina si chiude (riavvia.js)
    try { slotScambia(L, da, n); } catch (e) { window.__nrRiavvia = false; return; }
    location.reload();
  }

  // le tre caselle (sulla schermata iniziale e nel menu)
  const CSS = `
.nr-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.nr-slot{all:unset;box-sizing:border-box;cursor:pointer;display:grid;gap:2px;padding:9px 10px;border-radius:8px;background:rgba(10,12,22,.55);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);font:500 12px/1.35 "Barlow Semi Condensed",system-ui,sans-serif;color:#c9c2b0;min-width:0;transition:box-shadow .15s,background .15s}
.nr-slot:hover,.nr-slot:focus-visible{background:rgba(30,26,18,.7);box-shadow:inset 0 0 0 1px rgba(255,179,71,.6)}
.nr-slot b{font:400 13px/1.1 "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e8dcc0}
.nr-slot{position:relative}.nr-slot .ed{position:absolute;top:6px;right:7px;font-size:12px;color:#8a8270;cursor:pointer;padding:0 3px}.nr-slot .ed:hover{color:#ffb347}
.nr-slot span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nr-slot span.a{color:#f2ead8;font-weight:600}.nr-slot span.d{color:#c9b98e}
.nr-slot i{font-style:normal;font-size:11px;color:#8a8270;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nr-slot.on{background:rgba(60,40,10,.6);box-shadow:inset 0 0 0 2px #ffb347}
.nr-slot.on b{color:#ffb347}
.nr-slots-h{font:600 11px/1 "Share Tech Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#a8936a;margin-top:10px}
.nr-slot-ask{margin-top:8px;padding:8px 10px;border-radius:8px;background:rgba(60,20,10,.55);box-shadow:inset 0 0 0 1px rgba(255,120,80,.4);font:500 13px/1.4 "Barlow Semi Condensed",system-ui,sans-serif;color:#f0e0c8;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.nr-slot-ask button{all:unset;cursor:pointer;padding:5px 12px;border-radius:6px;background:#ffb347;color:#1a1208;font-weight:700}
.nr-slot-ask button.no{background:rgba(255,255,255,.1);color:#e8dcc0}`;
  const css = document.createElement('style'); css.textContent = CSS; document.head.appendChild(css);

  // conferma: dal menu si chiede prima (la partita in corso si salva, ma la pagina si ricarica); sul titolo no
  function caselle(conferma) {
    const box = document.createElement('div'), row = document.createElement('div'); row.className = 'nr-slots'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Salvataggi');
    const h = document.createElement('div'); h.className = 'nr-slots-h'; h.textContent = 'Salvataggi';
    box.append(h, row);
    const disegna = () => {
      const u = inUso(); row.textContent = '';
      for (let n = 1; n <= SLOT.n; n++) {
        const r = riassunto(n), b = document.createElement('button'); b.type = 'button'; b.className = 'nr-slot' + (n === u ? ' on' : '');
        const M = metaGet(), q = r && M[n] && M[n].ora ? slotQuando(M[n].ora, Date.now()) : '';
        const t = r ? (r.prologo ? r.auto : 'Nuova') : 'Vuota';                                           // l'auto (v0.120: la scheda dice anche dove sei)
        const dove = r && r.prologo ? `${r.luogo ? r.luogo + ' · ' : ''}km ${km(r.km)}` : '';
        const pie = r && r.prologo ? euro(r.soldi) + (n === u ? ' · in uso' : q ? ' · ' + q : '') : r ? (n === u ? 'in uso' : '') : 'si parte da capo' + (n === u ? ' · in uso' : '');
        b.innerHTML = `<b></b><span class="ed" role="button" title="Cambia nome" aria-label="Cambia nome">✎</span><span class="a">${t}</span>${dove ? `<span class="d">${dove}</span>` : ''}<i>${pie}</i>`;
        b.querySelector('b').textContent = slotNome(M, n);
        b.querySelector('.ed').addEventListener('click', (e) => {
          e.stopPropagation(); e.preventDefault();
          let nome; try { nome = window.prompt('Nome della partita (max 14 lettere)', slotNome(M, n)); } catch (err) { nome = null; }
          if (nome == null) return; const m = metaGet(); m[n] = Object.assign(m[n] || {}, { nome: nome.trim().slice(0, 14) }); metaSet(m); disegna();
        });
        b.addEventListener('click', (e) => {
          e.stopPropagation(); if (n === inUso()) return;
          if (!conferma) { vai(n); return; }
          const old = box.querySelector('.nr-slot-ask'); if (old) old.remove();
          const a = document.createElement('div'); a.className = 'nr-slot-ask';
          a.innerHTML = `<span>Passare a <b class="nm"></b>? Quella di adesso si salva e resta qui. Il gioco riparte dal titolo.</span><button type="button" class="si">Sì, cambia</button><button type="button" class="no">No</button>`;
          a.querySelector('.nm').textContent = slotNome(metaGet(), n);
          a.querySelector('.si').addEventListener('click', (ev) => { ev.stopPropagation(); if (vai(n) === false) a.querySelector('span').textContent = 'Prima esci dal locale, poi cambia partita.'; });
          a.querySelector('.no').addEventListener('click', (ev) => { ev.stopPropagation(); a.remove(); });
          box.appendChild(a);
        });
        row.appendChild(b);
      }
    };
    disegna(); box._disegna = disegna;
    return box;
  }

  // sulla schermata iniziale: sopra «Accendi e parti»
  function titolo() {
    const go = document.getElementById('goBtn'); if (!go || document.querySelector('#introMenu .nr-slots')) return;
    const c = caselle(false); go.parentNode.insertBefore(c, go);
    const small = go.parentNode.querySelector('small'), tn = small && [...small.childNodes].find((n) => n.nodeType === 3);   // solo il testo: il link «Crediti» (crediti.js) resta
    if (tn) tn.data = 'Tre partite separate in questo browser (una a testa e una di prova). ';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', titolo); else titolo();

  // nel menu, scheda Partita (menu.js lo mette in fondo): si ridisegna ogni volta che si vede
  function panel() {
    const p = document.createElement('div'); p.className = 'panel';
    const h = document.createElement('h2'); h.textContent = 'Salvataggi'; p.appendChild(h);
    const c = caselle(true); c.querySelector('.nr-slots-h').remove(); p.appendChild(c);
    const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = 'Tre partite separate: ognuna con la sua auto, i suoi soldi, i suoi pezzi e il suo personaggio. «Nuovo viaggio» cancella solo quella in uso.'; p.appendChild(hint);
    if (typeof IntersectionObserver !== 'undefined') new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) c._disegna(); }).observe(p);
    return p;
  }

  window.NightSalvataggi = { panel, vai, get inUso() { return inUso(); }, riassunto, aggiorna: () => { for (const bx of document.querySelectorAll('.nr-slots')) { const w = bx.parentNode; if (w && w._disegna) w._disegna(); } } };
})();

if (typeof window !== 'undefined') Object.assign(window, { SLOT, slotRiassunto, slotScambia, slotNome, slotQuando });
