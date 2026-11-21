// Assorbe il file scaricato da strumenti/editor_storia.html dentro chat_modifiche.js.
// Uso: node strumenti/assorbi_modifiche.mjs modifiche_storia.json [--prova]
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const radice = new URL('../', import.meta.url);
const [, , file, ...opz] = process.argv;
if (!file) { console.error('Uso: node strumenti/assorbi_modifiche.mjs modifiche_storia.json [--prova]'); process.exit(1); }
const entra = JSON.parse(readFileSync(file, 'utf8'));
const nuove = entra.mod || entra;
const dati = readFileSync(new URL('chat_dati.js', radice), 'utf8').replace(/\bconst /g, 'var ');
const ctx = {}; vm.createContext(ctx); vm.runInContext(dati, ctx);
const by = Object.fromEntries(ctx.CHAT_LIST.map((n) => [n.id, n]));
const pf = new URL('chat_modifiche.js', radice);
const src = readFileSync(pf, 'utf8');
const m = /\/\*MOD\*\/([\s\S]*?)\/\*FINE\*\//.exec(src);
const mod = JSON.parse(m[1]);
let ok = 0; const scarti = [];
for (const [id, c] of Object.entries(nuove)) {
  const n = by[id]; if (!n) { scarti.push(id + ' (non esiste)'); continue; }
  const d = mod[id] || (mod[id] = {});
  if (c.text != null) d.text = c.text;
  for (const k of ['alt', 'opts']) for (const [i, t] of Object.entries(c[k] || {})) {
    const lista = n[k]; if (!lista || !lista[i]) { scarti.push(`${id}.${k}[${i}] (non esiste)`); continue; }
    (d[k] || (d[k] = {}))[i] = t;
  }
  ok++;
}
console.log(`Nodi assorbiti: ${ok}. Scartati: ${scarti.length}${scarti.length ? ' → ' + scarti.join(', ') : ''}. Totale in chat_modifiche.js: ${Object.keys(mod).length} nodi.`);
if (!opz.includes('--prova')) {
  const fuori = src.replace(m[0], '/*MOD*/' + JSON.stringify(mod, null, 1) + '/*FINE*/');
  writeFileSync(pf, fuori);
  console.log('chat_modifiche.js aggiornato.');
}
