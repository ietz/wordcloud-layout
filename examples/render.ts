import { Size } from './models';
import { wordcloud } from '../src';

export function render(size: Size) {
  wordcloud()
    .data([
      {text: 'Hello', size: 30},
      {text: 'Word', size: 50},
      {text: 'where', size: 8},
      {text: 'are', size: 38},
      {text: 'you', size: 21},
      {text: 'today', size: 23},
      {text: '@@@', size: 27},
    ])
    .start()
}
