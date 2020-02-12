import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Button,
  Link
} from "@chakra-ui/core";
import { appStore, dependencyGraphStore } from "ui/store";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { ChevronRight, ChevronDown, Folder, File, Circle } from "react-feather";
import { openFile } from "ui/store/services/file";
import { observer } from "mobx-react-lite";
import { constructTree } from "./util";

function TreeNode({ item, collapsedNodes, onExpand, onCollapse }: any): any {
  const isCollapsed = collapsedNodes[item.id];
  const dependencyStore = useContext(dependencyGraphStore);

  return (
    <Flex flexDirection="column" marginLeft="15px">
      <Flex flexDirection="column">
        <Flex
          alignItems="center"
          cursor="pointer"
          marginLeft={item.type === "file" ? "10px" : "0px"}
          onClick={() => {
            if (item.type === "directory") {
              if (isCollapsed) {
                onExpand(item.id);
              } else {
                onCollapse(item.id);
              }
            }
          }}
        >
          {item.type === "directory" && !isCollapsed && (
            <ChevronDown size={12} />
          )}
          {item.type === "directory" && isCollapsed && (
            <ChevronRight size={12} />
          )}
          {item.type === "directory" && <Folder size={12} />}
          {item.type === "file" && <File size={12} />}
          <Flex marginLeft="5px" fontSize={13}>
            {item.label}
          </Flex>
        </Flex>
        {!isCollapsed && (item.symbols || []).length !== 0 && (
          <Flex flexDirection="column" marginLeft="30px" marginBottom="5px">
            {(item.symbols || []).map((symbol: any) => (
              <Flex fontSize={13} fontWeight={600} alignItems="center">
                <Circle size={10} />
                <Flex marginLeft="5px">
                  <Link
                    onClick={() =>
                      dependencyStore.moveSymbols(-symbol.x, -symbol.y)
                    }
                  >
                    {symbol.name}
                  </Link>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
      {!isCollapsed &&
        (item.children || []).map((child: any) => (
          <TreeNode
            item={child}
            collapsedNodes={collapsedNodes}
            onExpand={onExpand}
            onCollapse={onCollapse}
          />
        ))}
    </Flex>
  );
}

export interface Props {}
function Outline({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dependencyStore = useContext(dependencyGraphStore);
  const app = useContext(appStore);
  const tree = constructTree(
    app.root,
    [...dependencyStore.symbols.values()],
    app.separator
  );
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const onExpand = (filePath: string) => {
    setCollapsedNodes({
      ...collapsedNodes,
      [filePath]: false
    });
  };

  const onCollapse = (filePath: string) => {
    setCollapsedNodes({
      ...collapsedNodes,
      [filePath]: true
    });
  };

  function downHandler(e: any) {
    if (e.key === ".") {
      setIsOpen(true);
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="xl"
      closeOnOverlayClick
    >
      <ModalOverlay />
      <ModalContent padding="10px" height="400px" borderRadius="3px">
        <Flex
          flexDirection="column"
          overflow="auto"
          height="calc(100vh - 75px)"
        >
          <TreeNode
            item={tree}
            collapsedNodes={collapsedNodes}
            onExpand={onExpand}
            onCollapse={onCollapse}
          />
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default observer(Outline);
