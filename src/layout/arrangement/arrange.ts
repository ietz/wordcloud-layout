import { WordcloudConfig } from '../../config/model';
import { rightShiftSprite, Sprite } from '../sprites';
import { Position } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { buildBoard, intersects, place } from './board';
import { alignPosition, suggestPosition } from './position';
import { showBoard } from './debugging';

export const arrange = (config: WordcloudConfig, sprites: Sprite[]): (Position | undefined)[] => {
  const board = buildBoard(config.size);

  const areas = sprites.map(sprite => sprite.size[0] * sprite.size[1]);
  const order = range(sprites.length).sort((a, b) => areas[b] - areas[a]);

  const positions: (Position | undefined)[] = Array.from({length: sprites.length}, () => undefined);
  for (const i of order) {
    for (let trial = 0; trial < 30; trial++) {
      const suggestedTextPosition = suggestPosition(config.size);
      const {textPosition, spritePosition} = alignPosition(suggestedTextPosition, sprites[i]);

      const startBlockX = Math.floor(spritePosition.x / BLOCK_SIZE);
      const alignedSprite = rightShiftSprite(sprites[i], spritePosition.x - startBlockX * BLOCK_SIZE);

      if (intersects(board, alignedSprite, startBlockX, spritePosition.y)) {
        continue;
      }

      place(board, alignedSprite, startBlockX, spritePosition.y);
      positions[i] = textPosition;

      break;
    }
  }

  showBoard(board);

  return positions;
}
