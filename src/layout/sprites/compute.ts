import { WordcloudConfig } from '../../config/model';
import { measureText } from './measure';
import { boxPack } from './pack';
import { drawTexts, readSprites } from './canvas';

export const computeSprites = (config: WordcloudConfig) => {
  const canvas = document.createElement('canvas');

  document.getElementById('app')!.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const measurements = config.data.map(datum => measureText(ctx, config, datum));
  const {placements, ...canvasSize} = boxPack(measurements.map(measurement => [measurement.boxWidth, measurement.boxHeight]));

  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  canvas.style['width'] = canvasSize.width + 'px';
  canvas.style['height'] = canvasSize.height + 'px';


  drawTexts(ctx, config.data, measurements, placements);
  const sprites = readSprites(ctx, measurements, placements);
}
