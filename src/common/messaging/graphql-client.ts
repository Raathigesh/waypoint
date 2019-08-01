import { SubscriptionClient } from "subscriptions-transport-ws";
import { createClient, defaultExchanges, subscriptionExchange } from "urql";

let WS_URL = "ws://localhost:4545";
let HTTP_URL = "http://localhost:4545";

export const getClient = (ws_impl: any) => {
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
