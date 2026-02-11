import { Result } from "./answerViewer";

// TODO: merge "noAnswer" into "success"
export type SolverResult =
  | {
      status: "success";
      url: string;
      result: Result;
      elapsed: number;
    }
  | {
      status: "error";
      url: string;
      error: string;
    }
  | {
      status: "internal-error";
      url: string;
      error: string;
    }
  | {
      status: "terminated";
      url: string;
    }
  | {
      status: "noAnswer";
      url: string;
    };

declare function solveProblem(
  url: string,
  solver?: "cspuz" | "numlin",
  numAnswers?: number,
): Promise<SolverResult>;
declare function terminateWorker(): void;
