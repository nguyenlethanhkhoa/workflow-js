import {
    ICanvas,
    IArrowList,
    CANVAS_GRID_SIZE,
} from "../interface/canvas.interface";
import { IDirection, IPosition, IPath } from "../interface/direction.interface";
import { Arrow } from "./arrow";

export class Canvas implements ICanvas {
    private element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private arrows: IArrowList = {};

    private isDraggable: boolean = false;
    private isEnableGrid: boolean = false;

    constructor(id: string) {
        this.element = <HTMLCanvasElement>document.getElementById(id);
        this.context = this.element.getContext("2d");

        this.element.addEventListener("click", this._mouseClickHandler.bind(this));
        this.element.addEventListener("mousemove", this._mouseMoveHandler.bind(this));

        this.draw();
    }

    public getElement(): HTMLCanvasElement {
        return this.element;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    public size(width: number, height: number): void {
        this.element.width = width;
        this.element.height = height;
    }

    public toggleGrid(): void {
        this.isEnableGrid = !this.isEnableGrid;
        this.draw();
    }

    public addArrow(direction: IDirection): void {
        const arrow = new Arrow(direction, this);
        this.arrows[Object.keys(this.arrows).length - 1] = arrow;
    }

    public draw(): void {
        this.context.clearRect(0, 0, this.element.width, this.element.height);

        if (this.isEnableGrid) {
            this._drawGrid();
        }

        for (let prop in this.arrows) {
            if (!this.arrows.hasOwnProperty(prop)) {
                continue;
            }

            this.arrows[prop].draw();
        }
    }

    private _drawGrid(): void {
        for (let i = 0; i < Math.floor(window.innerWidth / CANVAS_GRID_SIZE); i++) {
            this.context.beginPath();
            if (i % 4 == 0) {
                this.context.strokeStyle = "#f1f1f1";
            } else {
                this.context.strokeStyle = "#fbfbfb";
            }

            this.context.moveTo(CANVAS_GRID_SIZE * i, 0);
            this.context.lineTo(CANVAS_GRID_SIZE * i, this.element.height);
            this.context.stroke();
        }

        for (let i = 0; i < Math.floor(window.innerWidth / CANVAS_GRID_SIZE); i++) {
            this.context.beginPath();
            if (i % 4 == 0) {
                this.context.strokeStyle = "#f1f1f1";
            } else {
                this.context.strokeStyle = "#fbfbfb";
            }

            this.context.moveTo(0, CANVAS_GRID_SIZE * i);
            this.context.lineTo(this.element.width, CANVAS_GRID_SIZE * i);
            this.context.stroke();
        }
    }

    private _mouseMoveHandler(event: MouseEvent): void {
        let isHovered: boolean = false;
        const mousePosition: IPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        for (let prop in this.arrows) {
            if (!this.arrows.hasOwnProperty(prop)) {
                continue;
            }

            if (this.arrows[prop].checkHovered(mousePosition)) {
                isHovered = true;
                break;
            }
        }

        this.element.classList.remove("pointer");
        if (isHovered) {
            this.element.classList.add("pointer");
        }

        this.draw();
    }

    private _mouseDownHandler(event: MouseEvent): void {
        this.isDraggable = true;
    }

    private _mouseUpHandler(event: MouseEvent): void {
        this.isDraggable = false;
    }

    private _mouseClickHandler(): void {
        for (let prop in this.arrows) {
            if (!this.arrows.hasOwnProperty(prop)) {
                continue;
            }

            this.arrows[prop].selected();
        }

        this.draw();
    }
}
