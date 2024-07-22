import { commonCss } from './common.js';

const template = `
  <style>
    :host {
      display: block;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .slider {
      width: fit-content;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 15rem;
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
    return this.getAttribute('min');
  }
  set min(_) {
    this.setAttribute('min', _);
  }

  get max() {
    return this.getAttribute('max');
  }
  set max(_) {
    this.setAttribute('max', _);
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

    const slider = docFrag.querySelector('input');

    slider.setAttribute('min', this.min);
    slider.setAttribute('max', this.max);

    slider.addEventListener('input', (evt) => {
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
