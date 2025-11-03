import { ReactElement } from "react";
import { ItemRenderingSpec, ThermoItem } from "../../types";

export function renderThermoItem(
  spec: ItemRenderingSpec,
  item: ThermoItem,
): ReactElement {
  const { globalOffsetX, globalOffsetY, centerX, centerY, color, unitSize } =
    spec;

  const elements: ReactElement[] = [];

  // Draw start circle at the current position
  elements.push(
    <circle
      key="thermo-start"
      cx={centerX}
      cy={centerY}
      r={unitSize * 0.38}
      stroke={color}
      fill={color}
      strokeWidth={3}
    />,
  );

  // Draw lines connecting to cells
  let prevY = centerY;
  let prevX = centerX;

  for (let i = 0; i < item.cells.length; ++i) {
    const cell = item.cells[i];
    const cellY = globalOffsetY + unitSize * (cell.y / 2);
    const cellX = globalOffsetX + unitSize * (cell.x / 2);

    elements.push(
      <line
        key={`thermo-line-${i}`}
        x1={prevX}
        y1={prevY}
        x2={cellX}
        y2={cellY}
        stroke={color}
        strokeWidth={unitSize * 0.25}
        strokeLinecap="round"
      />,
    );

    prevY = cellY;
    prevX = cellX;
  }

  return <g>{elements}</g>;
}
