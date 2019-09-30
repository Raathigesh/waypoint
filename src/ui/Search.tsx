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
import { Flex } from "rebass";
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
  MenuItem
} from "@chakra-ui/core";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const [ruleContent, setRuleContent] = useState("");

  async function getRunFileContent() {
    const workspaceState: any = await getWorkspaceState();
    const ruleFileContent =
      InitialFileContent ||
      (workspaceState && workspaceState["SearchRule"]) ||
      InitialFileContent;
    return ruleFileContent;
  }

  useEffect(() => {
    async function doSearch() {
      const ruleFileContent = await getRunFileContent();
      setRuleContent(ruleFileContent);
      await search({
        query: "",
        selector: ruleFileContent
      });
    }

    doSearch();
  }, []);

  const [{ data }] = useSubscription({ query: SubscribeForSearchResults });

  let items =
    (data &&
      (data as any).searchResults &&
      (data as SearchResults).searchResults.items) ||
    [];

  if (category) {
    items = items.filter(item => item.category === category);
  }

  if (query.trim() !== "") {
    items = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const categories =
    (data &&
      (data as any).searchResults &&
      (data as SearchResults).searchResults.categories) ||
    [];
  debugger;
  return (
    <Flex flexDirection="column" flex={1} p={2}>
      <InputGroup>
        <InputLeftElement children={<Icon name="search" color="gray.300" />} />
        <Input
          type="phone"
          placeholder="Search..."
          onChange={(e: any) => setQuery(e.target.value)}
        />
      </InputGroup>
      <Menu>
        <MenuButton as={Button} rightIcon="chevron-down">
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>Download</MenuItem>
          <MenuItem>Create a Copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuList>
      </Menu>
      <Flex mb={2}>
        <Select
          defaultValue={null}
          isClearable
          styles={{
            container: provided => ({
              ...provided,
              width: "250px"
            })
          }}
          options={categories.map(category => ({
            label: category,
            value: category
          }))}
          onChange={(option: any) => {
            if (option === undefined) {
              return;
            }

            if (option === null) {
              setCategory(option);
            } else {
              setCategory(option.value);
            }
          }}
        />
        <Button
          onClick={async () => {
            const ruleFileContent = await getRunFileContent();
            setRuleContent(ruleFileContent);
            createTempFile(ruleFileContent, updatedContent => {
              setWorkspaceState({ SearchRule: updatedContent });
              search({
                query: "",
                selector: updatedContent
              });
            });
          }}
        >
          Update
        </Button>
      </Flex>
      <Flex
        flexDirection="column"
        css={{
          height: "calc(100vh - 70px);"
        }}
      >
        <AutoSizer>
          {({ height, width }: any) => {
            const columnWidth = 200;
            const columnCount = Math.round(width / columnWidth);
            return (
              <FixedSizeGrid
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={height}
                rowCount={items.length / columnCount}
                rowHeight={40}
                width={width}
              >
                {({ columnIndex, rowIndex, style }: any) => {
                  const itemIndex = rowIndex * columnCount + columnIndex;
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
