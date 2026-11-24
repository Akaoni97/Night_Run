// ============================================================================
//  Night Run · Il regista della storia (dopo regia.js)
//  Fa girare la trama sulle dodici capitali: le fasi seguono le capitali raggiunte (Parigi = II, Londra = III, Madrid = IV, Atene = V),
//  i momenti garantiti impostano i flag di regia (`ev_*`) che aprono le conversazioni, le quattro incursioni sono tratti a tempo
//  («le lampade della galleria si spengono una dopo l'altra»), e a Washington D.C. c'è «L'ultima porta» con quattro scelte e cinque finali.
//  Stato in `game.s.vg.story`; flag e contatori nel motore chat (`game.s.chat`). Funzioni pure provate in test/storia.test.js.
//  Regole della bozza (docs/storia/STORIA_BOZZA_02.md §8-§10): nessuna penalità per il tempo reale, il menu e il telefono fermano le lampade,
//  un fallimento non si ripete e lascia una conseguenza che non è economica.
// ============================================================================
const STORIA_FASE = { tokyo: 'I', roma: 'I', parigi: 'II', londra: 'III', stoccolma: 'III', berlino: 'III', praga: 'III', vienna: 'III', madrid: 'IV', lisbona: 'IV', atene: 'V', washington: 'V' };
const STORIA_FASI = ['I', 'II', 'III', 'IV', 'V'];
// momenti garantiti: quando la capitale è raggiunta (e passati `dopo` km) imposta il flag che apre la conversazione o la scena
const STORIA_BEATS = [
  { id: 'distanza', cap: 'parigi', dopo: 1, flag: 'ev_distanza_impossibile' },
  { id: 'sangue', cap: 'stoccolma', dopo: 1, flag: 'ev_indizio_sangue' },
  { id: 'foto', cap: 'praga', dopo: 1, flag: 'ev_foto_originale' },
  { id: 'imitazione_dario', cap: 'lisbona', dopo: 1, flag: 'ev_imitazione_dario' },
  { id: 'presenza', cap: 'madrid', dopo: 1, flag: 'ev_presenza_scoperta' },
  { id: 'faseV', cap: 'atene', dopo: 0, flag: 'ev_fase_v' },
];
// le quattro incursioni: lampade (una ogni `lampT` secondi di gioco attivo), metri da fare fino alla porta, sottotitoli (mai più di otto parole)
const STORIA_INC = {
  1: { nome: 'Il passaggio', lampade: 5, lampT: 16, metri: 1300, from: 'Rosa', sub: ['Corsia libera. Tieni la destra.', 'Se n\'è andata una lampada.', 'Non guardarti indietro.', 'Ne mancano due. Spingi!', 'Ultima lampada. Vai!'], ok: 'La porta è aperta. Passa prima che si chiuda.' },
  2: { nome: 'Tornare con qualcuno', lampade: 6, lampT: 16, metri: 1500, from: 'Rosa', sub: ['Marco è dietro. Non frenare.', 'Si è spenta la prima.', 'Resta in corsia.', 'Dai, ce la fate!', 'È quasi buio.', 'L\'ultima. Adesso!'], ok: 'Marco è fuori, insieme a te. Respira piano.' },
  3: { nome: 'Recuperare chi è stato lasciato', lampade: 4, lampT: 16, metri: 1100, from: 'Rosa', sub: ['La strada sta cambiando.', 'Più veloce, prima che cambi.', 'Manca poco.', 'Adesso o mai più.'], ok: 'Il punto dove aspettare. C\'è ancora qualcuno.' },
  4: { nome: 'Il varco della presenza', lampade: 5, lampT: 15, metri: 1600, from: 'Sconosciuto', sub: ['Il confine è lì davanti.', 'Chi passa lo scegli tu.', 'La luce cala.', 'Questa non è più la tua strada.', 'Decidi adesso.'], ok: 'Sei al confine. Adesso tocca a te decidere.' },
};
const STORIA_EPI = {
  A: [['ELENA', 'Sono io. Dai, chiedimi una cosa stupida.'], ['TU', 'Come si chiama il tuo gatto?'], ['ELENA', 'Fufi. E non fare quella faccia, è un nome serissimo.'],
    ['TU, PENSIERO', 'Non ho dovuto controllare niente. Stavolta mi è bastato ascoltarla.'], ['ELENA', 'Hai la voce stanca. Dove sei, adesso?'], ['TU', 'Quasi a casa. Dimmi una cosa vera.'],
    ['ELENA', 'Mi sei mancato. Ecco, l\'ho detto. Adesso fai finta di niente.'], ['TU, PENSIERO', 'Rosa è rimasta su una strada che io non faccio più. Le scriverò, appena trovo qualcosa da dirle.']],
  C: [['TU, PENSIERO', 'La porta non si muove. Dall\'altra parte continuano a bussare.'], ['TU', 'Irene.'], ['TU', 'Ho la foto. So come ti chiamavi, e dove hanno smesso di cercarti.'],
    ['TU, PENSIERO', 'I colpi si fanno più deboli, come una mano che si stanca.'], ['LIVIA', 'Dimmi che l\'hai detto ad alta voce.'], ['TU', 'L\'ho detto. Non ha risposto.'],
    ['TU, PENSIERO', 'La porta non si apre più. Solo dopo mi accorgo che manca una voce che conoscevo.'], ['LIVIA', 'Chi è uscito e chi no lo sapremo da chi risponde al telefono.']],
  D: [['TU, PENSIERO', 'Rosa torna a casa. Io resto vicino al varco: qualcuno deve farlo.'], ['ELENA', 'Pronto? Chi parla? Questo numero mi sembra di conoscerlo.'], ['TU', 'Ho sbagliato numero. Mi scusi.'],
    ['TU, PENSIERO', 'Non insisto. Se insisto, stanotte non dorme.'], ['TU', 'Ha la macchina in panne? Spenga, aspetti un minuto e riaccenda. A volte basta.'],
    ['TU, PENSIERO', 'Non sono la presenza. Sono uno che ha scelto dove stare.'], ['TU, PENSIERO', 'La strada davanti è libera. Poi si ricomincia a guidare, come sempre.'], ['TU, PENSIERO', 'Domani arriverà un altro viaggiatore.']],
};
const STORIA_FINALI = { A: 'Rientro', B1: 'Ospite inconsapevole', B2: 'Ospite consapevole', C: 'Chiusura', D: 'Il viaggio continua' };

