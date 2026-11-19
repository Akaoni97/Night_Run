// ============================================================================
//  Night Run · Il gioco salvato nel browser (service worker, registrato da index.html)
//  Serve a due cose: la seconda volta il gioco parte senza riscaricare immagini, suoni, modelli e three.js, e si può
//  giocare anche senza rete. Il codice invece arriva sempre fresco:
//  - pagina, script, stili e manifest (.html .js .css .json): prima la rete, la copia salvata solo se la rete non c'è
//    (così un caricamento su main si vede subito, senza svuotare niente);
//  - suoni, modelli e three.js dal CDN (grossi e quasi mai cambiati): dalla copia salvata, senza riscaricarli;
//  - immagini: subito dalla copia salvata, e intanto si aggiornano in sottofondo (un disegno cambiato si vede dalla
//    volta dopo).
//  Per buttare via tutto basta cambiare VERSIONE.
// ============================================================================
const VERSIONE = 'nr-1';
const CODICE = /\.(html|js|mjs|css|json)$/i;
const CDN = 'https://cdn.jsdelivr.net/npm/three@';
const FISSI = /\.(mp3|ogg|wav|glb|gltf)$/i;   // grossi: una volta scaricati restano (si rinnovano cambiando VERSIONE)

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSIONE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const salva = (req, res) => { if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) { const c = res.clone(); caches.open(VERSIONE).then((ca) => ca.put(req, c)).catch(() => {}); } return res; };

self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), mio = url.origin === self.location.origin;
  if (!mio && !req.url.startsWith(CDN)) return;                 // tutto il resto (font, altri siti): come sempre
  if (req.headers.get('range')) return;                         // pezzi di audio chiesti dal lettore: li gestisce il browser
  const pagina = req.mode === 'navigate' || (mio && (CODICE.test(url.pathname) || url.pathname.endsWith('/')));
  if (pagina) {
    // prima la rete (con la cache HTTP del browser: i file uguali tornano in un attimo), la copia se si è senza rete
    e.respondWith(fetch(req).then((r) => salva(req, r)).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))));
    return;
  }
  if (req.url.startsWith(CDN) || FISSI.test(url.pathname)) {   // la copia se c'è, altrimenti la rete (e si salva)
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => salva(req, r))));
    return;
  }
  // immagini: la copia subito, e un aggiornamento in sottofondo
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((r) => salva(req, r)).catch(() => hit);
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  }));
});
