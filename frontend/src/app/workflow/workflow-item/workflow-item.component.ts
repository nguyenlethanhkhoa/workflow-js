import * as $ from "jquery";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { CANVAS_GRID_SIZE, IPosition } from "src/app/model/canvas.interface";
import { WORKFLOW_ITEM } from "./workflow-item.config";

@Component({
  selector: "app-workflow-item",
  templateUrl: "./workflow-item.component.html",
  styleUrls: ["./workflow-item.component.css"],
})
export class WorkflowItemComponent implements OnInit, AfterViewInit {
  @Input() id;
  @Output() item = new EventEmitter<any>();
  @Output() nodeBinding = new EventEmitter<any>();
  public model: any = {};
  public deleted: boolean = false;
  public WORKFLOW_ITEM: any = WORKFLOW_ITEM;

  constructor() {}

  ngOnInit() {
    this.model.id = this.id;
    this.model.type =
      this.id == 0 ? WORKFLOW_ITEM.TYPE.START : WORKFLOW_ITEM.TYPE.WEB_ELEMENT;
    this.model.web_element_action = 0;
    this.model.condition_operator = 1;
    this.model.browser_action = 0;
  }

  ngAfterViewInit() {
    this.localeWorkflowItemNodes();
  }

  submit() {
    setTimeout(this.localeWorkflowItemNodes.bind(this), 0);
    $(`.workflow-item-body[id="${this.model.id}"]`).removeAttr("style");

    this.item.emit(this.getWorkflowItemData());
  }

  delete() {
    this.model = {};
    this.deleted = true;
    this.submit();
  }

  localeWorkflowItemNodes() {
    const item = $(`.workflow-item-body[id="${this.model.id}"]`);
    const width = item.outerWidth();
    let height = item.outerHeight();
    if ((height % CANVAS_GRID_SIZE) * 2 != 0) {
      height += CANVAS_GRID_SIZE * 2 - (height % (CANVAS_GRID_SIZE * 2));
      item.outerHeight(height);
    }

    item.find(".top-node").css({ top: -4, left: (width - 6) / 2 });
    item.find(".left-node").css({ top: (height - 6) / 2, left: -4 });
    item.find(".right-node").css({ top: (height - 6) / 2, right: -4 });
    item.find(".bottom-node").css({ bottom: -4, left: (width - 6) / 2 });
  }

  bindingNode(event, side) {
    const offset = $(event.srcElement).offset();
    let position: IPosition = {
      x: 0,
      y: 0,
    };

    if (side == "top") {
      position.y = offset.top + 3;
      position.x = offset.left + 3;
    }

    if (side == "left") {
      position.y = offset.top + 3;
      position.x = offset.left + 3;
    }

    if (side == "right") {
      position.y = offset.top + 3;
      position.x = offset.left - 3;
    }

    if (side == "bottom") {
      position.y = offset.top - 3;
      position.x = offset.left + 3;
    }

    const type = $(event.srcElement).hasClass("true-node")
      ? "true"
      : $(event.srcElement).hasClass("false-node")
      ? "false"
      : "default";

    this.nodeBinding.emit({
      id: this.model.id,
      side: side,
      type: type,
      position: position,
      color: $(event.srcElement).css("backgroundColor"),
    });
  }

  getWorkflowItemData() {
    let type = "";
    for (let prop in WORKFLOW_ITEM.TYPE) {
      if (WORKFLOW_ITEM.TYPE[prop] == this.model.type) {
        type = prop.toLowerCase();
        break;
      }
    }

    let data: any = {};
    for (let prop in this.model) {
      if (prop.indexOf(type) != -1) {
        data[prop] = this.model[prop];
      }
    }

    data.id = this.model.id;
    data.type = this.model.type;
    return data;
  }
}
