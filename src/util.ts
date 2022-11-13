
export const BLOCK_SIZE = 32;

export const range = (end: number) => Array.from({length: end}, (_, i) => i);

export const fullArray = <T>(length: number, value: T) => {
    const array = new Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = value;
    }
    return array;
}

export const isBlockPixelOccupied = (block: number, pixel: number) =>
  (block & (1 << (BLOCK_SIZE - pixel - 1))) !== 0;
