import { Size } from './models';
import { render } from './render';

let size: Size;
const appHost = document.querySelector('#app')!;

let rerenderFrameId: number | undefined = undefined;
const scheduleRerender = () => {
  rerenderFrameId = window.requestAnimationFrame(() => {
    if (size.width >= 10 && size.height >= 10) {
      appHost.innerHTML = '';
      render(size);
    }

    rerenderFrameId = undefined;
  })
}

const observer = new ResizeObserver((a) => {
  const rect = a[0].contentRect;
  size = {width: rect.width, height: rect.height}
  scheduleRerender();
});
observer.observe(appHost);
