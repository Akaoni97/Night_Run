// ============================================================================
//  Night Run · I motori costruiti a pezzi (dopo cars.js e viaggio.js; la grafica è in motori2d.js)
//  Al locale nuovo «Il Pistone» (tappa del Viaggio al posto del secondo bar di ogni giro, VG_PATTERN[4]) ti costruisci
//  un motore: scegli un pezzo per reparto (MOT_PARTI, nell'ordine in cui si montano, dal basso in alto), lo paghi,
//  lo monti a mano sul cavalletto (scena in motori2d.js) e diventa un motore tuo (game.s.vg.mot.list). Poi lo monti
//  su qualsiasi auto (swap libero): curva di coppia, giri, cilindri, turbo, voce del motore e peso dell'auto vengono
//  dal motore (motApply, chiamata da applySettings in index.html). Lo smonti e l'auto torna col suo motore di serie.
//  Il calcolo (motCalc) è puro: CV e Nm stimati, limitatore, peso, affidabilità. Se chiedi più di quanto reggono
//  blocco, albero, bielle e pistoni (o un turbo grosso su pistoni ad alta compressione), l'affidabilità scende: tirando
//  il motore al limitatore a gas pieno, a lungo andare si rompe (non riparte finché non lo ricostruisci al Pistone).
//  I pezzi hanno un livello (1-4): i livelli li insegna Nico, reparto per reparto (MOT_LIV, dip). I pezzi devono andare
//  d'accordo come in un'officina vera: benzina (iniettori e pompa), aria (intercooler contro i bar), olio (giri),
//  frizione (Nm) e calore (radiatore contro i kW che il motore butta nell'acqua: in strada lo calcola sim.js, con la
//  protezione della centralina e la guarnizione che salta se insisti).
//  Prezzi e numeri in MOT, pezzi in MOT_PARTI. Test in test/motori-costruiti.test.js.
// ============================================================================
// [PISTONE] interruttore del progetto in prova: spento (scheda Sviluppatori, o localStorage nr_pistone = '0') il Pistone
// non compare tra le tappe e i motori costruiti non si montano sulle auto (restano salvati: riaccendendolo tornano)
const PISTONE = { on: (() => { try { return typeof localStorage === 'undefined' || localStorage.getItem('nr_pistone') !== '0'; } catch (e) { return true; } })() };
const MOT = {
  lavoro: 450,          // montare o smontare un motore su un'auto (manodopera)
  revisione: 0.35,      // rifare un motore rotto al Pistone: frazione del prezzo dei pezzi (non è la revisione di Mario)
  maxMotori: 4,         // motori che si tengono in magazzino
  vendita: 0.55,        // rivendere un motore: frazione del prezzo dei pezzi (meno l'usura)
  // calore: quota della potenza all'albero che finisce nell'acqua (un motore a benzina butta circa un terzo
  // dell'energia nello scarico, un terzo nel raffreddamento e un terzo lo dà alle ruote); capacità termica di
  // acqua, blocco e testata (J/K): più è alta, più ci mette a scaldarsi e a raffreddarsi
  quotaAcqua: 0.6, capTermica: 90000, aria: 25,
  cottura: 6,           // secondi oltre la protezione + 8 °C prima che salti la guarnizione della testata
};

// i livelli che insegna Nico al Pistone: si sblocca un reparto alla volta, un livello dopo l'altro.
// km: km del Viaggio fatti; motori: motori costruiti finora (si impara montandoli)
// Prezzi tarati sull'economia del Viaggio (PASSAGGIO.md, «Economia»: ~€ 290 netti al km di lavoro): tutto il livello 2
// costa quanto un paio di lavori, tutto il 4 quanto una sportiva usata. pezzi: pezzi montati finora (motore o banco)
const MOT_LIV = [null,
  { price: 0, km: 0, pezzi: 0, motori: 0 },
  { price: 300, km: 10, pezzi: 0, motori: 0 },
  { price: 900, km: 45, pezzi: 4, motori: 0 },
  { price: 2400, km: 110, pezzi: 10, motori: 1 },
];
// manodopera di Nico per montare o togliere un pezzo sul motore di un'auto: per albero, bielle, pistoni, pompa
// dell'olio, testata e camme il motore va aperto (guarnizioni, ore di lavoro), il resto si cambia da fuori
const MOT_INTERNI = ['albero', 'bielle', 'pistoni', 'olio', 'testata', 'camme'];
const MOT_LAVORO = { interno: 380, esterno: 90 };

