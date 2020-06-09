import React from "react";
import { Flex } from "@chakra-ui/core";
import { ResizableBox } from "react-resizable";
import { Bookmark } from "react-feather";

import { getAliasPathForAbsolutePath } from "/src/indexer/fileResolver.ts";
export default function WidgetFrame({
  title,
  Icon,
  height,
  width,
  children,
  mb
}: any) {
  return (
    <Flex mb={mb}>
      <ResizableBox
        handle={
          <Flex
            width="100%"
            height="8px"
            backgroundColor="#f4f4f4"
            cursor="ns-resize"
            alignItems="center"
            justifyContent="center"
          >
            <svg
              width="24"
              height="6"
              viewBox="0 0 44 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="12" width="34" height="1.5" fill="gray" />
              <rect width="34" height="1.5" fill="gray" />
              <rect y="6" width="34" height="1.5" fill="gray" />
            </svg>
          </Flex>
        }
        axis="y"
        width={width}
        height={height}
        draggableOpts={{}}
      >
        <Flex
          backgroundColor="white"
          direction="column"
          height="100%"
          borderStyle="solid"
        >
          <Flex
            backgroundColor="#fbfbfb"
            borderRadius="3px"
            padding="8px"
            mb="10px"
            alignItems="center"
          >
            <Icon size={13} />
            <Flex ml="5px" fontSize="14px" fontWeight={400}>
              {title}
            </Flex>
          </Flex>
          <Flex padding="8px" direction="column" overflow="auto">
            {children}
          </Flex>
        </Flex>
      </ResizableBox>
    </Flex>
  );
}
