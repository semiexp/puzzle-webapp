import { EditorEvent } from "../events";
import { ReducerInfo, RenderOptions2 } from "../rule";
import { BoardItem } from "puzzle-board";

type Pos = { x: number; y: number };
type Region<T> = { cells: Pos[]; extraValue?: T };

export const reducerForRegions = <
  T,
  S extends {
    currentRegion: Region<T> | null;
    selectedRegionId: number | null;
  },
  D extends { regions: Region<T>[] },
>(
  state: S,
  data: D,
  event: EditorEvent,
  info: ReducerInfo,
  forceConnected: boolean,
  regionSizeLimit?: number,
): { state?: S; data?: D } => {
  const size = info.boardSize;
  if (event.type === "cellMouseDown") {
    if (event.shift) {
      if (state.selectedRegionId === null) {
        return {};
      }

      if (!(0 <= event.y && event.y < size && 0 <= event.x && event.x < size)) {
        return {};
      }

      if (
        data.regions[state.selectedRegionId].cells.some(
          (cell) => cell.y === event.y && cell.x === event.x,
        )
      ) {
        // remove the cell from the region
        const newRegions = [...data.regions];
        const region = newRegions[state.selectedRegionId];
        newRegions[state.selectedRegionId] = {
          ...region,
          cells: region.cells.filter(
            (cell) => !(cell.y === event.y && cell.x === event.x),
          ),
        };
        return { data: { ...data, regions: newRegions } };
      } else if (data.regions[state.selectedRegionId].cells.length < size) {
        // add the cell to the region
        const newRegions = [...data.regions];
        const region = newRegions[state.selectedRegionId];
        newRegions[state.selectedRegionId] = {
          ...region,
          cells: [...region.cells, { y: event.y, x: event.x }],
        };
        return { data: { ...data, regions: newRegions } };
      }

      return {};
    }

    if (event.rightClick) {
      // Remove the region containing the clicked cell
      const newRegions = data.regions.filter(
        (region) =>
          !region.cells.some(
            (cell) => cell.y === event.y && cell.x === event.x,
          ),
      );
      return { data: { ...data, regions: newRegions } };
    }

    // list of indices of regions that contain the clicked cell
    const regionIndices = data.regions
      .map((region, index) => ({
        index,
        contains: region.cells.some(
          (cell) => cell.y === event.y && cell.x === event.x,
        ),
      }))
      .filter((region) => region.contains)
      .map((region) => region.index);

    if (regionIndices.length === 0) {
      // No region contains the clicked cell, create a new region
      if (0 <= event.y && event.y < size && 0 <= event.x && event.x < size) {
        const newRegion = { cells: [{ y: event.y, x: event.x }] };
        return {
          state: { ...state, currentRegion: newRegion, selectedRegionId: null },
        };
      } else {
        return {};
      }
    } else {
      let newSelectedRegionId;
      const idx = regionIndices.indexOf(state.selectedRegionId ?? -1);
      if (idx === -1) {
        newSelectedRegionId = regionIndices[0];
      } else {
        newSelectedRegionId = regionIndices[(idx + 1) % regionIndices.length];
      }

      return { state: { ...state, selectedRegionId: newSelectedRegionId } };
    }
  } else if (event.type === "cellMouseMove") {
    if (
      state.currentRegion != null &&
      0 <= event.y &&
      event.y < size &&
      0 <= event.x &&
      event.x < size
    ) {
      const region = state.currentRegion;

      // if the current cell is already in the region, skip
      if (
        region.cells.some((cell) => cell.y === event.y && cell.x === event.x)
      ) {
        return {};
      }

      if (forceConnected) {
        // Check if the new cell is adjacent to any cell in the region
        const isAdjacent = region.cells.some((cell) => {
          return (
            (cell.y === event.y && Math.abs(cell.x - event.x) === 1) ||
            (cell.x === event.x && Math.abs(cell.y - event.y) === 1)
          );
        });

        if (!isAdjacent) {
          return {};
        }
      }

      if (regionSizeLimit && region.cells.length >= regionSizeLimit) {
        return {};
      }

      const newRegion = {
        ...region,
        cells: [...region.cells, { y: event.y, x: event.x }],
      };
      return { state: { ...state, currentRegion: newRegion } };
    }
  } else if (event.type === "mouseUp") {
    if (state.currentRegion != null && state.currentRegion.cells.length >= 1) {
      const newRegions = [...data.regions, state.currentRegion];
      return {
        state: {
          ...state,
          currentRegion: null,
          selectedRegionId: newRegions.length - 1,
        },
        data: { ...data, regions: newRegions },
      };
    }
  }

  return {};
};

export const rendererForRegions2 = <
  T,
  S extends {
    currentRegion: Region<T> | null;
    selectedRegionId: number | null;
  },
  D extends { regions: Region<T>[] },
>(
  state: S | null,
  data: D,
  _options: RenderOptions2,
  cellPriority: number | null,
  borderPriority: number | null,
): {
  priority: number;
  item: BoardItem[];
}[] => {
  const cellItems: BoardItem[] = [];
  const borderItems: BoardItem[] = [];

  const addRegion = (
    region: Region<T>,
    cellColor: string,
    borderColor: string,
  ) => {
    if (cellPriority !== null) {
      for (const cell of region.cells) {
        cellItems.push({
          y: cell.y * 2 + 1,
          x: cell.x * 2 + 1,
          color: cellColor,
          item: "fill",
        });
      }
    }

    if (borderPriority !== null) {
      const cells = region.cells.map((cell) => ({
        y: cell.y * 2 + 1,
        x: cell.x * 2 + 1,
      }));

      if (cells.length > 0) {
        borderItems.push({
          y: cells[0].y,
          x: cells[0].x,
          color: borderColor,
          item: {
            kind: "regionBorder",
            cells: cells,
          },
        });
      }
    }
  };

  for (let i = 0; i < data.regions.length; ++i) {
    const region = data.regions[i];
    addRegion(
      region,
      i === state?.selectedRegionId
        ? "rgb(255, 206, 206)"
        : "rgb(216, 216, 216)",
      i === state?.selectedRegionId ? "red" : "black",
    );
  }
  if (state !== null && state.currentRegion) {
    addRegion(state.currentRegion, "rgb(255, 206, 206)", "red");
  }

  const ret = [];

  if (cellPriority !== null) {
    ret.push({
      priority: cellPriority,
      item: cellItems,
    });
  }
  if (borderPriority !== null) {
    ret.push({
      priority: borderPriority,
      item: borderItems,
    });
  }
  return ret;
};
