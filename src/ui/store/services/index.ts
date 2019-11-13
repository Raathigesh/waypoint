import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";
import { PathMapItem } from "extension/api/ReindexArgs";

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
