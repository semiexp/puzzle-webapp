import React from "react";
import { useTranslation } from "react-i18next";

type ResultStatusProps = {
  error: string | undefined;
  hasAnswer: boolean | undefined;
  message: string | undefined;
  isUnique: boolean | undefined;
};

export const ResultStatus: React.FC<ResultStatusProps> = ({
  error,
  hasAnswer,
  message,
  isUnique,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {error && <span style={{ color: "red" }}>Error: {error}</span>}
      {hasAnswer === false && (
        <span style={{ color: "white", backgroundColor: "red" }}>
          {t("puzzleSolver.noAnswer")}
        </span>
      )}
      {message && <span style={{ color: "black" }}>{message}</span>}
      {isUnique === true && (
        <span style={{ color: "blue" }}>
          {" "}
          {t("puzzleSolver.uniqueAnswer")}
        </span>
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
