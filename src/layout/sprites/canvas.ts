import { Word } from '../../config/model';
import { TextMeasurement } from './measure';
import { Placement } from './pack';

export const drawTexts = (ctx: CanvasRenderingContext2D, data: Word[], measurements: TextMeasurement[], placements: Placement[]) => {
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    const measurement = measurements[i];
    const placement = placements[i];

    ctx.font = measurement.font;

    ctx.translate(placement.x + measurement.boxWidth / 2, placement.y + measurement.boxHeight / 2);
    ctx.rotate(datum.rotation ?? 0);
    ctx.translate(measurement.offsetLeft - measurement.textWidth / 2, -measurement.offsetBottom + measurement.textHeight / 2);

    ctx.fillStyle = '#000';
    ctx.fillText(datum.text, 0, 0);

    ctx.resetTransform();
  }
}
