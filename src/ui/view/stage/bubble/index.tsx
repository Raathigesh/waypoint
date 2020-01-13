import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore, appStore } from "ui/store";
import Code from "./code";
import FileBubble from "./file";
import { getCharWidth } from "ui/util/view";

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const symbols = dependencyGraph.symbols;
  const files = dependencyGraph.files;
  const projectInfo = useContext(appStore);

  const charWidth = getCharWidth(projectInfo.fontSize, projectInfo.fontFamily);

  return (
    <Flex marginTop="15px" alignItems="flex-start">
      {[...symbols.entries()].map(([, sym]) => (
        <Code key={sym.id} symbol={sym} charWidth={charWidth} />
      ))}
      {[...files.entries()].map(([, file]) => (
        <FileBubble key={file.filePath} file={file} />
      ))}
    </Flex>
  );
}

export default observer(Bubble);
