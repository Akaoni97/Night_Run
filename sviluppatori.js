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

  // ---- teletrasporto: a un km, o davanti alla prossima tappa di un tipo (come fa strumenti/prova.js), da fermi
  const TAPPE = [['bar', 'Bar'], ['fuel', 'Benzinaio'], ['grill', 'Autogrill'], ['niko', 'Niko'], ['shop', 'Luca Tuning'], ['style', 'Neon Kustom'], ['motel', 'Motel'], ['dealer', 'Autosalone'], ['junk', 'Sfascio']];
  function vaiKm(km) {
    const g = G(); if (!g || !isFinite(km) || km < 0) return false;
    g.s.dist = km * 1000; g.s.far = Math.max(g.s.far || 0, g.s.dist); g.sim.v = 0; save(); return true;
  }
  function vaiTappa(id) {
    const g = G(); if (!g || typeof VG === 'undefined') return null;
    let n = Math.max(0, Math.ceil((g.s.dist + 20 - VG_STOP0) / VG_STEP));
    for (let j = 0; j < 400 && VG.stop(n).id !== id; j++) n++;
    if (VG.stop(n).id !== id) return null;
    const x = VG.stopX(n); vaiKm((x - 9) / 1000); return x / 1000;
  }
  // ---- bisogni, benzina, danni: una volta (riempi, ripara) o sempre (infiniti, indistruttibile: si rimettono al massimo ogni 0,3 s)
  function riempi() {
    const g = G(); if (!g) return false;
    const N = g.s.vg && g.s.vg.needs; if (N) { N.food = N.water = N.sleep = N.wash = N.pee = N.poo = 1; }
    g.sim.fuel = 1; save(); return true;
  }
  function ripara() {
    const g = G(); if (!g) return false;
    g.sim.damage = 0; g.sim.tireWear = 0; save(); return true;
  }
  const DEVK = 'nr_dev', dev = (() => { try { return JSON.parse(localStorage.getItem(DEVK) || '{}') || {}; } catch (e) { return {}; } })();
  const devSet = (k, v) => { dev[k] = !!v; try { localStorage.setItem(DEVK, JSON.stringify(dev)); } catch (e) { /* ignora */ } };
  setInterval(() => {
    const g = G(); if (!g || !g.sim) return;
    if (dev.bisogni) { const N = g.s.vg && g.s.vg.needs; if (N) { N.food = N.water = N.sleep = N.wash = N.pee = N.poo = 1; } g.sim.fuel = 1; }
    if (dev.indistruttibile) { g.sim.damage = 0; g.sim.tireWear = 0; }
  }, 300);
  // ---- meteo e ora: gli stessi selettori delle Impostazioni
  function scegli(id, v) { const el = document.getElementById(id); if (!el) return false; el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); return el.value === v; }
  // ---- storia: un flag di chat/storia (chatDebug e storiaDebug) e tutte le app del telefono
  function flag(f) { const g = G(); if (!g || !f || !window.chatDebug) return false; window.chatDebug.flag(f); save(); return true; }
  // «Sblocca Luca Garage»: l'app che ti porta da Luca Tuning, senza aspettare il cartellone (lucagarage.js)
  function luca() { if (!window.telefono || !window.telefono.install) return false; window.telefono.install('lug'); save(); return true; }
  function appTutte() {
    if (!window.telefono || typeof TEL_APP_OFFERS === 'undefined') return 0;
    let n = 0; for (const o of TEL_APP_OFFERS) { window.telefono.install(o.app); n++; } save(); return n;
  }

  // «Disabilita polizia»: la polizia si vede ma non può fermarti, multarti né inseguirti; autovelox e Tutor non multano (polizia.js, POL.off)
  function polizia(v) { const g = G(); if (!g || !g.polOffSet) return false; const r = g.polOffSet(v === undefined ? !POL.off : v); save(); return r; }

  let box = null;
  function panel() {
    if (box) return box;
    box = document.createElement('div'); box.className = 'panel dev';
    box.innerHTML = `<style>
.dev .dv { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 14px; }
.dev .dv input { width: 150px; box-sizing: border-box; padding: 8px 10px; background: #1e1b28; color: #fff; border: 1px solid #4a4458; border-radius: 8px; font: 700 15px/1 var(--f-data, monospace); }
.dev .dv button { padding: 8px 12px; border: 1px solid #4a4458; border-bottom-width: 3px; border-radius: 8px; background: #2a2636; color: #fff; font: 700 13px/1 var(--f-data, monospace); cursor: pointer; }
.dev .dv button:hover { border-color: #ffb347; color: #ffd27a; }
.dev .dv button.big { background: #ffb347; color: #1a1206; border-color: #ffb347; }
.dev .dvck { display: flex; align-items: center; gap: 10px; margin: 8px 0 14px; font: 700 14px/1 var(--f-data, monospace); color: #fff; cursor: pointer; }
.dev .dvck input { width: 20px; height: 20px; accent-color: #ffb347; }
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
<h3>Vai a</h3>
<div class="dv"><input id="devKm" type="number" min="0" step="0.5" inputmode="decimal" placeholder="km"><button type="button" id="devVai" class="big">Vai al km</button></div>
<div class="dv" id="devTappe">${TAPPE.map(([id, n]) => `<button type="button" data-t="${id}">${n}</button>`).join('')}</div>
<h3>Bisogni e benzina</h3>
<div class="dv"><button type="button" id="devRiempi" class="big">Riempi tutto</button></div>
<label class="dvck"><input type="checkbox" id="devBis"><span>Bisogni e benzina infiniti</span></label>
<h3>Danni e usura</h3>
<div class="dv"><button type="button" id="devRipara" class="big">Ripara tutto</button></div>
<label class="dvck"><input type="checkbox" id="devInd"><span>Indistruttibile (carrozzeria e gomme sempre a posto)</span></label>
<h3>Meteo e ora</h3>
<div class="dv" id="devMeteo">${[['auto', 'dinamico'], ['sereno', 'sereno'], ['pioggia', 'pioggia'], ['nebbia', 'nebbia'], ['neve', 'neve'], ['vento', 'vento']].map(([v, n]) => `<button type="button" data-v="${v}">${n}</button>`).join('')}</div>
<div class="dv" id="devOra">${[['auto', 'dinamica'], ['giorno', 'giorno'], ['tramonto', 'tramonto'], ['notte', 'notte']].map(([v, n]) => `<button type="button" data-v="${v}">${n}</button>`).join('')}</div>
<h3>Storia e telefono</h3>
<p class="hint">Un flag della storia o delle chat (per esempio <code>ev_fase_v</code>) apre le conversazioni che lo aspettano. Le app si installano senza aspettare i cartelloni.</p>
<div class="dv"><input id="devFlag" type="text" placeholder="flag, es. ev_fase_v" autocapitalize="off" spellcheck="false"><button type="button" id="devFlagGo">Imposta flag</button></div>
<div class="dv"><button type="button" id="devApp">Installa tutte le app del telefono</button><button type="button" id="devPorta">Vai a L'ultima porta</button></div>
<div class="dv"><button type="button" id="devLuca">Sblocca Luca Garage</button></div>
<h3>Polizia</h3>
<p class="hint">Con la spunta la polizia c'è e si vede, ma non può fermarti, farti multe né inseguirti. Autovelox e Tutor restano sulla strada e non fanno niente; il ricercato si azzera. Si ricorda in questo browser finché non la togli.</p>
<label class="dvck"><input type="checkbox" id="devPol"><span>Disabilita polizia</span></label>
<h3>Modifiche</h3>
<p class="hint">Sblocca tutti i pezzi dell'officina (motore, turbo, scarico, centralina, limitatore...) e tutta l'estetica, senza pagarli e senza i chilometri richiesti. Poi si montano come sempre.</p>
<div class="dv"><button type="button" id="devUnlock" class="big">Sblocca tutto per questa auto</button><button type="button" id="devUnlockAll">Sblocca per tutte le auto del garage</button></div>
<p class="res" id="devRes" aria-live="polite"></p>`;
    const $ = (id) => box.querySelector('#' + id), say = (t) => { $('devRes').textContent = t; };
    const upd = () => { const g = G(); if (g && $('devCash')) $('devCash').textContent = '€ ' + fmt(g.s.money || 0); };
    $('devSet').addEventListener('click', () => { const v = parseFloat($('devMoney').value); if (!isFinite(v) || v < 0) { say('Scrivi un importo.'); return; } setMoney(v); upd(); say('Contanti: € ' + fmt(v)); });
    $('devMoney').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('devSet').click(); });   // i tasti del gioco non devono muovere l'auto mentre si scrive
    $('devAdd').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const n = +b.dataset.n; if (n) addMoney(n); else setMoney(0); upd(); say(n ? '+ € ' + fmt(n) : 'Contanti azzerati'); });
    $('devKm').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('devVai').click(); });
    $('devFlag').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('devFlagGo').click(); });
    $('devVai').addEventListener('click', () => { const k = parseFloat($('devKm').value); say(vaiKm(k) ? `Sei al km ${k.toString().replace('.', ',')}, fermo.` : 'Scrivi un km.'); });
    $('devTappe').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const k = vaiTappa(b.dataset.t); say(k === null ? 'Tappa non trovata.' : `Davanti a ${b.textContent}, km ${k.toFixed(1).replace('.', ',')}.`); });
    $('devRiempi').addEventListener('click', () => say(riempi() ? 'Fame, sete, sonno, igiene e benzina al massimo.' : 'Serve una partita in corso.'));
    $('devRipara').addEventListener('click', () => say(ripara() ? 'Carrozzeria e gomme come nuove.' : 'Serve una partita in corso.'));
    $('devBis').checked = !!dev.bisogni; $('devBis').addEventListener('change', (e) => { devSet('bisogni', e.target.checked); say(e.target.checked ? 'Bisogni e benzina fissi al massimo.' : 'Bisogni e benzina tornano a scendere.'); });
    $('devInd').checked = !!dev.indistruttibile; $('devInd').addEventListener('change', (e) => { devSet('indistruttibile', e.target.checked); say(e.target.checked ? 'Indistruttibile: danni e usura restano a zero.' : 'Danni e usura tornano normali.'); });
    $('devMeteo').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) say(scegli('meteoSel', b.dataset.v) ? 'Meteo: ' + b.textContent + '.' : 'Meteo non cambiato.'); });
    $('devOra').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) say(scegli('clockSel', b.dataset.v) ? 'Ora: ' + b.textContent + '.' : 'Ora non cambiata.'); });
    $('devFlagGo').addEventListener('click', () => { const f = $('devFlag').value.trim(); say(flag(f) ? `Flag «${f}» impostato.` : 'Scrivi un flag.'); });
    $('devApp').addEventListener('click', () => { const n = appTutte(); say(n ? `${n} app installate (aprile dal telefono, tasto 0).` : 'Telefono non pronto.'); });
    $('devLuca').addEventListener('click', () => say(luca() ? 'Luca Garage sbloccata: aprila dal telefono (tasto 0), ti porta da Luca Tuning.' : 'Telefono non pronto.'));
    $('devPorta').addEventListener('click', () => { const g = G(); if (g && g.vgPorta) { g.vgPorta(); say("L'ultima porta."); } else say('Non disponibile.'); });
    $('devPol').checked = typeof POL !== 'undefined' && !!POL.off;
    $('devPol').addEventListener('change', (e) => { const r = polizia(e.target.checked); e.target.checked = r; say(r ? 'Polizia disabilitata: non ti ferma, non multa, non insegue.' : 'Polizia di nuovo in servizio.'); });
    $('devUnlock').addEventListener('click', () => { const g = G(), n = unlock(); say(`${n ? n + ' modifiche sbloccate' : 'Era già tutto sbloccato'} per ${g && g.car ? g.car : "quest'auto"}.`); });
    $('devUnlockAll').addEventListener('click', () => { const n = unlockAll(); say(n ? `${n} modifiche sbloccate in tutto il garage.` : 'Era già tutto sbloccato.'); });
    setInterval(() => { if (box.offsetParent) upd(); }, 500); upd();
    return box;
  }
  window.NightDev = { panel, setMoney, addMoney, unlock, unlockAll, polizia, vaiKm, vaiTappa, riempi, ripara, flag, appTutte, luca, dev };
})();
