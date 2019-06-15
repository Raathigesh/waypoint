import React from "react";
import { Flex, Text, Box } from "rebass";
import { Tooltip } from "react-tippy";
import { Flake } from "../../entities/Symbol";
import FlakeIcon from "./Icon";

interface Props {
  flake: Flake;
}

export default function ResultItem({ flake: { name, type } }: Props) {
  return (
    <Flex p={2} css={{ cursor: "pointer" }}>
      <Tooltip title={type} size="small" animate="fade">
        <Flex
          alignItems="center"
          bg="backgroundLight"
          p="2"
          css={{ borderRadius: "5px" }}
        >
          <Box pr={1} pt={0.5}>
            <FlakeIcon type={type} />
          </Box>
          <Text fontWeight={500}>{name}</Text>
        </Flex>
      </Tooltip>
    </Flex>
  );
}
