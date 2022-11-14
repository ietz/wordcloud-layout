import { Size, WordcloudConfig } from '../../config/model';
import { TextSprite } from '../sprites';
import { LayoutResult, Position, RenderWord } from '../../common';
import { BLOCK_SIZE, range } from '../../util';
import { Board } from './board';
import { alignPosition, suggestPositions } from './position';
import { showBoard } from './debugging';

export const arrange = (config: WordcloudConfig, words: RenderWord[], sprites: TextSprite[]): LayoutResult => {
  let board = Board.empty(getInitialBoardSize(config, words, sprites));

  const order = range(sprites.length).sort((a, b) => sprites[b].area - sprites[a].area);

  let positions = new Map<number, Position>();
  const setPosition = (i: number, value: Position | undefined) => value !== undefined && positions.set(i, value);
  for (const i of order) {
    const sprite = sprites[i];
    const word = words[i];

    setPosition(i, placeSprite(board, sprite))

    if (word.required) {
      for (let extensionTrials = 5; !positions.has(i) && extensionTrials > 0; extensionTrials--) {
        const padding = board.getPaddingForResize(1.2);
        board = board.pad(padding);
        positions = new Map(Array.from(positions.entries()).map(([i, position]) =>
          [i, {x: position.x + padding.left, y: position.y + padding.top}]
        ));
        setPosition(i, placeSprite(board, sprite));
      }

      if (!positions.has(i)) {
        console.warn('Could not place word after extending the board');
      }
    }
  }

  showBoard(board, config);

  return {
    scale: Math.min(...range(2).map(dim => config.size[dim] / board.size[dim])),
    words: Array.from(positions.entries())
      .map(([i, position]) => ({...words[i], position: position}))
  }
}

const getInitialBoardSize = (config: WordcloudConfig, words: RenderWord[], sprites: TextSprite[]): Size => {
  const factor = Math.max(
    ...range(2).map(dim => {
      const maxSpriteExtent = Math.max(
        ...range(words.length)
          .filter(i => words[i].required)
          .map(i => sprites[i].size[dim])
      );
      return Math.max(1, 1.2 * maxSpriteExtent / config.size[dim]);
    })
  )

  return [Math.ceil(config.size[0] * factor), Math.ceil(config.size[1] * factor)];
}

const placeSprite = (board: Board, sprite: TextSprite): Position | undefined => {
  for (const suggestedTextPosition of suggestPositions({boardSize: board.size, sprite})) {
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
