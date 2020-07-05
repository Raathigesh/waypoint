import gql from "graphql-tag";
import { sendQuery, sendMutation } from "ui/util/graphql";
import { PersistableStage } from "../models/DependencyGraph";
import { BookmarksJSON } from "../models/bookmarks";

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
      getFontSize
    }
  `;

  const result = await sendQuery<{ getFontSize: string }>(query, {});
  return result.getFontSize;
}

export async function setDirectories(directories: string[]) {
  const query = gql`
    mutation SetDirectories($value: String!) {
      setDirectories(value: $value)
    }
  `;

  await sendMutation(query, {
    value: JSON.stringify(directories)
  });
}

export async function getDirectories() {
  const query = gql`
    query {
      getDirectories
    }
  `;

  const result = await sendQuery<{ getDirectories: string }>(query, {});
  return JSON.parse(result.getDirectories) as string[];
}

export async function setStageConfig(stage: PersistableStage) {
  const query = gql`
    mutation SetStageConfig($value: String!) {
      setStageConfig(value: $value)
    }
  `;

  await sendMutation(query, {
    value: JSON.stringify(stage)
  });
}

export async function getStageConfig() {
  const query = gql`
    query {
      getStageConfig
    }
  `;

  const result = await sendQuery<{ getStageConfig: string }>(query, {});
  return result.getStageConfig
    ? (JSON.parse(result.getStageConfig) as PersistableStage)
    : null;
}

export async function setBookmarksConfig(stage: BookmarksJSON[]) {
  const query = gql`
    mutation SetBookmarksConfig($value: String!) {
      setBookmarksConfig(value: $value)
    }
  `;

  await sendMutation(query, {
    value: JSON.stringify(stage)
  });
}

export async function getBookmarksConfig() {
  const query = gql`
    query {
      getBookmarksConfig
    }
  `;

  const result = await sendQuery<{ getBookmarksConfig: string }>(query, {});
  return result.getBookmarksConfig
    ? (JSON.parse(result.getBookmarksConfig) as BookmarksJSON[])
    : [];
}
