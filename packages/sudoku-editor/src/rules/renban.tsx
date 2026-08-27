import { Rule, PRIORITY_RENBAN } from "../rule";
import { reducerForLines } from "./linesUtil";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type Renban = { y: number; x: number }[];

type RenbanState = {
  currentRenban: Renban | null;
};

type RenbanData = {
  renbans: Renban[];
};

export const renbanRule: Rule<RenbanState, RenbanData> = {
  name: "renban",
  initialState: { currentRenban: null },
  initialData: () => ({
    renbans: [],
  }),
  eventTypes: ["cellMouseDown", "cellMouseMove", "mouseUp"],
  reducer: (state, data, event, info) => {
    return reducerForLines(
      state,
      data,
      "currentRenban",
      "renbans",
      event,
      info,
    );
  },
  render: (state, data) => {
    const items: BoardItem[] = [];

    const addRenban = (renban: Renban, color: string) => {
      for (let j = 0; j < renban.length - 1; ++j) {
        const start = renban[j];
        const end = renban[j + 1];

        items.push({
          y: start.y * 2 + 1,
          x: start.x * 2 + 1,
          color,
          item: {
            kind: "lineTo",
            destY: end.y * 2 + 1,
            destX: end.x * 2 + 1,
          },
        });
      }
    };

    for (const renban of data.renbans) {
      addRenban(renban, "rgb(216, 176, 216)");
    }
    if (state && state.currentRenban) {
      addRenban(state.currentRenban, "rgb(216, 176, 255)");
    }

    return [
      {
        priority: PRIORITY_RENBAN,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];

    for (const renban of data.renbans) {
      for (let i = 0; i < renban.length - 1; ++i) {
        items.push({
          kind: "line",
          position1: renban[i],
          position2: renban[i + 1],
          style: 5,
        });
      }
    }

    return { items, margin: 0 };
  },
};
