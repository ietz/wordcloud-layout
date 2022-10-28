import { Size } from './models';
import { wordcloud } from '../src';

export function render(size: Size) {
  document.querySelector('#app')!.innerHTML = wordcloud();
}
