import React, { Fragment } from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { ThemeProvider } from "styled-components";
import client from "./ApolloClient";
import { GlobalStyles } from "./GlobalStyles";
import Search from "./search/Search";
import theme from "./theme";

declare var acquireVsCodeApi: any;

export default function App() {
  return (
    <Fragment>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <ApolloHooksProvider client={client}>
            <Search />
            <Router>
              <Route exact path="/" component={Search} />
            </Router>
          </ApolloHooksProvider>
        </ApolloProvider>
      </ThemeProvider>
    </Fragment>
  );
}
