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

export declare function generateSlitherlink(
  height: number,
  width: number,
  seed?: number,
): Promise<GeneratorResult>;

export declare function terminateWorker(): void;
