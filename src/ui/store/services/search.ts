import gql from "graphql-tag";
import { sendMutation, sendQuery } from "ui/util/graphql";
import { SearchResult } from "entities/SearchResult";
import {
  GqlMarkers,
  GqlSymbolInformation
} from "entities/GqlSymbolInformation";

export async function search(query: string) {
  const mutation = gql`
    mutation Search($query: String!) {
      search(query: $query) {
        items {
          id
          name
          filePath
          kind
          code
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

export async function getMarkers(path: string, name: string) {
  const query = gql`
    query GetSymbolWithMarkers($path: String!, $name: String!) {
      getSymbolWithMarkers(path: $path, name: $name) {
        id
        name
        filePath
        kind
        code
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
        markers {
          filePath
          name
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
      }
    }
  `;

  const results = await sendQuery<{
    getSymbolWithMarkers: GqlSymbolInformation;
  }>(query, {
    path,
    name
  });

  return results.getSymbolWithMarkers;
}
