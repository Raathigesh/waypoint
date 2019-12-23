import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Bubble from "./bubble";
import { connectionStore } from "ui/store";
import Connections from "./connections";

function Stage() {
  const initialClick: any = useRef(null);
  const shouldMove: any = useRef(false);
  const element: any = useRef(null);
  const connection = useContext(connectionStore);

  const handleMouseDown = (e: any) => {
    initialClick.current = {
      x: e.clientX,
      y: e.clientY
    };
    shouldMove.current = true;
  };

  const handleMouseUp = () => {
    if (element.current) {
    }
    connection.addRelative(
      element.current.scrollLeft,
      element.current.scrollTop
    );
    shouldMove.current = false;
  };

  const handleMouseMove = (e: any) => {
    if (shouldMove.current && element.current) {
      const deltaLeft = initialClick.current.x - e.clientX;
      const deltaTop = initialClick.current.y - e.clientY;
      const previousMarginLeft = element.current.scrollLeft;
      const previousMarginTop = element.current.scrollTop;

      element.current.scrollLeft = previousMarginLeft + deltaLeft;
      element.current.scrollTop = previousMarginTop + deltaTop;

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
      width="100vw"
      cursor={shouldMove ? "move" : "inherit"}
      height="calc(100vh - 100px)"
      overflow="auto"
    >
      <Flex position="relative">
        <Bubble />
        <Connections size={{ height: "100%", width: "100%" }} />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
