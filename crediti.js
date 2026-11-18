// ============================================================================
//  Night Run · I crediti (dopo menu.js)
//  Una schermata a tutto schermo con chi ha fatto il gioco e il materiale di altri che usa, come chiedono le licenze
//  (il modello 3D della Supra è CC BY 4.0: il credito deve essere visibile). Si apre dalla schermata iniziale
//  ("Crediti" sotto Accendi e parti) e dal menu, scheda Partita. Esc o un clic fuori la chiudono.
//  L'elenco è in CREDITI: tenerlo uguale a "Crediti da mostrare nel gioco" in LICENZE.md.
// ============================================================================
const CREDITI = [
  ['Il gioco', [
    ['Ideato, disegnato e scritto da', 'il proprietario e suo cognato'],
    ['Musica originale', 'del proprietario, fatta con Gemini (Google)'],
  ]],
  ['Modelli e suoni', [
    ['Modello 3D Toyota Supra MK4 (LowPoly)', 'di Mike Farrant, licenza CC BY 4.0, modificato (scala, ruote separate, texture ridotte)'],
    ['Suono registrato del motore', '"Import car revs on chassis dyno with turbo" di editboy23 (Freesound), CC0'],
  ]],
  ['Programmi e caratteri', [
    ['three.js', 'licenza MIT'],
    ['Caratteri', 'Russo One, Barlow Semi Condensed, Share Tech Mono, Saira Stencil One, Bangers, Black Ops One (SIL OFL); Permanent Marker (Apache 2.0)'],
  ]],
];

(() => {
  if (typeof document === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const css = document.createElement('style');
  css.textContent = `
.crediti{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:24px 16px;background:rgba(5,4,8,.88);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:crIn .25s ease-out}
.crediti[hidden]{display:none}
@keyframes crIn{from{opacity:0}}
.crediti .cr-card{width:min(620px,100%);max-height:100%;overflow:auto;padding:26px 26px 22px;background:linear-gradient(180deg,#1c1a16,#0b0a10);box-shadow:inset 0 0 0 1px #4a4234,inset 0 2px 0 var(--amber,#ffb347),0 30px 80px rgba(0,0,0,.7);color:#f0e6d2}
.crediti h2{margin:0;font:400 30px/1 var(--f-display,Impact,sans-serif);font-style:italic;text-transform:uppercase;letter-spacing:.04em}
.crediti h2 em{color:transparent;-webkit-text-stroke:1.5px var(--amber,#ffb347)}
.crediti .cr-sub{margin:4px 0 18px;font:400 13px/1 var(--f-display,Impact,sans-serif);letter-spacing:.2em;color:var(--amber,#ffb347)}
.crediti h3{margin:16px 0 8px;font:600 11px/1 var(--f-data,monospace);letter-spacing:.16em;text-transform:uppercase;color:#a8936a}
.crediti dl{margin:0;display:grid;gap:8px}
.crediti dt{font:600 15px/1.25 var(--f-body,sans-serif)}
.crediti dd{margin:2px 0 0;font:400 14px/1.4 var(--f-body,sans-serif);color:#c8bca4}
.crediti .cr-foot{margin-top:20px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;font:400 12px/1.3 var(--f-data,monospace);color:#7d6d52}
.crediti .cr-foot button{border:0;padding:10px 22px;font:400 15px/1 var(--f-display,Impact,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:#141a04;background:var(--lime,#c9dd5a);cursor:pointer;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.cr-link{border:0;background:none;padding:0;margin-left:4px;color:inherit;text-decoration:underline;cursor:pointer;font:inherit}`;
  document.head.appendChild(css);

  const box = document.createElement('div'); box.className = 'crediti'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Crediti');
  box.innerHTML = `<div class="cr-card"><h2>Night <em>Run</em></h2><p class="cr-sub">THE LAST HIGHWAY · CREDITI</p>`
    + CREDITI.map(([h, rows]) => `<h3>${esc(h)}</h3><dl>${rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>`).join('')
    + `<div class="cr-foot"><span>Grazie a chi rende libero il proprio lavoro.</span><button type="button" id="crClose">Chiudi</button></div></div>`;
  document.body.appendChild(box);

  let back = null;
  function open() { back = document.activeElement; box.hidden = false; $('crClose').focus(); }
  function close() { box.hidden = true; if (back && back.focus) back.focus(); }
  $('crClose').addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  // Esc chiude i crediti e basta (non arriva al menu); finché sono aperti i tasti non vanno al gioco
  window.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    e.stopImmediatePropagation();
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  }, true);

  const btn = (cls, text) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = text; b.addEventListener('click', open); return b; };
  // schermata iniziale: sotto "Accendi e parti"
  const intro = document.querySelector('#introMenu small'); if (intro) intro.appendChild(btn('cr-link', 'Crediti'));
  // menu, scheda Partita
  const part = document.querySelector('.gm-page[data-tab="partita"] .panel'); if (part) part.appendChild(btn('kbtn', 'Crediti'));

  window.NightCrediti = { open, close };
})();
