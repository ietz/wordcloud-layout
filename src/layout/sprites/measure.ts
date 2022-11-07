import { Word, WordcloudConfig } from '../../config/model';

export const measureText = (ctx: CanvasRenderingContext2D, config: WordcloudConfig, datum: Word): TextMeasurement => {
  ctx.font = `${config.fontWeight} ${datum.size}px ${config.fontFamily}`;
  const metrics = ctx.measureText(datum.text);

  // Find the size of the text bounding box.
  // Using the actual[…] metrics allows us to build a more compact sprite map than would be possible otherwise.
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  // Compute the size of the bounding box required for the rotated text
  const rotation = datum.rotation ?? 0;
  const sin = Math.abs(Math.sin(rotation));
  const cos = Math.abs(Math.cos(rotation));
  const boxHeight = Math.ceil(textWidth * sin + textHeight * cos);
  const boxWidth = Math.ceil(textWidth * cos + textHeight * sin);

  // Determine where to position the text in the sprite map canvas such that is centered inside the computed bounding box.
  const textLeftFromBoundingBoxCenterOffset = textWidth / 2 - metrics.actualBoundingBoxLeft;
  const textBottomFromBoundingBoxCenterOffset = textHeight / 2 - metrics.actualBoundingBoxDescent;
  const textPositionFromBoundingBoxCenterDistance = Math.sqrt(Math.pow(textBottomFromBoundingBoxCenterOffset, 2) + Math.pow(textLeftFromBoundingBoxCenterOffset, 2))
  const textPositionFromBoundingBoxCenterAngle = rotation - Math.atan((textBottomFromBoundingBoxCenterOffset) / (textLeftFromBoundingBoxCenterOffset));

  const textX = boxWidth / 2 - textPositionFromBoundingBoxCenterDistance * Math.cos(textPositionFromBoundingBoxCenterAngle)
  const textY = boxHeight / 2 - textPositionFromBoundingBoxCenterDistance * Math.sin(textPositionFromBoundingBoxCenterAngle)

  return {
    font: ctx.font,
    textX,
    textY,
    boxWidth,
    boxHeight,
  };
}

export interface TextMeasurement {
  font: string,
  textX: number,
  textY: number,
  boxWidth: number,
  boxHeight: number,
}
