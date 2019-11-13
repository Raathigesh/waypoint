import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Global, css } from "@emotion/core";
import "react-tippy/dist/tippy.css";
import { Provider } from "urql";
import { ThemeProvider as ChakraProvider, CSSReset } from "@chakra-ui/core";
import { client } from "./GraphQLClient";
import theme from "./theme";
import Search from "./Search";
import lightTheme from "./theme";
import { VSCodeStyleOverride } from "./view/VSCodeStyleOverride";

function App() {
  return (
    <Fragment>
      <Provider value={client}>
        <ChakraProvider theme={lightTheme}>
          <CSSReset />
          <VSCodeStyleOverride />
          <Search />
        </ChakraProvider>
      </Provider>
    </Fragment>
  );
}

export default observer(App);
