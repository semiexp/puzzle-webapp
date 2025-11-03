import { ReactElement } from "react";
import { Item, ItemRenderingSpec, RenderEnv } from "../types";

import { renderArrowItem } from "./items/arrow";
import { renderCompassItem } from "./items/compass";
import { renderTapaClueItem } from "./items/tapaClue";
import { renderThermoItem } from "./items/thermo";

export function renderVertexCellItem(
  env: RenderEnv,
  y: number,
  x: number,
  color: string,
  item: Item,
): ReactElement {
  const isVertex = (y & 1) === 0 && (x & 1) === 0;
  const unitSize = isVertex ? env.unitSize * 0.7 : env.unitSize;

  const centerY = env.offsetY + env.unitSize * (y / 2);
  const centerX = env.offsetX + env.unitSize * (x / 2);

  const spec: ItemRenderingSpec = {
    globalOffsetY: env.offsetY,
    globalOffsetX: env.offsetX,
    y,
    x,
    centerY,
    centerX,
    unitSize,
    color,
  };

  if (item === "dot") {
    return (
      <rect
        x={centerX - unitSize * 0.1}
        y={centerY - unitSize * 0.1}
        width={unitSize * 0.2}
        height={unitSize * 0.2}
        fill={color}
      />
    );
  } else if (item === "block") {
    return (
      <rect
        x={centerX - unitSize * 0.4}
        y={centerY - unitSize * 0.4}
        width={unitSize * 0.8}
        height={unitSize * 0.8}
        fill={color}
      />
    );
  } else if (item === "square") {
    return (
      <rect
        x={centerX - unitSize * 0.3}
        y={centerY - unitSize * 0.3}
        width={unitSize * 0.6}
        height={unitSize * 0.6}
        stroke={color}
        fill="none"
      />
    );
  } else if (item === "triangle") {
    const shape = [
      [0.2, 0.8],
      [0.5, 0.2],
      [0.8, 0.8],
    ];
    const points: string[] = [];
    for (let i = 0; i < shape.length; ++i) {
      let dx = shape[i][0];
      let dy = shape[i][1];

      // adjust to the cell
      dx = centerX + unitSize * (dx - 0.5);
      dy = centerY + unitSize * (dy - 0.5);
      points.push(String(dx) + "," + String(dy));
    }
    return <polygon points={points.join(" ")} stroke={color} fill="none" />;
  } else if (item === "fill") {
    return (
      <rect
        x={centerX - unitSize * 0.5}
        y={centerY - unitSize * 0.5}
        width={unitSize}
        height={unitSize}
        fill={color}
      />
    );
  } else if (
    item === "sideArrowUp" ||
    item === "sideArrowDown" ||
    item === "sideArrowLeft" ||
    item === "sideArrowRight" ||
    item === "arrowUp" ||
    item === "arrowDown" ||
    item === "arrowLeft" ||
    item === "arrowRight"
  ) {
    const shape = [
      [0.1, 0.1],
      [0.5, 0.1],
      [0.5, 0.05],
      [0.9, 0.125],
      [0.5, 0.2],
      [0.5, 0.15],
      [0.1, 0.15],
    ];
    const points: string[] = [];
    for (let i = 0; i < shape.length; ++i) {
      let dx = shape[i][0];
      let dy = shape[i][1];

      // transform
      if (item.startsWith("arrow")) {
        dy *= 4;
      }
      if (
        item === "sideArrowLeft" ||
        item === "sideArrowUp" ||
        item === "arrowLeft" ||
        item === "arrowUp"
      ) {
        dx = 1 - dx;
      }
      if (
        item === "sideArrowUp" ||
        item === "sideArrowDown" ||
        item === "arrowUp" ||
        item === "arrowDown"
      ) {
        const tmp = dx;
        dx = dy;
        dy = tmp;
      }

      // adjust to the cell
      dx = centerX + unitSize * (dx - 0.5);
      dy = centerY + unitSize * (dy - 0.5);
      points.push(String(dx) + "," + String(dy));
    }
    return <polygon points={points.join(" ")} stroke="none" fill={color} />;
  } else if (item === "aboloUpperLeft") {
    return (
      <polygon
        points={aboloPoints(centerY, centerX, unitSize, 2)}
        stroke="none"
        fill={color}
      />
    );
  } else if (item === "aboloUpperRight") {
    return (
      <polygon
        points={aboloPoints(centerY, centerX, unitSize, 1)}
        stroke="none"
        fill={color}
      />
    );
  } else if (item === "aboloLowerLeft") {
    return (
      <polygon
        points={aboloPoints(centerY, centerX, unitSize, 3)}
        stroke="none"
        fill={color}
      />
    );
  } else if (item === "aboloLowerRight") {
    return (
      <polygon
        points={aboloPoints(centerY, centerX, unitSize, 0)}
        stroke="none"
        fill={color}
      />
    );
  } else if (item === "pencilLeft") {
    return pencilElement(centerY, centerX, unitSize, 3, color);
  } else if (item === "pencilRight") {
    return pencilElement(centerY, centerX, unitSize, 1, color);
  } else if (item === "pencilUp") {
    return pencilElement(centerY, centerX, unitSize, 0, color);
  } else if (item === "pencilDown") {
    return pencilElement(centerY, centerX, unitSize, 2, color);
  } else if (item === "circle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={unitSize * 0.4}
        stroke={color}
        fill="none"
      />
    );
  } else if (item === "filledCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={unitSize * 0.4}
        stroke={color}
        fill={color}
      />
    );
  } else if (item === "dottedHorizontalWall") {
    return (
      <line
        x1={centerX - unitSize / 2}
        x2={centerX + unitSize / 2}
        y1={centerY}
        y2={centerY}
        strokeWidth={2}
        stroke={color}
        strokeDasharray="4 2"
      />
    );
  } else if (item === "dottedVerticalWall") {
    return (
      <line
        x1={centerX}
        x2={centerX}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={2}
        stroke={color}
        strokeDasharray="4 2"
      />
    );
  } else if (item === "slash") {
    return (
      <line
        x1={centerX + unitSize / 2}
        x2={centerX - unitSize / 2}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={1}
        stroke={color}
      />
    );
  } else if (item === "backslash") {
    return (
      <line
        x1={centerX - unitSize / 2}
        x2={centerX + unitSize / 2}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={1}
        stroke={color}
      />
    );
  } else if (item === "dottedSlash") {
    return (
      <line
        x1={centerX + unitSize / 2}
        x2={centerX - unitSize / 2}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={1}
        stroke={color}
        strokeDasharray="4 2"
      />
    );
  } else if (item === "dottedBackslash") {
    return (
      <line
        x1={centerX - unitSize / 2}
        x2={centerX + unitSize / 2}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={1}
        stroke={color}
        strokeDasharray="4 2"
      />
    );
  } else if (item === "plus") {
    return (
      <g>
        <line
          x1={centerX - unitSize * 0.4}
          x2={centerX + unitSize * 0.4}
          y1={centerY}
          y2={centerY}
          strokeWidth={4}
          stroke={color}
        />
        <line
          x1={centerX}
          x2={centerX}
          y1={centerY - unitSize * 0.4}
          y2={centerY + unitSize * 0.4}
          strokeWidth={4}
          stroke={color}
        />
      </g>
    );
  } else if (item === "smallCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={env.unitSize * 0.1}
        stroke={color}
        fill="none"
      />
    );
  } else if (item === "smallFilledCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={env.unitSize * 0.1}
        stroke={color}
        fill={color}
      />
    );
  } else if (item === "middleFilledCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={env.unitSize * 0.2}
        stroke={color}
        fill={color}
      />
    );
  } else if (typeof item === "string" && item.startsWith("firewalkCell")) {
    const items = [];

    items.push(
      <polygon
        points={`${centerX - unitSize / 4},${centerY} ${centerX},${centerY - unitSize / 4} ${centerX + unitSize / 4},${centerY} ${centerX},${centerY + unitSize / 4}`}
        fill="#ffe0e0"
      />,
    );
    if (item === "firewalkCellUl" || item === "firewalkCellUlDr") {
      items.push(
        <line
          x1={centerX - unitSize / 4}
          x2={centerX}
          y1={centerY}
          y2={centerY - unitSize / 4}
          strokeWidth={2}
          stroke={color}
        />,
      );
    }
    if (item === "firewalkCellUr" || item === "firewalkCellUrDl") {
      items.push(
        <line
          x1={centerX + unitSize / 4}
          x2={centerX}
          y1={centerY}
          y2={centerY - unitSize / 4}
          strokeWidth={2}
          stroke={color}
        />,
      );
    }
    if (item === "firewalkCellDl" || item === "firewalkCellUrDl") {
      items.push(
        <line
          x1={centerX - unitSize / 4}
          x2={centerX}
          y1={centerY}
          y2={centerY + unitSize / 4}
          strokeWidth={2}
          stroke={color}
        />,
      );
    }
    if (item === "firewalkCellDr" || item === "firewalkCellUlDr") {
      items.push(
        <line
          x1={centerX + unitSize / 4}
          x2={centerX}
          y1={centerY}
          y2={centerY + unitSize / 4}
          strokeWidth={2}
          stroke={color}
        />,
      );
    }

    return <g>{items}</g>;
  } else if (typeof item === "string") {
    throw new Error("unsupported item: " + item);
  } else if ("kind" in item) {
    if (item.kind === "text") {
      const sizeMultiplier = item.size !== undefined ? item.size : 1.0;
      if (item.pos) {
        let xRatio = 0;
        let yRatio = 0;
        if (item.pos === "upperLeft") {
          xRatio = -0.25;
          yRatio = -0.25;
        } else if (item.pos === "upperRight") {
          xRatio = 0.25;
          yRatio = -0.25;
        } else if (item.pos === "lowerLeft") {
          xRatio = -0.25;
          yRatio = 0.25;
        } else if (item.pos === "lowerRight") {
          xRatio = 0.25;
          yRatio = 0.25;
        }
        return (
          <text
            x={centerX + unitSize * xRatio}
            y={centerY + unitSize * yRatio}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontSize: unitSize * 0.5 * sizeMultiplier }}
            fill={color}
          >
            {item.data}
          </text>
        );
      } else {
        return (
          <text
            x={centerX}
            y={centerY}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontSize: unitSize * 0.8 * sizeMultiplier }}
            fill={color}
          >
            {item.data}
          </text>
        );
      }
    } else if (item.kind === "compass") {
      return renderCompassItem(spec, item);
    } else if (item.kind === "tapaClue") {
      return renderTapaClueItem(spec, item);
    } else if (item.kind === "sudokuCandidateSet") {
      const items: ReactElement[] = [];
      for (let i = 0; i < item.values.length; ++i) {
        const n = item.values[i];
        const gx = (n - 1) % item.size;
        const gy = Math.floor((n - 1) / item.size);
        const x = centerX - unitSize / 2 + ((gx + 0.5) / item.size) * unitSize;
        const y = centerY - unitSize / 2 + ((gy + 0.5) / item.size) * unitSize;
        items.push(
          <text
            x={x}
            y={y}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontSize: unitSize / item.size }}
            fill={color}
          >
            {n}
          </text>,
        );
      }
      return <g>{items}</g>;
    } else if (item.kind === "sudokuForbiddenCandidateMarker") {
      const items: ReactElement[] = [];
      for (let i = 0; i < item.values.length; ++i) {
        const n = item.values[i];
        const gx = (n - 1) % item.size;
        const gy = Math.floor((n - 1) / item.size);
        const x = centerX - unitSize / 2 + ((gx + 0.5) / item.size) * unitSize;
        const y = centerY - unitSize / 2 + ((gy + 0.5) / item.size) * unitSize;

        // Draw the number
        items.push(
          <text
            key={`num-${i}`}
            x={x}
            y={y}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontSize: (unitSize / item.size) * 0.9 }}
            fill={color}
          >
            {n}
          </text>,
        );

        // Draw the red cross over the number
        const crossSize = (unitSize / item.size) * 0.3;
        items.push(
          <line
            key={`cross-1-${i}`}
            x1={x - crossSize}
            y1={y - crossSize}
            x2={x + crossSize}
            y2={y + crossSize}
            stroke="red"
            strokeWidth={1}
          />,
        );
        items.push(
          <line
            key={`cross-2-${i}`}
            x1={x + crossSize}
            y1={y - crossSize}
            x2={x - crossSize}
            y2={y + crossSize}
            stroke="red"
            strokeWidth={1}
          />,
        );
      }
      return <g>{items}</g>;
    } else if (item.kind === "firefly") {
      let x = centerX,
        y = centerY;
      if (item.dot === "up") {
        y -= unitSize * 0.6;
      } else if (item.dot === "down") {
        y += unitSize * 0.6;
      } else if (item.dot === "left") {
        x -= unitSize * 0.6;
      } else if (item.dot === "right") {
        x += unitSize * 0.6;
      }

      return (
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={unitSize * 0.6}
            stroke={color}
            fill="white"
          />
          <circle
            cx={x}
            cy={y}
            r={unitSize * 0.2}
            stroke={color}
            fill={color}
          />
          {item.value >= 0 && (
            <text
              x={centerX}
              y={centerY}
              dominantBaseline="central"
              textAnchor="middle"
              style={{ fontSize: unitSize }}
              fill={color}
            >
              {item.value}
            </text>
          )}
        </g>
      );
    } else if (item.kind === "thermo") {
      return renderThermoItem(spec, item);
    } else if (item.kind === "arrow") {
      return renderArrowItem(spec, item);
    } else if (item.kind === "regionBorder") {
      const elements: ReactElement[] = [];

      const neighbors = [
        { y: -2, x: 0 },
        { y: 2, x: 0 },
        { y: 0, x: -2 },
        { y: 0, x: 2 },
      ];

      // For each cell in the region
      for (const cell of item.cells) {
        // Check each neighbor direction
        for (const neighbor of neighbors) {
          const neighborY = cell.y + neighbor.y;
          const neighborX = cell.x + neighbor.x;

          // Check if the neighbor cell is part of the region
          const hasNeighbor = item.cells.some(
            (c) => c.y === neighborY && c.x === neighborX,
          );

          if (!hasNeighbor) {
            // Draw a dotted line between the cell and the neighbor
            const cellCenterY = env.offsetY + env.unitSize * (cell.y / 2);
            const cellCenterX = env.offsetX + env.unitSize * (cell.x / 2);

            const midY = cellCenterY + (neighbor.y / 2) * env.unitSize * 0.4;
            const midX = cellCenterX + (neighbor.x / 2) * env.unitSize * 0.4;

            const startY = midY + (neighbor.x / 2) * 0.4 * env.unitSize;
            const startX = midX + (neighbor.y / 2) * 0.4 * env.unitSize;
            const endY = midY - (neighbor.x / 2) * 0.4 * env.unitSize;
            const endX = midX - (neighbor.y / 2) * 0.4 * env.unitSize;

            const strokeDasharray = `${(env.unitSize * 0.8) / 6},${(env.unitSize * 0.8) / 9}`;

            elements.push(
              <line
                key={`border-${cell.y}-${cell.x}-${neighborY}-${neighborX}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth={1}
                strokeDasharray={strokeDasharray}
              />,
            );
          }
        }
      }

      return <g>{elements}</g>;
    }
  }
  throw new Error("unsupported item: " + item);
}

function aboloPoints(
  centerY: number,
  centerX: number,
  unitSize: number,
  skip: number,
): string {
  const ret: string[] = [];
  if (skip !== 0) {
    ret.push(`${centerX - unitSize / 2},${centerY - unitSize / 2}`);
  }
  if (skip !== 1) {
    ret.push(`${centerX - unitSize / 2},${centerY + unitSize / 2}`);
  }
  if (skip !== 2) {
    ret.push(`${centerX + unitSize / 2},${centerY + unitSize / 2}`);
  }
  if (skip !== 3) {
    ret.push(`${centerX + unitSize / 2},${centerY - unitSize / 2}`);
  }
  return ret.join(" ");
}

function pencilPoints(
  centerY: number,
  centerX: number,
  unitSize: number,
  start: number,
): string {
  const ret = [`${centerX},${centerY}`];
  if (start === 3 || start === 0) {
    ret.push(`${centerX - unitSize / 2},${centerY - unitSize / 2}`);
  }
  if (start === 0 || start === 1) {
    ret.push(`${centerX + unitSize / 2},${centerY - unitSize / 2}`);
  }
  if (start === 1 || start === 2) {
    ret.push(`${centerX + unitSize / 2},${centerY + unitSize / 2}`);
  }
  if (start === 2 || start === 3) {
    ret.push(`${centerX - unitSize / 2},${centerY + unitSize / 2}`);
  }
  return ret.join(" ");
}

function pencilElement(
  centerY: number,
  centerX: number,
  unitSize: number,
  start: number,
  color: string,
): ReactElement {
  return (
    <g>
      <polygon
        points={pencilPoints(centerY, centerX, unitSize, start)}
        stroke={color}
        fill="none"
      />
      <polygon
        points={pencilPoints(centerY, centerX, unitSize * 0.5, start)}
        stroke="none"
        fill={color}
      />
    </g>
  );
}
