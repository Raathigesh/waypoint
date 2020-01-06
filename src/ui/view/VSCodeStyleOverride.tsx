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

        .background {
          background-color: #f3f3f3;
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a9a6ff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}
    />
  );
}