// i reparti nell'ordine di montaggio (dal basso in alto, la frizione per ultima dietro al volano); ogni pezzo: id,
// livello (lv 1-4, quando lo puoi comprare), nome, prezzo, nota, kg e i suoi effetti. reg = cavalli che regge per
// cilindro. dip = per sbloccare il livello n di questo reparto devi conoscere già quei livelli di altri reparti.
const MOT_PARTI = [
  { id: 'blocco', label: 'Blocco', dip: {}, items: [
    { id: 'b4_16', lv: 1, name: '4 cilindri 1.6 in alluminio', price: 900, kg: 95, cyl: 4, disp: 1.6, reg: 70, note: 'Leggero e piccolo: sale di giri volentieri, regge poco (sui 280 CV).' },
    { id: 'b4_20', lv: 1, name: '4 cilindri 2.0 in ghisa', price: 1400, kg: 135, cyl: 4, disp: 2.0, reg: 110, note: 'Pesante ma duro: la base classica per il turbo, regge sui 440 CV.' },
    { id: 'b5_23', lv: 2, name: '5 cilindri 2.3 in alluminio', price: 2600, kg: 150, cyl: 5, disp: 2.3, reg: 85, note: 'Cinque cilindri: uno scoppio ogni 144°, la voce rauca e storta.' },
    { id: 'b6_25', lv: 2, name: '6 cilindri 2.5 in alluminio', price: 3200, kg: 165, cyl: 6, disp: 2.5, reg: 75, note: 'Sei in linea: liscio come la seta, urla in alto.' },
    { id: 'b6_30', lv: 3, name: '6 cilindri 3.0 in ghisa', price: 4800, kg: 215, cyl: 6, disp: 3.0, reg: 120, note: 'Sei in linea di ghisa con sette supporti di banco: regge sui 700 CV.' },
    { id: 'b4_20cd', lv: 4, name: '4 cilindri 2.0 closed deck', price: 4200, kg: 140, cyl: 4, disp: 2.0, reg: 170, note: 'Canne chiuse in testa e camicie in acciaio: le guarnizioni non si muovono più. Sui 680 CV.' },
    { id: 'b6_30cd', lv: 4, name: '6 cilindri 3.0 closed deck', price: 7500, kg: 222, cyl: 6, disp: 3.0, reg: 175, note: 'Il blocco da mille cavalli: canne chiuse, camicie in acciaio, banco rinforzato.' } ] },
  { id: 'albero', label: 'Albero motore', dip: { 3: [['blocco', 2]], 4: [['blocco', 3]] }, items: [
    { id: 'fuso', lv: 1, name: 'In ghisa', price: 400, kg: 0, rpm: 7200, reg: 60, note: 'Di serie: va bene finché non esageri.' },
    { id: 'forg', lv: 2, name: 'Forgiato', price: 1300, kg: -2, rpm: 8600, reg: 120, note: 'Acciaio forgiato e temprato: regge giri e potenza.' },
    { id: 'stroker', lv: 3, name: 'Forgiato a corsa lunga', price: 1900, kg: 2, rpm: 7300, reg: 110, dispK: 1.1, lowK: 1.04, note: '+10 % di cilindrata: più coppia in basso, ma i pistoni corrono di più e sale meno di giri.' },
    { id: 'billet', lv: 4, name: 'Ricavato dal pieno (billet), equilibrato', price: 2900, kg: -3, rpm: 9500, reg: 165, note: 'Fresato da un blocco di acciaio e bilanciato al grammo: niente vibrazioni fino a 9500 giri.' } ] },
  { id: 'bielle', label: 'Bielle', dip: { 3: [['albero', 2]], 4: [['albero', 3]] }, items: [
    { id: 'fuse', lv: 1, name: 'Di serie, in ghisa', price: 300, kg: 0, rpm: 7000, reg: 45, note: 'Il punto debole di ogni motore spinto: sopra i 45 CV a cilindro si piegano.' },
    { id: 'h', lv: 2, name: 'Forgiate ad H', price: 900, kg: 0, rpm: 8200, reg: 90, note: 'Le prime da mettere se vuoi il turbo.' },
    { id: 'harp', lv: 3, name: 'Forgiate ad H con viti ARP', price: 1400, kg: 0, rpm: 8800, reg: 115, note: 'Le viti delle bielle sono quelle che cedono per prime in alto: queste no.' },
    { id: 'ti', lv: 4, name: 'In titanio', price: 2200, kg: -2, rpm: 9200, reg: 150, note: 'Leggerissime: meno massa che va su e giù, il motore prende giri come una moto.' } ] },
  { id: 'pistoni', label: 'Pistoni', dip: { 3: [['bielle', 2]], 4: [['bielle', 3]] }, items: [
    { id: 'std', lv: 1, name: 'Fusi, compressione 10:1', price: 350, kg: 0, comp: 'std', reg: 45, note: 'Di serie: un po\' di turbo lo reggono, non tanto.' },
    { id: 'ipe', lv: 2, name: 'Ipereutettici, compressione 10:1', price: 600, kg: 0, comp: 'std', reg: 65, note: 'Lega con più silicio: dilatano meno e reggono più calore di quelli fusi.' },
    { id: 'low', lv: 3, name: 'Forgiati, compressione bassa 8,5:1', price: 1000, kg: 0, comp: 'low', reg: 110, note: 'Fatti per il turbo: meno spinta da aspirato, reggono pressioni alte senza battere.' },
    { id: 'high', lv: 3, name: 'Forgiati, compressione alta 11,5:1', price: 1100, kg: 0, comp: 'high', reg: 100, note: 'Per l\'aspirato: +6 % di coppia. Col turbo battono in testa.' },
    { id: 'g2618', lv: 4, name: 'Forgiati 2618, 9,5:1, cielo rivestito', price: 2200, kg: 0, comp: 'mid', reg: 150, note: 'Lega 2618 e rivestimento ceramico sul cielo: buoni da aspirato, col turbo battono solo oltre i 2 bar.' } ] },
  { id: 'olio', label: 'Pompa dell\'olio', dip: { 3: [['albero', 2]], 4: [['albero', 3]] }, items: [
    { id: 'serie', lv: 1, name: 'Di serie', price: 120, kg: 0, rpmOk: 7000, kw: 0, note: 'Sopra i 7000 giri la pressione cala: le bronzine lavorano col film d\'olio sottile.' },
    { id: 'hv', lv: 2, name: 'Maggiorata (alta portata)', price: 450, kg: 1, rpmOk: 8000, kw: 0, note: 'Più olio a ogni giro: pressione piena fino a 8000.' },
    { id: 'hvr', lv: 3, name: 'Maggiorata con radiatore dell\'olio', price: 1100, kg: 4, rpmOk: 8800, kw: 12, note: 'Il radiatore dell\'olio porta via calore anche lui: l\'acqua respira.' },
    { id: 'secco', lv: 4, name: 'Carter secco a tre stadi', price: 3800, kg: 7, rpmOk: 10000, kw: 20, note: 'Serbatoio a parte e pompa a stadi: l\'olio non sbatte in curva e non manca mai.' } ] },
  { id: 'testata', label: 'Testata', dip: { 3: [['camme', 2]], 4: [['camme', 3]] }, items: [
    { id: 'v2', lv: 1, name: '2 valvole per cilindro, monoalbero', price: 600, kg: 20, tq: 88, rN: 3000, rH: 5200, rpm: 6300, fall: 0.82, note: 'Coppia in basso, tranquilla: in alto finisce presto.' },
    { id: 'v4', lv: 2, name: '4 valvole per cilindro, bialbero', price: 1500, kg: 28, tq: 94, rN: 4200, rH: 6200, rpm: 7300, fall: 0.88, note: 'Il giusto mezzo: piena dappertutto.' },
    { id: 'v4p', lv: 3, name: '4 valvole, condotti lucidati a mano', price: 2600, kg: 28, tq: 97, rN: 4600, rH: 6900, rpm: 7900, fall: 0.9, note: 'Respira meglio in alto: allunga e spinge fino in fondo.' },
    { id: 'v4r', lv: 4, name: '4 valvole al sodio, molle doppie', price: 4300, kg: 27, tq: 98, rN: 4800, rH: 7300, rpm: 8700, fall: 0.92, note: 'Valvole cave col sodio dentro che le raffredda, molle doppie: niente sfarfallio fino a 8700.' } ] },
  { id: 'camme', label: 'Alberi a camme', dip: { 2: [['testata', 2]], 3: [['testata', 3]], 4: [['testata', 4]] }, items: [
    { id: 'serie', lv: 1, name: 'Di serie', price: 250, kg: 0, tqK: 1, dN: 0, dH: 0, dRpm: 0, lope: 0, idle: 0, note: 'Minimo regolare, guidabile.' },
    { id: 'sport', lv: 2, name: 'Sportivi (264°)', price: 700, kg: 0, tqK: 0.98, dN: 500, dH: 400, dRpm: 300, lope: 0.25, idle: 100, note: 'Il minimo comincia a scalciare, in alto c\'è di più.' },
    { id: 'gara', lv: 3, name: 'Da gara (280°)', price: 1300, kg: 0, tqK: 0.93, dN: 1000, dH: 900, dRpm: 700, lope: 0.6, idle: 250, note: 'Minimo che galoppa, in basso vuoto, in alto esplode.' },
    { id: 'vvt', lv: 4, name: 'Con variatore di fase continuo', price: 2600, kg: 1, tqK: 1, dN: 400, dH: 700, dRpm: 500, lope: 0.1, idle: 0, note: 'La centralina sposta le camme coi giri: piena in basso come le serie, in alto quasi come le gara.' } ] },
  { id: 'sovra', label: 'Sovralimentazione', dip: { 2: [['pistoni', 2], ['iniettori', 2]], 3: [['centralina', 3], ['intercooler', 2]], 4: [['intercooler', 3], ['bielle', 3]] }, items: [
    { id: 'na', lv: 1, name: 'Aspirato', price: 0, kg: 0, max: 0, note: 'Nessun turbo: risposta immediata.' },
    { id: 'tp', lv: 1, name: 'Turbo piccolo (0,7 bar)', price: 2200, kg: 14, max: 0.7, a: 2200, b: 3200, note: 'Si sveglia presto, spinta dolce.' },
    { id: 'sc', lv: 2, name: 'Compressore volumetrico (0,6 bar)', price: 3000, kg: 16, max: 0.6, sc: true, note: 'Spinta subito e sempre, col fischio acuto.' },
    { id: 'tm', lv: 2, name: 'Turbo medio (1,1 bar)', price: 3600, kg: 18, max: 1.1, a: 2800, b: 3900, note: 'Un po\' di ritardo, poi una bella botta.' },
    { id: 'tg', lv: 3, name: 'Turbo grande (1,6 bar)', price: 5200, kg: 22, max: 1.6, a: 3400, b: 4700, note: 'Sotto i 3500 giri dorme. Poi una catapulta.' },
    { id: 'tgs', lv: 4, name: 'Turbo a cuscinetti a sfere (1,8 bar)', price: 7400, kg: 22, max: 1.8, a: 3000, b: 4200, up: 0.32, note: 'La girante gira sulle sfere invece che sull\'olio: grande ma pronto come un medio.' } ] },
  { id: 'intercooler', label: 'Intercooler', dip: {}, items: [
    { id: 'no', lv: 1, name: 'Nessuno', price: 0, kg: 0, heat: 1.6, cap: 0, lag: 1, note: 'L\'aria compressa entra calda: meno ossigeno, più battito, più calore nel motore.' },
    { id: 'fms', lv: 2, name: 'Frontale piccolo', price: 700, kg: 7, heat: 0.95, cap: 0.8, lag: 1, note: 'Basta fino a 0,8 bar.' },
    { id: 'fmg', lv: 3, name: 'Frontale grande', price: 1500, kg: 12, heat: 0.6, cap: 1.5, lag: 1.1, note: 'Fino a 1,5 bar l\'aria resta fresca. Tubi lunghi: un filo di ritardo in più.' },
    { id: 'aa', lv: 4, name: 'Aria-acqua, con pompa e radiatorino', price: 3200, kg: 15, heat: 0.42, cap: 2.2, lag: 0.92, note: 'Vicino al collettore, tubi corti: aria fredda e risposta pronta.' } ] },
  { id: 'iniettori', label: 'Iniettori', dip: { 3: [['benzina', 2]], 4: [['benzina', 3]] }, items: [
    { id: 'i250', lv: 1, name: '250 cc', price: 200, kg: 0, cap: 42, note: 'Bastano per un aspirato tranquillo (42 CV a cilindro).' },
    { id: 'i440', lv: 2, name: '440 cc', price: 600, kg: 0, cap: 75, note: 'Per un turbo normale (75 CV a cilindro).' },
    { id: 'i750', lv: 3, name: '750 cc', price: 1100, kg: 0, cap: 135, note: 'Benzina per tutto quello che vuoi fare (135 CV a cilindro).' },
    { id: 'i1000', lv: 4, name: '1000 cc', price: 1700, kg: 0, cap: 175, note: 'Da gara: 175 CV a cilindro. Al minimo vanno tarati bene.' } ] },
  { id: 'benzina', label: 'Pompa della benzina', dip: {}, items: [
    { id: 'serie', lv: 1, name: 'Di serie', price: 150, kg: 0, cap: 230, note: 'Porta benzina per circa 230 CV in tutto.' },
    { id: 'p255', lv: 2, name: 'Maggiorata, 255 litri l\'ora', price: 450, kg: 0, cap: 420, note: 'La classica: fino a circa 420 CV.' },
    { id: 'dop', lv: 3, name: 'Doppia pompa nel serbatoio', price: 1100, kg: 2, cap: 650, note: 'Due pompe insieme: fino a circa 650 CV.' },
    { id: 'mecc', lv: 4, name: 'Meccanica, con regolatore e polmone', price: 2400, kg: 4, cap: 950, note: 'Trascinata dal motore: la portata sale coi giri, non resta mai a secco.' } ] },
  { id: 'centralina', label: 'Centralina', dip: { 3: [['iniettori', 2]], 4: [['sovra', 3]] }, items: [
    { id: 'serie', lv: 1, name: 'Di serie', price: 300, kg: 0, maxBoost: 0.6, spark: false, pw: 1, rpm: 0, note: 'Non sopra 0,6 bar, niente launch e scoppi.' },
    { id: 'rimap', lv: 2, name: 'Di serie rimappata', price: 700, kg: 0, maxBoost: 1.2, spark: false, pw: 1.01, rpm: 150, note: 'Mappe riscritte: fino a 1,2 bar e +150 giri.' },
    { id: 'prog', lv: 3, name: 'Programmabile', price: 1600, kg: 0, maxBoost: 2.2, spark: true, pw: 1.03, rpm: 300, note: 'Tutta la pressione del turbo, +300 giri, launch control, pop & bang.' },
    { id: 'gara', lv: 4, name: 'Da gara, col sensore di battito', price: 3400, kg: 0, maxBoost: 2.5, spark: true, pw: 1.04, rpm: 400, knockCtl: true, note: 'Sente il battito cilindro per cilindro e ritarda l\'anticipo prima che il pistone si buchi.' } ] },
  { id: 'radiatore', label: 'Radiatore', dip: {}, items: [
    { id: 'serie', lv: 1, name: 'Di serie, plastica e alluminio', price: 150, kg: 6, kw: 70, fan: 0.3, prot: 112, note: 'Smaltisce circa 70 kW a 100 all\'ora: un motore sui 160 CV lo tiene a gas pieno.' },
    { id: 'all2', lv: 2, name: 'Alluminio, due ranghi', price: 550, kg: 8, kw: 105, fan: 0.35, prot: 112, note: 'Circa 105 kW: per motori sui 240 CV tirati.' },
    { id: 'all3', lv: 3, name: 'Alluminio, tre ranghi, ventola grande', price: 1200, kg: 10, kw: 150, fan: 0.45, prot: 113, note: 'Circa 150 kW e da fermo la ventola tira di più.' },
    { id: 'gara', lv: 4, name: 'Da gara, doppia ventola, tappo a 1,5 bar', price: 2600, kg: 11, kw: 210, fan: 0.6, prot: 118, note: 'Circa 210 kW. Il tappo in pressione alza il punto di ebollizione: la protezione scatta più tardi.' } ] },
  { id: 'frizione', label: 'Frizione', dip: {}, items: [
    { id: 'org', lv: 1, name: 'Organica di serie', price: 250, kg: 0, cap: 330, ieK: 1, note: 'Morbida: oltre 330 Nm slitta.' },
    { id: 'rinf', lv: 2, name: 'Rinforzata, spingidisco maggiorato', price: 600, kg: 1, cap: 480, ieK: 1, note: 'Pedale più duro: tiene 480 Nm.' },
    { id: 'cer', lv: 3, name: 'Cerametallica a pastiglie', price: 1100, kg: 0, cap: 700, ieK: 0.9, note: 'Attacca di colpo, partire piano è un\'arte: tiene 700 Nm.' },
    { id: 'bid', lv: 4, name: 'Bidisco da gara, volano alleggerito', price: 2600, kg: -3, cap: 1050, ieK: 0.75, note: 'Due dischi piccoli: tiene 1050 Nm e il motore sale di giri di scatto. In folle tintinna.' } ] },
];
const MOT_CAT = Object.fromEntries(MOT_PARTI.map((c) => [c.id, c]));
const motPart = (cat, id) => { const C = MOT_CAT[cat]; return C && (C.items.find((x) => x.id === id) || null); };
// la scelta più economica di ogni reparto (il motore "base")
const MOT_BASE = Object.fromEntries(MOT_PARTI.map((c) => [c.id, c.items[0].id]));
// reparti aggiunti dopo i primi motori: nei salvataggi vecchi mancano, valgono quelli di serie
const MOT_NUOVI = ['olio', 'intercooler', 'benzina', 'radiatore', 'frizione'];

