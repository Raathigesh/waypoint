import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  Fragment
} from "react";
import {
  Flex,
  Link,
  Text,
  Tooltip,
  Icon,
  Button,
  IconButton,
  Box
} from "@chakra-ui/core";
import { File as FileIcon } from "react-feather";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { File } from "ui/store/models/File";
import { X, Minimize2, Maximize2 } from "react-feather";
import { openFile } from "ui/store/services/file";
import Draggable from "./Dragabble";
import Frame from "./Frame";
import SymbolKindIcon from "ui/view/components/SymbolKindIcon";

interface Props {
  file: Instance<typeof File>;
}

function FileBubble({ file }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);

  return (
    <Frame
      title={
        <Flex alignItems="center">
          <Box marginRight="5px">
            <FileIcon size="15px" />
          </Box>
          {file.filePath.replace(projectInfo.root, "")}
        </Flex>
      }
      x={file.x || 0}
      y={file.y || 0}
      headerColor={file.color || "rgba(0, 0, 0, 0.028)"}
      onEnd={() => {
        dependencyGraph.setIsBubbleDragging(false);
      }}
      onStart={() => dependencyGraph.setIsBubbleDragging(true)}
      onRemove={() => {
        dependencyGraph.removeFile(file.filePath);
      }}
      setPosition={file.setPosition}
      setRef={file.setRef}
    >
      <Fragment>
        <Flex flexDirection="column">
          {file.symbols.map(sym => (
            <Flex
              key={sym.id}
              alignItems="center"
              marginRight="8px"
              marginBottom="8px"
            >
              <Box marginLeft="10px" marginRight="10px">
                <SymbolKindIcon kind={sym.kind} size="11px" />
              </Box>
              <Link
                fontSize="12px"
                onClick={() =>
                  dependencyGraph.setCurrentSymbol(sym.name, sym.filePath)
                }
              >
                {sym.name}
              </Link>
            </Flex>
          ))}
        </Flex>
      </Fragment>
    </Frame>
  );
}

export default observer(FileBubble);
