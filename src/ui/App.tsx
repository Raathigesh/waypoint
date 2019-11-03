import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import "react-tippy/dist/tippy.css";
import { Provider } from "urql";
import { ThemeProvider as ChakraProvider, CSSReset } from "@chakra-ui/core";
import { client } from "./GraphQLClient";
import theme from "./theme";
import Search from "./Search";

function App() {
  return (
    <Fragment>
      <Provider value={client}>
        <ChakraProvider>
          <CSSReset />
          <Search />
        </ChakraProvider>
      </Provider>
    </Fragment>
  );
}

export default observer(App);
