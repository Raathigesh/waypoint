import gql from "graphql-tag";
import { pipe, subscribe } from "wonka";
import { createRequest } from "urql";
import * as ws from "ws";
const fetch = require("node-fetch");
(global as any).fetch = fetch;
import { getClient } from "./graphql-client";

export const getUIMessenger = () => {
  const client = getClient(ws);

  const subs: { [id: string]: any[] } = {};

  const subscription = gql`
    subscription {
      listenToExtensionMessages {
        id
        payload
      }
    }
  `;

  pipe(
    client.executeSubscription(createRequest(subscription)) as any,
    subscribe(({ data }: any) => {
      try {
        if (data) {
          const { listenToExtensionMessages } = data;
          (subs[listenToExtensionMessages.id] || []).forEach(sub =>
            sub(JSON.parse(listenToExtensionMessages.payload))
          );
        }
      } catch (err) {
        console.log(data);
      }
    })
  );

  return {
    send(id: string, payload: any) {
      try {
        const query = gql`
          mutation($id: String!, $payload: String!) {
            sendToClient(id: $id, payload: $payload)
          }
        `;
        pipe(
          client.executeMutation(
            createRequest(query, {
              id,
              payload: JSON.stringify(payload || {})
            })
          ) as any,
          subscribe(({ data, error }: any) => {
            console.log(data, error);
          })
        );
      } catch (e) {
        debugger;
      }
    },
    addSubscriber(id: string, cb: any) {
      if (!subs[id]) {
        subs[id] = [];
      }
      subs[id].push(cb);
    },
    query(query: any, variables: any) {
      return client.executeQuery(createRequest(query, variables)) as any;
    }
  };
};
