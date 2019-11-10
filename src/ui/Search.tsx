import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Graph from "./view/graph";
import Search from "./view/search";
import { dependencyGraphStore } from "./store";

function App() {
  const dependencyGraph = useContext(dependencyGraphStore);

  return (
    <Flex
      bg="gray.200"
      flexDirection="column"
      flexGrow={1}
      p={3}
      height="100vh"
    >
      <Search />
      <Graph
        references={dependencyGraph.references}
        documentSymbol={dependencyGraph.currentSymbol}
      />
    </Flex>
  );
}

export default observer(App);
