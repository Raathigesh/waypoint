import React, { useState, useLayoutEffect, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Bubble from "./bubble";
import { connectionStore } from "ui/store";
import Connections from "./connections";

function Stage() {
  const mainNode: any = useRef(null);
  const container: any = useRef(null);
  const connections = useContext(connectionStore);

  const [initialClientX, setInitialClientX] = useState(0);
  const [initialClientY, setInitialClientY] = useState(0);

  const [marginLeft, setMarginLeft] = useState(0);
  const [marginTop, setMarginTop] = useState(0);
  const [shouldMove, setShouldMove] = useState(false);

  useLayoutEffect(() => {
    if (!mainNode.current) {
      return;
    }

    const rect = mainNode.current.getBoundingClientRect();

    if (!container.current) {
      return;
    }
    const containerRect = container.current.getBoundingClientRect();
  });

  const handleMouseDown = (e: any) => {
    setInitialClientX(e.clientX);
    setInitialClientY(e.clientY);
    setShouldMove(true);
  };

  const handleMouseUp = () => {
    setShouldMove(false);
  };

  const handleMouseMove = (e: any) => {
    if (shouldMove) {
      setMarginLeft(e.clientX - initialClientX);
      setMarginTop(e.clientY - initialClientY);
    }
  };

  return (
    <Flex
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width="100%"
      cursor={shouldMove ? "move" : "inherit"}
      ref={container}
    >
      <Flex marginLeft={`${marginLeft}px`} marginTop={`${marginTop}px`}>
        <Bubble />
        <Connections size={{ height: "100%", width: "100%" }} />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
