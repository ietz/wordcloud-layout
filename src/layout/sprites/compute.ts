import { WordcloudConfig } from '../../config/model';
import { measureText } from './measure';
import { boxPack } from './pack';
import { drawTexts, readSprites } from './canvas';
import { TextSprite } from './textSprite';

export const computeSprites = (config: WordcloudConfig): TextSprite[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {willReadFrequently: true})!;

  const measurements = config.data.map(datum => measureText(ctx, config, datum));
  const {positions, ...canvasSize} = boxPack(measurements.map(measurement => [measurement.boxWidth, measurement.boxHeight]));

  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  drawTexts(ctx, config.data, measurements, positions);
  return readSprites(ctx, measurements, positions);
}
