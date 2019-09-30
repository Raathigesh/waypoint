import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  createClient,
  defaultExchanges,
  subscriptionExchange,
  Client,
  createRequest
} from "urql";
import * as ws from "ws";
import { pipe, subscribe } from "wonka";

let WS_URL = "ws://localhost:4545";
let HTTP_URL = "http://localhost:4545";

const client: Client | null = null;

export const getClient = (ws_impl: any) => {
  if (client !== null) {
    return client;
  }

  const subscriptionClient = new SubscriptionClient(
    WS_URL,
    { reconnect: true },
    ws_impl
  );
  return createClient({
    url: HTTP_URL,
    exchanges: [
      ...defaultExchanges,
      subscriptionExchange({
        forwardSubscription: operation => subscriptionClient.request(operation)
      })
    ]
  });
};

export function executeQuery(query: any, variables: any) {
  const client = getClient(ws);
  return new Promise((resolve, reject) => {
    try {
      pipe(
        client.executeMutation(createRequest(query, variables)) as any,
        subscribe((result: any) => {
          resolve(result);
        })
      );
    } catch (e) {
      reject(e);
    }
  });
}
