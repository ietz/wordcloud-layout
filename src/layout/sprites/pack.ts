import { Size } from '../../config/model';

export const boxPack = (sizes: Size[]) => {
  // place texts with large box heights first
  const order = range(sizes.length).sort((a, b) => sizes[b][1] - sizes[a][1]);
  const placements: (Placement | undefined)[] = Array.from({length: sizes.length});
  // place first item at top left corner
  placements[order[0]] = {x: 0, y: 0};

  let x = sizes[order[0]][0];
  let y = 0;

  let lineHeight = sizes[order[0]][1];
  let lineWidthLimit: number | undefined = undefined;
  let remainingOnFirstLine = Math.ceil(Math.sqrt(sizes.length)) - 1;

  for (let i = 1; i < sizes.length; i++) {
    const [width, height] = sizes[order[i]];

    if (lineWidthLimit === undefined ? remainingOnFirstLine <= 0 : x + width > lineWidthLimit) {
      // line is full -> go to next line

      if (lineWidthLimit === undefined) {
        // use width of first line as the limit for the other lines
        lineWidthLimit = x;
      }

      x = 0;
      y += lineHeight;

      lineHeight = height;
    }

    placements[order[i]] = {x, y};

    remainingOnFirstLine -= 1;
    x += width;
  }

  return {
    width: lineWidthLimit ?? x,
    height: y + lineHeight,
    placements: placements as Placement[],
  }
}

const range = (end: number) => Array.from({length: end}, (_, i) => i);

interface Placement {
  x: number;
  y: number;
}
