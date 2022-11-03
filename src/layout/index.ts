import { WordcloudConfig } from '../config/model';
import { computeSprites } from './sprites';
import { arrange } from './arrange';
import { Position } from '../common';

export const layout = (config: WordcloudConfig): (Position | undefined)[] => {
  const sprites = computeSprites(config);
  return arrange(config, sprites);
};

