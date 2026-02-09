import { useEffect, useRef, useCallback } from "react";
import { terminateWorker } from "../solverBackend";

export const useUrlHashLoading = (
  solverRunning: boolean,
  setProblemUrl: (url: string) => void,
  solve: (url: string, enumerateAnswers: boolean, keep?: boolean) => void,
) => {
  const solveOnLoadDone = useRef(false);

  const loadProblemFromUrlHash = useCallback(() => {
    if (window.location.hash === "") {
      return;
    }

    const hash = window.location.hash.substring(1);
    const hashParts = hash.split("&");

    let keep = undefined;
    let url = undefined;

    for (const part of hashParts) {
      const toks = part.split("=");
      if (toks.length !== 2) {
        continue;
      }
      const key = toks[0];
      const value = toks[1];
      if (key === "keep") {
        keep = value === "true" || value === "1";
      } else if (key === "url") {
        url = decodeURIComponent(value);
      }
    }

    if (url === undefined) {
      return;
    }

    if (solverRunning) {
      terminateWorker();
    }

    Promise.resolve().then(() => {
      setProblemUrl(url);
      solve(url, false, keep);
    });
  }, [solverRunning, setProblemUrl, solve]);

  useEffect(() => {
    if (!solveOnLoadDone.current) {
      solveOnLoadDone.current = true;
      loadProblemFromUrlHash();
    }
  }, [loadProblemFromUrlHash]);

  useEffect(() => {
    const onHashChange = () => {
      loadProblemFromUrlHash();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [loadProblemFromUrlHash]);
};
