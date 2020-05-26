import * as $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import { HttpClient } from "@angular/common/http";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  ICanvas,
  IPosition,
  CANVAS_ARROW_HEIGHT,
  CANVAS_ARROW_WIDTH,
  CANVAS_GRID_SIZE,
  CANVAS_LINE_WIDTH,
} from "../model/canvas.interface";

@Component({
  selector: "app-workflow",
  templateUrl: "./workflow.component.html",
  styleUrls: ["./workflow.component.css"],
})
export class WorkflowComponent implements OnInit, AfterViewInit {
  public items: any = [{ id: 0 }];

  private workflowItems: any = { 0: { id: 0, type: 0 } };
  private startDirectionNode: any;
  private workflowGraph = {};
  private autoIncrementId = 0;
  private canvas: ICanvas = {
    element: null,
    context: null,
    isDrawingNodeDirection: false,
    nodeDirection: null,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit() {
    $(".canvas-wrapper").width(window.innerWidth);
    $(".canvas-wrapper").height(window.innerHeight);

    this.canvas.element = <HTMLCanvasElement>document.getElementById("canvas");
    this.canvas.element.width = window.innerWidth;
    this.canvas.element.height = window.innerHeight;
    this.canvas.context = this.canvas.element.getContext("2d");
    this.initGridInCanvas();

    $("body").delegate(".workflow-item", "mouseover", function () {
      $(this).draggable({
        stop: function (event, ui) {
          let top = Math.floor(ui.position.top / CANVAS_GRID_SIZE);
          if (ui.position.top % CANVAS_GRID_SIZE >= CANVAS_GRID_SIZE / 2) {
            top = Math.floor(ui.position.top / CANVAS_GRID_SIZE) + 1;
          }

          let left = Math.floor(ui.position.left / CANVAS_GRID_SIZE);
          if (ui.position.left % CANVAS_GRID_SIZE >= CANVAS_GRID_SIZE / 2) {
            left = Math.floor(ui.position.left / CANVAS_GRID_SIZE) + 1;
          }

          $(this).css({
            top: top * CANVAS_GRID_SIZE,
            left: left * CANVAS_GRID_SIZE,
          });
        },
      });
    });
  }

  initGridInCanvas() {
    for (let i = 0; i < Math.floor(window.innerWidth / CANVAS_GRID_SIZE); i++) {
      this.canvas.context.beginPath();
      if (i % 4 == 0) {
        this.canvas.context.strokeStyle = "#f1f1f1";
      } else {
        this.canvas.context.strokeStyle = "#fbfbfb";
      }

      this.canvas.context.moveTo(CANVAS_GRID_SIZE * i, 0);
      this.canvas.context.lineTo(
        CANVAS_GRID_SIZE * i,
        this.canvas.element.height
      );
      this.canvas.context.stroke();
    }

    for (let i = 0; i < Math.floor(window.innerWidth / CANVAS_GRID_SIZE); i++) {
      this.canvas.context.beginPath();
      if (i % 4 == 0) {
        this.canvas.context.strokeStyle = "#f1f1f1";
      } else {
        this.canvas.context.strokeStyle = "#fbfbfb";
      }

      this.canvas.context.moveTo(0, CANVAS_GRID_SIZE * i);
      this.canvas.context.lineTo(
        this.canvas.element.width,
        CANVAS_GRID_SIZE * i
      );
      this.canvas.context.stroke();
    }
  }

  addWorkflowItem() {
    this.autoIncrementId++;
    this.items.push({ id: this.autoIncrementId });
    this.workflowItems[this.autoIncrementId] = { id: this.autoIncrementId };
  }

  buildWorkflowItem(item: any) {
    this.workflowItems[item.id] = item;
    for (let i = 0; i <= this.items.length; i++) {
      if (
        typeof this.items[i] != "object" ||
        !this.items[i].hasOwnProperty("id")
      ) {
        continue;
      }

      if (this.items[i].id == item.id) {
        this.items[i].data = item;
      }
    }
  }

  drawWorkflowDirectionInCanvas(item: any) {
    this.canvas.isDrawingNodeDirection = !this.canvas.isDrawingNodeDirection;

    // start direction
    if (this.canvas.isDrawingNodeDirection) {
      this.startDirectionNode = item;

      this.canvas.nodeDirection = {
        from: item.position,
        fromSide: item.side,
        to: null,
        toSide: null,
        color: item.color,
      };

      return;
    }

    // end direction
    if (
      typeof this.canvas.nodeDirection != "object" ||
      !this.canvas.nodeDirection.from
    ) {
      return;
    }

    this.addDirectionIntoWorkflowTree(item);

    this.canvas.nodeDirection.to = item.position;
    this.canvas.nodeDirection.toSide = item.side;

    this.drawArrowInCanvas(
      this.canvas.nodeDirection.from,
      this.canvas.nodeDirection.to,
      this.canvas.nodeDirection.color,
      this.canvas.nodeDirection.fromSide,
      this.canvas.nodeDirection.toSide
    );
    this.canvas.nodeDirection = null;
  }

  drawArrowInCanvas(from, to, color, fromSide = "", toSide = "") {
    const arrowDirection = this.drawArrowBodyInCanvas(
      from,
      to,
      color,
      fromSide,
      toSide
    );
    this.drawArrowHeadInCanvas(to, arrowDirection, color);
  }

  drawArrowBodyInCanvas(from, to, color, fromSide = "", toSide = "") {
    if (from.x == to.x && fromSide == "left" && toSide == "left") {
      this.canvas.context.beginPath();
      this.canvas.context.moveTo(from.x, from.y);
      this.canvas.context.lineTo(from.x - CANVAS_GRID_SIZE * 2, from.y);
      this.canvas.context.lineTo(from.x - CANVAS_GRID_SIZE * 2, to.y);
      this.canvas.context.lineTo(to.x, to.y);
      this.canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      this.canvas.context.strokeStyle = color;
      this.canvas.context.stroke();
      return "right";
    }

    if (from.x == to.x && fromSide == "right" && toSide == "right") {
      this.canvas.context.beginPath();
      this.canvas.context.moveTo(from.x, from.y);
      this.canvas.context.lineTo(from.x + CANVAS_GRID_SIZE * 2, from.y);
      this.canvas.context.lineTo(from.x + CANVAS_GRID_SIZE * 2, to.y);
      this.canvas.context.lineTo(to.x, to.y);
      this.canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      this.canvas.context.strokeStyle = color;
      this.canvas.context.stroke();
      return "left";
    }

    if (from.y == to.y && fromSide == "bottom" && toSide == "bottom") {
      this.canvas.context.beginPath();
      this.canvas.context.moveTo(from.x, from.y);
      this.canvas.context.lineTo(from.x, from.y + CANVAS_GRID_SIZE * 2);
      this.canvas.context.lineTo(to.x, from.y + CANVAS_GRID_SIZE * 2);
      this.canvas.context.lineTo(to.x, to.y);
      this.canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      this.canvas.context.strokeStyle = color;
      this.canvas.context.stroke();
      return "up";
    }

    if (from.y == to.y && fromSide == "top" && toSide == "top") {
      this.canvas.context.beginPath();
      this.canvas.context.moveTo(from.x, from.y);
      this.canvas.context.lineTo(from.x, from.y - CANVAS_GRID_SIZE * 2);
      this.canvas.context.lineTo(to.x, from.y - CANVAS_GRID_SIZE * 2);
      this.canvas.context.lineTo(to.x, to.y);
      this.canvas.context.lineWidth = CANVAS_LINE_WIDTH;
      this.canvas.context.strokeStyle = color;
      this.canvas.context.stroke();
      return "down";
    }

    this.canvas.context.beginPath();
    this.canvas.context.moveTo(from.x, from.y);
    this.canvas.context.lineTo(to.x, to.y);
    this.canvas.context.lineWidth = CANVAS_LINE_WIDTH;
    this.canvas.context.strokeStyle = color;
    this.canvas.context.stroke();

    if (fromSide == "bottom" && toSide == "top") return "down";
    if (fromSide == "top" && toSide == "bottom") return "up";
    if (fromSide == "left" && toSide == "right") return "left";
    if (fromSide == "right" && toSide == "left") return "right";
  }

  drawArrowHeadInCanvas(to, arrowDirection, color) {
    let step_1: IPosition = null;
    let step_2: IPosition = null;
    let step_3: IPosition = null;

    if (arrowDirection == "right") {
      step_1 = {
        x: to.x - CANVAS_ARROW_HEIGHT,
        y: to.y - CANVAS_ARROW_WIDTH,
      };
      step_2 = { x: to.x, y: to.y };
      step_3 = {
        x: to.x - CANVAS_ARROW_HEIGHT,
        y: to.y + CANVAS_ARROW_WIDTH,
      };
    }

    if (arrowDirection == "left") {
      step_1 = {
        x: to.x + CANVAS_ARROW_HEIGHT,
        y: to.y - CANVAS_ARROW_WIDTH,
      };
      step_2 = { x: to.x, y: to.y };
      step_3 = {
        x: to.x + CANVAS_ARROW_HEIGHT,
        y: to.y + CANVAS_ARROW_WIDTH,
      };
    }

    if (arrowDirection == "down") {
      step_1 = {
        x: to.x - CANVAS_ARROW_WIDTH,
        y: to.y - CANVAS_ARROW_HEIGHT,
      };
      step_2 = { x: to.x, y: to.y };
      step_3 = {
        x: to.x + CANVAS_ARROW_WIDTH,
        y: to.y - CANVAS_ARROW_HEIGHT,
      };
    }

    if (arrowDirection == "up") {
      step_1 = {
        x: to.x - CANVAS_ARROW_WIDTH,
        y: to.y + CANVAS_ARROW_HEIGHT,
      };
      step_2 = { x: to.x, y: to.y };
      step_3 = {
        x: to.x + CANVAS_ARROW_WIDTH,
        y: to.y + CANVAS_ARROW_HEIGHT,
      };
    }

    this.canvas.context.beginPath();
    this.canvas.context.moveTo(step_1.x, step_1.y);
    this.canvas.context.lineTo(step_2.x, step_2.y);
    this.canvas.context.lineTo(step_3.x, step_3.y);
    this.canvas.context.fillStyle = color;
    this.canvas.context.fill();
  }

  addDirectionIntoWorkflowTree(endDirectionNode) {
    if (!this.workflowGraph.hasOwnProperty(this.startDirectionNode.id)) {
      this.workflowGraph[this.startDirectionNode.id] = {};
    }

    this.workflowGraph[this.startDirectionNode.id][
      endDirectionNode.id
    ] = this.startDirectionNode.type;
  }

  executeWorkflow() {
    console.log(this.workflowItems);
    console.log(this.workflowGraph);
    this.http
      .post("http://localhost:3000/workflow/execute", {
        items: this.workflowItems,
        graph: this.workflowGraph,
      })
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
