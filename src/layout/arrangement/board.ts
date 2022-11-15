import { BLOCK_SIZE, fullArray, range } from '../../util';
import { rightShiftBlock, TextSprite } from '../sprites';
import { Sprite } from '../sprites/sprite';
import { SpriteData } from '../sprites/canvas';
import { Padding, Size } from '../../common';

export class Board extends Sprite {
  approximateOccupiedArea = 0;

  static empty = (size: Size): Board => {
    const blockWidth = Math.ceil(size[0] / BLOCK_SIZE);

    return new Board(
      fullArray(blockWidth * size[1], 0),
      size[0],
    )
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
    this.approximateOccupiedArea += alignedSprite.area;

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

  getPaddingForResize = (factor: number): Padding => {
    const [x, y] = this.size.map(value => Math.round(value * (factor - 1)));
    const [left, top] = [x, y].map(v => Math.floor(v / 2));
    return {top, bottom: y - top, left, right: x - left}
  }

  pad = (padding: Padding): Board => {
    const outputSize: Size = [
      this.size[0] + padding.left + padding.right,
      this.size[1] + padding.top + padding.bottom,
    ];
    const outputBlockWidth = Math.ceil(outputSize[0] / BLOCK_SIZE);

    const paddingBlocksLeft = Math.floor(padding.left / BLOCK_SIZE);
    const withinBlockPaddingLeft = padding.left % BLOCK_SIZE;

    const shiftedData = this.rightShiftData(withinBlockPaddingLeft);
    const shiftedBlockWidth = shiftedData.length / this.size[1];

    const outputData: number[] = [];
    for (let y = 0; y < outputSize[1]; y++) {
      for (let blockX = 0; blockX < outputBlockWidth; blockX++) {
        const shiftedBlockX = blockX - paddingBlocksLeft;
        const shiftedY = y - padding.top;

        if (shiftedBlockX >= 0 && shiftedY >= 0 && shiftedBlockX < shiftedBlockWidth && shiftedY < this.size[1]) {
          // is inside the area to be copied
          outputData.push(shiftedData[shiftedBlockX + shiftedY * shiftedBlockWidth])
        } else {
          // is in the zero-padding area
          outputData.push(0);
        }
      }
    }

    return new Board(outputData, outputSize[0]);
  }

  rightShiftData = (offset: number): SpriteData => {
    if (offset < 0) {
      throw Error('Tried to shift the board to the left');
    } else if (offset >= BLOCK_SIZE) {
      throw Error('Tried to shift board a complete block or more');
    }

    if (offset === 0) {
      return this.data;
    }

    const availableSpace = this.blockWidth * BLOCK_SIZE - this.size[0];
    const outputBlockWidth = offset <= availableSpace ? this.blockWidth : this.blockWidth + 1;

    const data: number[] = [];
    for (const y of range(this.size[1])) {
      for (const x of range(outputBlockWidth)) {
        const originalIndex = y * this.blockWidth + x;
        const left = x > 0 ? this.data[originalIndex - 1] << (BLOCK_SIZE - offset) : 0;
        const current = x < this.blockWidth ? rightShiftBlock(this.data[originalIndex], offset) : 0;
        data.push(left | current);
      }
    }

    return data;
  }
}
