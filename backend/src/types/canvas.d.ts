declare module "canvas" {
  export class Canvas {
    constructor(width: number, height: number);
    getContext(contextType: string): CanvasRenderingContext2D;
    toBuffer(): Buffer;
    toDataURL(): string;
    width: number;
    height: number;
  }

  export class Image {
    src: string;
    onload: Function;
    width: number;
    height: number;
  }

  export function createCanvas(width: number, height: number): Canvas;
  export function loadImage(source: Buffer | string): Promise<Image>;

  export interface CanvasRenderingContext2D {
    drawImage(image: Image, dx: number, dy: number): void;
    drawImage(
      image: Image,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    // Ajoutez d'autres méthodes selon vos besoins
  }

  export interface ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
  }
}
