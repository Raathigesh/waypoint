import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "urql";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { observer } from "mobx-react-lite";
import SearchMutation from "./gql/SearchMutation.gql";
import { SearchResult } from "../entities/SearchResult";
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
import { rules } from "./store";

interface SearchResults {
  searchResults: SearchResult;
}

function Search() {
  const rulesStore = useContext(rules);
  const [, search] = useMutation(SearchMutation);
  const [data, setResults] = useState([]);
  const [query, setQuery] = useState("");

  async function doSearch(ruleFileContent = InitialFileContent) {
    const { data } = await search({
      query: "",
      selector: ruleFileContent
    });
    setResults(data);
  }

  useEffect(() => {
    doSearch();
  }, []);

  let items =
    (data && (data as any).search && (data as any).search.items) || [];

  if (query.trim() !== "") {
    items = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const createView = () => {
    rulesStore.createRule("Untitled", "");
  };

  const deleteView = () => {
    rulesStore.deleteRule(rulesStore.activeRule);
  };
  const switchRule = (ruleId: string) => {
    rulesStore.setActiveRule(ruleId);
  };

  return (
    <Flex flexDirection="column" p={3} width="100%">
      <Flex mb={3}>
        <Flex flexGrow={1}>
          <Editable
            value={rulesStore.getActiveFileName}
            fontSize={18}
            p={0.5}
            onChange={(e: any) => {
              rulesStore.renameRule(rulesStore.activeRule, e);
            }}
          >
            <EditablePreview />
            <EditableInput />
          </Editable>
        </Flex>
        <Flex>
          <Button
            size="sm"
            rightIcon="settings"
            variant="ghost"
            onClick={async () => {
              createTempFile(
                rulesStore.getActiveFileContent,
                updatedContent => {
                  rulesStore.setRuleContent(
                    rulesStore.activeRule,
                    updatedContent
                  );
                  doSearch(updatedContent);
                }
              );
            }}
          >
            Edit rule
          </Button>
          <Button
            size="sm"
            rightIcon="delete"
            variant="ghost"
            onClick={deleteView}
          >
            Delete view
          </Button>
          <Menu>
            <MenuButton
              size="sm"
              as={Button}
              rightIcon="chevron-down"
              leftIcon="view"
              variant="ghost"
            >
              Switch view
            </MenuButton>
            <MenuList>
              {rulesStore.rules.map(rule => (
                <MenuItem onClick={() => switchRule(rule.id)}>
                  {rule.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <MenuItem onClick={createView}>Create view</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex mb={3}>
        <InputGroup size="sm" width="100%">
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

export default observer(Search);
