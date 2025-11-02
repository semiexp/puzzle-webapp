import { Rule, PRIORITY_ODD_EVEN, RenderOptions } from "../rule";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type OddEvenState = object;

type OddEvenData = {
  cellKind: number[][];
};

export const oddEvenRule: Rule<OddEvenState, OddEvenData> = {
  name: "oddEven",
  initialState: {},
  initialData: (size: number) => {
    const cellKind = new Array(size).fill(0).map(() => new Array(size).fill(0));
    return { cellKind };
  },
  eventTypes: ["cellMouseDown"],
  reducer: (_state, data, event) => {
    if (event.type === "cellMouseDown") {
      const y = event.y;
      const x = event.x;
      if (
        0 <= y &&
        y < data.cellKind.length &&
        0 <= x &&
        x < data.cellKind[y].length
      ) {
        const newCellKind = data.cellKind.map((row) => [...row]);
        newCellKind[y][x] = (newCellKind[y][x] + 1) % 3;
        return { data: { ...data, cellKind: newCellKind } };
      }
    }
    return {};
  },
  render: (_state, data, _options: RenderOptions) => {
    const items: BoardItem[] = [];

    for (let y = 0; y < data.cellKind.length; ++y) {
      for (let x = 0; x < data.cellKind[y].length; ++x) {
        if (data.cellKind[y][x] === 1) {
          items.push({
            y: y * 2 + 1,
            x: x * 2 + 1,
            color: "rgba(128, 128, 128, 0.5)",
            item: "filledCircle",
          });
        } else if (data.cellKind[y][x] === 2) {
          items.push({
            y: y * 2 + 1,
            x: x * 2 + 1,
            color: "rgba(128, 128, 128, 0.5)",
            item: "block",
          });
        }
      }
    }

    return [
      {
        priority: PRIORITY_ODD_EVEN,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];
    for (let y = 0; y < data.cellKind.length; y++) {
      for (let x = 0; x < data.cellKind[y].length; x++) {
        const kind = data.cellKind[y][x];
        if (kind === 1) {
          items.push({
            kind: "symbol",
            position: { y, x },
            color: 3,
            symbolName: "circle_L",
            isFront: false,
          });
        } else if (kind === 2) {
          items.push({
            kind: "symbol",
            position: { y, x },
            color: 3,
            symbolName: "square_L",
            isFront: false,
          });
        }
      }
    }
    return { items, margin: 0 };
  },
};
