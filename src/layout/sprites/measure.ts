import { Word, WordcloudConfig } from '../../config/model';

export const measureText = (ctx: CanvasRenderingContext2D, config: WordcloudConfig, datum: Word): TextMeasurement => {
  ctx.font = `${config.fontWeight} ${datum.size}px ${config.fontFamily}`;

  const metrics = ctx.measureText(datum.text);
  const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  const rotation = datum.rotation ?? 0;
  const sin = Math.abs(Math.sin(rotation));
  const cos = Math.abs(Math.cos(rotation))
  const boxHeight = Math.ceil(textWidth * sin + textHeight * cos);
  const boxWidth = Math.ceil(textWidth * cos + textHeight * sin);

  return {
    font: ctx.font,
    textWidth,
    textHeight,
    offsetLeft: metrics.actualBoundingBoxLeft,
    offsetBottom: metrics.actualBoundingBoxDescent,
    boxWidth,
    boxHeight,
  };
}

export interface TextMeasurement {
  font: string,
  textWidth: number,
  textHeight: number,
  offsetLeft: number,
  offsetBottom: number,
  boxWidth: number,
  boxHeight: number,
}
