import { Rule, PRIORITY_ARROW, RenderOptions2 } from "../rule";
import { reducerForLines } from "./linesUtil";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type Arrow = { y: number; x: number }[];

type ArrowState = {
  currentArrow: Arrow | null;
};

type ArrowData = {
  arrows: Arrow[];
};

export const arrowRule: Rule<ArrowState, ArrowData> = {
  name: "arrow",
  initialState: { currentArrow: null },
  initialData: () => ({
    arrows: [],
  }),
  eventTypes: ["cellMouseDown", "cellMouseMove", "mouseUp"],
  reducer: (state, data, event, info) => {
    return reducerForLines(state, data, "currentArrow", "arrows", event, info);
  },
  render2: (state, data, _options: RenderOptions2) => {
    const items: BoardItem[] = [];

    const addArrow = (arrow: Arrow, color: string) => {
      if (arrow.length === 0) return;

      const start = arrow[0];
      const cells = arrow.slice(1).map((cell) => ({
        y: cell.y * 2 + 1,
        x: cell.x * 2 + 1,
      }));

      items.push({
        y: start.y * 2 + 1,
        x: start.x * 2 + 1,
        color: color,
        item: {
          kind: "arrow",
          cells: cells,
        },
      });
    };

    for (let i = 0; i < data.arrows.length; ++i) {
      addArrow(data.arrows[i], "rgb(192, 192, 192)");
    }
    if (state && state.currentArrow) {
      addArrow(state.currentArrow, "rgb(255, 176, 176)");
    }

    return [
      {
        priority: PRIORITY_ARROW,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = data.arrows.map((arrow) => ({
      kind: "arrow",
      cells: arrow,
    }));
    return { items, margin: 0 };
  },
};
