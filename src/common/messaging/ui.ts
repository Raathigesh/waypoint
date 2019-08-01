import gql from "graphql-tag";
import * as ws from "ws";
import { getClient } from "./graphql-client";
import { pipe, subscribe } from "wonka";
import { createRequest } from "urql";

export const getUIMessenger = () => {
  const client = getClient(ws);
  const subs: { [id: string]: any[] } = {};

  return {
    send(id: string, payload: any) {
      const query = gql`
        mutation($id: String!, $payload: String!) {
          sendToClient(id: $id, payload: $payload)
        }
      `;
      pipe(
        client.executeMutation(
          createRequest(query, {
            id,
            payload: JSON.stringify(payload)
          })
        ),
        subscribe(({ data, error }) => {
          console.log(data, error);
        })
      );
    },
    addSubscriber(id: string, cb: any) {
      if (!subs[id]) {
        subs[id] = [];
      }
      subs[id].push(cb);

      const subscription = gql`
        subscription {
          listenToExtensionMessages {
            id
            payload
          }
        }
      `;

      pipe(
        client.executeSubscription(createRequest(subscription)),
        subscribe(({ data: { listenToExtensionMessages }, error }) => {
          (subs[listenToExtensionMessages.id] || []).forEach(sub =>
            sub(JSON.parse(listenToExtensionMessages.payload))
          );
        })
      );
    }
  };
};
