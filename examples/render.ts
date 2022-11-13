import { Size } from './models';
import { wordcloud, Wordcloud } from '../src/config/builder';
import { Position } from '../src/common';
import { Word } from "../src/config/model";

export function render(size: Size) {
  const data: Word[] = [
    {text: 'Hello', size: 30, rotation: 0.2, required: true},
    {text: 'Word', size: 50, required: true},
    {text: 'where', size: 8, rotation: -1.2},
    {text: 'are', size: 38},
    {text: 'you', size: 21},
    {text: 'today', size: 23, rotation: 0.4},
    {text: '@@@', size: 27, rotation: 0.7},
  ];

  const layout = wordcloud().size([size.width, size.height]).data(data);
  const positions = layout.start();

  document.querySelector('#app')!.appendChild(buildWordcloudSvg(layout, positions));
}

const buildWordcloudSvg = (layout: Wordcloud, positions: (Position | undefined)[]) => {
  const size = layout.size();
  const data = layout.data();

  const svg = buildSvgElement('svg')
    .attr('width', size[0])
    .attr('height', size[1])
    .build();

  for (let i = 0; i < data.length; i++) {
    const position = positions[i];
    if (position === undefined) {
      continue;
    }

    const d = data[i];

    const text = buildSvgElement('text')
      .style('font-size', `${d.size}px`)
      .style('font-family', layout.fontFamily())
      .style('font-weight', layout.fontWeight())
      .style('fill', '#000')
      .attr('transform', `translate(${position.x},${position.y}) rotate(${(d.rotation ?? 0) * (180 / Math.PI)})`)
      .build();

    text.textContent = d.text;
    svg.appendChild(text);
  }

  return svg;
}

function buildSvgElement(tag: string) {
  const asString = (value: string | number) => typeof value === 'string' ? value : value.toString();
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

  return {
    attr(attribute: string, value: string | number) {
      element.setAttributeNS(null, attribute, asString(value));
      return this;
    },
    style(property: string, value: string | number) {
      element.style.setProperty(property, asString(value));
      return this;
    },
    text(value: string) {
      element.textContent = value;
      return this;
    },
    build() {
      return element;
    }
  }
}
