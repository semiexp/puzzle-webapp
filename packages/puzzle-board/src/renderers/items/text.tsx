import { ReactElement } from "react";
import { ItemRenderingSpec, TextItem } from "../../types";

export function renderTextItem(
  spec: ItemRenderingSpec,
  item: TextItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;

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
}
