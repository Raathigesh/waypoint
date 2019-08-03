import React, { Fragment } from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { GlobalStyles } from "./GlobalStyles";
import { client } from "./GraphQLClient";
import theme from "./theme";
import Stage from "./stage";

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <Provider value={client}>
        <ThemeProvider theme={theme}>
          <Router initialEntries={["/"]} initialIndex={0}>
            <Route exact path="/" component={Stage} />
          </Router>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
