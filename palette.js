import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .color-list {
      display: flex;
    }
    .color-list:hover {
      border: 1px solid white;
    }

    .color {
      width: 32px;
      height: 32px;
      border: 1px solid black;
    }

  </style>

  <div class='colors'>
  </div>
  <div class='color-pickers'>
    <input class='color-picker' type='color' />
    <input class='color-picker' type='color' />
    <input class='color-picker' type='color' />
  <div>
`;

let templateEl;

class Palette extends HTMLElement {
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

    const allColors = [
      ['#000000', '#ffffff'],
      ['#ff0000', '#00ff00', '#0000ff'],
    ];

    let selectedIdx = 0;

    const colorsEl = docFrag.querySelector('.colors');

    for (let i=0; i<allColors.length; i++) {

      const colors = allColors[i];

      const colorListEl = document.createElement('div');
      colorListEl.classList.add('color-list');
      colorsEl.appendChild(colorListEl);

      colorListEl.addEventListener('click', (evt) => {

        selectedIdx = i;

        updatePickers();
        updateColors();
      });

      for (const color of colors) {
        const colorEl = document.createElement('div');
        colorEl.classList.add('color');
        colorListEl.appendChild(colorEl);
        colorEl.style['background-color'] = color;
      }
    }

    const pickersContainerEl = docFrag.querySelector('.color-pickers');
    const pickerEls = pickersContainerEl.querySelectorAll('.color-picker');

    for (let i=0; i<pickerEls.length; i++) {
      const pickerEl = pickerEls[i];

      pickerEl.addEventListener('change', (evt) => {
        const color = evt.target.value;
        allColors[selectedIdx][i] = color;
        updateColors();
      });
    }

    const updatePickers = () => {

      for (let i=0; i<pickerEls.length; i++) {
        const pickerEl = pickerEls[i];

        pickerEl.value = allColors[selectedIdx][i];
      }
    };

    const updateColors = () => {
      const colorListEls = colorsEl.querySelectorAll('.color-list');
      for (let i=0; i<colorListEls.length; i++) {

        const colorListEl = colorListEls[i];

        const colorEls = colorListEl.querySelectorAll('.color');

        for (let j=0; j<colorEls.length; j++) {
          colorEls[j].style['background-color'] = allColors[i][j];
        }

      }

      this.shadowRoot.dispatchEvent(new CustomEvent('colors-selected', {
        bubbles: true,
        composed: true,
        detail: {
          colors: allColors[selectedIdx],
        },
      }));
    };

    updatePickers();
    updateColors();

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-palette', Palette);
