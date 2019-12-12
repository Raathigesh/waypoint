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
        ::-webkit-scrollbar {
          width: 0.5em;
        }

        ::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.8);
        }

        ::-webkit-scrollbar-corner,
        ::-webkit-scrollbar-thumb:window-inactive {
          background: rgba(100, 100, 100, 0.4);
        }
      `}
    />
  );
}
