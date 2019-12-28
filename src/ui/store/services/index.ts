import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";
import { PathMapItem } from "extension/api/symbol-resolver/ReIndexArgs";
import { GqlProjectInfo } from "entities/GqlProjectInfo";

export async function getProjectInfo() {
  const query = gql`
    query Project {
      project {
        separator
        root
      }
    }
  `;

  const result = await sendQuery<{ project: GqlProjectInfo }>(query, {});
  return result.project;
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
