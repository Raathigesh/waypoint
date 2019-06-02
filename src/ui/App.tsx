import React, { Fragment } from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { GlobalStyles } from "./GlobalStyles";
import { client } from "./GraphQLClient";
import theme from "./theme";
import ConfigureRules from "../blocks/findMySymbol/view/rules/Rules";
import Search from "../blocks/findMySymbol/view/Search";

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <Provider value={client}>
        <ThemeProvider theme={theme}>
          <Router initialEntries={["/search"]} initialIndex={0}>
            <Route exact path="/search" component={Search} />
            <Route path="/configureRules" component={ConfigureRules} />
          </Router>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
