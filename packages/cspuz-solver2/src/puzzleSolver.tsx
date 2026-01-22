import React from "react";
import { useTranslation } from "react-i18next";
import { solveProblem, terminateWorker, SolverResult } from "./solverBackend";
import { inflateBase64 } from "./zlib";
import puzzlesData from "./puzzles.json";
import { AnswerViewer } from "./answerViewer";
import { Usage } from "./usage";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowDropDown, ExpandMore, Help, Settings } from "@mui/icons-material";

let solveOnLoadDone = false;

const isPenpaEditUrl = (url: string): boolean => {
  return url.startsWith("https://opt-pan.github.io/penpa-edit/");
};

const maybePreDecodeUrl = (url: string, puzzleKey?: string): string => {
  if (isPenpaEditUrl(url)) {
    const idx = url.indexOf("&p=");
    if (idx >= 0 && puzzleKey !== undefined) {
      const p = url.substring(idx + 3);
      const idx2 = p.indexOf("&");

      const encoded = idx2 >= 0 ? p.substring(0, idx2) : p;
      const decoded = inflateBase64(encoded);

      const key = puzzleKey;
      return key + "!penpa-edit-predecoded:" + decoded;
    } else {
      return "penpa-edit-predecoded:"; // TODO
    }
  } else {
    return url;
  }
};

export const PuzzleSolver = () => {
  const { t, i18n } = useTranslation();
  const [problemUrl, setProblemUrl] = React.useState("");
  const [solverRunning, setSolverRunning] = React.useState(false);
  const [result, setResult] = React.useState<SolverResult | undefined>(
    undefined,
  );
  const [history, setHistory] = React.useState<SolverResult[]>([]);
  const [numMaxAnswer, setNumMaxAnswer] = React.useState(100);
  const [selectedPuzzleKey, setSelectedPuzzleKey] = React.useState(
    puzzlesData.penpa_edit[0].key,
  );
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );

  const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProblemUrl(e.target.value);
  };
  const changeNumMaxAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value);
    if (!isNaN(n) && n > 0) {
      setNumMaxAnswer(n);
    }
  };
  const solve = async (
    url: string,
    enumerateAnswers: boolean,
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
      // TODO: pre-decode url in solveProblem, not here
      const newHistory = [{ ...result, url: url }];
      newHistory.push(...history);
      if (newHistory.length > 50) {
        newHistory.pop();
      }
      return newHistory;
    });
    setSolverRunning(false);
  };
  const stop = () => {
    terminateWorker();
  };
  const selectFromHistory = (i: number) => {
    if (solverRunning) {
      return;
    }
    const r = history[i];
    setProblemUrl(r.url);
    setResult(r);
  };

  let isUnique: boolean | undefined = undefined;
  if (result !== undefined && result.status === "success") {
    const r = result.result;
    if ("isUnique" in r) {
      isUnique = r.isUnique;
    }
  } else {
    isUnique = undefined;
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
      error = result.error;
    } else if (result.status === "terminated") {
      error = t("puzzleSolver.terminated");
    } else if (result.status === "noAnswer") {
      error = t("puzzleSolver.noAnswer");
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
  const [configAnchorEl, setConfigAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);
  const handleConfigButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setConfigAnchorEl(event.currentTarget);
  };
  const [helpAnchorEl, setHelpAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);
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

  const isPenpaEdit = isPenpaEditUrl(problemUrl);
  const selectedPuzzle = puzzlesData.penpa_edit.find(
    (p) => p.key === selectedPuzzleKey,
  );
  const selectedPuzzleName =
    selectedPuzzle?.[i18n.language as "en" | "ja"] || selectedPuzzle?.en || "";

  const loadProblemFromUrlHash = () => {
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
  };

  React.useEffect(() => {
    if (!solveOnLoadDone) {
      solveOnLoadDone = true;
      loadProblemFromUrlHash();
    }
  }, []);

  React.useEffect(() => {
    const onHashChange = () => {
      loadProblemFromUrlHash();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [solverRunning]);

  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <Grid container sx={{ display: "flex", width: "100%" }}>
            <Grid size={9} sx={{ display: "flex", alignItems: "center" }}>
              <Fab
                color="default"
                size="small"
                sx={{ marginRight: 1 }}
                onClick={handleHelpButtonClick}
              >
                <Help />
              </Fab>
              <Fab
                color="default"
                size="small"
                sx={{ marginRight: 1 }}
                onClick={handleConfigButtonClick}
              >
                <Settings />
              </Fab>
              <TextField
                label={t("puzzleSolver.problemUrl")}
                value={problemUrl}
                onChange={changeUrl}
                sx={{ flexGrow: 1 }}
              />
            </Grid>
            {solverRunning ? (
              <Grid size={3}>
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={stop}
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
                    onClick={() =>
                      solve(problemUrl, false, undefined, selectedPuzzleKey)
                    }
                    sx={{ flexGrow: 1, textTransform: "none" }}
                  >
                    {`${t("puzzleSolver.solve")} ${selectedPuzzleName}`}
                  </Button>
                  <Button
                    size="small"
                    onClick={handleMenuClick}
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
                    onClick={() => solve(problemUrl, false)}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {t("puzzleSolver.solve")}
                  </Button>
                </Grid>
                <Grid size={1.5}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => solve(problemUrl, true)}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {t("puzzleSolver.list")}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{t("puzzleSolver.history")}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ maxHeight: "300px", overflowY: "auto" }}>
              <List>
                {history.map((r, i) => (
                  <ListItemButton
                    key={i}
                    onClick={() => selectFromHistory(i)}
                    sx={{
                      overflow: "hidden",
                      textWrap: "nowrap",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography>{r.url}</Typography>
                  </ListItemButton>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
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
        {result && result.status === "success" && (
          <AnswerViewer result={result.result} />
        )}
      </div>
      <Popover
        open={configAnchorEl !== null}
        anchorEl={configAnchorEl}
        onClose={() => setConfigAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem>
            <Typography sx={{ paddingRight: 1 }}>Language: </Typography>
            <ToggleButtonGroup
              color="primary"
              value={i18n.language}
              onChange={(_, value) => {
                if (value !== null) i18n.changeLanguage(value);
              }}
              exclusive
            >
              <ToggleButton value="ja">日本語</ToggleButton>
              <ToggleButton value="en">English</ToggleButton>
            </ToggleButtonGroup>
          </ListItem>
          <ListItem>
            <Typography sx={{ paddingRight: 1 }}>
              {t("puzzleSolver.maxAnswers")}
            </Typography>
            <TextField
              type="number"
              value={numMaxAnswer}
              onChange={changeNumMaxAnswer}
              slotProps={{ htmlInput: { size: 6 } }}
            />
          </ListItem>
        </List>
      </Popover>
      <Popover
        open={helpAnchorEl !== null}
        anchorEl={helpAnchorEl}
        onClose={() => setHelpAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Usage />
      </Popover>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {puzzlesData.penpa_edit.map((puzzle) => (
          <MenuItem
            key={puzzle.key}
            onClick={() => handlePuzzleSelect(puzzle.key)}
            selected={puzzle.key === selectedPuzzleKey}
          >
            {puzzle[i18n.language as "en" | "ja"] || puzzle.en}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
