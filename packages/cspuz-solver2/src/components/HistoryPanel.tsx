import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { SolverResult } from "../solverBackend";

type HistoryPanelProps = {
  history: SolverResult[];
  onSelectFromHistory: (i: number) => void;
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectFromHistory,
}) => {
  const { t } = useTranslation();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{t("puzzleSolver.history")}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: "300px", overflowY: "auto" }}>
        <List>
          {history.map((r, i) => (
            <ListItemButton
              key={i}
              onClick={() => onSelectFromHistory(i)}
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
  );
};
