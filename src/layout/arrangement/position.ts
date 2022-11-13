import { Size } from '../../config/model';
import { Position } from '../../common';
import { Sprite } from '../sprites';

export function* suggestPositions({boardSize, sprite}: {boardSize: Size, sprite: Sprite}) {
  const center = {x: 0.5 * boardSize[0], y: 0.5 * boardSize[1]};

  const xStretchFactor = boardSize[0] / boardSize[1];
  const maxSpiralDistanceFromCenter = Math.max(
    center.x * xStretchFactor,  // to left border
    (boardSize[0] - center.x) * xStretchFactor,  // to right border
    center.y, // to top
    boardSize[1] - center.y, // to bottom
  )

  for (let spiralDistanceFromCenter = 0; spiralDistanceFromCenter < maxSpiralDistanceFromCenter; spiralDistanceFromCenter += 0.1) {
    yield textPositionFromCenter({
      x: center.x + xStretchFactor * spiralDistanceFromCenter * Math.cos(spiralDistanceFromCenter),
      y: center.y + spiralDistanceFromCenter * Math.sin(spiralDistanceFromCenter),
    }, sprite)
  }
}

const textPositionFromCenter = (center: Position, sprite: Sprite): Position => {
  return {
    x: center.x - sprite.size[0] / 2 + sprite.textBaselineOffset.x,
    y: center.y - sprite.size[1] / 2 + sprite.textBaselineOffset.y,
  }
}

export const alignPosition = (suggestedTextPosition: Position, sprite: Sprite): {textPosition: Position, spritePosition: Position} => {
  // The sprite can only be placed at integer grid positions such as [10, 15] but not at [10.2, 15.7].
  // This function shifts the suggested text position slightly such that the sprite can be placed at an integer grid position.
  //
  // Example: If the suggestedTextPosition is [100, 100] and the sprite has a textBaselineOffset of {x: 0.2, y: 25.7}
  // the resulting spritePosition would be [100, 74] and the textPosition [100.2, 99.7].
  // If we insert the sprite at [100, 74], the text in the sprite would appear at [100+0.2=100.2, 74+25.7=99.7].

  const spritePosition: Position = {
    x: Math.round(suggestedTextPosition.x - sprite.textBaselineOffset.x),
    y: Math.round(suggestedTextPosition.y - sprite.textBaselineOffset.y),
  }

  const textPosition: Position = {
    x: spritePosition.x + sprite.textBaselineOffset.x,
    y: spritePosition.y + sprite.textBaselineOffset.y,
  }

  return {textPosition, spritePosition};
}
