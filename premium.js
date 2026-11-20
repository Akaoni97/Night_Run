// ============================================================================
//  Night Run · Estetica premium: icone, interruttore, banner (nella testa della pagina, subito dopo premium.css)
//  Lo stile è tutto in premium.css, sotto :root:not(.classico). Questo file:
//  - disegna le icone dell'interfaccia (PI) e le mette a disposizione del CSS come variabili --pi-<nome> (maschere:
//    prendono il colore di chi le usa), più lo stemma della barra in alto (--p-emblem). Subito, prima che la pagina si
//    disegni: per questo sta nella testa;
//  - legge la scelta Premium / Classico (localStorage nr_stile = 'classico', html.classico) e mette l'interruttore in
//    Impostazioni → Grafica, nel riquadro Interfaccia;
//  - a pagina pronta: icona del locale nella testata del pannello (data-place su #placeBox), qualità leggera o bassa
//    senza sfocature (html.p-lite), icone lucide delle app del telefono (CSS dentro il telefono, :host(.prem)),
//    banner del quartiere (al posto della scritta disegnata nella strada) e dell'arrivo nelle capitali.
//  Un'icona nuova: una voce in PI, poi var(--pi-<nome>) nel CSS (test/premium.test.js controlla che esista).
//  window.NightPremium: { on, set(true|false), url(nome, colore), banner(tipo, etichetta, nome, sotto, colore) }.
// ============================================================================

