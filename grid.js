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

    this.attachShadow({ mode: 'open' });
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

    for (let i=0; i<numRows; i++) {
      const rowEl = document.createElement('div');
      rowEl.classList.add('row');
      gridEl.appendChild(rowEl);

      for (let j=0; j<numCols; j++) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        rowEl.appendChild(cellEl);

        cellEl.addEventListener('click', (evt) => {
          if (cellEl.style['background-color'] === 'black') {
            cellEl.style['background-color'] = 'white';
          }
          else {
            cellEl.style['background-color'] = 'black';
          }
        });
      }
    }

    let scale = 1.0;
    let tx = 0.0;
    let ty = 0.0;

    let pointerDown = false;
    let px = 0;
    let py = 0;
    let prevPx = px;
    let prevPy = py;

    root.addEventListener('pointerdown', () => {
      pointerDown = true;
    });

    root.addEventListener('pointerup', () => {
      pointerDown = false;
      prevPx = 0;
      prevPy = 0;
    });

    root.addEventListener('pointermove', (evt) => {
      if (pointerDown) {
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

    root.addEventListener('wheel', (evt) => {
      evt.preventDefault();

      scale += evt.deltaY * -0.001;
      if (scale < 0.1) {
        scale = 0.1;
      }
      else if (scale > 5.0) {
        scale = 5.0;
      }

      updateTransform();

    });

    function updateTransform() {
      gridEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    this.shadowRoot.appendChild(docFrag);
  }
}


customElements.define('pixoodle-grid-editor', GridEditor);
