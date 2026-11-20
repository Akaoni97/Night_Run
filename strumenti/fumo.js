// Prova di fumo di Night Run nel browser (la usa anche GitHub a ogni caricamento, .github/workflows/test.yml):
// fa giocare `strumenti/prova.js` a copione (una tappa per tipo: si arriva, si entra, si esce; poi qualche punto della strada e
// il telefono) e fallisce se la console del browser segna un errore o se una tappa non si apre.
// Uso: node strumenti/fumo.js [--out cartella]
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');
const oi = process.argv.indexOf('--out');
const extra = oi >= 0 ? ['--out', process.argv[oi + 1]] : [];
const tappe = ['bar', 'fuel', 'grill', 'niko', 'shop', 'style', 'motel', 'dealer', 'junk'];
const passi = ['soldi:50000'];
for (const t of tappe) passi.push(`tappa:${t}`, 'aspetta:800', 'entra', 'aspetta:2500', 'verifica:dentro', 'esci', 'aspetta:3000');
passi.push('km:5', 'aspetta:600', 'km:40', 'aspetta:600', 'km:120', 'aspetta:600', 'tel', 'aspetta:600', 'tel', 'foto:fine', 'stato');
const r = spawnSync('node', [path.join(__dirname, 'prova.js'), ...extra, ...passi], { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
