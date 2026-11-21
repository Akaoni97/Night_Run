'use strict';
// Aggiornamenti di Night Run per Windows. Questo modulo NON importa electron né electron-updater:
// riceve l'updater già pronto da main.js, così la logica si prova con Node semplice (test/aggiorna.test.js).
// Controllo, download e installazione partono solo da un clic del giocatore: niente controlli periodici.

const PAGINA_RELEASE = 'https://github.com/Akaoni97/Night_Run/releases/latest';

function parteNumerica(v) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(String(v || '').trim());
  return m ? { n: [Number(m[1]), Number(m[2]), Number(m[3])], pre: m[4] || '' } : null;
}
// SemVer vero, mai confronto tra stringhe: 0.2.10 > 0.2.9. Restituisce -1, 0, 1 o null se una versione non è valida.
function confrontaVersioni(a, b) {
  const x = parteNumerica(a), y = parteNumerica(b);
  if (!x || !y) return null;
  for (let i = 0; i < 3; i++) if (x.n[i] !== y.n[i]) return x.n[i] > y.n[i] ? 1 : -1;
  if (x.pre === y.pre) return 0;
  if (!x.pre) return 1;
  if (!y.pre) return -1;
  return x.pre > y.pre ? 1 : -1;
}

// Le note arrivano da GitHub: testo o HTML. Si tiene solo testo semplice e corto.
function pulisciNote(note) {
  let t = '';
  if (typeof note === 'string') t = note;
  else if (Array.isArray(note)) t = note.map((n) => (n && n.note) || '').join('\n');
  t = t.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return t.length > 600 ? t.slice(0, 597) + '...' : t;
}

// Dall'errore dell'updater a uno stato che il giocatore capisce.
function classificaErrore(err) {
  const codice = String((err && err.code) || '');
  const testo = String((err && err.message) || err || '');
  if (codice === 'ERR_UPDATER_NO_PUBLISHED_VERSIONS' || /No published versions/i.test(testo)) return 'nessuna';
  // Release creata ma senza latest.yml (non ancora completa): per il giocatore è come se non ci fosse.
  if (codice === 'ERR_UPDATER_CHANNEL_FILE_NOT_FOUND') return 'nessuna';
  if (/ERR_INTERNET_DISCONNECTED|ERR_NETWORK_CHANGED|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|ERR_PROXY|ERR_TIMED_OUT|ENOTFOUND|ECONNREFUSED|ECONNRESET|EAI_AGAIN|ETIMEDOUT|getaddrinfo/i.test(codice + ' ' + testo)) return 'offline';
  if (/HttpError: 404|status 404|Cannot find channel|latest\.yml/i.test(testo)) return 'nessuna';
  return 'fallito';
}

const MESSAGGI = {
  inattivo: '',
  controllo: 'Controllo in corso...',
  aggiornato: 'Sei aggiornato.',
  nessuna: 'Nessuna versione pubblicata.',
  offline: 'Connessione non disponibile. Puoi giocare lo stesso.',
  fallito: 'Download non riuscito. La versione che hai resta quella di prima.',
  disponibile: 'C\'è una versione nuova.',
  scarico: 'Scarico la versione nuova...',
  pronto: 'Aggiornamento pronto.',
  'non-supportato': ''
};

class Aggiornatore {
  // updater: l'oggetto di electron-updater. info: { versione, commit, data }. avvio: { impacchettato, portatile }.
  // pagina: salva(dati) deve scrivere su file e lanciare se non riesce; checkpoint(versione) conserva una copia a parte.
  constructor({ updater, info, avvio, salvaPrima, checkpoint, installa, notifica }) {
    this.up = updater;
    this.info = info || {};
    this.avvio = avvio || {};
    this.salvaPrima = salvaPrima;
    this.checkpoint = checkpoint;
    this.installaFn = installa;
    this.notifica = notifica || (() => {});
    this.corrente = String(this.info.versione || '');
    this.s = { fase: 'inattivo', versione: this.corrente, commit: this.info.commit || null, nuova: null, percentuale: 0, messaggio: '', motivo: '' };
    this.promessa = null;
    this.installazione = false;
    if (!this.avvio.impacchettato) this.imposta({ fase: 'non-supportato', motivo: 'sviluppo', messaggio: 'Gli aggiornamenti funzionano solo nel programma installato.' });
    else if (this.avvio.portatile) this.imposta({ fase: 'inattivo', motivo: 'portatile' });
    if (this.up) this.collega();
  }

