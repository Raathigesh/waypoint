import React, { useEffect } from "react";
import { Flex } from "rebass";
import { useMutation, useSubscription } from "urql";
import ReIndex from "./gql/Reindex.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import ResultItem from "./ResultItem";
import BlockFrame from "../../../primitives/BlockFrame/BlockFrame";
import { SearchResult } from "../entities/SearchResult";
import { Settings } from "react-feather";
import { createTempFile, useWorkspaceState } from "../../../ui/MessageHandler";
import { InitialFileContent } from "./Const";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);
  const [, reIndex] = useMutation(ReIndex);

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

  return (
    <BlockFrame
      options={[
        {
          Icon: Settings,
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
      <Flex flexWrap="wrap" p={2}>
        {data &&
          (data as any).searchResults &&
          (data as SearchResults).searchResults.items.map(item => (
            <ResultItem flake={item} />
          ))}
      </Flex>
    </BlockFrame>
  );
}
