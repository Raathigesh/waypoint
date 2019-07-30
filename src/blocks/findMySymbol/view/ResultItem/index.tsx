import React from "react";
import { Flex, Text, Box } from "rebass";
import { Tooltip } from "react-tippy";

import FlakeIcon from "./Icon";
import { Flake } from "common/entities/Symbol";

interface Props {
  flake: Flake;
  onClick: (path: string) => void;
}

export default function ResultItem({
  flake: { name, type, filePath },
  onClick
}: Props) {
  return (
    <Flex
      pr={2}
      css={{ cursor: "pointer" }}
      width="200px"
      marginRight="5px"
      marginBottom="10px"
      onClick={() => onClick(filePath)}
    >
      <Tooltip
        title={type}
        size="small"
        animate="fade"
        style={{ width: "100%" }}
      >
        <Flex
          alignItems="center"
          bg="backgroundLight"
          p={2}
          css={{ borderRadius: "5px" }}
        >
          <Box pr={1} pt={0.5}>
            <FlakeIcon type={type} />
          </Box>
          <Text
            fontSize={12}
            fontWeight={500}
            css={{ textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {name}
          </Text>
        </Flex>
      </Tooltip>
    </Flex>
  );
}
