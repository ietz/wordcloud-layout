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

export interface RenderWord {
  datum: Word;
  required: boolean;
  rotation: number;
  text: string;
  font: Font;
}

export class Font {
  constructor(
    public readonly family: string,
    public readonly size: number,
    public readonly weight: number | string,
  ) {}

  toString() {
    return `${this.weight} ${this.size}px ${this.family}`
  }
}
