import React from "react";
import puzzlesData from "./puzzles.json";
import { AnswerViewer } from "./answerViewer";
import { isPenpaEditUrl } from "./utils/urlUtils";
import { useSolverState } from "./hooks/useSolverState";
import { useUrlHashLoading } from "./hooks/useUrlHashLoading";
import { SolverControls } from "./components/SolverControls";
import { HistoryPanel } from "./components/HistoryPanel";
import { ResultStatus } from "./components/ResultStatus";
import { ConfigPopover } from "./components/ConfigPopover";
import { HelpPopover } from "./components/HelpPopover";
import { PuzzleMenu } from "./components/PuzzleMenu";

export const PuzzleSolver = () => {
  const [problemUrl, setProblemUrl] = React.useState("");
  const [numMaxAnswer, setNumMaxAnswer] = React.useState(100);
  const [selectedPuzzleKey, setSelectedPuzzleKey] = React.useState(
    puzzlesData.penpa_edit[0].key,
  );
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [configAnchorEl, setConfigAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);
  const [helpAnchorEl, setHelpAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);

  const { solverRunning, result, history, solve, stop, selectFromHistory } =
    useSolverState();

  const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblemUrl(e.target.value);
  };

  const changeNumMaxAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value);
    if (!isNaN(n) && n > 0) {
      setNumMaxAnswer(n);
    }
  };

  const handleSolve = (enumerateAnswers: boolean) => {
    solve(
      problemUrl,
      enumerateAnswers,
      numMaxAnswer,
      undefined,
      selectedPuzzleKey,
    );
  };

  const handleSelectFromHistory = (i: number) => {
    const r = selectFromHistory(i);
    if (r) {
      setProblemUrl(r.url);
    }
  };

  const handleConfigButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setConfigAnchorEl(event.currentTarget);
  };

  const handleHelpButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handlePuzzleSelect = (key: string) => {
    setSelectedPuzzleKey(key);
    handleMenuClose();
  };

  useUrlHashLoading(solverRunning, setProblemUrl, (url, enumAnswers, keep) =>
    solve(url, enumAnswers, numMaxAnswer, keep),
  );

  const isPenpaEdit = isPenpaEditUrl(problemUrl);

  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <SolverControls
            problemUrl={problemUrl}
            onChangeUrl={changeUrl}
            solverRunning={solverRunning}
            isPenpaEdit={isPenpaEdit}
            selectedPuzzleKey={selectedPuzzleKey}
            onSolve={handleSolve}
            onStop={stop}
            onConfigButtonClick={handleConfigButtonClick}
            onHelpButtonClick={handleHelpButtonClick}
            onMenuClick={handleMenuClick}
          />
          <HistoryPanel
            history={history}
            onSelectFromHistory={handleSelectFromHistory}
          />
        </div>
        <ResultStatus result={result} />
        {result && result.status === "success" && (
          <AnswerViewer result={result.result} />
        )}
      </div>
      <ConfigPopover
        anchorEl={configAnchorEl}
        onClose={() => setConfigAnchorEl(null)}
        numMaxAnswer={numMaxAnswer}
        onChangeNumMaxAnswer={changeNumMaxAnswer}
      />
      <HelpPopover
        anchorEl={helpAnchorEl}
        onClose={() => setHelpAnchorEl(null)}
      />
      <PuzzleMenu
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        selectedPuzzleKey={selectedPuzzleKey}
        onPuzzleSelect={handlePuzzleSelect}
      />
    </>
  );
};
