import React, { useEffect } from "react";
import { useSubscription, useMutation } from "react-apollo-hooks";
import SubscribeForSearchResults from "./gql/SubscribeForSearchResults.gql";
import SearchMutation from "./gql/SearchMutation.gql";

export default function Search() {
  const search = useMutation(SearchMutation, {
    variables: { query: "" }
  });
  useEffect(() => {
    search();
  }, []);

  const { data, error, loading } = useSubscription(SubscribeForSearchResults);
  console.log(data);
  return <div>Hello 123</div>;
}
