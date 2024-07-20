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

  <div class='color-list'>
    <div class='color' style='background-color: red;'></div>
    <div class='color' style='background-color: blue;'></div>
    <div class='color' style='background-color: white;'></div>
  </div>
  <div class='color-list'>
    <div class='color' style='background-color: purple;'></div>
    <div class='color' style='background-color: orange;'></div>
  </div>
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

    const colorListEls = docFrag.querySelectorAll('.color-list');

    for (const colorListEl of colorListEls) {

      const colorEls = colorListEl.querySelectorAll('.color');
      const colors = Array.from(colorEls).map((ce) => ce.style['background-color']);

      colorListEl.addEventListener('click', (evt) => {
        this.shadowRoot.dispatchEvent(new CustomEvent('colors-selected', {
          bubbles: true,
          composed: true,
          detail: {
            colors,
          },
        }));
      });
    }

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-palette', Palette);
