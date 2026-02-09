import { useState, useCallback } from "react";
import { solveProblem, terminateWorker, SolverResult } from "../solverBackend";
import { maybePreDecodeUrl } from "../utils/urlUtils";

export const useSolverState = () => {
  const [solverRunning, setSolverRunning] = useState(false);
  const [result, setResult] = useState<SolverResult | undefined>(undefined);
  const [history, setHistory] = useState<SolverResult[]>([]);

  const solve = useCallback(
    async (
      url: string,
      enumerateAnswers: boolean,
      numMaxAnswer: number,
      keep?: boolean,
      puzzleKey?: string,
    ) => {
      if (keep === undefined || !keep) {
        setResult(undefined);
      }
      setSolverRunning(true);

      const result = await solveProblem(
        maybePreDecodeUrl(url, puzzleKey),
        enumerateAnswers ? numMaxAnswer : 0,
      );
      setResult(result);

      setHistory((history) => {
        // Note: result.url is intentionally set here to preserve the original URL
        // before any pre-decoding transformations
        const newHistory = [{ ...result, url: url }];
        newHistory.push(...history);
        if (newHistory.length > 50) {
          newHistory.pop();
        }
        return newHistory;
      });
      setSolverRunning(false);
    },
    [],
  );

  const stop = useCallback(() => {
    terminateWorker();
  }, []);

  const selectFromHistory = useCallback(
    (i: number) => {
      if (solverRunning) {
        return;
      }
      if (i < 0 || i >= history.length) {
        return;
      }
      const r = history[i];
      setResult(r);
      return r;
    },
    [history, solverRunning],
  );

  return {
    solverRunning,
    result,
    history,
    solve,
    stop,
    selectFromHistory,
  };
};
