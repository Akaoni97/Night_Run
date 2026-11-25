/* Nottolino a due posizioni per la schermata iniziale. */
(() => {
  'use strict';

  const TEMPO_AVVIO = 1200;
  let instanceCount = 0;

  window.createRacingIgnition = function createRacingIgnition(mount, onStart, onCrank) {
    if (!(mount instanceof HTMLElement) || typeof onStart !== 'function') {
      throw new TypeError('Servono un elemento di montaggio e la funzione di avvio del gioco.');
    }

    const id = 'nr-ignition-help-' + (++instanceCount);
    const widget = document.createElement('div');
    widget.className = 'night-run-ignition';
    widget.innerHTML = `
      <button class="nr-switch" type="button" aria-label="Tieni premuta la chiave per avviare" aria-describedby="${id}">
        <span class="nr-plate" aria-hidden="true">DETENT / 2 POS</span>
        <span class="nr-led" aria-hidden="true"></span>
        <span class="nr-crown" aria-hidden="true"></span>
      </button>
      <span id="${id}" class="nr-instructions">Tieni premuta la chiave. Da tastiera premi Invio o Spazio.</span>
      <span class="nr-state" aria-live="polite">OFF</span>
    `;
    const dial = widget.querySelector('.nr-switch');
    const status = widget.querySelector('.nr-state');
    let timer = null;
    let pointer = null;
    let stopSound;
    let launched = false;

    function begin() {
      if (launched || timer !== null) return;
      dial.dataset.cranking = '';
      status.textContent = 'START';
      // Il gesto sblocca l’audio prima del passaggio asincrono alla partita.
      stopSound = onCrank?.();
      timer = setTimeout(() => {
        timer = null;
        launched = true;
        pointer = null;
        stopSound = undefined;
        dial.disabled = true;
        status.textContent = 'Motore acceso';
        onStart();
      }, TEMPO_AVVIO);
    }

    function cancel() {
      if (pointer === null || timer === null) return;
      clearTimeout(timer);
      timer = null;
      pointer = null;
      stopSound?.();
      stopSound = undefined;
      delete dial.dataset.cranking;
      status.textContent = 'OFF';
    }

    dial.addEventListener('pointerdown', event => {
      if (launched || timer !== null || !event.isPrimary || event.button !== 0) return;
      pointer = event.pointerId;
      dial.setPointerCapture(pointer);
      begin();
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      dial.addEventListener(type, event => { if (event.pointerId === pointer) cancel(); });
    }
    window.addEventListener('blur', cancel);

    // I clic generati da puntatore arrivano dopo il rilascio. Il clic
    // da tastiera o da tecnologia assistiva avvia invece l’intera sequenza.
    dial.addEventListener('click', event => { if (event.detail === 0) begin(); });
    dial.addEventListener('keydown', event => {
      if ((event.key !== 'Enter' && event.key !== ' ') || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) begin();
    });

    mount.appendChild(widget);
    return { start: begin };
  };
})();
