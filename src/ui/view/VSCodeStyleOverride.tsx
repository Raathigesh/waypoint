import React from "react";
import { Global, css } from "@emotion/core";

export function VSCodeStyleOverride() {
  return (
    <Global
      styles={css`
        body {
          color: black;
          overflow: hidden;
          padding: 0px;
        }
        ::-webkit-scrollbar {
          width: 0.5em;
          height: 5px;
        }

        ::-webkit-scrollbar-track {
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.2);
        }

        ::-webkit-scrollbar-corner,
        ::-webkit-scrollbar-thumb:window-inactive {
          background: rgba(216, 216, 216, 0.4);
        }
      `}
    />
  );
}
