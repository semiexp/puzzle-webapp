import {
  Rule,
  PRIORITY_SELECTED_CELL_MARKER,
  PRIORITY_XSUMS_NUMBERS,
} from "../rule";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

import { SelectedOutsiceCell, reducerForOutsideCell } from "./outsideUtil";

type xSumsState = {
  selectedOutsideCell: SelectedOutsiceCell | null;
};

type xSumsData = {
  up: (number | null)[];
  down: (number | null)[];
  left: (number | null)[];
  right: (number | null)[];
};

export const xSumsRule: Rule<xSumsState, xSumsData> = {
  name: "xSums",
  initialState: { selectedOutsideCell: null },
  initialData: (size: number) => ({
    up: new Array(size).fill(null),
    down: new Array(size).fill(null),
    left: new Array(size).fill(null),
    right: new Array(size).fill(null),
  }),
  eventTypes: ["cellMouseDown", "keyDown"],
  reducer: (state, data, event, info) => {
    if (event.type === "keyDown" && state.selectedOutsideCell !== null) {
      if (event.key.match(/^[0-9]$/) || event.key === "Backspace") {
        const newData = { ...data };
        const side = state.selectedOutsideCell.side;
        const pos = state.selectedOutsideCell.pos;
        newData[side] = [...newData[side]];

        if (event.key === "Backspace") {
          newData[side][pos] = null;
        } else {
          const v = parseInt(event.key, 10);
          let n = (newData[side][pos] ?? 0) * 10 + v;
          if (n > (info.boardSize * (info.boardSize + 1)) / 2) {
            n = v;
          }
          newData[side][pos] = n;
        }
        return { data: newData };
      }
    }
    return reducerForOutsideCell(state, event, info);
  },
  render: (state, data) => {
    const items: BoardItem[] = [];
    const backgroundItems: BoardItem[] = [];

    if (state !== null && state?.selectedOutsideCell !== null) {
      const side = state.selectedOutsideCell.side;
      const pos = state.selectedOutsideCell.pos;

      const x =
        side === "left" ? -1 : side === "right" ? data.left.length : pos;
      const y = side === "up" ? -1 : side === "down" ? data.up.length : pos;

      backgroundItems.push({
        y: y * 2 + 1,
        x: x * 2 + 1,
        color: "rgba(255, 216, 216)",
        item: "fill",
      });
    }

    for (let i = 0; i < data.up.length; ++i) {
      if (data.up[i] !== null) {
        items.push({
          y: -1 * 2 + 1,
          x: i * 2 + 1,
          color: "black",
          item: { kind: "text", data: String(data.up[i]), size: 7.0 / 8.0 },
        });
      }
    }

    for (let i = 0; i < data.down.length; ++i) {
      if (data.down[i] !== null) {
        items.push({
          y: data.down.length * 2 + 1,
          x: i * 2 + 1,
          color: "black",
          item: { kind: "text", data: String(data.down[i]), size: 7.0 / 8.0 },
        });
      }
    }

    for (let i = 0; i < data.left.length; ++i) {
      if (data.left[i] !== null) {
        items.push({
          y: i * 2 + 1,
          x: -1 * 2 + 1,
          color: "black",
          item: { kind: "text", data: String(data.left[i]), size: 7.0 / 8.0 },
        });
      }
    }

    for (let i = 0; i < data.right.length; ++i) {
      if (data.right[i] !== null) {
        items.push({
          y: i * 2 + 1,
          x: data.right.length * 2 + 1,
          color: "black",
          item: { kind: "text", data: String(data.right[i]), size: 7.0 / 8.0 },
        });
      }
    }

    const result = [
      {
        priority: PRIORITY_XSUMS_NUMBERS,
        item: items,
      },
    ];

    if (backgroundItems.length > 0) {
      result.push({
        priority: PRIORITY_SELECTED_CELL_MARKER,
        item: backgroundItems,
      });
    }

    return result;
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];

    const n = data.up.length;
    for (let i = 0; i < n; ++i) {
      if (data.up[i] !== null) {
        items.push({
          kind: "text",
          position: { y: -1, x: i },
          value: data.up[i]!.toString(),
          color: 1,
          style: "1",
        });
      }
      if (data.down[i] !== null) {
        items.push({
          kind: "text",
          position: { y: n, x: i },
          value: data.down[i]!.toString(),
          color: 1,
          style: "1",
        });
      }
      if (data.left[i] !== null) {
        items.push({
          kind: "text",
          position: { y: i, x: -1 },
          value: data.left[i]!.toString(),
          color: 1,
          style: "1",
        });
      }
      if (data.right[i] !== null) {
        items.push({
          kind: "text",
          position: { y: i, x: n },
          value: data.right[i]!.toString(),
          color: 1,
          style: "1",
        });
      }
    }

    return { items, margin: 1 };
  },
};
