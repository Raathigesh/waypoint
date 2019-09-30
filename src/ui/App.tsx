import React, { Fragment } from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import { Provider as StoreProvider } from "react-redux";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { ThemeProvider as ChakraProvider, CSSReset } from "@chakra-ui/core";
import { PersistGate } from "redux-persist/lib/integration/react";
import { getPersistor } from "@rematch/persist";
import { GlobalStyles } from "./GlobalStyles";
import { client } from "./GraphQLClient";
import theme from "./theme";
import Search from "./Search";
import { store } from "./store";

const persistor = getPersistor();

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <StoreProvider store={store}>
        <Provider value={client}>
          <ThemeProvider theme={theme}>
            <ChakraProvider>
              <CSSReset />
              <PersistGate loading={"Loading"} persistor={persistor}>
                <Search />
              </PersistGate>
            </ChakraProvider>
          </ThemeProvider>
        </Provider>
      </StoreProvider>
    </Fragment>
  );
}
