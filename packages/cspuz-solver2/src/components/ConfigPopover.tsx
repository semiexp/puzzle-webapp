import React from "react";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

type ConfigPopoverProps = {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  numMaxAnswer: number;
  onChangeNumMaxAnswer: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ConfigPopover: React.FC<ConfigPopoverProps> = ({
  anchorEl,
  onClose,
  numMaxAnswer,
  onChangeNumMaxAnswer,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Popover
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={onClose}
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
            onChange={onChangeNumMaxAnswer}
            slotProps={{ htmlInput: { size: 6 } }}
          />
        </ListItem>
      </List>
    </Popover>
  );
};