// Icone: disegno interno di un <svg> 24×24 a tratto (1,8, punte e angoli tondi). class="pd" = riempimento tenue sotto il
// tratto (secondo tono, al 30 %), class="pf" = riempimento pieno. Niente colori qui: il colore lo decide chi le usa.
const PI = {
  // barra in alto
  menu: '<rect class="pd" x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect class="pd" x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
  phone: '<rect class="pd" x="8.3" y="6.6" width="7.4" height="9.4" rx=".8"/><rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.6 5h2.8M11.2 18.8h1.6"/>',
  keys: '<rect class="pd" x="2.5" y="6" width="19" height="12" rx="2.6"/><rect x="2.5" y="6" width="19" height="12" rx="2.6"/><path d="M6.3 9.8h.01M9.4 9.8h.01M12.5 9.8h.01M15.6 9.8h.01M18 9.8h.01M6.3 12.6h.01M17.8 12.6h.01M8.6 14.6h6.8"/>',
  restart: '<circle class="pd" cx="12" cy="12" r="4"/><path d="M19.5 12A7.5 7.5 0 1 1 15.75 5.5"/><path d="M14.8 2.1l.95 3.4-3.4.9"/>',
  expand: '<rect class="pd" x="8" y="8" width="8" height="8" rx="1.5"/><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  // numeri della partita
  wallet: '<rect class="pd" x="14.5" y="11.4" width="6.5" height="4.8" rx="2.2"/><rect x="3" y="6.5" width="18" height="13" rx="2.6"/><path d="M6 6.5l9.5-3 1.2 3"/><rect x="14.5" y="11.4" width="6.5" height="4.8" rx="2.2"/><path d="M17.3 13.8h.01"/>',
  star: '<path class="pd" d="M12 4l2.12 5.59 5.96.28-4.66 3.74 1.58 5.77L12 16.1l-5 3.28 1.58-5.77-4.66-3.74 5.96-.28z"/><path d="M12 4l2.12 5.59 5.96.28-4.66 3.74 1.58 5.77L12 16.1l-5 3.28 1.58-5.77-4.66-3.74 5.96-.28z"/>',
  siren: '<path class="pd" d="M7 17v-4.5a5 5 0 0 1 10 0V17z"/><path d="M7 17v-4.5a5 5 0 0 1 10 0V17"/><rect x="4.5" y="17" width="15" height="3.5" rx="1.2"/><path d="M12 2.8V5M4.6 5.6l1.6 1.6M19.4 5.6l-1.6 1.6M10 11.4a2 2 0 0 1 2-1.6"/>',
  // riquadro del viaggio e bisogni
  clock: '<circle class="pd" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/>',
  road: '<path class="pd" d="M8 21l2.6-18h2.8L16 21z"/><path d="M8 21l2.6-18M16 21L13.4 3M12 5.5v1.8M12 10.2v2.4M12 15.6v3.2"/>',
  fuel: '<rect class="pd" x="6.5" y="6.5" width="5" height="4" rx=".6"/><path d="M4.5 20.5V5.2c0-.94.76-1.7 1.7-1.7h5.6c.94 0 1.7.76 1.7 1.7v15.3M3 20.5h12"/><rect x="6.5" y="6.5" width="5" height="4" rx=".6"/><path d="M13.5 9.5h2c.83 0 1.5.67 1.5 1.5v5a1.5 1.5 0 0 0 3 0V8.3L17.7 6"/>',
  box: '<path class="pd" d="M12 12l8-4.5v9L12 21z"/><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9M8 5.2l8 4.6"/>',
  flag: '<path class="pd" d="M5.5 4h11l-2 4 2 4h-11z"/><path d="M5.5 21V3.5M5.5 4h11l-2 4 2 4h-11"/>',
  food: '<path class="pd" d="M4.5 10.5C4.5 7 7.9 4.5 12 4.5s7.5 2.5 7.5 6z"/><path d="M4.5 10.5C4.5 7 7.9 4.5 12 4.5s7.5 2.5 7.5 6z"/><path d="M3.5 13.6c1.4 0 1.4 1 2.8 1s1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.5-1"/><path d="M5 17h14v.6a2.4 2.4 0 0 1-2.4 2.4H7.4A2.4 2.4 0 0 1 5 17.6z"/><path d="M9 7.6h.01M12.2 6.6h.01M15 7.8h.01"/>',
  drop: '<path class="pd" d="M12 3.5c3 3.7 6 7 6 10.4a6 6 0 0 1-12 0C6 10.5 9 7.2 12 3.5z"/><path d="M12 3.5c3 3.7 6 7 6 10.4a6 6 0 0 1-12 0C6 10.5 9 7.2 12 3.5z"/><path d="M9.3 14.2a2.8 2.8 0 0 0 2.6 2.8"/>',
  moon: '<path class="pd" d="M19.2 14.6A7.6 7.6 0 1 1 9.4 4.8a6.1 6.1 0 0 0 9.8 9.8z"/><path d="M19.2 14.6A7.6 7.6 0 1 1 9.4 4.8a6.1 6.1 0 0 0 9.8 9.8z"/><path d="M16.5 3.4v2.6M15.2 4.7h2.6"/>',
  bubbles: '<circle class="pd" cx="9.5" cy="14" r="5"/><circle cx="9.5" cy="14" r="5"/><circle cx="16.8" cy="7.8" r="2.9"/><circle cx="18" cy="15.8" r="1.7"/><path d="M7.4 12.3a2.6 2.6 0 0 1 2.2-1.3"/>',
  weight: '<path class="pd" d="M6.2 9.5h11.6l2.2 11H4z"/><path d="M6.2 9.5h11.6l2.2 11H4z"/><path d="M9.2 9.5V7.6a2.8 2.8 0 0 1 5.6 0v1.9M10 15h4"/>',
  people: '<circle class="pd" cx="9" cy="8.2" r="3.2"/><circle cx="9" cy="8.2" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><circle cx="16.6" cy="9.4" r="2.5"/><path d="M15.6 14.2a4.9 4.9 0 0 1 5.4 5.3"/>',
  // pulsanti del cruscotto e comandi dell'auto
  power: '<circle class="pd" cx="12" cy="13.6" r="5"/><path d="M12 3v8.2"/><path d="M6.6 6.6a7.6 7.6 0 1 0 10.8 0"/>',
  wheel: '<circle class="pd" cx="12" cy="12" r="2.4"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.4"/><path d="M3.7 10.6l5.9.7M20.3 10.6l-5.9.7M12 14.4v6"/>',
  traction: '<rect class="pd" x="8" y="3" width="8" height="11.5" rx="2.2"/><rect x="8" y="3" width="8" height="11.5" rx="2.2"/><path d="M8 6.8h8M8 10.6h8"/><path d="M4 19.5c1.3-1.2 2.7-1.2 4 0s2.7 1.2 4 0 2.7-1.2 4 0 2.7 1.2 4 0"/>',
  launch: '<path class="pf" d="M5.5 4h4.2v3H5.5zM13.9 4h4.2v3h-4.2zM9.7 7h4.2v3H9.7zM5.5 10h4.2v3H5.5zM13.9 10h4.2v3h-4.2z"/><path d="M5.5 21V3.5"/><rect x="5.5" y="4" width="12.6" height="9" rx=".6"/>',
  gauge: '<path class="pd" d="M4 17a8 8 0 1 1 16 0z"/><path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4.2-5.4"/><circle cx="12" cy="17" r="1.2"/><path d="M6.4 12.6l1.1.6M12 9v1.3M17.6 12.6l-1.1.6"/>',
  beam: '<path class="pd" d="M10.5 6.5C7 6.5 4.5 9 4.5 12s2.5 5.5 6 5.5H12v-11z"/><path d="M10.5 6.5C7 6.5 4.5 9 4.5 12s2.5 5.5 6 5.5H12v-11z"/><path d="M15 8.2l5.5-1.2M15 12h6M15 15.8l5.5 1.2"/>',
  map: '<path class="pd" d="M9 4.5l6 2v13l-6-2z"/><path d="M3.5 6.5L9 4.5l6 2 5.5-2v13L15 19.5l-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  window: '<path class="pd" d="M6 12v-1.6l3.8-3.9H18V12z"/><path d="M4 19V9.8l5.2-5.3H20V19z"/><path d="M6 12v-1.6l3.8-3.9H18V12z"/><path d="M14.5 14.6v2.6"/>',
  trailer: '<rect class="pd" x="2.5" y="6.5" width="13" height="9" rx="1.2"/><rect x="2.5" y="6.5" width="13" height="9" rx="1.2"/><path d="M15.5 13h4l2 2.2"/><circle cx="8" cy="18" r="2"/>',
  turbo: '<circle class="pd" cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5c-1.2 2.3-1 4.6 0 5.5M20.5 12c-2.3-1.2-4.6-1-5.5 0M12 20.5c1.2-2.3 1-4.6 0-5.5M3.5 12c2.3 1.2 4.6 1 5.5 0"/>',
  exhaust: '<path class="pd" d="M3 12.5h9.5a2.5 2.5 0 0 1 0 5H3z"/><path d="M3 12.5h9.5a2.5 2.5 0 0 1 0 5H3"/><path d="M17.5 12.4c1 .9 1 2.3 0 3.2M20 10.6c2 1.9 2 5 0 6.8M7 9c.7-.9.7-1.9 0-2.8M10.5 9c.7-.9.7-1.9 0-2.8"/>',
  neon: '<path class="pd" d="M5 15l2-5h10l2 5z"/><path d="M3.5 15h17M5 15l2-5h10l2 5"/><path d="M6.5 21l1-2M12 21.5V19M17.5 21l-1-2"/>',
  bolt: '<path class="pd" d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12z"/><path d="M13 2.5L4.5 14H11l-1 7.5L18.5 10H12z"/>',
  // avvisi e domande
  info: '<circle class="pd" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2M12 7.8h.01"/>',
  alert: '<path class="pd" d="M10.3 4.4a2 2 0 0 1 3.4 0l7.2 12.6a2 2 0 0 1-1.7 3H4.8a2 2 0 0 1-1.7-3z"/><path d="M10.3 4.4a2 2 0 0 1 3.4 0l7.2 12.6a2 2 0 0 1-1.7 3H4.8a2 2 0 0 1-1.7-3z"/><path d="M12 9.5v4M12 16.6h.01"/>',
  coin: '<circle class="pd" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M15.3 8.6a4.2 4.2 0 1 0 0 6.8M7.6 11h5.6M7.6 13.2h5.6"/>',
  bag: '<path class="pd" d="M5.5 8.2h13l-1 11.3a1.6 1.6 0 0 1-1.6 1.5H8.1a1.6 1.6 0 0 1-1.6-1.5z"/><path d="M5.5 8.2h13l-1 11.3a1.6 1.6 0 0 1-1.6 1.5H8.1a1.6 1.6 0 0 1-1.6-1.5z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>',
  xcircle: '<circle class="pd" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>',
  chat: '<path class="pd" d="M4 6.6A2.6 2.6 0 0 1 6.6 4h10.8A2.6 2.6 0 0 1 20 6.6v7.3a2.6 2.6 0 0 1-2.6 2.6H10l-4.6 3.6v-3.6A1.6 1.6 0 0 1 4 15z"/><path d="M4 6.6A2.6 2.6 0 0 1 6.6 4h10.8A2.6 2.6 0 0 1 20 6.6v7.3a2.6 2.6 0 0 1-2.6 2.6H10l-4.6 3.6v-3.6A1.6 1.6 0 0 1 4 15z"/><path d="M8.6 10.3h.01M12 10.3h.01M15.4 10.3h.01"/>',
  signpost: '<path class="pd" d="M12 5h6.4l2.1 2.2-2.1 2.2H12z"/><path d="M12 21V3M12 5h6.4l2.1 2.2-2.1 2.2H12M12 11.6H5.6l-2.1 2.2 2.1 2.2H12"/>',
  eye: '<circle class="pd" cx="12" cy="12" r="3"/><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path class="pd" d="M12 21s6.8-6 6.8-11.3a6.8 6.8 0 1 0-13.6 0C5.2 15 12 21 12 21z"/><path d="M12 21s6.8-6 6.8-11.3a6.8 6.8 0 1 0-13.6 0C5.2 15 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.5"/>',
  // entrare, uscire, frecce
  enter: '<path class="pd" d="M13.5 3.5h5c.83 0 1.5.67 1.5 1.5v14c0 .83-.67 1.5-1.5 1.5h-5z"/><path d="M13.5 3.5h5c.83 0 1.5.67 1.5 1.5v14c0 .83-.67 1.5-1.5 1.5h-5M3.5 12h11M11 8.3l3.7 3.7-3.7 3.7"/>',
  exit: '<path class="pd" d="M10.5 3.5h-5C4.67 3.5 4 4.17 4 5v14c0 .83.67 1.5 1.5 1.5h5z"/><path d="M10.5 3.5h-5C4.67 3.5 4 4.17 4 5v14c0 .83.67 1.5 1.5 1.5h5M9 12h11.5M16.8 8.3l3.7 3.7-3.7 3.7"/>',
  chevL: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  chevR: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  // schermata iniziale
  key: '<circle class="pd" cx="8" cy="15.5" r="4"/><circle cx="8" cy="15.5" r="4"/><path d="M10.9 12.6L19.5 4M16.5 7l2.3 2.3M14.2 9.3l1.8 1.8"/>',
  // locali (testata del pannello)
  cup: '<path class="pd" d="M5 9.5h11V14a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M5 9.5h11V14a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11h1.4a2.4 2.4 0 0 1 0 4.8h-1.8M8.5 3.5c-.9 1 .9 2 0 3.2M12.3 3.5c-.9 1 .9 2 0 3.2M4 21.5h13"/>',
  utensils: '<path class="pd" d="M17.5 3c-2.2 1.6-3 4.5-3 8.2h3z"/><path d="M6.5 3v5.5a2.5 2.5 0 0 0 5 0V3M9 3v18M17.5 21V3c-2.2 1.6-3 4.5-3 8.2h3"/>',
  bed: '<path class="pd" d="M11 10.5h7a3 3 0 0 1 3 3V15H11z"/><path d="M3 5.5V19M3 15h18v4M21 15v-1.5a3 3 0 0 0-3-3h-7V15"/><circle cx="7" cy="12.2" r="1.8"/>',
  wrench: '<path class="pd" d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/><path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  spray: '<rect class="pd" x="6.5" y="9" width="8" height="12" rx="1.6"/><rect x="6.5" y="9" width="8" height="12" rx="1.6"/><path d="M8.8 9V6.4h3.4V9M10.5 6.4V4.6M15.8 5.2h.01M18.2 3.8h.01M18.4 6.6h.01M20.6 5.2h.01M17 8.6h.01"/>',
  car: '<path class="pd" d="M8.4 8.8h6l2.4 2.4H6.2z"/><path d="M5.3 16.5H3.5v-3.4l2.2-1.9 2.4-3h6.6l3 3 2.4.7c.6.2 1 .8 1 1.4v3.2h-1.8M9.6 16.5h4.8"/><circle cx="7.4" cy="16.5" r="2.1"/><circle cx="16.6" cy="16.5" r="2.1"/>',
  magnet: '<path class="pd" d="M6 4h4v8a2 2 0 0 0 4 0V4h4v8a6 6 0 0 1-12 0z"/><path d="M6 4h4v8a2 2 0 0 0 4 0V4h4v8a6 6 0 0 1-12 0zM6 8h4M14 8h4"/>',
  piston: '<rect class="pd" x="7" y="3" width="10" height="7" rx="1.2"/><rect x="7" y="3" width="10" height="7" rx="1.2"/><path d="M7 5.6h10M10.6 10l.6 6M13.4 10l-.6 6"/><circle cx="12" cy="18.6" r="2.6"/>',
};

