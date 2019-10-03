import React, { useEffect, useState } from "react";
import { useMutation, useSubscription } from "urql";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import { SearchResult } from "../entities/SearchResult";
import Select from "react-select";
import { createTempFile, openFile } from "./EventBus";
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
  EditableInput,
  MenuDivider
} from "@chakra-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "./store";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [data, setResults] = useState([]);
  const [query, setQuery] = useState("");

  const activeRule = useSelector((state: RootState) => state.Rules.activeRule);
  const rules = useSelector((state: RootState) => state.Rules.rules) || {};

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

  const dispatch: Dispatch = useDispatch();
  const createView = () => {
    dispatch.Rules.setRule("untitled", "");
  };

  const deleteView = () => {
    dispatch.Rules.deleteRule(activeRule);
  };
  const switchRule = (ruleId: string) => {
    dispatch.Rules.setActiveRule(ruleId);
  };

  return (
    <Flex flexDirection="column" p={2} width="100%">
      <Flex>
        <Editable
          value={(rules[activeRule] && rules[activeRule].name) || ""}
          onChange={(e: any) => {
            dispatch.Rules.renameRule(activeRule, e);
          }}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>

        <Button
          size="xs"
          rightIcon="settings"
          onClick={async () => {
            const ruleFileContent = getRunFileContent();
            createTempFile(ruleFileContent, updatedContent => {
              search({
                query: "",
                selector: updatedContent
              });
            });
          }}
        >
          Edit rule
        </Button>
        <Button size="xs" rightIcon="delete" onClick={deleteView}>
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
            {Object.entries(rules).map(([ruleId, rule]) => (
              <MenuItem onClick={() => switchRule(ruleId)}>
                {rule.name}
              </MenuItem>
            ))}
            <MenuDivider />
            <MenuItem onClick={createView}>Create view</MenuItem>
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
      <Flex flexDirection="column" flexGrow={1} height="300px">
        <AutoSizer>
          {({ height, width }: any) => {
            return (
              <FixedSizeList
                height={height}
                itemCount={items.length}
                itemSize={30}
                width={width}
              >
                {({ index, style }: any) => {
                  return items[index] ? (
                    <Flex flexDirection="column" style={style}>
                      <ResultItem
                        flake={items[index]}
                        onClick={path => {
                          openFile(path, items[index].location);
                        }}
                      />
                    </Flex>
                  ) : null;
                }}
              </FixedSizeList>
            );
          }}
        </AutoSizer>
      </Flex>
    </Flex>
  );
}
