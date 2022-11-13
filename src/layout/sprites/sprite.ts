import { SpriteData } from "./canvas";
import { Size } from "../../config/model";

export class Sprite {
    size: Size;
    blockWidth: number;

    constructor(
        public data: SpriteData,
        width: number,
        public textBaselineOffset: {x: number, y: number},
    ) {
        const height = data.length / width;
        if (!Number.isInteger(height)) {
            throw Error('Sprite data is not evenly divisible into rows with the given height');
        }

        this.size = [width, height];
        this.blockWidth = data.length / height;
    }
}
