import type { WordcloudConfig } from '../config';
import { computeSprites } from './sprites';
import { arrange } from './arrangement';
import type { LayoutResult } from '../common';

export const layout = <T>(config: WordcloudConfig<T>): LayoutResult<T> => {
  const sprites = computeSprites(config.words);
  return arrange(config, sprites);
};
