import React, { Fragment } from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import client from "./ApolloClient";
import { GlobalStyles } from "./GlobalStyles";
import Search from "../blocks/findMySymbol/view/Search";
import theme from "./theme";
import ConfigureRules from "../blocks/findMySymbol/view/rules/Rules";

declare var acquireVsCodeApi: any;

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <Router initialEntries={["/configureRules"]} initialIndex={0}>
              <Route exact path="/search" component={Search} />
              <Route path="/configureRules" component={ConfigureRules} />
            </Router>
          </ApolloHooksProvider>
        </ApolloProvider>
      </ThemeProvider>
    </Fragment>
  );
}
