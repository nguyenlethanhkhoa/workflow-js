import {
    IArrow,
    CANVAS_GRID_SIZE,
    CANVAS_LINE_WIDTH,
    CANVAS_ARROW_HEIGHT,
    CANVAS_ARROW_WIDTH,
    ICanvas,
} from "../interface/canvas.interface";
import {
    IPosition,
    IPath,
    IDirection,
    SIDE,
    DIRECTION,
} from "../interface/direction.interface";

export class Arrow implements IArrow {
    private isHovered: boolean = false;
    private isSelected: boolean = false;

    private paths: IPath[];
    private arrow: IDirection;
    private canvas: ICanvas;

    constructor(arrow: IDirection, canvas: ICanvas) {
        this.arrow = arrow;
        this.canvas = canvas;
        this.paths = [];
        this.draw();
    }

    public checkHovered(mousePosition: IPosition): boolean {
        if (!Array.isArray(this.paths)) {
            this.isHovered = false;
            return false;
        }

        for (let i = 0; i < this.paths.length; i++) {
            if (
                this.paths[i].from.x == this.paths[i].to.x &&
                mousePosition.x <= this.paths[i].from.x &&
                mousePosition.x >= this.paths[i].from.x - CANVAS_LINE_WIDTH &&
                ((mousePosition.y >= this.paths[i].from.y &&
                    mousePosition.y <= this.paths[i].to.y) ||
                    (mousePosition.y <= this.paths[i].from.y &&
                        mousePosition.y >= this.paths[i].to.y))
            ) {
                this.isHovered = true;
                return true;
            }

            if (
                this.paths[i].from.y == this.paths[i].to.y &&
                mousePosition.y <= this.paths[i].from.y &&
                mousePosition.y >= this.paths[i].from.y - CANVAS_LINE_WIDTH &&
                ((mousePosition.x >= this.paths[i].from.x &&
                    mousePosition.x <= this.paths[i].to.x) ||
                    (mousePosition.x <= this.paths[i].from.x &&
                        mousePosition.x >= this.paths[i].to.x))
            ) {
                this.isHovered = true;
                return true;
            }
        }

        this.isHovered = false;
        return false;
    }

    public selected(): void {
        this.isSelected = this.isHovered;
    }

    public draw(): void {
        if (!Array.isArray(this.paths)) {
            this.paths = [];
        }

        if (!this.paths.length) {
            this._generatePaths();
        }

        const from = this.paths[this.paths.length - 1].from;
        const to = this.paths[this.paths.length - 1].to;

        if (from.x == to.x && from.y < to.y) {
            this.arrow.direction = DIRECTION.DOWN;
        }

        if (from.x == to.x && from.y > to.y) {
            this.arrow.direction = DIRECTION.UP;
        }

        if (from.y == to.y && from.x < to.x) {
            this.arrow.direction = DIRECTION.RIGHT;
        }

        if (from.y == to.y && from.x > to.x) {
            this.arrow.direction = DIRECTION.LEFT;
        }

        this._drawArrowBody();
        this._drawArrowHead();
    }

    private _drawArrowBody(): void {
        this.canvas.getContext().beginPath();
        this.canvas.getContext().moveTo(this.arrow.from.x, this.arrow.from.y);

        for (let i = 0; i < this.paths.length; i++) {
            this.canvas.getContext().lineTo(this.paths[i].to.x, this.paths[i].to.y);
        }

        if (this.isHovered) {
            this.canvas.getContext().shadowBlur = 10;
            this.canvas.getContext().shadowColor = "blue";
        }

        if (this.isSelected) {
            this.canvas.getContext().shadowBlur = 10;
            this.canvas.getContext().shadowColor = "red";
        }

        this.canvas.getContext().lineWidth = CANVAS_LINE_WIDTH;
        this.canvas.getContext().strokeStyle = this.arrow.color;
        this.canvas.getContext().stroke();

        this.canvas.getContext().lineWidth = 1;
        this.canvas.getContext().shadowBlur = null;
        this.canvas.getContext().shadowColor = null;
    }

    private _drawArrowHead(): void {
        let step_1: IPosition = null;
        let step_2: IPosition = null;
        let step_3: IPosition = null;

        if (this.arrow.direction == DIRECTION.RIGHT) {
            step_1 = {
                x: this.arrow.to.x - CANVAS_ARROW_HEIGHT,
                y: this.arrow.to.y - CANVAS_ARROW_WIDTH,
            };
            step_2 = {
                x: this.arrow.to.x,
                y: this.arrow.to.y,
            };
            step_3 = {
                x: this.arrow.to.x - CANVAS_ARROW_HEIGHT,
                y: this.arrow.to.y + CANVAS_ARROW_WIDTH,
            };
        }

        if (this.arrow.direction == DIRECTION.LEFT) {
            step_1 = {
                x: this.arrow.to.x + CANVAS_ARROW_HEIGHT,
                y: this.arrow.to.y - CANVAS_ARROW_WIDTH,
            };
            step_2 = {
                x: this.arrow.to.x,
                y: this.arrow.to.y,
            };
            step_3 = {
                x: this.arrow.to.x + CANVAS_ARROW_HEIGHT,
                y: this.arrow.to.y + CANVAS_ARROW_WIDTH,
            };
        }

        if (this.arrow.direction == DIRECTION.DOWN) {
            step_1 = {
                x: this.arrow.to.x - CANVAS_ARROW_WIDTH,
                y: this.arrow.to.y - CANVAS_ARROW_HEIGHT,
            };
            step_2 = {
                x: this.arrow.to.x,
                y: this.arrow.to.y,
            };
            step_3 = {
                x: this.arrow.to.x + CANVAS_ARROW_WIDTH,
                y: this.arrow.to.y - CANVAS_ARROW_HEIGHT,
            };
        }

        if (this.arrow.direction == DIRECTION.UP) {
            step_1 = {
                x: this.arrow.to.x - CANVAS_ARROW_WIDTH,
                y: this.arrow.to.y + CANVAS_ARROW_HEIGHT,
            };
            step_2 = {
                x: this.arrow.to.x,
                y: this.arrow.to.y,
            };
            step_3 = {
                x: this.arrow.to.x + CANVAS_ARROW_WIDTH,
                y: this.arrow.to.y + CANVAS_ARROW_HEIGHT,
            };
        }

        this.canvas.getContext().beginPath();

        if (this.isHovered) {
            this.canvas.getContext().shadowBlur = 10;
            this.canvas.getContext().shadowColor = "#98d5e8";
        }

        if (this.isSelected) {
            this.canvas.getContext().shadowBlur = 10;
            this.canvas.getContext().shadowColor = "red";
        }

        this.canvas.getContext().moveTo(step_1.x, step_1.y);
        this.canvas.getContext().lineTo(step_2.x, step_2.y);
        this.canvas.getContext().lineTo(step_3.x, step_3.y);
        this.canvas.getContext().fillStyle = this.arrow.color;
        this.canvas.getContext().fill();

        this.canvas.getContext().shadowBlur = null;
        this.canvas.getContext().shadowColor = null;
    }

