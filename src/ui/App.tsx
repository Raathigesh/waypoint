import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import "react-tippy/dist/tippy.css";
import { Provider } from "urql";
import { ThemeProvider as ChakraProvider, CSSReset } from "@chakra-ui/core";
import { client } from "./graphql-client";
import View from "./view";
import lightTheme from "./theme";
import { VSCodeStyleOverride } from "./view/VSCodeStyleOverride";

function App() {
  return (
    <Fragment>
      <Provider value={client}>
        <ChakraProvider theme={lightTheme}>
          <CSSReset />
          <VSCodeStyleOverride />
          <View />
        </ChakraProvider>
      </Provider>
    </Fragment>
  );
}

export default observer(App);
