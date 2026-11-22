// ============================================================================
//  Night Run · Campioni audio dei pezzi del motore (dopo officina.js)
//  Ogni pezzo montato porta la sua voce, sopra il motore sintetizzato di dsp.js: valvola pop-off (pssh, trombetta,
//  stu-tu-tu...), fischio del turbo, compressore, urlo della wastegate, risucchio dell'aspirazione, borbottio dello
//  scarico in rilascio, botti della centralina pop & bang, colpi di limitatore/launch/cambiata, fischio del cambio a
//  denti dritti, spurgo del nitro (solo scena).
//  · File: audio/campioni/<componente>/<kit>/ (1.wav, 2.wav... colpi; loop.wav anelli; chatter1.wav, innesto1.wav...),
//    fatti a codice da strumenti/campioni_pezzi.py (niente registrazioni di altri). Si scaricano solo i kit montati.
//  · CMP_SLOT: i componenti (cosa serve montato perché suonino). CMP_KIT: i kit (nome, nota da critico, prezzo, file).
//  · Voce del pezzo (cmpAuto): montando un pezzo non di serie arriva da solo il suo kit, gratis. Nella scheda Suoni
//    dell'officina (officina.js) si ascoltano tutti, si compra e si monta un kit diverso, o si spegne il componente.
//  · Stato: game.s.cmp = { own: { kit: 1 }, mont: { auto: { componente: kit | 'off' } } } (niente = voce del pezzo).
//    Volume dei campioni (del computer, non della partita): localStorage nr_campioni.
//  · Agganci in index.html: NightCampioni.attach(ctx, uscita) in ensureAudio, .sync(game, TP, S.tune) in dspCfg (dà i
//    flag fx che abbassano la sintesi doppia in dsp.js: valv, turb, bur), .tick(sim, eventi, dt, ascolto) nel ciclo.
//  Parte pura (provata in test/campioni.test.js): cmpInfo, cmpServe, cmpAuto, cmpRisolvi, cmpFx, cmpOwns, cmpPrezzo,
//  cmpCompra, cmpMonta, cmpFiles, cmpIndiceI. Parte audio: CampioniPlayer (Web Audio). Parte grafica: NightCampioni.html.
// ============================================================================
const CMP_VER = 3;                         // alzalo quando cambi un file audio: i browser che l'hanno in memoria (sw.js) lo riscaricano
const CMP_DIR = 'audio/campioni/';
const CMP = {
  k: 1.1,                                  // livello generale dei campioni sopra il motore sintetizzato (misurato con strumenti/ascolta_campioni.js)
  voci: 14,                                // colpi insieme al massimo
  // livello di ogni componente (i file sono normalizzati a -1 dB sul più forte del kit)
  g: { valvola: 0.7, turbo: 0.38, compressore: 0.36, wastegate: 0.42, aspirazione: 0.45, scarico: 0.55, mappa: 0.6, limitatore: 0.65, cambio: 0.24, spurgo: 0.5,
    chatter: 0.33, innesto: 0.4, aria: 0.22 },
  bus: { valvola: 'motore', turbo: 'motore', compressore: 'motore', wastegate: 'scarico', aspirazione: 'motore', scarico: 'scarico', mappa: 'scarico', limitatore: 'scarico', cambio: 'trasm', spurgo: 'motore' },
  rilascioRpm: 2200,                       // il borbottio parte solo se molli sopra questi giri
  popRpm: 2500,
};
// per punto d'ascolto (0 abitacolo, 1 fuori, 2 cofano aperto): quanto arriva ogni gruppo e quanto è filtrato
const CMP_VISTA = {
  scarico: { g: [0.55, 1.0, 0.4], lp: [1700, 16000, 2600] },
  motore: { g: [0.45, 0.7, 1.0], lp: [3200, 12000, 16000] },
  trasm: { g: [1.0, 0.3, 0.5], lp: [7000, 4500, 7000] },
};
const CMP_ENV = [{ len: 0.35, wet: 0.07 }, { len: 0.9, wet: 0.2 }, { len: 2.6, wet: 0.5 }];   // strada aperta, città, galleria

const CMP_SLOT = [
  { id: 'valvola', nome: 'Valvola pop-off', hint: 'Lo sfiato quando molli il gas col turbo in pressione. Non dà un cavallo: dà la firma.' },
  { id: 'turbo', nome: 'Fischio del turbo', hint: 'La girante che fischia salendo di pressione: ogni taglia di turbo ha la sua voce.' },
  { id: 'compressore', nome: 'Compressore', hint: 'Il lamento dei rotori legato ai giri: più tiri, più canta.' },
  { id: 'wastegate', nome: 'Wastegate', hint: 'L\'urlo dei gas che scappano dal tubicino libero a pieno boost, e la valvola che sbatte in rilascio.' },
  { id: 'aspirazione', nome: 'Aspirazione', hint: 'La boccata d\'aria quando spalanchi il gas.' },
  { id: 'scarico', nome: 'Scarico: borbottio in rilascio', hint: 'Cosa fa lo scarico quando molli: cambia il rilascio rispetto all\'originale.' },
  { id: 'mappa', nome: 'Centralina: pop & bang', hint: 'Benzina buttata in rilascio che esplode nello scarico. Suona con la mappa pop & bang accesa (Guida).' },
  { id: 'limitatore', nome: 'Limitatore, launch e cambiate', hint: 'Il botto a ogni taglio d\'accensione: al limitatore, al semaforo col 2-step, nelle cambiate col 3-step.' },
  { id: 'cambio', nome: 'Cambio', hint: 'Il fischio degli ingranaggi e il colpo degli innesti.' },
  { id: 'spurgo', nome: 'Spurgo nitro', hint: 'Il getto bianco prima della partenza: parte quando armi il launch. Solo scena, il nitro non c\'è.' },
];

