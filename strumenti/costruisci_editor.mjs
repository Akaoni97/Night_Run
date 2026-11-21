// Fa una copia dell'editor in un file solo (dati dentro), da pubblicare come artifact o da mandare per mail.
// Uso: node strumenti/costruisci_editor.mjs <file_uscita.html> [--artifact]
import { readFileSync, writeFileSync } from 'node:fs';
const r = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const [, , out, ...o] = process.argv; if (!out) { console.error('Uso: node strumenti/costruisci_editor.mjs uscita.html [--artifact]'); process.exit(1); }
let h = r('strumenti/editor_storia.html');
const inline = (f) => `<script>\n${r(f).replace(/<\/script/gi, '<\\/script')}\n</script>`;
h = h.replace('<script src="../chat_dati.js"></script>', () => inline('chat_dati.js')).replace('<script src="../chat_modifiche.js"></script>', () => inline('chat_modifiche.js'));
if (o.includes('--artifact')) { // nell'artifact i download sono bloccati e non c'è <head>
  h = h.replace(/<button id="bScarica">.*?<\/button>\s*/, '').replace(/\$\('#bScarica'\).onclick = scarica;/, '')
    .replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset[^>]*>\s*<meta name="viewport"[^>]*>\s*/i, '')
    .replace(/<\/head>\s*<body>/i, '').replace(/<\/body>\s*<\/html>\s*$/i, '');
}
writeFileSync(out, h); console.log('Scritto', out, Math.round(h.length / 1024) + ' KB');
