import { getSpriteBlockWidth, Sprite } from './compute';
import { BLOCK_SIZE, range } from '../../util';
import { SpriteData } from './canvas';

export const rightShiftSprite = (sprite: Sprite, offset: number): Sprite => {
  if (offset < 0) {
    throw Error('Tried to shift a sprite to the left');
  } else if (offset >= BLOCK_SIZE) {
    throw Error('Tried to shift sprite a complete block or more');
  }

  if (offset === 0) {
    return sprite;
  }

  const blockWidth = getSpriteBlockWidth(sprite);
  const availableSpace = blockWidth * BLOCK_SIZE - sprite.size[0];
  const outputBlockWidth = offset <= availableSpace ? blockWidth : blockWidth + 1;

  function* dataGenerator() {
    for (const y of range(sprite.size[1])) {
      for (const x of range(outputBlockWidth)) {
        const originalIndex = y * blockWidth + x;
        const left = x > 0 ? sprite.data[originalIndex - 1] << (BLOCK_SIZE - offset) : 0;
        const current = x < blockWidth ? rightShiftBlock(sprite.data[originalIndex], offset) : 0;
        yield left | current;
      }
    }
  }

  const gen = dataGenerator();

  const lazyData: SpriteData = new Proxy([] as number[], {
    get(target, property) {
      if (property === 'length') {
        return sprite.size[1] * outputBlockWidth;
      }

      while (!(property in target)) {
        const next = gen.next();
        if (next.done) {
          throw Error('Exhausted generator');
        }

        target.push(next.value);
      }

      return target[property as any];
    }
  })

  return {
    size: [
      sprite.size[0] + offset,
      sprite.size[1],
    ],
    textBaselineOffset: {
      x: sprite.textBaselineOffset.x - offset,
      y: sprite.textBaselineOffset.y,
    },
    data: lazyData,
  }
}

const rightShiftBlock = (block: number, offset: number): number => {
  if (offset === 0) {
    return offset;
  } else if (block >= 0) {
    return block >> offset;
  } else {
    // The block number is negative, meaning that the left-most bit is set.
    // If we right-shift the number, it will be padded with 1s instead of 0s which results in an invalid result
    // To prevent this, we right shift the number by 1 first, remove the left-most (padded) bit, yielding a positive number.
    // We can then shift the remaining bits as usual.
    return ((block >> 1) ^ (1 << 31)) >> (offset - 1);
  }
}
