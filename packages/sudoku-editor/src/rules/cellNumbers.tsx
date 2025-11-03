import { EditorEvent, EditorEventType } from "../events";
import { PRIORITY_SELECTED_CELL_MARKER, RenderOptions } from "../rule";
import { BoardItem } from "puzzle-board";

export type CellNumbersState = {
  selectedCell: { y: number; x: number } | null;
};

export type CellNumbersData = {
  numbers: (number | null)[][];
};

export const cellNumbersRule = {
  initialState: { selectedCell: null },
  initialData: (size: number) => {
    const numbers = [];
    for (let i = 0; i < size; i++) {
      numbers.push(new Array(size).fill(null));
    }
    return { numbers };
  },
  eventTypes: ["cellMouseDown", "keyDown"] as EditorEventType[],
  reducer: (
    state: CellNumbersState,
    data: CellNumbersData,
    event: EditorEvent,
  ) => {
    if (state === undefined) {
      return {};
    }

    if (event.type === "cellMouseDown") {
      const y = event.y;
      const x = event.x;
      if (
        0 <= y &&
        y < data.numbers.length &&
        0 <= x &&
        x < data.numbers[y].length
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

      if (key === "ArrowUp" || key === "w") {
        if (y > 0) {
          const newState = { ...state, selectedCell: { y: y - 1, x } };
          return { state: newState };
        }
      } else if (key === "ArrowDown" || key === "s") {
        if (y < data.numbers.length - 1) {
          const newState = { ...state, selectedCell: { y: y + 1, x } };
          return { state: newState };
        }
      } else if (key === "ArrowLeft" || key === "a") {
        if (x > 0) {
          const newState = { ...state, selectedCell: { y, x: x - 1 } };
          return { state: newState };
        }
      } else if (key === "ArrowRight" || key === "d") {
        if (x < data.numbers[y].length - 1) {
          const newState = { ...state, selectedCell: { y, x: x + 1 } };
          return { state: newState };
        }
      } else if (key === "Backspace" || key === "Delete" || key === " ") {
        const newNumbers = data.numbers.map((row) => row.slice());
        newNumbers[y][x] = null;
        const newData = { ...data, numbers: newNumbers };
        return { data: newData };
      }
      // if key is a number
      const number = parseInt(key);
      if (!isNaN(number) && number >= 0 && number <= 9) {
        const newNumbers = data.numbers.map((row) => row.slice());

        let n = (newNumbers[y][x] ?? 0) * 10 + number;
        if (n > newNumbers.length) {
          n = number;
        }
        if (n === 0) {
          newNumbers[y][x] = null;
        } else {
          newNumbers[y][x] = n;
        }
        const newData = { ...data, numbers: newNumbers };
        return { data: newData };
      }
    }
    return {};
  },
  render: (
    state: CellNumbersState | null,
    data: CellNumbersData,
    _options: RenderOptions,
    textColor: string,
    numberPriority: number,
  ) => {
    const items: BoardItem[] = [];

    if (state !== null && state.selectedCell) {
      const { x, y } = state.selectedCell;

      items.push({
        y: y * 2 + 1,
        x: x * 2 + 1,
        color: "rgb(255, 216, 216)",
        item: "fill",
      });
    }

    for (let y = 0; y < data.numbers.length; y++) {
      for (let x = 0; x < data.numbers[y].length; x++) {
        const number = data.numbers[y][x];
        if (number !== null) {
          items.push({
            y: y * 2 + 1,
            x: x * 2 + 1,
            color: textColor,
            item: { kind: "text", data: String(number), size: 7.0 / 8.0 },
          });
        }
      }
    }

    const result = [
      {
        priority: numberPriority,
        item: items.filter(
          (item) => typeof item.item !== "string" || item.item !== "fill",
        ),
      },
    ];

    const backgroundItems = items.filter(
      (item) => typeof item.item === "string" && item.item === "fill",
    );
    if (backgroundItems.length > 0) {
      result.push({
        priority: PRIORITY_SELECTED_CELL_MARKER,
        item: backgroundItems,
      });
    }

    return result;
  },
};
