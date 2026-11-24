// Prova di fumo di Night Run nel browser (la usa anche GitHub a ogni caricamento, .github/workflows/test.yml):
// fa giocare `strumenti/prova.js` a copione (una tappa per tipo: si arriva, si entra, si esce; poi qualche punto della strada e
// il telefono) e fallisce se la console del browser segna un errore, se una tappa non si apre o se un fotogramma manda
// troppi comandi di disegno alla scheda video (passo `comandi`, v0.138).
// Uso: node strumenti/fumo.js [--out cartella]
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');
const oi = process.argv.indexOf('--out');
const extra = oi >= 0 ? ['--out', process.argv[oi + 1]] : [];
const tappe = ['bar', 'fuel', 'grill', 'niko', 'shop', 'style', 'motel', 'dealer', 'junk'];
const piazzette = [['piazza', 0], ['piazza', 1]];                     // piazzetta (piazzetta.js): entra nel primo e nel secondo negozio
const passi = ['soldi:50000'];
for (const t of tappe) passi.push(`tappa:${t}`, 'aspetta:800', 'entra', 'aspetta:2500', 'verifica:dentro', 'esci', 'aspetta:3000');
for (const [t, i] of piazzette) passi.push(`tappa:${t}`, 'aspetta:800', `entra:${i}`, 'aspetta:2500', 'verifica:dentro', 'esci', 'aspetta:3000');
// i 60 fps: nel paesaggio più pesante (San Gimignano, densità doppia, notte, pioggia) un fotogramma non deve mandare più di
// 2.600 comandi di disegno alla scheda video (oggi ~1.900; prima delle ottimizzazioni anche 6.700). Vedi `comandi` in prova.js.
passi.push('km:69', "js:(()=>{const s=(i,v)=>{const e=document.getElementById(i);e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}))};s('clockSel','notte');s('meteoSel','pioggia');NR_PREST.densita='doppia';NR_PREST.preset='custom';return 1})()",
  'aspetta:1200', 'js:nightRun.engineTap()', 'aspetta:1500', "js:nightRun.leva('D')", 'tieni:KeyW:2000', 'comandi:2600',
  "js:(()=>{NR_PREST.densita='auto';NR_PREST.preset='auto';nightRun.leva('P');return 1})()");
passi.push('km:5', 'aspetta:600', 'km:40', 'aspetta:600', 'km:120', 'aspetta:600', 'tel', 'aspetta:600', 'tel', 'foto:fine', 'stato');
const r = spawnSync('node', [path.join(__dirname, 'prova.js'), ...extra, ...passi], { stdio: 'inherit' });
process.exit(r.status === null ? 1 : r.status);
