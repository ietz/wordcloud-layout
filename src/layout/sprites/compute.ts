import { Size, WordcloudConfig } from '../../config/model';
import { measureText } from './measure';
import { boxPack } from './pack';
import { drawTexts, readSpriteData, SpriteData } from './canvas';
import { range } from '../../util';

export const computeSprites = (config: WordcloudConfig): Sprite[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {willReadFrequently: true})!;

  const measurements = config.data.map(datum => measureText(ctx, config, datum));
  const {positions, ...canvasSize} = boxPack(measurements.map(measurement => [measurement.boxWidth, measurement.boxHeight]));

  canvas.width = canvasSize.width;
  canvas.height = canvasSize.height;

  drawTexts(ctx, config.data, measurements, positions);
  const spriteData = readSpriteData(ctx, measurements, positions);

  return range(config.data.length).map(i => {
    const measurement = measurements[i];

    return {
      data: spriteData[i],
      size: [measurement.boxWidth, measurement.boxHeight],
      textBaselineOffset: {
        x: measurement.textX,
        y: measurement.textY,
      },
    }
  })
}

export interface Sprite {
  data: SpriteData,
  size: Size,
  textBaselineOffset: {
    x: number,
    y: number,
  }
}

export const getSpriteBlockWidth = (sprite: Sprite) => sprite.data.length / sprite.size[1];
