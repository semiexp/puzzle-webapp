import React from "react";
import { useTranslation } from "react-i18next";
import puzzlesData from "../puzzles.json";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Fab,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowDropDown, Help, Settings } from "@mui/icons-material";

type SolverControlsProps = {
  problemUrl: string;
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  solverRunning: boolean;
  isPenpaEdit: boolean;
  selectedPuzzleKey: string;
  onSolve: (enumerateAnswers: boolean) => void;
  onStop: () => void;
  onConfigButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onHelpButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const SolverControls: React.FC<SolverControlsProps> = ({
  problemUrl,
  onChangeUrl,
  solverRunning,
  isPenpaEdit,
  selectedPuzzleKey,
  onSolve,
  onStop,
  onConfigButtonClick,
  onHelpButtonClick,
  onMenuClick,
}) => {
  const { t, i18n } = useTranslation();

  const selectedPuzzle = puzzlesData.penpa_edit.find(
    (p) => p.key === selectedPuzzleKey,
  );
  const selectedPuzzleName =
    selectedPuzzle?.[i18n.language as "en" | "ja"] || selectedPuzzle?.en || "";

  return (
    <Grid container sx={{ display: "flex", width: "100%" }}>
      <Grid size={9} sx={{ display: "flex", alignItems: "center" }}>
        <Fab
          color="default"
          size="small"
          sx={{ marginRight: 1 }}
          onClick={onHelpButtonClick}
        >
          <Help />
        </Fab>
        <Fab
          color="default"
          size="small"
          sx={{ marginRight: 1 }}
          onClick={onConfigButtonClick}
        >
          <Settings />
        </Fab>
        <TextField
          label={t("puzzleSolver.problemUrl")}
          value={problemUrl}
          onChange={onChangeUrl}
          sx={{ flexGrow: 1 }}
        />
      </Grid>
      {solverRunning ? (
        <Grid size={3}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={onStop}
            sx={{ width: "100%", height: "100%" }}
          >
            <CircularProgress size={24} sx={{ marginRight: 1 }} />
            {t("puzzleSolver.stop")}
          </Button>
        </Grid>
      ) : isPenpaEdit ? (
        <Grid size={3}>
          <ButtonGroup
            variant="outlined"
            sx={{ width: "100%", height: "100%" }}
          >
            <Button
              size="large"
              onClick={() => onSolve(false)}
              sx={{ flexGrow: 1, textTransform: "none" }}
            >
              {`${t("puzzleSolver.solve")} ${selectedPuzzleName}`}
            </Button>
            <Button
              size="small"
              onClick={onMenuClick}
              sx={{ width: "40px", minWidth: "40px", padding: 0 }}
            >
              <ArrowDropDown />
            </Button>
          </ButtonGroup>
        </Grid>
      ) : (
        <>
          <Grid size={1.5}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onSolve(false)}
              sx={{ width: "100%", height: "100%" }}
            >
              {t("puzzleSolver.solve")}
            </Button>
          </Grid>
          <Grid size={1.5}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onSolve(true)}
              sx={{ width: "100%", height: "100%" }}
            >
              {t("puzzleSolver.list")}
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};
