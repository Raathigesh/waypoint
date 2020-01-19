import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore, appStore } from "ui/store";
import Code from "./code";
import FileBubble from "./file";
import Note from "./note";

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const symbols = dependencyGraph.symbols;
  const files = dependencyGraph.files;
  const notes = dependencyGraph.notes;

  return (
    <Flex marginTop="15px" alignItems="flex-start">
      {[...symbols.entries()].map(([, sym]) => (
        <Code key={sym.id} symbol={sym} />
      ))}
      {[...files.entries()].map(([, file]) => (
        <FileBubble key={file.filePath} file={file} />
      ))}
      {[...notes.entries()].map(([, note]) => (
        <Note key={note.id} note={note} />
      ))}
    </Flex>
  );
}

export default observer(Bubble);