    private _generatePaths(): void {
        if (this._isBestPath()) {
            this.paths.push({ from: this.arrow.from, to: this.arrow.to });
            return;
        }

        const to: IPosition = this._shift(this.arrow.toSide, this.arrow.to);

        let fromSide = this.arrow.fromSide;
        let from: IPosition = this._shift(this.arrow.fromSide, this.arrow.from);
        this.paths.push({
            from: this.arrow.from,
            to: from,
        });

        if (this._checkSameDirection(this.arrow.fromSide, this.arrow.toSide)) {
            const recalculatedFrom: any = this._recalcFrom(from, this.arrow.fromSide);
            this.paths.push({
                from: from,
                to: recalculatedFrom.value,
            });
            from = recalculatedFrom.value;
            fromSide = recalculatedFrom.side;
        }

        if (fromSide == SIDE.TOP || fromSide == SIDE.BOTTOM) {
            const tempFrom: IPosition = { x: to.x, y: from.y };
            this.paths.push({ from: from, to: tempFrom });
            this.paths.push({ from: tempFrom, to: to });
        }

        if (fromSide == SIDE.LEFT || fromSide == SIDE.RIGHT) {
            const tempFrom: IPosition = { x: from.x, y: to.y };
            this.paths.push({ from: from, to: tempFrom });
            this.paths.push({ from: tempFrom, to: to });
        }

        this.paths.push({ from: to, to: this.arrow.to });
    }

    private _isBestPath(): boolean {
        if (
            this.arrow.toSide == SIDE.RIGHT &&
            this.arrow.fromSide == SIDE.LEFT &&
            this.arrow.from.y == this.arrow.to.y
        ) {
            return true;
        }

        if (
            this.arrow.toSide == SIDE.LEFT &&
            this.arrow.fromSide == SIDE.RIGHT &&
            this.arrow.from.y == this.arrow.to.y
        ) {
            return true;
        }

        if (
            this.arrow.toSide == SIDE.BOTTOM &&
            this.arrow.fromSide == SIDE.TOP &&
            this.arrow.from.x == this.arrow.to.x
        ) {
            return true;
        }

        if (
            this.arrow.toSide == SIDE.TOP &&
            this.arrow.fromSide == SIDE.BOTTOM &&
            this.arrow.from.x == this.arrow.to.x
        ) {
            return true;
        }

        return false;
    }

    private _recalcFrom(from: IPosition, side: SIDE): any {
        switch (side) {
            case SIDE.TOP:
                return {
                    side: SIDE.RIGHT,
                    value: {
                        x: from.x + CANVAS_GRID_SIZE * 22,
                        y: from.y,
                    },
                };
            case SIDE.LEFT:
                return {
                    side: SIDE.TOP,
                    value: {
                        x: from.x,
                        y: from.y - CANVAS_GRID_SIZE * 22,
                    },
                };
            case SIDE.RIGHT:
                return {
                    side: SIDE.BOTTOM,
                    value: {
                        x: from.x,
                        y: from.y + CANVAS_GRID_SIZE * 22,
                    },
                };
            case SIDE.BOTTOM:
                return {
                    side: SIDE.LEFT,
                    value: {
                        x: from.x - CANVAS_GRID_SIZE * 22,
                        y: from.y,
                    },
                };
        }
    }

    private _shift(side: SIDE, position: IPosition): IPosition {
        switch (side) {
            case SIDE.TOP:
                return { x: position.x, y: position.y - CANVAS_GRID_SIZE * 2 };
            case SIDE.LEFT:
                return { x: position.x - CANVAS_GRID_SIZE * 2, y: position.y };
            case SIDE.RIGHT:
                return { x: position.x + CANVAS_GRID_SIZE * 2, y: position.y };
            case SIDE.BOTTOM:
                return { x: position.x, y: position.y + CANVAS_GRID_SIZE * 2 };
        }
    }

    private _checkSameDirection(fromSide, toSide): boolean {
        if (fromSide == toSide) return true;

        if (fromSide == SIDE.LEFT && toSide == SIDE.RIGHT) return true;
        if (fromSide == SIDE.RIGHT && toSide == SIDE.LEFT) return true;

        if (fromSide == SIDE.TOP && toSide == SIDE.BOTTOM) return true;
        if (fromSide == SIDE.BOTTOM && toSide == SIDE.TOP) return true;

        return false;
    }
}
