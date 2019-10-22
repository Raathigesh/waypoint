import React, { useContext } from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { observer } from "mobx-react-lite";
import { SearchResult } from "../entities/SearchResult";
import { openFile } from "./EventBus";
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
  MenuDivider,
  CircularProgress
} from "@chakra-ui/core";
import { RulesServiceStore, ResultsServiceStore, UIStore } from "./store";
import Loading from "./Loading";

const MenuButtonComponent: any = MenuButton;

function Search() {
  const {
    rules: {
      activeRuleId,
      activeRule,
      items,
      createRule,
      deleteRule,
      setActiveRule,
      renameRule
    }
  } = useContext(RulesServiceStore);
  const {
    searchResults,
    searchQuery,
    setSearchQuery,
    editRule,
    errorMessage
  } = useContext(ResultsServiceStore);

  const { isResultLoading } = useContext(UIStore);

  const createView = () => {
    const rule = createRule("Untitled");
    setActiveRule(rule.id);
  };

  const deleteView = () => {
    deleteRule(activeRuleId);
  };
  const switchRule = (ruleId: string) => {
    setActiveRule(ruleId);
  };

  return (
    <Flex flexDirection="column" p={3} width="100%">
      <Flex mb={3}>
        <Flex flexGrow={1}>
          <Editable
            value={activeRule ? activeRule.name : ""}
            fontSize={18}
            p={0.5}
            onChange={(e: any) => {
              renameRule(activeRuleId, e);
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
              editRule();
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
            <MenuButtonComponent
              size="sm"
              as={Button}
              rightIcon="chevron-down"
              leftIcon="view"
              variant="ghost"
            >
              Switch view
            </MenuButtonComponent>
            <MenuList>
              {items.map(rule => (
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
            value={searchQuery}
            placeholder="Search..."
            onChange={(e: any) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Loading isLoading={isResultLoading} />
      <pre>{errorMessage}</pre>
      <Flex flexDirection="column" flexGrow={1}>
        <AutoSizer>
          {({ height, width }: any) => {
            return (
              <FixedSizeList
                height={height}
                itemCount={searchResults.length}
                itemSize={30}
                width={width}
              >
                {({ index, style }: any) => {
                  return searchResults[index] ? (
                    <Flex flexDirection="column" style={style}>
                      <ResultItem
                        columnDefinitions={
                          (activeRule && activeRule.columnDefinitions) || []
                        }
                        flake={searchResults[index]}
                        onClick={path => {
                          openFile(path, searchResults[index].location);
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
