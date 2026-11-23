// ============================================================================
//  Night Run · Pagina leggera (il primo script della pagina, prima di tutti gli altri)
//  Il gioco riscrive a ogni fotogramma molte scritte e stati del cruscotto e del viaggio (soldi, km, benzina,
//  pulsanti premuti, pannelli nascosti...) anche quando non sono cambiati. Per il browser ogni scrittura è una
//  modifica della pagina: ricalcola gli stili, rifà l'impaginazione e ridipinge i pannelli (anche quelli col vetro
//  sfocato dietro). Qui le scritture che non cambiano niente semplicemente non si fanno: stesso risultato a schermo,
//  meno lavoro. Riguarda: textContent, hidden, disabled, className, classList.add/remove, setAttribute (solo attributi
//  di stato: aria-*, data-*, title, role, class) e alcune proprietà di style usate a ogni fotogramma.
//  Non tocca src, href, value, innerHTML (scriverli di nuovo ha effetti voluti, o non si può confrontare).
//  Spegnere per una prova: localStorage nr_leggero = '0' e ricaricare.
// ============================================================================
(() => {
  if (typeof Node === 'undefined' || typeof document === 'undefined') return;
  try { if (localStorage.getItem('nr_leggero') === '0') return; } catch (e) { /* niente */ }
  const def = (proto, name, make) => {
    const d = proto && Object.getOwnPropertyDescriptor(proto, name);
    if (!d || !d.set || !d.get || !d.configurable) return;
    Object.defineProperty(proto, name, { configurable: true, enumerable: d.enumerable, get: d.get, set: make(d.set, d.get) });
  };
  let saltate = 0;
  // textContent: se l'elemento ha già solo quel testo, non si rifà il nodo di testo
  def(Node.prototype, 'textContent', (set) => function (v) {
    if (this.nodeType === 1) {
      const s = v == null ? '' : String(v), f = this.firstChild;
      if (f ? f.nodeType === 3 && !f.nextSibling && f.data === s : s === '') { saltate++; return; }
    }
    set.call(this, v);
  });
  // hidden (vero o falso): se è già così, niente
  def(HTMLElement.prototype, 'hidden', (set) => function (v) {
    if ((v == null || typeof v === 'boolean') && this.hasAttribute('hidden') === !!v) { saltate++; return; }
    set.call(this, v);
  });
  // disabled dei controlli
  for (const C of [window.HTMLButtonElement, window.HTMLInputElement, window.HTMLSelectElement, window.HTMLTextAreaElement, window.HTMLFieldSetElement]) {
    if (C) def(C.prototype, 'disabled', (set, get) => function (v) { if (get.call(this) === !!v) { saltate++; return; } set.call(this, v); });
  }
  // className uguale
  def(Element.prototype, 'className', (set, get) => function (v) { if (get.call(this) === String(v)) { saltate++; return; } set.call(this, v); });
  // classList.add/remove: il browser riscrive l'attributo anche se la classe c'era già (o non c'era)
  if (window.DOMTokenList) {
    const P = DOMTokenList.prototype, add = P.add, rem = P.remove;
    P.add = function (...t) { for (const k of t) if (!this.contains(k)) return add.apply(this, t); saltate++; };
    P.remove = function (...t) { for (const k of t) if (this.contains(k)) return rem.apply(this, t); saltate++; };
  }
  // setAttribute: solo per gli attributi di stato
  const sa = Element.prototype.setAttribute, stato = /^(aria-|data-)|^(title|role|class|tabindex)$/;
  Element.prototype.setAttribute = function (n, v) {
    if (stato.test(n) && this.getAttribute(n) === String(v)) { saltate++; return; }
    return sa.call(this, n, v);
  };
  // style: le proprietà che il gioco scrive a ogni fotogramma (barre, lancette, posizioni)
  if (window.CSSStyleDeclaration) {
    const SP = CSSStyleDeclaration.prototype;
    for (const p of ['width', 'height', 'left', 'top', 'right', 'bottom', 'transform', 'translate', 'opacity', 'background', 'backgroundColor', 'color',
      'display', 'visibility', 'filter', 'boxShadow', 'borderColor', 'pointerEvents', 'cursor', 'scale', 'clipPath', 'transformOrigin']) {
      def(SP, p, (set, get) => function (v) { const s = v == null ? '' : String(v); if (get.call(this) === s) { saltate++; return; } set.call(this, v); });
    }
    const setP = SP.setProperty;
    SP.setProperty = function (n, v, pr) {
      const s = v == null ? '' : String(v);
      if (this.getPropertyValue(n) === s && this.getPropertyPriority(n) === (pr || '')) { saltate++; return; }
      return setP.call(this, n, v, pr);
    };
  }
  window.NightLeggero = { get saltate() { return saltate; } };
})();
