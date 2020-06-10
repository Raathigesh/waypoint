## Contributing to Waypoint

### Running the extension locally

- Checkout the repository.
- Install node modules by executing `yarn install`.
- Run `yarn watch` and this will compile the extension scripts.
- Run `yarn ui` in a separate terminal and this will start the webpack dev server for the UI.
- Run the `Run Extension` VSCode task to launch the extension.
- You can also visit `http://localhost:9000/` in the browser to view the UI separately.

### A few lines on the tech and the folder structure

- The frontend is built with React and mobx-state-tree. The code for the frontend is in `src/ui` directory.
- The entry point of the extension is `src/extension/extension.ts`.
- The frontend communicates to the local node server via a GraphQL API. The API code is in `src/extension/services` directory.
- The main component of the project is the **Indexer** which analyses the source code and provides various information to the UI. The Indexer is in `srx/indexer` directory.
- The entities which are shared by the GraphQL API and the frontend can be found in `src/entities` directory.
