import React, { useState, useRef, useContext } from "react";
import { Flex, Box } from "@chakra-ui/core";
import { Filter, Search, Code } from "react-feather";
import debounce from "lodash.debounce";
import { ResizableBox } from "react-resizable";
import { withResizeDetector } from "react-resize-detector";
import { Search as SearchIcon, CornerDownLeft } from "react-feather";
import { searchSymbol } from "ui/store/services/search";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import Select from "react-select/creatable";
import SymbolItem from "../components/SymbolItem";
import { observer } from "mobx-react-lite";
import { bookmarksStore } from "ui/store";

export interface SearchResult {
  value: string;
  label: string;
  path: string;
  symbol: GqlSymbolInformation;
  type: string;
  kind: string;
}

export default withResizeDetector(
  observer(function SymbolSearch({ height, width }: any) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [options, setOptions] = useState([]);
    const bookmarks = useContext(bookmarksStore);

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
      <Flex mb={"10px"}>
        <ResizableBox
          handle={
            <Flex
              width="100%"
              height="2px"
              backgroundColor="gray.300"
              cursor="ns-resize"
            />
          }
          axis="y"
          width={width}
          height={height / 2}
          draggableOpts={{}}
        >
          <Flex
            borderRadius="3px"
            flexGrow={1}
            padding="10px"
            height="100%"
            direction="column"
            background="white"
            borderTop="3px"
            borderColor="red.200"
            borderStyle="solid"
          >
            <Flex mb="10px" alignItems="center">
              <Code size={13} />
              <Flex ml="5px" fontSize="14px" fontWeight={400}>
                Symbol search
              </Flex>
            </Flex>
            <Select
              formatCreateLabel={(value: string) => `Search for '${value}'`}
              isMulti
              formatOptionLabel={formatOptionLabel}
              options={[
                { value: "type", label: "Type", filter: true, Icon: Filter },
                { value: "class", label: "Class", filter: true, Icon: Filter },
                { value: "var", label: "Var", filter: true, Icon: Filter },
                {
                  value: "func",
                  label: "Function",
                  filter: true,
                  Icon: Filter
                }
              ]}
              styles={customStyles}
              placeholder="Type '/' to add filters"
              noOptionsMessage={() =>
                "Start searching or add filter by typing '/'"
              }
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
                if (input.startsWith("/") || input.trim() === "") {
                  const queryOption: any = options.find(
                    option => option["__isNew__"]
                  );
                  if (queryOption) {
                    query = queryOption.value;
                  }
                } else if (input.trim() !== "") {
                  query = input;
                  const filtered = options.filter(
                    option => !option["__isNew__"]
                  );
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
                  <SymbolItem
                    filePath={item.symbol.filePath}
                    name={item.symbol.name}
                    location={item.symbol.location}
                    kind={item.symbol.kind}
                    onBookmark={(name, path) => {
                      bookmarks.addBookmark(name, path);
                    }}
                  />
                );
              })}
            </Flex>
          </Flex>
        </ResizableBox>
      </Flex>
    );
  })
);
