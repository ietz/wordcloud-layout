import { Size, Word } from '../../config/model';
import { TextMeasurement } from './measure';
import { Padding, Position } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { TextSprite } from './textSprite';

export const drawTexts = (ctx: CanvasRenderingContext2D, data: Word[], measurements: TextMeasurement[], positions: Position[]) => {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    const measurement = measurements[i];
    const position = positions[i];

    ctx.font = measurement.font;

    ctx.translate(position.x + measurement.textX, position.y + measurement.textY);
    ctx.rotate(datum.rotation ?? 0);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

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

    const yEnd = position.y + measurement.boxHeight - crop.bottom;
    const xEnd = position.x + measurement.boxWidth - crop.right;
    for (let y = position.y + crop.top; y < yEnd; y++) {
      for (let blockX = position.x + crop.left; blockX < xEnd; blockX += BLOCK_SIZE) {
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
      }
    ));
  }

  return sprites;
}

const cropSpriteMapBounds = (imageData: ImageData, measurement: TextMeasurement, position: Position): Padding => {
  const isRowEmpty = (y: number) => isImageDataAreaEmpty(
    imageData,
    {x: position.x, y},
    [measurement.boxWidth, 1],
  )

  const cropTop = range(measurement.boxHeight).find(topRow => !isRowEmpty(position.y + topRow));
  if (cropTop === undefined) {
    console.warn('Sprite area is empty');
    return {top: 0, bottom: measurement.boxHeight, left: 0, right: measurement.boxWidth};
  }

  const cropBottom = range(measurement.boxHeight).find(bottomRow => !isRowEmpty(position.y + measurement.boxHeight - 1 - bottomRow))!;

  const isColumnEmpty = (x: number) => isImageDataAreaEmpty(
    imageData,
    {x, y: position.y + cropTop},
    [1, measurement.boxHeight - cropTop - cropBottom],
  );

  const cropLeft = range(measurement.boxWidth).find(leftColumn => !isColumnEmpty(position.x + leftColumn))!;
  const cropRight = range(measurement.boxWidth).find(rightColumn => !isColumnEmpty(position.x + measurement.boxWidth - 1 - rightColumn))!;

  return {top: cropTop, bottom: cropBottom, left: cropLeft, right: cropRight};
}

const isImageDataAreaEmpty = (imageData: ImageData, position: Position, size: Size) => {
  for (let y = position.y; y < position.y + size[1]; y++) {
    for (let x = position.x; x < position.x + size[0]; x++) {
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
