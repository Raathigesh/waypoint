import React from "react";
import { Global, css } from "@emotion/core";
import { useTheme } from "@chakra-ui/core";

export function VSCodeStyleOverride() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        body {
          color: black;
          overflow: hidden;
        }
      `}
    />
  );
}
