import { ReactElement } from "react";
import { Item, ItemRenderingSpec, RenderEnv } from "../types";

import { renderTextItem } from "./items/text";

export function renderEdgeItem(
  env: RenderEnv,
  y: number,
  x: number,
  color: string,
  item: Item,
): ReactElement {
  const unitSize = env.unitSize;
  const centerY = env.offsetY + unitSize * (y / 2);
  const centerX = env.offsetX + unitSize * (x / 2);

  if (item === "line") {
    if (y % 2 === 1) {
      return (
        <line
          x1={centerX - unitSize / 2}
          x2={centerX + unitSize / 2}
          y1={centerY}
          y2={centerY}
          strokeWidth={2}
          stroke={color}
        />
      );
    } else {
      return (
        <line
          x1={centerX}
          x2={centerX}
          y1={centerY - unitSize / 2}
          y2={centerY + unitSize / 2}
          strokeWidth={2}
          stroke={color}
        />
      );
    }
  } else if (item === "dottedLine") {
    if (y % 2 === 1) {
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
    } else {
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
    }
  } else if (item === "doubleLine") {
    if (y % 2 === 1) {
      return (
        <g>
          <line
            x1={centerX - unitSize / 2}
            x2={centerX + unitSize / 2}
            y1={centerY - unitSize / 10}
            y2={centerY - unitSize / 10}
            strokeWidth={2}
            stroke={color}
          />
          <line
            x1={centerX - unitSize / 2}
            x2={centerX + unitSize / 2}
            y1={centerY + unitSize / 10}
            y2={centerY + unitSize / 10}
            strokeWidth={2}
            stroke={color}
          />
        </g>
      );
    } else {
      return (
        <g>
          <line
            x1={centerX - unitSize / 10}
            x2={centerX - unitSize / 10}
            y1={centerY - unitSize / 2}
            y2={centerY + unitSize / 2}
            strokeWidth={2}
            stroke={color}
          />
          <line
            x1={centerX + unitSize / 10}
            x2={centerX + unitSize / 10}
            y1={centerY - unitSize / 2}
            y2={centerY + unitSize / 2}
            strokeWidth={2}
            stroke={color}
          />
        </g>
      );
    }
  } else if (item === "cross") {
    const crossSize = unitSize * 0.1;
    return (
      <g>
        <line
          x1={centerX - crossSize}
          x2={centerX + crossSize}
          y1={centerY - crossSize}
          y2={centerY + crossSize}
          strokeWidth={1}
          stroke={color}
        />
        <line
          x1={centerX + crossSize}
          x2={centerX - crossSize}
          y1={centerY - crossSize}
          y2={centerY + crossSize}
          strokeWidth={1}
          stroke={color}
        />
      </g>
    );
  } else if (item === "wall" || item === "boldWall") {
    const strokeWidth = item === "boldWall" ? 2 : 1;
    if (y % 2 === 0) {
      return (
        <line
          x1={centerX - unitSize / 2}
          x2={centerX + unitSize / 2}
          y1={centerY}
          y2={centerY}
          strokeWidth={strokeWidth}
          stroke={color}
        />
      );
    } else {
      return (
        <line
          x1={centerX}
          x2={centerX}
          y1={centerY - unitSize / 2}
          y2={centerY + unitSize / 2}
          strokeWidth={strokeWidth}
          stroke={color}
        />
      );
    }
  } else if (item === "dottedWall") {
    if (y % 2 === 0) {
      return (
        <line
          x1={centerX - unitSize / 2}
          x2={centerX + unitSize / 2}
          y1={centerY}
          y2={centerY}
          strokeWidth={1}
          stroke={color}
          strokeDasharray="4 2"
        />
      );
    } else {
      return (
        <line
          x1={centerX}
          x2={centerX}
          y1={centerY - unitSize / 2}
          y2={centerY + unitSize / 2}
          strokeWidth={1}
          stroke={color}
          strokeDasharray="4 2"
        />
      );
    }
  } else if (item === "bar") {
    if (y % 2 === 0) {
      // horizontal bar
      return (
        <rect
          x={centerX - unitSize * 0.3}
          y={centerY - unitSize * 0.1}
          width={unitSize * 0.6}
          height={unitSize * 0.2}
          fill={color}
          stroke="black"
          strokeWidth={1}
        />
      );
    } else {
      // vertical bar
      return (
        <rect
          x={centerX - unitSize * 0.1}
          y={centerY - unitSize * 0.3}
          width={unitSize * 0.2}
          height={unitSize * 0.6}
          fill={color}
          stroke="black"
          strokeWidth={1}
        />
      );
    }
  } else if (item === "smallCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={unitSize * 0.1}
        stroke={color}
        fill="none"
      />
    );
  } else if (item === "smallFilledCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={unitSize * 0.1}
        stroke={color}
        fill={color}
      />
    );
  } else if (item === "middleFilledCircle") {
    return (
      <circle
        cx={centerX}
        cy={centerY}
        r={unitSize * 0.2}
        stroke={color}
        fill={color}
      />
    );
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
  } else if (typeof item !== "string" && item.kind === "text") {
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

    return renderTextItem(spec, item);
  }
  throw new Error("unsupported item: " + item);
}
