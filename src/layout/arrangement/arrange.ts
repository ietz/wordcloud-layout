import { Size, WordcloudConfig } from '../../config/model';
import { rightShiftSprite, Sprite } from '../sprites';
import { Position } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { Board, buildBoard, intersects, place } from './board';
import { alignPosition, suggestPositions } from './position';
import { showBoard } from './debugging';

export const arrange = (config: WordcloudConfig, sprites: Sprite[]): (Position | undefined)[] => {
  const board = buildBoard(config.size);

  const areas = sprites.map(sprite => sprite.size[0] * sprite.size[1]);
  const order = range(sprites.length).sort((a, b) => areas[b] - areas[a]);

  const positions: (Position | undefined)[] = Array.from({length: sprites.length}, () => undefined);
  for (const i of order) {
    positions[i] = placeSprite(board, sprites[i]);
  }

  showBoard(board);

  return positions;
}

const placeSprite = (board: Board, sprite: Sprite): Position | undefined => {
  const boardSize: Size = [board.width, board.data.length / board.blockWidth];

  for (const suggestedTextPosition of suggestPositions({boardSize, sprite})) {
    const {textPosition, spritePosition} = alignPosition(suggestedTextPosition, sprite);

    if (!isInsideBoard(boardSize, sprite.size, spritePosition)) {
      continue;
    }

    const startBlockX = Math.floor(spritePosition.x / BLOCK_SIZE);
    const alignedSprite = rightShiftSprite(sprite, spritePosition.x - startBlockX * BLOCK_SIZE);

    if (intersects(board, alignedSprite, startBlockX, spritePosition.y)) {
      continue;
    }

    place(board, alignedSprite, startBlockX, spritePosition.y);
    return textPosition;
  }
};

export const isInsideBoard = (boardSize: Size, spriteSize: Size, spritePosition: Position) => {
  return (
      spritePosition.x >= 0 &&
      spritePosition.y >= 0 &&
      spritePosition.x + spriteSize[0] <= boardSize[0] &&
      spritePosition.y + spriteSize[1] <= boardSize[1]
  )
}
