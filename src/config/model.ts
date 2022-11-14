export interface WordcloudConfigProperties<T> {
  size: Size,
  data: T[],
}

export interface WordProperties {
  text: string;
  rotation: number;
  required: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
}


export interface Word<T> extends WordProperties {
  datum: T;
}

export const getFontString = (word: Word<unknown>) => `${word.fontWeight} ${word.fontSize}px ${word.fontFamily}`;

export type WordConfig<T> = {
  [Property in keyof WordProperties]: (datum: T) => WordProperties[Property]
}

export interface WordcloudConfig<T = unknown> extends WordcloudConfigProperties<T> {
  words: Word<T>[],
}

export type Size = [width: number, height: number];
