// ============================================================================
//  Il prossimo traguardo (dopo game.js e tuning.js): una riga sempre visibile nel quadro con la cosa più vicina
//  da raggiungere: il pezzo dell'officina che si sblocca coi chilometri, oppure il prossimo vantaggio dei km.
//  Parte pura e provata in test/obiettivo.test.js; il disegno è in index.html (#hudNext).
// ============================================================================
const OB_FMT = (km) => (Math.round(km * 10) / 10).toString().replace('.', ',');

// il pezzo bloccato più vicino per l'auto in uso (solo quelli che si comprano: prezzo > 0, livello dal 3 in su)
function obProssimoPezzo(game) {
  if (!game || game.mode !== 'career' || typeof TUNING === 'undefined') return null;
  const odo = game.odo; let best = null;
  for (const cat of Object.keys(TUNING)) {
    const c = TUNING[cat]; if (!c || !c.items) continue;
    c.items.forEach((it) => {
      if (!it.price || game.owns(cat, it.id)) return;
      const need = game.partKm(cat, it.id); if (need <= odo) return;
      const left = need - odo;
      if (!best || left < best.left) best = { kind: 'pezzo', title: 'Si sblocca', text: `${it.name || it.id} · ${c.label}`, left, km: need };
    });
  }
  return best;
}

// il prossimo vantaggio dei chilometri (Rodaggio, Mano sul cambio...)
function obProssimoVantaggio(game) {
  if (!game || typeof GAME_KM_PERKS === 'undefined') return null;
  const p = game.nextPerk(); if (!p) return null;
  const km = game.odo;
  return { kind: 'vantaggio', title: 'Prossimo vantaggio', text: `${p.name} · ${p.note}`, left: Math.max(0, p.km - km), km: p.km };
}

// il più vicino dei due (a parità vince il pezzo, che il giocatore può montare subito)
function obProssimo(game) {
  const a = obProssimoPezzo(game), b = obProssimoVantaggio(game);
  if (a && b) return b.left < a.left ? b : a;
  return a || b || null;
}
function obTesto(o) { return o ? `tra ${OB_FMT(o.left)} km` : ''; }

if (typeof window !== 'undefined') window.NightObiettivo = { prossimo: obProssimo, testo: obTesto };
