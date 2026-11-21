'use strict';
// La copia di distribuzione si genera: nel repository resta un solo gioco.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(__dirname, 'app');

function copiaGioco() {
  if (DEST !== path.join(ROOT, 'desktop', 'app')) throw new Error('Destinazione non valida');
  fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });
  // Solo risorse eseguibili del gioco: niente storia sorgente, strumenti o dipendenze desktop.
  for (const ent of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (ent.isFile() && /\.(html|js|css|json)$/i.test(ent.name)) {
      fs.copyFileSync(path.join(ROOT, ent.name), path.join(DEST, ent.name));
    }
  }
  for (const dir of ['audio', 'img', 'vendor']) {                 // pistone/ è stato cancellato nella v0.74: cercarlo fermava la build
    if (!fs.existsSync(path.join(ROOT, dir))) continue;            // una cartella che non c'è più non ferma la build di Windows
    fs.cpSync(path.join(ROOT, dir), path.join(DEST, dir), {
      recursive: true,
      filter: (src) => fs.statSync(src).isDirectory() || !/\.md$/i.test(src)
    });
  }
  console.log('Gioco copiato in desktop/app');
}
if (require.main === module) copiaGioco();
module.exports = { copiaGioco };
