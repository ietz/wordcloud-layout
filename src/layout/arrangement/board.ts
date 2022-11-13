import { Size } from '../../config/model';
import { BLOCK_SIZE } from '../../util';
import { Sprite } from '../sprites';
import { getSpriteBlockWidth } from '../sprites/compute';

export interface Board {
  data: number[];
  width: number;
  blockWidth: number;
}

export const buildBoard = (size: Size): Board => {
  const blockWidth = Math.ceil(size[0] / BLOCK_SIZE);

  return {
    blockWidth,
    width: size[0],
    data: Array.from({length: blockWidth * size[1]}, () => 0)
  }
}

export const intersects = (board: Board, alignedSprite: Sprite, startBlockX: number, startY: number) => {
  for (const {boardBlockIndex, spriteBlockIndex} of spriteBoardPositions(board, alignedSprite, startBlockX, startY)) {
    const blockCollisions = boardBlockIndex === undefined
      ? alignedSprite.data[spriteBlockIndex]  // sprite block exends beyond the board => every pixel is a collision
      : alignedSprite.data[spriteBlockIndex] & board.data[boardBlockIndex];

    if (blockCollisions !== 0) {
      return true;
    }
  }

  return false;
}

export const place = (board: Board, alignedSprite: Sprite, startBlockX: number, startY: number) => {
  for (const {boardBlockIndex, spriteBlockIndex} of spriteBoardPositions(board, alignedSprite, startBlockX, startY)) {
    if (boardBlockIndex !== undefined) {
      board.data[boardBlockIndex] |= alignedSprite.data[spriteBlockIndex];
    }
  }
}

function* spriteBoardPositions(board: Board, alignedSprite: Sprite, startBlockX: number, startY: number) {
  const boardHeight = board.data.length / board.blockWidth;
  const spriteBlockWidth = getSpriteBlockWidth(alignedSprite);

  for (let spriteY = 0; spriteY < alignedSprite.size[1]; spriteY++) {
    for (let spriteBlockX = 0; spriteBlockX < spriteBlockWidth; spriteBlockX++) {
      const boardY = startY + spriteY;
      const boardBlockX = startBlockX + spriteBlockX;

      const isValidBoardPosition = 0 <= boardY && boardY < boardHeight && 0 <= boardBlockX && boardBlockX < board.blockWidth

      yield {
        boardBlockIndex: isValidBoardPosition ? boardY * board.blockWidth + boardBlockX : undefined,
        spriteBlockIndex: spriteY * spriteBlockWidth + spriteBlockX,
      }
    }
  }
}
