import React, { useState, useContext } from "react";
import { Modal, ModalOverlay, ModalContent, Flex, Box } from "@chakra-ui/core";
import Select from "react-select/async";
import { Search as SearchIcon } from "react-feather";
import { useKeyPress } from "ui/util/hooks";
import { searchSymbol, searchFile } from "ui/store/services/search";
import { dependencyGraphStore, appStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";

export interface SearchResult {
  value: string;
  label: string;
  path: string;
  symbol: any;
}

export default function SearchDialog() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFileSearch, setIsFileSearch] = useState(false);

  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);

  useKeyPress(".", e => {
    e.preventDefault();
    setIsFileSearch(false);
    setIsSearchOpen(true);
  });

  useKeyPress("/", e => {
    e.preventDefault();
    setIsSearchOpen(true);
    setIsFileSearch(true);
  });

  useKeyPress("Escape", e => {
    setIsSearchOpen(false);
  });

  const handleOnSelection = (symbol: GqlSymbolInformation) => {
    dependencyGraph.setCurrentSymbol(symbol);
    setIsSearchOpen(false);
  };

  const handleFileSelection = (path: string) => {
    dependencyGraph.addFile(path);
    setIsSearchOpen(false);
  };

  const promiseOptions = async (inputValue: string) => {
    if (isFileSearch) {
      const results = await searchFile(inputValue);
      const fileOptions = results.map(item => ({
        value: item,
        label: item,
        type: "file"
      }));
      return fileOptions;
    }

    const results = await searchSymbol(inputValue);

    const resultOptions = results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      path: item.filePath,
      symbol: item
    }));

    return resultOptions;
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: "100%"
    }),
    control: (provided: any) => ({
      ...provided,
      borderColor: "inherit"
    }),
    menu: (provided: any) => ({
      ...provided,
      boxShadow: "none"
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
          fontSize={12}
          fontWeight={500}
          marginRight="10px"
        >
          {item.type === "file"
            ? item.value.replace(projectInfo.root, "")
            : item.value}
        </Flex>
        {item.path && (
          <Flex fontSize={11} color="gray.600">
            {item.path.replace(projectInfo.root, "")}
          </Flex>
        )}
      </Flex>
    );
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      size="xl"
      closeOnOverlayClick
    >
      <ModalOverlay />
      <ModalContent padding="10px" height="400px" borderRadius="3px">
        <Select
          menuIsOpen
          value={null}
          formatOptionLabel={formatOptionLabel}
          styles={customStyles}
          placeholder="Search"
          noOptionsMessage={() => "No symbols to display"}
          isClearable
          cacheOptions
          loadOptions={promiseOptions}
          components={{
            DropdownIndicator: SearchIconComponent,
            IndicatorSeparator: () => null
          }}
          onChange={({
            symbol,
            type,
            value
          }: {
            symbol: GqlSymbolInformation;
            type: string;
            value: string;
          }) => {
            if (type === "file") {
              handleFileSelection(value);
            } else {
              handleOnSelection(symbol);
            }
          }}
        />
      </ModalContent>
    </Modal>
  );
}
