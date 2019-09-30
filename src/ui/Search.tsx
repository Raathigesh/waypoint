import React, { useEffect, useState } from "react";
import { useMutation, useSubscription } from "urql";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import { SearchResult } from "../entities/SearchResult";
import Select from "react-select";
import {
  createTempFile,
  getWorkspaceState,
  setWorkspaceState,
  openFile
} from "./EventBus";
import { InitialFileContent } from "./Const";
import ResultItem from "./ResultItem";
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
  EditableInput
} from "@chakra-ui/core";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [data, setResults] = useState([]);
  const [query, setQuery] = useState("");

  function getRunFileContent() {
    return InitialFileContent;
  }

  useEffect(() => {
    async function doSearch() {
      const ruleFileContent = getRunFileContent();
      const { data } = await search({
        query: "",
        selector: ruleFileContent
      });
      setResults(data);
    }

    doSearch();
  }, []);

  let items =
    (data && (data as any).search && (data as any).search.items) || [];

  if (query.trim() !== "") {
    items = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  console.log(items);
  return (
    <Flex flexDirection="column" p={2} width="100%">
      <Flex>
        <Editable defaultValue="Take some chakra">
          <EditablePreview />
          <EditableInput />
        </Editable>

        <Button
          size="xs"
          rightIcon="settings"
          onClick={async () => {
            const ruleFileContent = getRunFileContent();
            createTempFile(ruleFileContent, updatedContent => {
              setWorkspaceState({ SearchRule: updatedContent });
              search({
                query: "",
                selector: updatedContent
              });
            });
          }}
        >
          Edit rule
        </Button>
        <Button size="xs" rightIcon="delete">
          Delete view
        </Button>
        <Menu>
          <MenuButton
            size="xs"
            as={Button}
            rightIcon="chevron-down"
            leftIcon="view"
          >
            Switch view
          </MenuButton>
          <MenuList>
            <MenuItem>Download</MenuItem>
            <MenuItem>Create a Copy</MenuItem>
            <MenuItem>Mark as Draft</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Flex>
        <InputGroup size="sm">
          <InputLeftElement
            children={<Icon name="search" color="gray.300" />}
          />
          <Input
            placeholder="Search..."
            onChange={(e: any) => setQuery(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Flex flexDirection="column" height="400px">
        <AutoSizer>
          {({ height, width }: any) => {
            const columnWidth = 200;
            return (
              <FixedSizeGrid
                columnCount={1}
                columnWidth={columnWidth}
                height={height}
                rowCount={items.length}
                rowHeight={40}
                width={width}
              >
                {({ rowIndex, style }: any) => {
                  const itemIndex = rowIndex;
                  return items[itemIndex] ? (
                    <Flex flexDirection="column" style={style}>
                      <ResultItem
                        flake={items[itemIndex]}
                        onClick={path => {
                          openFile(path, items[itemIndex].location);
                        }}
                      />
                    </Flex>
                  ) : null;
                }}
              </FixedSizeGrid>
            );
          }}
        </AutoSizer>
      </Flex>
    </Flex>
  );
}
