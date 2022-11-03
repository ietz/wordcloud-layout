import { Sprite } from './sprites';
import { WordcloudConfig } from '../config/model';
import { BLOCK_SIZE } from './sprites/canvas';
import { range } from '../util';
import { Position } from '../common';

export const arrange = (config: WordcloudConfig, sprites: Sprite[]): (Position | undefined)[] => {
  const blockWidth = Math.floor(config.size[0] / BLOCK_SIZE);
  const board: Board = {
    data: Array.from({length: blockWidth * config.size[1]}, () => 0),
    width: config.size[0],
    blockWidth: blockWidth,
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

  return positions;
}

const suggestPosition = (size: {width: number, height: number}): Position => {
  return {
    x: Math.floor(Math.random() * size.width),
    y: Math.floor(Math.random() * size.height)
  }
}

const intersects = (board: Board, sprite: Sprite, position: Position): boolean => {
  return false;
}

const place = (board: Board, sprite: Sprite, position: Position) => {
  return;
  if (position.x % BLOCK_SIZE !== 0) {
    throw Error('The sprite position should be pre-aligned with the block size')
  }
}

interface Board {
  data: number[];
  width: number;
  blockWidth: number;
}
