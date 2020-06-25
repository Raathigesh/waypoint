import React from "react";
import { Flex } from "@chakra-ui/core";
import { ResizableBox } from "react-resizable";

export default function WidgetFrame({
  title,
  subTitle,
  Icon,
  height,
  width,
  children,
  mb
}: any) {
  return (
    <Flex mb={mb} height="calc(100vh - 80px)">
      <Flex
        backgroundColor="#F9F9F9"
        direction="column"
        borderStyle="solid"
        width="100%"
      >
        <Flex padding="8px" direction="column" overflow="auto">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
