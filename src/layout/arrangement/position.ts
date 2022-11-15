import { Position, Size } from '../../common';
import { TextSprite } from '../sprites';
import seedrandom from 'seedrandom';

export function* suggestPositions({boardSize, sprite, occupiedBoardArea, rng}: {boardSize: Size, sprite: TextSprite, occupiedBoardArea: number, rng: seedrandom.PRNG}) {
  const boardFillRatio = occupiedBoardArea / boardSize[0] / boardSize[1];
  const randomCenterSize = Math.sqrt(boardFillRatio);

  const center: Position = [
    ((rng() - 0.5) * randomCenterSize + 0.5) * boardSize[0],
    ((rng() - 0.5) * randomCenterSize + 0.5) * boardSize[1],
  ];

  const xStretchFactor = boardSize[0] / boardSize[1];
  const maxSpiralDistanceFromCenter = Math.max(
    center[0] * xStretchFactor,  // to left border
    (boardSize[0] - center[0]) * xStretchFactor,  // to right border
    center[1], // to top
    boardSize[1] - center[1], // to bottom
  )

  const direction = rng() > 0.5 ? 1 : -1;

  for (let spiralDistanceFromCenter = 0; spiralDistanceFromCenter < maxSpiralDistanceFromCenter; spiralDistanceFromCenter += 0.1) {
    yield textPositionFromCenter([
      center[0] + direction * xStretchFactor * spiralDistanceFromCenter * Math.cos(spiralDistanceFromCenter),
      center[1] + spiralDistanceFromCenter * Math.sin(spiralDistanceFromCenter),
    ], sprite)
  }
}

const textPositionFromCenter = (center: Position, sprite: TextSprite): Position => {
  return [
    center[0] - sprite.size[0] / 2 + sprite.textBaselineOffset.x,
    center[1] - sprite.size[1] / 2 + sprite.textBaselineOffset.y,
  ]
}

export const alignPosition = (suggestedTextPosition: Position, sprite: TextSprite): {textPosition: Position, spritePosition: Position} => {
  // The sprite can only be placed at integer grid positions such as [10, 15] but not at [10.2, 15.7].
  // This function shifts the suggested text position slightly such that the sprite can be placed at an integer grid position.
  //
  // Example: If the suggestedTextPosition is [100, 100] and the sprite has a textBaselineOffset of {x: 0.2, y: 25.7}
  // the resulting spritePosition would be [100, 74] and the textPosition [100.2, 99.7].
  // If we insert the sprite at [100, 74], the text in the sprite would appear at [100+0.2=100.2, 74+25.7=99.7].

  const spritePosition: Position = [
    Math.round(suggestedTextPosition[0] - sprite.textBaselineOffset.x),
    Math.round(suggestedTextPosition[1] - sprite.textBaselineOffset.y),
  ]

  const textPosition: Position = [
    spritePosition[0] + sprite.textBaselineOffset.x,
    spritePosition[1] + sprite.textBaselineOffset.y,
  ]

  return {textPosition, spritePosition};
}
