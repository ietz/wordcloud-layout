import { Size, WordcloudConfig } from '../../config/model';
import { TextSprite } from '../sprites';
import { Position } from '../../common';
import { BLOCK_SIZE, fullArray, range } from '../../util';
import { Board } from './board';
import { alignPosition, suggestPositions } from './position';
import { showBoard } from './debugging';

export const arrange = (config: WordcloudConfig, sprites: TextSprite[]): (Position | undefined)[] => {
  let board = Board.empty(config.size);

  const areas = sprites.map(sprite => sprite.size[0] * sprite.size[1]);
  const order = range(sprites.length).sort((a, b) => areas[b] - areas[a]);

  const positions = fullArray<Position | undefined>(sprites.length, undefined);
  for (const i of order) {
    const sprite = sprites[i];
    const word = config.data[i];

    positions[i] = placeSprite(board, sprite);

    if (word.required) {
      for (let extensionTrials = 5; positions[i] === undefined && extensionTrials > 0; extensionTrials--) {
        board = board.extend(1.2);
        positions[i] = placeSprite(board, sprite);
      }

      if (positions[i] === undefined) {
        console.warn('Could not place word after extending the board');
      }
    }
  }

  showBoard(board);

  return positions;
}

const placeSprite = (board: Board, sprite: TextSprite): Position | undefined => {
  for (const suggestedTextPosition of suggestPositions({boardSize: board.size, sprite})) {
    const {textPosition, spritePosition} = alignPosition(suggestedTextPosition, sprite);

    if (!isInsideBoard(board.size, sprite.size, spritePosition)) {
      continue;
    }

    const startBlockX = Math.floor(spritePosition.x / BLOCK_SIZE);
    const alignedSprite = sprite.rightShift(spritePosition.x - startBlockX * BLOCK_SIZE);

    if (board.intersects(alignedSprite, startBlockX, spritePosition.y)) {
      continue;
    }

    board.place(alignedSprite, startBlockX, spritePosition.y);
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
