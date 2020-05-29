import * as $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import { HttpClient } from "@angular/common/http";
import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
import {
  ICanvas,
  CANVAS_ARROW_HEIGHT,
  CANVAS_ARROW_WIDTH,
  CANVAS_GRID_SIZE,
  CANVAS_LINE_WIDTH,
} from "../model/canvas.interface";
import { CanvasArrowService } from "../service/canvas-arrow.service";
import { IPosition, INode, IDirection } from "../model/direction.interface";
import {
  IWorkflowItemsPosition,
  IWorkflow,
  IWorkflowItem,
} from "../model/workflow.interface";
import { WorkflowService } from "../api/workflow.service";
import { WORKFLOW_ITEM } from "./workflow-item/workflow-item.config";

@Component({
  selector: "app-workflow",
  templateUrl: "./workflow.component.html",
  styleUrls: ["./workflow.component.css"],
})
export class WorkflowComponent implements OnInit, AfterViewInit {
  @Input() workflow: IWorkflow;

  public items: any = [{ id: 0 }];
  public isSaving: boolean = false;

  private startDirectionNode: INode;
  private autoIncrementId = 0;
  private canvas: ICanvas = {
    element: null,
    context: null,
    isDrawingNodeDirection: false,
    nodeDirection: null,
  };

  constructor(
    private workflowService: WorkflowService,
    private canvasArrowService: CanvasArrowService
  ) {}

  ngOnInit() {
    if (this.workflow) {
      return;
    }

    const start: IWorkflowItem = {
      data: { id: 0, type: WORKFLOW_ITEM.TYPE.START },
      position: { x: 0, y: 0 },
      directions: {},
      uiDirections: {},
    };

    this.workflow = {
      name: "",
      items: { 0: start },
    };
  }

  ngAfterViewInit() {
    $(".canvas-wrapper").width(window.innerWidth);
    $(".canvas-wrapper").height(window.innerHeight);

    this.canvas.element = <HTMLCanvasElement>document.getElementById("canvas");
    this.canvas.element.width = window.innerWidth;
    this.canvas.element.height = window.innerHeight;
    this.canvas.context = this.canvas.element.getContext("2d");
    this._initGridInCanvas();
    this._initDraggableInWorkflowItem();

    // this._temporaryFunc().then((resp) => {
    //   this.workflow = JSON.parse(resp.items[0].content);
    //   this.items = resp.workflow.items;
    //   this.workflowGraph = resp.workflow.graph;

    //   setTimeout(() => {
    //     for (let workflowId in this.workflow.itemsPosition) {
    //       if (!this.workflow.itemsPosition.hasOwnProperty(workflowId)) {
    //         return;
    //       }

    //       $(`.workflow-item-body#${workflowId}`).parent().css({
    //         top: this.workflow.itemsPosition[workflowId].y,
    //         left: this.workflow.itemsPosition[workflowId].x,
    //       });
    //     }
    //   }, 0);

    //   for (let i = 0; i < this.workflow.directions.length; i++) {
    //     this.canvas.nodeDirection = this.workflow.directions[i];
    //     this.canvasArrowService.draw(this.canvas);
    //     this.canvas.nodeDirection = null;
    //   }
    // });
  }

  public saveWorkflow(): void {
    if (!this.isSaving) {
      this.isSaving = true;
      return;
    }

    console.log(this.workflow);

    // this.workflowService
    //   .save({
    //     name: this.workflowName,
    //     workflow: {
    //       items: this.items,
    //       graph: this.workflowGraph,
    //       directions: this.workflowDirections,
    //       itemsPosition: this.workflowItemsPosition,
    //     },
    //   })
    //   .subscribe((resp) => {
    //     console.log(resp);
    //     this.isSaving = false;
    //   });
  }

  public addWorkflowItem(): void {
    this.autoIncrementId++;
    this.items.push({ id: this.autoIncrementId });
    this.workflow.items[this.autoIncrementId] = {
      data: { id: this.autoIncrementId },
      position: { x: 0, y: 0 },
      directions: {},
      uiDirections: {},
    };
  }

  public executeWorkflow(): void {
    this.workflowService
      .execute({
        workflow: this.workflow,
      })
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  public buildWorkflowItem(item: any): void {
    console.log(this.workflow);
    this.workflow.items[item.id].data = item;
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

  public drawWorkflowDirectionInCanvas(node: INode): void {
    this.canvas.isDrawingNodeDirection = !this.canvas.isDrawingNodeDirection;

    // start direction
    if (this.canvas.isDrawingNodeDirection) {
      this.startDirectionNode = node;

      this.canvas.nodeDirection = {
        from: node.position,
        fromSide: node.side,
        to: null,
        toSide: null,
        color: node.color,
        direction: null,
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

    this._addWorkflowDirection(node);

    this.canvas.nodeDirection.to = node.position;
    this.canvas.nodeDirection.toSide = node.side;
    this.workflow.items[this.startDirectionNode.id].uiDirections[
      this.canvas.nodeDirection.fromSide
    ] = this.canvas.nodeDirection;

    this.canvasArrowService.draw(this.canvas);
    this.canvas.nodeDirection = null;
  }

  private _initGridInCanvas(): void {
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

  private _addWorkflowDirection(endDirectionNode: INode): void {
    if (
      !this.workflow.items[
        this.startDirectionNode.id
      ].directions.hasOwnProperty(this.startDirectionNode.id)
    ) {
      this.workflow.items[this.startDirectionNode.id].directions = {};
    }

    this.workflow.items[this.startDirectionNode.id].directions[
      endDirectionNode.id
    ] = this.startDirectionNode.type;
  }

  private _initDraggableInWorkflowItem() {
    $("body").delegate(".workflow-item", "mouseover", (e) => {
      $(e.currentTarget).draggable({
        stop: (event, ui) => {
          let top = Math.floor(ui.position.top / CANVAS_GRID_SIZE);
          if (ui.position.top % CANVAS_GRID_SIZE >= CANVAS_GRID_SIZE / 2) {
            top = Math.floor(ui.position.top / CANVAS_GRID_SIZE) + 1;
          }

          let left = Math.floor(ui.position.left / CANVAS_GRID_SIZE);
          if (ui.position.left % CANVAS_GRID_SIZE >= CANVAS_GRID_SIZE / 2) {
            left = Math.floor(ui.position.left / CANVAS_GRID_SIZE) + 1;
          }

          $(event.target).css({
            top: top * CANVAS_GRID_SIZE,
            left: left * CANVAS_GRID_SIZE,
          });

          const id = $(event.target).find(".workflow-item-body").attr("id");
          this.workflow.items[parseInt(id)].position = {
            x: left * CANVAS_GRID_SIZE,
            y: top * CANVAS_GRID_SIZE,
          };
        },
      });
    });
  }

  // this function is defined for test. It will be delete later.
  private async _temporaryFunc() {
    return await this.workflowService.list().toPromise();
  }
}