// i kit: n = colpi (1..n.wav), loop = anello (loop.wav), extra = altri gruppi (nome → quanti), trig = regole del momento
const CMP_KIT = {
  'valvola/ricircolo': { nome: 'Ricircolo sportivo', prezzo: 150, n: 4, nota: 'Rimanda l\'aria in aspirazione con la molla più dura: un «fff-shh» educato. Verdetto: la valvola di chi va a messa la domenica.' },
  'valvola/pssh': { nome: 'Sfiato in aria', prezzo: 250, n: 4, nota: 'Il PSSSHH pieno a ogni cambiata, quello che fa girare la testa al benzinaio. Verdetto: il minimo sindacale per una turbo.' },
  'valvola/pssh_grossa': { nome: 'Sfiato maggiorato', prezzo: 420, n: 4, nota: 'Pistone grosso e uscita larga: un soffio lungo da camion che si svuota. Verdetto: esagerato. Quindi giusto.' },
  'valvola/trombetta': { nome: 'Trombetta', prezzo: 380, n: 4, nota: 'Il sibilo che canta prima del soffio, «tsiiuuu»: la firma delle giapponesi anni \'90. Verdetto: se non ce l\'hai, non hai vissuto.' },
  'valvola/doppio_pistone': { nome: 'Doppio pistone', prezzo: 460, n: 4, nota: 'Due stadi: un «tss» secco e poi il getto pieno, scatta come una molletta. Verdetto: precisione da orologiaio, scena da piazzale.' },
  'valvola/sbuffo': { nome: 'Sbuffo grave', prezzo: 300, n: 4, nota: 'Tarata bassa e rotonda: «fuoosh» profondo, più aria che sibilo. Verdetto: per sembrare grosso anche col turbo piccolo.' },
  'valvola/stututu': { nome: 'Stu-tu-tu classico', prezzo: 120, n: 4, nota: 'Niente valvola: il compressore pompa a colpi, «stu-tu-tu-tu». Verdetto: alla turbina fa un po\' male, all\'anima un gran bene.' },
  'valvola/stututu_lungo': { nome: 'Stu-tu-tu da big single', prezzo: 220, n: 4, nota: 'Girante enorme e tanta aria nei tubi: il pompaggio dura il doppio e ondeggia. Verdetto: la senti girare fino al casello dopo.' },
  'valvola/mitraglia': { nome: 'Chatter a mitraglia', prezzo: 260, n: 4, nota: 'Colpi fitti e alti, «chi-chi-chi-chi»: un compressore piccolo e cattivo che sbatte. Verdetto: nervoso come un motorino truccato, ma con classe.' },
  'valvola/gufo': { nome: 'Il gufo', prezzo: 280, n: 4, nota: 'Pompaggio lento e basso, «huu-huu-huu»: aria pesante che rimbalza nei tubi lunghi. Verdetto: inquietante di notte. Cioè sempre, qui.' },
  'valvola/mezzo': { nome: 'Mezzo e mezzo', prezzo: 340, n: 4, nota: 'Valvola tarata morbida: sfiata un attimo, poi lascia pompare il compressore. Pssh e stu-tu-tu nello stesso colpo. Verdetto: non sai scegliere? Nemmeno lei.' },

  'turbo/fischio': { nome: 'Fischio sottile', prezzo: 200, loop: true, nota: 'Turbina piccola che gira altissima: fischio pulito e acuto, da bollitore. Verdetto: discreto, preciso, un po\' secchione.' },
  'turbo/sibilo': { nome: 'Sibilo pieno', prezzo: 280, loop: true, nota: 'Cuscinetti a sfera e tanta aria: fischio brillante col soffio sotto. Verdetto: il turbo come lo immaginavi da ragazzino.' },
  'turbo/ululato': { nome: 'Ululato da big single', prezzo: 380, loop: true, nota: 'Chiocciola enorme: un «uuuuuh» grave e ventoso che cresce fino al limitatore. Verdetto: si sente col finestrino chiuso. E dalla casa accanto.' },
  'turbo/sirena': { nome: 'Sirena da drag', prezzo: 520, km: 30, loop: true, nota: 'Due toni che si inseguono e battono come una sirena: il mostro anni \'90 delle dragstrip. Verdetto: inutile in città. Indispensabile.' },

  'compressore/volumetrico': { nome: 'Volumetrico a lobi', prezzo: 350, loop: true, nota: 'Il lamento meccanico dei rotori, «wiiii» ruvido che sale coi giri. Verdetto: muscle car americana, anche se sotto c\'è una Panda.' },
  'compressore/centrifugo': { nome: 'Centrifugo', prezzo: 320, loop: true, nota: 'Una girante a cinquantamila giri: fischio da jet che cresce col quadrato dei giri. Verdetto: da fermo non lo senti, in quinta sembri in decollo.' },
  'compressore/vite': { nome: 'A doppia vite', prezzo: 420, loop: true, nota: 'Due viti che si incastrano: fischio a due toni, una sirena dentro il cofano. Verdetto: il più cattivo dei tre. E il più caro, giustamente.' },

  'wastegate/screamer': { nome: 'Screamer pipe', prezzo: 300, loop: true, extra: { chatter: 4 }, nota: 'Il tubicino libero della wastegate: a pieno boost un urlo graffiato, in rilascio la valvola che sbatte. Verdetto: vietato in 27 paesi su 27. Bellissimo.' },
  'wastegate/libera': { nome: 'Sfiato libero', prezzo: 380, loop: true, extra: { chatter: 4 }, nota: 'Ancora più aperto e ruvido: sembra una motosega che litiga col turbo. Verdetto: i vicini chiameranno qualcuno.' },

  'aspirazione/fungo': { nome: 'Filtro a fungo', prezzo: 120, n: 4, nota: 'Il «whoomp» del filtro aperto quando affondi: risucchio e un colpo d\'aria basso. Verdetto: 2 cavalli, 200 di scena.' },
  'aspirazione/cornetti': { nome: 'Cornetti delle farfalle singole', prezzo: 450, n: 4, nota: 'Le trombette d\'aspirazione che ruggiscono, «BWAAH», a ogni affondo. Verdetto: il suono più bello che si possa fare senza turbo. Discutiamone.' },
  'aspirazione/airbox': { nome: 'Airbox in carbonio', prezzo: 260, n: 4, nota: 'Cassa chiusa e presa d\'aria fredda: una boccata profonda e rotonda. Verdetto: elegante. Per non sembrare tamarri (ma un po\' sì).' },

  'scarico/borbottio': { nome: 'Borbottio pieno', prezzo: 180, n: 6, nota: 'Blub-blub-blub a raffiche quando stacchi: il terminale svuotato che gorgoglia. Verdetto: il primo passo della carriera di ogni tamarro serio.' },
  'scarico/cupo': { nome: 'Borbottio cupo', prezzo: 240, n: 6, nota: 'Più basso e lento, «bom-bom», come una barca che rientra in porto. Verdetto: sobrio solo se lo paragoni alla pentola.' },
  'scarico/scoppiettio': { nome: 'Scoppiettio', prezzo: 260, n: 6, nota: 'Schiocchi secchi e fitti come pop-corn in padella: il catback aperto che sputa. Verdetto: sorriso garantito a ogni rotonda.' },
  'scarico/gorgoglio': { nome: 'Gorgoglio da sei in linea', prezzo: 300, n: 6, nota: 'Un «brrrrrap» rotondo e veloce, colpetti uno dietro l\'altro. Verdetto: sa di autostrada tedesca alle due di notte.' },
  'scarico/pentola': { nome: 'La pentola', prezzo: 150, n: 6, nota: 'Tubo dritto, niente silenziatori: botti sporchi e tubi che vibrano. Verdetto: grezzo e maleducato. Da montare con le lacrime agli occhi (di gioia).' },
  'scarico/titanio': { nome: 'Titanio che crepita', prezzo: 480, n: 6, nota: 'Pareti sottili: crepitii metallici e tintinnii, vetro che canta. Verdetto: costa come un mese d\'affitto. Suona come tre.' },

  'mappa/crackle': { nome: 'Crackle map', prezzo: 300, n: 6, trig: { rate: 1.6, over: 0.75 }, nota: 'Crepitio fitto e continuo, «trrr-ka-ka-ka», fuoco di legna secca. Verdetto: il classico delle compatte cattive: non stanca mai (gli altri sì).' },
  'mappa/pop_bang': { nome: 'Pop & bang', prezzo: 450, n: 6, trig: { rate: 3, over: 0.6 }, nota: 'Botti grossi e separati, «pa-BAM», con la fiammata in coda. Verdetto: la gente si gira, qualcuno si spaventa. Missione compiuta.' },
  'mappa/mitraglia': { nome: 'Mitragliatrice', prezzo: 500, n: 6, trig: { rate: 0.9, over: 0.85 }, nota: 'Raffica regolare, «ra-ta-ta-ta», tarata a tempo. Verdetto: un film di guerra. Non usarla davanti alla caserma.' },
  'mappa/petardi': { nome: 'Capodanno', prezzo: 420, n: 6, trig: { rate: 0.8, over: 0.8 }, nota: 'Botti di tutte le misure, a caso: un 31 dicembre a ogni rilascio. Verdetto: caos puro. Il cane del vicino non ti perdonerà.' },
  'mappa/antilag': { nome: 'Anti-lag da rally', prezzo: 1200, km: 30, n: 6, serve: 'turbo', nota: 'Turbina tenuta lanciata anche a gas mollato: botti violenti e soffio continuo, anche a ogni cambiata. Quello vero cuoce collettore e turbina, questo è solo la voce. Verdetto: un mondiale anni \'90 sotto casa.' },

  'limitatore/colpi': { nome: 'Colpi di limitatore', prezzo: 200, n: 6, trig: { e2: 0.75, e3: 0.8, flat: 0.6, mi: 0.06 }, nota: 'Al limite taglia le scintille: un botto a ogni rimbalzo, pa-pa-pa contro il muro dei giri. Verdetto: brutale e onesto.' },
  'limitatore/due_step': { nome: '2-step da semaforo', prezzo: 350, n: 6, trig: { e2: 0.45, e3: 0.7, flat: 0.5, mi: 0.12 }, nota: 'Fermo al launch: «brap-pap-pap» a raffiche col turbo che si carica. Verdetto: il rito del semaforo rosso. Poi è verde e sono affari tuoi.' },
  'limitatore/fucilata': { nome: 'Fucilata in cambiata', prezzo: 380, n: 6, trig: { e2: 0.35, e3: 0.55, flat: 1, mi: 0.08 }, nota: 'Col 3-step cambi in pieno: a ogni marcia un colpo secco da fucile. Verdetto: ogni cambiata un applauso. Di solito il tuo.' },
  'limitatore/stutter': { nome: 'Stutter box', prezzo: 300, n: 6, trig: { e2: 0.6, e3: 0.95, flat: 0.5, mi: 0.09 }, nota: 'Il limitatore ritmato dei pick-up americani: «BRAP-BRAP» grave e regolare. Verdetto: da fermo sembra un trattore arrabbiato. Ed è un complimento.' },

  'cambio/denti_dritti': { nome: 'Denti dritti', prezzo: 350, loop: true, extra: { innesto: 4 }, nota: 'Ingranaggi senza elica: fischio che sale con la velocità, «wiiiu», e un clack secco a ogni marcia. Verdetto: da dentro sembra un\'auto da rally, da fuori un tram. Vale la pena.' },
  'cambio/sequenziale': { nome: 'Sequenziale da corsa', prezzo: 650, km: 20, loop: true, extra: { innesto: 4, aria: 3 }, nota: 'Innesti frontali e attuatore ad aria: fischio più cattivo, «CLACK» e un soffio a ogni cambiata. Verdetto: ti senti in pista anche dal benzinaio.' },

  'spurgo/classico': { nome: 'Spurgo classico', prezzo: 400, n: 2, nota: 'Elettrovalvola che scatta e nuvola bianca: «PSSSHHH» lungo prima del verde. Verdetto: il nitro non c\'è, lo spurgo sì. Priorità.' },
  'spurgo/doppio': { nome: 'Doppio spurgo', prezzo: 500, n: 2, nota: '«Pst... PSSSSHHH»: prima l\'assaggio, poi il getto pieno. Verdetto: se devi fare scena, falla due volte.' },
};
for (const id in CMP_KIT) CMP_KIT[id].slot = id.split('/')[0];

