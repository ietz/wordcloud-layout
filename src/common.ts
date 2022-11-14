import { Word } from './config/model';

export interface Position {
  x: number;
  y: number;
}

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
