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

const MenuButtonComponent: any = MenuButton;

function Search() {
  const { search } = useContext(ResultsServiceStore);
  const { getReferences } = useContext(ReferenceServiceStore);

  const promiseOptions = async (inputValue: string) => await search(inputValue);

  return (
    <Flex flexDirection="column" flexGrow={1}>
      <Select
        loadOptions={promiseOptions}
        onChange={({ symbol }: { symbol: GqlSymbolInformation }) => {
          getReferences({
            containerName: symbol.containerName,
            filePath: undefined,
            kind: undefined,
            name: symbol.name,
            containerKind: undefined
          });
        }}
      />
    </Flex>
  );
}

export default observer(Search);
