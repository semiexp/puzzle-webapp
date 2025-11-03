import { ReactElement } from "react";
import { FireflyItem, ItemRenderingSpec } from "../../types";

export function renderFireflyItem(
  spec: ItemRenderingSpec,
  item: FireflyItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;

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
      <circle cx={x} cy={y} r={unitSize * 0.2} stroke={color} fill={color} />
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
}
