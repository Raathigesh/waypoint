import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";
import { PathMapItem } from "extension/api/ReIndexArgs";

export async function getSeparator() {
  const query = gql`
    query Separator {
      separator
    }
  `;

  const result = await sendQuery<{ separator: string }>(query, {});
  return result.separator;
}

export async function indexerStatus() {
  const query = gql`
    query IndexStatus {
      indexingStatus
    }
  `;

  const result = await sendQuery<{ indexingStatus: string }>(query, {
    query
  });
  return result.indexingStatus;
}

export async function startIndexing(pathMap: PathMapItem[]) {
  const mutation = gql`
    mutation Reindex($items: [PathMapItem!]) {
      reindex(items: $items)
    }
  `;

  const result = await sendMutation<{ indexingStatus: string }>(mutation, {
    items: pathMap
  });
  return result;
}