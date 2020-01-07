import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Bubble from "./bubble";
import { dependencyGraphStore } from "ui/store";

function Stage() {
  const initialClick: any = useRef(null);
  const shouldMove: any = useRef(false);
  const element: any = useRef(null);
  const internalElement: any = useRef(null);
  const dependencyGraph = useContext(dependencyGraphStore);

  const handleMouseDown = (e: any) => {
    if (e.target !== internalElement.current) {
      return;
    }

    initialClick.current = {
      x: e.clientX,
      y: e.clientY
    };
    shouldMove.current = true;
  };

  const handleMouseUp = () => {
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
      cursor={shouldMove ? "move" : "inherit"}
      height="calc(100vh - 100px)"
      overflow="auto"
    >
      <Flex
        className="background"
        ref={internalElement}
        position="relative"
        flexGrow={1}
      >
        <Bubble />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
