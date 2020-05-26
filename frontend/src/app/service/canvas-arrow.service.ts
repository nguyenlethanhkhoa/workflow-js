import { Injectable } from "@angular/core";
import {
  ICanvas,
  CANVAS_LINE_WIDTH,
  CANVAS_GRID_SIZE,
  CANVAS_ARROW_HEIGHT,
  CANVAS_ARROW_WIDTH,
} from "../model/canvas.interface";
import { IPosition, SIDE, DIRECTION } from "../model/direction.interface";

@Injectable({
  providedIn: "root",
})
export class CanvasArrowService {
  constructor() {}

  public draw(canvas: ICanvas) {
    canvas.nodeDirection.direction = this.drawArrowBody(canvas);
    this.drawArrowHead(canvas);
  }

  private drawArrowBody(canvas: ICanvas) {
    if (
      canvas.nodeDirection.from.x == canvas.nodeDirection.to.x &&
      canvas.nodeDirection.fromSide == SIDE.LEFT &&
      canvas.nodeDirection.toSide == SIDE.LEFT
    ) {
      canvas.context.beginPath();
      canvas.context.moveTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x - CANVAS_GRID_SIZE * 2,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x - CANVAS_GRID_SIZE * 2,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      canvas.context.strokeStyle = canvas.nodeDirection.color;
      canvas.context.stroke();
      return DIRECTION.RIGHT;
    }

    if (
      canvas.nodeDirection.from.x == canvas.nodeDirection.to.x &&
      canvas.nodeDirection.fromSide == SIDE.RIGHT &&
      canvas.nodeDirection.toSide == SIDE.RIGHT
    ) {
      canvas.context.beginPath();
      canvas.context.moveTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x + CANVAS_GRID_SIZE * 2,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x + CANVAS_GRID_SIZE * 2,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      canvas.context.strokeStyle = canvas.nodeDirection.color;
      canvas.context.stroke();
      return DIRECTION.LEFT;
    }

    if (
      canvas.nodeDirection.from.y == canvas.nodeDirection.to.y &&
      canvas.nodeDirection.fromSide == SIDE.BOTTOM &&
      canvas.nodeDirection.toSide == SIDE.BOTTOM
    ) {
      canvas.context.beginPath();
      canvas.context.moveTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y + CANVAS_GRID_SIZE * 2
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.from.y + CANVAS_GRID_SIZE * 2
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      canvas.context.strokeStyle = canvas.nodeDirection.color;
      canvas.context.stroke();
      return DIRECTION.UP;
    }

    if (
      canvas.nodeDirection.from.y == canvas.nodeDirection.to.y &&
      canvas.nodeDirection.fromSide == SIDE.TOP &&
      canvas.nodeDirection.toSide == SIDE.TOP
    ) {
      canvas.context.beginPath();
      canvas.context.moveTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y
      );
      canvas.context.lineTo(
        canvas.nodeDirection.from.x,
        canvas.nodeDirection.from.y - CANVAS_GRID_SIZE * 2
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.from.y - CANVAS_GRID_SIZE * 2
      );
      canvas.context.lineTo(
        canvas.nodeDirection.to.x,
        canvas.nodeDirection.to.y
      );
      canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      canvas.context.strokeStyle = canvas.nodeDirection.color;
      canvas.context.stroke();
      return DIRECTION.DOWN;
    }

    canvas.context.beginPath();
    canvas.context.moveTo(
      canvas.nodeDirection.from.x,
      canvas.nodeDirection.from.y
    );
    canvas.context.lineTo(canvas.nodeDirection.to.x, canvas.nodeDirection.to.y);
    canvas.context.lineWidth = CANVAS_LINE_WIDTH;
    canvas.context.strokeStyle = canvas.nodeDirection.color;
    canvas.context.stroke();

    if (
      canvas.nodeDirection.fromSide == SIDE.BOTTOM &&
      canvas.nodeDirection.toSide == SIDE.TOP
    )
      return DIRECTION.DOWN;
    if (
      canvas.nodeDirection.fromSide == SIDE.TOP &&
      canvas.nodeDirection.toSide == SIDE.BOTTOM
    )
      return DIRECTION.UP;
    if (
      canvas.nodeDirection.fromSide == SIDE.LEFT &&
      canvas.nodeDirection.toSide == SIDE.RIGHT
    )
      return DIRECTION.LEFT;
    if (
      canvas.nodeDirection.fromSide == SIDE.RIGHT &&
      canvas.nodeDirection.toSide == SIDE.LEFT
    )
      return DIRECTION.RIGHT;
  }

  private drawArrowHead(canvas: ICanvas) {
    let step_1: IPosition = null;
    let step_2: IPosition = null;
    let step_3: IPosition = null;

    if (canvas.nodeDirection.direction == DIRECTION.RIGHT) {
      step_1 = {
        x: canvas.nodeDirection.to.x - CANVAS_ARROW_HEIGHT,
        y: canvas.nodeDirection.to.y - CANVAS_ARROW_WIDTH,
      };
      step_2 = { x: canvas.nodeDirection.to.x, y: canvas.nodeDirection.to.y };
      step_3 = {
        x: canvas.nodeDirection.to.x - CANVAS_ARROW_HEIGHT,
        y: canvas.nodeDirection.to.y + CANVAS_ARROW_WIDTH,
      };
    }

    if (canvas.nodeDirection.direction == DIRECTION.LEFT) {
      step_1 = {
        x: canvas.nodeDirection.to.x + CANVAS_ARROW_HEIGHT,
        y: canvas.nodeDirection.to.y - CANVAS_ARROW_WIDTH,
      };
      step_2 = { x: canvas.nodeDirection.to.x, y: canvas.nodeDirection.to.y };
      step_3 = {
        x: canvas.nodeDirection.to.x + CANVAS_ARROW_HEIGHT,
        y: canvas.nodeDirection.to.y + CANVAS_ARROW_WIDTH,
      };
    }

    if (canvas.nodeDirection.direction == DIRECTION.DOWN) {
      step_1 = {
        x: canvas.nodeDirection.to.x - CANVAS_ARROW_WIDTH,
        y: canvas.nodeDirection.to.y - CANVAS_ARROW_HEIGHT,
      };
      step_2 = { x: canvas.nodeDirection.to.x, y: canvas.nodeDirection.to.y };
      step_3 = {
        x: canvas.nodeDirection.to.x + CANVAS_ARROW_WIDTH,
        y: canvas.nodeDirection.to.y - CANVAS_ARROW_HEIGHT,
      };
    }

    if (canvas.nodeDirection.direction == DIRECTION.UP) {
      step_1 = {
        x: canvas.nodeDirection.to.x - CANVAS_ARROW_WIDTH,
        y: canvas.nodeDirection.to.y + CANVAS_ARROW_HEIGHT,
      };
      step_2 = { x: canvas.nodeDirection.to.x, y: canvas.nodeDirection.to.y };
      step_3 = {
        x: canvas.nodeDirection.to.x + CANVAS_ARROW_WIDTH,
        y: canvas.nodeDirection.to.y + CANVAS_ARROW_HEIGHT,
      };
    }

    canvas.context.beginPath();
    canvas.context.moveTo(step_1.x, step_1.y);
    canvas.context.lineTo(step_2.x, step_2.y);
    canvas.context.lineTo(step_3.x, step_3.y);
    canvas.context.fillStyle = canvas.nodeDirection.color;
    canvas.context.fill();
  }
}