if (typeof REGIA_EPI !== 'undefined') Object.assign(REGIA_EPI, STORIA_EPI);        // A, C e D si leggono con lo stesso lettore di B1 e B2

function storiaState(s) {
  if (!s.vg) s.vg = {};
  if (!s.vg.story) s.vg.story = { beats: {}, inc: {}, att: null, offerte: {}, verSkip: 0, copie: 2, fine: null };
  return s.vg.story;
}
// la fase attuale: la più alta tra le capitali raggiunte
function storiaFase(s) {
  const f = chatState(s).flags; let m = 0;
  for (const [id, fa] of Object.entries(STORIA_FASE)) if (f['luogo_' + id]) m = Math.max(m, STORIA_FASI.indexOf(fa));
  return STORIA_FASI[m];
}
const storiaIncFatte = (s) => Object.keys(storiaState(s).inc).length;
// prove indipendenti: i momenti che il giocatore ha davvero incontrato
function storiaProve(s) {
  const f = chatState(s).flags, st = storiaState(s);
  return ['ev_distanza_impossibile', 'ev_indizio_sangue', 'ev_foto_originale', 'ev_presenza_scoperta', 'elena_verificata'].filter((k) => f[k]).length + (st.inc[1] ? 1 : 0);
}
// le quattro scelte della scena finale, con il motivo scritto quando sono grigie
function storiaPorta(s) {
  const c = chatState(s), f = c.flags, r = regiaState(s), n = storiaIncFatte(s), prove = storiaProve(s), st = storiaState(s);
  const scelte = [];
  const motivo = [];
  if (!f.ev_uscita_autentica) motivo.push('Non hai ancora visto un\'uscita vera.'); else if (n < 2) motivo.push('Troppe poche incursioni alle spalle.'); else if (r.patto === 'esplicito') motivo.push('Qualcuno è con te: non esci da solo.');
  scelte.push({ id: 'A', label: 'Esci', ok: !motivo.length, motivo: motivo[0] });
  let mA = null;
  if (r.varco !== 'aperto') mA = 'Il varco non è aperto: nessuno te l\'ha chiesto davvero.';
  const motivoB2 = prove >= 3 && ((f.ottavio_non_salvo && (f.marco_dentro || f.livia)) || r.patto === 'esplicito');
  const b1 = !f.elena_verificata && st.verSkip >= 3;
  if (!mA && !motivoB2 && !b1) mA = 'Non sai ancora cosa lasceresti entrare.';
  scelte.push({ id: mA ? 'B' : (motivoB2 ? 'B2' : 'B1'), label: 'Apri', ok: !mA, motivo: mA });
  let mC = null;
  if (!f.ev_foto_originale) mC = 'Ti manca l\'originale della foto.'; else if (n < 2) mC = 'Troppe poche incursioni alle spalle.'; else if (r.patto === 'esplicito') mC = 'Hai un patto aperto con la presenza.'; else if (chatConfOf(c, 'Livia') < 25) mC = 'Non sai ancora chi sta dietro. Livia non ti ha detto abbastanza.'; else if (prove < 3) mC = 'Non hai tre prove indipendenti.';
  scelte.push({ id: 'C', label: 'Chiudi', ok: !mC, motivo: mC });
  const mD = f.promessa_rosa ? null : 'Nessuna promessa ti tiene qui.';
  scelte.push({ id: 'D', label: 'Resta', ok: !mD, motivo: mD });
  return scelte;
}
const chatConfOf = (c, who) => (c.conf && c.conf[who]) || 0;
// i finali lasciano il segno (campo `fine`) e la partita continua in guida libera
function storiaFinale(s, id) {
  const st = storiaState(s); if (!STORIA_FINALI[id]) return false;
  st.fine = id; const f = chatState(s).flags; f['fine_' + id] = 1;
  if (id === 'A' && f.ottavio_salvo) f.ottavio_telefona = 1;                        // variante A+: Ottavio telefona a Livia
  return true;
}
// il costo scelto per portare Marco: si applica una volta, prima di entrare nell'incursione
function storiaCostoMarco(s, g) {
  const c = chatState(s), st = storiaState(s), f = c.flags; let lamp = 0;
  if (f.mc_carico) regiaUnaVolta(s, 'mc_carico', () => { if (g && g.vgAnnullaLavoro) g.vgAnnullaLavoro(); });
  if (f.mc_copia) regiaUnaVolta(s, 'mc_copia', () => { st.copie = Math.max(0, st.copie - 1); f.copia_lasciata_marco = 1; });      // mai l'originale: quello è da Livia
  if (f.mc_lampada) lamp = 1;
  return { lampade: lamp };
}

