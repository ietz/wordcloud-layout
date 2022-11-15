import type { Word } from './config';

export type Size = [width: number, height: number];
export type Position = [x: number, y: number];

export interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface WordOutput<T> extends Word<T> {
  position: Position;
}

export interface LayoutResult<T> {
  scale: number;
  words: WordOutput<T>[];
}
