
export const BLOCK_SIZE = 32;

export const range = (end: number) => Array.from({length: end}, (_, i) => i);

export const isBlockPixelOccupied = (block: number, pixel: number) =>
  (block & (1 << (BLOCK_SIZE - pixel - 1))) !== 0;
