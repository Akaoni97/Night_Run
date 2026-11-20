// ============================================================================
//  Night Run · Suggerimenti dei primi minuti (dopo pensieri.js)
//  Un consiglio alla volta, nel momento in cui serve: accendere il motore, partire dalla P, menu e telefono, benzina,
//  limite di velocità, officina, joystick strano. Ognuno compare una volta sola (si ricorda nel browser), mai in un locale,
//  col menu o il telefono aperti o davanti a una domanda, e non prima di 40 s dall'ultimo. Si spegne in Impostazioni → Guida.
//  Parte pura (`sgScegli`) provata in test/suggerimenti.test.js; `NightSugg.tick` la chiama dal ciclo di `index.html`.
//  I testi si cambiano qui.
// ============================================================================
const SG_PAUSA = 40;                          // secondi minimi tra un suggerimento e il prossimo
const SG_LISTA = [
  { id: 'accendi', quando: (c) => !c.motore && c.fermo && c.tStrada >= 12,
    testo: 'Per accendere il motore tieni premuto Invio (o il pulsante AVVIA). Di serie il cambio è automatico: la leva parte in P.' },
  { id: 'leva', quando: (c) => c.motore && c.fermo && c.auto && (c.leva === 'P' || c.leva === 'N') && c.tMotore >= 8,
    testo: 'La leva è in P o N: premi E fino a D, poi gas (W). Q torna indietro verso P.' },
  { id: 'menu', quando: (c) => c.km >= 1,
    testo: 'Tab apre il menu (officina, bagagliaio, impostazioni), 0 il telefono, T la mappa del mondo. Esc chiude.' },
  { id: 'benzina', quando: (c) => c.benzina < 0.25,
    testo: 'Benzina bassa: i benzinai sono le tappe «fuel». Rallenta, fermati davanti al locale e premi U per entrare.' },
  { id: 'limite', quando: (c) => c.kmh > 135,
    testo: 'Oltre i 130 km/h rischi la multa. Autovelox e Tutor (tratto sorvegliato) hanno un cartello 500 m prima.' },
  { id: 'officina', quando: (c) => c.km >= 2 && c.soldi >= 500,
    testo: 'Da Luca Tuning puoi montare pezzi: i livelli 1 e 2 sono già tuoi, la «i» spiega cosa fa ogni componente.' },
  { id: 'joystick', quando: (c) => c.padStrano && c.fermo, apri: 'joystick',
    testo: 'Ho visto un joystick o un volante non standard: ti apro la finestra per assegnare i comandi (si rifà in Impostazioni → Comandi).' },
];

// c: { motore, fermo, auto, leva, km, kmh, benzina (0-1), soldi, tStrada, tMotore, padStrano }; visti: { id: true }
function sgScegli(c, visti) {
  for (const s of SG_LISTA) if (!visti[s.id] && s.quando(c)) return s;
  return null;
}

const NightSugg = (() => {
  const KEY = 'nr_sugg';
  let visti = {}, gap = SG_PAUSA - 20, acc = 0, tStrada = 0, tMotore = 0;       // il primo può arrivare dopo ~20 s
  try { visti = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { visti = {}; }
  const salva = () => { try { localStorage.setItem(KEY, JSON.stringify(visti)); } catch (e) { /* ignora */ } };
  // x: { dt, attivo (false = menu, telefono, locale, domanda), spento (impostazione), say(testo), apri(nome), ctx }
  function tick(x) {
    tStrada += x.dt; tMotore = x.ctx.motore ? tMotore + x.dt : 0; gap += x.dt; acc += x.dt;
    if (acc < 0.5) return null; acc = 0;
    if (x.spento || !x.attivo || gap < SG_PAUSA) return null;
    const s = sgScegli(Object.assign({ tStrada, tMotore }, x.ctx), visti);
    if (!s) return null;
    visti[s.id] = true; salva(); gap = 0;
    x.say(s.testo); if (s.apri && x.apri) x.apri(s.apri);
    return s.id;
  }
  return { tick, reset: () => { visti = {}; gap = SG_PAUSA - 20; salva(); }, get visti() { return visti; } };
})();
if (typeof window !== 'undefined') window.NightSugg = NightSugg;
