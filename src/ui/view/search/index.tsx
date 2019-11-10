import React, { useContext } from "react";
import Select from "react-select/async";
import { search } from "ui/store/services/results/api";
import { dependencyGraphStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { observer } from "mobx-react-lite";

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

  return (
    <Select
      styles={customStyles}
      cacheOptions
      loadOptions={promiseOptions}
      onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
        dependencyGraph.setCurrentSymbol(symbol);
        dependencyGraph.fetchReferences(symbol);
      }}
    />
  );
}

export default observer(Search);
