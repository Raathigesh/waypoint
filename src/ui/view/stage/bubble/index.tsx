import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore } from "ui/store";
import Code from "./code";
import { getCharWidth } from "ui/util/view";

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const currentSymbol = dependencyGraph.currentSymbol;
  const otherSymbols = dependencyGraph.otherSymbols;

  if (!currentSymbol) {
    return null;
  }

  const charWidth = getCharWidth();

  return (
    <Flex marginTop="15px" alignItems="flex-start">
      {currentSymbol && <Code symbol={currentSymbol} charWidth={charWidth} />}
      {[...otherSymbols.entries()].map(([, sym]) => (
        <Code key={sym.id} symbol={sym} charWidth={charWidth} />
      ))}
    </Flex>
  );
}

export default observer(Bubble);