  imposta(parti) {
    this.s = { ...this.s, ...parti };
    if (parti.fase && parti.messaggio === undefined) this.s.messaggio = MESSAGGI[parti.fase] || '';
    this.notifica(this.stato());
  }
  stato() { return { ...this.s, nuova: this.s.nuova ? { ...this.s.nuova } : null, portatile: !!this.avvio.portatile, pagina: PAGINA_RELEASE }; }

  collega() {
    const u = this.up;
    u.autoDownload = false;          // niente download senza clic
    u.autoInstallOnAppQuit = false;  // niente installazioni alla chiusura normale
    u.allowPrerelease = false;
    u.allowDowngrade = false;        // mai tornare a una versione più vecchia
    u.autoRunAppAfterInstall = true;
    u.logger = null;
    u.on('download-progress', (p) => {
      if (this.s.fase === 'scarico') this.imposta({ percentuale: Math.max(0, Math.min(100, Math.round((p && p.percent) || 0))) });
    });
  }

  // Un solo controllo alla volta: clic ripetuti restituiscono lo stesso lavoro.
  controlla() {
    if (this.s.fase === 'non-supportato') return Promise.resolve(this.stato());
    if (this.promessa) return this.promessa;
    if (this.s.fase === 'scarico' || this.s.fase === 'pronto') return Promise.resolve(this.stato());
    this.imposta({ fase: 'controllo', nuova: null, percentuale: 0 });
    this.promessa = (async () => {
      try {
        const r = await this.up.checkForUpdates();
        const info = r && r.updateInfo;
        const cmp = info ? confrontaVersioni(info.version, this.corrente) : null;
        if (!info || cmp === null) throw Object.assign(new Error('Versione non riconosciuta'), { code: 'ERR_VERSIONE' });
        if (cmp > 0) {
          this.imposta({ fase: 'disponibile', nuova: { versione: info.version, data: info.releaseDate || null, note: pulisciNote(info.releaseNotes) } });
        } else {
          this.imposta({ fase: 'aggiornato' });
        }
      } catch (e) {
        const tipo = classificaErrore(e);
        this.imposta({ fase: tipo, messaggio: MESSAGGI[tipo] });
      } finally {
        this.promessa = null;
      }
      return this.stato();
    })();
    return this.promessa;
  }

  async scarica() {
    if (this.avvio.portatile) return this.stato();   // il portatile non si aggiorna da solo: vedi `pagina`
    if (this.s.fase !== 'disponibile') return this.stato();
    this.imposta({ fase: 'scarico', percentuale: 0 });
    try {
      await this.up.downloadUpdate();
      this.imposta({ fase: 'pronto', percentuale: 100 });
    } catch (e) {
      // Il file incompleto o non coerente viene rifiutato da electron-updater: la versione in uso resta intatta.
      this.imposta({ fase: classificaErrore(e) === 'offline' ? 'offline' : 'fallito', percentuale: 0, nuova: this.s.nuova });
    }
    return this.stato();
  }

  // dati: la fotografia dello stato del gioco, presa dal preload subito prima. Se la scrittura su file
  // non riesce, l'installazione NON parte.
  async installa(dati) {
    if (this.avvio.portatile) return { ok: false, errore: 'Il portatile non si installa da qui.' };
    if (this.s.fase !== 'pronto') return { ok: false, errore: 'Nessun aggiornamento pronto.' };
    if (this.installazione) return { ok: false, errore: 'Installazione già in corso.' };
    this.installazione = true;
    try {
      this.salvaPrima(dati);                              // scrittura vera su file (fsync), lancia se fallisce
      this.checkpoint(this.s.nuova && this.s.nuova.versione);
    } catch (e) {
      this.installazione = false;
      return { ok: false, errore: 'Salvataggio non riuscito, non installo: ' + e.message };
    }
    // Un attimo perché la risposta arrivi al gioco, poi chiude, installa e riapre.
    setTimeout(() => this.installaFn(), 150);
    return { ok: true };
  }
}

module.exports = { Aggiornatore, confrontaVersioni, classificaErrore, pulisciNote, PAGINA_RELEASE };
