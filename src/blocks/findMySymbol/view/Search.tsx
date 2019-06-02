import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex } from "rebass";
import Reindex from "./gql/Reindex.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import ResultItem from "./ResultItem";
import { SearchResult } from "../entities/SearchResult";
import { useMutation, useSubscription } from "urql";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const [, search] = useMutation(SearchMutation);

  const [, reindex] = useMutation(Reindex);
  useEffect(() => {
    reindex().then(() => {
      search({
        query: ""
      });
    });
  }, []);

  const [{ data }] = useSubscription({ query: SubscribeForSearchResults });
  console.log(data);
  return (
    <Flex flexWrap="wrap" p={2}>
      Results
      <Link to="/configureRules">Configure rules</Link>
      {data &&
        (data as any).searchResults &&
        (data as SearchResults).searchResults.items.map(item => (
          <ResultItem flake={item} />
        ))}
    </Flex>
  );
}
