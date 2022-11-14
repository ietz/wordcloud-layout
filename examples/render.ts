import { Size } from './models';
import { wordcloud, Wordcloud } from '../src/config/builder';
import { LayoutResult } from '../src/common';
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
  const result = layout.start();

  document.querySelector('#app')!.appendChild(buildWordcloudSvg(layout, result));
}

const buildWordcloudSvg = (layout: Wordcloud, result: LayoutResult) => {
  const size = layout.size();

  const svg = buildSvgElement('svg')
    .attr('width', size[0])
    .attr('height', size[1])
    .build();

  const g = buildSvgElement('g')
    .attr('transform', `scale(${result.scale})`)
    .build();

  svg.appendChild(g);

  for (const word of result.words) {
    const text = buildSvgElement('text')
      .style('font-size', `${word.font.size}px`)
      .style('font-family', word.font.family)
      .style('font-weight', word.font.weight)
      .style('fill', '#000')
      .attr('transform', `translate(${word.position.x},${word.position.y}) rotate(${(word.rotation) * (180 / Math.PI)})`)
      .build();

    text.textContent = word.text;
    g.appendChild(text);
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
