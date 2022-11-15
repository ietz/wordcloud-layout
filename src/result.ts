import type { Word } from './config';
import type { Position } from './common';

export interface WordOutput<T> extends Word<T> {
  position: Position;
}

export interface LayoutResult<T> {
  scale: number;
  words: WordOutput<T>[];
}
