import { commonCss } from './common.js';

const template = `
  <style>

    ${commonCss}

    .grid-editor {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border: 1px solid black;
      touch-action: none;
    }

    .grid {
      width: fit-content;
      height: fit-content;
      border: 1px solid black;
      border-collapse: collapse;
    }

    .row {
      /*border: 1px solid black;*/
      display: flex;
    }

    .cell {
      width: 32px;
      height: 32px;
      display: inline-block;
      border: 1px solid black;
    }
    .cell:hover {
      background-color: #999;
      cursor:pointer;
    }
  </style>

  <div class='grid-editor'>
    <div class='grid'>
    </div>
  </div>
`;

let templateEl;

class GridEditor extends HTMLElement {
  constructor() {
    super();

    this.colors = ['black','white'];
    this.colorIdx = 0;

    this.attachShadow({ mode: 'open' });
  }

  get colors() {
    // TODO: detect attribute changes so we don't have to deserialize every time
    return JSON.parse(this.getAttribute('colors'));
  }
  set colors(_) {
    this.colorIdx = 0;
    this.setAttribute('colors', JSON.stringify(_));
  }

  connectedCallback() {

    if (!templateEl) {
      templateEl = document.createElement('template');
      templateEl.innerHTML = template;
    }

    const docFrag = templateEl.content.cloneNode(true);

    const root = docFrag.querySelector('.grid-editor');

    const gridEl = docFrag.querySelector('.grid');

    const numRows = 8;
    const numCols = 8;

    const initColors = this.colors;
    const initColor = initColors[initColors.length - 1]

    for (let i=0; i<numRows; i++) {
      const rowEl = document.createElement('div');
      rowEl.classList.add('row');
      gridEl.appendChild(rowEl);

      for (let j=0; j<numCols; j++) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        rowEl.appendChild(cellEl);

        cellEl.dataset.color = initColor;
        cellEl.style['background-color'] = initColor;

        cellEl.addEventListener('click', (evt) => {
          const nextColor = getNextColor(cellEl, this.colors);
          cellEl.dataset.color = nextColor;
          cellEl.style['background-color'] = nextColor;
        });

        cellEl.addEventListener('mouseover', (evt) => {
          const nextColor = getNextColor(cellEl, this.colors);
          cellEl.style['background-color'] = nextColor;
        });
        cellEl.addEventListener('mouseout', (evt) => {
          cellEl.style['background-color'] = cellEl.dataset.color;
        });
      }
    }

    function getNextColor(el, colors) {

      const curColor = el.dataset.color;

      for (let i=0; i<colors.length; i++) {
        const color = colors[i];
        if (curColor === color) {
          const nextColorIdx = (i + 1) % colors.length;
          return colors[nextColorIdx];
        }
      }

      return colors[0];
    }

    let scale = 1.0;
    let tx = 0.0;
    let ty = 0.0;

    let pointerDown = false;
    let px = 0;
    let py = 0;
    let prevPx = px;
    let prevPy = py;

    const evCache = [];
    let prevDist = -1;

    root.addEventListener('pointerdown', (evt) => {

      evCache.push(evt);

      pointerDown = true;
    });

    root.addEventListener('pointerup', (evt) => {

      const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === evt.pointerId,
      );
      evCache.splice(index, 1);
      if (evCache.length < 2) {
        prevDist = -1;
      }

      pointerDown = false;
      prevPx = 0;
      prevPy = 0;
    });

    root.addEventListener('pointermove', (evt) => {

      const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === evt.pointerId,
      );
      evCache[index] = evt;

      if (evCache.length === 2) {
        // zoom functionality copied from here: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
        const dist = distance(evCache[0], evCache[1]);

        if (prevDist > 0) {
          zoom(dist - prevDist);
        }

        prevDist = dist;
      }
      else if (pointerDown) {
        // pan
        px = evt.x;
        py = evt.y;

        if (prevPx === 0) {
          prevPx = evt.x;
        }
        if (prevPy === 0) {
          prevPy = evt.y;
        }

        const dx = prevPx - px;
        const dy = prevPy - py;

        prevPx = px;
        prevPy = py;

        tx -= dx;
        ty -= dy;

        updateTransform();
      }
    });

    // Disable default browser zoom (specifically for desktop)
    root.addEventListener('touchmove', evt => evt.preventDefault());

    root.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      zoom(-evt.deltaY * 0.2);
    });

    function zoom(amount) {

      scale += amount * 0.01;
      if (scale < 0.1) {
        scale = 0.1;
      }
      else if (scale > 5.0) {
        scale = 5.0;
      }

      updateTransform();
    }

    function updateTransform() {
      gridEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    this.shadowRoot.appendChild(docFrag);
  }
}

function distance(p1, p2) {
  return Math.sqrt(squaredDistance(p1, p2));
}

function squaredDistance(p1, p2) {
  const xDiff = p2.clientX - p1.clientX;
  const yDiff = p2.clientY - p1.clientY;
  return xDiff*xDiff + yDiff*yDiff;
}


customElements.define('pixoodle-grid-editor', GridEditor);
