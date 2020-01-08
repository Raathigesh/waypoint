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

export async function setFontSize(fontSize: string) {
  const query = gql`
    mutation SetFontSize($value: String!) {
      setFontSize(value: $value)
    }
  `;

  await sendMutation(query, {
    value: fontSize
  });
}

export async function getFontSize() {
  const query = gql`
    query {
      setFontSize
    }
  `;

  const result = await sendQuery<{ setFontSize: string }>(query, {});
  return result.setFontSize;
}
