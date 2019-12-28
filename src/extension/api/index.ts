import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import "reflect-metadata";
import { pubSub } from "common/pubSub";
import SymbolsResolver from "./symbol-resolver";
import MessageResolver from "common/messaging/resolvers/MessageResolver";
import WorkplaceResolver from "./ConfigResolver";

export async function getSchema() {
  try {
    return await buildSchema({
      resolvers: [SymbolsResolver, MessageResolver, WorkplaceResolver],
      pubSub: pubSub as any,
      container: Container
    });
  } catch (e) {
    debugger;
  }
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
        () => {
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
