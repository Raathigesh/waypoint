import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";

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

export async function startIndexing() {
  const mutation = gql`
    mutation {
      reindex
    }
  `;

  const result = await sendMutation<{ indexingStatus: string }>(mutation, {});
  return result;
}
