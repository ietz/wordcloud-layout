import { WordcloudConfig } from './config/model';

let firstLayout: number | undefined = undefined;

export const layout = (config: WordcloudConfig) => {
  if (firstLayout === undefined) {
    firstLayout = Date.now();
  }

  const time = Date.now() - firstLayout;

  computeSprites(config, 2 * Math.PI * time / 1000 / 8);
};

export const computeSprites = (config: WordcloudConfig, rotation: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  document.getElementById('app').appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];

  let x = 0;

  for (const datum of config.data) {
    ctx.font = `${config.fontWeight} ${datum.size}px ${config.fontFamily}`;

    const metrics = ctx.measureText(datum.text);
    const wordWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const wordHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const sin = Math.abs(Math.sin(rotation));
    const cos = Math.abs(Math.cos(rotation))
    const boxHeight = wordWidth * sin + wordHeight * cos;
    const boxWidth = wordWidth * cos + wordHeight * sin;

    ctx.fillStyle = colors.pop();
    ctx.fillRect(x, 0, boxWidth, boxHeight);

    ctx.translate(x + boxWidth / 2, boxHeight / 2);
    ctx.rotate(rotation);
    ctx.translate(metrics.actualBoundingBoxLeft -wordWidth / 2, -metrics.actualBoundingBoxDescent + wordHeight / 2);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

    ctx.resetTransform();

    x += boxWidth;
  }
}
