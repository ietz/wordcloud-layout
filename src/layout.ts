import { WordcloudConfig } from './config/model';
import { computeSprites } from './layout/sprites/compute';

let firstLayout: number | undefined = undefined;

export const layout = (config: WordcloudConfig) => {
  if (firstLayout === undefined) {
    firstLayout = Date.now();
  }

  const time = Date.now() - firstLayout;

  computeSprites(config, 2 * Math.PI * time / 1000 / 8);
};
