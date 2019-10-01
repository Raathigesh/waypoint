import React from "react";

import FlakeIcon from "./Icon";
import { Flake } from "entities/Symbol";
import { Flex, Box, Text, Link } from "@chakra-ui/core";

interface Props {
  flake: Flake;
  onClick: (path: string) => void;
}

export default function ResultItem({
  flake: { name, type, filePath },
  onClick
}: Props) {
  return (
    <Flex borderBottom="1px solid whitesmoke">
      <Flex alignItems="center" flex={1}>
        <Box pr={1} pt={0.5}>
          <FlakeIcon type={type} />
        </Box>
        <Link onClick={() => onClick(filePath)}>
          <Text fontSize="sm" isTruncated>
            {name}
          </Text>
        </Link>
      </Flex>
      <Flex alignItems="center" flex={1}>
        <Text fontSize="sm" isTruncated>
          {type}
        </Text>
      </Flex>
      <Flex alignItems="center" flex={1}>
        <Text fontSize="sm" isTruncated>
          {filePath}
        </Text>
      </Flex>
    </Flex>
  );
}
