import React, { useContext } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { observer } from "mobx-react-lite";
import { SearchResult } from "../entities/SearchResult";
import { openFile } from "./EventBus";
import Select from "react-select/async";
import {
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Editable,
  EditablePreview,
  EditableInput,
  MenuDivider,
  CircularProgress
} from "@chakra-ui/core";
import Loading from "./Loading";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import Graph from "./view/graph";
import { search } from "./store/services/results/api";
import { findReferences } from "./store/services/references/api";

function Search() {
  const promiseOptions = async (inputValue: string) => {
    const results = await search(inputValue);
    return results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      symbol: item
    }));
  };

  return (
    <Flex flexDirection="column" flexGrow={1} height="100vh">
      <Select
        loadOptions={promiseOptions}
        onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
          findReferences({
            filePath: symbol.filePath,
            kind: symbol.kind,
            name: symbol.name,
            containerKind: undefined
          });
        }}
      />
      <Graph />
    </Flex>
  );
}

export default observer(Search);
