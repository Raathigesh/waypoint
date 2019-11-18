import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Flex, Text } from "@chakra-ui/core";
import Function from "../function";
import { observer } from "mobx-react-lite";
import { File as FileType } from "../";
import { animated } from "react-spring";

const AnimatedFlex = animated(Flex);

interface Props {
  file: FileType;
  style: any;
  key: string;
}

function File({ file, style, key }: Props) {
  return (
    <AnimatedFlex
      key={key}
      flexDirection="column"
      width="200px"
      marginRight="50px"
      marginBottom="10px"
      padding="10px"
      borderRadius="3px"
      backgroundColor="gray.0"
      style={style}
    >
      <Text
        fontSize="xs"
        fontWeight={600}
        overflow="hidden"
        whiteSpace="nowrap"
        color="gray.34312D"
        style={{ direction: "rtl", textOverflow: "ellipsis" }}
        marginBottom="5px"
      >
        {file.path}
      </Text>

      <Flex flexDirection="column">
        <Flex flexDirection="column">
          {file.symbols.map(symbol => (
            <Function symbol={symbol} />
          ))}
        </Flex>
      </Flex>
    </AnimatedFlex>
  );
}

export default observer(File);
