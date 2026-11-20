'use strict';
const { ipcRenderer } = require('electron');

// Il preload isolato prepara lo storage prima degli script HTML. Nessuna API Node viene esposta al gioco.
if (window.top === window && location.origin === 'app://night-run') {
  let pronto = false;
  window.addEventListener('keydown', (e) => {
    const el = e.target;
    if (e.key === 'Backspace' && !el?.isContentEditable && !['INPUT', 'TEXTAREA'].includes(el?.tagName)) e.preventDefault();
  }, true);
  function fotografia() {
    const dati = Object.create(null);
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      dati[k] = localStorage.getItem(k);
    }
    return dati;
  }
  function salva() {
    if (!pronto) return;
    try {
      const esito = ipcRenderer.sendSync('nr:salva', fotografia());
      if (!esito.ok) console.error('Salvataggio su file non riuscito:', esito.errore);
    } catch (e) {
      console.error('Salvataggio su file non riuscito:', e.message);
    }
  }
  try {
    const iniziale = ipcRenderer.sendSync('nr:carica');
    if (!iniziale.ok) throw new Error(iniziale.errore);
    if (!iniziale.migra) {
      localStorage.clear();
      for (const [k, v] of Object.entries(iniziale.dati)) localStorage.setItem(k, v);
    }
    pronto = true;
    salva(); // Prima migrazione: il file viene creato subito, anche se vuoto.
    setInterval(salva, 2000);
    window.addEventListener('beforeunload', salva);
    // Registrato dopo gli script del gioco: il suo pagehide salva prima l'ultimo stato della partita.
    window.addEventListener('DOMContentLoaded', () => window.addEventListener('pagehide', salva), { once: true });
  } catch (e) {
    // Il processo principale segnala l'errore; non si sostituisce un file inaccessibile con una partita vuota.
    console.error('Ripristino dei salvataggi non riuscito:', e.message);
  }
}
