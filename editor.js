import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .editor {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    pixoodle-grid-editor {
      flex: 3;
    }

    pixoodle-palette {
      flex: 1;
    }
  </style>

  <div class='editor'>
    <pixoodle-grid-editor></pixoodle-grid-editor>
    <pixoodle-palette></pixoodle-palette>
    <pixoodle-color-picker></pixoodle-color-picker>
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

    palette.addEventListener('colors-selected', (evt) => {
      gridEditor.colors = evt.detail.colors;
    });

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-editor', Editor);
