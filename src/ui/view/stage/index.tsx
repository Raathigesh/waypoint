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

  const handleMouseDown = (e: any) => {
    initialClick.current = {
      x: e.clientX,
      y: e.clientY
    };
    shouldMove.current = true;
  };

  const handleMouseUp = () => {
    shouldMove.current = false;
  };

  const handleMouseMove = (e: any) => {
    if (shouldMove.current && element.current) {
      const deltaLeft = e.clientX - initialClick.current.x;
      const deltaTop = e.clientY - initialClick.current.y;
      element.current.style.marginLeft = `${deltaLeft}px`;
      element.current.style.marginTop = `${deltaTop}px`;
    }
  };

  return (
    <Flex
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width="100%"
      cursor={shouldMove ? "move" : "inherit"}
    >
      <Flex ref={element}>
        <Bubble />
        <Connections size={{ height: "100%", width: "100%" }} />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
