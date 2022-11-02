import { Word, WordcloudConfig } from './config/model';
import { boxPack } from './layout/sprites/pack';

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

  document.getElementById('app')!.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];

  const measurements = config.data.map(datum => measureText(ctx, config, datum, rotation));
  const {placements, ...canvasSize} = boxPack(measurements.map(measurement => [measurement.boxWidth, measurement.boxHeight]));

  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  for (let i = 0; i < config.data.length; i++) {
    const datum = config.data[i];
    const measurement = measurements[i];
    const placement = placements[i];

    ctx.font = measurement.font;

    ctx.fillStyle = colors.pop()!;
    ctx.fillRect(placement.x, placement.y, measurement.boxWidth, measurement.boxHeight);

    ctx.translate(placement.x + measurement.boxWidth / 2, placement.y + measurement.boxHeight / 2);
    ctx.rotate(rotation);
    ctx.translate(measurement.offsetLeft - measurement.textWidth / 2, -measurement.offsetBottom + measurement.textHeight / 2);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

    ctx.resetTransform();
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

interface TextMeasurement {
  font: string,
  textWidth: number,
  textHeight: number,
  offsetLeft: number,
  offsetBottom: number,
  boxWidth: number,
  boxHeight: number,
}
