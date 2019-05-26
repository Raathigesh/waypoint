import React, { useEffect } from "react";
import { useMutation, useSubscription } from "react-apollo-hooks";
import { Link } from "react-router-dom";
import { Flex } from "rebass";
import Reindex from "./gql/Reindex.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import ResultItem from "./ResultItem/";
import { SearchResult } from "../../entities/SearchResult";

interface SearchResults {
  searchResults: SearchResult;
}

export default function Search() {
  const search = useMutation(SearchMutation, {
    variables: { query: "" }
  });

  const reindex = useMutation(Reindex);
  useEffect(() => {
    reindex().then(() => {
      search();
    });
  }, []);

  const { data, error, loading } = useSubscription<SearchResults>(
    SubscribeForSearchResults
  );

  return (
    <Flex flexWrap="wrap" p={2}>
      Results
      <Link to="/configureRules">Configure rules</Link>
      {data &&
        data.searchResults.items.map(item => <ResultItem flake={item} />)}
    </Flex>
  );
}
