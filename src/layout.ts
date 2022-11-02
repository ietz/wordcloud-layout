import { Word, WordcloudConfig } from './config/model';

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

  document.getElementById('app')!.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];

  let x = 0;

  const sizes = config.data.map(datum => measureText(ctx, config, datum, rotation));
  // render texts with large box heights first
  const order = range(sizes.length).sort((a, b) => sizes[b].boxWidth - sizes[a].boxWidth);

  for (const i of order) {
    const datum = config.data[i];
    const measure = sizes[i];

    ctx.font = measure.font;

    ctx.fillStyle = colors.pop()!;
    ctx.fillRect(x, 0, measure.boxWidth, measure.boxHeight);

    ctx.translate(x + measure.boxWidth / 2, measure.boxHeight / 2);
    ctx.rotate(rotation);
    ctx.translate(measure.offsetLeft - measure.textWidth / 2, -measure.offsetBottom + measure.textHeight / 2);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

    ctx.resetTransform();

    x += measure.boxWidth;
  }
}

const measureText = (ctx: CanvasRenderingContext2D, config: WordcloudConfig, datum: Word, rotation: number): TextMeasurement => {
  ctx.font = `${config.fontWeight} ${datum.size}px ${config.fontFamily}`;

  const metrics = ctx.measureText(datum.text);
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  const sin = Math.abs(Math.sin(rotation));
  const cos = Math.abs(Math.cos(rotation))
  const boxHeight = textWidth * sin + textHeight * cos;
  const boxWidth = textWidth * cos + textHeight * sin;

  return {
    font: ctx.font,
    textWidth,
    textHeight,
    offsetLeft: metrics.actualBoundingBoxLeft,
    offsetBottom: metrics.actualBoundingBoxDescent,
    boxWidth,
    boxHeight,
  };
}

const range = (end: number) => Array.from({length: end}, (_, i) => i);


interface TextMeasurement {
  font: string,
  textWidth: number,
  textHeight: number,
  offsetLeft: number,
  offsetBottom: number,
  boxWidth: number,
  boxHeight: number,
}
