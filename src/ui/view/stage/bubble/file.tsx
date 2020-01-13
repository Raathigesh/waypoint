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

interface Props {
  file: Instance<typeof File>;
}

function FileBubble({ file }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const ref: any = useRef(null);

  const handle: any = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Draggable
      symbol={file}
      handle={handle}
      onStart={() => dependencyGraph.setIsBubbleDragging(true)}
      onEnd={(x: number, y: number) => {
        dependencyGraph.setIsBubbleDragging(false);
      }}
    >
      <Flex
        position="relative"
        marginRight="55px"
        marginBottom="25px"
        ref={ref}
        zIndex={3}
        backgroundColor="white"
        flexDirection="column"
        borderRadius="5px"
        boxShadow="
      0 0px 1.5px rgba(0, 0, 0, 0.028),
      0 0px 5.1px rgba(0, 0, 0, 0.042),
      0 0px 23px rgba(0, 0, 0, 0.07)
    "
      >
        <Flex
          cursor="grab"
          alignItems="center"
          backgroundColor={file.color || "rgba(0, 0, 0, 0.028)"}
          justifyContent="flex-end"
          borderRadius="5px 5px 0px 0px"
          padding="3px"
        >
          <Flex
            ref={handle}
            cursor="grab"
            className="handle"
            width="100%"
            marginLeft="5px"
            fontSize="13px"
          >
            {file.filePath.replace(projectInfo.root, "")}
          </Flex>
          {!collapsed && (
            <Minimize2
              cursor="pointer"
              size="12px"
              onClick={e => {
                setCollapsed(true);
                e.stopPropagation();
              }}
            />
          )}
          {collapsed && (
            <Maximize2
              cursor="pointer"
              size="12px"
              onClick={e => {
                setCollapsed(false);
                e.stopPropagation();
              }}
            />
          )}
          <X
            cursor="pointer"
            size="12px"
            onClick={e => {
              dependencyGraph.removeFile(file.filePath);
              e.stopPropagation();
            }}
          />
        </Flex>
        {!collapsed && (
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
        )}
      </Flex>
    </Draggable>
  );
}

export default observer(FileBubble);
