import { commonCss } from './common.js';

const template = `
  <style>
    ${commonCss}

    .picker {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .swatch {
      width: 64px;
      height: 64px;
    }

  </style>

  <div class='picker'>
    <div>
      <pixoodle-slider id='hue-slider' min='0' max='360' value='0'
        background='linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))'
      ></pixoodle-slider>
      <pixoodle-slider id='saturation-slider' min='0' max='100' value='100'></pixoodle-slider>
      <pixoodle-slider id='lightness-slider' min='0' max='100' value='50'></pixoodle-slider>
    </div>

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

    this.shadowRoot.appendChild(docFrag);

    hueSlider.addEventListener('input', (evt) => {
      updateSliders();
      updateColor();
    });

    satSlider.addEventListener('input', (evt) => {
      updateColor();
    });

    lightSlider.addEventListener('input', (evt) => {
      updateColor();
    });

    const updateColor = () => {
      const hue = hueSlider.value;
      const saturation = satSlider.value;
      const lightness = lightSlider.value;
      swatchEl.style['background-color'] = `hsl(${hue} ${saturation}% ${lightness}%)`;

      const hexColor = hslToHex(hue, saturation, lightness);

      this.shadowRoot.dispatchEvent(new CustomEvent('color-changed', {
        bubbles: true,
        composed: true,
        detail: {
          color: {
            hex: hexColor,
            hsl: {
              hue: Number(hue),
              saturation: Number(saturation),
              lightness: Number(lightness),
            },
          },
        },
      }));
    };

    const updateSliders = () => {
      const hue = hueSlider.value;
      satSlider.background = `linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`;
      lightSlider.background = `linear-gradient(to right, black, hsl(${hue}, 100%, 50%), white)`;
    };

    updateSliders();
    updateColor();
    
  }
}

// Copied from https://stackoverflow.com/a/44134328/943814
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

customElements.define('pixoodle-color-picker', Picker);
