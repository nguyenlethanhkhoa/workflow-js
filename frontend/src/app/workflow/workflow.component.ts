import * as $ from "jquery";
import "jquery-ui-dist/jquery-ui";

import { Component, OnInit, AfterViewInit, Input } from "@angular/core";
import { CANVAS_GRID_SIZE } from "../interface/canvas.interface";
import { INode, IDirection } from "../interface/direction.interface";
import { IWorkflow, IWorkflowItem } from "../interface/workflow.interface";
import { WorkflowService } from "../api/workflow.service";
import { WORKFLOW_ITEM } from "./workflow-item/workflow-item.config";
import { Canvas } from "../model/canvas";

@Component({
    selector: "app-workflow",
    templateUrl: "./workflow.component.html",
    styleUrls: ["./workflow.component.css"],
})
export class WorkflowComponent implements OnInit, AfterViewInit {
    @Input() workflow: IWorkflow;

    public items: any = [{ id: 0 }];
    public isSaving: boolean = false;

    private isDrawing: boolean = false;

    private canvas: Canvas;
    private autoIncrementId = 0;
    private startDirectionNode: INode;

    constructor(private workflowService: WorkflowService) { }

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

        this.canvas = new Canvas("canvas");
        this.canvas.size(window.innerWidth, window.innerWidth);
        this.canvas.toggleGrid();

        this._initDraggableInWorkflowItem();
    }

    public saveWorkflow(): void {
        if (!this.isSaving) {
            this.isSaving = true;
            return;
        }

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
        this.isDrawing = !this.isDrawing;

        // start direction
        if (this.isDrawing) {
            this.startDirectionNode = node;
            return;
        }

        // end direction
        if (
            typeof this.startDirectionNode != "object" ||
            !this.startDirectionNode.position
        ) {
            return;
        }

        if (this.startDirectionNode.id == node.id) {
            //show duplicated item error

            return;
        }

        const direction: IDirection = {
            from: this.startDirectionNode.position,
            fromSide: this.startDirectionNode.side,
            color: this.startDirectionNode.color,
            to: node.position,
            toSide: node.side,
            direction: null,
            paths: null,
        };

        this.canvas.addArrow(direction);
        this._addWorkflowDirection(node, direction);
        this.startDirectionNode = null;
    }

    private _addWorkflowDirection(
        endDirectionNode: INode,
        direction: IDirection
    ): void {
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

        this.workflow.items[this.startDirectionNode.id].uiDirections[
            this.startDirectionNode.side
        ] = direction;
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
}
