export interface ICanvas {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  isDrawingNodeDirection: boolean;
  nodeDirection: IDirection;
}

export interface IDirection {
  from: IPosition;
  fromSide: string;
  to: IPosition;
  toSide: string;
  color: string;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export const CANVAS_LINE_WIDTH = 2;
export const CANVAS_ARROW_WIDTH = 5;
export const CANVAS_ARROW_HEIGHT = 10;
export const CANVAS_GRID_SIZE = 10;
