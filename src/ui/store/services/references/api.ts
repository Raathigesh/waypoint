import gql from "graphql-tag";
import { sendMutation, sendQuery } from "ui/util/graphql";
import { SearchResult } from "entities/SearchResult";
import { FindReferenceSymbol } from "extension/api/GetReferenceArgs";

export async function findReferences(symbol: FindReferenceSymbol) {
  const query = gql`
    query FindReferences($symbol: FindReferenceSymbol!) {
      findReferences(symbol: $symbol) {
        name
        filePath
      }
    }
  `;

  const results = await sendQuery(query, {
    symbol
  });
}
