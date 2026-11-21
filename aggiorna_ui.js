// Aggiornamenti del programma Windows (prima di menu.js): il pannello «Aggiornamenti» della scheda Partita.
// Esiste solo nel guscio Electron (desktop/): lì il preload mette a disposizione `window.nightUpdate`. Sul sito
// nel browser non c'è e il pannello non compare. Controllo, download e installazione partono solo da un clic.
(function () {
  'use strict';
  const api = window.nightUpdate;
  if (!api) { window.NightAggiorna = { panel: () => null }; return; }
  let stato = { fase: 'inattivo', versione: '', commit: null, nuova: null, percentuale: 0, messaggio: '', portatile: false, pagina: '' };
  let piuTardi = false, errore = '', occupato = false, box = null;

  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const dataIt = (iso) => { try { return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } };

  async function chiama(fn) {
    if (occupato) return;
    occupato = true; errore = ''; disegna();
    try { const r = await fn(); if (r && r.fase) stato = r; if (r && r.ok === false) errore = r.errore || 'Non riuscito.'; }
    catch (e) { errore = 'Non riuscito: ' + (e && e.message || e); }
    occupato = false; disegna();
  }
  const controlla = () => { piuTardi = false; return chiama(() => api.controlla()); };
  const scarica = () => chiama(() => api.scarica());
  const installa = () => chiama(async () => {
    try { if (window.nightRun && window.nightRun.save) window.nightRun.save(); } catch (e) { /* il preload prende comunque la fotografia */ }
    return api.installa();
  });

  function disegna() {
    if (!box) return;
    box.replaceChildren();
    box.appendChild(el('h2', '', 'Aggiornamenti'));
    const s = stato;
    box.appendChild(el('p', 'hint', 'Versione installata: ' + (s.versione || '?') + (s.commit ? ' · gioco ' + String(s.commit).slice(0, 7) : '')));
    if (s.messaggio) box.appendChild(el('p', 'agg-stato agg-' + s.fase, s.messaggio));
    if (errore) box.appendChild(el('p', 'agg-stato agg-fallito', errore));
    if (s.nuova && ['disponibile', 'scarico', 'pronto', 'fallito', 'offline'].includes(s.fase)) {
      const n = el('div', 'agg-nuova');
      n.appendChild(el('b', '', 'Versione ' + s.nuova.versione + (s.nuova.data ? ' · ' + dataIt(s.nuova.data) : '')));
      if (s.nuova.note) n.appendChild(el('p', 'hint', s.nuova.note));
      box.appendChild(n);
    }
    if (s.fase === 'scarico') {
      const bar = el('div', 'agg-bar'); const fill = el('i'); fill.style.width = s.percentuale + '%'; bar.appendChild(fill); box.appendChild(bar);
      box.appendChild(el('p', 'hint', s.percentuale + '% · puoi continuare a giocare'));
    }
    const riga = el('div', 'gm-row');
    const bottone = (txt, fn, off) => { const b = el('button', '', txt); b.type = 'button'; b.disabled = !!off || occupato; b.addEventListener('click', fn); riga.appendChild(b); return b; };
    if (s.fase === 'non-supportato') { /* niente pulsanti: solo il messaggio */ }
    else if (s.fase === 'pronto' && !s.portatile) {
      bottone('Installa e riavvia', installa);
      if (!piuTardi) bottone('Più tardi', () => { piuTardi = true; disegna(); });
      else riga.appendChild(el('span', 'hint', 'Resta pronto: lo installi quando vuoi.'));
    } else if (s.fase === 'disponibile' && s.portatile) {
      box.appendChild(el('p', 'hint', 'Questa è la copia portatile: non si aggiorna da sola. Scarica la nuova copia dalla pagina delle versioni.'));
      bottone('Apri la pagina del download', () => chiama(() => api.apriPagina()));
    } else if (s.fase === 'disponibile') {
      bottone('Scarica', scarica);
    } else if (s.fase === 'scarico') {
      bottone('Scarico...', () => {}, true);
    } else {
      bottone(s.fase === 'controllo' ? 'Controllo...' : 'Cerca aggiornamenti', controlla, s.fase === 'controllo');
    }
    box.appendChild(riga);
  }

  // Lo stato arriva anche dal processo principale (avanzamento del download, fine del controllo).
  api.onStato((s) => { stato = s; if (s.fase !== 'pronto') piuTardi = false; disegna(); });
  api.stato().then((s) => { stato = s; disegna(); }).catch(() => {});

  function panel() {
    if (box) return box;
    box = el('div', 'panel agg');
    const css = document.createElement('style');
    css.textContent = '.agg .agg-stato{margin:6px 0;font-weight:600}.agg .agg-fallito,.agg .agg-offline{color:#ff9a7a}.agg .agg-aggiornato,.agg .agg-pronto{color:#9dff8a}'
      + '.agg .agg-nuova{margin:8px 0;padding:8px 10px;border-left:3px solid var(--acc,#7fd3ff);background:rgba(255,255,255,.04)}'
      + '.agg .agg-bar{height:10px;border-radius:5px;background:rgba(255,255,255,.1);overflow:hidden;margin:8px 0 2px}.agg .agg-bar i{display:block;height:100%;background:var(--acc,#7fd3ff);transition:width .3s}';
    document.head.appendChild(css);
    disegna();
    return box;
  }
  window.NightAggiorna = { panel, controlla, stato: () => stato };
})();
