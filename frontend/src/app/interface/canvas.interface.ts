import { IDirection, IPosition } from "./direction.interface";

export interface ICanvas {
    getElement(): HTMLCanvasElement;
    getContext(): CanvasRenderingContext2D;

    draw(): void;
    toggleGrid(): void;
    size(width: number, height: number): void;
    addArrow(direction: IDirection): void;
}

export interface IArrowList {
    [key: number]: IArrow;
}

export interface IArrow {
    checkHovered(mousePosition: IPosition): boolean;
    selected(): void;
    draw(): void;
}

export const CANVAS_LINE_WIDTH = 2;
export const CANVAS_ARROW_WIDTH = 5;
export const CANVAS_ARROW_HEIGHT = 10;
export const CANVAS_GRID_SIZE = 10;