// ------------------------------------------------------------ grafica e ciclo (solo nel gioco)
(function storiaUI() {
  if (typeof StreetGame === 'undefined' || typeof document === 'undefined') return;
  const P = StreetGame.prototype, orig = P.vgUpdate;
  let hud = null, dark = null;
  const css = document.createElement('style');
  css.textContent = `#stHud{position:fixed;top:172px;left:50%;transform:translateX(-50%);z-index:60;font:600 13px system-ui;color:#ffd9a0;text-align:center;pointer-events:none;text-shadow:0 1px 3px #000}
#stHud b{display:block;font:700 11px system-ui;letter-spacing:.2em;text-transform:uppercase;opacity:.75}#stHud .l{font-size:22px;letter-spacing:6px}#stHud .l i{opacity:.25;font-style:normal}
#stHud .m{height:5px;width:200px;margin:5px auto 0;background:#fff2;border-radius:3px;overflow:hidden}#stHud .m u{display:block;height:100%;background:#ffb64a}
#stDark{position:fixed;inset:0;z-index:55;pointer-events:none;background:radial-gradient(ellipse at center,transparent 25%,#000 100%);transition:opacity 1.2s}
#stPorta{position:fixed;inset:0;z-index:99998;background:#05060aee;display:grid;place-items:center;font-family:system-ui;color:#e8e8f0}
#stPorta .c{max-width:560px;padding:24px;text-align:center}#stPorta h2{font:700 13px system-ui;letter-spacing:.3em;text-transform:uppercase;opacity:.6;margin:0 0 6px}
#stPorta p{font:20px/1.5 Georgia,serif;margin:0 0 22px}#stPorta .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#stPorta button{font:700 16px system-ui;padding:12px;border-radius:12px;border:1px solid #ffffff44;background:#1b1d29;color:#fff;cursor:pointer}
#stPorta button:disabled{opacity:.4;cursor:default}#stPorta small{display:block;font:400 11px system-ui;opacity:.8;margin-top:3px}`;
  document.head.appendChild(css);
  const ensure = () => {
    if (hud) return;
    hud = document.createElement('div'); hud.id = 'stHud'; hud.hidden = true; document.body.appendChild(hud);
    dark = document.createElement('div'); dark.id = 'stDark'; dark.style.opacity = '0'; document.body.appendChild(dark);
  };
  const fermo = () => (window.gameMenu && window.gameMenu.isOpen) || (window.telefono && window.telefono.isOpen);

  // ---- incursioni
  P.vgIncStart = function (n, extra = {}) {
    const st = storiaState(this.s), D = STORIA_INC[n]; if (!D || st.inc[n] || st.att) return false;
    const lamp = Math.max(2, D.lampade - (extra.lampade || 0));
    st.att = { n, lamp, tot: lamp, rest: lamp * D.lampT, d0: this.s.dist, m: D.metri, sub: -1 };
    this.say(`${D.nome}. ${D.from === 'Rosa' ? 'Rosa è in radio.' : 'Una voce nella galleria.'}`, 'bad'); return true;
  };
  P.vgIncEnd = function (ok) {
    const s = this.s, st = storiaState(s), a = st.att; if (!a) return; st.att = null; st.inc[a.n] = ok ? 'ok' : 'no';
    const km = vgKm(this), c = chatState(s), f = c.flags;
    if (ok) {
      this.say(STORIA_INC[a.n].ok, 'info'); f['ev_incursione_' + a.n + '_conclusa'] = 1;
      if (a.n === 1) { chatSetConf(s, km, 'Rosa', 5); c.cnt.legami++; }
      if (a.n === 2) { f.marco_salvo = 1; c.cnt.legami++; chatSetConf(s, km, 'Rosa', 3); }
      if (a.n === 3) { f.ottavio_salvo = 1; delete f.ottavio_non_salvo; c.cnt.legami++; }
      if (a.n === 4) { f.ev_scelta_varco = 1; regiaScena(s, km, 'V2_VARCO_01'); }
    } else { this.say('Si spegne l\'ultima lampada. La porta si chiude.', 'bad'); regiaFallimento(s, km, a.n); }     // rifugio, scena d'uscita e conseguenza che dura
    if (hud) hud.hidden = true; if (dark) dark.style.opacity = '0';
  };
  const tickInc = function (dt) {
    const st = storiaState(this.s), a = st.att; if (!a) return;
    ensure(); const D = STORIA_INC[a.n], done = this.s.dist - a.d0;
    if (!fermo() && !this.prompt) a.rest -= dt;
    const lamp = Math.max(0, Math.ceil(a.rest / D.lampT)), spente = a.tot - lamp;
    if (spente > a.sub && spente > 0 && D.sub[Math.min(spente, D.sub.length - 1)]) { a.sub = spente; this.say(`${D.from}: ${D.sub[Math.min(spente - 1, D.sub.length - 1)]}`, 'bad'); }
    hud.hidden = false;
    hud.innerHTML = `<b>${D.nome}</b><div class="l">${'●'.repeat(lamp)}<i>${'●'.repeat(spente)}</i></div><div class="m"><u style="width:${Math.min(100, done / a.m * 100)}%"></u></div>${Math.max(0, Math.round(a.m - done))} m alla porta`;
    dark.style.opacity = String(Math.min(0.85, spente / a.tot));
    if (done >= a.m) this.vgIncEnd(true); else if (a.rest <= 0) this.vgIncEnd(false);
  };
  P.vgAnnullaLavoro = function () {
    const v = this.s.vg, m = v.mis; if (m && m.phase === 'carry') { m.phase = 'go'; m.toN = null; m.pax = null; }
    if (v.cassa) v.cassa = v.cassa.filter((x) => x.kind !== 'missione');
  };

  // ---- offerte (una domanda alla volta, solo quando il giocatore può rispondere)
  const offri = function (id, titolo, testo, si, no) {
    const st = storiaState(this.s), km = vgKm(this); st.cool = st.cool || {};
    if (st.offerte[id] === 'si' || this.prompt || st.att || fermo() || (st.cool[id] || 0) > km) return false;
    st.cool[id] = km + 3;                                                    // ignorata o rifiutata: ne riparliamo più avanti
    return this.ask({ kind: 'story', title: titolo, text: testo, time: 25, options: [{ label: si.label, act: () => { st.offerte[id] = 'si'; si.act(); } }, { label: no, act: () => { st.offerte[id] = 'no'; if (id === 'vicino') st.verSkip++; } }] });
  };
  const kmDa = (g, cap) => { const a = g.s.vg.storyArr && g.s.vg.storyArr[cap]; return a === undefined ? -1 : vgKm(g) - a; };
  P.vgStoria = function () {
    const s = this.s, st = storiaState(s), c = chatState(s), f = c.flags, km = vgKm(this), v = s.vg;
    v.storyArr = v.storyArr || {}; const lid = this.loc && this.loc.id;
    if (lid && STORIA_FASE[lid] && v.storyArr[lid] === undefined) v.storyArr[lid] = km;
    // momenti garantiti
    for (const b of STORIA_BEATS) if (!st.beats[b.id] && f['luogo_' + b.cap] && kmDa(this, b.cap) >= b.dopo) { st.beats[b.id] = 1; f[b.flag] = 1; }
    if (st.att || this.inside) return;
    const fase = STORIA_FASI.indexOf(storiaFase(s)), inc = st.inc;
    // incursione 1 (fase III) · 2 (fase V, con la scena dei costi di Marco) · 3 (promessa) · 4 (patto)
    if (fase >= 2 && !inc[1] && kmDa(this, 'londra') >= 2) offri.call(this, 'inc1', 'Il passaggio', 'Rosa, in radio: «C\'è una corsia libera fino alla porta. Le lampade si spengono una a una. Vieni?»', { label: 'Entro', act: () => this.vgIncStart(1) }, 'Non ora');
    if (fase >= 4 && inc[1] && !inc[2] && !st.marco && kmDa(this, 'atene') >= 2) offri.call(this, 'inc2', 'Tornare con qualcuno', 'Rosa: «Marco ha l\'auto rotta, di là. Per portarlo devi lasciare qualcosa. Ne parliamo?»', { label: 'Ne parliamo', act: () => { st.marco = 1; const mm = this.s.vg.mis, r = regiaMarcoCosti(s, { lavoro: !!(mm && mm.phase === 'carry'), copie: st.copie, lampade: 1 }); regiaScena(s, km, 'V2_MARCO_costo_01'); } }, 'Non ora');
    if (st.marco && !inc[2] && !st.att) {                                              // finita la scena dei costi, si entra
      const th = c.th.Rosa; if (th && th.done.V2_MARCO_costo_06 && !th.at) { const x = storiaCostoMarco(s, this); this.vgIncStart(2, x); }
    }
    if (fase >= 4 && inc[2] && !inc[3] && f.promessa_rosa && kmDa(this, 'atene') >= 4) offri.call(this, 'inc3', 'Recuperare chi è stato lasciato', 'Rosa: «Mi avevi promesso di tornare per lui. Il punto d\'attesa cambia tra poco. Andiamo?»', { label: 'Andiamo', act: () => this.vgIncStart(3) }, 'Non ora');
    if (fase >= 4 && inc[2] && !inc[4] && f.patto_esplicito) offri.call(this, 'inc4', 'Il varco della presenza', 'Una voce nella galleria: «Ti porto al confine. Poi decidi tu chi passa.»', { label: 'Vado', act: () => this.vgIncStart(4) }, 'No');
    // uscita autentica (seconda incursione + tre prove) e il vicino di Elena (verifica esterna vera, proposta fino a tre volte)
    if (inc[2] && storiaProve(s) >= 3 && !f.ev_uscita_autentica) { f.ev_uscita_autentica = 1; regiaScena(s, km, 'V2_USCITA_01'); }
    if (f.ev_presenza_scoperta && !f.ev_verifica_vicino && st.offerte.vicino !== 'si' && st.verSkip < 3 && kmDa(this, 'madrid') >= 3 + st.verSkip * 6)
      offri.call(this, 'vicino', 'Il vicino di Elena', 'Puoi chiamare il vicino di Elena da una sosta: andrà alla porta e ti dirà cosa vede. Chiami?', { label: 'Chiamo', act: () => regiaScena(s, km, 'V2_VICINO_01') }, 'Più tardi');
    const vth = c.th.Elena; if (st.offerte.vicino === 'si' && vth && vth.done.V2_VICINO_06 && !f.elena_verificata) regiaVicinoConfermato(s);
    // L'ultima porta: a Washington D.C., se non hai già scelto
    if (lid === 'washington' && !st.fine && !st.portaOfferta && kmDa(this, 'washington') >= 4) { st.portaOfferta = 1; this.vgPorta(); }
    if (lid !== 'washington') st.portaOfferta = 0;
  };

  // ---- L'ultima porta: quattro azioni, alcune grigie col motivo scritto
  P.vgPorta = function () {
    const s = this.s, st = storiaState(s); if (st.fine || document.getElementById('stPorta')) return false;
    const box = document.createElement('div'); box.id = 'stPorta';
    const scelte = storiaPorta(s);
    box.innerHTML = `<div class="c"><h2>L'ultima porta</h2><p>Il telefono squilla: è Elena. Vera o no, è l'ultima chiamata prima che la porta decida per te.</p><div class="g">${scelte.map((x, i) => `<button data-i="${i}" ${x.ok ? '' : 'disabled'}>${x.label}${x.ok ? '' : `<small>${x.motivo}</small>`}</button>`).join('')}</div><p style="margin:16px 0 0;font-size:13px;opacity:.6"><a href="#" id="stPortaOra" style="color:inherit">Non ancora</a></p></div>`;
    document.body.appendChild(box);
    box.querySelector('#stPortaOra').addEventListener('click', (e) => { e.preventDefault(); box.remove(); st.portaOfferta = 0; });
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      const x = scelte[+b.dataset.i]; if (!x.ok) return; box.remove();
      const id = x.id; storiaFinale(s, id);
      const km = vgKm(this);
      const fine = () => { this.say(`Finale: ${STORIA_FINALI[id]}. La guida continua.`, 'info'); if (typeof saveGame === 'function') saveGame(); };
      if (id === 'D') regiaScena(s, km, 'V2_GUARDIA_01');
      if (!regiaEpilogo(id, fine)) fine();
    }));
    return true;
  };

  P.vgUpdate = function (dt) {
    orig.call(this, dt);
    if (this.mode !== 'career' || !this.s.vg) return;
    if (typeof chatState !== 'function') return;
    tickInc.call(this, dt);
    this._stT = (this._stT || 0) + dt; if (this._stT >= 1) { this._stT = 0; this.vgStoria(); }
  };
  if (typeof window !== 'undefined') window.storiaDebug = {
    stato: () => { const g = window.nightRun.game; return { fase: storiaFase(g.s), story: storiaState(g.s), prove: storiaProve(g.s), porta: storiaPorta(g.s).map((x) => x.label + (x.ok ? '' : ' ✗ ' + x.motivo)) }; },
    inc: (n) => window.nightRun.game.vgIncStart(n), fine: (ok) => window.nightRun.game.vgIncEnd(ok), porta: () => window.nightRun.game.vgPorta(),
    flag: (f) => { chatState(window.nightRun.game.s).flags[f] = 1; },
  };
})();
