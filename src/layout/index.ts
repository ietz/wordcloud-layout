import { WordcloudConfig } from '../config/model';
import { computeSprites } from './sprites';
import { arrange } from './arrangement';
import { Font, LayoutResult, RenderWord } from '../common';

export const layout = (config: WordcloudConfig): LayoutResult => {
  const renderWords: RenderWord[] = config.data.map(datum => ({
    datum,
    text: datum.text,
    required: datum.required ?? false,
    rotation: datum.rotation ?? 0,
    font: new Font(
      config.fontFamily,
      datum.size,
      config.fontWeight,
    ),
  }));

  const sprites = computeSprites(renderWords);
  return arrange(config, renderWords, sprites);
};
