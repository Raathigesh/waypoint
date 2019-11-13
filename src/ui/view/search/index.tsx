import React, { useContext } from "react";
import Select from "react-select/async";
import { Search as SearchIcon } from "react-feather";
import { search } from "ui/store/services/search";
import { dependencyGraphStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { observer } from "mobx-react-lite";
import { Box } from "@chakra-ui/core";

function Search() {
  const dependencyGraph = useContext(dependencyGraphStore);

  const promiseOptions = async (inputValue: string) => {
    const results = await search(inputValue);
    return results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      symbol: item
    }));
  };

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      zIndex: 120
    })
  };

  const SearchIconComponent = () => (
    <Box marginRight={3}>
      <SearchIcon size={14} />
    </Box>
  );

  return (
    <Select
      styles={customStyles}
      placeholder="Search"
      cacheOptions
      loadOptions={promiseOptions}
      components={{
        DropdownIndicator: SearchIconComponent,
        IndicatorSeparator: () => null
      }}
      onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
        dependencyGraph.setCurrentSymbol(symbol);
        dependencyGraph.fetchReferences(symbol);
      }}
    />
  );
}

export default observer(Search);
