import { Word } from '../../config/model';
import { TextMeasurement } from './measure';
import { Position } from '../../common';
import { BLOCK_SIZE } from '../../util';

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

export const readSpriteData = (ctx: CanvasRenderingContext2D, measurements: TextMeasurement[], positions: Position[]): SpriteData[] => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const sprites: SpriteData[] = [];

  for (let i = 0; i < measurements.length; i++) {
    const sprite: SpriteData = [];
    sprites.push(sprite);

    const yEnd = positions[i].y + measurements[i].boxHeight;
    const xEnd = positions[i].x + measurements[i].boxWidth;
    for (let y = positions[i].y; y < yEnd; y++) {
      for (let blockX = positions[i].x; blockX < xEnd; blockX += BLOCK_SIZE) {
        let block = 0;
        for (let blockPixelIndex = 0; blockPixelIndex < BLOCK_SIZE && blockX + blockPixelIndex < xEnd; blockPixelIndex++) {
          const pixelIndex = y * imageData.width + blockX + blockPixelIndex;
          const pixelAlpha = imageData.data[pixelIndex * 4 + 3];
          if (pixelAlpha > 0) {
            block |= 1 << (BLOCK_SIZE - 1 - blockPixelIndex);
          }
        }

        sprite.push(block);
      }
    }
  }

  return sprites;
}

export type SpriteData = number[];
