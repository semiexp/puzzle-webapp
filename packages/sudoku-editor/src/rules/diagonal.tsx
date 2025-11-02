import { Rule, PRIORITY_DIAGNOAL, RenderOptions2 } from "../rule";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type DiagonalState = object;
type DiagonalData = {
  mainDiagonal: boolean;
  antiDiagonal: boolean;
};

export const diagonalRule: Rule<DiagonalState, DiagonalData> = {
  name: "diagonal",
  initialState: {},
  initialData: () => ({
    mainDiagonal: true,
    antiDiagonal: true,
  }),
  booleanFlags: ["mainDiagonal", "antiDiagonal"],
  eventTypes: [],
  reducer: () => {
    return {};
  },
  render: (_state, data, options: RenderOptions2) => {
    const items: BoardItem[] = [];

    const { boardSize } = options;
    if (data.mainDiagonal) {
      for (let i = 0; i < boardSize; ++i) {
        items.push({
          y: i * 2 + 1,
          x: i * 2 + 1,
          color: "black",
          item: "dottedBackslash",
        });
      }
    }
    if (data.antiDiagonal) {
      for (let i = 0; i < boardSize; ++i) {
        items.push({
          y: i * 2 + 1,
          x: (boardSize - i - 1) * 2 + 1,
          color: "black",
          item: "dottedSlash",
        });
      }
    }

    return [
      {
        priority: PRIORITY_DIAGNOAL,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];
    if (data.mainDiagonal) {
      items.push({ kind: "diagonal", direction: "main" });
    }
    if (data.antiDiagonal) {
      items.push({ kind: "diagonal", direction: "anti" });
    }
    return { items, margin: 0 };
  },
};
