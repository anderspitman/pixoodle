import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}
  </style>

  <pixoodle-grid-editor></pixoodle-grid-editor>
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

    console.log(docFrag);

    const root = docFrag.querySelector('.editor');

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-editor', Editor);
