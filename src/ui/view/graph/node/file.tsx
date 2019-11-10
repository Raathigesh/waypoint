import React from "react";
import { Text, Box, Tooltip } from "@chakra-ui/core";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
}

export default function File({ name, width, height, x, y }: Props) {
  return (
    <Box
      width={`${width}px`}
      height={`${height}px`}
      left={`${x - width / 2}px`}
      top={`${y - height / 2}px`}
      position="absolute"
      padding="5px"
      borderRadius="3px"
      color="gray.50"
      border="1px solid gray"
    >
      <Tooltip label={name} zIndex={100}>
        <Text
          fontSize="xs"
          fontWeight={600}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          color="purple.600"
          style={{ direction: "rtl" }}
        >
          {name}
        </Text>
      </Tooltip>
    </Box>
  );
}
