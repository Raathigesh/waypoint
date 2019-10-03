import { pipe, subscribe } from "wonka";
import gql from "graphql-tag";
import { getClient } from "common/messaging/graphql";
import { createRequest } from "urql";

export function getValue(key: string) {
  const client = getClient(undefined);

  const query = gql`
    query($key: String!) {
      getValue(key: $key)
    }
  `;

  return new Promise((resolve, reject) => {
    pipe(
      client.executeMutation(
        createRequest(query, {
          key
        })
      ) as any,
      subscribe(({ data, error }: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.getValue);
        }
      })
    );
  });
}

export function saveValue(key: string, value: string) {
  const client = getClient(undefined);

  const query = gql`
    mutation($key: String!, $value: String!) {
      setValue(key: $key, value: $value)
    }
  `;

  return new Promise((resolve, reject) => {
    pipe(
      client.executeMutation(
        createRequest(query, {
          key,
          value
        })
      ) as any,
      subscribe(({ data, error }: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data.setValue);
        }
      })
    );
  });
}
