import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Flex
} from "@chakra-ui/core";
import SymbolSearch from "./symbol";
import { useKeyPress } from "ui/util/hooks";
import { searchSymbol, searchFile } from "ui/store/services/search";
import { dependencyGraphStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import FileResults from "./file";

export interface SearchResult {
  value: string;
  label: string;
  path: string;
  symbol: any;
}

export default function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSymbolSearch, setIsSymbolSearch] = useState(true);
  const dependencyGraph = useContext(dependencyGraphStore);

  useKeyPress(".", e => {
    e.preventDefault();
    setIsSymbolSearch(true);
    setIsSearchOpen(true);
  });

  useKeyPress("/", e => {
    e.preventDefault();
    setIsSymbolSearch(false);
    setIsSearchOpen(true);
  });

  useKeyPress("Escape", e => {
    setIsSearchOpen(false);
    setSearchQuery("");
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [fileResults, setFileResults] = useState<string[]>([]);

  const search = async () => {
    if (isSymbolSearch) {
      const results = await searchSymbol(searchQuery);
      setResults(
        results.items.map(item => ({
          value: item.name,
          label: `${item.name} : ${item.filePath}`,
          path: item.filePath,
          symbol: item
        }))
      );
    } else {
      const results = await searchFile(searchQuery);
      setFileResults(results);
    }
  };

  useEffect(() => {
    search();
  }, [searchQuery]);

  const handleOnSelection = (symbol?: GqlSymbolInformation) => {
    if (symbol) {
      dependencyGraph.setCurrentSymbol(symbol);
    } else {
      dependencyGraph.setCurrentSymbol(results[selectedIndex].symbol);
    }
    setSelectedIndex(0);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleFileSelection = (path: string) => {
    dependencyGraph.addFile(path);
    setSelectedIndex(0);
    setSearchQuery("");
    setIsSearchOpen(false);
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
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            placeholder="Start typing"
            value={searchQuery}
            onChange={(e: any) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.keyCode == "40") {
                const nextIndex =
                  selectedIndex + 1 <= results.length - 1
                    ? selectedIndex + 1
                    : selectedIndex;
                setSelectedIndex(nextIndex);
              } else if (e.keyCode == "38") {
                const nextIndex =
                  selectedIndex - 1 > -1 ? selectedIndex - 1 : selectedIndex;
                setSelectedIndex(nextIndex);
              } else if (e.keyCode == "13") {
                handleOnSelection(undefined);
              }
            }}
          />
          <InputRightElement width="5.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => {
                setIsSymbolSearch(!isSymbolSearch);
              }}
            >
              {isSymbolSearch ? "Symbol" : "File"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Flex marginTop="5px" overflowY="auto" overflowX="hidden">
          {isSymbolSearch && (
            <SymbolSearch
              results={results}
              selectedIndex={selectedIndex}
              onSelection={handleOnSelection}
            />
          )}
          {!isSymbolSearch && (
            <FileResults
              results={fileResults}
              selectedIndex={selectedIndex}
              onSelection={handleFileSelection}
            />
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
}
