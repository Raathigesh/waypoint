import React from "react";
import { Text, Box, Flex } from "@chakra-ui/core";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
}

export default function Node({ name, width, height, x, y }: Props) {
  return (
    <Flex
      width={`${width}px`}
      height={`${height}px`}
      left={`${x - width / 2}px`}
      top={`${y - height / 2}px`}
      position="absolute"
      padding="5px"
      borderRadius="3px"
      color="gray.50"
      bg="gray.600"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xs" fontWeight={600}>
        {name}
      </Text>
    </Flex>
  );
}
