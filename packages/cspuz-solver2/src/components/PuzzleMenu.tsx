import React from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "@mui/material";
import puzzlesData from "../puzzles.json";

type PuzzleMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedPuzzleKey: string;
  onPuzzleSelect: (key: string) => void;
};

export const PuzzleMenu: React.FC<PuzzleMenuProps> = ({
  anchorEl,
  onClose,
  selectedPuzzleKey,
  onPuzzleSelect,
}) => {
  const { i18n } = useTranslation();

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {puzzlesData.penpa_edit.map((puzzle) => (
        <MenuItem
          key={puzzle.key}
          onClick={() => onPuzzleSelect(puzzle.key)}
          selected={puzzle.key === selectedPuzzleKey}
        >
          {puzzle[i18n.language as "en" | "ja"] || puzzle.en}
        </MenuItem>
      ))}
    </Menu>
  );
};
