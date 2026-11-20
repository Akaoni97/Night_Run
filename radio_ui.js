// ============================================================================
//  Night Run · L'autoradio sulla strada (dopo menu.js)
//  Il riquadro della radio in alto a destra diventa il frontalino di un'autoradio notturna, poco più grande di prima:
//  vetro fumé con le righe del display, a sinistra l'equalizzatore a 9 barre e in basso una striscia di spettro
//  (si muovono solo quando la musica suona davvero), in alto la frequenza ambra con la spia ST e il nome della
//  stazione, sotto il titolo della canzone che scorre se è lungo, sul bordo la barra del brano, a destra il tasto P. Cambiando stazione le cifre girano come sulla sintonia e passa la neve.
//  index.html continua ad aggiornare #radioFreq e #radioName (qui nascosti, fanno da sorgente); questo file legge
//  window.nightRun.radioPlaying e .radioTrack. Con window.radioUI presente il cambio di stazione non fa più l'avviso
//  giallo al centro (il banner basta).
// ============================================================================
(() => {
  if (typeof document === 'undefined') return;
  const btn = document.getElementById('radioBtn'), srcF = document.getElementById('radioFreq'), srcN = document.getElementById('radioName');
  if (!btn || !srcF || !srcN) return;

  const css = document.createElement('style');
  css.textContent = `
.radio-chip.rv2{right:12px;top:12px;width:330px;max-width:48%;height:54px;padding:0 9px 6px 10px;display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:10px;
  border:0;border-radius:10px;overflow:hidden;text-align:left;cursor:pointer;color:#f0e6d2;
  background:linear-gradient(180deg,rgba(22,19,28,.84),rgba(9,8,13,.88));
  box-shadow:inset 0 0 0 1px rgba(255,179,71,.2),inset 0 1px 0 rgba(255,255,255,.07),0 8px 22px rgba(0,0,0,.38);
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:box-shadow .2s,filter .2s}
.radio-chip.rv2:hover{box-shadow:inset 0 0 0 1px rgba(255,179,71,.45),inset 0 1px 0 rgba(255,255,255,.09),0 8px 22px rgba(0,0,0,.38)}
.radio-chip.rv2::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,rgba(255,255,255,.028) 0 1px,transparent 1px 3px)}
.radio-chip.rv2::after{content:"";position:absolute;left:0;right:0;top:0;height:46%;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,0))}
.radio-chip.rv2 .rv-src{display:none}
.radio-chip.rv2 .rv-eq{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;height:32px;padding-bottom:1px;border-bottom:1px solid rgba(255,179,71,.25)}
.radio-chip.rv2 .rv-eq i{display:block;width:3px;height:100%;border-radius:1px 1px 0 0;transform-origin:50% 100%;transform:scaleY(.12);
  background:linear-gradient(0deg,#ff6a3a 0%,#ffb347 45%,#ffe08a 75%,#ff5fa8 100%);box-shadow:0 0 6px rgba(255,170,70,.45)}
.radio-chip.rv2 .rv-spec{position:absolute;left:10px;right:10px;bottom:3px;height:11px;display:flex;align-items:flex-end;gap:1px;pointer-events:none;opacity:.42;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.radio-chip.rv2 .rv-spec i{flex:1;height:100%;transform-origin:50% 100%;transform:scaleY(.08);background:linear-gradient(0deg,#ff5fa8,#4fe6ff)}
.radio-chip.rv2 .rv-mid{position:relative;z-index:1;display:grid;gap:3px;min-width:0}
.radio-chip.rv2 .rv-top{display:flex;align-items:baseline;gap:6px;min-width:0;white-space:nowrap}
.radio-chip.rv2 .rv-f{font:400 16px/1 var(--f-data);letter-spacing:.06em;color:#ffd36a;text-shadow:0 0 8px rgba(255,186,80,.75),0 0 1px #fff4d0}
.radio-chip.rv2 .rv-f small{font-size:10px;margin-right:3px;color:#ffb347;text-shadow:none;opacity:.85}
.radio-chip.rv2 .rv-stereo{font:700 7.5px/1 var(--f-data);letter-spacing:.08em;color:#4fe6ff;padding:1px 2px;border:1px solid rgba(79,230,255,.55);border-radius:2px;text-shadow:0 0 5px rgba(79,230,255,.8);opacity:.25}
.radio-chip.rv2.play .rv-stereo{opacity:1}
.radio-chip.rv2 .rv-sta{font:700 11px/1 var(--f-data);letter-spacing:.12em;text-shadow:0 0 6px rgba(255,95,168,.55);text-transform:uppercase;color:#ff8fb8;overflow:hidden;text-overflow:ellipsis;min-width:0}
.radio-chip.rv2 .rv-bot{overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 14px),transparent)}
.radio-chip.rv2 .rv-t{display:inline-block;font:600 14px/1.2 var(--f-body);color:#fff3de;text-shadow:0 1px 2px rgba(0,0,0,.6)}
.radio-chip.rv2.marq .rv-t{padding-right:30px;animation:rvMarq var(--rv-d,9s) linear infinite}
@keyframes rvMarq{0%,14%{transform:translateX(0)}86%,100%{transform:translateX(var(--rv-x,0))}}
.radio-chip.rv2 .rv-prog{position:absolute;left:0;right:0;bottom:0;display:block;height:2px;border-radius:1px;background:rgba(255,255,255,.08);overflow:hidden}
.radio-chip.rv2 .rv-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff5fa8,#ffb347);transition:width .25s linear}
.radio-chip.rv2 .rv-key{position:relative;z-index:1;display:grid;justify-items:center;gap:2px;font:600 10px/1 var(--f-data);color:#a8936a}
.radio-chip.rv2 .rv-key b{display:grid;place-items:center;width:16px;height:16px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(255,179,71,.35);color:#ffc56a;font:600 10px/1 var(--f-data)}
.radio-chip.rv2 .rv-key i{font-style:normal;font-size:8px;letter-spacing:-1px;color:#a8936a}
.radio-chip.rv2 .rv-snow{position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:screen;
  background:repeating-linear-gradient(0deg,rgba(255,255,255,.16) 0 1px,transparent 1px 2px),repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 2px,transparent 2px 5px)}
.radio-chip.rv2.tune .rv-snow{animation:rvSnow .6s steps(7) forwards}
@keyframes rvSnow{0%{opacity:.9;background-position:0 0,0 0}50%{opacity:.6;background-position:0 7px,11px 0}100%{opacity:0;background-position:0 3px,4px 0}}
.radio-chip.rv2.tune .rv-mid{animation:rvIn .45s ease-out}
@keyframes rvIn{0%{opacity:.35;filter:blur(1px)}100%{opacity:1;filter:none}}
.radio-chip.rv2.rvoff .rv-f{color:#6d6250;text-shadow:none}
.radio-chip.rv2.rvoff .rv-stereo{display:none}
.radio-chip.rv2.rvoff .rv-sta{color:#6d6250}
.radio-chip.rv2.rvoff .rv-t{color:#8a7d66}
.radio-chip.rv2.rvoff .rv-eq i,.radio-chip.rv2.rvoff .rv-spec i{background:#4a4234;box-shadow:none}
.radio-chip.rv2:focus-visible{outline:2px solid #ffb347;outline-offset:2px}
/* il pulsante dello schermo intero (e, a schermo intero, MENU e TELEFONO) scendono sotto il banner */
.fsbtn,.fsdock{top:72px}
/* schermi stretti o bassi (telefono): più piccolo, ma con stazione e canzone */
@media (max-width:600px),(max-height:520px){
  html .radio-chip.rv2{height:36px;width:280px;max-width:52%;grid-template-columns:24px minmax(0,1fr);gap:8px;padding:0 9px 4px 8px;transform:none}
  html .radio-chip.rv2 .rv-eq{display:flex;height:20px}
  html .radio-chip.rv2 .rv-spec{height:7px;bottom:2px}
  html .radio-chip.rv2 .rv-eq i{width:2px}
  html .radio-chip.rv2 .rv-mid{display:grid;gap:1px}
  html .radio-chip.rv2 .rv-top,html .radio-chip.rv2 .rv-spec{display:flex}
  html .radio-chip.rv2 .rv-stereo,html .radio-chip.rv2 .rv-key{display:none}
  html .radio-chip.rv2 .rv-sta,html .radio-chip.rv2 .rv-f,html .radio-chip.rv2 .rv-t{display:inline-block}
  html .radio-chip.rv2 .rv-bot,html .radio-chip.rv2 .rv-prog,html .radio-chip.rv2 .rv-snow{display:block}
  html .radio-chip.rv2 .rv-f{font-size:13px}
  html .radio-chip.rv2 .rv-sta{font-size:9.5px}
  html .radio-chip.rv2 .rv-t{font-size:12px}
  .fsbtn,.fsdock{top:58px}
}}`;
  document.head.appendChild(css);

  // la nuova faccia: le due sorgenti (aggiornate da index.html) restano dentro, nascoste
  btn.classList.add('rv2');
  srcF.classList.add('rv-src'); srcN.classList.add('rv-src');
  for (const n of [...btn.childNodes]) if (n !== srcF && n !== srcN) n.remove();
  const mk = (tag, cls, html) => { const e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; return e; };
  const eq = mk('span', 'rv-eq', '<i></i>'.repeat(9)), spec = mk('span', 'rv-spec', '<i></i>'.repeat(56));
  eq.setAttribute('aria-hidden', 'true'); spec.setAttribute('aria-hidden', 'true');
  const mid = mk('span', 'rv-mid'), top = mk('span', 'rv-top'), fShow = mk('span', 'rv-f'), stereo = mk('span', 'rv-stereo', 'ST'), sta = mk('span', 'rv-sta');
  const bot = mk('span', 'rv-bot'), title = mk('span', 'rv-t'), prog = mk('span', 'rv-prog', '<i></i>'), key = mk('span', 'rv-key', '<b>P</b><i>▸▸</i>'), snow = mk('span', 'rv-snow');
  key.setAttribute('aria-hidden', 'true'); snow.setAttribute('aria-hidden', 'true');
  top.append(fShow, stereo, sta); bot.append(title); mid.append(top, bot);
  btn.append(spec, eq, mid, key, prog, snow);
  const bar = prog.firstChild;

  // la frequenza: "FM" piccolo, le cifre grandi
  const showF = (txt) => { const m = /^(FM|AM)\s+(.+)$/.exec(txt || ''); fShow.innerHTML = m ? `<small>${m[1]}</small>${m[2]}` : (txt || ''); };
  // le stazioni con una canzone sola hanno per nome il titolo: qui il nome della stazione
  const STA = { 'FM 89.7': 'Redline Radio', 'FM 91.3': 'Zona Rossa FM', 'FM 94.5': 'Metallo Vivo', 'FM 98.1': 'Radio Corda', 'FM 76.1': 'Synth Notturno' };
  let tuneT = 0;
  function sync(anim) {
    const f = srcF.textContent.trim(), n = srcN.textContent.trim(), off = btn.classList.contains('off') || f === 'RADIO';
    const parts = n.split(' · ');
    btn.classList.toggle('rvoff', off);
    const solo = parts.length < 2, gen = solo && STA[f] === n;          // il synth: il nome è già la stazione
    sta.textContent = off ? 'Spenta' : !solo ? parts[0] : STA[f] || 'In onda';
    title.textContent = off ? 'P per accendere' : !solo ? parts.slice(1).join(' · ') : gen ? 'Suonato dal vivo, senza fine' : n;
    btn.setAttribute('aria-label', off ? 'Autoradio spenta: P per accendere' : `Autoradio ${f} ${n}: P cambia stazione`);
    // il titolo scorre solo se non ci sta
    btn.classList.remove('marq'); title.style.removeProperty('--rv-x');
    requestAnimationFrame(() => {
      const over = title.scrollWidth - bot.clientWidth;
      if (over > 4) { btn.style.setProperty('--rv-x', `-${over + 18}px`); btn.style.setProperty('--rv-d', `${Math.max(7, (over + 18) / 14)}s`); btn.classList.add('marq'); }
    });
    if (off) { clearInterval(tuneT); btn.classList.remove('tune'); showF('FM --.-'); return; }
    if (!anim) { showF(f); return; }
    // sintonia: le cifre girano per un attimo, poi si fermano sulla stazione; passa la neve
    btn.classList.remove('tune'); void btn.offsetWidth; btn.classList.add('tune');
    clearInterval(tuneT); let k = 0;
    tuneT = setInterval(() => {
      if (++k > 9) { clearInterval(tuneT); showF(f); return; }
      showF(`FM ${(87.5 + Math.random() * 20.5).toFixed(1)}`);
    }, 45);
  }
  let lastF = srcF.textContent, lastN = srcN.textContent;
  const obs = new MutationObserver(() => {
    const f = srcF.textContent, n = srcN.textContent;
    const changed = f !== lastF;                       // stazione nuova (non solo canzone nuova)
    if (f === lastF && n === lastN) return;
    lastF = f; lastN = n; sync(changed);
  });
  obs.observe(srcF, { childList: true, characterData: true, subtree: true });
  obs.observe(srcN, { childList: true, characterData: true, subtree: true });
  sync(false);

  // equalizzatore: si muove solo quando la musica suona davvero. Non ascolta l'audio: finge uno spettro di musica
  // (bassi più alti e lenti, acuti bassi e nervosi) con un colpo di cassa a tempo, ~16 volte al secondo
  const eqB = [...eq.children], spB = [...spec.children], lv = new Float32Array(eqB.length + spB.length);
  let playing = false, t0 = performance.now();
  setInterval(() => {
    const R = window.nightRun; playing = !!(R && R.radioPlaying); const tr = R && R.radioTrack;
    if (btn.classList.contains('play') !== playing) btn.classList.toggle('play', playing);
    bar.style.width = tr && tr.d > 0 ? `${Math.min(100, tr.t / tr.d * 100).toFixed(1)}%` : '0%';
  }, 250);
  const band = (u, t, kick) => {                       // u da 0 (bassi) a 1 (acuti)
    const base = 0.78 - u * 0.42, wob = 0.18 * Math.sin(t * (2 + u * 9) + u * 17) + 0.12 * Math.sin(t * (5.3 + u * 13) + u * 41);
    return Math.max(0.06, Math.min(1, base + wob + (Math.random() - 0.5) * (0.15 + u * 0.35) + kick * (1 - u) * 0.45));
  };
  setInterval(() => {
    if (document.hidden) return;
    const t = (performance.now() - t0) / 1000, beat = (t * 2.05) % 1, kick = playing ? Math.exp(-beat * 7) : 0;
    const all = eqB.length + spB.length;
    for (let i = 0; i < all; i++) {
      const u = i < eqB.length ? i / (eqB.length - 1) : (i - eqB.length) / (spB.length - 1);
      const want = playing ? band(u, t, kick) : 0.1;
      lv[i] += (want - lv[i]) * (want > lv[i] ? 0.75 : 0.28);  // sale di scatto, scende piano
      (i < eqB.length ? eqB[i] : spB[i - eqB.length]).style.transform = `scaleY(${lv[i].toFixed(3)})`;
    }
  }, 60);

  window.radioUI = { sync };
})();
