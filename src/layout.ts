import { WordcloudConfig } from './config/model';
import { computeSprites } from './layout/sprites/compute';

export const layout = (config: WordcloudConfig) => {
  computeSprites(config);
};
