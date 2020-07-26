---
id: integration-test
title: Writing cypress integration test
sidebar_label: Writing integration test
---

The integration tests are written using Cypress. Since Waypoint is mostly a web UI, we start the extension and then browse the url of the web UI and test it using Cypress.

-   Cypress tests are in `cypress/integration` folder and you can add a new one there.
-   You have to build the extension before executing tests by running `yarn build`
-   Start the VSCode extension host by running `yarn e2e`. This will load our extension in a VSCode instance with `src/test/dummy-project-used-by-tests` as the workspace folder.
-   To run the cypress UI, run `yarn cypress-open` and you can click any tests to run it.
