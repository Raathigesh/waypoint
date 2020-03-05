import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import "reflect-metadata";
import { pubSub } from "common/pubSub";
import SymbolsResolver from "./symbol-resolver";

import WorkplaceResolver from "./ConfigResolver";
import { initializeStaticRoutes } from "./static-files";

export async function getSchema() {
  try {
    return await buildSchema({
      resolvers: [SymbolsResolver, WorkplaceResolver],
      pubSub: pubSub as any,
      container: Container
    });
  } catch (e) {
    debugger;
  }
}

export async function startApiServer(port: number) {
  const schema: any = await getSchema();
  const server = new GraphQLServer({ schema });
  initializeStaticRoutes(server.express, port);

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
