import {
  Rule,
  PRIORITY_FORBIDDEN_CANDIDATES,
  PRIORITY_SELECTED_CELL_MARKER,
  RenderOptions2,
} from "../rule";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type ForbiddenCandidatesState = {
  selectedCell: { y: number; x: number } | null;
};

type ForbiddenCandidatesData = {
  isForbidden: boolean[][][];
};

export const forbiddenCandidatesRule: Rule<
  ForbiddenCandidatesState,
  ForbiddenCandidatesData
> = {
  name: "forbiddenCandidates",
  initialState: { selectedCell: null },
  initialData: (size: number) => {
    const isForbidden = [];
    for (let i = 0; i < size; ++i) {
      const row = [];
      for (let j = 0; j < size; ++j) {
        row.push(new Array(size).fill(false));
      }
      isForbidden.push(row);
    }
    return { isForbidden };
  },
  eventTypes: ["cellMouseDown", "keyDown"],
  reducer: (state, data, event) => {
    if (event.type === "cellMouseDown") {
      const y = event.y;
      const x = event.x;
      if (
        0 <= y &&
        y < data.isForbidden.length &&
        0 <= x &&
        x < data.isForbidden[y].length
      ) {
        const newState = { ...state, selectedCell: { y, x } };
        return { state: newState };
      }
    } else if (event.type === "keyDown") {
      if (state.selectedCell === null) {
        return {};
      }
      const { selectedCell } = state;
      const { y, x } = selectedCell;

      const key = event.key;

      if (key === "ArrowUp") {
        if (y > 0) {
          const newState = { ...state, selectedCell: { y: y - 1, x } };
          return { state: newState };
        }
      } else if (key === "ArrowDown") {
        if (y < data.isForbidden.length - 1) {
          const newState = { ...state, selectedCell: { y: y + 1, x } };
          return { state: newState };
        }
      } else if (key === "ArrowLeft") {
        if (x > 0) {
          const newState = { ...state, selectedCell: { y, x: x - 1 } };
          return { state: newState };
        }
      } else if (key === "ArrowRight") {
        if (x < data.isForbidden[y].length - 1) {
          const newState = { ...state, selectedCell: { y, x: x + 1 } };
          return { state: newState };
        }
      } else if (key === "Backspace" || key === "Delete") {
        const newIsForbidden = data.isForbidden.map((row) =>
          row.map((cell) => cell.slice()),
        );
        newIsForbidden[y][x] = new Array(data.isForbidden[y][x].length).fill(
          false,
        );
        const newData = { isForbidden: newIsForbidden };
        return { data: newData };
      } else {
        const n = parseInt(key, 36);
        if (1 <= n && n <= data.isForbidden.length) {
          const newIsForbidden = data.isForbidden.map((row) =>
            row.map((cell) => cell.slice()),
          );
          newIsForbidden[y][x][n - 1] = !newIsForbidden[y][x][n - 1];
          const newData = { isForbidden: newIsForbidden };
          return { data: newData };
        }
      }
    }

    return {};
  },
  render: (state, data, _options: RenderOptions2) => {
    const items: BoardItem[] = [];
    const backgroundItems: BoardItem[] = [];

    if (state !== null && state.selectedCell !== null) {
      const { selectedCell } = state;
      const { y, x } = selectedCell;

      backgroundItems.push({
        y: y * 2 + 1,
        x: x * 2 + 1,
        color: "rgb(255, 216, 216)",
        item: "fill",
      });
    }

    const w = Math.ceil(Math.sqrt(data.isForbidden.length));

    for (let y = 0; y < data.isForbidden.length; ++y) {
      for (let x = 0; x < data.isForbidden[y].length; ++x) {
        const forbiddenValues: number[] = [];
        for (let n = 0; n < data.isForbidden[y][x].length; ++n) {
          if (data.isForbidden[y][x][n]) {
            forbiddenValues.push(n + 1);
          }
        }

        if (forbiddenValues.length > 0) {
          items.push({
            y: y * 2 + 1,
            x: x * 2 + 1,
            color: "black",
            item: {
              kind: "sudokuForbiddenCandidateMarker",
              size: w,
              values: forbiddenValues,
            },
          });
        }
      }
    }

    const result = [
      {
        priority: PRIORITY_FORBIDDEN_CANDIDATES,
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

    for (let y = 0; y < data.isForbidden.length; ++y) {
      for (let x = 0; x < data.isForbidden[y].length; ++x) {
        const forbiddens = data.isForbidden[y][x];
        if (forbiddens.some((v) => v)) {
          const value = forbiddens
            .map((v, i) => (v ? (i + 1).toString() : null))
            .filter((v) => v !== null)
            .join("");
          items.push({
            kind: "smallText",
            position: { y, x, position: "ul" },
            value: "X" + value,
            style: 10,
          });
        }
      }
    }
    return { items, margin: 0 };
  },
};
