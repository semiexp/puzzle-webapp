import { Rule, PRIORITY_BORDER, RenderOptions2 } from "../rule";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type BlocksState = object;

type BlocksData = {
  horizontalBorder: boolean[][];
  verticalBorder: boolean[][];
};

export const blocksRule: Rule<BlocksState, BlocksData> = {
  name: "blocks",
  initialState: {}, // TODO
  initialData: (size: number, blockWidth: number) => {
    const horizontalBorder = [];
    const verticalBorder = [];

    for (let y = 0; y < size - 1; ++y) {
      horizontalBorder.push(new Array(size).fill(false));
    }
    for (let x = 0; x < size; ++x) {
      verticalBorder.push(new Array(size - 1).fill(false));
    }

    if (blockWidth > 0) {
      const blockHeight = Math.floor(size / blockWidth);
      for (let y = 0; y < size; ++y) {
        for (let x = 0; x < size; ++x) {
          if (y < size - 1 && (y + 1) % blockHeight === 0) {
            horizontalBorder[y][x] = true;
          }
          if (x < size - 1 && (x + 1) % blockWidth === 0) {
            verticalBorder[y][x] = true;
          }
        }
      }
    }

    return {
      horizontalBorder,
      verticalBorder,
    };
  },
  eventTypes: ["edgeMouseDown"],
  reducer: (_state, data, event) => {
    if (event.type === "edgeMouseDown") {
      const y = event.y;
      const x = event.x;

      if (event.direction === "horizontal") {
        if (
          !(
            1 <= y &&
            y <= data.horizontalBorder.length &&
            0 <= x &&
            x < data.horizontalBorder[y - 1].length
          )
        ) {
          return {};
        }
        const newHorizontalBorder = data.horizontalBorder.map((row) => [
          ...row,
        ]);
        newHorizontalBorder[y - 1][x] = !data.horizontalBorder[y - 1][x];
        const newData = { ...data, horizontalBorder: newHorizontalBorder };
        return { data: newData };
      } else if (event.direction === "vertical") {
        if (
          !(
            0 <= y &&
            y < data.verticalBorder.length &&
            1 <= x &&
            x <= data.verticalBorder[y].length
          )
        ) {
          return {};
        }
        const newVerticalBorder = data.verticalBorder.map((row) => [...row]);
        newVerticalBorder[y][x - 1] = !data.verticalBorder[y][x - 1];
        const newData = { ...data, verticalBorder: newVerticalBorder };
        return { data: newData };
      }
    }
    return {};
  },
  render2: (_state, data, _options: RenderOptions2) => {
    const items: BoardItem[] = [];

    for (let y = 0; y < data.horizontalBorder.length; ++y) {
      for (let x = 0; x < data.horizontalBorder[y].length; ++x) {
        if (data.horizontalBorder[y][x]) {
          items.push({
            y: (y + 1) * 2,
            x: x * 2 + 1,
            color: "black",
            item: "boldWall",
          });
        }
      }
    }

    for (let y = 0; y < data.verticalBorder.length; ++y) {
      for (let x = 0; x < data.verticalBorder[y].length; ++x) {
        if (data.verticalBorder[y][x]) {
          items.push({
            y: y * 2 + 1,
            x: (x + 1) * 2,
            color: "black",
            item: "boldWall",
          });
        }
      }
    }

    return [
      {
        priority: PRIORITY_BORDER,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];
    for (let y = 0; y < data.horizontalBorder.length; ++y) {
      for (let x = 0; x < data.horizontalBorder[y].length; ++x) {
        if (data.horizontalBorder[y][x]) {
          items.push({
            kind: "edge",
            position: { y, x, direction: "horizontal" },
            style: 2,
          });
        }
      }
    }
    for (let y = 0; y < data.verticalBorder.length; ++y) {
      for (let x = 0; x < data.verticalBorder[y].length; ++x) {
        if (data.verticalBorder[y][x]) {
          items.push({
            kind: "edge",
            position: { y, x, direction: "vertical" },
            style: 2,
          });
        }
      }
    }
    return { items, margin: 0 };
  },
};
