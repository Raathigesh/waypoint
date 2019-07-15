import React, { useEffect, useState } from "react";
import { useMutation, useSubscription } from "urql";
import ReIndex from "./gql/Reindex.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import BlockFrame from "../../../primitives/BlockFrame/BlockFrame";
import { SearchResult } from "../entities/SearchResult";
import { Settings, Grid } from "react-feather";
import { createTempFile, useWorkspaceState } from "../../../ui/MessageHandler";
import { InitialFileContent } from "./Const";
import { Flake } from "../entities/Symbol";
import Items from "./Items";
import { Flex } from "rebass";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [, reIndex] = useMutation(ReIndex);
  const [isGrouped, setIsGrouped] = useState(true);

  const [workspaceState, setWorkspaceState] = useWorkspaceState();
  const ruleFileContent =
    (workspaceState && workspaceState["SearchRule"]) || InitialFileContent;

  useEffect(() => {
    reIndex().then(() => {
      search({
        query: "",
        selector: ruleFileContent
      });
    });
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
          onClick: () => {
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
      {isGrouped ? (
        <Items items={items} />
      ) : (
        <Flex flexDirection="column">
          {Object.entries(groupedItems).map(([group, items]) => {
            return (
              <Flex flexDirection="column">
                <Flex>{group}</Flex>
                <Items items={items} />
              </Flex>
            );
          })}
        </Flex>
      )}
    </BlockFrame>
  );
}
