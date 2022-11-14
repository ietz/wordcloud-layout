export interface WordcloudConfig {
  size: Size,
  fontFamily: string,
  fontWeight: number | string,
  data: Word[],
}

export type Size = [width: number, height: number];

export interface Word {
  text: string;
  size: number;
  rotation?: number;
  required?: boolean;
}

export const getFontString = (config: WordcloudConfig, word: Word) =>
  `${config.fontWeight} ${word.size}px ${config.fontFamily}`;
