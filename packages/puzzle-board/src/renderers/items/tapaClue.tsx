import { ReactElement } from "react";
import { ItemRenderingSpec, TapaClueItem } from "../../types";

export function renderTapaClueItem(
  spec: ItemRenderingSpec,
  item: TapaClueItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;
  const values: string[] = [];
  for (let i = 0; i < item.value.length; ++i) {
    if (item.value[i] === -2) {
      values.push("?");
    } else if (item.value[i] !== -1) {
      values.push(item.value[i] + "");
    }
  }
  if (values.length === 1) {
    return (
      <text
        x={centerX}
        y={centerY}
        dominantBaseline="central"
        textAnchor="middle"
        style={{ fontSize: unitSize * 0.8 }}
        fill={color}
      >
        {values[0]}
      </text>
    );
  } else if (values.length === 2) {
    return (
      <g>
        <text
          x={centerX - unitSize * 0.2}
          y={centerY - unitSize * 0.2}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[0]}
        </text>
        <text
          x={centerX + unitSize * 0.2}
          y={centerY + unitSize * 0.2}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[1]}
        </text>
      </g>
    );
  } else if (values.length === 3) {
    return (
      <g>
        <text
          x={centerX - unitSize * 0.3}
          y={centerY - unitSize * 0.2}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[0]}
        </text>
        <text
          x={centerX + unitSize * 0.3}
          y={centerY - unitSize * 0.2}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[1]}
        </text>
        <text
          x={centerX}
          y={centerY + unitSize * 0.2}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[2]}
        </text>
      </g>
    );
  } else if (values.length === 4) {
    return (
      <g>
        <text
          x={centerX - unitSize * 0.3}
          y={centerY}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[0]}
        </text>
        <text
          x={centerX}
          y={centerY - unitSize * 0.25}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[1]}
        </text>
        <text
          x={centerX}
          y={centerY + unitSize * 0.25}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[2]}
        </text>
        <text
          x={centerX + unitSize * 0.3}
          y={centerY}
          dominantBaseline="central"
          textAnchor="middle"
          style={{ fontSize: unitSize * 0.6 }}
          fill={color}
        >
          {values[3]}
        </text>
      </g>
    );
  }
  throw new Error("Invalid TapaClueItem");
}
