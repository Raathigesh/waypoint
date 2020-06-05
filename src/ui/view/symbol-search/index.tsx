import React, { useContext, useState, useRef } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  PseudoBox,
  Link,
  Select as SimpleSelect,
  IconButton
} from "@chakra-ui/core";
import { Filter, Search } from "react-feather";
import { Tooltip } from "react-tippy";
import debounce from "lodash.debounce";
import { Resizable, ResizableBox } from "react-resizable";
import ReactResizeDetector, { withResizeDetector } from "react-resize-detector";
import { Search as SearchIcon, CornerDownLeft } from "react-feather";
import { useKeyPress } from "ui/util/hooks";
import { searchSymbol, searchFile } from "ui/store/services/search";
import { dependencyGraphStore, appStore } from "ui/store";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import Select from "react-select/creatable";
import SymbolKindIcon from "../components/SymbolKindIcon";
import { insertImport, openFile } from "ui/store/services/file";

export interface SearchResult {
  value: string;
  label: string;
  path: string;
  symbol: GqlSymbolInformation;
  type: string;
  kind: string;
}

export default withResizeDetector(function SymbolSearch({
  height,
  width
}: any) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [symbolType, setSymbolType] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState([]);

  const promiseOptions = useRef(
    debounce(async (inputValue: string, type: string) => {
      const results = await searchSymbol(inputValue, type);

      const resultOptions = results.items.map(item => ({
        value: item.name,
        label: `${item.name} : ${item.filePath}`,
        path: item.filePath,
        symbol: item,
        kind: item.kind,
        type: item.kind
      }));

      setResults(resultOptions);
    }, 300)
  ).current;

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: "100%"
    }),
    control: (provided: any) => ({
      ...provided,
      borderColor: "inherit",
      borderRadius: "4px 4px 0px 0px"
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#F1F5F9",
      boxShadow: "none",
      position: "initial",
      marginTop: "0px",
      borderRadius: "0px 0px 4px 4px",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#CBD5E0"
    })
  };

  const SearchIconComponent = () => (
    <Box marginRight={3}>
      <SearchIcon size={14} />
    </Box>
  );

  const formatOptionLabel = (item: any, options: any) => {
    const Icon = item.Icon || Search;
    return (
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Flex marginRight="5px" marginTop="1px">
            <Icon kind={item.kind} size="13px" />
          </Flex>
          <Flex
            color="gray.800"
            fontSize={14}
            marginRight="10px"
            marginBottom="2px"
          >
            {item.label}
          </Flex>
        </Flex>
        {options.context === "menu" && (
          <Flex>
            <CornerDownLeft color="#718096" size="12px" />
          </Flex>
        )}
      </Flex>
    );
  };

  return (
    <ResizableBox
      resizeHandles={["s", "se", "sw"]}
      axis="y"
      width={width}
      height={height}
      draggableOpts={{}}
    >
      <Flex
        flexGrow={1}
        padding="10px"
        height="100%"
        direction="column"
        background="white"
      >
        <Select
          formatCreateLabel={(value: string) => `Search for '${value}'`}
          isMulti
          formatOptionLabel={formatOptionLabel}
          options={[
            { value: "type", label: "Type", filter: true, Icon: Filter },
            { value: "class", label: "Class", filter: true, Icon: Filter },
            { value: "var", label: "Var", filter: true, Icon: Filter },
            { value: "func", label: "Function", filter: true, Icon: Filter }
          ]}
          styles={customStyles}
          placeholder="Type '/' to add filters"
          noOptionsMessage={() => "Start searching or add filter by typing '/'"}
          isClearable
          value={options}
          components={{
            DropdownIndicator: SearchIconComponent,
            IndicatorSeparator: () => null
          }}
          onChange={(options: any[]) => {
            if (!options) {
              setOptions([]);
              return;
            }
            let foundFirstNew = false;
            const filtered = options
              .reverse()
              .filter(option => {
                if (option["__isNew__"] && !foundFirstNew) {
                  foundFirstNew = true;
                  return true;
                }
                return true;
              })
              .reverse();
            setOptions(filtered as any);
            const createdOption = options.find(
              (option: any) => option["__isNew__"]
            );
            if (createdOption) {
              promiseOptions(
                createdOption.value,
                options
                  .filter((option: any) => option.filter)
                  .map(item => item.value)
                  .join(":")
              );
            }
          }}
          filterOption={(option: any, value: string) => {
            return (
              (value.startsWith("/") && option.data.filter) ||
              option.data["__isNew__"]
            );
          }}
          onInputChange={(input: string) => {
            let query = "";
            if (input.startsWith("/")) {
              const queryOption: any = options.find(
                option => option["__isNew__"]
              );
              if (queryOption) {
                query = queryOption.value;
              }
            } else if (input.trim() !== "") {
              query = input;
              const filtered = options.filter(option => !option["__isNew__"]);
              setOptions(filtered);
            }

            promiseOptions(
              query,
              options
                .filter((option: any) => option.filter)
                .map((item: any) => item.value)
                .join(":")
            );
          }}
        />

        <Flex direction="column" mt="5px" overflowY="auto">
          {results.map(item => {
            return (
              <PseudoBox
                p="8px"
                borderRadius="3px"
                borderStyle="solid"
                borderWidth="1px"
                borderColor="gray.200"
                backgroundColor="whiteAlpha.900"
                mb="3px"
                cursor="pointer"
                _hover={{ backgroundColor: "purple.50" }}
                onClick={() => {
                  openFile(item.symbol.filePath, item.symbol.location as any);
                }}
              >
                <Flex flexDirection="column">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex
                      color="gray.800"
                      fontSize={12}
                      fontWeight={500}
                      marginRight="10px"
                      alignItems="center"
                    >
                      <SymbolKindIcon kind={item.kind} size="12px" />
                      <Box marginLeft="5px">{item.value}</Box>
                    </Flex>

                    <Flex marginRight="5px">
                      <Tooltip
                        size="small"
                        title="Import symbol into active  file"
                        position="bottom"
                      >
                        <IconButton
                          variant="outline"
                          size="xs"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            insertImport(item.value, item.path);
                          }}
                          aria-label="Add"
                          icon="small-add"
                          marginLeft="10px"
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  {item.path && (
                    <Flex fontSize={11} color="gray.600">
                      {item.path.replace(projectInfo.root, "")}
                    </Flex>
                  )}
                </Flex>
              </PseudoBox>
            );
          })}
        </Flex>
      </Flex>
    </ResizableBox>
  );
});
