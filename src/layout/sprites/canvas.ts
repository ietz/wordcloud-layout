import { Word } from '../../config/model';
import { TextMeasurement } from './measure';
import { Placement } from './pack';

export const BLOCK_SIZE = 32;

export const drawTexts = (ctx: CanvasRenderingContext2D, data: Word[], measurements: TextMeasurement[], placements: Placement[]) => {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    const measurement = measurements[i];
    const placement = placements[i];

    ctx.font = measurement.font;

    ctx.translate(placement.x + measurement.boxWidth / 2, placement.y + measurement.boxHeight / 2);
    ctx.rotate(datum.rotation ?? 0);
    ctx.translate(measurement.offsetLeft - measurement.textWidth / 2, -measurement.offsetBottom + measurement.textHeight / 2);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

    ctx.resetTransform();
  }
}

export const readSprites = (ctx: CanvasRenderingContext2D, measurements: TextMeasurement[], placements: Placement[]): Sprite[] => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const sprites: Sprite[] = [];

  for (let i = 0; i < measurements.length; i++) {
    const sprite: Sprite = [];
    sprites.push(sprite);

    const yEnd = placements[i].y + measurements[i].boxHeight;
    const xEnd = placements[i].x + measurements[i].boxWidth;
    for (let y = placements[i].y; y < yEnd; y++) {
      for (let blockX = placements[i].x; blockX < xEnd; blockX += BLOCK_SIZE) {
        let block = 0;
        for (let blockPixelIndex = 0; blockPixelIndex < BLOCK_SIZE && blockX + blockPixelIndex < xEnd; blockPixelIndex++) {
          const pixelIndex = y * imageData.width + blockX + blockPixelIndex;
          const pixelAlpha = imageData.data[pixelIndex * 4 + 3];
          if (pixelAlpha > 0) {
            block |= 1 << (BLOCK_SIZE - blockPixelIndex);
          }
        }

        sprite.push(block);
      }
    }
  }

  return sprites;
}

export type Sprite = number[];
