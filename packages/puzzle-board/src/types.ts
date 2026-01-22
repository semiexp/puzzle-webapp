export type Board = {
  kind: "grid";
  height: number;
  width: number;
  defaultStyle: "outer_grid" | "grid" | "dots" | "empty";
  data: BoardItem[];
  isUnique?: boolean;
  hasAnswer?: boolean;
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
  | FireflyItem
  | TextItem
  | CompassItem
  | TapaClueItem
  | SudokuCandidateSetItem
  | SudokuForbiddenCandidateMarkerItem
  | { kind: "lineTo"; destY: number; destX: number }
  | ThermoItem
  | ArrowItem
  | RegionBorderItem;

export type CompassItem = {
  kind: "compass";
  up: number;
  down: number;
  left: number;
  right: number;
};

export type TapaClueItem = {
  kind: "tapaClue";
  value: number[];
};

export type FireflyItem = {
  kind: "firefly";
  dot: "up" | "down" | "left" | "right";
  value: number;
};

export type ThermoItem = { kind: "thermo"; cells: { y: number; x: number }[] };

export type ArrowItem = { kind: "arrow"; cells: { y: number; x: number }[] };

export type RegionBorderItem = {
  kind: "regionBorder";
  cells: { y: number; x: number }[];
};

export type SudokuCandidateSetItem = {
  kind: "sudokuCandidateSet";
  size: number;
  values: number[];
};
export type SudokuForbiddenCandidateMarkerItem = {
  kind: "sudokuForbiddenCandidateMarker";
  size: number;
  values: number[];
};

export type TextItem = {
  kind: "text";
  data: string;
  pos?: string;
  size?: number;
};

export type RenderEnv = {
  offsetY: number;
  offsetX: number;
  unitSize: number;
};

export type ItemRenderingSpec = {
  globalOffsetY: number;
  globalOffsetX: number;
  y: number;
  x: number;
  centerY: number;
  centerX: number;
  unitSize: number;
  color: string;
};