// ---------------------------------------------------------------- parte pura
// cosa c'è montato, letto dal catalogo dell'auto (T = TUNING, già con lo swap), dalla selezione e dai parametri (TP)
function cmpInfo(T, sel, TP, carId) {
  T = T || {}; sel = sel || {}; TP = TP || { sim: {}, dsp: {} };
  const sim = TP.sim || {}, dsp = TP.dsp || {}, tb = sim.turbo || {};
  const it = (k) => (T[k] ? (T[k].items.find((x) => x.id === sel[k]) || T[k].items[0]) : null);
  const lv = (k) => (T[k] ? Math.max(0, T[k].items.findIndex((x) => x.id === sel[k])) : 0);
  const bare = (x) => String((x && x.id) || '').split(':').pop();          // con uno swap gli id hanno il nome del donatore davanti
  const tbi = it('turbo'), boost = (tb.max || 0) > 0;
  const sc = boost && !!tbi && (bare(tbi) === 'sc' || /compressore/i.test(tbi.name || ''));
  const voice = dsp.voice || {}, ts = (tbi && tbi.sim) || {};
  const barN = (ts.turbo ? ts.turbo.max : ts.max) || tb.max || 0;          // la taglia del turbo (non la pressione che lascia la centralina)
  return {
    car: carId, boost, sc, turbo: boost && !sc, single: boost && !sc && !tb.twin, bar: barN,
    turboLv: lv('turbo'), turboId: bare(tbi), scVol: sc && /volumetric/i.test(tbi.name || ''),
    bovId: T.bov ? bare(it('bov')) : null, wgLibera: (dsp.scream || 0) > 0,
    intakeLv: lv('intake'), intakeId: bare(it('intake')), itb: (voice.howl || 0) >= 0.5,
    exLv: lv('exhaust'), exId: bare(it('exhaust')), decat: T.cat ? bare(it('cat')) === 'decat' : false,
    diesel: !!voice.diesel, cyl: dsp.cyl || (carId === 'supra' ? 6 : 4),
    ecuPops: !!sim.ecuPops, spark: !!sim.sparkCut, launch: !!sim.ecuLaunch,
    limId: T.limiter ? bare(it('limiter')) : 'oem', gbLv: lv('gearbox'), finLv: lv('final'),
  };
}
// cosa serve montato perché un componente (o un kit) suoni: null se c'è tutto, altrimenti il perché
function cmpServe(slot, x) {
  switch (slot) {
    case 'valvola': return x.boost ? null : 'Serve un turbo o un compressore';
    case 'turbo': return x.turbo ? null : 'Serve un turbo montato';
    case 'compressore': return x.sc ? null : 'Serve un compressore montato (reparto Sovralimentazione)';
    case 'wastegate': return x.single ? null : 'Serve un turbo singolo (col biturbo di serie non c\'è)';
    case 'scarico': return x.diesel ? 'Sui diesel niente borbottio: c\'è il filtro antiparticolato' : null;
    case 'mappa': return x.ecuPops ? null : 'Serve una centralina con la mappa pop & bang';
    case 'limitatore': return x.spark ? null : 'Serve un limitatore a taglio d\'accensione (o una centralina che taglia le scintille)';
    case 'cambio': return x.gbLv > 0 || x.finLv > 0 ? null : 'Serve un cambio o un differenziale sportivo';
    case 'spurgo': return x.launch ? null : 'Serve il launch control (limitatore 2-step o centralina)';
    default: return null;
  }
}
function cmpKitServe(id, x) {
  const K = CMP_KIT[id]; if (!K) return 'Kit sconosciuto';
  return cmpServe(K.slot, x) || (K.serve === 'turbo' && !x.turbo ? 'Serve un turbo vero (non il compressore)' : null);
}
// la voce che porta con sé il pezzo montato (null = di serie: resta solo la sintesi)
function cmpAuto(slot, x) {
  if (cmpServe(slot, x)) return null;
  switch (slot) {
    case 'valvola':
      if (x.bovId) return { ssqv: 'valvola/trombetta', raceport: 'valvola/pssh_grossa', greddy: 'valvola/sbuffo', none: 'valvola/stututu' }[x.bovId] || null;
      return x.turboLv > 0 && x.turbo ? 'valvola/pssh' : null;
    case 'turbo':
      if (x.turboLv === 0) return null;
      if (x.turboId === 't51r') return 'turbo/sirena';
      if (x.turboId === 'efr9180') return 'turbo/fischio';
      return x.bar <= 0.8 ? 'turbo/fischio' : x.bar <= 1.3 ? 'turbo/sibilo' : 'turbo/ululato';
    case 'compressore': return x.scVol ? 'compressore/volumetrico' : 'compressore/centrifugo';
    case 'wastegate': return x.wgLibera ? 'wastegate/screamer' : null;
    case 'aspirazione':
      if (x.intakeLv === 0) return null;
      return x.itb ? 'aspirazione/cornetti' : x.intakeId === 'ram' ? 'aspirazione/airbox' : 'aspirazione/fungo';
    case 'scarico': {
      if (x.exLv === 0) return null;
      const S = { hks: 'scarico/cupo', apexi: 'scarico/scoppiettio', tomei: 'scarico/titanio', blitz: 'scarico/borbottio', straight: 'scarico/pentola' }[x.exId];
      if (S) return S;
      if (['centrale', 'race', 'turboback'].includes(x.exId)) return 'scarico/scoppiettio';   // scarichi aperti (senza centrale, da gara, turboback)
      if (!['terminale', 'catback'].includes(x.exId) && x.exLv >= 2) return 'scarico/scoppiettio';   // terminale e catback hanno la voce della famiglia (cinque livelli di scarico dalla v0.80)
      return x.cyl >= 6 ? 'scarico/gorgoglio' : x.cyl === 5 ? 'scarico/cupo' : 'scarico/borbottio';
    }
    case 'mappa': return x.ecuPops ? 'mappa/crackle' : null;
    case 'limitatore': return { msd: 'limitatore/colpi', '2step': 'limitatore/due_step', '3step': 'limitatore/fucilata', stutter: 'limitatore/stutter' }[x.limId] || null;
    case 'cambio': return x.gbLv >= 2 ? 'cambio/sequenziale' : x.gbLv === 1 ? 'cambio/denti_dritti' : null;
    default: return null;                  // spurgo: nessun pezzo lo porta, si sceglie a mano
  }
}
function cmpStato(game) {
  const s = game && game.s; if (!s) return { own: {}, mont: {} };
  const c = s.cmp || (s.cmp = {}); c.own = c.own || {}; c.mont = c.mont || {};
  return c;
}
// ce l'hai? Fuori dalla carriera tutto; la voce del pezzo montato arriva gratis col pezzo
function cmpOwns(game, id, x) {
  if (!game || game.mode !== 'career') return true;
  const K = CMP_KIT[id]; if (!K) return false;
  if (!K.prezzo || (x && cmpAuto(K.slot, x) === id)) return true;
  return !!cmpStato(game).own[id];
}
function cmpPrezzo(game, id, x) {
  const K = CMP_KIT[id]; if (!K || cmpOwns(game, id, x)) return 0;
  return Math.round(K.prezzo * (game && game.disc ? game.disc() : 1) / 10) * 10;
}
const cmpKm = (id) => (CMP_KIT[id] && CMP_KIT[id].km) || 0;
function cmpLocked(game, id, x) { return !!game && game.mode === 'career' && !cmpOwns(game, id, x) && (game.odo || 0) < cmpKm(id); }
function cmpCompra(game, id, x) {
  const K = CMP_KIT[id]; if (!K) return { ok: false, why: 'Kit sconosciuto' };
  if (cmpOwns(game, id, x)) return { ok: true, paid: 0 };
  if (cmpLocked(game, id, x)) return { ok: false, why: `Si sblocca a ${cmpKm(id)} km: ne hai ${Math.floor(game.odo || 0)}` };
  const p = cmpPrezzo(game, id, x);
  if (p > game.s.money) return { ok: false, why: `Servono € ${p.toLocaleString('it-IT')}, ne hai ${Math.floor(game.s.money).toLocaleString('it-IT')}` };
  game.s.money -= p; cmpStato(game).own[id] = 1;
  if (p && game.say) game.say(`Comprato il kit «${K.nome}»: − € ${p.toLocaleString('it-IT')}`, 'buy');
  return { ok: true, paid: p };
}
// monta su un componente: 'auto' (voce del pezzo), 'off' (spento) o un kit (comprandolo se serve)
function cmpMonta(game, carId, slot, val, x) {
  if (game && typeof game.canMount === 'function' && !game.canMount()) return { ok: false, why: 'I suoni si cambiano da fermo: accosta e frena' };
  const C = cmpStato(game), m = C.mont[carId] || (C.mont[carId] = {});
  if (val === 'auto' || !val) { delete m[slot]; return { ok: true }; }
  if (val === 'off') { m[slot] = 'off'; return { ok: true }; }
  const K = CMP_KIT[val]; if (!K || K.slot !== slot) return { ok: false, why: 'Questo kit non va su questo componente' };
  const why = x ? cmpKitServe(val, x) : null; if (why) return { ok: false, why };
  const r = cmpCompra(game, val, x); if (!r.ok) return r;
  m[slot] = val;
  return { ok: true, paid: r.paid };
}
// il kit che suona su ogni componente dell'auto, adesso
function cmpRisolvi(game, carId, x) {
  const m = cmpStato(game).mont[carId] || {}, out = {};
  for (const S of CMP_SLOT) {
    if (cmpServe(S.id, x)) { out[S.id] = null; continue; }
    const v = m[S.id] || 'auto';
    if (v === 'off') out[S.id] = null;
    else if (v === 'auto') out[S.id] = cmpAuto(S.id, x);
    else out[S.id] = CMP_KIT[v] && CMP_KIT[v].slot === S.id && !cmpKitServe(v, x) && cmpOwns(game, v, x) ? v : cmpAuto(S.id, x);
  }
  return out;
}
// flag per dsp.js: dove suona un campione, la sintesi della stessa cosa si abbassa (niente valvola doppia)
function cmpFx(res) { return { valv: res && res.valvola ? 1 : 0, turb: res && res.turbo ? 1 : 0, bur: res && res.scarico ? 1 : 0 }; }
// i file di un kit, senza estensione
function cmpFiles(id) {
  const K = CMP_KIT[id]; if (!K) return [];
  const f = [];
  for (let i = 1; i <= (K.n || 0); i++) f.push(String(i));
  if (K.loop) f.push('loop');
  for (const g in K.extra || {}) for (let i = 1; i <= K.extra[g]; i++) f.push(g + i);
  return f;
}
// colpo graduato: 1..n dal più leggero al più forte secondo l'intensità I (0,45 → 1, 1,2 → n), a volte il vicino
function cmpIndiceI(I, n, r) {
  const k = Math.max(0, Math.min(n - 1, Math.round(((I || 0.8) - 0.45) / 0.75 * (n - 1))));
  const j = r < 0.25 ? k - 1 : r > 0.75 ? k + 1 : k;
  return Math.max(0, Math.min(n - 1, j)) + 1;
}
// volume dei campioni scelto nella scheda Suoni (0..1,5), del computer
function cmpVol() {
  try { const v = JSON.parse(localStorage.getItem('nr_campioni') || '{}').vol; return Number.isFinite(v) ? Math.max(0, Math.min(1.5, v)) : 1; } catch (e) { return 1; }
}

