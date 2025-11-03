import { ReactElement } from "react";
import { ArrowItem, ItemRenderingSpec } from "../../types";

export function renderArrowItem(
  spec: ItemRenderingSpec,
  item: ArrowItem,
): ReactElement {
  const { globalOffsetX, globalOffsetY, centerX, centerY, unitSize, color } =
    spec;

  const elements: ReactElement[] = [];

  // Draw start circle (hollow) at the current position
  elements.push(
    <circle
      key="arrow-start"
      cx={centerX}
      cy={centerY}
      r={unitSize * 0.4}
      stroke={color}
      fill="none"
      strokeWidth={3}
    />,
  );

  // Draw lines connecting to cells
  let prevY = centerY;
  let prevX = centerX;
  let firstLine = true;

  for (let i = 0; i < item.cells.length; ++i) {
    const cell = item.cells[i];
    const cellY = globalOffsetY + unitSize * (cell.y / 2);
    const cellX = globalOffsetX + unitSize * (cell.x / 2);

    let startLineX = prevX;
    let startLineY = prevY;

    // For the first line, adjust the start position to be at the edge of the circle
    if (firstLine) {
      const d = Math.hypot(cellY - prevY, cellX - prevX);
      if (d > 0) {
        const dy = (cellY - prevY) / d;
        const dx = (cellX - prevX) / d;
        startLineY += dy * unitSize * 0.4;
        startLineX += dx * unitSize * 0.4;
      }
      firstLine = false;
    }

    elements.push(
      <line
        key={`arrow-line-${i}`}
        x1={startLineX}
        y1={startLineY}
        x2={cellX}
        y2={cellY}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />,
    );

    prevY = cellY;
    prevX = cellX;
  }

  // Draw arrow head at the last cell
  if (item.cells.length >= 1) {
    const last = item.cells[item.cells.length - 1];
    const lastY = globalOffsetY + unitSize * (last.y / 2);
    const lastX = globalOffsetX + unitSize * (last.x / 2);

    let dy = 0,
      dx = 0;
    if (item.cells.length >= 2) {
      const secondLast = item.cells[item.cells.length - 2];
      const secondLastY = globalOffsetY + unitSize * (secondLast.y / 2);
      const secondLastX = globalOffsetX + unitSize * (secondLast.x / 2);
      const d = Math.hypot(lastY - secondLastY, lastX - secondLastX);
      if (d > 0) {
        dy = (lastY - secondLastY) / d;
        dx = (lastX - secondLastX) / d;
      }
    } else {
      // Only one cell, use direction from start circle
      const d = Math.hypot(lastY - centerY, lastX - centerX);
      if (d > 0) {
        dy = (lastY - centerY) / d;
        dx = (lastX - centerX) / d;
      }
    }

    const scale = 0.4 * Math.sqrt(0.5);

    elements.push(
      <line
        key="arrow-head-1"
        x1={lastX}
        y1={lastY}
        x2={lastX - dx * unitSize * scale + dy * unitSize * scale}
        y2={lastY - dy * unitSize * scale - dx * unitSize * scale}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />,
    );
    elements.push(
      <line
        key="arrow-head-2"
        x1={lastX}
        y1={lastY}
        x2={lastX - dx * unitSize * scale - dy * unitSize * scale}
        y2={lastY - dy * unitSize * scale + dx * unitSize * scale}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />,
    );
  }

  return <g>{elements}</g>;
}
