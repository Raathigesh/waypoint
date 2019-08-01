import React, { Fragment } from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { GlobalStyles } from "./GlobalStyles";
import { client } from "./GraphQLClient";
import theme from "./theme";
import blocks from "../blocks/ui-register";

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <Provider value={client}>
        <ThemeProvider theme={theme}>
          <Router initialEntries={["/search"]} initialIndex={0}>
            {blocks.map(({ view }) => (
              <Route exact path={view.path} component={view.Component} />
            ))}
          </Router>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
