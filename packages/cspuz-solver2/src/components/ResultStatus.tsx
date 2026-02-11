import React from "react";
import { useTranslation } from "react-i18next";
import { useResultMetadata } from "../hooks/useResultMetadata";
import { SolverResult } from "../solverBackend";

type ResultStatusProps = {
  result: SolverResult | undefined;
};

export const ResultStatus: React.FC<ResultStatusProps> = ({ result }) => {
  const { error, hasAnswer, message, isUnique } = useResultMetadata(result);
  const { t } = useTranslation();

  return (
    <div>
      {error && <span style={{ color: "red" }}>{error}</span>}
      {hasAnswer === false && (
        <span style={{ color: "white", backgroundColor: "red" }}>
          {t("puzzleSolver.noAnswer")}
        </span>
      )}
      {message && <span style={{ color: "black" }}>{message}</span>}
      {isUnique === true && (
        <span style={{ color: "blue" }}> {t("puzzleSolver.uniqueAnswer")}</span>
      )}
      {isUnique === false && (
        <span style={{ color: "red" }}>
          {" "}
          {t("puzzleSolver.multipleAnswers")}
        </span>
      )}
    </div>
  );
};
