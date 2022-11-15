import { getFontString, Word } from '../../config';

export const measureText = (ctx: CanvasRenderingContext2D, word: Word<unknown>): TextMeasurement => {
  ctx.font = getFontString(word);
  const metrics = ctx.measureText(word.text);

  // Find the size of the text bounding box.
  // Using the actual[…] metrics allows us to arrange.ts a more compact sprite map than would be possible otherwise.
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  // Compute the size of the bounding box required for the rotated text
  const rotation = word.rotation;
  const sin = Math.abs(Math.sin(rotation));
  const cos = Math.abs(Math.cos(rotation));
  const paddedTextWidth = textWidth + 2 * word.padding;
  const paddedTextHeight = textHeight + 2 * word.padding;
  const boxHeight = Math.ceil(paddedTextWidth * sin + paddedTextHeight * cos);
  const boxWidth = Math.ceil(paddedTextWidth * cos + paddedTextHeight * sin);

  // Determine where to position the text in the sprite map canvas such that is centered inside the computed bounding box.
  const textLeftFromBoundingBoxCenterOffset = textWidth / 2 - metrics.actualBoundingBoxLeft;
  const textBottomFromBoundingBoxCenterOffset = textHeight / 2 - metrics.actualBoundingBoxDescent;
  const textPositionFromBoundingBoxCenterDistance = Math.sqrt(Math.pow(textBottomFromBoundingBoxCenterOffset, 2) + Math.pow(textLeftFromBoundingBoxCenterOffset, 2))
  const textPositionFromBoundingBoxCenterAngle = rotation - Math.atan((textBottomFromBoundingBoxCenterOffset) / (textLeftFromBoundingBoxCenterOffset));

  const textX = boxWidth / 2 - textPositionFromBoundingBoxCenterDistance * Math.cos(textPositionFromBoundingBoxCenterAngle)
  const textY = boxHeight / 2 - textPositionFromBoundingBoxCenterDistance * Math.sin(textPositionFromBoundingBoxCenterAngle)

  return {
    textX,
    textY,
    boxWidth,
    boxHeight,
    area: paddedTextWidth * paddedTextHeight,
  };
}

export interface TextMeasurement {
  textX: number,
  textY: number,
  boxWidth: number,
  boxHeight: number,
  area: number,
}
