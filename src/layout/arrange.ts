import { rightShiftSprite, Sprite } from './sprites';
import { WordcloudConfig } from '../config/model';
import { BLOCK_SIZE, isBlockPixelOccupied, range } from '../util';
import { Position } from '../common';
import { getSpriteBlockWidth } from './sprites/compute';

export const arrange = (config: WordcloudConfig, sprites: Sprite[]): (Position | undefined)[] => {
  const blockWidth = Math.ceil(config.size[0] / BLOCK_SIZE);
  const board: Board = {
    data: Array.from({length: blockWidth * config.size[1]}, () => 0),
    width: config.size[0],
    blockWidth,
  };

  const areas = sprites.map(sprite => sprite.size.width * sprite.size.height);
  const order = range(sprites.length).sort((a, b) => areas[b] - areas[a]);

  const positions: (Position | undefined)[] = Array.from({length: sprites.length}, () => undefined);
  for (const i of order) {
    for (let trial = 0; trial < 30; trial++) {
      const candidatePosition = suggestPosition({width: config.size[0], height: config.size[1]});
      if (intersects(board, sprites[i], candidatePosition)) {
        continue;
      }

      place(board, sprites[i], candidatePosition);
      positions[i] = candidatePosition;
      break;
    }
  }

  showBoard(board);

  return positions;
}

const suggestPosition = (size: {width: number, height: number}): Position => {
  return {
    x: Math.floor(Math.random() * size.width),
    y: Math.floor(Math.random() * size.height)
  }
}

const intersects = (board: Board, sprite: Sprite, position: Position): boolean => {
  if (board.width < position.x + sprite.size.width) {
    return true;
  } else if (board.data.length / board.blockWidth < position.y + sprite.size.height) {
    return true;
  } else {
    return false;
  }
}

const place = (board: Board, sprite: Sprite, textPosition: Position) => {
  // Position the sprite such that the text ends up at the textPosition indicated by the textPosition parameter, not
  // just the upper left corner of the sprite.

  const spritePosition: Position = {
    x: Math.round(textPosition.x - sprite.textBaselineOffset.left),
    y: Math.round(textPosition.y - sprite.textBaselineOffset.bottom),
  }

  const startBlockX = Math.floor(spritePosition.x / BLOCK_SIZE);
  const spriteOffset = spritePosition.x - startBlockX * BLOCK_SIZE;
  const alignedSprite = rightShiftSprite(sprite, spriteOffset);
  const alignedSpriteBlockWidth = getSpriteBlockWidth(alignedSprite);

  for (let spriteY = 0; spriteY < alignedSprite.size.height; spriteY++) {

    for (let spriteBlockX = 0; spriteBlockX < alignedSpriteBlockWidth; spriteBlockX++) {
      const boardBlockIndex = (spritePosition.y + spriteY) * board.blockWidth + startBlockX + spriteBlockX;
      const spriteBlockIndex = spriteY * alignedSpriteBlockWidth + spriteBlockX;

      board.data[boardBlockIndex] |= alignedSprite.data[spriteBlockIndex];
    }
  }
}


const showBoard = (board: Board) => {
  const canvas = document.createElement('canvas');
  canvas.width = board.width;
  canvas.height = board.data.length / board.blockWidth;

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';

  canvas.getContext('2d')!.putImageData(toImageData(board), 0, 0);

  document.querySelector('#app')!.appendChild(canvas);
}

const toImageData = (board: Board): ImageData => {
  const height = board.data.length / board.blockWidth;
  let count = 0;

  const data = new Uint8ClampedArray(board.width * height * 4);
  for (let blockIndex = 0; blockIndex < board.data.length; blockIndex++) {
    const y = Math.floor(blockIndex / board.blockWidth);
    const blockStartX = (blockIndex % board.blockWidth) * BLOCK_SIZE;
    const validBlockSize = Math.min(BLOCK_SIZE, board.width - blockStartX);
    for (let blockPixel = 0; blockPixel < validBlockSize; blockPixel++) {
      if (isBlockPixelOccupied(board.data[blockIndex], blockPixel)) {
        const x = blockStartX + blockPixel;
        const k = (x + y * board.width) * 4;

        count += 1;

        data[k] = 255; // red channel
        data[k + 3] = 255; // alpha channel
      }
    }
  }

  return new ImageData(data, board.width);
}

interface Board {
  data: number[];
  width: number;
  blockWidth: number;
}
