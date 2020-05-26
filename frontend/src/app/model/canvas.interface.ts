import { IDirection } from "./direction.interface";

export interface ICanvas {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  isDrawingNodeDirection: boolean;
  nodeDirection: IDirection;
}

export const CANVAS_LINE_WIDTH = 2;
export const CANVAS_ARROW_WIDTH = 5;
export const CANVAS_ARROW_HEIGHT = 10;
export const CANVAS_GRID_SIZE = 10;
