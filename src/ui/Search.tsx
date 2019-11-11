import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Graph from "./view/graph";
import Search from "./view/search";
import { dependencyGraphStore, indexerStatusStore } from "./store";

function App() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const indexerStatus = useContext(indexerStatusStore);
  useEffect(() => {
    indexerStatus.pollForStatus();
  }, []);

  return (
    <Flex bg="gray.50" flexDirection="column" p={3} minHeight="100vh">
      {indexerStatus.status}
      <Search />
      <Graph
        references={dependencyGraph.references}
        documentSymbol={dependencyGraph.currentSymbol}
      />
    </Flex>
  );
}

export default observer(App);
