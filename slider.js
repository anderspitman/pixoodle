import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .slider {
      width: fit-content;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 20rem;
      height: 1.5rem;
    }

  </style>

  <div class='slider'>
    <input type='range' style='padding: 0px'/>
  </div>
`;

let templateEl;

class Slider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  get min() {
    return this._slider.min;
  }
  set min(_) {
    this._slider.min = _;
  }

  get max() {
    return this._slider.max;
  }
  set max(_) {
    this._slider.max = _;
  }

  get value() {
    return this._slider.value;
  }
  set value(_) {
    this._slider.value = _;
  }

  get background() {
    return this.getAttribute('background');
  }
  set background(_) {
    this.setAttribute('background', _);
    this._updateBackground();
  }

  connectedCallback() {

    if (!templateEl) {
      templateEl = document.createElement('template');
      templateEl.innerHTML = template;
    }

    const docFrag = templateEl.content.cloneNode(true);

    this._slider = docFrag.querySelector('input');

    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this.value = this.getAttribute('value');

    this._slider.addEventListener('input', (evt) => {
      this.value = evt.target.value;
    });

    this.shadowRoot.appendChild(docFrag);

    this._updateBackground();
  }

  _updateBackground() {

    if (!this.background) {
      return;
    }

    //const ruleStr = `
    //  input[type="range"]::-moz-range-track {
    //    background: ${this.background};
    //    height: 1.0rem;
    //  }
    //`;
    const ruleStr = `
      .slider {
        background-image: ${this.background};
      }
    `;

    if (this._ruleIdx === undefined) {
      this._ruleIdx = this.shadowRoot.styleSheets[0].insertRule(ruleStr);
    }
    else {
      this.shadowRoot.styleSheets[0].cssRules[this._ruleIdx].style.background = this.background;
    }
  }
}

customElements.define('pixoodle-slider', Slider);
