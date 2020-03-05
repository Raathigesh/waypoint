import {
  Provider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

const port = (window as any).port || 4545;

let WS_URL = `ws://localhost:${port}`;
let HTTP_URL = `http://localhost:${port}`;

export function getAPIUrl() {
  return HTTP_URL;
}

const subscriptionClient = new SubscriptionClient(WS_URL, {});

export const client = createClient({
  url: HTTP_URL,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});
