import gql from "graphql-tag";
import { sendQuery } from "ui/util/graphql";
import { FindReferenceSymbol } from "extension/api/GetReferenceArgs";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";

export async function findReferences(symbol: FindReferenceSymbol) {
  const query = gql`
    query FindReferences($symbol: FindReferenceSymbol!) {
      findReferences(symbol: $symbol) {
        id
        name
        filePath
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

  const results = await sendQuery<{ findReferences: GqlSymbolInformation[] }>(
    query,
    {
      symbol
    }
  );

  return results.findReferences;
}
