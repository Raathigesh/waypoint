import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  createClient,
  defaultExchanges,
  subscriptionExchange,
  Client
} from "urql";

const client: Client | null = null;

export const getClient = (ws_impl: any) => {
  let port: string | undefined = "4545";

  if ((window as any).port) {
    port = (window as any).port;
  }

  let WS_URL = `ws://localhost:${port}`;
  let HTTP_URL = `http://localhost:${port}`;

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
