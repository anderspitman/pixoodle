import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    :host {
      width: 100%;
      height: 100%;
    }

    .editor {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    pixoodle-grid-editor {
      flex: 2;
    }

    .color-container {
      flex: 1;
    }
  </style>

  <div class='editor'>
    <pixoodle-grid-editor></pixoodle-grid-editor>
    <div class='color-container'>
      <pixoodle-palette></pixoodle-palette>
      <pixoodle-color-picker></pixoodle-color-picker>
      <button id='set-primary-btn'>Set Primary</button>
    <div>
  </div>
`;

let templateEl;

class Editor extends HTMLElement {
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

    const palette = docFrag.querySelector('pixoodle-palette');
    const gridEditor = docFrag.querySelector('pixoodle-grid-editor');
    const picker = docFrag.querySelector('pixoodle-color-picker');
    const setPrimaryBtn = docFrag.querySelector('#set-primary-btn');

    this.shadowRoot.appendChild(docFrag);

    palette.addEventListener('colors-selected', (evt) => {
      gridEditor.colors = evt.detail.colors;
    });

    let color;
    picker.addEventListener('color-changed', (evt) => {
      color = evt.detail.color;
    });

    setPrimaryBtn.addEventListener('click', (evt) => {
      if (color) {
        const colors = gridEditor.colors;
        colors[0] = color.hex;
        gridEditor.colors = colors;
      }
    });
  }
}

customElements.define('pixoodle-editor', Editor);
