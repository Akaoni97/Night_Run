// ============================================================================
//  Night Run · Il telefono (dopo menu.js)
//  Uno smartphone sopra la strada, che si apre col tasto 0 o col pulsante TELEFONO. Si guida mentre è aperto.
//  App normali: Telefono, Messaggi, Rubrica, Lavori (bacheca e consegne vere), Mappa, Foto, Orologio.
//  App strane (arrivano con la storia): Passeggeri, Ultima Uscita, Segreteria.
//  Tutto è una funzione dei km del viaggio: TEL_SMS dice quando arriva ogni messaggio, TEL_ATTI quando la storia
//  cambia momento (0, 1, 2). I testi sono SEGNAPOSTO in attesa della storia: si cambiano qui, in TEL_SMS e dintorni.
//  Si vive in un ombra (Shadow DOM): la grafica del telefono non tocca quella della pagina.
//  Dal resto del gioco: window.telefono.sms(...), .ring(chi), .open(), .close(), .setAtto(n).
//  Altri file possono aggiungere un'app: window.telefono.addApp({ id, name, icon, color, badge, render, after, click, css })
//  (icona sulla home, schermata, tocchi sugli elementi con data-x; vedi valigette.js).
// ============================================================================
const TEL_ATTI = [0, 150, 400];                       // km da cui comincia l'atto 0, 1, 2 (segnaposto)
// messaggi: da chi, a che km arrivano, testo; dir 'o' = lo scrivi tu; bad = sporco (rosso)
const TEL_SMS = [
  { from: 'Studio Ferri', km: 0, text: 'Buonasera, siamo lo studio Ferri. L\'eredità di suo zio Remo è pronta.' },
  { from: 'Studio Ferri', km: 0, text: 'Domani alle 9, via dei Cantieri 12. Porti un documento.' },
  { from: 'Studio Ferri', km: 0, dir: 'o', text: 'Arrivo.' },
  { from: 'Officina Niko', km: 2, text: 'Il tagliando te lo faccio a metà prezzo se passi stasera.' },
  { from: 'Motel Ovunque', km: 4, text: 'Camera 7 libera. La cassa la trovi già dentro.' },
  { from: 'Zio Remo', km: 150, bad: 1, text: 'Hai preso la Volvo. Giusto così.' },
  { from: 'Zio Remo', km: 400, bad: 1, text: 'sei già passato di qui' },
  { from: 'Zio Remo', km: 400.1, bad: 1, dir: 'o', text: 'chi sei' },
  { from: 'Zio Remo', km: 400.2, bad: 1, text: 'non fermarti' },
  { from: 'Sconosciuto', km: 401, bad: 1, text: 'l\'uscita 4 non c\'è mai stata' },
];
// rubrica: nome, ruolo, atto da cui compare
const TEL_RUBRICA = [['Studio Ferri', 'Notaio', 0], ['Zio Remo', 'Parente', 0], ['Officina Niko', 'Meccanico', 0], ['Da Luca Tuning', 'Pezzi e tuning', 0],
  ['Benzina 24H', 'Benzinaio', 0], ['Motel Ovunque', 'Camere', 0], ['Sconosciuto', 'Numero nascosto', 1], ['Io', 'Il tuo numero', 2]];
// app da scaricare: all'inizio il telefono ha solo le cose normali. Sulla strada compaiono cartelloni con una sola domanda
// (niente «scarica»: lo dice il telefono quando lo superi). Funzionano a pixel: solo maiuscole, ? e !, due righe a capo con |.
// km = dove compare il cartellone; quando lo superi spunta l'icona da scaricare (il download è finto). Una per volta, in quest'ordine.
const TEL_APP_OFFERS = [
  { app: 'job', km: 0.6, name: 'Lavori', sign: 'PORTAFOGLIO|IN LUTTO?' },
  { app: 'pax', km: 2.5, name: 'Passeggeri', sign: 'TROPPO SILENZIO|IN AUTO?' },
  { app: 'motel', km: 6, name: 'Motel', sign: 'OCCHI CHE|SI CHIUDONO?' },
];
// prossimo cartellone da mettere sulla strada: il primo della lista non ancora toccato, se il km c'è già
const telNextOffer = (km, apps) => { for (const o of TEL_APP_OFFERS) { if (apps && apps[o.app]) continue; return km >= o.km ? o : null; } return null; };
const telAtto = (km) => { let a = 0; for (let i = 0; i < TEL_ATTI.length; i++) if (km >= TEL_ATTI[i]) a = i; return a; };
const telRecenti = (a) => {
  const r = [['Studio Ferri', 'Chiamata in uscita · 2:14', 'ieri', 0], ['Officina Niko', 'Persa', 'lun', 1]];
  if (a >= 1) r.unshift(['Zio Remo', 'Chiamata in arrivo · 0:00', '01:12', 2]);
  if (a >= 2) r.unshift(['Io', 'Chiamata in arrivo · 0:41', '03:07', 2], ['Sconosciuto', '14 chiamate perse', '03:07', 1]);
  return r;
};
// conversazioni dall'elenco dei messaggi già arrivati a quel km (la più recente in cima)
const telThreads = (km) => {
  const by = {}, order = [];
  for (const m of TEL_SMS) if (m.km <= km) { if (!by[m.from]) { by[m.from] = { n: m.from, m: [], bad: 0, km: m.km }; order.push(m.from); } const t = by[m.from]; t.m.push(m); t.km = m.km; if (m.bad) t.bad = 1; }
  return order.map((k) => by[k]).sort((x, y) => y.km - x.km);
};

