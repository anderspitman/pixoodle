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
    }

    pixoodle-grid-editor {
      height: 60vh;
    }

    .color-container {
    }

    .dimension-input {
      width: 64px;
    }
  </style>

  <div class='editor'>
    <pixoodle-grid-editor color='white'></pixoodle-grid-editor>
    <div class='color-container'>
      <pixoodle-palette></pixoodle-palette>
      <pixoodle-color-picker></pixoodle-color-picker>
      <button id='set-primary-btn'>Set Color</button>
    <div>
    <button id='save-btn'>Save</button>
    <input type='file' id='file-input' />
    <div>
      <label for='width-input'>Width:</label>
      <input class='dimension-input' type='number' id='width-input' />
      <label for='height-input'>Height:</label>
      <input class='dimension-input' type='number' id='height-input' />
      <button id='resize-btn'>Resize</button>
    </div>
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
    const saveBtnEl = docFrag.querySelector('#save-btn');
    const fileInput = docFrag.querySelector('#file-input');
    const resizeBtnEl = docFrag.querySelector('#resize-btn');
    const widthInputEl = docFrag.querySelector('#width-input');
    const heightInputEl = docFrag.querySelector('#height-input');

    gridEditor.addEventListener('grid-update', (evt) => {
      save();
    });

    palette.addEventListener('swatch-change', (evt) => {
      gridEditor.color = evt.detail.color;
    });

    let color;
    picker.addEventListener('color-changed', (evt) => {
      color = evt.detail.color;
    });

    setPrimaryBtn.addEventListener('click', (evt) => {
      if (color) {
        palette.currentSwatchColor = color.hex;
        save();
      }
    });

    saveBtnEl.addEventListener('click', (evt) => {
      const data = {
        version: "pixoodle 0.1.0",
        grid: gridEditor.grid,
      };

      const jsonStr = JSON.stringify(data, null, 2);
      download(jsonStr, "Untitled.pxdl", "application/json");

    });

    fileInput.addEventListener('change', (evt) => {
      const file = evt.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        gridEditor.grid = data.grid;
      };

      reader.readAsText(file);
    });

    resizeBtnEl.addEventListener('click', (evt) => {
      const width = Number(widthInputEl.value);
      const height = Number(heightInputEl.value);

      gridEditor.resize(width, height);
      save();
    });

    function save() {
      localStorage.setItem('state', JSON.stringify({
        version: "pixoodle 0.1.0",
        grid: gridEditor.grid,
        palette: palette.colors,
      }, null, 2));
    }

    function restore() {
      const dataJson = localStorage.getItem('state');
      if (dataJson) {
        const data = JSON.parse(dataJson);
        gridEditor.grid = data.grid;
        palette.colors = data.palette;
      }
    }

    this.shadowRoot.appendChild(docFrag);

    restore();
  }
}

// Copied from https://stackoverflow.com/a/64908345/943814
function download(content, filename, mimeType){
  const a = document.createElement('a');
  const blob = new Blob([content], {type: mimeType});
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

customElements.define('pixoodle-editor', Editor);
