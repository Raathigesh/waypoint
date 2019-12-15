import React, { useContext, useState } from "react";
import Select from "react-select/async";
import { Search as SearchIcon } from "react-feather";
import { search, getSymbolsForActiveFile } from "ui/store/services/search";
import { dependencyGraphStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { observer } from "mobx-react-lite";
import { Box, Flex } from "@chakra-ui/core";
import { Instance } from "mobx-state-tree";

function Search() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const [activeFileOptions, setActiveFileOptions] = useState<
    GqlSymbolInformation[]
  >([]);

  const onMenuOpen = async () => {
    const activeFileSymbols = await getSymbolsForActiveFile();

    const options = activeFileSymbols.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      path: item.filePath,
      symbol: item
    }));

    setActiveFileOptions(options as any);
  };

  const promiseOptions = async (inputValue: string) => {
    const results = await search(inputValue);

    const resultOptions = results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      path: item.filePath,
      symbol: item
    }));

    return [...resultOptions];
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: "100%"
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 520
    }),
    control: (provided: any) => ({
      ...provided,
      borderColor: "inherit"
    })
  };

  const SearchIconComponent = () => (
    <Box marginRight={3}>
      <SearchIcon size={14} />
    </Box>
  );

  const formatOptionLabel = (item: any) => {
    return (
      <Flex>
        <Flex
          color="gray.800"
          fontSize={13}
          fontWeight={600}
          marginRight="10px"
        >
          {item.value}
        </Flex>
        <Flex fontSize={12} color="gray.600">
          {item.path}
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex width="100%">
      <Select
        defaultOptions={activeFileOptions}
        formatOptionLabel={formatOptionLabel}
        styles={customStyles}
        placeholder="Search"
        cacheOptions
        onMenuOpen={onMenuOpen}
        loadOptions={promiseOptions}
        components={{
          DropdownIndicator: SearchIconComponent,
          IndicatorSeparator: () => null
        }}
        onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
          dependencyGraph.setCurrentSymbol(symbol);
          dependencyGraph.fetchMarkers(symbol);
        }}
      />
    </Flex>
  );
}

export default observer(Search);
