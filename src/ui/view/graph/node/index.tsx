import React from "react";
import { Text, Box, Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { openFile } from "ui/EventBus";
import { DocumentLocation } from "ui/store/models/DocumentLocation";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
  path: string;
  location: typeof DocumentLocation;
}

function Node({ name, width, height, x, y, location, path }: Props) {
  return (
    <Flex
      width={`${width - 10}px`}
      height={`${height - 10}px`}
      left={`${x - width / 2}px`}
      top={`${y - height / 2}px`}
      position="absolute"
      padding="5px"
      borderRadius="3px"
      color="gray.50"
      bg="gray.600"
      alignItems="center"
      justifyContent="center"
      margin="5px"
      cursor="pointer"
      zIndex={99}
      onClick={() => {
        openFile(path, (location as any).toJSON());
      }}
    >
      <Text fontSize="xs" fontWeight={600}>
        {name}
      </Text>
    </Flex>
  );
}

export default observer(Node);
