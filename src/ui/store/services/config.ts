import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";

export async function setPathMap(pathMap: string) {
  const query = gql`
    mutation SetPathMap($value: String!) {
      setPathMap(value: $value)
    }
  `;

  await sendMutation(query, {
    value: pathMap
  });
}

export async function getPathMap() {
  const query = gql`
    query {
      getPathMap
    }
  `;

  const result = await sendQuery<{ getPathMap: string }>(query, {});
  return result.getPathMap;
}
