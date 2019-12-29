import React from "react";
import { render } from "react-dom";
import App from "./App";

render(<App />, document.getElementById("root"));

if ((module as any).hot) {
  (module as any).hot.accept("./app", () => {
    const NextApp = require("./app").default;
    render(<NextApp />, document.getElementById("root"));
  });
}
