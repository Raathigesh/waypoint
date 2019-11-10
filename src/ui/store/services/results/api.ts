import gql from "graphql-tag";
import { sendMutation } from "ui/util/graphql";
import { SearchResult } from "entities/SearchResult";

export async function search(query: string) {
  const mutation = gql`
    mutation Search($query: String!) {
      search(query: $query) {
        items {
          id
          name
          filePath
          kind
          location {
            start {
              line
              character
            }
            end {
              line
              character
            }
          }
        }
        errorMessage
      }
    }
  `;

  const results = await sendMutation<{ search: SearchResult }>(mutation, {
    query
  });
  return {
    items: results.search.items,
    errorMessage: results.search.errorMessage
  };
}
