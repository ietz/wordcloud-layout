import { WordcloudConfig } from './config/model';

export const layout = (config: WordcloudConfig) => {
  computeSprites(config);
};

export const computeSprites = (config: WordcloudConfig) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  document.getElementById('app').appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];

  let x = 0;

  const ms = [];

  for (const datum of config.data) {
    ctx.font = `${config.fontWeight} ${datum.size}px ${config.fontFamily}`;

    const metrics = ctx.measureText(datum.text);
    const width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    ctx.fillStyle = colors.pop();
    ctx.fillRect(x, 0, width, height);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, x + metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxAscent);

    x += width;
  }

  console.table(ms);
}
