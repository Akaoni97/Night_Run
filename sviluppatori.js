// ============================================================================
//  Night Run · Sviluppatori (prima di menu.js)
//  Scheda "Sviluppatori" del menu (Tab): strumenti per provare il gioco senza giocarlo tutto. Soldi a piacere e tutte le modifiche
//  (pezzi dell'officina e estetica) sbloccate per l'auto in uso o per tutte quelle del garage. Non serve per giocare: cambia il salvataggio.
//  window.NightDev.panel() dà il pannello (lo usa menu.js), .setMoney(n) / .addMoney(n) / .unlock(carId) / .unlockAll() fanno le cose da codice.
// ============================================================================
(function () {
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Math.round(n).toLocaleString('it-IT');
  const save = () => { try { window.nightRun.save(); } catch (e) { /* niente */ } };

  function setMoney(n) { const g = G(); if (!g || !isFinite(n)) return false; g.s.money = Math.max(0, Math.round(n)); save(); return true; }
  function addMoney(n) { const g = G(); return !!g && setMoney((g.s.money || 0) + n); }

  // tutti i pezzi dell'officina e dell'estetica di un'auto: si segnano come posseduti, come se li avessi comprati (km e prezzo non contano più)
  function unlock(carId) {
    const g = G(); if (!g) return 0;
    const id = carId || g.car, pre = id === 'supra' ? '' : id + '|', own = g.s.owned || (g.s.owned = {});
    const cat = id === 'supra' ? TUNING_SUPRA : (CARS[id] && CARS[id].tuning) || {};
    const cos = Object.assign({}, typeof GAME_COSMETICS !== 'undefined' ? GAME_COSMETICS : {}, (CARS[id] && CARS[id].body) || {});
    if (id !== 'supra') { delete cos.stripe; delete cos.tint; delete cos.decal; }
    let n = 0;
    const mark = (key) => { if (!own[key]) { own[key] = true; n++; } };
    for (const k of Object.keys(cat)) for (const it of (cat[k].items || [])) mark(pre + k + ':' + it.id);
    for (const k of Object.keys(cos)) for (const it of (cos[k].items || [])) mark(pre + 'cos:' + k + ':' + it.id);
    save();
    return n;
  }
  function unlockAll() {
    const g = G(); if (!g) return 0;
    const ids = new Set(Object.keys(g.s.cars || {})); ids.add(g.car);
    let n = 0; for (const id of ids) n += unlock(id);
    return n;
  }

  let box = null;
  function panel() {
    if (box) return box;
    box = document.createElement('div'); box.className = 'panel dev';
    box.innerHTML = `<style>
.dev .dv { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 14px; }
.dev .dv input { width: 150px; padding: 8px 10px; background: #1e1b28; color: #fff; border: 1px solid #4a4458; border-radius: 8px; font: 700 15px/1 var(--f-data, monospace); }
.dev .dv button { padding: 8px 12px; border: 1px solid #4a4458; border-bottom-width: 3px; border-radius: 8px; background: #2a2636; color: #fff; font: 700 13px/1 var(--f-data, monospace); cursor: pointer; }
.dev .dv button:hover { border-color: #ffb347; color: #ffd27a; }
.dev .dv button.big { background: #ffb347; color: #1a1206; border-color: #ffb347; }
.dev .cash { font: 700 22px/1 var(--f-display, sans-serif); color: #b8ff3a; letter-spacing: .04em; margin: 6px 0 2px; }
.dev .res { min-height: 1.3em; color: #8fe0a0; font-size: 13px; margin: 0 0 10px; }
.dev h3 { margin: 16px 0 4px; font: 600 12px/1 var(--f-data, monospace); letter-spacing: .12em; text-transform: uppercase; color: #ffd27a; }
</style>
<h2>Sviluppatori</h2>
<p class="hint">Strumenti per provare il gioco: cambiano il salvataggio. Non servono per giocare.</p>
<h3>Soldi</h3>
<div class="cash" id="devCash">€ 0</div>
<div class="dv"><input id="devMoney" type="number" min="0" step="100" inputmode="numeric" placeholder="importo"><button type="button" id="devSet" class="big">Imposta</button></div>
<div class="dv" id="devAdd"><button type="button" data-n="1000">+ € 1.000</button><button type="button" data-n="10000">+ € 10.000</button><button type="button" data-n="100000">+ € 100.000</button><button type="button" data-n="1000000">+ € 1.000.000</button><button type="button" data-n="0">Azzera</button></div>
<h3>Modifiche</h3>
<p class="hint">Sblocca tutti i pezzi dell'officina (motore, turbo, scarico, centralina, limitatore...) e tutta l'estetica, senza pagarli e senza i chilometri richiesti. Poi si montano come sempre.</p>
<div class="dv"><button type="button" id="devUnlock" class="big">Sblocca tutto per questa auto</button><button type="button" id="devUnlockAll">Sblocca per tutte le auto del garage</button></div>
<p class="res" id="devRes" aria-live="polite"></p>`;
    const $ = (id) => box.querySelector('#' + id), say = (t) => { $('devRes').textContent = t; };
    const upd = () => { const g = G(); if (g && $('devCash')) $('devCash').textContent = '€ ' + fmt(g.s.money || 0); };
    $('devSet').addEventListener('click', () => { const v = parseFloat($('devMoney').value); if (!isFinite(v) || v < 0) { say('Scrivi un importo.'); return; } setMoney(v); upd(); say('Contanti: € ' + fmt(v)); });
    $('devMoney').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('devSet').click(); });   // i tasti del gioco non devono muovere l'auto mentre si scrive
    $('devAdd').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const n = +b.dataset.n; if (n) addMoney(n); else setMoney(0); upd(); say(n ? '+ € ' + fmt(n) : 'Contanti azzerati'); });
    $('devUnlock').addEventListener('click', () => { const g = G(), n = unlock(); say(`${n ? n + ' modifiche sbloccate' : 'Era già tutto sbloccato'} per ${g && g.car ? g.car : "quest'auto"}.`); });
    $('devUnlockAll').addEventListener('click', () => { const n = unlockAll(); say(n ? `${n} modifiche sbloccate in tutto il garage.` : 'Era già tutto sbloccato.'); });
    setInterval(() => { if (box.offsetParent) upd(); }, 500); upd();
    return box;
  }
  window.NightDev = { panel, setMoney, addMoney, unlock, unlockAll };
})();
