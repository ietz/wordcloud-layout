import { measureText } from './measure';
import { boxPack } from './pack';
import { drawTexts, readSprites } from './canvas';
import { TextSprite } from './sprite';
import { RenderWord } from '../../common';

export const computeSprites = (words: RenderWord[]): TextSprite[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {willReadFrequently: true})!;

  const measurements = words.map(word => measureText(ctx, word));
  const {positions, ...canvasSize} = boxPack(measurements.map(measurement => [measurement.boxWidth, measurement.boxHeight]));

  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  drawTexts(ctx, words, measurements, positions);
  return readSprites(ctx, measurements, positions);
}