// lo stemma della barra in alto: la strada che va verso l'orizzonte, la luna, due stelle (32×32, a colori)
const PREM_EMBLEM = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs>'
  + '<linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4d2"/><stop offset=".5" stop-color="#efc46a"/><stop offset="1" stop-color="#a26b22"/></linearGradient>'
  + '<linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2442"/><stop offset="1" stop-color="#0b0a13"/></linearGradient></defs>'
  + '<rect x="1" y="1" width="30" height="30" rx="9" fill="url(#n)" stroke="url(#o)" stroke-width="1.3"/>'
  + '<path d="M5.5 12h21" stroke="url(#o)" stroke-width=".8" opacity=".5"/>'
  + '<path d="M7.5 30.3L14.7 12h2.6l7.2 18.3z" fill="url(#o)"/>'
  + '<path d="M16 15v2.2M16 19.6v2.8M16 24.8v3.6" stroke="#14101f" stroke-width="1.2" stroke-linecap="round"/>'
  + '<circle cx="22.4" cy="7.6" r="3.2" fill="url(#o)"/><circle cx="23.9" cy="6.6" r="2.8" fill="#29223f"/>'
  + '<circle cx="8.2" cy="6.2" r=".7" fill="#efc46a" opacity=".8"/><circle cx="12.4" cy="4.4" r=".5" fill="#efc46a" opacity=".6"/></svg>';

