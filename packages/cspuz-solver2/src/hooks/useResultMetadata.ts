import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SolverResult } from "../solverBackend";

export type ResultMetadata = {
  isUnique: boolean | undefined;
  hasAnswer: boolean | undefined;
  error: string | undefined;
  message: string | undefined;
};

export const useResultMetadata = (
  result: SolverResult | undefined,
): ResultMetadata => {
  const { t } = useTranslation();

  return useMemo(() => {
    let isUnique: boolean | undefined = undefined;
    if (result !== undefined && result.status === "success") {
      const r = result.result;
      if ("isUnique" in r) {
        isUnique = r.isUnique;
      }
    }

    let hasAnswer: boolean | undefined = undefined;
    if (result !== undefined && result.status === "success") {
      const r = result.result;
      if ("hasAnswer" in r) {
        hasAnswer = r.hasAnswer;
      }
    }

    let error: string | undefined = undefined;
    if (result !== undefined) {
      if (result.status === "error") {
        error = t("puzzleSolver.error", { error: result.error });
      } else if (result.status === "terminated") {
        error = t("puzzleSolver.terminated");
      } else if (result.status === "noAnswer") {
        error = t("puzzleSolver.noAnswer");
      } else if (result.status === "internal-error") {
        error = t("puzzleSolver.internalError", { error: result.error });
      }
    }

    let message: string | undefined = undefined;
    if (result !== undefined && result.status === "success") {
      if (hasAnswer === false) {
        message = "(" + result.elapsed + "ms)";
      } else {
        message = t("puzzleSolver.solved", { elapsed: result.elapsed });
      }
    }

    return { isUnique, hasAnswer, error, message };
  }, [result, t]);
};
