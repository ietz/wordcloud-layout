import { WordcloudConfig } from '../../config/model';
import { measureText } from './measure';
import { boxPack } from './pack';

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
