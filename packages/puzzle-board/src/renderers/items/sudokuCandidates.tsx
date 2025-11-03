import { ReactElement } from "react";
import { ItemRenderingSpec, SudokuCandidateSetItem, SudokuForbiddenCandidateMarkerItem } from "../../types";

export function renderSudokuCandidateSetItem(
  spec: ItemRenderingSpec,
  item: SudokuCandidateSetItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;

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
}

export function renderSudokuForbiddenCandidateMarkerItem(
  spec: ItemRenderingSpec,
  item: SudokuForbiddenCandidateMarkerItem,
): ReactElement {
  const { centerX, centerY, unitSize, color } = spec;

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
}
