import React, { useContext, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  PseudoBox
} from "@chakra-ui/core";
import debounce from "lodash.debounce";
import Select from "react-select/async";
import { Search as SearchIcon } from "react-feather";
import { useKeyPress } from "ui/util/hooks";
import { searchSymbol, searchFile } from "ui/store/services/search";
import { dependencyGraphStore, appStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import SymbolKindIcon from "../components/SymbolKindIcon";
import { insertImport } from "ui/store/services/file";

export interface SearchResult {
  value: string;
  label: string;
  path: string;
  symbol: any;
  type: string;
  kind: string;
}

export default function SymbolSearch() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const [results, setResults] = useState<SearchResult[]>([]);

  const promiseOptions = debounce(async (inputValue: string) => {
    const results = await searchSymbol(inputValue);

    const resultOptions = results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      path: item.filePath,
      symbol: item,
      kind: item.kind,
      type: item.kind
    }));

    setResults(resultOptions);
  }, 300);

  return (
    <Flex mt="10px" direction="column">
      <InputGroup width="100%">
        <InputLeftElement children={<Icon name="search" color="gray.300" />} />
        <Input
          placeholder="Search symbol"
          onChange={(e: any) => {
            promiseOptions(e.target.value);
          }}
        />
      </InputGroup>
      <Flex
        direction="column"
        mt="5px"
        height="calc(100vh - 100px)"
        overflowY="auto"
      >
        {results.map(item => {
          return (
            <PseudoBox
              p="5px"
              borderRadius="2px"
              borderStyle="solid"
              borderWidth="1px"
              borderColor="gray.200"
              backgroundColor="gray.100"
              mb="3px"
              cursor="pointer"
              _hover={{ backgroundColor: "gray.300" }}
              onClick={() => {
                insertImport(item.value, item.path);
              }}
            >
              <Flex flexDirection="column">
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex
                    color="gray.800"
                    fontSize={12}
                    fontWeight={500}
                    marginRight="10px"
                  >
                    {item.value}
                  </Flex>

                  <Flex marginRight="5px">
                    <SymbolKindIcon kind={item.kind} size="12px" />
                  </Flex>
                </Flex>
                {item.path && (
                  <Flex fontSize={11} color="gray.600">
                    {item.path.replace(projectInfo.root, "")}
                  </Flex>
                )}
              </Flex>
            </PseudoBox>
          );
        })}
      </Flex>
    </Flex>
  );
}