// un'icona come documento svg di un colore solo (per le maschere va bene il nero: conta solo quanto è pieno)
const piDoc = (name, col = '#000') => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + col
  + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
  + PI[name].replace(/class="pd"/g, 'fill="' + col + '" fill-opacity=".3" stroke="none"').replace(/class="pf"/g, 'fill="' + col + '" stroke="none"') + '</svg>';
const piUrl = (name, col) => 'url("data:image/svg+xml,' + encodeURIComponent(piDoc(name, col)) + '")';
// tutte le icone come variabili CSS, più lo stemma
const piCss = () => ':root{' + Object.keys(PI).map((k) => '--pi-' + k + ':' + piUrl(k) + ';').join('')
  + '--p-emblem:url("data:image/svg+xml,' + encodeURIComponent(PREM_EMBLEM) + '");}';
const premEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// le icone delle app del telefono: un gradiente lucido per app (dentro il telefono, che vive in un'ombra)
const PREM_APP = {
  tel: ['#6ff2a0', '#14a84f', '#0b7d3b'], msg: ['#79b8ff', '#2368ea', '#1747b8'], con: ['#c4c7d2', '#6b6e7d', '#474a57'],
  map: ['#9a97ff', '#4d42e3', '#3527b8'], pho: ['#f39bff', '#a43ad0', '#7a1fa6'], clk: ['#565967', '#24252c', '#15161a'],
  job: ['#ffcf6e', '#f2751a', '#c4520b'], pax: ['#5ee6ad', '#0f9461', '#0a6b46'], motel: ['#ff9a9a', '#d23246', '#9e1b30'],
  trg: ['#ffe9a8', '#e0a124', '#a86d0c'], usa: ['#ffe68a', '#e9a015', '#b5740a'], gar: ['#7fdcff', '#1279c4', '#0a5590'],
  lib: ['#cdf67a', '#5c9a18', '#3d6e0c'], vgl: ['#ffdb78', '#cf7a12', '#9c5508'],
};
const premPhoneCss = () => ':host(.prem) .ph{background:linear-gradient(150deg,#5d616d 0%,#1d1e24 34%,#33353e 66%,#15161b 100%);box-shadow:0 0 0 1px #000,inset 0 0 0 1.5px #7b7f8b,inset 0 0 0 3px #17181d,0 30px 70px rgba(0,0,0,.7)}'
  + ':host(.prem) .ic{position:relative;overflow:hidden;border-radius:15px;box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -4px 10px rgba(0,0,0,.2),inset 0 0 0 1px rgba(255,255,255,.1),0 6px 14px rgba(0,0,0,.45)}'
  + ':host(.prem) .ic::before{content:"";position:absolute;left:0;right:0;top:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(255,255,255,.03));pointer-events:none}'
  + ':host(.prem) .ic svg{position:relative;width:26px;height:26px;stroke-width:2.1;filter:drop-shadow(0 1.5px 1.2px rgba(0,0,0,.35))}'
  + ':host(.prem) .ap{font-weight:500;text-shadow:0 1px 2px rgba(0,0,0,.7)}'
  + ':host(.prem) .bd{background:linear-gradient(180deg,#ff6d62,#de2f29);box-shadow:0 0 0 2px #0c0d12,0 2px 6px rgba(0,0,0,.45)}'
  + ':host(.prem) .widget{border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.13),rgba(255,255,255,.06));box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),inset 0 1px 0 rgba(255,255,255,.12)}'
  + Object.keys(PREM_APP).map((k) => { const c = PREM_APP[k]; return `:host(.prem) .ap[data-open="${k}"] .ic{background:linear-gradient(160deg,${c[0]},${c[1]} 58%,${c[2]})!important}`; }).join('');

