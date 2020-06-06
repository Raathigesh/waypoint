import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore, appStore } from "ui/store";
import Code from "./code";

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const symbols = dependencyGraph.symbols;

  return (
    <Flex marginTop="15px" alignItems="flex-start">
      {[...symbols.entries()].map(([, sym]) => (
        <Code key={sym.id} symbol={sym} />
      ))}
    </Flex>
  );
}

export default observer(Bubble);
