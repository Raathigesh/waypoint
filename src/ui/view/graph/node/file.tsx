import React from "react";
import { Text, Box, Tooltip } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
}

function File({ name, width, height, x, y }: Props) {
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
      borderColor="gray.300"
    >
      <Tooltip label={name} zIndex={100} aria-label="">
        <Text
          fontSize="xs"
          fontWeight={600}
          overflow="hidden"
          whiteSpace="nowrap"
          color="purple.600"
          style={{ direction: "rtl", textOverflow: "ellipsis" }}
        >
          {name}
        </Text>
      </Tooltip>
    </Box>
  );
}

export default observer(File);
