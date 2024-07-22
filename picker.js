import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .picker {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .swatch {
      width: 64px;
      height: 64px;
    }

  </style>

  <div class='picker'>
    <pixoodle-slider id='hue-slider' min='0' max='360'
      background='linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))'
    ></pixoodle-slider>
    <pixoodle-slider id='saturation-slider' min='0' max='100'></pixoodle-slider>
    <pixoodle-slider id='lightness-slider' min='0' max='100'></pixoodle-slider>

    <div class='swatch'>
    </div>
  </div>
`;

let templateEl;

class Picker extends HTMLElement {
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

    const hueSlider = docFrag.querySelector('#hue-slider');
    const satSlider = docFrag.querySelector('#saturation-slider');
    const lightSlider = docFrag.querySelector('#lightness-slider');

    const swatchEl = docFrag.querySelector('.swatch');

    let hue;
    hueSlider.addEventListener('input', (evt) => {
      hue = String(evt.target.value);
      satSlider.background = `linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`;
      lightSlider.background = `linear-gradient(to right, black, hsl(${hue}, 100%, 50%), white)`;
      updateColor();
    });

    let saturation;
    satSlider.addEventListener('input', (evt) => {
      saturation = String(evt.target.value);
      updateColor();
    });

    let lightness;
    lightSlider.addEventListener('input', (evt) => {
      lightness = String(evt.target.value);
      updateColor();
    });

    function updateColor() {
      swatchEl.style['background-color'] = `hsl(${hue} ${saturation}% ${lightness}%)`;
    }

    this.shadowRoot.appendChild(docFrag);
  }
}

customElements.define('pixoodle-color-picker', Picker);
