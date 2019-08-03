import gql from "graphql-tag";
import { pipe, subscribe } from "wonka";
import { createRequest } from "urql";
import { getClient } from "./graphql-client";

export const getExtensionMessenger = () => {
  const client = getClient(undefined);
  const subs: { [id: string]: any[] } = {};

  const subscription = gql`
    subscription {
      listenToClientMessages {
        id
        payload
      }
    }
  `;

  pipe(
    client.executeSubscription(createRequest(subscription)) as any,
    subscribe(({ data: { listenToClientMessages }, error }: any) => {
      debugger;
      (subs[listenToClientMessages.id] || []).forEach(sub =>
        sub(JSON.parse(listenToClientMessages.payload))
      );
    })
  );

  return {
    send(id: string, payload: any) {
      const query = gql`
        mutation($id: String!, $payload: String!) {
          sendToExtension(id: $id, payload: $payload)
        }
      `;

      pipe(
        client.executeMutation(
          createRequest(query, {
            id,
            payload: JSON.stringify(payload)
          })
        ) as any,
        subscribe(({ data, error }: any) => {
          console.log(data, error);
        })
      );
    },
    addSubscriber(id: string, cb: any) {
      if (!subs[id]) {
        subs[id] = [];
      }

      subs[id].push(cb);
    }
  };
};
