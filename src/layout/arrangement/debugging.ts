import { BLOCK_SIZE, isBlockPixelOccupied, range } from '../../util';
import { Board } from './board';
import { WordcloudConfig } from '../../config/model';

export const showBoard = (board: Board, config: WordcloudConfig) => {
  const canvas = document.createElement('canvas');
  canvas.width = board.size[0];
  canvas.height = board.size[1];

  const scale = 1 / Math.max(...range(2).map(dim => board.size[dim] / config.size[dim]));
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  canvas.style.width = `${board.size[0]*scale}px`;
  canvas.style.height = `${board.size[1]*scale}px`;

  canvas.getContext('2d')!.putImageData(toImageData(board), 0, 0);

  document.querySelector('#app')!.appendChild(canvas);
}

const toImageData = (board: Board): ImageData => {
  let count = 0;

  const data = new Uint8ClampedArray(board.size[0] * board.size[1] * 4);
  for (let blockIndex = 0; blockIndex < board.data.length; blockIndex++) {
    const y = Math.floor(blockIndex / board.blockWidth);
    const blockStartX = (blockIndex % board.blockWidth) * BLOCK_SIZE;
    const validBlockSize = Math.min(BLOCK_SIZE, board.size[0] - blockStartX);
    for (let blockPixel = 0; blockPixel < validBlockSize; blockPixel++) {
      if (isBlockPixelOccupied(board.data[blockIndex], blockPixel)) {
        const x = blockStartX + blockPixel;
        const k = (x + y * board.size[0]) * 4;

        count += 1;

        data[k] = 255; // red channel
        data[k + 3] = 255; // alpha channel
      }
    }
  }

  return new ImageData(data, board.size[0]);
}
