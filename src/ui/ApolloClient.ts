import { ApolloClient, HttpLink, InMemoryCache } from "apollo-client-preset";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { split } from "apollo-link";
import { typeDefs, resolvers } from "./ClientState";

declare var PRODUCTION: boolean;

let WS_URL = "ws://localhost:4545";
let HTTP_URL = "http://localhost:4545";
if (PRODUCTION) {
  WS_URL = `ws://${window.location.host}`;
  HTTP_URL = `http://${window.location.host}`;
}

export function getAPIUrl() {
  return HTTP_URL;
}

const wsLink = new WebSocketLink({
  uri: WS_URL,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({ uri: HTTP_URL });
const link = split(
  ({ query }: any) => {
    const { kind, operation } = getMainDefinition(query) as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    rules: [
      {
        name: "Rule 1",
        pathPattern: "/src",
        __typename: "Rule"
      }
    ]
  }
});

export default client;