// ---------------------------------------------------------------- parte audio
class CampioniPlayer {
  constructor(ctx, dest) {
    this.ctx = ctx;
    // tetto morbido dei campioni: lineare fino a 0,4, poi i picchi dei botti si arrotondano verso 0,85 (sopra il motore a pieno
    // gas manderebbero l'uscita oltre lo zero). Un compressore no: alzerebbe anche i suoni bassi (guadagno di compensazione)
    this.lim = ctx.createWaveShaper();
    const cv = new Float32Array(2049), a = 0.4, b = 0.85;
    for (let i = 0; i < cv.length; i++) { const x = i / 1024 - 1, m = Math.abs(x); cv[i] = Math.sign(x) * (m < a ? m : a + (b - a) * Math.tanh((m - a) / (b - a))); }
    this.lim.curve = cv; this.lim.oversample = '2x';
    this.out = ctx.createGain(); this.out.gain.value = 0; this.out.connect(this.lim); this.lim.connect(dest);
    this.prev = ctx.createGain(); this.prev.gain.value = 0.7; this.prev.connect(dest);    // ascolto in officina: senza il mix della strada
    this.rev = ctx.createConvolver(); this.revG = ctx.createGain(); this.revG.gain.value = 0;
    this.rev.connect(this.revG); this.revG.connect(this.out);
    this.env = -1; this.irs = {};
    this.bus = {};
    for (const b of ['scarico', 'motore', 'trasm']) {
      const g = ctx.createGain(), f = ctx.createBiquadFilter(), s = ctx.createGain();
      f.type = 'lowpass'; f.frequency.value = 16000; f.Q.value = 0.5;
      g.connect(f); f.connect(this.out); f.connect(s); s.connect(this.rev);
      this.bus[b] = { g, f, s };
    }
    this.buf = {}; this.wait = {};
    this.res = {}; this.info = {};
    this.loops = {}; this.voci = [];
    this.last = {};
    this.st = { cut: 0, thr: 0, thrLow: 0, burT: 0, burR: 0, popBusy: 0, alsT: 0, alsBusy: 0, limLast: 0, gasBusy: 0, launch: false, spurgoBusy: 0, shift: false };
    this.master = 0.7;
  }
  now() { return this.clock != null ? this.clock : this.ctx.currentTime; }   // clock: tempo finto per le registrazioni fuori tempo reale (strumenti/ascolta_campioni.js)
  url(id, f) { return CMP_DIR + id + '/' + f + '.wav?v=' + CMP_VER; }
  get(id, f) { return this.buf[this.url(id, f)] || null; }
  load(id) {
    const ps = [];
    for (const f of cmpFiles(id)) {
      const u = this.url(id, f);
      if (u in this.buf) continue;
      if (!this.wait[u]) {
        this.wait[u] = fetch(u).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(u))))
          .then((ab) => new Promise((res, rej) => { const p = this.ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); }))
          .then((b) => { this.buf[u] = b; }, () => { this.buf[u] = null; });
      }
      ps.push(this.wait[u]);
    }
    return Promise.all(ps);
  }
  pronto(id) { return cmpFiles(id).every((f) => this.url(id, f) in this.buf); }
  setKits(res, info) {
    this.res = Object.assign({}, res); this.info = info || {};
    for (const slot in this.loops) if (this.loops[slot].kit !== this.res[slot]) this.stopLoop(slot);
    for (const slot in this.res) if (this.res[slot]) this.load(this.res[slot]);
  }
  stopLoop(slot) {
    const L = this.loops[slot]; if (!L) return;
    const t = this.now();
    try { L.g.gain.cancelScheduledValues(t); L.g.gain.setTargetAtTime(0, t, 0.03); L.src.stop(t + 0.2); } catch (e) { /* già fermo */ }
    delete this.loops[slot];
  }
  // ambiente: risposta all'impulso fatta a mano (rumore che si spegne), una per strada/città/galleria
  setEnv(env, view) {
    env = env === 1 || env === 2 ? env : 0; this.env = env;
    const E = CMP_ENV[env], ctx = this.ctx;
    if (!this.irs[env]) {
      const n = Math.max(64, Math.round(E.len * ctx.sampleRate)), b = ctx.createBuffer(2, n, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = b.getChannelData(c);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2) * Math.exp(-i / (n * 0.28));
        if (env === 1) for (const ms of c ? [27, 53] : [19, 41]) { const i = Math.round(ms / 1000 * ctx.sampleRate); if (i < n) d[i] += 0.6; }   // i palazzi rimandano lo scarico
      }
      this.irs[env] = b;
    }
    this.rev.buffer = this.irs[env];
    this.revG.gain.setTargetAtTime(E.wet * [0.3, 1, 0.6][view], this.now(), 0.2);
  }
  // un colpo: dà la durata (s) o 0 se non c'è (file non ancora scaricato, troppe voci)
  shot(slot, id, f, gain, o = {}) {
    const b = this.get(id, f); if (!b || gain <= 0) return 0;
    this.voci = this.voci.filter((v) => v.end > this.now());
    if (this.voci.length >= CMP.voci) return 0;
    const ctx = this.ctx, t = this.now() + 0.004 + (o.delay || 0);
    const src = ctx.createBufferSource(); src.buffer = b;
    const rate = (o.rate || 1) * (0.97 + 0.06 * Math.random()); src.playbackRate.value = rate;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(g); g.connect(o.dest || this.bus[CMP.bus[slot]].g);
    src.start(t);
    const v = { src, g, slot, end: t + b.duration / rate };
    this.voci.push(v);
    src.onended = () => { try { g.disconnect(); } catch (e) { /* già staccato */ } };
    return b.duration / rate;
  }
  // un colpo a caso del kit (mai lo stesso di fila)
  shotPick(slot, id, gain, o = {}) {
    const n = (CMP_KIT[id] || {}).n || 0; if (!n) return 0;
    let i = 1 + Math.floor(Math.random() * n);
    if (n > 1 && i === this.last[id]) i = 1 + (i % n);
    this.last[id] = i;
    return this.shot(slot, id, String(i), gain, o);
  }
  fade(slot, sec) {
    const t = this.now();
    for (const v of this.voci) if (v.slot === slot && v.end > t) { try { v.g.gain.setTargetAtTime(0, t, sec / 3); v.src.stop(t + sec); } catch (e) { /* già fermo */ } v.end = t; }
  }
  loop(slot, gain, rate) {
    const id = this.res[slot]; let L = this.loops[slot];
    if (!id) { if (L) this.stopLoop(slot); return; }
    const ctx = this.ctx, t = this.now();
    if (!L) {
      const b = this.get(id, 'loop'); if (!b) return;
      const src = ctx.createBufferSource(); src.buffer = b; src.loop = true; src.playbackRate.value = rate;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(g); g.connect(this.bus[CMP.bus[slot]].g); src.start(t, Math.random() * b.duration);
      L = this.loops[slot] = { src, g, kit: id };
    }
    L.g.gain.setTargetAtTime(Math.max(0, gain), t, 0.05);
    L.src.playbackRate.setTargetAtTime(Math.max(0.05, rate), t, 0.04);
  }

  // un fotogramma: sim = fisica, ev = eventi del fotogramma (bov, clunk...), o = { view, env, vol, exh }
  tick(sim, ev, dt, o) {
    const t = this.now(), R = this.res, st = this.st, X = this.info || {};
    dt = Math.min(0.1, Math.max(0, dt || 0));
    const view = o.view === 0 || o.view === 2 ? o.view : 1;
    this.master = Math.max(0, o.vol || 0) * cmpVol() * CMP.k;
    this.out.gain.setTargetAtTime(this.master, t, 0.05);
    for (const b in this.bus) {
      const B = this.bus[b], V = CMP_VISTA[b];
      B.g.gain.setTargetAtTime(V.g[view] * (b === 'scarico' ? (o.exh || 1) : 1), t, 0.08);
      B.f.frequency.setTargetAtTime(V.lp[view], t, 0.08);
    }
    if ((o.env | 0) !== this.env || this._view !== view) { this._view = view; this.setEnv(o.env | 0, view); }
    const run = !!sim.running, rpm = sim.rpm || 0, thr = sim.thr || 0, cut = sim.cut || 0, still = Math.abs(sim.v || 0) < 1.5, G = CMP.g;
    const ss = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

    // eventi: valvola (col turbo in pressione), innesti del cambio
    for (const e of ev || []) {
      if (e.type === 'bov') {
        const I = Math.min(1.25, e.I || 0.8);
        if (R.valvola) this.shot('valvola', R.valvola, String(cmpIndiceI(I, CMP_KIT[R.valvola].n, Math.random())), G.valvola * (0.55 + 0.45 * I));
        if (R.wastegate) this.shot('wastegate', R.wastegate, 'chatter' + cmpIndiceI(I, 4, Math.random()), G.chatter * (0.6 + 0.4 * I), { delay: 0.025 });
      } else if (e.type === 'clunk' && R.cambio) {
        const K = CMP_KIT[R.cambio], k = 1 + Math.floor(Math.random() * 4);
        this.shot('cambio', R.cambio, 'innesto' + k, G.innesto * (0.7 + 0.3 * Math.min(1, rpm / 5000)));
        if (K.extra && K.extra.aria) this.shot('cambio', R.cambio, 'aria' + (1 + Math.floor(Math.random() * K.extra.aria)), G.aria, { delay: 0.012 });
      }
    }

    // anelli: turbo, compressore, urlo della wastegate, fischio del cambio
    if (R.turbo || this.loops.turbo) { const tu = Math.max(0, Math.min(1, sim.tur || 0)); this.loop('turbo', run ? G.turbo * Math.pow(tu, 1.6) * (0.3 + 0.7 * Math.min(1, thr * 1.5)) : 0, 0.3 + 0.7 * tu); }
    if (R.compressore || this.loops.compressore) this.loop('compressore', run ? G.compressore * (0.25 + 0.75 * thr) * ss(500, 4500, rpm) : 0, Math.min(1.1, Math.max(0.1, rpm / 7000)));
    if (R.wastegate || this.loops.wastegate) this.loop('wastegate', run && thr > 0.4 ? G.wastegate * Math.pow(Math.min(1, (sim.wg || 0) * 2.5), 0.8) : 0, Math.min(1.3, Math.max(0.45, rpm / 6000)));
    if (R.cambio || this.loops.cambio) {
      const gr = sim.gear ? Math.abs((sim.ww || 0) * (sim.ratio ? sim.ratio(sim.gear) : 0)) * 9.5493 : 0;
      this.loop('cambio', G.cambio * ss(300, 1500, gr) * ss(0.5, 4, Math.abs(sim.v || 0)) * (0.45 + 0.55 * thr), Math.min(1.25, Math.max(0.05, gr / 6000)));
    }

    // rilascio: appena molli (sopra i giri giusti) parte il borbottio, a raffiche che si spengono
    const lift = run && cut === 1, newLift = lift && st.cut !== 1;
    if (newLift) { st.burR = rpm; st.burT = 0.03 + 0.08 * Math.random(); }
    if (R.scarico) {
      if (lift && rpm > 1500 && st.burR > CMP.rilascioRpm) {
        const lvl = 0.5 + (X.decat ? 0.35 : 0) + (sim.cfg && sim.cfg.pops ? 0.35 : 0), env = Math.exp(-(sim.ovr || 0) / (1.0 + 1.2 * lvl));
        st.burT -= dt;
        if (st.burT <= 0 && env > 0.08) {
          const k = Math.min(1, rpm / 4500), d = this.shotPick('scarico', R.scarico, G.scarico * Math.pow(env, 0.6) * (0.55 + 0.45 * k) * (0.8 + 0.4 * Math.random()) * (X.decat ? 1.25 : 1), { rate: 0.94 + 0.12 * k });
          st.burT = d ? d * (0.45 + 0.35 * Math.random()) : 0.25;
        }
      } else if (!lift && st.cut === 1 && thr > 0.12) this.fade('scarico', 0.08);   // ridai gas: il borbottio si zittisce
    }
    // centralina: botti in rilascio (con la mappa accesa) e al limitatore; l'anti-lag col turbo lanciato e a ogni cambiata
    const pops = !!(sim.cfg && sim.cfg.pops);
    if (R.mappa && run && pops) {
      if (R.mappa === 'mappa/antilag') {
        if (newLift && (sim.tur || 0) > 0.35) st.alsT = 2.6;
        const sh = !!sim.shiftSeq;
        if (sh && !st.shift && (sim.tur || 0) > 0.35) this.shotPick('mappa', R.mappa, G.mappa * 0.7);
        st.shift = sh;
        if ((st.alsT > 0 && lift) || (cut === 3 && still)) {
          st.alsT -= dt;
          if (t >= st.alsBusy) { const d = this.shotPick('mappa', R.mappa, G.mappa * (0.8 + 0.2 * Math.random())); st.alsBusy = t + (d ? d * (0.55 + 0.3 * Math.random()) : 0.3); }
        }
      } else {
        const P = CMP_KIT[R.mappa].trig || { rate: 1, over: 0.7 };
        let rate = 0;
        if (lift && (sim.ovr || 0) < 2.8 && st.burR > CMP.popRpm) rate = P.rate * (1 - (sim.ovr || 0) / 2.8) * Math.min(1, rpm / 5000);
        else if (cut === 2 && X.spark) rate = P.rate * 1.6;
        if (rate > 0 && t >= st.popBusy && Math.random() < rate * dt) { const d = this.shotPick('mappa', R.mappa, G.mappa * (0.75 + 0.25 * Math.random())); st.popBusy = t + (d ? d * P.over : 0.2); }
      }
      if (!lift && st.cut === 1 && thr > 0.12) this.fade('mappa', 0.06);
    }
    // limitatore: un colpo (a volte) a ogni nuovo taglio d'accensione; nelle cambiate col 3-step la fucilata
    if (R.limitatore && run && X.spark && (cut === 2 || cut === 3) && cut !== st.cut) {
      const P = CMP_KIT[R.limitatore].trig;
      if (t - st.limLast > P.mi) {
        const p = cut === 2 ? P.e2 : still ? P.e3 : P.flat;
        if (Math.random() < p) { this.shotPick('limitatore', R.limitatore, G.limitatore * (cut === 3 && !still ? 1.15 : 1) * (0.8 + 0.2 * Math.random())); st.limLast = t; }
      }
    }
    // aspirazione: gas spalancato di colpo
    if (sim.shiftSeq) st.shiftT = 0.35; else st.shiftT = Math.max(0, (st.shiftT || 0) - dt);
    if (R.aspirazione && run) {
      if (thr < 0.25) { st.lowT = (st.lowT || 0) + dt; st.thrLow = 0.35; } else st.thrLow -= dt;   // lowT: da quanto il gas era giù
      const d = (thr - st.thr) / Math.max(dt, 1e-3);
      if (st.thrLow > 0 && (st.lowT || 0) > 0.15 && !st.shiftT && thr > 0.5 && d > 3 && t >= st.gasBusy && rpm < 6200) {
        const I = Math.min(1.2, 0.45 + 0.75 * Math.min(1, thr) * (rpm < 3500 ? 1 : 0.8));
        this.shot('aspirazione', R.aspirazione, String(cmpIndiceI(I, CMP_KIT[R.aspirazione].n, Math.random())), G.aspirazione * (0.6 + 0.4 * I));
        st.gasBusy = t + 0.7; st.thrLow = 0; st.lowT = 0;
      }
      if (thr >= 0.25 && st.thrLow <= 0) st.lowT = 0;
    }
    // spurgo: quando si arma il launch
    if (R.spurgo) {
      const a = !!sim.launchArmed;
      if (a && !st.launch && t >= st.spurgoBusy) { this.shotPick('spurgo', R.spurgo, G.spurgo); st.spurgoBusy = t + 6; }
      st.launch = a;
    }
    st.cut = cut; st.thr = thr;
  }

  // ascolto in officina: colpi → due varianti di fila; anelli → i giri che salgono e scendono
  async preview(id) {
    const K = CMP_KIT[id]; if (!K) return false;
    await this.load(id);
    this.stopPreview();
    const ctx = this.ctx, t = ctx.currentTime + 0.02;
    this.prev.gain.setValueAtTime(Math.max(0.15, this.master || 0.7) * 1.1, ctx.currentTime);
    const src = [];
    const play = (f, when, g = 0.8, rate = 1) => {
      const b = this.get(id, f); if (!b) return 0;
      const s = ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate;
      const gg = ctx.createGain(); gg.gain.value = g; s.connect(gg); gg.connect(this.prev); s.start(when); src.push(s);
      return b.duration / rate;
    };
    if (K.loop) {
      const b = this.get(id, 'loop'); if (!b) return false;
      const s = ctx.createBufferSource(); s.buffer = b; s.loop = true;
      const gg = ctx.createGain(); gg.gain.setValueAtTime(0, t); gg.gain.linearRampToValueAtTime(0.7, t + 0.3); gg.gain.setValueAtTime(0.7, t + 2.4); gg.gain.linearRampToValueAtTime(0, t + 3);
      const lo = K.slot === 'turbo' ? 0.35 : K.slot === 'cambio' ? 0.15 : K.slot === 'wastegate' ? 0.6 : 0.2;
      s.playbackRate.setValueAtTime(lo, t); s.playbackRate.linearRampToValueAtTime(1, t + 1.8); s.playbackRate.linearRampToValueAtTime(lo * 1.3, t + 3);
      s.connect(gg); gg.connect(this.prev); s.start(t); s.stop(t + 3.05); src.push(s);
      let tt = t + 0.4;
      for (const g in K.extra || {}) { tt += 0.5; for (let i = 1; i <= Math.min(2, K.extra[g]); i++) { play(g + (i * 2), tt, 0.7); tt += 0.45; } }
    } else {
      const n = K.n || 1, a = n >= 4 ? [2, n] : [1, n];
      let tt = t;
      for (const i of a) tt += play(String(i), tt) + 0.25;
    }
    this.prevSrc = src;
    return true;
  }
  stopPreview() { for (const s of this.prevSrc || []) { try { s.stop(); } catch (e) { /* già fermo */ } } this.prevSrc = []; }
}

