import { WordcloudConfig } from '../../config/model';
import { measureText } from './measure';
import { boxPack } from './pack';
import { drawTexts, readSpriteData, SpriteData } from './canvas';
import { range } from '../../util';

export const computeSprites = (config: WordcloudConfig): Sprite[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

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
      size: {
        width: measurement.boxWidth,
        height: measurement.boxHeight,
      },
      textBaselineOffset: {
        left: measurement.textX,
        bottom: measurement.textY,
      },
    }
  })
}

export interface Sprite {
  data: SpriteData,
  size: {
    width: number,
    height: number,
  }
  textBaselineOffset: {
    left: number,
    bottom: number,
  }
}

export const getSpriteBlockWidth = (sprite: Sprite) => sprite.data.length / sprite.size.height;
