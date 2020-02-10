import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex, Code } from "@chakra-ui/core";
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

  return (
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
            color="gray.300"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            Press <Code children=" Ctrl + f " /> or{" "}
            <Code children=" Ctrl + Shift + f " /> to open search window
          </Flex>
        )}
      </Flex>
      <SearchDialog />
      <Outline />
    </Flex>
  );
}

export default observer(Stage);
