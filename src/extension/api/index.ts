import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import "reflect-metadata";
import { pubSub } from "common/pubSub";
import SymbolsResolver from "./Symbols";
import MessageResolver from "common/messaging/resolvers/MessageResolver";

export async function getSchema() {
  return await buildSchema({
    resolvers: [SymbolsResolver, MessageResolver],
    pubSub: pubSub as any,
    container: Container
  });
}

const port = 4545;
export async function startApiServer() {
  const schema: any = await getSchema();
  const server = new GraphQLServer({ schema });

  return new Promise((resolve, reject) => {
    server
      .start(
        {
          port,
          playground: "/debug"
        },
        async () => {
          const url = `http://localhost:${port}`;
          console.log(`⚡  Insight is running at ${url} `);
          resolve();
        }
      )
      .catch(err => {
        reject(err);
      });
  });
}

if (!process.env.dev) {
  console.log("executing startApiServer");
  startApiServer();
}
