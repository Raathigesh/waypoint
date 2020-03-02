import gql from "graphql-tag";
import { sendMutation, sendQuery } from "ui/util/graphql";
import { GqlSearchResult } from "entities/GqlSearchResult";
import {
  GqlMarkers,
  GqlSymbolInformation
} from "entities/GqlSymbolInformation";

export async function searchSymbol(query: string) {
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

  const results = await sendMutation<{ search: GqlSearchResult }>(mutation, {
    query
  });
  return {
    items: results.search.items,
    errorMessage: results.search.errorMessage
  };
}

export async function searchFile(query: string) {
  const mutation = gql`
    mutation SearchFile($query: String!) {
      searchFile(query: $query)
    }
  `;

  const results = await sendMutation<{ searchFile: string[] }>(mutation, {
    query
  });
  return results.searchFile;
}

export async function getMarkers(path: string, name: string) {
  const query = gql`
    query GetSymbolWithMarkers($path: String!, $name: String!) {
      getSymbolWithMarkers(path: $path, name: $name) {
        id
        name
        filePath
        kind
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
          isFromDefaultImport
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

export async function getSymbolsForActiveFile() {
  const query = gql`
    query GetSymbolsForActiveFile {
      getSymbolsForActiveFile {
        id
        name
        filePath
        kind
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
  `;

  const results = await sendQuery<{
    getSymbolsForActiveFile: GqlSymbolInformation[];
  }>(query, {});
  return results.getSymbolsForActiveFile;
}

export async function getCode(path: string, name: string) {
  const query = gql`
    query GetCode($path: String!, $name: String!) {
      getCode(path: $path, name: $name)
    }
  `;

  const results = await sendQuery<{ getCode: string }>(query, {
    path,
    name
  });
  return results.getCode;
}

export async function getReferences(path: string, name: string) {
  const query = gql`
    query GetReferences($path: String!, $name: String!) {
      getReferences(path: $path, name: $name) {
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
  `;

  const results = await sendQuery<{
    getReferences: GqlMarkers;
  }>(query, {
    path,
    name
  });

  return results.getReferences;
}
