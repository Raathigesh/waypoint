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
import { ResultsServiceStore, UIStore, ReferenceServiceStore } from "./store";
import Loading from "./Loading";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import Graph from "./view/graph";

const MenuButtonComponent: any = MenuButton;

function Search() {
  const { search } = useContext(ResultsServiceStore);
  const { getReferences } = useContext(ReferenceServiceStore);

  const promiseOptions = async (inputValue: string) => await search(inputValue);

  return (
    <Flex flexDirection="column" flexGrow={1} height="100vh">
      <Select
        loadOptions={promiseOptions}
        onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
          getReferences({
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
