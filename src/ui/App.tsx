import React, { useReducer, useEffect, Fragment } from "react";
import {
  Layout as LayoutIcon,
  Maximize,
  Square,
  Droplet,
  Edit,
  Edit2,
  Grid,
  Crosshair,
  Sun,
  Disc
} from "react-feather";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import theme from "./theme";
import { Flex } from "rebass";
import Theme from "./theme";
import "react-tippy/dist/tippy.css";

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const GlobalStyles = createGlobalStyle`
body {
  background-color: ${Theme.colors.background};
  height: 100vh;
  padding: 0px;
}
`;

const InitialState = {
  declarations: null
};

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <ThemeProvider theme={theme}>hello</ThemeProvider>
    </Fragment>
  );
}
