import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .color-list {
      display: flex;
    }

    .color {
      width: 32px;
      height: 32px;
      cursor: pointer;
      border: 1px solid black;
    }
    .color:hover {
      border: 2px solid black;
    }

  </style>

  <div class='colors'>
  </div>
`;

let templateEl;

class Palette extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  get currentSwatchColor() {
    return this._currentSwatchColor;
  }
  set currentSwatchColor(_) {
    this._currentSwatchColor = _;
    this._setCurrentSwatchColor();
  }

  connectedCallback() {

    if (!templateEl) {
      templateEl = document.createElement('template');
      templateEl.innerHTML = template;
    }

    const docFrag = templateEl.content.cloneNode(true);

    const allColors = [
      ['#000000', '#ffffff'],
      ['#ff0000', '#00ff00', '#0000ff'],
    ];

    let selectedPaletteIdx = 0;
    let selectedSwatchIdx = 0;

    const colorsEl = docFrag.querySelector('.colors');

    for (let i=0; i<allColors.length; i++) {

      const colors = allColors[i];

      const colorListEl = document.createElement('div');
      colorListEl.classList.add('color-list');
      colorsEl.appendChild(colorListEl);

      for (let j=0; j<colors.length; j++) {
        const color = colors[j];
        const colorEl = document.createElement('div');
        colorEl.classList.add('color');
        colorListEl.appendChild(colorEl);
        colorEl.style['background-color'] = color;

        colorEl.addEventListener('click', (evt) => {

          selectedPaletteIdx = i;
          selectedSwatchIdx = j;

          updateColors();
        });
      }
    }

    this._setCurrentSwatchColor  = () => {
      allColors[selectedPaletteIdx][selectedSwatchIdx] = this._currentSwatchColor;
      updateColors();
    }

    const updateColors = () => {
      const colorListEls = colorsEl.querySelectorAll('.color-list');
      for (let i=0; i<colorListEls.length; i++) {

        const colorListEl = colorListEls[i];

        const colorEls = colorListEl.querySelectorAll('.color');

        for (let j=0; j<colorEls.length; j++) {
          colorEls[j].style['background-color'] = allColors[i][j];
        }

      }

      this.shadowRoot.dispatchEvent(new CustomEvent('swatch-change', {
        bubbles: true,
        composed: true,
        detail: {
          color: allColors[selectedPaletteIdx][selectedSwatchIdx],
        },
      }));
    };

    updateColors();

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-palette', Palette);
