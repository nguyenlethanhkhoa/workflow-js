export interface IDirection {
  from: IPosition;
  fromSide: SIDE;
  to: IPosition;
  toSide: SIDE;
  color: string;
  direction: DIRECTION;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface INode {
  id: number;
  side: SIDE;
  type: string;
  position: IPosition;
  color: string;
}

export enum SIDE {
  TOP = 1,
  LEFT = 2,
  RIGHT = 3,
  BOTTOM = 4,
}

export enum DIRECTION {
  UP = 1,
  LEFT = 2,
  DOWN = 3,
  RIGHT = 4,
}
