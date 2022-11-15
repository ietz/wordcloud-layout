import { Size, WordcloudConfig } from '../../config/model';
import { TextSprite } from '../sprites';
import { LayoutResult, Position } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { Board } from './board';
import { alignPosition, suggestPositions } from './position';
import seedrandom from 'seedrandom';

export const arrange = <T>(config: WordcloudConfig<T>, sprites: TextSprite[]): LayoutResult<T> => {
  let board = Board.empty(getInitialBoardSize(config, sprites));
  const rng = seedrandom(config.seed);

  const order = range(sprites.length).sort((a, b) => sprites[b].area - sprites[a].area);

  let positions = new Map<number, Position>();
  const setPosition = (i: number, value: Position | undefined) => value !== undefined && positions.set(i, value);
  for (const i of order) {
    const sprite = sprites[i];
    const word = config.words[i];

    setPosition(i, placeSprite(board, sprite, rng));

    if (word.required) {
      for (let extensionTrials = 10; !positions.has(i) && extensionTrials > 0; extensionTrials--) {
        const padding = board.getPaddingForResize(1.2);
        board = board.pad(padding);
        positions = new Map(Array.from(positions.entries()).map(([i, position]) =>
          [i, {x: position.x + padding.left, y: position.y + padding.top}]
        ));
        setPosition(i, placeSprite(board, sprite, rng));
      }

      if (!positions.has(i)) {
        console.warn('Could not place word after extending the board');
      }
    }
  }

  // showBoard(board, config);

  return {
    scale: Math.min(...range(2).map(dim => config.size[dim] / board.size[dim])),
    words: Array.from(positions.entries())
      .map(([i, position]) => ({...config.words[i], position: position}))
  }
}

const getInitialBoardSize = (config: WordcloudConfig, sprites: TextSprite[]): Size => {
  const factor = Math.max(
    ...range(2).map(dim => {
      const maxSpriteExtent = Math.max(
        ...range(config.words.length)
          .filter(i => config.words[i].required)
          .map(i => sprites[i].size[dim])
      );
      return Math.max(1, 1.2 * maxSpriteExtent / config.size[dim]);
    })
  )

  return [Math.ceil(config.size[0] * factor), Math.ceil(config.size[1] * factor)];
}

const placeSprite = (board: Board, sprite: TextSprite, rng: seedrandom.PRNG): Position | undefined => {
  for (const suggestedTextPosition of suggestPositions({boardSize: board.size, occupiedBoardArea: board.approximateOccupiedArea, sprite, rng})) {
    const {textPosition, spritePosition} = alignPosition(suggestedTextPosition, sprite);

    if (!isInsideBoard(board.size, sprite.size, spritePosition)) {
      continue;
    }

    const startBlockX = Math.floor(spritePosition.x / BLOCK_SIZE);
    const alignedSprite = sprite.rightShift(spritePosition.x - startBlockX * BLOCK_SIZE);

    if (board.intersects(alignedSprite, startBlockX, spritePosition.y)) {
      continue;
    }

    board.place(alignedSprite, startBlockX, spritePosition.y);
    return textPosition;
  }
};

export const isInsideBoard = (boardSize: Size, spriteSize: Size, spritePosition: Position) => {
  return (
      spritePosition.x >= 0 &&
      spritePosition.y >= 0 &&
      spritePosition.x + spriteSize[0] <= boardSize[0] &&
      spritePosition.y + spriteSize[1] <= boardSize[1]
  )
}
