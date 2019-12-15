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
      const previousMarginLeft = parseInt(
        element.current.style.marginLeft.replace("px", "") || 0
      );
      const previousMarginTop = parseInt(
        element.current.style.marginTop.replace("px", "") || 0
      );
      console.log(
        "previousMarginLeft",
        previousMarginLeft,
        "deltaLeft",
        deltaLeft,
        "deltaTop",
        deltaTop
      );
      element.current.style.marginLeft = `${previousMarginLeft + deltaLeft}px`;
      element.current.style.marginTop = `${previousMarginTop + deltaTop}px`;

      initialClick.current.x = e.clientX;
      initialClick.current.y = e.clientY;
    }
  };

  return (
    <Flex
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width="100%"
      cursor={shouldMove ? "move" : "inherit"}
      height="100vh"
    >
      <Flex ref={element}>
        <Bubble />
        <Connections size={{ height: "100%", width: "100%" }} />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
