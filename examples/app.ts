import { render } from './render';
import { Size } from '../src';

let size: Size;
const appHost = document.querySelector('#app')!;

let rerenderFrameId: number | undefined = undefined;
const scheduleRerender = () => {
  rerenderFrameId = window.requestAnimationFrame(() => {
    if (size[0] >= 10 && size[0] >= 10) {
      appHost.innerHTML = '';
      render(size);
    }

    rerenderFrameId = undefined;
  })
}

const observer = new ResizeObserver((a) => {
  const rect = a[0].contentRect;
  size = [rect.width, rect.height];
  scheduleRerender();
});
observer.observe(appHost);
