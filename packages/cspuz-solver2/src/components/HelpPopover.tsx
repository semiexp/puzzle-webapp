import React from "react";
import { Popover } from "@mui/material";
import { Usage } from "../usage";

type HelpPopoverProps = {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
};

export const HelpPopover: React.FC<HelpPopoverProps> = ({
  anchorEl,
  onClose,
}) => {
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
      <Usage />
    </Popover>
  );
};
