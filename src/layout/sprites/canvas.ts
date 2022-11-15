import type { Word } from '../../config';
import { getFontString } from '../../config';
import type { TextMeasurement } from './measure';
import type { Padding, Position, Size } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { TextSprite } from './sprite';

export const drawTexts = (ctx: CanvasRenderingContext2D, words: Word<unknown>[], measurements: TextMeasurement[], positions: Position[]) => {
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineJoin = 'round';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const measurement = measurements[i];
    const position = positions[i];

    ctx.font = getFontString(word);

    ctx.translate(position[0] + measurement.textX, position[1] + measurement.textY);
    ctx.rotate(word.rotation);

    ctx.fillText(word.text, 0, 0);

    if (word.padding > 0) {
      ctx.lineWidth = 2 * word.padding;
      ctx.strokeText(word.text, 0, 0);
    }

    ctx.resetTransform();
  }
}

export const readSprites = (ctx: CanvasRenderingContext2D, measurements: TextMeasurement[], positions: Position[]): TextSprite[] => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const sprites: TextSprite[] = [];

  for (let i = 0; i < measurements.length; i++) {
    const measurement = measurements[i];
    const position = positions[i];

    const crop = cropSpriteMapBounds(imageData, measurement, position);
    const spriteData: number[] = [];

    const yEnd = position[1] + measurement.boxHeight - crop.bottom;
    const xEnd = position[0] + measurement.boxWidth - crop.right;
    for (let y = position[1] + crop.top; y < yEnd; y++) {
      for (let blockX = position[0] + crop.left; blockX < xEnd; blockX += BLOCK_SIZE) {
        let block = 0;
        for (let blockPixelIndex = 0; blockPixelIndex < BLOCK_SIZE && blockX + blockPixelIndex < xEnd; blockPixelIndex++) {
          const pixelIndex = y * imageData.width + blockX + blockPixelIndex;
          const pixelAlpha = imageData.data[pixelIndex * 4 + 3];
          if (pixelAlpha > 0) {
            block |= 1 << (BLOCK_SIZE - 1 - blockPixelIndex);
          }
        }

        spriteData.push(block);
      }
    }

    sprites.push(new TextSprite(
      spriteData,
      measurement.boxWidth - crop.left - crop.right,
      {
        x: measurement.textX - crop.left,
        y: measurement.textY - crop.top,
      },
      measurement.area,
    ));
  }

  return sprites;
}

const cropSpriteMapBounds = (imageData: ImageData, measurement: TextMeasurement, position: Position): Padding => {
  const isRowEmpty = (y: number) => isImageDataAreaEmpty(
    imageData,
    [position[0], y],
    [measurement.boxWidth, 1],
  )

  const cropTop = range(measurement.boxHeight).find(topRow => !isRowEmpty(position[1] + topRow));
  if (cropTop === undefined) {
    console.warn('Sprite area is empty');
    return {top: 0, bottom: measurement.boxHeight, left: 0, right: measurement.boxWidth};
  }

  const cropBottom = range(measurement.boxHeight).find(bottomRow => !isRowEmpty(position[1] + measurement.boxHeight - 1 - bottomRow))!;

  const isColumnEmpty = (x: number) => isImageDataAreaEmpty(
    imageData,
    [x, position[1] + cropTop],
    [1, measurement.boxHeight - cropTop - cropBottom],
  );

  const cropLeft = range(measurement.boxWidth).find(leftColumn => !isColumnEmpty(position[0] + leftColumn))!;
  const cropRight = range(measurement.boxWidth).find(rightColumn => !isColumnEmpty(position[0] + measurement.boxWidth - 1 - rightColumn))!;

  return {top: cropTop, bottom: cropBottom, left: cropLeft, right: cropRight};
}

const isImageDataAreaEmpty = (imageData: ImageData, position: Position, size: Size) => {
  for (let y = position[1]; y < position[1] + size[1]; y++) {
    for (let x = position[0]; x < position[0] + size[0]; x++) {
      const pixelStart = (x + y * imageData.width) * 4;
      const alphaValue = imageData.data[pixelStart + 3];
      if (alphaValue > 0) {
        return false;
      }
    }
  }

  return true;
}

export type SpriteData = {
  length: number;
  [index: number]: number;
};
