// types.d.ts
declare module "canvas" {
  export function createCanvas(width: number, height: number): any;
  export function loadImage(source: Buffer | string): Promise<any>;
  // Ajoutez d'autres définitions au besoin
}
