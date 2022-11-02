import { Size } from './models';
import { wordcloud } from '../src';

export function render(size: Size) {
  wordcloud()
    .data([
      {text: 'Hello', size: 30, rotation: 0.2},
      {text: 'Word', size: 50},
      {text: 'where', size: 8, rotation: -1.2},
      {text: 'are', size: 38},
      {text: 'you', size: 21},
      {text: 'today', size: 23, rotation: 0.4},
      {text: '@@@', size: 27, rotation: 0.7},
    ])
    .start()
}
