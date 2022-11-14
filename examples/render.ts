import { Size } from './models';
import { wordcloud, Wordcloud } from '../src/config/builder';
import { LayoutResult } from '../src/common';
import { Word } from "../src/config/model";

const data = [
  {text: 'Hello', fontSize: 30, rotation: 0.2, required: true},
  {text: 'Word', fontSize: 50, required: true},
  {text: 'where', fontSize: 8, rotation: -1.2},
  {text: 'are', fontSize: 38},
  {text: 'you', fontSize: 21},
  {text: 'today', fontSize: 23, rotation: 0.4},
  {text: '@@@', fontSize: 27, rotation: 0.7},
];

type Datum = (typeof data)[number];

export function render(size: Size) {
  const layout = wordcloud<Datum>()
    .size([size.width, size.height])
    .data(data)
    .text(d => d.text)
    .fontSize(d => d.fontSize)
    .rotation(d => d.rotation ?? 0)
    .required(d => !!d.required);

  const result = layout.start();

  document.querySelector('#app')!.appendChild(buildWordcloudSvg(layout, result));
}

const buildWordcloudSvg = (layout: Wordcloud<Datum>, result: LayoutResult<Datum>) => {
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
      .style('font-size', `${word.fontSize}px`)
      .style('font-family', word.fontFamily)
      .style('font-weight', word.fontWeight)
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
