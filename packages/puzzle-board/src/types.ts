export type Board = {
  kind: "grid";
  height: number;
  width: number;
  defaultStyle: "outer_grid" | "grid" | "dots" | "empty";
  data: BoardItem[];
  isUnique?: boolean;
};

export type BoardItem = {
  y: number;
  x: number;
  color: string;
  item: Item;
};

export type Item =
  | "dot"
  | "block"
  | "square"
  | "triangle"
  | "fill"
  | "circle"
  | "filledCircle"
  | "smallCircle"
  | "smallFilledCircle"
  | "middleFilledCircle"
  | "sideArrowUp"
  | "sideArrowDown"
  | "sideArrowLeft"
  | "sideArrowRight"
  | "arrowUp"
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "aboloUpperLeft"
  | "aboloUpperRight"
  | "aboloLowerLeft"
  | "aboloLowerRight"
  | "pencilUp"
  | "pencilDown"
  | "pencilLeft"
  | "pencilRight"
  | "fireflyUp"
  | "fireflyDown"
  | "fireflyLeft"
  | "fireflyRight"
  | "cross"
  | "line"
  | "dottedLine"
  | "doubleLine"
  | "wall"
  | "boldWall"
  | "dottedWall"
  | "bar"
  | "slash"
  | "backslash"
  | "dottedSlash"
  | "dottedBackslash"
  | "plus"
  | "dottedHorizontalWall"
  | "dottedVerticalWall"
  | "firewalkCellUnknown"
  | "firewalkCellUl"
  | "firewalkCellUr"
  | "firewalkCellDl"
  | "firewalkCellDr"
  | "firewalkCellUlDr"
  | "firewalkCellUrDl"
  | { kind: "firefly"; dot: "up" | "down" | "left" | "right"; value: number }
  | { kind: "text"; data: string; pos?: string; size?: number }
  | { kind: "compass"; up: number; down: number; left: number; right: number }
  | { kind: "tapaClue"; value: number[] }
  | { kind: "sudokuCandidateSet"; size: number; values: number[] }
  | { kind: "sudokuForbiddenCandidateMarker"; size: number; values: number[] }
  | { kind: "lineTo"; destY: number; destX: number }
  | { kind: "thermo"; cells: { y: number; x: number }[] }
  | { kind: "arrow"; cells: { y: number; x: number }[] }
  | { kind: "regionBorder"; cells: { y: number; x: number }[] };

export type RenderEnv = {
  offsetY: number;
  offsetX: number;
  unitSize: number;
};
