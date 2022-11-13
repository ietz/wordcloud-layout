import { SpriteData } from "./canvas";
import { Size } from "../../config/model";
import { BLOCK_SIZE, range } from '../../util';

export class Sprite {
    size: Size;
    blockWidth: number;

    constructor(
        public data: SpriteData,
        width: number,
        public textBaselineOffset: {x: number, y: number},
    ) {
        const height = data.length / width;
        if (!Number.isInteger(height)) {
            throw Error('Sprite data is not evenly divisible into rows with the given width');
        }

        this.size = [width, height];
        this.blockWidth = data.length / height;
    }

    rightShift = (offset: number): Sprite => {
        const sprite = this;

        if (offset < 0) {
            throw Error('Tried to shift a sprite to the left');
        } else if (offset >= BLOCK_SIZE) {
            throw Error('Tried to shift sprite a complete block or more');
        }

        if (offset === 0) {
            return sprite;
        }

        const availableSpace = sprite.blockWidth * BLOCK_SIZE - sprite.size[0];
        const outputBlockWidth = offset <= availableSpace ? sprite.blockWidth : sprite.blockWidth + 1;

        function* dataGenerator() {
            for (const y of range(sprite.size[1])) {
                for (const x of range(outputBlockWidth)) {
                    const originalIndex = y * sprite.blockWidth + x;
                    const left = x > 0 ? sprite.data[originalIndex - 1] << (BLOCK_SIZE - offset) : 0;
                    const current = x < sprite.blockWidth ? rightShiftBlock(sprite.data[originalIndex], offset) : 0;
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

        return new Sprite(
          lazyData,
          sprite.size[0] + offset,
          {
              x: sprite.textBaselineOffset.x - offset,
              y: sprite.textBaselineOffset.y,
          }
        )
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
