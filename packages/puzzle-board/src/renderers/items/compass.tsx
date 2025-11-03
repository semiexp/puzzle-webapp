import { ReactElement } from "react";
import { CompassItem, ItemRenderingSpec } from "../../types";

export function renderCompassItem(
  spec: ItemRenderingSpec,
  item: CompassItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;
  return (
    <g>
      <line
        x1={centerX - unitSize / 2}
        x2={centerX + unitSize / 2}
        y1={centerY - unitSize / 2}
        y2={centerY + unitSize / 2}
        strokeWidth={1}
        stroke={color}
      />
      <line
        x1={centerX - unitSize / 2}
        x2={centerX + unitSize / 2}
        y1={centerY + unitSize / 2}
        y2={centerY - unitSize / 2}
        strokeWidth={1}
        stroke={color}
      />
      {item.up >= 0 && (
        <text
          x={centerX}
          y={centerY - unitSize * 0.3}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.4 }}
          fill={color}
        >
          {item.up}
        </text>
      )}
      {item.down >= 0 && (
        <text
          x={centerX}
          y={centerY + unitSize * 0.3}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.4 }}
          fill={color}
        >
          {item.down}
        </text>
      )}
      {item.left >= 0 && (
        <text
          x={centerX - unitSize * 0.3}
          y={centerY}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.4 }}
          fill={color}
        >
          {item.left}
        </text>
      )}
      {item.right >= 0 && (
        <text
          x={centerX + unitSize * 0.3}
          y={centerY}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.4 }}
          fill={color}
        >
          {item.right}
        </text>
      )}
    </g>
  );
}
