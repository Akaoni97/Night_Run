/* Grafica del reel Night Run e interazione per la schermata iniziale. */
(() => {
  'use strict';

  const detents = [
    { angle: -151, label: 'OFF' },
    { angle: -114, label: 'ACC' },
    { angle: -74, label: 'ON' },
    { angle: -37, label: 'START' },
  ];

  let instanceCount = 0;

  window.createRacingIgnition = function createRacingIgnition(mount, onStart) {
    if (!(mount instanceof HTMLElement) || typeof onStart !== 'function') {
      throw new TypeError('Servono un elemento di montaggio e la funzione di avvio del gioco.');
    }

    const id = 'nr-ignition-help-' + (++instanceCount);
    const widget = document.createElement('div');
    widget.className = 'night-run-ignition';
    widget.innerHTML = `
      <button class="nr-switch" type="button" aria-label="Gira la chiave per iniziare la partita" aria-describedby="${id}">
        <span class="nr-led" aria-hidden="true"></span>
        <span class="nr-crown" aria-hidden="true"></span>
      </button>
      <span id="${id}" class="nr-instructions">Gira la chiave fino a START. Da tastiera premi Invio o Spazio.</span>
      <span class="nr-state" aria-live="polite"></span>
    `;
    const dial = widget.querySelector('.nr-switch');
    const status = widget.querySelector('.nr-state');
    let index = 0;
    let launched = false;
    let drag = null;
    let suppressClick = false;

    function render(angle, stop) {
      const degrees = detents[stop].angle;
      const radians = degrees * Math.PI / 180;
      dial.style.setProperty('--nr-angle', angle + 'deg');
      dial.style.setProperty('--nr-detent', degrees + 'deg');
      dial.style.setProperty('--nr-light-x', ((495 + 184 * Math.cos(radians)) / 990 * 100) + '%');
      dial.style.setProperty('--nr-light-y', ((365 + 184 * Math.sin(radians)) / 708 * 100) + '%');
    }

    function select(next) {
      if (launched) return;
      index = Math.max(0, Math.min(detents.length - 1, next));
      render(detents[index].angle, index);
      status.textContent = detents[index].label;
      if (index === detents.length - 1) {
        launched = true;
        dial.disabled = true;
        onStart();
        setTimeout(() => {
          render(detents[2].angle, 2);
          status.textContent = detents[2].label;
        }, 150);
      }
    }

    function pointerAngle(event) {
      const box = dial.getBoundingClientRect();
      return Math.atan2(
        (event.clientY - box.top) / box.height * 708 - 365,
        (event.clientX - box.left) / box.width * 990 - 495
      ) * 180 / Math.PI;
    }

    dial.addEventListener('pointerdown', event => {
      if (launched || drag || !event.isPrimary || event.button !== 0) return;
      suppressClick = false;
      drag = { id: event.pointerId, initial: pointerAngle(event), index, moved: false, x: event.clientX, y: event.clientY };
      dial.setPointerCapture(event.pointerId);
    });

    dial.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      const delta = ((pointerAngle(event) - drag.initial + 540) % 360) - 180;
      if (!drag.moved && (Math.abs(delta) < 4 || Math.hypot(event.clientX-drag.x,event.clientY-drag.y) < 5)) return;
      drag.moved = true;
      dial.dataset.dragging = '';
      const angle = Math.max(detents[0].angle, Math.min(detents[3].angle, detents[index].angle + delta));
      drag.index = detents.reduce((best, stop, i) =>
        Math.abs(angle - stop.angle) < Math.abs(angle - detents[best].angle) ? i : best, 0);
      render(angle, drag.index);
    });

    function finish(event, cancelled) {
      if (!drag || drag.id !== event.pointerId) return;
      const { moved, index: destination } = drag;
      drag = null;
      delete dial.dataset.dragging;
      if (cancelled) render(detents[index].angle, index);
      else if (moved) {
        suppressClick = true;
        select(destination);
      }
    }

    dial.addEventListener('pointerup', event => finish(event, false));
    dial.addEventListener('pointercancel', event => finish(event, true));
    dial.addEventListener('lostpointercapture', event => finish(event, true));
    dial.addEventListener('click', event => {
      if (suppressClick && event.detail) {
        suppressClick = false;
        return;
      }
      select(event.detail ? index + 1 : detents.length - 1);
    });
    dial.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '];
      if (!keys.includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      if (event.key === 'ArrowLeft') select(index - 1);
      else if (event.key === 'ArrowRight') select(index + 1);
      else if (event.key === 'Home') select(0);
      else select(detents.length - 1);
    });

    mount.appendChild(widget);
    select(0);
    return { start: () => select(detents.length - 1) };
  };
})();
