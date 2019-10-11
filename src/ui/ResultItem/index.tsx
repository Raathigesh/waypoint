import React from "react";

import FlakeIcon from "./Icon";
import { Flake } from "entities/Symbol";
import { Flex, Box, Text, Link } from "@chakra-ui/core";

const TextComponent: any = Text;

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
      <Flex alignItems="center" flex={1} width="40%">
        <Box pr={1} pt={0.5}>
          <FlakeIcon type={type} />
        </Box>
        <Link onClick={() => onClick(filePath)}>
          <TextComponent fontSize="sm" isTruncated pl={2}>
            {name}
          </TextComponent>
        </Link>
      </Flex>
      <Flex alignItems="center" flex={1} width="30%">
        <TextComponent fontSize="sm" isTruncated>
          {type}
        </TextComponent>
      </Flex>
      <Flex alignItems="center" flex={1} width="30%">
        <TextComponent fontSize="sm" isTruncated>
          {filePath}
        </TextComponent>
      </Flex>
    </Flex>
  );
}
