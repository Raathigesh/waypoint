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
          padding: 0px;
        }
        .error-marker {
          background-color: #f2f2f2;
          pointer-events: all;
          position: absolute;
          cursor: pointer;
        }
        .error-marker:hover {
          background-color: #c2c2c2;
        }
      `}
    />
  );
}
