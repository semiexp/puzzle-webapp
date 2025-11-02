import { Rule, PRIORITY_THERMO, RenderOptions2 } from "../rule";
import { reducerForLines } from "./linesUtil";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type Thermo = { y: number; x: number }[];

type ThermoState = {
  currentThermo: Thermo | null;
};

type ThermoData = {
  thermos: Thermo[];
};

export const thermoRule: Rule<ThermoState, ThermoData> = {
  name: "thermo",
  initialState: { currentThermo: null },
  initialData: () => ({
    thermos: [],
  }),
  eventTypes: ["cellMouseDown", "cellMouseMove", "mouseUp"],
  reducer: (state, data, event, info) => {
    return reducerForLines(
      state,
      data,
      "currentThermo",
      "thermos",
      event,
      info,
    );
  },
  render: (state, data, _options: RenderOptions2) => {
    const items: BoardItem[] = [];

    const addThermo = (thermo: Thermo, color: string) => {
      if (thermo.length === 0) return;

      const start = thermo[0];
      const cells = thermo.slice(1).map((cell) => ({
        y: cell.y * 2 + 1,
        x: cell.x * 2 + 1,
      }));

      items.push({
        y: start.y * 2 + 1,
        x: start.x * 2 + 1,
        color: color,
        item: {
          kind: "thermo",
          cells: cells,
        },
      });
    };

    for (let i = 0; i < data.thermos.length; ++i) {
      addThermo(data.thermos[i], "rgb(208, 208, 208)");
    }
    if (state && state.currentThermo) {
      addThermo(state.currentThermo, "rgb(255, 176, 176)");
    }

    return [
      {
        priority: PRIORITY_THERMO,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = data.thermos.map((thermo) => ({
      kind: "thermo",
      cells: thermo,
    }));
    return { items, margin: 0 };
  },
};
