import { Size } from '../../config/model';
import { BLOCK_SIZE, fullArray } from '../../util';
import { TextSprite } from '../sprites';
import { Sprite } from '../sprites/textSprite';

export class Board extends Sprite {
  static empty = (size: Size): Board => {
    const blockWidth = Math.ceil(size[0] / BLOCK_SIZE);

    return new Board(
      fullArray(blockWidth * size[1], 0),
      size[0],
    )
  }

  extend = (factor: number): Board => {
    return this;
  }

  intersects = (alignedSprite: TextSprite, startBlockX: number, startY: number) => {
    for (const {boardBlockIndex, spriteBlockIndex} of this.spriteBoardPositions(alignedSprite, startBlockX, startY)) {
      const blockCollisions = boardBlockIndex === undefined
        ? alignedSprite.data[spriteBlockIndex]  // sprite block exends beyond the board => every pixel is a collision
        : alignedSprite.data[spriteBlockIndex] & this.data[boardBlockIndex];

      if (blockCollisions !== 0) {
        return true;
      }
    }

    return false;
  }

  place = (alignedSprite: TextSprite, startBlockX: number, startY: number) => {
    for (const {boardBlockIndex, spriteBlockIndex} of this.spriteBoardPositions(alignedSprite, startBlockX, startY)) {
      if (boardBlockIndex !== undefined) {
        this.data[boardBlockIndex] |= alignedSprite.data[spriteBlockIndex];
      }
    }
  }

  spriteBoardPositions = (alignedSprite: TextSprite, startBlockX: number, startY: number) => {
    const board = this;

    return {
      [Symbol.iterator]: () => {
        function* generator() {
          for (let spriteY = 0; spriteY < alignedSprite.size[1]; spriteY++) {
            for (let spriteBlockX = 0; spriteBlockX < alignedSprite.blockWidth; spriteBlockX++) {
              const boardY = startY + spriteY;
              const boardBlockX = startBlockX + spriteBlockX;

              const isValidBoardPosition = 0 <= boardY && boardY < board.size[1] && 0 <= boardBlockX && boardBlockX < board.blockWidth

              yield {
                boardBlockIndex: isValidBoardPosition ? boardY * board.blockWidth + boardBlockX : undefined,
                spriteBlockIndex: spriteY * alignedSprite.blockWidth + spriteBlockX,
              }
            }
          }
        }
        return generator();
      }
    }
  }
}