// curva di coppia indicata (come genTq di cars.js, ma fino a dove serve) dai numeri chiave
function motTq(hp, rpmHp, nm, rpmNm, lim) {
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, nHp = hp * 7023 / rpmHp, out = [];
  for (let r = 0; r <= Math.max(7500, lim + 1000); r += 500) {
    let t;
    if (r <= rpmNm) t = nm * (0.55 + 0.45 * Math.min(1, r / Math.max(1, rpmNm)));
    else if (r <= rpmHp) t = nm + (nHp - nm) * (r - rpmNm) / Math.max(1, rpmHp - rpmNm);
    else t = nHp * Math.max(0.35, 1 - (r - rpmHp) / Math.max(800, (lim + 900 - rpmHp)) * 0.55);
    out.push([r, Math.round(t + fr(r))]);
  }
  return out;
}

// dai pezzi al motore: tutto quello che serve a fisica, suono e negozio
function motCalc(sel, opt) {
  sel = sel || {}; const hpK = (opt && opt.hpK) || 1;   // hpK: scala della potenza (motore di serie di un'auto, vedi motCalcSerie)
  const P = {}, missing = [];
  if (MOT_NUOVI.some((k) => !sel[k])) sel = motFill(sel);
  for (const C of MOT_PARTI) { const it = motPart(C.id, sel[C.id]); if (it) P[C.id] = it; else missing.push(C.id); }
  if (missing.length) return { ok: false, missing };
  const B = P.blocco, A = P.albero, Bi = P.bielle, Pi = P.pistoni, O = P.olio, T = P.testata, Cm = P.camme, S = P.sovra, Ic = P.intercooler, In = P.iniettori, Pb = P.benzina, E = P.centralina, Rd = P.radiatore, F = P.frizione;
  const cyl = B.cyl, disp = Math.round(B.disp * (A.dispK || 1) * 10) / 10;
  const compK = { std: 1, mid: 0.99, low: 0.95, high: 1.06 }[Pi.comp];
  const nm = Math.round(disp * T.tq * compK * Cm.tqK * (A.lowK || 1));
  const lim = Math.min(A.rpm, Bi.rpm, T.rpm + Cm.dRpm + E.rpm);
  const rH = Math.min(T.rH + Cm.dH, lim - 300), rN = Math.min(T.rN + Cm.dN, rH - 800);
  const hpNA = nm * T.fall * rH / 7023;
  // sovralimentazione: la centralina di serie non va oltre i suoi bar; la compressione alta batte in testa
  const boost = Math.min(S.max, E.maxBoost), boostK = { low: 1, mid: 0.93, std: 0.85, high: 0.6 }[Pi.comp] * 0.95;
  const bf = (0.9 + 0.78 * boostK * boost) / 0.9;                       // la stessa spinta che calcola sim.js a turbo pieno
  // CV e Nm veri: come li calcola sim.js (estimatePeak) con il turbo a pressione piena, giro per giro
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, base = motTq(hpNA, rH, nm, rN, lim);
  const at = (t, r) => { for (let i = 1; i < t.length; i++) if (r < t[i][0]) { const [a, ta] = t[i - 1], [b, tb] = t[i]; return ta + (tb - ta) * (r - a) / (b - a); } return t[t.length - 1][1]; };
  const peak = (k) => { let cv = 0, T0 = 0; for (let r = 1000; r <= lim; r += 50) { const T = (at(base, r) * k * bf - fr(r)) * hpK; cv = Math.max(cv, T * r / 7023); T0 = Math.max(T0, T); } return { cv, nm: T0 }; };
  let k = E.pw, pk = peak(k);
  // benzina: la portano gli iniettori e la pompa; se una delle due non basta la miscela va magra e la potenza si ferma lì
  const capIn = In.cap * cyl, cap = Math.min(capIn, Pb.cap), lean = pk.cv > cap * 1.02, leanPompa = lean && Pb.cap < capIn;
  if (lean) for (let q = 0; q < 6; q++) { k *= Math.pow(cap / pk.cv, 0.8); pk = peak(k); }
  const hp = pk.cv, fuelK = k / E.pw;
  // aria calda: col turbo, se l'intercooler è piccolo per la pressione l'aria entra calda (battito, calore in più)
  const caldo = S.max > 0 ? Math.max(0, boost - Ic.cap) : 0;
  let reg = cyl * Math.min(B.reg, A.reg, Bi.reg, Pi.reg);
  // battito in testa: compressione alta col turbo, la 2618 oltre i 2 bar, o aria troppo calda su pistoni non da turbo
  const knock = (Pi.comp === 'high' && boost > 0.45) || (Pi.comp === 'mid' && boost > 2.0) || (caldo > 0.5 && Pi.comp !== 'low');
  const knockK = E.knockCtl ? 0.8 : 0.6;                                 // la centralina da gara lo sente e ritarda l'anticipo
  if (knock) reg *= knockK;
  const stress = hp / reg;
  let rel = Math.max(0, Math.min(1, 1 - (stress - 0.9) * 3));
  if (lean) rel = Math.min(rel, 0.55);                                   // magra: pistoni che scaldano
  if (caldo > 0.15) rel *= 1 - Math.min(0.45, caldo * (E.knockCtl ? 0.25 : 0.45));
  // olio: sopra i giri che la pompa regge la pressione cala e le bronzine si consumano
  const oilOver = Math.max(0, lim - O.rpmOk);
  if (oilOver > 0) rel *= 1 - Math.min(0.6, oilOver / 2500);
  // calore nell'acqua a piena potenza (kW) e quanto ne porta via il radiatore (più quello dell'olio) a 100 all'ora
  // con l'acqua a 105 °C: sotto il 100 % a gas pieno a lungo la temperatura sale fino alla protezione
  const quota = MOT.quotaAcqua * (S.max > 0 ? 1 + 0.06 * boost : 1) * (lean ? 1.12 : 1) * (1 + 0.2 * caldo);
  const qIn = hp * 0.7355 * quota, kwCool = Rd.kw + (O.kw || 0), qOut = kwCool * (105 - MOT.aria) / 70;
  const coolK = qOut / Math.max(1, qIn);
  // frizione: se la coppia del motore è più di quella che tiene, a gas pieno slitta
  const slitta = pk.nm > F.cap * 0.97;
  const kg = MOT_PARTI.reduce((a, C) => a + (P[C.id].kg || 0), 0) + 40;   // più testata, collettori, accessori
  const price = MOT_PARTI.reduce((a, C) => a + P[C.id].price, 0);
  const turboSim = S.max > 0 ? (S.sc ? { max: boost, a: 1800, b: 5500, up: 0.2, down: 0.5, twin: false } : { max: boost, a: S.a, b: S.b, up: S.up || 0.42, down: 0.85, twin: false }) : null;
  const turboDsp = S.max > 0 ? (S.sc ? { f0: 3200, f1: 9800, w: 0.06, wh: 0.06, damp: 2600, twin: 0, mani: 1 } : { f0: 2000, f1: 7400, w: 0.055, wh: 0.08, damp: 2300, twin: 0, mani: 1 }) : null;
  const voice = {
    pulse: hp > 160 ? 0.85 : 1.0, rough: 0.1 + Cm.lope * 0.3, metal: S.max > 0 ? 0.25 : 0.12, boomRpm: Math.round(lim * 0.45), hiRpm: lim, lope: Cm.lope,
    pop: cyl === 6 ? { f: 0.9, crack: 1.0, len: 1.15, thump: 1.15 } : cyl === 5 ? { f: 0.85, crack: 1.0, len: 1.3, thump: 1.1 } : { f: 1.15, crack: 1.15, len: 0.9 },
  };
  const tipo = `${cyl} cilindri ${disp.toFixed(1)}${S.max > 0 ? (S.sc ? ' volumetrico' : ' turbo') : ''}`;
  const sel2 = Object.assign({}, sel); for (const C of MOT_PARTI) sel2[C.id] = P[C.id].id;
  return {
    ok: true, sel: sel2, parts: P, cyl, disp, nm: Math.round(pk.nm), nmNA: nm, hp: Math.round(hp), hpNA: Math.round(hpNA),
    rpmHp: rH, rpmNm: rN, lim, idle: 800 + Cm.idle, lope: Cm.lope, boost, boostK, turboSim, turboDsp, spark: E.spark, fuelK,
    kg: Math.round(kg), price, rel, stress, lean, leanPompa, knock, caldo, oilOver, slitta, qIn: Math.round(qIn), qOut: Math.round(qOut), coolK,
    cool: { kw: kwCool, fan: Rd.fan, prot: Rd.prot, quota, C: MOT.capTermica },
    ic: S.max > 0 ? { heat: Ic.heat, lag: Ic.lag } : null, clutch: F.cap, ieK: F.ieK || 1, oilRpm: O.rpmOk,
    tq: base.map(([r, t]) => [r, Math.round(t * k)]), voice, tipo,
    deboli: MOT_PARTI.filter((C) => C.id !== 'blocco' && P[C.id].reg !== undefined && P[C.id].reg * cyl * (knock ? knockK : 1) < hp * 1.1).map((C) => C.label),
  };
}
// i motori costruiti prima dei reparti nuovi (olio, intercooler, benzina, radiatore, frizione) non li hanno: si
// montano i più economici che non lo limitano, così quei motori vanno come prima
function motFill(sel) {
  const out = Object.assign({}, sel), miss = MOT_NUOVI.filter((k) => !out[k]);
  for (const k of miss) out[k] = MOT_CAT[k].items[MOT_CAT[k].items.length - 1].id;     // intanto il migliore, per misurarlo
  const c = motCalc(out); if (!c.ok) return out;
  const need = { olio: (it) => it.rpmOk >= c.lim, intercooler: (it) => !c.parts.sovra.max || it.cap >= c.boost, benzina: (it) => it.cap >= c.hp * 1.02,
    radiatore: (it) => (it.kw + (c.parts.olio.kw || 0)) * 80 / 70 >= c.qIn, frizione: (it) => it.cap * 0.97 >= c.nm };
  for (const k of miss) { const its = MOT_CAT[k].items.slice().sort((a, b) => a.price - b.price); out[k] = (its.find(need[k]) || its[its.length - 1]).id; }
  return out;
}
// livello di un pezzo e reparti che ne dipendono (per l'albero di Nico)
const motLvOf = (cat, id) => { const it = motPart(cat, id); return it ? it.lv || 1 : 1; };
// peso del motore di serie di un'auto (per lo swap): dai cilindri e dal tipo
function motKgSerie(carId) {
  const c = typeof CARS !== 'undefined' && CARS[carId]; if (!c) return 150;
  const cyl = carId === 'supra' ? 6 : c.cyl || ((c.tag || '').includes('cinque') ? 5 : 4), diesel = c.P && c.P.limiter < 5200;
  return (cyl >= 6 ? (carId === 'supra' ? 230 : 200) : cyl === 5 ? 165 : 130) + (diesel ? 25 : 0);
}

