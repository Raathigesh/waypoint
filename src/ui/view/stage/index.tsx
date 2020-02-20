import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex, Code, Box } from "@chakra-ui/core";
import { ArcherContainer, ArcherElement } from "react-archer";
import Bubble from "./bubble";
import { dependencyGraphStore } from "ui/store";
import SearchDialog from "../search";
import Outline from "../outline";

function Stage() {
  const initialClick: any = useRef(null);
  const shouldMove: any = useRef(false);
  const element: any = useRef(null);
  const internalElement: any = useRef(null);
  const dependencyGraph = useContext(dependencyGraphStore);
  const arcContainer: any = useRef(null);
  console.log(arcContainer);
  const hasBubbles =
    dependencyGraph.symbols.size ||
    dependencyGraph.notes.size ||
    dependencyGraph.files.size;

  const handleMouseDown = (e: any) => {
    if (e.target !== internalElement.current) {
      return;
    }

    initialClick.current = {
      x: e.clientX,
      y: e.clientY
    };
    shouldMove.current = true;
    element.current.style.userSelect = "none";
  };

  const handleMouseUp = () => {
    element.current.style.userSelect = "inherit";
    shouldMove.current = false;
    dependencyGraph.finalizePosition();
  };

  const handleMouseMove = (e: any) => {
    if (
      shouldMove.current &&
      element.current &&
      !dependencyGraph.isBubbleDragging
    ) {
      const deltaLeft = initialClick.current.x - e.clientX;
      const deltaTop = initialClick.current.y - e.clientY;
      dependencyGraph.moveSymbols(-deltaLeft, -deltaTop);
      initialClick.current.x = e.clientX;
      initialClick.current.y = e.clientY;
    }
  };

  const refProps: any = {
    ref: (r: any) => dependencyGraph.setArcContainerRef(r)
  };

  return (
    <ArcherContainer strokeColor="rgba(170, 170, 170, 0.15)" {...refProps}>
      <Flex
        ref={element}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        cursor={shouldMove ? "grab" : "inherit"}
        height="calc(100vh)"
        overflow="auto"
      >
        <Flex ref={internalElement} position="relative" flexGrow={1}>
          <Bubble />
          {!hasBubbles && (
            <Flex
              width="100%"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <Flex
                color="gray.500"
                width="100%"
                alignItems="center"
                justifyContent="center"
              >
                Press{" "}
                <Box
                  backgroundColor="gray.300"
                  paddingLeft="5px"
                  paddingRight="5px"
                  marginLeft="3px"
                  marginRight="3px"
                  borderRadius="5px"
                >
                  Ctrl + f
                </Box>
                or{" "}
                <Box
                  backgroundColor="gray.300"
                  paddingLeft="5px"
                  paddingRight="5px"
                  marginLeft="3px"
                  marginRight="3px"
                  borderRadius="5px"
                >
                  Ctrl + Shift + f
                </Box>
                to open search window
              </Flex>
              <Flex
                color="gray.500"
                width="100%"
                alignItems="center"
                justifyContent="center"
                marginTop="20px"
              >
                Press{" "}
                <Box
                  backgroundColor="gray.300"
                  paddingLeft="5px"
                  paddingRight="5px"
                  marginLeft="3px"
                  marginRight="3px"
                  borderRadius="5px"
                >
                  .
                </Box>
                to open stage outline window
              </Flex>
            </Flex>
          )}
        </Flex>
        <SearchDialog />
        <Outline />
      </Flex>
    </ArcherContainer>
  );
}

export default observer(Stage);
