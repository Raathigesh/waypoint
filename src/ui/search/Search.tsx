import React, { useEffect } from "react";
import { useSubscription, useMutation } from "react-apollo-hooks";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import SearchMutation from "./gql/SearchMutation.gql";
import Reindex from "./gql/Reindex.gql";
import { SearchResult } from "../../entities/SearchResult";
import ResultItem from "./ResultItem/";
import { Flex } from "rebass";
import { Link } from "react-router-dom";

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
