import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Flex } from "@chakra-ui/core";
import Bubble from "./bubble";

function Stage() {
  const [initialClientX, setInitialClientX] = useState(0);
  const [initialClientY, setInitialClientY] = useState(0);

  const [marginLeft, setMarginLeft] = useState(0);
  const [marginTop, setMarginTop] = useState(0);
  const [shouldMove, setShouldMove] = useState(false);

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
    >
      <Flex marginLeft={`${marginLeft}px`} marginTop={`${marginTop}px`}>
        <Bubble />
      </Flex>
    </Flex>
  );
}

export default observer(Stage);
