import React from "react";

import FlakeIcon from "./Icon";
import { Flake } from "entities/Symbol";
import { Flex, Box, Text, Link, Badge } from "@chakra-ui/core";
import ColumnDefinition from "ui/store/models/ColumnDefinition";

const TextComponent: any = Text;

interface Props {
  flake: Flake;
  columnDefinitions: ColumnDefinition[];
  onClick: (path: string) => void;
}

export default function ResultItem({
  flake: { name, type, filePath, columnValues },
  columnDefinitions,
  onClick
}: Props) {
  const columnValuesMap = columnValues.reduce((acc: any, columnValue) => {
    acc[columnValue.key] = JSON.parse(columnValue.properties);
    return acc;
  }, {});

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
      {columnDefinitions.map(columnDefinition => {
        return (
          <Flex
            alignItems="center"
            flex={1}
            width={columnDefinition.initialWidth}
          >
            <Badge variantColor={columnValuesMap[columnDefinition.key].color}>
              {columnValuesMap[columnDefinition.key].value}
            </Badge>
          </Flex>
        );
      })}
    </Flex>
  );
}
