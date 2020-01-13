import React, { useEffect, useState, useContext } from "react";
import { searchSymbol } from "ui/store/services/search";
import { Flex, PseudoBox } from "@chakra-ui/core";
import { appStore, dependencyGraphStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { SearchResult } from ".";

interface Props {
  results: string[];
  selectedIndex: number;
  onSelection: (path: string) => void;
}

export default function FileResults({
  results,
  selectedIndex,
  onSelection
}: Props) {
  const projectInfo = useContext(appStore);

  return (
    <Flex flexDirection="column" padding="5px" flexGrow={1}>
      {results.map((result, i) => (
        <Flex key={result}>
          <PseudoBox
            padding="5px"
            display="flex"
            flexGrow={1}
            cursor="pointer"
            backgroundColor={i === selectedIndex ? "purple.100" : "purple.50"}
            borderRadius="3px"
            marginBottom="5px"
            _hover={{
              backgroundColor: "purple.100"
            }}
            onClick={() => onSelection(result)}
          >
            <Flex
              color="gray.800"
              fontSize={12}
              fontWeight={500}
              marginRight="10px"
            >
              {result.replace(projectInfo.root, "")}
            </Flex>
          </PseudoBox>
        </Flex>
      ))}
    </Flex>
  );
}
