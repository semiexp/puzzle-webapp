import { ReactElement } from "react";
import { ItemRenderingSpec, RegionBorderItem } from "../../types";

export function renderRegionBorderItem(
  spec: ItemRenderingSpec,
  item: RegionBorderItem,
): ReactElement {
  const { globalOffsetX, globalOffsetY, color, unitSize } = spec;
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
        const cellCenterY = globalOffsetY + unitSize * (cell.y / 2);
        const cellCenterX = globalOffsetX + unitSize * (cell.x / 2);

        const midY = cellCenterY + (neighbor.y / 2) * unitSize * 0.4;
        const midX = cellCenterX + (neighbor.x / 2) * unitSize * 0.4;

        const startY = midY + (neighbor.x / 2) * 0.4 * unitSize;
        const startX = midX + (neighbor.y / 2) * 0.4 * unitSize;
        const endY = midY - (neighbor.x / 2) * 0.4 * unitSize;
        const endX = midX - (neighbor.y / 2) * 0.4 * unitSize;

        const strokeDasharray = `${(unitSize * 0.8) / 6},${(unitSize * 0.8) / 9}`;

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
