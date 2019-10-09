import React, { Fragment } from "react";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { ThemeProvider as ChakraProvider, CSSReset } from "@chakra-ui/core";
import { GlobalStyles } from "./GlobalStyles";
import { client } from "./GraphQLClient";
import theme from "./theme";
import Search from "./Search";

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <Provider value={client}>
        <ThemeProvider theme={theme}>
          <ChakraProvider>
            <CSSReset />
            <Search />
          </ChakraProvider>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
