import { BLOCK_SIZE, isBlockPixelOccupied } from '../../util';
import { Board } from './board';

export const showBoard = (board: Board) => {
  const canvas = document.createElement('canvas');
  canvas.width = board.width;
  canvas.height = board.data.length / board.blockWidth;

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';

  canvas.getContext('2d')!.putImageData(toImageData(board), 0, 0);

  document.querySelector('#app')!.appendChild(canvas);
}

const toImageData = (board: Board): ImageData => {
  const height = board.data.length / board.blockWidth;
  let count = 0;

  const data = new Uint8ClampedArray(board.width * height * 4);
  for (let blockIndex = 0; blockIndex < board.data.length; blockIndex++) {
    const y = Math.floor(blockIndex / board.blockWidth);
    const blockStartX = (blockIndex % board.blockWidth) * BLOCK_SIZE;
    const validBlockSize = Math.min(BLOCK_SIZE, board.width - blockStartX);
    for (let blockPixel = 0; blockPixel < validBlockSize; blockPixel++) {
      if (isBlockPixelOccupied(board.data[blockIndex], blockPixel)) {
        const x = blockStartX + blockPixel;
        const k = (x + y * board.width) * 4;

        count += 1;

        data[k] = 255; // red channel
        data[k + 3] = 255; // alpha channel
      }
    }
  }

  return new ImageData(data, board.width);
}
