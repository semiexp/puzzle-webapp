export enum Symmetry {
  None = "None",
  HorizontalLine = "HorizontalLine",
  VerticalLine = "VerticalLine",
  Rotate180 = "Rotate180",
  Rotate90 = "Rotate90",
}

export type GeneratorResult =
  | {
      status: "success";
      url: string;
      elapsed: number;
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "terminated";
    };

export declare function generateProblem(
  kind: string,
  request: unknown,
): Promise<GeneratorResult>;

export declare function terminateWorker(): void;
