import React, { useEffect, useState } from "react";
import { useMutation, useSubscription } from "urql";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ReIndex from "./gql/Reindex.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import BlockFrame from "../../../primitives/BlockFrame/BlockFrame";
import { SearchResult } from "../entities/SearchResult";
import { Settings, Grid } from "react-feather";
import {
  createTempFile,
  getWorkspaceState,
  setWorkspaceState,
  openFile
} from "../../../ui/MessageHandler";
import { InitialFileContent } from "./Const";
import { Flake } from "../entities/Symbol";
import Items from "./Items";
import { Flex } from "rebass";
import ResultItem from "./ResultItem";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [, reIndex] = useMutation(ReIndex);

  const [ruleContent, setRuleContent] = useState("");

  async function getRunFileContent() {
    const workspaceState: any = await getWorkspaceState();
    const ruleFileContent =
      (workspaceState && workspaceState["SearchRule"]) || InitialFileContent;
    return ruleFileContent;
  }

  useEffect(() => {
    async function doSearch() {
      const ruleFileContent = await getRunFileContent();
      setRuleContent(ruleFileContent);
      await reIndex();
      await search({
        query: "",
        selector: ruleFileContent
      });
    }

    doSearch();
  }, []);

  const [{ data }] = useSubscription({ query: SubscribeForSearchResults });

  const items =
    (data &&
      (data as any).searchResults &&
      (data as SearchResults).searchResults.items) ||
    [];

  const groupedItems: { [group: string]: Flake[] } = items.reduce(
    (acc: { [group: string]: Flake[] }, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <BlockFrame
      options={[
        {
          Icon: Settings,
          tooltip: "Open rule script",
          onClick: async () => {
            const ruleFileContent = await getRunFileContent();
            setRuleContent(ruleFileContent);
            createTempFile(ruleFileContent, updatedContent => {
              setWorkspaceState({ SearchRule: updatedContent });
              search({
                query: "",
                selector: updatedContent
              });
            });
          }
        }
      ]}
    >
      <Flex flexDirection="column">
        <input
          type="text"
          onChange={e => {
            search({
              query: e.target.value,
              selector: ruleContent
            });
          }}
        />
        <Flex
          flexDirection="column"
          css={{
            height: "calc(100vh - 70px);",
            width: "calc(100vw - 50px)"
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
                  rowCount={items.length / 3 + 2}
                  rowHeight={45}
                  width={width}
                >
                  {({ columnIndex, rowIndex, style }: any) => {
                    const itemIndex =
                      rowIndex * columnCount + (columnIndex + 1);
                    return items[itemIndex] ? (
                      <Flex flexDirection="column" style={style}>
                        <ResultItem
                          flake={items[itemIndex]}
                          onClick={path => {
                            openFile(path);
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
    </BlockFrame>
  );
}