(function premium() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const root = document.documentElement;
  // le variabili delle icone, subito: il CSS le trova già al primo disegno della pagina
  { const st = document.createElement('style'); st.id = 'premiumIcone'; st.textContent = piCss(); (document.head || root).appendChild(st); }
  // Premium (di serie) o Classico: si ricorda in questo browser
  let classico = false;
  try { classico = localStorage.getItem('nr_stile') === 'classico'; } catch (e) { /* niente memoria: premium */ }
  root.classList.toggle('classico', classico);
  const on = () => !root.classList.contains('classico');

  function sync() {
    const p = on();
    document.querySelectorAll('.p-stile button[data-v]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.v === 'premium') === p)));
    const host = document.getElementById('telefonoHost'); if (host) host.classList.toggle('prem', p);
    if (!p) document.querySelectorAll('.p-loc').forEach((el) => el.remove());
  }
  function set(p) {
    root.classList.toggle('classico', !p);
    try { if (p) localStorage.removeItem('nr_stile'); else localStorage.setItem('nr_stile', 'classico'); } catch (e) { /* niente memoria */ }
    sync(); window.dispatchEvent(new Event('resize'));      // misure nuove per chi si mette a posto da solo (telefono, leggibile.js)
  }

  // ---------------------------------------------------------------- banner del quartiere e della capitale
  // Al posto della scritta disegnata nella strada: un titolo grande sopra la strada che compare e sfuma. Se la schermata
  // iniziale o il prologo coprono la strada, aspetta che se ne vadano (al massimo 20 s).
  const coperto = () => { const g = document.getElementById('gate'); return (g && !g.hidden) || !!(window.NightPrologo && window.NightPrologo.playing); };
  function banner(kind, label, name, sub, col, tries = 0) {
    if (!on()) return;
    if (coperto()) { if (tries < 40) setTimeout(() => banner(kind, label, name, sub, col, tries + 1), 500); return; }
    const hud = document.querySelector('#roadStage .hud'); if (!hud) return;
    hud.querySelectorAll('.p-loc').forEach((el) => el.remove());
    const el = document.createElement('div'); el.className = 'p-loc p-' + kind; el.setAttribute('role', 'status');
    if (col) el.style.setProperty('--c', col);
    el.innerHTML = `<span class="k">${premEsc(label)}</span><b>${premEsc(name)}</b>${sub ? `<span class="s">${premEsc(sub)}</span>` : ''}<i aria-hidden="true"></i>`;
    hud.appendChild(el);
    setTimeout(() => el.remove(), kind === 'cap' ? 6400 : 4800);
  }

  // ---------------------------------------------------------------- a pagina pronta (dopo tutti gli script)
  function ready() {
    // l'interruttore, nel riquadro Interfaccia (che menu.js mette in Impostazioni → Grafica)
    const sec = document.querySelector('section.uiprefs');
    if (sec && !sec.querySelector('.p-stile')) {
      const f = document.createElement('div'); f.className = 'field p-stile';
      f.innerHTML = '<span>Pannelli, avvisi e icone</span><div class="seg" role="group" aria-label="Stile di pannelli, avvisi e icone">'
        + '<button type="button" data-v="premium">Premium</button><button type="button" data-v="classico">Classico</button></div>'
        + '<p class="hint">Premium: vetro scuro, icone disegnate, avvisi con l\'icona e il tempo che scorre, titoli dei quartieri e delle capitali. Classico: lo stile di prima. Il quadro strumenti si sceglie qui sotto.</p>';
      const h = sec.querySelector('h2'); if (h) h.after(f); else sec.prepend(f);
      f.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) set(b.dataset.v === 'premium'); });
    }
    // telefono: le icone lucide (CSS nell'ombra del telefono, valgono solo con la classe prem sull'ospite)
    if (window.telefono && window.telefono.addCss) window.telefono.addCss(premPhoneCss());
    // qualità leggera o bassa: niente sfocature dietro i vetri (costano sul telefono)
    const q = document.getElementById('q3d');
    if (q) { const lite = () => root.classList.toggle('p-lite', q.value === 'leggera' || q.value === 'bassa'); q.addEventListener('change', lite); lite(); }
    // pannello del locale: quale locale è (l'icona nella testata la sceglie premium.css da data-place)
    const box = document.getElementById('placeBox'), title = document.getElementById('placeTitle');
    if (box && title && window.MutationObserver) {
      const mark = () => { const n = window.nightRun, I = n && n.game && n.game.inside; box.dataset.place = I && I.id ? I.id : ''; };
      const mo = new MutationObserver(mark); mo.observe(box, { attributes: true, attributeFilter: ['hidden'] }); mo.observe(title, { childList: true, characterData: true, subtree: true }); mark();
    }
    // quartieri: il titolo in HTML al posto della scritta nella strada (col Classico resta quella di prima)
    if (typeof Street2D !== 'undefined' && Street2D.prototype.districtBanner && !Street2D.prototype.districtBanner.prem) {
      const SP = Street2D.prototype, orig = SP.districtBanner;
      SP.districtBanner = function (g, dist, dt) {
        if (!on()) return orig.call(this, g, dist, dt);
        const st = this.st, I = this.districtInfo(dist);
        if (st.distId !== I.D.id) { st.distId = I.D.id; st.distT = 0; banner('qua', 'Stai entrando in', I.D.name, '', I.D.neon && I.D.neon[0]); }
        st.distT = (st.distT ?? 9) + dt;
      };
      SP.districtBanner.prem = 1;
    }
    // capitali: quando capitali.js segna l'arrivo (s.vg.capLast cambia e diventa una capitale), il titolo d'oro
    if (typeof StreetGame !== 'undefined' && StreetGame.prototype.vgUpdate && !StreetGame.prototype.vgUpdate.prem) {
      const GP = StreetGame.prototype, orig = GP.vgUpdate;
      GP.vgUpdate = function (dt) {
        const v0 = this.s && this.s.vg, a = v0 ? v0.capLast : undefined;
        orig.call(this, dt);
        const v = this.s && this.s.vg, b = v ? v.capLast : undefined;
        if (b !== a && b && typeof CAP !== 'undefined' && CAP[b]) {
          const i = typeof CAP_ORDER !== 'undefined' ? CAP_ORDER.indexOf(b) : -1;
          banner('cap', i >= 0 ? `Capitale ${i + 1} di ${CAP_ORDER.length}` : 'Capitale', CAP[b].name, CAP[b].country || '', '#f6d58a');
        }
      };
      GP.vgUpdate.prem = 1;
    }
    sync();
  }
  // dopo gli altri script che aspettano anche loro la pagina pronta (tasti.js, riavvia.js mettono i pulsanti con un attimo di ritardo)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(ready, 0)); else setTimeout(ready, 0);

  window.NightPremium = { get on() { return on(); }, set, url: piUrl, banner };
})();
if (typeof window !== 'undefined') Object.assign(window, { PI, piUrl, piCss, piDoc });
