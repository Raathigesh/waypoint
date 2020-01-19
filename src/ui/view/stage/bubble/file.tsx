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
  IconButton
} from "@chakra-ui/core";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { File } from "ui/store/models/File";
import { X, Minimize2, Maximize2 } from "react-feather";
import { openFile } from "ui/store/services/file";
import Draggable from "./Dragabble";
import Frame from "./Frame";

interface Props {
  file: Instance<typeof File>;
}

function FileBubble({ file }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);

  return (
    <Frame
      title={file.filePath.replace(projectInfo.root, "")}
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
            <Flex alignItems="center" marginRight="5px">
              <Button
                flexGrow={1}
                variantColor="teal"
                variant="ghost"
                justifyContent="flex-start"
                fontSize="12px"
                height="30px"
                onClick={() => dependencyGraph.setCurrentSymbol(sym as any)}
              >
                {sym.name}
              </Button>
              <IconButton
                variant="outline"
                aria-label="Call Segun"
                size="xs"
                icon="external-link"
                onClick={() => openFile(file.filePath, sym.location as any)}
              />
            </Flex>
          ))}
        </Flex>
      </Fragment>
    </Frame>
  );
}

export default observer(FileBubble);
