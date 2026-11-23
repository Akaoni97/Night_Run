// ============================================================================
//  Night Run · Monumenti e quartieri delle capitali (dopo citta2d.js, v0.112)
//  Qui stanno i dati: i monumenti lontani (`Street2D.CITY_LANDMARKS`, disegnati a codice come sagome illuminate) e i quartieri
//  di ogni capitale (`Street2D.CITY_DISTRICTS[id]`, stesso formato di `Street2D.DISTRICTS` in quartieri2d.js). Tokyo resta
//  con i suoi quartieri di sempre. Una `land` con più monumenti si scrive «a|b|c» (se ne sceglie uno a caso per tessera).
//  Per aggiungere un monumento: una voce in LM con le misure e `draw`. Per un quartiere: una voce nell'elenco della città.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.CITY_LANDMARKS) return;
  const LM = Street2D.CITY_LANDMARKS, CITY = Street2D.CITY_DISTRICTS, sh = Street2D.shade;
  const S = Street2D.prototype, baseLand = S.landmark;
  // più monumenti in una voce sola
  S.landmark = function (kind, r, D) { if (kind.includes('|')) { const k = kind.split('|'); kind = k[Math.floor(r(42) * k.length)]; } return baseLand.call(this, kind, r, D); };

  // i monumenti (disegnati ad alta definizione) stanno in citta_monumenti.js

  // stili di facciata: targhe delle vie, bandiere e particolari (si disegnano in cityFacade, `ex` e `plate`)
  const FX = Street2D.CITY_FACADES;
  const setF = (id, o) => Object.assign(FX[id], o);
  setF('roma_palazzo', { ex: ['plate', 'bucato', 'madonnella', 'tabacchi'], plate: ['#e8e4d4', '#1a1a2a', 'VIA DEL CORSO'] });
  setF('roma_umbertino', { ex: ['plate', 'tabacchi', 'bucato'], plate: ['#e8e4d4', '#1a1a2a', 'VIA DEL CORSO'] });
  setF('parigi_haussmann', { ex: ['plate', 'fleurs', 'tabacFr', 'pharmacy'], plate: ['#1a3a8a', '#f4f1e6', 'RUE DE RIVOLI'] });
  setF('parigi_belleepoque', { ex: ['plate', 'fleurs', 'tabacFr', 'pharmacy'], plate: ['#1a3a8a', '#f4f1e6', 'RUE DE RIVOLI'] });
  setF('londra_mattoni', { ex: ['plate'], plate: ['#f4f1e6', '#1a1a2a', 'REGENT ST W1'], alt: ['pub', 0.3] });
  setF('londra_vittoriano', { ex: ['plate'], plate: ['#f4f1e6', '#1a1a2a', 'REGENT ST W1'], alt: ['pub', 0.45] });
  setF('stoccolma_gamla', { ex: ['plate', 'flag'], plate: ['#1a5aa8', '#f4f1e6', 'STORGATAN'], flag: ['#1a5aa8', 'cross', '#ffd23f'] });
  setF('stoccolma_citta', { ex: ['plate', 'flag'], plate: ['#1a5aa8', '#f4f1e6', 'STORGATAN'], flag: ['#1a5aa8', 'cross', '#ffd23f'] });
  setF('berlino_altbau', { ex: ['plate', 'graffiti'], plate: ['#f4f1e6', '#1a1a2a', 'FRIEDRICHSTR'] });
  setF('berlino_platte', { ex: ['graffiti', 'plate'], plate: ['#f4f1e6', '#1a1a2a', 'FRIEDRICHSTR'], exP: 0.75 });
  setF('praga_barocco', { ex: ['plate', 'statuette'], plate: ['#f4f1e6', '#c4241c', 'NA PRIKOPE'] });
  setF('vienna_ring', { ex: ['plate', 'statuette'], plate: ['#1a3a8a', '#f4f1e6', 'KARNTNER STR'] });
  setF('madrid_granvia', { ex: ['plate', 'jamon', 'statuette'], plate: ['#1a4aa8', '#f4f1e6', 'GRAN VIA'] });
  setF('lisbona_azulejo', { ex: ['plate', 'azulejo', 'bucato', 'balcLights'], plate: ['#e8e4d4', '#2a5aa8', 'RUA AUGUSTA'] });
  setF('atene_cubo', { ex: ['bougainvillea', 'flag', 'plate'], plate: ['#1a4aa8', '#f4f1e6', 'ERMOU'], flag: ['#f4f1e6', 'stripes', '#2a5aa8'] });
  setF('atene_polikatoikia', { ex: ['flag', 'plate'], plate: ['#1a4aa8', '#f4f1e6', 'ERMOU'], flag: ['#f4f1e6', 'stripes', '#2a5aa8'] });
  setF('washington_federale', { ex: ['flag', 'plate'], plate: ['#1a6a3a', '#f4f1e6', 'K ST NW'], flag: ['#f4f1e6', 'us'], exP: 0.7 });
  setF('washington_mattoni', { ex: ['flag', 'plate'], plate: ['#1a6a3a', '#f4f1e6', 'K ST NW'], flag: ['#f4f1e6', 'us'] });

  // ---------------------------------------------------------------- quartieri
  // modello: una funzione che riempie i campi comuni
  const FAR = (a) => a;
  const D = (o) => Object.assign({ len: 1000, dark: 0.28, farDark: 0.55, signP: 0.55, flick: 0.12, hazeA: 1, glowA: 0.14, broken: 0, gradeA: 0.08, people: 5, landP: 0.14 }, o);

  CITY.roma = [
    D({ id: 'roma_corso', name: 'VIA DEL CORSO', len: 1100, kinds: { 'fac:roma_palazzo': 5, 'fac:roma_umbertino': 3, boutique: 0.8, hotel: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c', '#2e2034'], farH: 0.9, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['BAR', 'GELATI', 'PIZZA', 'TRATTORIA', 'FARMACIA', 'TABACCHI', 'OSTERIA', 'CAFFE'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 60], glow: [255, 150, 70], lamp: '#ffbf6a', grade: [255, 150, 80], gradeA: 0.1, land: 'colosseo|pantheon|cupola', landP: 0.2, people: 7 }),
    D({ id: 'roma_popolo', name: 'PIAZZA DEL POPOLO', len: 900, kinds: { 'fac:roma_palazzo': 4, 'fac:roma_umbertino': 4, park: 1.2, boutique: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c'], farH: 0.85, win: ['#ffd98a', '#ffe9b8'],
      words: ['CAFFE', 'BAR', 'GELATERIA', 'LIBRERIA', 'ENOTECA', 'PIZZA'], neon: ['#ffb000', '#ff5a3a', '#b8ff3a'],
      haze: [100, 56, 70], glow: [255, 140, 80], lamp: '#ffc070', grade: [255, 130, 70], gradeA: 0.1, land: 'pantheon|cupola|colosseo', landP: 0.16, people: 8 }),
    D({ id: 'roma_eur', name: 'EUR', len: 800, kinds: { office: 3, tower: 2, hotel: 1.2, 'fac:roma_umbertino': 1.5, park: 1 },
      mid: ['#2a3350', '#2a3a5a', '#34304a'], far: ['#1c1850', '#241a58', '#18144a'], farH: 1.1, win: ['#fff0c8', '#ffe9b8', '#cfe6ff'],
      words: ['BANCA', 'UFFICI', 'HOTEL', 'ENI', 'BAR'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6'], haze: [60, 60, 120], glow: [120, 150, 255], lamp: '#ffd7a0', grade: [180, 160, 255], gradeA: 0.08, land: 'spire', landP: 0.08, people: 4 }),
  ];

  CITY.parigi = [
    D({ id: 'parigi_champs', name: 'CHAMPS-ELYSEES', len: 1200, kinds: { 'fac:parigi_haussmann': 5, 'fac:parigi_belleepoque': 3, boutique: 1.6, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42', '#262a5a'], farH: 1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'],
      words: ['CAFE', 'BRASSERIE', 'PHARMACIE', 'TABAC', 'BOULANGERIE', 'HOTEL', 'BISTRO', 'LUXE'], neon: ['#ffd98a', '#ff2e88', '#2ee6ff', '#f4f1e6'],
      haze: [70, 70, 130], glow: [255, 200, 110], lamp: '#ffd98a', grade: [255, 200, 120], gradeA: 0.08, land: 'eiffel|notredame|arco', landP: 0.2, people: 8 }),
    D({ id: 'parigi_concorde', name: 'PLACE DE LA CONCORDE', len: 900, kinds: { 'fac:parigi_haussmann': 4, 'fac:parigi_belleepoque': 4, park: 1.5, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42'], farH: 0.95, win: ['#ffe9b8', '#fff4d8'],
      words: ['CAFE', 'BISTRO', 'LIBRAIRIE', 'FLEURS', 'BAR', 'TABAC'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [70, 66, 130], glow: [255, 190, 110], lamp: '#ffd98a', grade: [255, 190, 130], gradeA: 0.08, land: 'eiffel|notredame', landP: 0.22, people: 8 }),
    D({ id: 'parigi_defense', name: 'LA DEFENSE', len: 700, kinds: { tower: 3, office: 2.6, hotel: 1, 'fac:parigi_belleepoque': 1 },
      mid: ['#16405e', '#1b3a6a'], far: ['#16264e', '#1a2c5a', '#142046'], farH: 1.5, win: ['#fff0c8', '#cfe6ff', '#ffe9b8'], dark: 0.3,
      words: ['BANQUE', 'BUREAUX', 'HOTEL', 'METRO'], neon: ['#9fe0ff', '#f4f1e6', '#ffd98a'], haze: [44, 70, 140], glow: [110, 170, 255], lamp: '#e4ecff', grade: [100, 160, 255], gradeA: 0.12, land: 'arco', landP: 0.1, people: 3 }),
  ];

  CITY.londra = [
    D({ id: 'londra_regent', name: 'REGENT STREET', len: 1100, kinds: { 'fac:londra_vittoriano': 5, 'fac:londra_mattoni': 2, boutique: 1.4, hotel: 0.8 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34', '#262a48'], farH: 1, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PUB', 'CAFE', 'HOTEL', 'BOOKS', 'CHEMIST', 'TEA ROOMS', 'TAXI', 'BANK'], neon: ['#ffb000', '#ff3a2a', '#2ee6ff', '#b8ff3a'],
      haze: [80, 84, 110], hazeA: 1.3, glow: [255, 160, 70], lamp: '#ffa64a', grade: [150, 170, 210], gradeA: 0.12, land: 'bigben|towerbridge|ferris', landP: 0.2, people: 8 }),
    D({ id: 'londra_trafalgar', name: 'TRAFALGAR SQUARE', len: 900, kinds: { 'fac:londra_vittoriano': 4, 'fac:londra_mattoni': 3, park: 1, hotel: 1 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34'], farH: 1, win: ['#ffd98a', '#ffe9b8'],
      words: ['PUB', 'GALLERY', 'CAFE', 'TICKETS', 'THEATRE', 'BAR'], neon: ['#ffb000', '#ff3a2a', '#b07bff'],
      haze: [80, 80, 112], hazeA: 1.35, glow: [255, 150, 70], lamp: '#ffa64a', grade: [150, 165, 205], gradeA: 0.12, land: 'bigben|towerbridge|ferris', landP: 0.18, people: 8 }),
    D({ id: 'londra_docklands', name: 'DOCKLANDS', len: 800, kinds: { tower: 3, office: 2.6, 'fac:londra_mattoni': 1.2, containers: 0.6 },
      mid: ['#16405e', '#1b3a6a'], far: ['#16264e', '#1a2c5a', '#142046'], farH: 1.5, win: ['#fff0c8', '#cfe6ff', '#ffe9b8'], dark: 0.3,
      words: ['BANK', 'OFFICES', 'DLR', 'HOTEL'], neon: ['#9fe0ff', '#f4f1e6', '#ffd98a'], haze: [60, 76, 120], hazeA: 1.2, glow: [110, 170, 255], lamp: '#e4ecff', grade: [120, 160, 230], gradeA: 0.1, land: 'ferris|spire', landP: 0.1, people: 3 }),
  ];

  CITY.stoccolma = [
    D({ id: 'stoccolma_drott', name: 'DROTTNINGGATAN', len: 1000, kinds: { 'fac:stoccolma_citta': 4, 'fac:stoccolma_gamla': 3, boutique: 1 },
      mid: ['#7a7a82', '#8a7a6a'], far: ['#141c48', '#1a2250', '#10163e'], farH: 0.95, win: ['#fff0c8', '#ffe9b8', '#ffd98a'],
      words: ['CAFE', 'FIKA', 'APOTEK', 'BAR', 'SMORGAS', 'HOTELL', 'KONDITORI'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6'],
      haze: [40, 64, 120], glow: [120, 170, 255], lamp: '#ffe0b0', grade: [120, 170, 255], gradeA: 0.12, land: 'stadshuset|ironspire', landP: 0.2, people: 6 }),
    D({ id: 'stoccolma_stortorget', name: 'STORTORGET', len: 900, kinds: { 'fac:stoccolma_gamla': 6, 'fac:stoccolma_citta': 1.5, park: 0.6 },
      mid: ['#9a7a3a', '#9a4a3a'], far: ['#141c48', '#1a2250', '#10163e'], farH: 0.8, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['CAFE', 'KROG', 'ANTIK', 'BAR', 'FIKA'], neon: ['#ffd98a', '#ff5a3a', '#2ee6ff'],
      haze: [44, 60, 116], glow: [140, 180, 255], lamp: '#ffd8a0', grade: [140, 170, 240], gradeA: 0.12, land: 'ironspire|stadshuset', landP: 0.2, people: 6 }),
  ];

  CITY.berlino = [
    D({ id: 'berlino_linden', name: 'UNTER DEN LINDEN', len: 1000, kinds: { 'fac:berlino_altbau': 5, 'fac:berlino_platte': 1.5, hotel: 1 },
      mid: ['#7a7468', '#6a6a70'], far: ['#181a3e', '#1e2046', '#14163a'], farH: 1, win: ['#fff4d8', '#e8f0ff', '#ffe9b8'],
      words: ['CAFE', 'BIERGARTEN', 'APOTHEKE', 'BAR', 'HOTEL', 'KINO', 'IMBISS'], neon: ['#e8f0ff', '#ff2e88', '#b8ff3a', '#ffb000'],
      haze: [60, 68, 100], glow: [190, 210, 255], lamp: '#e8f0ff', grade: [160, 180, 230], gradeA: 0.12, land: 'brandenburg|fernsehturm|berlindom', landP: 0.2, people: 6 }),
    D({ id: 'berlino_alex', name: 'ALEXANDERPLATZ', len: 1000, kinds: { 'fac:berlino_platte': 5, 'fac:berlino_altbau': 2, office: 1.4, tower: 1 },
      mid: ['#6a6e76', '#767a80'], far: ['#181a3e', '#1e2046', '#14163a'], farH: 1.1, win: ['#e8f0ff', '#cfe6ff', '#fff4d8'], dark: 0.35,
      words: ['IMBISS', 'DONER', 'KAUFHAUS', 'BAR', 'KINO', 'U-BAHN'], neon: ['#e8f0ff', '#ff2e88', '#ffb000'],
      haze: [56, 64, 96], glow: [180, 200, 255], lamp: '#dfe8ff', grade: [150, 170, 225], gradeA: 0.14, land: 'fernsehturm', landP: 0.26, people: 6 }),
  ];

  CITY.praga = [
    D({ id: 'praga_vaclav', name: 'VACLAVSKE NAMESTI', len: 1000, kinds: { 'fac:praga_barocco': 4, 'fac:vienna_ring': 1.5, hotel: 1.2, boutique: 0.8 },
      mid: ['#9a6a6a', '#7a8a6a'], far: ['#241a44', '#2a1e4e', '#1e163a'], farH: 1, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PIVNICE', 'CAFE', 'HOTEL', 'BAR', 'LEKARNA', 'POHODA', 'CUKRARNA'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff', '#b07bff'],
      haze: [90, 60, 110], glow: [255, 160, 90], lamp: '#ffc070', grade: [220, 150, 170], gradeA: 0.1, land: 'tyn|vito', landP: 0.22, people: 7 }),
    D({ id: 'praga_staromestske', name: 'STAROMESTSKE NAMESTI', len: 1000, kinds: { 'fac:praga_barocco': 6, 'fac:vienna_ring': 1 },
      mid: ['#9a6a6a', '#7a8a6a'], far: ['#241a44', '#2a1e4e', '#1e163a'], farH: 0.9, win: ['#ffd98a', '#ffe9b8'],
      words: ['PIVNICE', 'CAFE', 'RESTAURACE', 'BAR', 'KRYSTAL'], neon: ['#ffb000', '#ff5a3a', '#b8ff3a'],
      haze: [96, 60, 106], glow: [255, 150, 90], lamp: '#ffc070', grade: [230, 150, 160], gradeA: 0.1, land: 'tyn|vito', landP: 0.26, people: 8 }),
  ];

  CITY.vienna = [
    D({ id: 'vienna_ring', name: 'RINGSTRASSE', len: 1100, kinds: { 'fac:vienna_ring': 6, 'fac:praga_barocco': 1, hotel: 1.2, boutique: 0.8 },
      mid: ['#9a9482', '#a89c84'], far: ['#1e1a48', '#241e50', '#181440'], farH: 1, win: ['#ffe9b8', '#fff4d8', '#ffd98a'],
      words: ['CAFE', 'KONDITOREI', 'HOTEL', 'OPER', 'BAR', 'APOTHEKE', 'WIRTSHAUS'], neon: ['#ffd98a', '#ff2e88', '#f4f1e6'],
      haze: [70, 62, 110], glow: [255, 200, 120], lamp: '#ffe0a0', grade: [220, 190, 150], gradeA: 0.08, land: 'stephansdom|karlskirche|ferris', landP: 0.2, people: 7 }),
    D({ id: 'vienna_stephans', name: 'STEPHANSPLATZ', len: 900, kinds: { 'fac:vienna_ring': 4, 'fac:praga_barocco': 3, boutique: 1.2 },
      mid: ['#9a9482', '#a89c84'], far: ['#1e1a48', '#241e50', '#181440'], farH: 0.95, win: ['#ffe9b8', '#ffd98a'],
      words: ['CAFE', 'SACHER', 'WURST', 'BAR', 'JUWELIER'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [74, 62, 106], glow: [255, 190, 120], lamp: '#ffe0a0', grade: [230, 190, 150], gradeA: 0.08, land: 'stephansdom|karlskirche', landP: 0.28, people: 8 }),
  ];

  CITY.madrid = [
    D({ id: 'madrid_granvia', name: 'GRAN VIA', len: 1200, kinds: { 'fac:madrid_granvia': 6, hotel: 1.2, boutique: 1.2, tower: 0.5 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634', '#2e2048'], farH: 1.1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'], signP: 0.9, flick: 0.2,
      words: ['TAPAS', 'CERVECERIA', 'FARMACIA', 'HOTEL', 'BAR', 'CINE', 'JAMON', 'CAFE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 90], glow: [255, 100, 120], lamp: '#ffb860', grade: [255, 120, 120], gradeA: 0.1, land: 'metropolis|toro', landP: 0.26, people: 9 }),
    D({ id: 'madrid_sol', name: 'PUERTA DEL SOL', len: 900, kinds: { 'fac:madrid_granvia': 5, 'fac:parigi_belleepoque': 1.5, boutique: 1 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634'], farH: 1, win: ['#ffe9b8', '#ffd98a'], signP: 0.8,
      words: ['TAPAS', 'BAR', 'CAFE', 'TIENDA', 'LOTERIA', 'RESTAURANTE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff'],
      haze: [110, 60, 84], glow: [255, 110, 120], lamp: '#ffb860', grade: [255, 120, 110], gradeA: 0.1, land: 'metropolis|toro', landP: 0.2, people: 9 }),
  ];

  CITY.lisbona = [
    D({ id: 'lisbona_liberdade', name: 'AVENIDA DA LIBERDADE', len: 1000, kinds: { 'fac:lisbona_azulejo': 4, 'fac:madrid_granvia': 1.5, boutique: 1.2, hotel: 1 },
      mid: ['#4a6a8a', '#8a8a52'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.95, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PASTELARIA', 'CAFE', 'BAR', 'FARMACIA', 'TASCA', 'HOTEL', 'FADO'], neon: ['#ffb000', '#2ee6ff', '#ff5a3a', '#b8ff3a'],
      haze: [100, 70, 80], glow: [255, 170, 100], lamp: '#ffc880', grade: [255, 170, 110], gradeA: 0.1, land: 'santajusta|belem|castelo', landP: 0.22, people: 7 }),
    D({ id: 'lisbona_comercio', name: 'PRACA DO COMERCIO', len: 900, kinds: { 'fac:lisbona_azulejo': 6, 'fac:roma_umbertino': 1, park: 0.6 },
      mid: ['#8a8a52', '#8a6a4a'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.9, win: ['#ffd98a', '#ffe9b8'],
      words: ['PASTEIS', 'CAFE', 'TASCA', 'BAR', 'LOJA', 'VINHOS'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff'],
      haze: [96, 70, 90], glow: [255, 160, 100], lamp: '#ffc880', grade: [255, 160, 110], gradeA: 0.1, land: 'belem|castelo|santajusta', landP: 0.24, people: 7 }),
  ];

  CITY.atene = [
    D({ id: 'atene_syntagma', name: 'SYNTAGMA SQUARE', len: 1000, kinds: { 'fac:atene_polikatoikia': 4, 'fac:atene_cubo': 2.5, hotel: 1, park: 0.8 },
      mid: ['#8a8678', '#9a9686'], far: ['#16204e', '#1c2858', '#121a44'], farH: 0.9, win: ['#ffe9b8', '#ffd98a', '#fff4d8'],
      words: ['TAVERNA', 'GYROS', 'CAFE', 'HOTEL', 'BAR', 'FARMAKEIO', 'SOUVLAKI'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6', '#ff2e88'],
      haze: [60, 84, 140], glow: [140, 190, 255], lamp: '#ffe4b0', grade: [140, 190, 255], gradeA: 0.1, land: 'partenone', landP: 0.3, people: 8 }),
    D({ id: 'atene_ermou', name: 'ERMOU STREET', len: 1000, kinds: { 'fac:atene_cubo': 4, 'fac:atene_polikatoikia': 3, boutique: 1.2 },
      mid: ['#b8b4a8', '#c0bcb0'], far: ['#16204e', '#1c2858', '#121a44'], farH: 0.85, win: ['#ffe9b8', '#ffd98a'],
      words: ['TAVERNA', 'CAFE', 'SOUVLAKI', 'BAR', 'MODA', 'OUZERI'], neon: ['#2ee6ff', '#ffd98a', '#ff5a3a'],
      haze: [60, 80, 136], glow: [140, 190, 255], lamp: '#ffe4b0', grade: [140, 185, 250], gradeA: 0.1, land: 'partenone', landP: 0.3, people: 8 }),
  ];

  CITY.washington = [
    D({ id: 'wash_penn', name: 'PENNSYLVANIA AVENUE', len: 1100, kinds: { 'fac:washington_federale': 4, 'fac:washington_mattoni': 2, office: 1.4, hotel: 1 },
      mid: ['#aaa8a0', '#b4b2aa'], far: ['#141a46', '#1a2050', '#10163c'], farH: 0.9, win: ['#fff4d8', '#ffe9b8'], dark: 0.35, signP: 0.4,
      words: ['DINER', 'CAFE', 'BANK', 'HOTEL', 'BAR', 'PHARMACY', 'DELI'], neon: ['#ff3a2a', '#2a5fd8', '#f4f1e6', '#ffb000'],
      haze: [50, 66, 116], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'campidoglio|lincoln|obelisco', landP: 0.26, people: 5 }),
    D({ id: 'wash_constitution', name: 'CONSTITUTION AVENUE', len: 1000, kinds: { 'fac:washington_federale': 5, park: 1.4, 'fac:washington_mattoni': 1 },
      mid: ['#aaa8a0', '#b4b2aa'], far: ['#141a46', '#1a2050', '#10163c'], farH: 0.85, win: ['#fff4d8', '#ffe9b8'], dark: 0.4, signP: 0.25,
      words: ['MUSEUM', 'CAFE', 'BANK', 'DELI'], neon: ['#ff3a2a', '#2a5fd8', '#f4f1e6'],
      haze: [50, 64, 112], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'lincoln|obelisco|campidoglio', landP: 0.3, people: 4 }),
  ];
  // un monumento ogni 12 tessere lontane (se ne vede più o meno uno per schermo), con una fase diversa per quartiere
  let ph = 2; for (const id in CITY) for (const d of CITY[id]) { if (d.land) { d.landEvery = 12; d.landPhase = ph; ph = (ph + 4) % 9; } }
  // oggetti del marciapiede di ogni quartiere (si disegnano in citta_dettagli.js)
  const PROPS_BY = {
    roma_corso: ['pino', 'nasone', 'tavolini', 'ztl', 'vespa', 'edicola', 'cipresso'], roma_popolo: ['pino', 'fontana', 'tavolini', 'colonna', 'nasone', 'cipresso', 'vespa'], roma_eur: ['pino', 'cipresso', 'ztl', 'vespa'],
    parigi_champs: ['morris', 'platano', 'lampadaire', 'terrasse', 'kiosque', 'wallace'], parigi_concorde: ['platano', 'lampadaire', 'bouquiniste', 'morris', 'terrasse', 'wallace'], parigi_defense: ['metro', 'lampadaire', 'platano'],
    londra_regent: ['cabina', 'pilastro', 'roundel', 'fermata', 'lampioneL', 'ringhiera', 'semaforo'], londra_trafalgar: ['cabina', 'lampioneL', 'roundel', 'fermata', 'pilastro', 'ringhiera'], londra_docklands: ['roundel', 'semaforo', 'lampioneL', 'fermata'],
    stoccolma_drott: ['bandieraSE', 'tbana', 'biciclette', 'betulla', 'cafeSE'], stoccolma_stortorget: ['bandieraSE', 'biciclette', 'cafeSE', 'betulla'],
    berlino_linden: ['ampel', 'litfass', 'tiglio', 'ubahn', 'doner'], berlino_alex: ['ampel', 'ubahn', 'doner', 'mauer', 'litfass'],
    praga_vaclav: ['lampagot', 'statua', 'birreria', 'kastanie'], praga_staromestske: ['lampagot', 'statua', 'birreria', 'kastanie'],
    vienna_ring: ['lampagot', 'wurst', 'kastanie', 'statua', 'ubahn'], vienna_stephans: ['wurst', 'lampagot', 'statua', 'kastanie'],
    madrid_granvia: ['metroM', 'terraza', 'fernandina', 'madrono'], madrid_sol: ['metroM', 'terraza', 'fernandina', 'madrono'],
    lisbona_liberdade: ['palma', 'arraial', 'jacaranda', 'pasteis', 'azulejoPannello'], lisbona_comercio: ['arraial', 'palma', 'pasteis', 'azulejoPannello', 'jacaranda'],
    atene_syntagma: ['olivo', 'bandieraGR', 'periptero', 'colonnaGR', 'gatto', 'arancio'], atene_ermou: ['olivo', 'pergola', 'periptero', 'arancio', 'gatto', 'bandieraGR'],
    wash_penn: ['bandieraUS', 'cassetta', 'idrante', 'metroDC', 'ciliegio', 'hotdog', 'segnaleUS'], wash_constitution: ['bandieraUS', 'ciliegio', 'hotdog', 'idrante', 'cassetta', 'segnaleUS'],
  };
  for (const id in CITY) for (const d of CITY[id]) { d.props = PROPS_BY[d.id] || []; d.propP = 0.9; }
})();