// posto auto e porta davanti al Pistone (entrata2d.js): l'auto a sinistra del portone, si entra dal portone
if (typeof GAME_POSTI !== 'undefined') GAME_POSTI.motori = { park: -3.3, door: 0 };
if (typeof VG_PLACE !== 'undefined' && PISTONE.on) {
  VG_PLACE.motori = { name: () => 'Il Pistone', what: 'motori', col: '#ff6a2a' };
  // dal 20/11 sera Nico lavora da Luca (negozio unico): il Pistone non è più una tappa e il secondo bar torna al suo posto
}

(function motoriLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  P.mot = function () { const v = this.s.vg || (this.s.vgMot = this.s.vgMot || {}); return v.mot || (v.mot = { list: [], on: {}, n: 0, bozza: Object.assign({}, MOT_BASE) }); };
  // ---- i livelli di Nico: M.liv[reparto] = livello più alto che conosci (di partenza 1)
  P.motLiv = function (cat) { if (this.mode !== 'career') return 4; const L = this.mot().liv || {}; return Math.max(1, Math.min(4, L[cat] || 1)); };
  P.motPuoi = function (cat, id) { const it = motPart(cat, id); return !!it && (it.lv || 1) <= this.motLiv(cat); };
  // cosa serve per il livello dopo di un reparto: prezzo, km, motori costruiti, livelli di altri reparti
  P.motNext = function (cat) {
    const C = MOT_CAT[cat]; if (!C) return null;
    const lv = this.motLiv(cat) + 1; if (lv > 4) return null;
    const L = MOT_LIV[lv], M = this.mot(), km = (this.s.dist || 0) / 1000, req = [];
    if (L.km) req.push({ t: `${L.km} km di viaggio`, ok: km >= L.km });
    if (L.pezzi) req.push({ t: `${L.pezzi} pezzi montati`, ok: (M.montati || 0) >= L.pezzi });
    if (L.motori) req.push({ t: `${L.motori} ${L.motori > 1 ? 'motori costruiti' : 'motore costruito'}`, ok: (M.n || 0) >= L.motori });
    for (const [k, l] of (C.dip && C.dip[lv]) || []) req.push({ t: `${MOT_CAT[k].label} livello ${l}`, ok: this.motLiv(k) >= l });
    return { lv, price: L.price, req, ok: req.every((r) => r.ok), items: C.items.filter((it) => (it.lv || 1) === lv) };
  };
  P.motUnlock = function (cat) {
    const n = this.motNext(cat); if (!n) return { ok: false, why: 'Lo conosci già tutto' };
    if (!this.motAlPistone()) return { ok: false, why: 'Te lo insegna Nico, al Pistone' };
    const no = n.req.find((r) => !r.ok); if (no) return { ok: false, why: 'Prima: ' + no.t.toLowerCase() };
    if (this.mode === 'career' && this.s.money < n.price) return { ok: false, why: `Nico vuole € ${fmt(n.price)}` };
    if (this.mode === 'career') this.s.money -= n.price;
    const M = this.mot(); M.liv = M.liv || {}; M.liv[cat] = n.lv;
    return { ok: true, lv: n.lv, items: n.items };
  };
  P.motUnlockAll = function () { const M = this.mot(); M.liv = Object.fromEntries(MOT_PARTI.map((C) => [C.id, 4])); };
  P.motAlPistone = function () { return !!(this.inside && (this.inside.id === 'shop' || this.inside.id === 'motori')); };   // Nico lavora da Luca
  P.motOf = function (carId) { if (!PISTONE.on) return null; const M = this.mot(), id = M.on[carId || this.car]; return id ? M.list.find((e) => e.id === id) || null : null; };
  // costruire: si paga e il motore entra in magazzino (lo chiama la scena del montaggio, quando l'ultimo pezzo è al suo posto)
  P.motBuild = function (sel, nome) {
    const c = motCalc(sel); if (!c.ok) return { ok: false, why: 'Manca un pezzo: ' + c.missing.map((k) => MOT_CAT[k].label.toLowerCase()).join(', ') };
    sel = c.sel;
    const nonSai = MOT_PARTI.find((C) => !this.motPuoi(C.id, sel[C.id]));
    if (nonSai) return { ok: false, why: `${nonSai.label}: quel pezzo è di livello ${motLvOf(nonSai.id, sel[nonSai.id])}, Nico non te l'ha ancora insegnato` };
    const M = this.mot();
    if (M.list.length >= MOT.maxMotori) return { ok: false, why: `In magazzino ci stanno ${MOT.maxMotori} motori: vendine uno` };
    if (this.mode === 'career' && this.s.money < c.price) return { ok: false, why: `Servono € ${fmt(c.price)}` };
    if (this.mode === 'career') this.s.money -= c.price;
    M.n = (M.n || 0) + 1;
    const e = { id: 'm' + M.n, nome: nome || `${c.tipo} n. ${M.n}`, sel: Object.assign({}, sel), km: 0, rotto: false, prezzo: c.price };
    M.list.push(e);
    if (this.statAdd) this.statAdd('motori');
    return { ok: true, e, c };
  };
  // ---- i pezzi: un pezzo, un posto. Si comprano da Luca (se Nico te li ha insegnati) e stanno in magazzino ('mag'),
  // sul motore di serie di un'auto (dove = id dell'auto, oggi solo la V40) o sul banco di lavoro ('banco').
  // M.pz = [{ u, cat, id, dove }]; costruendo il motore del banco i suoi pezzi diventano il motore (escono da M.pz).
  P.motPz = function () { const M = this.mot(); return M.pz || (M.pz = []); };
  P.motPezzo = function (u) { return this.motPz().find((p) => p.u === u) || null; };
  P.motBuyPart = function (cat, id) {
    const it = motPart(cat, id); if (!it || it.hidden) return { ok: false, why: 'Pezzo non trovato' };
    if (!this.motAlPistone()) return { ok: false, why: 'I pezzi si comprano da Luca' };
    if (!this.motPuoi(cat, id)) return { ok: false, why: `È di livello ${it.lv}: prima te lo deve insegnare Nico` };
    if (this.mode === 'career' && this.s.money < it.price) return { ok: false, why: `Servono € ${fmt(it.price)}` };
    if (this.mode === 'career') this.s.money -= it.price;
    const M = this.mot(); M.nU = (M.nU || 0) + 1;
    const p = { u: 'p' + M.nU, cat, id, dove: 'mag' }; this.motPz().push(p);
    return { ok: true, p };
  };
  P.motValPezzo = function (p) { const it = motPart(p.cat, p.id); return it ? Math.round(it.price * MOT.vendita / 10) * 10 : 0; };
  P.motSellPart = function (u) {
    const p = this.motPezzo(u); if (!p) return { ok: false, why: 'Pezzo non trovato' };
    if (p.dove !== 'mag') return { ok: false, why: 'Prima smontalo' };
    if (!this.motAlPistone()) return { ok: false, why: 'I pezzi si vendono da Luca' };
    const v = this.motValPezzo(p); this.mot().pz = this.motPz().filter((x) => x !== p); if (this.mode === 'career') this.s.money += v;
    return { ok: true, v };
  };
  P.motLavoro = function (cat) { return this.mode === 'career' ? MOT_LAVORO[MOT_INTERNI.includes(cat) ? 'interno' : 'esterno'] : 0; };
  // mettere un pezzo: dove = 'banco' o l'id di un'auto col motore di serie modificabile (MOT_SERIE). Quello che c'era
  // nello stesso reparto torna in magazzino.
  P.motPut = function (u, dove) {
    const p = this.motPezzo(u); if (!p) return { ok: false, why: 'Pezzo non trovato' };
    if (!this.motAlPistone()) return { ok: false, why: 'Si fa da Luca, sul banco di Nico' };
    if (p.dove === dove) return { ok: false, why: 'È già lì' };
    let costo = 0;
    if (dove !== 'banco') {
      if (!MOT_SERIE[dove]) return { ok: false, why: `Sul motore di serie di quest'auto Nico non ci lavora ancora: per ora solo sulla V40` };
      if (p.cat === 'blocco') return { ok: false, why: 'Il blocco è il motore stesso: per cambiarlo si costruisce un motore al banco' };
      if (this.mot().on[dove]) return { ok: false, why: 'Su quest\'auto c\'è un motore costruito: i pezzi vanno sul motore di serie, rimettilo prima' };
      costo = this.motLavoro(p.cat);
      if (this.s.money < costo) return { ok: false, why: `La manodopera costa € ${costo}` };
    }
    for (const q of this.motPz()) if (q !== p && q.dove === dove && q.cat === p.cat) q.dove = 'mag';
    if (costo) this.s.money -= costo;
    p.dove = dove; const M = this.mot(); M.montati = (M.montati || 0) + 1;
    return { ok: true, costo };
  };
  P.motTake = function (u) {
    const p = this.motPezzo(u); if (!p || p.dove === 'mag') return { ok: false, why: 'È già in magazzino' };
    if (!this.motAlPistone()) return { ok: false, why: 'Si fa da Luca, sul banco di Nico' };
    const costo = p.dove === 'banco' ? 0 : this.motLavoro(p.cat);
    if (this.s.money < costo) return { ok: false, why: `La manodopera costa € ${costo}` };
    this.s.money -= costo; p.dove = 'mag'; return { ok: true, costo };
  };
  P.motSel = function (dove) { const o = {}; for (const p of this.motPz()) if (p.dove === dove) o[p.cat] = p.id; return o; };
  // il motore del banco: quando ha tutti i reparti si accende e diventa un motore tuo (i pezzi li hai già pagati)
  P.motBuildBanco = function (nome) {
    const sel = this.motSel('banco'), manca = MOT_PARTI.filter((C) => !sel[C.id]);
    if (manca.length) return { ok: false, why: 'Sul banco manca: ' + manca.map((C) => C.label.toLowerCase()).join(', ') };
    const M = this.mot(); if (M.list.length >= MOT.maxMotori) return { ok: false, why: `In magazzino ci stanno ${MOT.maxMotori} motori: vendine uno` };
    const c = motCalc(sel); if (!c.ok) return { ok: false, why: 'Il motore non torna' };
    M.pz = this.motPz().filter((p) => p.dove !== 'banco');
    M.n = (M.n || 0) + 1;
    const e = { id: 'm' + M.n, nome: nome || `${c.tipo} n. ${M.n}`, sel: Object.assign({}, sel), km: 0, rotto: false, prezzo: c.price };
    M.list.push(e); if (this.statAdd) this.statAdd('motori');
    return { ok: true, e, c };
  };
  // i pezzi montati sul motore di serie di un'auto (solo quelli dei reparti che si possono cambiare)
  P.motSerie = function (carId) { carId = carId || this.car; return MOT_SERIE[carId] ? this.motSel(carId) : {}; };
  P.motCalcSerie = function (carId) { carId = carId || this.car; return MOT_SERIE[carId] ? motCalcSerie(carId, this.motSerie(carId)) : null; };
  // montare su un'auto del garage (al Pistone, da fermi): il motore che c'era (se costruito) torna in magazzino
  P.motMount = function (eid, carId) {
    carId = carId || this.car;
    const M = this.mot(), e = M.list.find((x) => x.id === eid);
    if (!e) return { ok: false, why: 'Motore non trovato' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si montano al Pistone' };
    if (e.rotto) return { ok: false, why: 'È rotto: prima va rifatto' };
    for (const k in M.on) if (M.on[k] === eid && k !== carId) return { ok: false, why: `È montato sulla ${CARS[k] ? CARS[k].short || CARS[k].name : k}: smontalo prima` };
    if (M.on[carId] === eid) return { ok: false, why: 'È già montato lì' };
    if (this.mode === 'career' && this.s.money < MOT.lavoro) return { ok: false, why: `La manodopera costa € ${MOT.lavoro}` };
    if (this.mode === 'career') this.s.money -= MOT.lavoro;
    M.on[carId] = eid;
    return { ok: true };
  };
  P.motUnmount = function (carId) {
    carId = carId || this.car; const M = this.mot();
    if (!M.on[carId]) return { ok: false, why: 'Ha già il suo motore di serie' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si smontano al Pistone' };
    if (this.mode === 'career' && this.s.money < MOT.lavoro) return { ok: false, why: `La manodopera costa € ${MOT.lavoro}` };
    if (this.mode === 'career') this.s.money -= MOT.lavoro;
    delete M.on[carId];
    return { ok: true };
  };
  P.motSell = function (eid) {
    const M = this.mot(), i = M.list.findIndex((x) => x.id === eid); if (i < 0) return { ok: false, why: 'Motore non trovato' };
    if (Object.values(M.on).includes(eid)) return { ok: false, why: 'Prima smontalo' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si vendono al Pistone' };
    const e = M.list[i], v = this.motValue(e);
    M.list.splice(i, 1); if (this.mode === 'career') this.s.money += v;
    return { ok: true, v };
  };
  P.motValue = function (e) { return e.rotto ? Math.round(e.prezzo * 0.15 / 10) * 10 : Math.round(e.prezzo * MOT.vendita * Math.max(0.4, 1 - (e.km || 0) / 4000) / 10) * 10; };
  P.motRepair = function (eid) {
    const M = this.mot(), e = M.list.find((x) => x.id === eid); if (!e || !e.rotto) return { ok: false, why: 'Non è rotto' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si rifanno al Pistone' };
    const c = Math.round(e.prezzo * MOT.revisione / 10) * 10;
    if (this.mode === 'career' && this.s.money < c) return { ok: false, why: `La revisione costa € ${fmt(c)}` };
    if (this.mode === 'career') this.s.money -= c;
    e.rotto = false; e.risk = 0; return { ok: true, c };
  };
  // usura e rotture: solo il motore montato sull'auto che guidi; più è spinto oltre quello che regge, più rischia
  // quando lo tieni sul limitatore a gas pieno
  P.motTick = function (dt, dkm) {
    const e = this.motOf();
    if (!e) {                                  // motore di serie coi pezzi di Nico: calore e frizione come per i costruiti
      const ps = PISTONE.on && MOT_SERIE[this.car] ? this.motSerie() : null;
      if (ps && Object.keys(ps).length) { const st = this.mot(), k = 'serie_' + this.car, ee = st[k] || (st[k] = {}); const c = this.motCalcSerie(); if (c && c.ok) this.motCalore(ee, c, dt); }
      return;
    }
    e.km = (e.km || 0) + (dkm || 0);
    const sim = this.sim;
    if (e.rotto) { if (sim.running) sim.running = false; if (sim.starter) sim.catchAt = 1e9; return; }
    const c = motCalc(e.sel); if (!c.ok) return;
    this.motCalore(e, c, dt);
    if (e.rotto || c.rel >= 0.999) return;
    if (sim.running && sim.rpm > c.lim * 0.9 && (sim.in.thr || 0) > 0.8) {
      e.risk = (e.risk || 0) + dt * (1 - c.rel) * (1 - c.rel) * 0.35;          // tirato al limite: lo stress si accumula
      if (e.risk > 1 && Math.random() < dt * 0.6) {
        e.rotto = true; e.risk = 0; sim.running = false;
        e.guasto = c.lean ? 'grippato' : 'biella';
        this.say(c.lean ? 'Il motore ha grippato: la benzina non bastava e i pistoni si sono fusi. Portalo al Pistone' : 'CRACK! Una biella ha ceduto: il motore è rotto. Portalo al Pistone (carro attrezzi o a spinta)', 'bad');
        if (sim.events) sim.events.push({ type: 'crash', I: 1.2, kind: 'front' });
      } else if (e.risk > 0.6 && !e.warn) { e.warn = true; this.say('Il motore batte in testa e fa un rumore che non ti piace', 'bad'); }
    }
  };
  // temperatura dell'acqua (la calcola sim.js col bilancio di calore del motore costruito): avvisi, protezione della
  // centralina, e se insisti oltre la protezione la guarnizione della testata salta. E la frizione che slitta.
  P.motCalore = function (e, c, dt) {
    const sim = this.sim, prot = c.cool.prot, T = sim.waterT || 0;
    if (!sim.running) { e.cuoce = 0; return; }
    if (T > prot - 5 && T < prot && !e.wCaldo) { e.wCaldo = true; this.say('La lancetta dell\'acqua sale verso il rosso: molla un po\' il gas', 'bad'); }
    if (T < prot - 12) { e.wCaldo = false; e.wProt = false; }
    if (T >= prot && !e.wProt) { e.wProt = true; this.say('Motore in protezione: la centralina taglia la potenza. Accosta e lascialo al minimo, la ventola lo raffredda (non spegnerlo caldo)', 'bad'); }
    if (T > prot + 8) {
      e.cuoce = (e.cuoce || 0) + dt;
      if (e.cuoce > MOT.cottura) {
        e.rotto = true; e.guasto = 'guarnizione'; e.cuoce = 0; sim.running = false;
        this.say('Fumo bianco dallo scarico e l\'acqua che bolle nella vaschetta: la guarnizione della testata è saltata. Portalo al Pistone', 'bad');
        if (this.statAdd) this.statAdd('motori_cotti');
      }
    } else e.cuoce = Math.max(0, (e.cuoce || 0) - dt * 0.5);
    // frizione: a pedale lasciato, in marcia e a gas pieno, il motore sale di giri più delle ruote
    if (sim.gear > 0 && (sim.clutch || 0) < 0.1 && (sim.in.thr || 0) > 0.8 && sim.P && Math.abs(sim.Tc || 0) >= sim.P.clutchMax * 0.97) {
      e.slitT = (e.slitT || 0) + dt;
      if (e.slitT > 1.5 && !e.wFriz) { e.wFriz = true; this.say(`Puzza di frizione bruciata: slitta. Il motore fa ${c.nm} Nm, la frizione ne tiene ${c.clutch}`, 'bad'); }
    } else e.slitT = Math.max(0, (e.slitT || 0) - dt);
  };
  const up = P.update;
  P.update = function (dt) { const d0 = this.s.dist; up.call(this, dt); if (this.s && this.s.vg) this.motTick(dt, Math.max(0, this.s.dist - d0) / 1000); };
})();

// applySettings (index.html) la chiama dopo aver letto i pezzi dell'auto: se l'auto ha un motore costruito,
// coppia, giri, turbo, voce e peso vengono dal motore. Restituisce il motore applicato (o null).
function motApply(game, carId, TP, sim) {
  if (TP && TP.sim) { TP.sim.cool = null; TP.sim.oilRpm = 0; }       // auto col motore di serie: niente bilancio di calore (come prima)
  if (!game || !game.motOf) return null;
  const e = game.motOf(carId);
  if (!e) { if (PISTONE.on && MOT_SERIE[carId] && game.motSerie) motApplySerie(game, carId, TP, sim); return null; }
  const c = motCalc(e.sel); if (!c.ok) return null;
  sim.P.tq = c.tq;
  TP.sim.dm = (TP.sim.dm || 0) + c.kg - motKgSerie(carId);          // il peso del motore in più (o in meno) rispetto a quello di serie: lo somma game.applyMass
  const hasT = !!c.turboSim;
  Object.assign(TP.sim, {
    turbo: hasT ? Object.assign({}, c.turboSim) : { max: 0, a: 9000, b: 9900, up: 1, down: 1, twin: false },
    boostK: c.boostK, limiter: c.lim, idle: c.idle, lope: c.lope * 0.6, camLow: 1, camHigh: 1,
    sparkCut: c.spark, ecuLaunch: c.spark, ecuPops: c.spark && hasT, ic: c.ic, valve: hasT && !c.parts.sovra.sc ? 'bov' : 'recirc',
    cool: Object.assign({}, c.cool), oilRpm: c.oilRpm, clutchMax: c.clutch, Ie: Math.round((TP.sim.Ie || sim.P.Ie) * c.ieK * 1000) / 1000,
  });
  if (!TP.dsp) TP.dsp = {};
  Object.assign(TP.dsp, {
    cyl: c.cyl, voice: c.voice, lope: c.lope, spark: c.spark ? 1 : 0,
    tb: hasT ? c.turboDsp : { f0: 2500, f1: 8000, w: 0, wh: 0, damp: 1700, twin: 0, mani: 1 },
    bov: hasT && !c.parts.sovra.sc ? { v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.75, chirp: 0.25 } : { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.05, chirp: 0 },
  });
  if (TP.dsp.cat) TP.dsp.cat = Object.assign({}, TP.dsp.cat, { pop: c.spark && hasT ? 1.4 : hasT ? 0.7 : 0.3 });
  return c;
}

// ---------------------------------------------------------------- il motore di serie con i pezzi di Nico
// Per ora solo la V40 (decisione del cognato, 20/11): il suo B4204S descritto coi pezzi di Nico. blocco: il blocco
// virtuale dell'auto (non si vende); sel: i pezzi di serie che corrispondono a quelli veri; hp: CV veri di serie.
// La curva vera dell'auto resta quella sua: i pezzi la cambiano in proporzione (motApplySerie).
const MOT_SERIE = {
  v40: { hp: 140, blocco: { id: 's_v40', lv: 1, hidden: true, name: 'B4204S 2.0 16V di serie (lo stesso blocco della T4)', price: 0, kg: 135, cyl: 4, disp: 2.0, reg: 110, note: 'Basamento solido: regge il turbo, i pezzi dentro no.' },
    sel: { albero: 'fuso', bielle: 'fuse', pistoni: 'std', olio: 'serie', testata: 'v4', camme: 'serie', sovra: 'na', intercooler: 'no', iniettori: 'i250', benzina: 'serie', centralina: 'serie', radiatore: 'serie', frizione: 'org' } },
};
for (const k in MOT_SERIE) MOT_CAT.blocco.items.push(MOT_SERIE[k].blocco);
// i reparti del catalogo di Luca che sulle auto di MOT_SERIE adesso fa Nico coi suoi pezzi (nascosti da Luca)
const MOT_LUCA_VIA = ['turbo', 'intercooler', 'ecu', 'clutch'];
function tuningNascosto(carId, cat) { return !!(PISTONE.on && MOT_SERIE[carId] && MOT_LUCA_VIA.includes(cat)); }
const motSerieBase = (carId) => Object.assign({ blocco: MOT_SERIE[carId].blocco.id }, MOT_SERIE[carId].sel);
function motCalcSerie(carId, parts) {
  const S0 = MOT_SERIE[carId]; if (!S0) return null;
  const st = motCalc(motSerieBase(carId)), hpK = S0.hp / st.hp;
  const sel = Object.assign(motSerieBase(carId), parts || {}), c = motCalc(sel, { hpK });
  if (!c.ok) return c;
  const car = typeof CARS !== 'undefined' && CARS[carId];
  if (!(parts || {}).frizione && car) { c.clutch = car.P.clutchMax; c.ieK = 1; c.slitta = c.nm > c.clutch * 0.97; }   // frizione dell'auto
  c.stock = st; c.hpK = hpK; c.serie = true; c.parts0 = parts || {};
  c.price = MOT_PARTI.reduce((a, C) => a + ((parts || {})[C.id] ? motPart(C.id, parts[C.id]).price : 0), 0);
  return c;
}
function motApplySerie(game, carId, TP, sim) {
  const parts = game.motSerie(carId); if (!Object.keys(parts).length) return null;
  const c = motCalcSerie(carId, parts); if (!c || !c.ok) return null;
  const at = (t, r) => { for (let i = 1; i < t.length; i++) if (r < t[i][0]) { const [a, ta] = t[i - 1], [b, tb] = t[i]; return ta + (tb - ta) * (r - a) / (b - a); } return t[t.length - 1][1]; };
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, car = CARS[carId];
  // curva vera dell'auto, cambiata in proporzione alla coppia indicata del motore coi pezzi rispetto a quello di serie
  sim.P.tq = car.P.tq.map(([r, t]) => [r, Math.round((t - fr(r)) * (at(c.tq, r) - fr(r)) / Math.max(1, at(c.stock.tq, r) - fr(r)) + fr(r))]);
  const P = c.parts, hasT = !!parts.sovra && !!c.turboSim;
  TP.sim.limiter = (TP.sim.limiter || car.P.limiter) + (c.lim - c.stock.lim);
  if (parts.camme) Object.assign(TP.sim, { idle: c.idle, lope: c.lope * 0.6 });
  if (hasT) {
    Object.assign(TP.sim, { turbo: Object.assign({}, c.turboSim), boostK: c.boostK, ic: c.ic, valve: P.sovra.sc ? 'recirc' : 'bov' });
    if (!TP.dsp) TP.dsp = {};
    TP.dsp.tb = c.turboDsp; TP.dsp.bov = !P.sovra.sc ? { v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.7, chirp: 0.3 } : { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.05, chirp: 0 };
    if (TP.look) { TP.look.turbo = true; TP.look.badge = TP.look.badge || 'T'; }
  }
  if (parts.centralina) { const sp = P.centralina.spark; Object.assign(TP.sim, { sparkCut: sp, ecuLaunch: sp, ecuPops: sp && hasT }); if (TP.dsp) TP.dsp.spark = sp ? 1 : 0; }
  if (TP.dsp && TP.dsp.cat) TP.dsp.cat = Object.assign({}, TP.dsp.cat, { pop: TP.sim.ecuPops ? 1.4 : hasT ? 0.7 : TP.dsp.cat.pop });
  if (parts.camme && TP.dsp) TP.dsp.lope = c.lope;
  if (parts.frizione) { TP.sim.clutchMax = c.clutch; TP.sim.Ie = Math.round((TP.sim.Ie || car.P.Ie) * c.ieK * 1000) / 1000; if (TP.dsp) TP.dsp.rattle = c.ieK < 1 ? 1 : 0; }
  TP.sim.cool = Object.assign({}, c.cool); TP.sim.oilRpm = c.oilRpm;
  TP.sim.dm = (TP.sim.dm || 0) + MOT_PARTI.reduce((a, C) => a + (parts[C.id] ? (motPart(C.id, parts[C.id]).kg || 0) - (motPart(C.id, MOT_SERIE[carId].sel[C.id]) || {}).kg || 0 : 0), 0);
  return c;
}
// salvataggi di prima: i pezzi motore di Luca della V40 (turbo, intercooler, centralina, frizione) adesso li fa Nico.
// Quelli comprati tornano in soldi (prezzo pieno) e sull'auto si rimettono quelli di serie. Una volta sola per pezzo.
function motLucaMigra(game, S) {
  if (!PISTONE.on || !game || !S) return 0;
  let rimborso = 0;
  for (const carId in MOT_SERIE) {
    const T = CARS[carId] && CARS[carId].tuning; if (!T) continue;
    for (const cat of MOT_LUCA_VIA) {
      if (!T[cat]) continue;
      const base = T[cat].items[0].id;
      if (S.tunes && S.tunes[carId]) S.tunes[carId][cat] = base;
      if (S.tune && game.car === carId) S.tune[cat] = base;
      for (const it of T[cat].items) { const key = carId + '|' + cat + ':' + it.id; if (game.s.owned && game.s.owned[key]) { delete game.s.owned[key]; if (game.mode === 'career') rimborso += it.price || 0; } }
    }
  }
  if (rimborso) { game.s.money += rimborso; if (game.say) game.say(`Luca: «Turbo, centraline e frizioni della V40 adesso le fa Nico, coi suoi pezzi. Ti ridò quello che avevi speso: € ${rimborso.toLocaleString('it-IT')}»`, 'money'); }
  return rimborso;
}

if (typeof window !== 'undefined') Object.assign(window, { MOT_SERIE, MOT_LUCA_VIA, MOT_INTERNI, MOT_LAVORO, tuningNascosto, motCalcSerie, motApplySerie, motLucaMigra });
if (typeof window !== 'undefined') Object.assign(window, { PISTONE, MOT, MOT_LIV, MOT_PARTI, MOT_BASE, MOT_NUOVI, motCalc, motFill, motApply, motKgSerie });
