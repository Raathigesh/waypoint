import gql from "graphql-tag";
import { sendMutation } from "ui/util/graphql";
import { SearchResult } from "entities/SearchResult";

export async function search(query: string, selector: string) {
  const mutation = gql`
    mutation Search($query: String!, $selector: String!) {
      search(query: $query, selector: $selector) {
        items {
          name
          exportStatus
          filePath
          type
          category
          location {
            start {
              line
              column
            }
            end {
              line
              column
            }
          }
        }
        categories
      }
    }
  `;

  const results = await sendMutation<{ search: SearchResult }>(mutation, {
    query,
    selector
  });
  return results.search.items;
}
