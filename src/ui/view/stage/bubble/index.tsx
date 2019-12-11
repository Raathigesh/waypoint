import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore } from "ui/store";
import Code from "./code";

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const currentSymbol = dependencyGraph.currentSymbol;
  if (!currentSymbol) {
    return null;
  }

  return (
    <Flex marginTop="15px">
      {currentSymbol && <Code symbol={currentSymbol} />}

      {dependencyGraph.getGraphColumns()?.map(bubbles => (
        <Flex flexDirection="column">
          {bubbles.map(sym => (
            <Code symbol={sym} />
          ))}
        </Flex>
      ))}
    </Flex>
  );
}

export default observer(Bubble);
