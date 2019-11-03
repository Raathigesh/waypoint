import {
  Provider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

declare var PRODUCTION: boolean;

let WS_URL = "ws://localhost:4545";
let HTTP_URL = "http://localhost:4545";

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