(function telefono() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const NR = () => window.nightRun, G = () => NR() && NR().game;
  const km = () => { const g = G(); return g && g.s ? (g.s.dist || 0) / 1000 : 0; };
  const T = () => { const g = G(); if (!g || !g.s) return { read: {}, rang: {}, apps: {} }; const t = g.s.tel || (g.s.tel = { read: {}, rang: {}, apps: {} }); if (!t.apps) t.apps = {}; return t; };
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });

  // ------------------------------------------------------------ pagina in un ombra
  const host = document.createElement('div'); host.id = 'telefonoHost'; host.hidden = true;
  host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:60;transform-origin:bottom right;';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>
:host{all:initial}*{box-sizing:border-box}
.ph{position:relative;width:300px;height:620px;border-radius:50px;padding:10px;background:linear-gradient(145deg,#4a4d56,#17181c 40%,#2a2c33);box-shadow:0 0 0 1px #000,inset 0 0 0 2px #5a5d66,0 30px 60px rgba(0,0,0,.65);font:14px/1.3 system-ui,-apple-system,sans-serif;color:#eceef5;user-select:none;-webkit-user-select:none}
.ph::before,.ph::after{content:"";position:absolute;width:4px;background:#2a2c33;border-radius:2px}
.ph::before{left:-3px;top:130px;height:50px;box-shadow:0 70px 0 #2a2c33}.ph::after{right:-3px;top:170px;height:80px}
.scr{position:relative;width:100%;height:100%;border-radius:40px;overflow:hidden;background:#0c0d12;--s1:#161821;--s2:#20232e;--s3:#2c303d;--t2:#8d92a3;--blue:#3b82f6;--grn:#34c759;--red:#ff453a;--amb:#ffb347}
.isl{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:92px;height:26px;border-radius:14px;background:#000;z-index:30}
.sb{position:absolute;top:0;left:0;right:0;height:44px;display:flex;justify-content:space-between;align-items:center;padding:6px 26px 0;font:600 13px system-ui;z-index:25;pointer-events:none}
.sb span:last-child{display:flex;gap:5px;align-items:center;font-size:11px}
.bat{display:inline-block;width:22px;height:10px;border:1px solid #fff9;border-radius:3px;padding:1px}.bat i{display:block;height:100%;background:#fff;border-radius:1px;width:80%}.bat.low i{background:var(--red);width:12%}
.hb{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);width:100px;height:5px;border-radius:3px;background:#fffc;z-index:30;cursor:pointer}
.view{position:absolute;inset:0;padding:46px 0 22px;display:flex;flex-direction:column;overflow:hidden;animation:in .18s ease-out}
@keyframes in{from{opacity:0;transform:scale(.97)}}.quiet .view{animation:none}
.wall{background:radial-gradient(120% 60% at 50% 105%,rgba(255,179,71,.28),transparent 60%),linear-gradient(180deg,#05060c,#0f1220 60%,#1a1424)}
.wall::after{content:"";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,transparent,rgba(0,0,0,.45)),repeating-linear-gradient(0deg,rgba(255,179,71,.07) 0 2px,transparent 2px 14px);pointer-events:none}
.lock{align-items:center;text-align:center;padding-top:80px}.lock .tm{font:300 78px/1 system-ui;letter-spacing:-.02em}.lock .dt{color:#ffffffb0;margin-top:2px}
.notif{margin:auto 14px 60px;align-self:stretch;background:#ffffff1c;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:20px;padding:12px 14px;text-align:left;cursor:pointer;position:relative;z-index:1}
.notif b{display:flex;justify-content:space-between;font-size:13px}.notif small{color:#ffffffa0;font-size:11px;font-weight:400}.notif p{margin:3px 0 0;font-size:13px}
.widget{margin:6px 16px 0;padding:12px 14px;border-radius:20px;background:#ffffff14;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);position:relative;z-index:1}
.widget b{font:600 12px system-ui;color:#ffffffb0;text-transform:uppercase;letter-spacing:.06em}.widget div{font:300 30px/1.1 system-ui;margin-top:2px}.widget small{color:#ffffffa0}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 6px;padding:18px 14px 0;position:relative;z-index:1}
.ap{display:grid;justify-items:center;gap:5px;font:10.5px system-ui;color:#fff;background:none;border:0;padding:0;cursor:pointer;position:relative}
.ic{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;box-shadow:inset 0 1px 0 #fff3,0 3px 8px #0006}
.ic svg{width:27px;height:27px;fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.bd{position:absolute;top:-4px;right:2px;min-width:18px;height:18px;border-radius:9px;background:var(--red);font:700 11px/18px system-ui;text-align:center;padding:0 4px}
.dot{position:absolute;top:-2px;right:4px;width:11px;height:11px;border-radius:50%;background:var(--red);box-shadow:0 0 8px var(--red)}
.ap.offer .ic{background:#2c2c2e!important;box-shadow:inset 0 0 0 1.5px #ffffff55;animation:rg 1.4s ease-in-out infinite}.ap.offer .cl{color:#7fb0ff;font-weight:600}
.pg{width:46px;height:4px;border-radius:2px;background:#ffffff33;overflow:hidden;display:block}.pg i{display:block;height:100%;background:#34c759}
.strange .ic{background:linear-gradient(145deg,#3a0f14,#150608)!important;box-shadow:inset 0 0 0 1px #ff453a66,0 0 12px #ff453a55}
.strange{animation:flick 4s steps(1) infinite}@keyframes flick{0%,93%{opacity:1}95%{opacity:.35}97%{opacity:1}99%{opacity:.6}}
.app{background:#0c0d12}
.nav{display:flex;align-items:center;gap:6px;padding:4px 14px 8px;min-height:36px}
.nav .bk{border:0;background:none;color:var(--blue);font:15px system-ui;cursor:pointer;padding:4px 2px}
.nav h3{margin:0;font:700 26px/1.1 system-ui;letter-spacing:-.01em;flex:1}.nav.sm h3{font:600 16px/1.1 system-ui;text-align:center}
.body{flex:1;overflow:auto;padding:0 12px 12px;scrollbar-width:none}.body::-webkit-scrollbar{display:none}
.row{display:flex;gap:10px;align-items:center;padding:10px 6px;border-bottom:1px solid #ffffff12;cursor:pointer;min-width:0}.row:hover{background:#ffffff08}
.av{width:38px;height:38px;border-radius:50%;background:var(--s3);display:grid;place-items:center;font:700 14px system-ui;flex:none}.av.bad{background:#4a1118;color:#ffb3ae}
.row .tx{flex:1;min-width:0}.row b{display:block;font-weight:600;font-size:14px}.row small{display:block;color:var(--t2);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.row .rt{color:var(--t2);font-size:11px;flex:none}
.row.miss b{color:var(--red)}.row .un{background:var(--blue);color:#fff;border-radius:9px;min-width:18px;height:18px;font:700 11px/18px system-ui;text-align:center;padding:0 5px}
.chat{display:flex;flex-direction:column;gap:6px;justify-content:flex-end;min-height:100%;padding-bottom:6px}
.m{max-width:80%;padding:8px 11px;border-radius:17px;background:var(--s2);align-self:flex-start;font-size:13.5px}.m.me{background:var(--blue);align-self:flex-end}.m.bad{background:#3a1218;color:#ffb8b3}
.compose{margin:4px 10px 8px;padding:9px 14px;border-radius:20px;border:1px solid var(--s3);color:var(--t2);font-size:13px}
.tabs{display:flex;background:var(--s1);border-radius:10px;padding:2px;margin:2px 0 10px}.tabs button{flex:1;border:0;background:none;color:var(--t2);padding:6px;border-radius:8px;font:600 12px system-ui;cursor:pointer}.tabs button[aria-pressed=true]{background:var(--s3);color:#fff}
.card{background:var(--s1);border-radius:16px;padding:12px;margin-bottom:10px;display:grid;gap:6px}.card h4{margin:0;font:600 14px/1.25 system-ui}.card .meta{color:var(--t2);font-size:12px;display:flex;flex-wrap:wrap;gap:4px 10px}
.pay{font:700 17px system-ui;color:var(--grn)}
.btn{border:0;border-radius:11px;background:var(--blue);color:#fff;padding:9px 12px;font:600 13px system-ui;cursor:pointer;width:100%}.btn.g{background:var(--s3)}
.prog{height:5px;border-radius:3px;background:var(--s3);overflow:hidden}.prog i{display:block;height:100%;background:var(--amb)}
.tag{display:inline-block;padding:2px 7px;border-radius:6px;background:var(--s3);font-size:11px;color:var(--t2)}
.map{position:relative;margin:6px 10px;padding:12px 4px 12px 36px}.map::before{content:"";position:absolute;left:18px;top:14px;bottom:14px;width:4px;border-radius:2px;background:repeating-linear-gradient(180deg,#fff6 0 8px,transparent 8px 16px)}
.stop{position:relative;padding:7px 0;display:grid;gap:1px}.stop::before{content:"";position:absolute;left:-23px;top:12px;width:12px;height:12px;border-radius:50%;background:var(--amb);box-shadow:0 0 0 3px #0c0d12}
.stop.you::before{background:var(--blue);box-shadow:0 0 0 3px #0c0d12,0 0 12px var(--blue)}.stop.bad::before{background:var(--red);box-shadow:0 0 0 3px #0c0d12,0 0 12px var(--red)}
.stop b{font-size:14px;font-weight:600}.stop small{color:var(--t2);font-size:12px}
.ph3{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}.ph3 i{aspect-ratio:1;background:linear-gradient(160deg,#243b5a,#0f1624 60%,#3b2a1a);display:grid;place-items:end start;padding:4px;font:600 9px system-ui;color:#fffa;font-style:normal}
.ph3 i:nth-child(2n){background:linear-gradient(200deg,#3a2a4a,#10121c 65%,#4a3a1a)}.ph3 i.x{background:radial-gradient(circle at 50% 42%,#000 0 14%,transparent 15%),linear-gradient(180deg,#05060a,#1a0a0e);color:#ff8a80}
.big{font:300 64px/1 system-ui;text-align:center;margin:40px 0 6px;letter-spacing:-.02em}.cen{text-align:center;color:var(--t2)}
.bar{display:flex;gap:3px;align-items:flex-end;height:30px;flex:1}.bar i{flex:1;background:var(--amb);border-radius:2px;transform-origin:bottom;animation:wv 1s ease-in-out infinite}@keyframes wv{50%{transform:scaleY(.35)}}
.cd{font:700 56px/1 ui-monospace,Menlo,monospace;text-align:center;color:var(--red);text-shadow:0 0 18px #ff453a88;margin:30px 0 4px}
.call{position:absolute;inset:0;z-index:40;background:linear-gradient(180deg,#14161f,#05060a);display:flex;flex-direction:column;align-items:center;padding:90px 20px 50px;text-align:center;animation:in .2s}
.call .av{width:96px;height:96px;font-size:36px;margin-bottom:12px}.call h3{margin:0;font:600 28px system-ui}.call p{margin:4px 0 0;color:var(--t2)}
.call .act{margin-top:auto;display:flex;gap:70px}.call .act button{width:68px;height:68px;border-radius:50%;border:0;color:#fff;font-size:26px;cursor:pointer}
.ring{animation:rg 1s ease-in-out infinite}@keyframes rg{50%{box-shadow:0 0 0 14px #ffffff12}}
.toast{position:fixed;right:0;bottom:0;width:0;height:0}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style><div class="ph"><div class="scr" id="scr"></div></div>`;
  document.body.appendChild(host);

  // ------------------------------------------------------------ icone e stato
  const IC = {
    tel: '<path d="M6 3h3l2 5-2 1a11 11 0 006 6l1-2 5 2v3a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z"/>', msg: '<path d="M4 5h16v11H9l-5 4z"/>',
    con: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>', job: '<path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16"/>',
    map: '<path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>', pho: '<path d="M4 6h16v13H4zM4 16l5-4 4 3 3-2 4 3"/><circle cx="16" cy="10" r="1.3"/>',
    clk: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', pax: '<path d="M3 17l2-6h14l2 6zM7 17v2M17 17v2M5 11l1.5-4h11L19 11"/>',
    motel: '<path d="M3 19v-9M3 15h18v4M21 19v-6a3 3 0 00-3-3h-7v5"/><circle cx="7" cy="12" r="1.6"/>', get: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>',
    ext: '<path d="M12 3v18M5 6h12l3 3-3 3H5zM19 14H7l-3 3 3 3h12z"/>', vm: '<circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M7 15h10"/>' };
  const COL = { tel: '#34c759', msg: '#3b82f6', con: '#8e8e93', job: '#ff9f0a', map: '#5e5ce6', pho: '#af52de', clk: '#2c2c2e', pax: '#16a34a', motel: '#c2410c', get: '#2c2c2e', ext: '#000', vm: '#000' };
  const ic = (k) => `<span class="ic" style="background:${COL[k]}"><svg viewBox="0 0 24 24">${IC[k]}</svg></span>`;
  const ST = { on: false, view: 'lock', stack: [], tab: 0, call: null, cd: 3.2, atto: null, dl: null };
  const atto = () => (ST.atto !== null ? ST.atto : telAtto(km()));
  const clock = () => { if (atto() >= 2) return '03:07'; const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const unreadOf = (t) => { const r = T().read[t.n] || 0; return t.m.filter((x) => x.dir !== 'o').length - r > 0 ? t.m.filter((x) => x.dir !== 'o').length - r : 0; };
  const unread = () => telThreads(km()).reduce((s, t) => s + unreadOf(t), 0);
  const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const av = (n, bad) => `<span class="av ${bad ? 'bad' : ''}">${initials(n)}</span>`;
  const nav = (t, back) => `<div class="nav ${back ? 'sm' : ''}">${back ? '<button class="bk" data-back>‹ Indietro</button>' : ''}<h3>${t}</h3>${back ? '<span style="width:60px"></span>' : ''}</div>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ------------------------------------------------------------ schermate
  const status = () => `<div class="sb"><span>${clock()}</span><span>${atto() >= 1 ? '<span style="opacity:.5">▂▄▆</span>' : '▂▄▆▇'}<span class="bat ${atto() >= 2 ? 'low' : ''}"><i></i></span></span></div><div class="isl"></div><div class="hb" data-home></div>`;
  function lock() {
    const th = telThreads(km()), last = th[0], m = last ? last.m[last.m.length - 1] : null;
    return `<div class="view wall lock"><div class="tm">${clock()}</div><div class="dt">${new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}</div>${m ? `<div class="notif" data-open="msg"><b>${esc(last.n)}<small>ora</small></b><p>${esc(m.text)}</p></div>` : '<div style="margin-top:auto;margin-bottom:60px;color:#fff8">Nessuna notifica</div>'}</div>`;
  }
  function home() {
    const a = atto(), g = G(), goal = g && g.vgGoal ? g.vgGoal() : null, u = unread();
    const ap = T().apps || {}, DL = { job: ['job', 'Lavori', goal ? 1 : 0], pax: ['pax', 'Passeggeri'], motel: ['motel', 'Motel'] };
    // app aggiunte da altri file (addApp): se hanno un cartellone in TEL_APP_OFFERS si scaricano come le altre, se no ci sono subito
    for (const e of EXT) { DL[e.id] = [e.id, e.name, e.badge ? e.badge() : 0]; if (!TEL_APP_OFFERS.some((o) => o.app === e.id) && !ap[e.id]) ap[e.id] = { st: 'ok' }; }
    const apps = [['tel', 'Telefono'], ['msg', 'Messaggi', u], ['con', 'Rubrica'], ['map', 'Mappa'], ['pho', 'Foto'], ['clk', 'Orologio']];
    for (const k of Object.keys(DL)) if (ap[k] && ap[k].st === 'ok') apps.push(DL[k]);
    const str = []; if (a >= 2) str.push(['ext', 'Ultima Uscita'], ['vm', 'Segreteria']);
    const get = Object.keys(DL).filter((k) => ap[k] && (ap[k].st === 'offer' || ap[k].st === 'dl'));
    const gcell = (k) => { const d = ap[k].st === 'dl', p = d ? Math.min(100, Math.round((performance.now() - ST.dl.t0) / 35)) : 0;
      return `<button class="ap ${d ? '' : 'offer'}" data-get="${k}"><span class="ic" style="background:${COL[k]}"><svg viewBox="0 0 24 24">${IC[d ? k : 'get']}</svg></span>${d ? `<span class="pg"><i style="width:${p}%"></i></span>${p}%` : '<span class="cl">Scarica</span>'}</button>`; };
    const cell = (x, s) => `<button class="ap ${s ? 'strange' : ''}" data-open="${x[0]}">${ic(x[0])}${x[2] && !s ? `<span class="bd">${x[2]}</span>` : ''}${s ? '<span class="dot"></span>' : ''}${x[1]}</button>`;
    const nx = goal ? `${esc(goal.title)}: ${fmt(goal.left, 1)} km` : a >= 2 ? 'prossima uscita: —' : 'nessun lavoro in corso';
    return `<div class="view wall"><div class="widget"><b>km ${fmt(km(), 1)}</b><div>${clock()}</div><small>${nx}</small></div><div class="grid">${apps.map((x) => cell(x, 0)).join('')}${get.map(gcell).join('')}${str.map((x) => cell(x, 1)).join('')}</div></div>`;
  }
  const EXT = [];                                     // app aggiunte da altri file (addApp)
  const APPS = {
    tel() { return `<div class="view app">${nav('Recenti')}<div class="body">${telRecenti(atto()).map((r) => `<div class="row ${r[3] === 1 ? 'miss' : ''}" data-call="${esc(r[0])}">${av(r[0], r[3] === 2 && atto() > 0)}<span class="tx"><b>${esc(r[0])}</b><small>${esc(r[1])}</small></span><span class="rt">${r[2]}</span></div>`).join('')}</div></div>`; },
    msg() {
      const th = telThreads(km()), s = ST.stack[1];
      if (s !== undefined && th[s]) { const t = th[s]; T().read[t.n] = t.m.filter((x) => x.dir !== 'o').length; return `<div class="view app">${nav(esc(t.n), 1)}<div class="body"><div class="chat">${t.m.map((m) => `<div class="m ${m.dir === 'o' ? 'me' : ''} ${t.bad && m.dir !== 'o' ? 'bad' : ''}">${esc(m.text)}</div>`).join('')}</div></div><div class="compose">Scrivi un messaggio…</div></div>`; }
      return `<div class="view app">${nav('Messaggi')}<div class="body">${th.length ? th.map((t, i) => { const u = unreadOf(t); return `<div class="row" data-push="${i}">${av(t.n, t.bad)}<span class="tx"><b>${esc(t.n)}</b><small>${esc(t.m[t.m.length - 1].text)}</small></span>${u ? `<span class="un">${u}</span>` : ''}</div>`; }).join('') : '<p class="cen">Nessun messaggio.</p>'}</div></div>`;
    },
    con() { const a = atto(); return `<div class="view app">${nav('Rubrica')}<div class="body">${TEL_RUBRICA.filter((c) => a >= c[2]).map((c) => `<div class="row" data-call="${esc(c[0])}">${av(c[0], c[2] > 0)}<span class="tx"><b>${esc(c[0])}</b><small>${esc(c[1])}</small></span></div>`).join('')}</div></div>`; },
    job() {
      const g = G(); if (!g) return '';
      const goal = g.vgGoal ? g.vgGoal() : null, carried = g.s.trunk.filter((it) => it.to !== undefined && it.pay !== undefined || it.kind === 'missione' || it.first);
      const inside = g.inside && typeof VG_BOARDS !== 'undefined' && VG_BOARDS.includes(g.inside.id) ? g.inside : null;
      const n = inside ? VG.stopIndex(inside.x) : -1;
      const offers = inside ? g.vgOffers(n) : [];
      const att = `${goal ? `<div class="card"><h4>${esc(goal.title)}</h4><div class="pay">€ ${fmt(goal.pay)}</div><div class="meta"><span>${esc(goal.text)}</span><span>tra ${fmt(goal.left, 1)} km</span></div>${goal.note ? `<div class="meta"><span>${esc(goal.note)}</span></div>` : ''}</div>` : ''}${carried.map((it) => `<div class="card"><h4>${esc(it.name || it.kind)}</h4><div class="meta"><span>${fmt(it.kg, 1)} kg a bordo</span>${it.pay ? `<span>€ ${fmt(it.pay)} alla consegna</span>` : ''}</div></div>`).join('')}`;
      const dis = inside ? offers.map((o, i) => { const taken = (g.s.vg.taken || {})[n + ':' + o.k]; return `<div class="card"><h4>${esc(o.mission || o.first ? (o.title || 'Primo lavoro') + ' per ' + o.toName : fmt(o.kg, 0) + ' kg per ' + o.toName)}</h4><div class="pay">€ ${fmt(o.pay)}</div><div class="meta"><span>km ${fmt(o.kmTo, 1)}</span>${o.kg >= 50 ? `<span>${fmt(o.kg, 0)} kg</span>` : ''}</div>${taken ? '<div class="meta"><span>✓ già preso</span></div>' : `<button class="btn" data-take="${i}">Accetta il lavoro</button>`}</div>`; }).join('') : '<p class="cen">Le bacheche sono nei bar, negli autogrill e nei motel. Fermati in uno e le trovi qui.</p>';
      return `<div class="view app">${nav('Lavori')}<div class="body"><div class="tabs"><button data-tab="0" aria-pressed="${ST.tab === 0}">Attivi</button><button data-tab="1" aria-pressed="${ST.tab === 1}">Disponibili</button></div>${ST.tab === 0 ? att || '<p class="cen">Niente in corso.</p>' : dis}</div></div>`;
    },
    map() {
      const g = G(), d = g ? g.s.dist : 0, a = atto(), n = typeof VG !== 'undefined' ? VG.stopIndex(d) : 0, rows = [];
      for (let i = Math.max(0, n - 1); i <= n + 3; i++) { const p = VG.stop(i); rows.push([p, p.x / 1000]); }
      const before = rows.filter((r) => r[1] * 1000 <= d), after = rows.filter((r) => r[1] * 1000 > d);
      const line = (r) => `<div class="stop"><b>${esc(r[0].name)}</b><small>km ${fmt(r[1], 1)}</small></div>`;
      return `<div class="view app">${nav('Mappa')}<div class="body"><div class="card"><div class="meta"><span>Dove sei</span></div><h4 style="font-size:22px">km ${fmt(d / 1000, 1)}${a >= 2 ? ' · km 10' : ''}</h4></div><div class="map">${before.map(line).join('')}<div class="stop you"><b>Tu</b><small>${a >= 2 ? 'km 10 · km 10' : 'km ' + fmt(d / 1000, 1)}</small></div>${after.map(line).join('')}${a >= 2 ? '<div class="stop bad"><b>Uscita 4</b><small>non risulta nel database</small></div>' : ''}</div></div></div>`;
    },
    pho() { const a = atto(); return `<div class="view app">${nav('Foto')}<div class="body"><div class="ph3"><i>ieri</i><i>ieri</i><i>lun</i><i>lun</i><i>dom</i><i>dom</i>${a >= 1 ? '<i class="x">03:07</i>' : ''}${a >= 2 ? '<i class="x">03:07</i><i class="x">03:07</i>' : ''}</div>${a >= 1 ? `<p class="cen" style="font-size:12px;margin-top:12px">${a >= 2 ? '3 foto non scattate' : '1 foto non scattata'} da te</p>` : ''}</div></div>`; },
    clk() { const a = atto(); return `<div class="view app">${nav('Orologio')}<div class="body"><div class="big" ${a >= 2 ? 'style="color:var(--red)"' : ''}>${a >= 2 ? '--:--' : clock()}</div><p class="cen">${a >= 2 ? 'sveglia: 03:07 · impostata da te' : 'sveglia: nessuna'}</p></div></div>`; },
    motel() {
      const g = G(); if (!g) return ''; const d = g.s.dist, n0 = VG.stopIndex(d), list = [];
      for (let n = Math.max(0, n0 - 1); n < n0 + 40 && list.length < 3; n++) { const p = VG.stop(n); if (p.id === 'motel' && p.x >= d - 200) list.push(p); }
      const cassa = g.s.vg && g.s.vg.cassa ? g.s.vg.cassa.length : 0;
      return `<div class="view app">${nav('Motel Ovunque')}<div class="body"><div class="card"><div class="meta"><span>La tua cassa</span></div><h4 style="font-size:20px">${cassa ? cassa + (cassa === 1 ? ' oggetto' : ' oggetti') : 'Vuota'}</h4><div class="meta"><span>Ti aspetta in camera</span></div></div>${list.map((p) => `<div class="card"><h4>${esc(p.name)}</h4><div class="meta"><span>km ${fmt(p.x / 1000, 1)}</span><span>${p.x >= d ? 'tra ' + fmt((p.x - d) / 1000, 1) + ' km' : 'qui dietro'}</span></div><div class="pay">€ 45 a notte</div></div>`).join('') || '<p class="cen">Nessun motel in vista.</p>'}</div></div>`;
    },
    pax() {
      const g = G(), n = g && g.s.vg ? g.s.vg.pax.length : 0, a = atto(), seats = g && g.vgSeats ? g.vgSeats() : 0;
      return `<div class="view app">${nav('Passeggeri')}<div class="body"><div class="card"><div class="meta"><span>A bordo</span></div><h4 style="font-size:22px">${n ? n + (n === 1 ? ' persona' : ' persone') : 'Nessuno'}</h4><div class="meta"><span>Posti occupati: ${n + (a >= 2 ? 1 : 0)}${seats ? ' su ' + seats : ''}</span></div></div>${a >= 2 ? `<div class="row">${av('Nessuno')}<span class="tx"><b>Sedile dietro</b><small>occupato · non risulta salito</small></span></div><p class="cen" style="font-size:12px;margin-top:10px">Il conto non torna.</p>` : ''}</div></div>`;
    },
    ext() { return `<div class="view app">${nav('Ultima Uscita')}<div class="body"><div class="cd" id="cd">${ST.cd.toFixed(1)}</div><p class="cen">km all'uscita 4</p><p class="cen" style="font-size:12px;margin-top:22px">Il conto scende. Poi ricomincia.</p></div></div>`; },
    vm() { return `<div class="view app">${nav('Segreteria')}<div class="body">${[['Zio Remo', '0:07', 'domani'], ['Sconosciuto', '0:00', '03:07'], ['Io', '0:19', 'ora']].map((v) => `<div class="card"><div style="display:flex;gap:10px;align-items:center"><span class="av bad">▶</span><span class="tx" style="flex:1"><b>${v[0]}</b><small style="display:block;color:var(--t2);font-size:12px">ricevuto: ${v[2]} · ${v[1]}</small></span></div><div class="bar">${Array.from({ length: 22 }, (_, i) => `<i style="height:${20 + ((i * 37) % 70)}%;animation-delay:${i * 40}ms"></i>`).join('')}</div></div>`).join('')}<p class="cen" style="font-size:12px">«…tieni le mani sul volante…»</p></div></div>`; },
  };
  function callScreen() {
    const c = ST.call; if (!c) return '';
    if (c.live) return `<div class="call"><div class="av ${atto() > 0 ? 'bad' : ''}">${initials(c.who)}</div><h3>${esc(c.who)}</h3><p id="ct">${atto() > 0 ? 'in linea · nessuno parla' : 'in linea'} · 0:00</p><div class="act"><button style="background:#e5373a" data-decl>✕</button></div></div>`;
    return `<div class="call"><div class="av ring ${atto() > 0 ? 'bad' : ''}">${initials(c.who)}</div><h3>${esc(c.who)}</h3><p>${c.out ? 'chiamata in corso…' : 'chiamata in arrivo…'}</p><div class="act"><button style="background:#e5373a" data-decl>✕</button>${c.out ? '' : '<button style="background:#2fb750" data-acc>✆</button>'}</div></div>`;
  }
  function render(quiet) {
    const s = root.getElementById('scr'); if (!s) return; s.classList.toggle('quiet', !!quiet);
    const v = ST.view; s.innerHTML = status() + (v === 'lock' ? lock() : v === 'home' ? home() : APPS[v] ? APPS[v]() : home()) + callScreen();
    const ex = EXT.find((e) => e.id === v); if (ex && ex.after) ex.after(s);
    refreshBtn();
  }
  const open = (id) => { ST.view = id; ST.stack = [id]; ST.tab = 0; render(); };

  // ------------------------------------------------------------ tocchi
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-get],[data-open],[data-home],[data-back],[data-push],[data-tab],[data-take],[data-call],[data-decl],[data-acc],[data-x]'); if (!t) return;
    const D = t.dataset;
    if (D.x !== undefined) { const ex = EXT.find((a) => a.id === ST.view); if (ex && ex.click) ex.click(D, t); }
    else if (D.get) { if (!ST.dl) { const ap = T().apps; ap[D.get].st = 'dl'; ST.dl = { app: D.get, t0: performance.now() }; render(); } }
    else if (D.open) open(D.open);
    else if (D.home !== undefined) { ST.view = 'home'; ST.stack = []; if (ST.call && !ST.call.live) ST.call = null; render(); }
    else if (D.back !== undefined) { ST.stack = ST.stack.slice(0, 1); render(); }
    else if (D.push !== undefined) { ST.stack = [ST.view, +D.push]; render(); }
    else if (D.tab !== undefined) { ST.tab = +D.tab; render(); }
    else if (D.take !== undefined) {
      const g = G(), n = VG.stopIndex(g.inside.x), o = g.vgOffers(n)[+D.take]; if (!o) return;
      const r = g.vgTake(o, n); if (!r.ok) g.say(r.why, 'bad'); ST.tab = 0; render();
    }
    else if (D.call !== undefined) { ST.call = { who: D.call, out: true }; render(); }
    else if (D.decl !== undefined) { ST.call = null; render(); }
    else if (D.acc !== undefined) { ST.call = { who: ST.call.who, live: true, t0: performance.now() }; render(); }
  });

  // ------------------------------------------------------------ pulsante, apertura, scala
  let btn = null, toastEl = null;
  function refreshBtn() { if (!btn) return; const u = unread(); btn.classList.toggle('has', u > 0); const b = btn.querySelector('b'); if (b) { b.textContent = u; b.hidden = !u; } }
  function fit() { const k = Math.max(0.45, Math.min(1, (innerHeight - 32) / 620, (innerWidth - 32) / 300)); host.style.transform = `scale(${k})`; }
  function setOpen(on) {
    ST.on = on; host.hidden = !on; if (on) { fit(); if (ST.view === 'lock' || !ST.view) ST.view = 'lock'; render(); }
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  const top = document.querySelector('header.top');
  btn = document.createElement('button'); btn.type = 'button'; btn.className = 'menubtn'; btn.id = 'telBtn';
  btn.innerHTML = '<i aria-hidden="true"></i>TELEFONO<b hidden style="margin-left:6px;background:#ff453a;color:#fff;border-radius:9px;min-width:18px;padding:1px 5px;font:700 11px system-ui"></b><kbd>0</kbd>';
  btn.addEventListener('click', () => setOpen(!ST.on));
  if (top) top.appendChild(btn); else { btn.style.cssText = 'position:fixed;right:16px;top:16px;z-index:61'; document.body.appendChild(btn); }
  window.addEventListener('resize', fit);
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target.closest && e.target.closest('input, textarea'))) return;
    const gate = document.getElementById('gate'); if (gate && !gate.hidden && getComputedStyle(gate).display !== 'none') return;   // durante la sigla no
    if (e.key === '0') { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) setOpen(!ST.on); }
    else if (e.key === 'Escape' && ST.on) { e.preventDefault(); e.stopImmediatePropagation(); setOpen(false); }
  }, true);

  // avviso di messaggio nuovo: una striscia sopra la strada
  function toast(from, text, bad, go) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:62;max-width:min(340px,92vw);padding:10px 14px;border-radius:16px;background:rgba(18,20,28,.92);color:#eceef5;font:13px/1.3 system-ui;box-shadow:0 8px 24px #000a;cursor:pointer;transition:opacity .3s;opacity:0;pointer-events:none'; toastEl.addEventListener('click', () => { if (toastEl._go) { toastEl._go(); return; } setOpen(true); ST.view = 'msg'; ST.stack = ['msg']; render(); }); document.body.appendChild(toastEl); }
    toastEl._go = go || null;
    toastEl.innerHTML = `<b style="display:block;font-size:12px;color:${bad ? '#ff8a80' : '#8fb4ff'}">${esc(from)}</b>${esc(text)}`;
    toastEl.style.opacity = '1'; toastEl.style.pointerEvents = 'auto'; clearTimeout(toast.t); toast.t = setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.pointerEvents = 'none'; }, 4200);
  }
  function ring(who, o) { if (ST.call) return; ST.call = Object.assign({ who }, o); if (!ST.on) setOpen(true); ST.view = ST.view === 'lock' ? 'home' : ST.view; render(); }

  // ogni secondo: messaggi che arrivano coi km, chiamate scritte, conto alla rovescia e durata chiamata
  let seen = null;
  setInterval(() => {
    const g = G(); if (!g || !g.s || !g.s.vg || !g.s.vg.on) { if (ST.on) setOpen(false); host.hidden = true; if (btn) btn.hidden = true; return; }
    if (btn) btn.hidden = false;
    const k = km(), t = T(), n = TEL_SMS.filter((m) => m.km <= k).length;
    if (t.n === undefined) t.n = k < 1 ? 0 : n;
    if (n > t.n) { const m = TEL_SMS.filter((x) => x.km <= k && x.dir !== 'o').pop(); t.n = n; if (m) { toast(m.from, m.text, m.bad); if (ST.on && ST.view === 'msg') render(); } refreshBtn(); }
    // cartelloni delle app: il prossimo compare sulla strada davanti a te; quando lo superi spunta l'icona da scaricare
    const off = telNextOffer(k, t.apps);
    if (off && g.ents) { const x = g.s.dist + 260; t.apps[off.app] = { st: 'sign', x }; g.ents.push({ id: g.id++, kind: 'vgsign', lane: 0, x, v: 0, text: off.sign, app: true }); }
    for (const o of TEL_APP_OFFERS) { const p = t.apps[o.app]; if (p && p.st === 'sign' && g.s.dist >= p.x) { p.st = 'offer'; toast('Telefono', `Nuova app: ${o.name}. Tocca per scaricarla.`, 0, () => { setOpen(true); ST.view = 'home'; ST.stack = []; render(); }); if (ST.on && ST.view === 'home') render(); } }
    const a = telAtto(k); if (a >= 1 && !t.rang[a] && ST.atto === null) { t.rang[a] = 1; if (a === 1) ring('Zio Remo'); }
    if (seen !== a) { seen = a; if (ST.on && (ST.view === 'home' || ST.view === 'lock')) render(); }
    if (ST.on && ST.view === 'ext') { ST.cd = ST.cd <= 0.15 ? 3.2 : ST.cd - 0.1; const c = root.getElementById('cd'); if (c) c.textContent = ST.cd.toFixed(1); }
    if (ST.call && ST.call.live) { const ct = root.getElementById('ct'), s = Math.floor((performance.now() - ST.call.t0) / 1000); if (ct) ct.textContent = `${atto() > 0 ? 'in linea · nessuno parla' : 'in linea'} · 0:${String(s % 60).padStart(2, '0')}`; }
  }, 1000);

  // download finto: la barra sull'icona sale in 3,5 secondi, poi l'app c'è
  setInterval(() => {
    if (!ST.dl) return; const g = G(), p = (performance.now() - ST.dl.t0) / 3500;
    if (p < 1) { if (ST.on && ST.view === 'home') render(true); return; }
    const app = ST.dl.app, def = TEL_APP_OFFERS.find((o) => o.app === app); ST.dl = null;
    if (g && g.s.tel) g.s.tel.apps[app].st = 'ok';
    toast('Telefono', `${def ? def.name : 'App'} installata.`, 0, () => { setOpen(true); open(app); });
    if (ST.on && ST.view === 'home') render(); refreshBtn();
  }, 150);

  window.telefono = {
    install: (app) => { const t = T(); t.apps[app] = { st: 'ok' }; render(); },      // per provare o per la storia: l'app c'è subito, senza cartellone
    open: () => setOpen(true), close: () => setOpen(false), get isOpen() { return ST.on; }, ring,
    setAtto: (n) => { ST.atto = n === null || n === undefined ? null : n; render(); },   // per provare: 0, 1, 2; senza argomento torna ai km
    sms: (from, text, o = {}) => { TEL_SMS.push(Object.assign({ from, text, km: km() }, o)); toast(from, text, o.bad); refreshBtn(); },
    // app di altri file: icona (svg a tratto 24×24), colore, numerino, schermata (render → html), after(schermo), click(dataset)
    addApp(a) {
      EXT.push(a); IC[a.id] = a.icon; COL[a.id] = a.color; APPS[a.id] = a.render;
      if (a.css) { const st = document.createElement('style'); st.textContent = a.css; root.appendChild(st); }
    },
    render, show: (id) => { setOpen(true); open(id); }, get view() { return ST.view; }, toast,
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { TEL_ATTI, TEL_SMS, TEL_RUBRICA, TEL_APP_OFFERS, telAtto, telThreads, telNextOffer });