if (typeof window !== 'undefined') Object.assign(window, { CMP, CMP_SLOT, CMP_KIT, CMP_VER, cmpInfo, cmpServe, cmpKitServe, cmpAuto, cmpRisolvi, cmpFx, cmpOwns, cmpPrezzo, cmpCompra, cmpMonta, cmpFiles, cmpIndiceI, CampioniPlayer });

// ---------------------------------------------------------------- aggancio al gioco e scheda Suoni dell'officina
(function campioni() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  let player = null, cur = null;
  const open = {};
  const E = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('it-IT');
  const NR = () => window.nightRun || {};

  function attach(ctx, dest) { if (!player) { player = new CampioniPlayer(ctx, dest); if (cur) player.setKits(cur.res, cur.info); } return player; }
  // ricalcola cosa suona (chiamata da dspCfg in index.html dopo ogni cambio di pezzi, auto, vista): dà i flag per dsp.js
  function sync(game, TP, sel) {
    const nr = NR();
    game = game || nr.game; TP = TP || nr.tp; sel = sel || nr.sel;
    if (!game || !TP) return cmpFx(null);
    const info = cmpInfo(typeof TUNING !== 'undefined' ? TUNING : {}, sel || {}, TP, game.car);
    cur = { info, res: cmpRisolvi(game, game.car, info), car: game.car };
    if (player) player.setKits(cur.res, cur.info);
    return cmpFx(cur.res);
  }
  function tick(sim, ev, dt, o) { if (player) player.tick(sim, ev, dt, o || {}); }

  const css = `
.cmp-vol { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; margin: 8px 2px 4px; font: 12px/1.2 var(--f-data, monospace); color: #b8b0a0; }
.cmp-vol input { width: 100%; accent-color: #ffb347; } .cmp-vol b { color: #ffd27a; min-width: 44px; text-align: right; }
.cmp-kits { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.cmp-kit { display: flex; align-items: stretch; gap: 0; }
.cmp-kit .of-chip { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.cmp-play { width: 30px; border: 1px solid #4a4458; border-right: 0; border-bottom-width: 3px; border-radius: 9px 0 0 9px; background: #1a1724; color: #8fe0a0; font: 700 12px/1 system-ui, sans-serif; cursor: pointer; padding: 0; }
.cmp-play:hover { background: #24402c; color: #d8ffe0; }
.cmp-st { font: 600 11px/1.2 var(--f-data, monospace); color: #8fe0a0; margin-left: 6px; } .cmp-st.no { color: #ff8a7a; } .cmp-st.off { color: #8a8478; }
.cmp-row.no .cmp-kits { opacity: .45; }`;

  function info0(ctx) {
    if (cur && cur.car === ctx.game.car) return cur.info;
    sync(ctx.game, NR().tp, ctx.S && ctx.S.tune);
    return cur ? cur.info : cmpInfo(typeof TUNING !== 'undefined' ? TUNING : {}, (ctx.S && ctx.S.tune) || {}, { sim: {}, dsp: {} }, ctx.game.car);
  }

  // la scheda Suoni (officina.js la mette accanto a Modifiche e Swap motore)
  function html(ctx) {
    if (!document.getElementById('cmpCss')) { const st = document.createElement('style'); st.id = 'cmpCss'; st.textContent = css; document.head.appendChild(st); }
    const g = ctx.game, carId = g.car, x = info0(ctx), res = cmpRisolvi(g, carId, x), m = cmpStato(g).mont[carId] || {}, career = g.mode === 'career';
    const vol = Math.round(cmpVol() * 100);
    let h = '<p class="of-hint">Ogni pezzo montato porta la sua voce, sopra il motore. Qui le ascolti (▶), le cambi con un altro kit dello stesso componente o le spegni. Non cambiano un cavallo: cambiano la faccia della gente quando passi. Il kit che arriva col pezzo è gratis; gli altri si comprano una volta e valgono su tutte le auto.</p>';
    h += `<div class="cmp-vol"><span>VOLUME CAMPIONI</span><input type="range" data-cmp-vol min="0" max="150" step="5" value="${vol}" aria-label="Volume dei campioni"><b id="cmpVolOut">${vol} %</b></div>`;
    for (const S of CMP_SLOT) {
      const why = cmpServe(S.id, x), auto = cmpAuto(S.id, x), now = res[S.id], v = m[S.id] || 'auto';
      const spenta = S.id === 'mappa' && now && !((NR().sim || {}).cfg || {}).pops;                 // la mappa pop & bang si accende in Guida
      const st = why ? `<span class="cmp-st no">${E(why)}</span>` : now ? `<span class="cmp-st${spenta ? ' no' : ''}">${E(CMP_KIT[now].nome)}${now === auto && v === 'auto' ? ' · col pezzo' : ''}${spenta ? ' · mappa pop & bang spenta (Guida)' : ''}</span>` : `<span class="cmp-st off">${v === 'off' ? 'spento' : 'di serie: niente in più'}</span>`;
      const kits = Object.keys(CMP_KIT).filter((id) => CMP_KIT[id].slot === S.id);
      const chip = (val, label, sub, cls, title) => `<button type="button" class="of-chip ${cls}" data-cmp="${E(S.id)}" data-val="${E(val)}" title="${E(title || label)}" ${why ? 'aria-disabled="true"' : ''}><span class="of-lv">${label}</span><small>${E(sub)}</small></button>`;
      let chips = chip('auto', '<i class="of-dot on"></i>COL PEZZO', auto ? CMP_KIT[auto].nome : 'niente', v === 'auto' ? 'cur' : 'own', 'La voce del pezzo montato (gratis)');
      chips += chip('off', '<i class="of-dot off"></i>SPENTO', 'solo il motore', v === 'off' ? 'cur' : '', 'Nessun campione su questo componente');
      for (const id of kits) {
        const K = CMP_KIT[id], isCur = v === id, own = cmpOwns(g, id, x), lock = cmpLocked(g, id, x), kwhy = cmpKitServe(id, x), price = cmpPrezzo(g, id, x);
        const sub = isCur ? 'montato' : kwhy && !why ? 'non va qui' : own ? (id === auto ? 'col pezzo · MONTA' : 'tuo · MONTA') : lock ? `🔒 ${fmt(cmpKm(id))} km` : `€ ${fmt(price)}`;
        const cls = [isCur ? 'cur' : '', !isCur && own ? 'own' : '', lock || kwhy ? 'lock' : '', !isCur && !own && !lock ? 'buy' : '', !own && career && price > g.s.money ? 'poor' : ''].filter(Boolean).join(' ');
        chips += `<span class="cmp-kit"><button type="button" class="cmp-play" data-cmp-play="${E(id)}" title="Ascolta" aria-label="Ascolta ${E(K.nome)}">▶</button>${chip(id, `<i class="of-dot ${isCur || own ? 'on' : 'off'}"></i>${E(K.nome)}`, sub, cls, K.nota)}</span>`;
      }
      let inf = '';
      if (open[S.id]) inf = '<div class="of-info">' + `<p>${E(S.hint)}</p>` + kits.map((id) => `<p><b>${E(CMP_KIT[id].nome)}</b> — ${E(CMP_KIT[id].nota)}</p>`).join('') + '</div>';
      h += `<div class="of-row cmp-row${why ? ' no' : ''}${now ? ' mod' : ''}"><div class="of-head"><span><b>${E(S.nome)}</b>${st}</span><button type="button" class="of-i" data-cmp-i="${E(S.id)}" aria-expanded="${!!open[S.id]}" aria-label="Cosa sono" title="Cosa sono">i</button></div><div class="cmp-kits">${chips}</div>${inf}</div>`;
    }
    return h + '<p class="of-hint">▶ ascolta il kit da solo, anche a motore spento. In strada il volume segue il punto d\'ascolto (abitacolo, fuori, cofano) e l\'ambiente (città, galleria). I file sono in <code>audio/campioni/</code>: chi vuole ci mette le sue registrazioni con lo stesso nome.</p>';
  }

  // clic nella scheda: dà true se l'officina deve ridisegnare
  function click(el, ctx) {
    if (el.dataset.cmpPlay) { preview(el.dataset.cmpPlay); return false; }
    if (el.dataset.cmpI) { open[el.dataset.cmpI] = !open[el.dataset.cmpI]; return true; }
    if (el.dataset.cmp && el.getAttribute('aria-disabled') !== 'true') {
      const g = ctx.game, x = info0(ctx), slot = el.dataset.cmp, val = el.dataset.val;
      if (g.needsShop && g.needsShop()) { ctx.flash('I suoni li monta Luca: Da Luca Tuning è sulla mappa (L)', 2.6); return false; }
      const r = cmpMonta(g, g.car, slot, val, x);
      if (!r.ok) { ctx.flash(r.why, 2.6); return false; }
      // chi monta apposta un kit di botti li vuole sentire: si accende la mappa pop & bang (si spegne in Guida)
      if (slot === 'mappa' && CMP_KIT[val]) { const cb = document.getElementById('tPops'); if (cb && !cb.checked && !cb.disabled) { cb.checked = true; cb.dispatchEvent(new Event('change')); } }
      ctx.apply(); ctx.save(); if (ctx.after) ctx.after();
      const now = cur && cur.res[slot];
      ctx.flash(val === 'off' ? 'Spento: su questo componente resta solo il motore' : now ? `Montato: ${CMP_KIT[now].nome}` : 'Voce del pezzo: per ora niente in più', 2);
      if (now && val !== 'off') preview(now);
      return true;
    }
    return false;
  }
  function input(el) {
    const v = Math.max(0, Math.min(150, +el.value || 0));
    try { localStorage.setItem('nr_campioni', JSON.stringify({ vol: v / 100 })); } catch (e) { /* ignora */ }
    const o = document.getElementById('cmpVolOut'); if (o) o.textContent = v + ' %';
  }
  async function preview(id) {
    try {
      if (!player && NR().audioOn) await NR().audioOn();
      if (!player) return false;
      if (player.ctx.state !== 'running') await player.ctx.resume();
      return await player.preview(id);
    } catch (e) { return false; }
  }

  window.NightCampioni = { attach, sync, tick, html, click, input, preview, get player() { return player; }, stato: () => (cur ? { res: Object.assign({}, cur.res), info: Object.assign({}, cur.info), pronti: player ? Object.values(cur.res).filter(Boolean).map((id) => [id, player.pronto(id)]) : [] } : null) };
  // al caricamento: il gioco ha già applicato le impostazioni prima che questo file ci fosse, quindi si ricalcola da sé
  setTimeout(() => { try { sync(); if (NR().audioCfg) NR().audioCfg(); } catch (e) { /* niente: si ricalcola al prossimo cambio */ } }, 0);
})();
