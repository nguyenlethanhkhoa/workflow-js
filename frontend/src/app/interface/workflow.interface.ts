import { IPosition, IDirectionList } from "./direction.interface";

export interface IWorkflow {
  name: string;
  items: IWorkflowItemList;
}

export interface IWorkflowItemList {
  [key: number]: IWorkflowItem;
}

export interface IWorkflowItem {
  data: any;
  position: IPosition;
  directions: any;
  uiDirections: IDirectionList;
}

export interface IWorkflowItemsPosition {
  [key: number]: IPosition;
}
