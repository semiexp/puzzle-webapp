import { ReactElement } from "react";

import { renderEdgeItem } from "./renderers/edgeRenderer";
import { renderVertexCellItem } from "./renderers/vertexCellRenderer";

import { Board, Item, RenderEnv } from "./types";
export type { Board, BoardItem, Item } from "./types";

function renderItem(
  env: RenderEnv,
  y: number,
  x: number,
  color: string,
  item: Item,
): ReactElement {
  // "x % 2 === 0" cannot be used because x, y can be negative
  const isVertex = (y & 1) === 0 && (x & 1) === 0;
  const isCell = (y & 1) === 1 && (x & 1) === 1;
  const isEdge = !(isVertex || isCell);

  if (typeof item !== "string" && item.kind === "lineTo") {
    const y1 = env.offsetY + env.unitSize * (y / 2);
    const x1 = env.offsetX + env.unitSize * (x / 2);
    const y2 = env.offsetY + env.unitSize * (item.destY / 2);
    const x2 = env.offsetX + env.unitSize * (item.destX / 2);

    return (
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} stroke={color} />
    );
  }
  if (isVertex || isCell) {
    return renderVertexCellItem(env, y, x, color, item);
  } else if (isEdge) {
    return renderEdgeItem(env, y, x, color, item);
  }
  throw new Error("items must be on either vertices, cells, or edges");
}

export function renderBoardItems(
  boards: Board[],
  config: { margin: number; unitSize: number },
): { svgHeight: number; svgWidth: number; component: ReactElement } {
  const { margin, unitSize } = config;

  const env = {
    offsetY: margin,
    offsetX: margin,
    unitSize,
  };

  const components: ReactElement[] = [];
  let heightMax = 0;
  let widthMax = 0;

  for (const board of boards) {
    for (let i = 0; i < board.data.length; ++i) {
      const elem = board.data[i];
      components.push(renderItem(env, elem.y, elem.x, elem.color, elem.item));
    }

    const height = board.height;
    const width = board.width;
    heightMax = Math.max(heightMax, height);
    widthMax = Math.max(widthMax, width);

    if (board.defaultStyle === "outer_grid") {
      components.push(
        <line
          x1={margin}
          x2={margin + width * unitSize}
          y1={margin}
          y2={margin}
          strokeWidth={2}
          stroke="black"
        />,
      );
      components.push(
        <line
          x1={margin}
          x2={margin + width * unitSize}
          y1={margin + height * unitSize}
          y2={margin + height * unitSize}
          strokeWidth={2}
          stroke="black"
        />,
      );
      components.push(
        <line
          x1={margin}
          x2={margin}
          y1={margin}
          y2={margin + height * unitSize}
          strokeWidth={2}
          stroke="black"
        />,
      );
      components.push(
        <line
          x1={margin + width * unitSize}
          x2={margin + width * unitSize}
          y1={margin}
          y2={margin + height * unitSize}
          strokeWidth={2}
          stroke="black"
        />,
      );
    } else if (board.defaultStyle === "grid") {
      for (let y = 0; y <= height; ++y) {
        const lineWidth = y === 0 || y === height ? 2 : 1;
        components.push(
          <line
            x1={margin}
            x2={margin + width * unitSize}
            y1={margin + y * unitSize}
            y2={margin + y * unitSize}
            strokeWidth={lineWidth}
            stroke="black"
          />,
        );
      }
      for (let x = 0; x <= width; ++x) {
        const lineWidth = x === 0 || x === width ? 2 : 1;
        components.push(
          <line
            x1={margin + x * unitSize}
            x2={margin + x * unitSize}
            y1={margin}
            y2={margin + height * unitSize}
            strokeWidth={lineWidth}
            stroke="black"
          />,
        );
      }
    } else if (board.defaultStyle === "dots") {
      const dotSizeHalf = unitSize / 10;
      for (let y = 0; y <= height; ++y) {
        for (let x = 0; x <= width; ++x) {
          const centerY = env.offsetY + unitSize * y;
          const centerX = env.offsetX + unitSize * x;
          components.push(
            <rect
              x={centerX - dotSizeHalf}
              y={centerY - dotSizeHalf}
              height={dotSizeHalf * 2}
              width={dotSizeHalf * 2}
              fill="black"
            />,
          );
        }
      }
    }
  }

  const svgHeight = heightMax * unitSize + margin * 2;
  const svgWidth = widthMax * unitSize + margin * 2;

  const component = <g>{components}</g>;

  return { svgHeight, svgWidth, component };
}
