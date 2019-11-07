import React from "react";
import { Flex, Box } from "@chakra-ui/core";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function Node({ width, height, x, y }: Props) {
  return (
    <Box
      width={`${width}px`}
      height={`${height}px`}
      left={`${x - width / 2}px`}
      top={`${y - height / 2}px`}
      position="absolute"
      border="1px solid wheat"
    >
      Hello
    </Box>
  );
}
