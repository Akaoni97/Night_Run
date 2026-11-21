'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Il formato è lo stesso di localStorage: oggetto con valori stringa, comprese le chiavi sconosciute.
function valida(dati) {
  if (!dati || Array.isArray(dati) || typeof dati !== 'object') throw new Error('Salvataggio non valido');
  if (Object.values(dati).some((v) => typeof v !== 'string')) throw new Error('Valori del salvataggio non validi');
  const testo = JSON.stringify(dati);
  if (Buffer.byteLength(testo) > 16 * 1024 * 1024) throw new Error('Salvataggio troppo grande');
  return testo;
}

class Salvataggi {
  constructor(cartella) {
    this.cartella = cartella;
    this.file = path.join(cartella, 'localStorage.json');
    this.backup = this.file + '.bak';
    this.ultimo = null;
  }

  leggi(file) {
    try {
      const dati = JSON.parse(fs.readFileSync(file, 'utf8'));
      valida(dati);
      return { stato: 'valido', dati };
    } catch (e) {
      if (e.code === 'ENOENT') return { stato: 'assente' };
      // Un disco inaccessibile non è un JSON corrotto: non si sovrascrivono dati che non si riesce a leggere.
      if (e.code) throw e;
      return { stato: 'corrotto' };
    }
  }

  carica() {
    const primo = this.leggi(this.file);
    if (primo.stato === 'assente') return { migra: true, fonte: 'memoria locale' };
    const copia = primo.stato === 'valido' ? primo : this.leggi(this.backup);
    const dati = copia.stato === 'valido' ? copia.dati : {};
    this.scrivi(dati);
    return { migra: false, dati, fonte: primo.stato === 'valido' ? 'JSON' : copia.stato === 'valido' ? 'backup' : 'nuovo' };
  }

  atomico(file, testo) {
    const temporaneo = file + '.tmp';
    const fd = fs.openSync(temporaneo, 'w');
    try {
      fs.writeFileSync(fd, testo, 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(temporaneo, file);
  }

  // Copia a parte dello stato corrente, per il passaggio a una versione nuova. Non è il backup (che si riscrive
  // a ogni salvataggio): ne restano gli ultimi tre, mai ripristinati da soli.
  checkpoint(etichetta) {
    const lettura = this.leggi(this.file);
    if (lettura.stato !== 'valido') throw new Error('Salvataggio corrente non leggibile, checkpoint non creato');
    const nome = 'checkpoint-' + String(etichetta || 'senza-versione').replace(/[^0-9A-Za-z.-]/g, '_') + '.json';
    const destinazione = path.join(this.cartella, nome);
    this.atomico(destinazione, JSON.stringify(lettura.dati));
    const vecchi = fs.readdirSync(this.cartella).filter((f) => /^checkpoint-.*\.json$/.test(f))
      .map((f) => ({ f, t: fs.statSync(path.join(this.cartella, f)).mtimeMs })).sort((a, b) => b.t - a.t).slice(3);
    for (const v of vecchi) fs.rmSync(path.join(this.cartella, v.f), { force: true });
    return destinazione;
  }

  scrivi(dati) {
    const testo = valida(dati);
    if (testo === this.ultimo && fs.existsSync(this.file) && fs.existsSync(this.backup)) return;
    fs.mkdirSync(this.cartella, { recursive: true });
    // Il backup rispecchia lo stato corrente, anche dopo RIAVVIA: niente partite cancellate che risorgono.
    this.atomico(this.backup, testo);
    this.atomico(this.file, testo);
    this.ultimo = testo;
  }
}

module.exports = { Salvataggi, valida };
