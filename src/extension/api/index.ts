import { GraphQLServer } from "graphql-yoga";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import "reflect-metadata";
import { pubSub } from "./pubSub";
import blocks from "../../blocks/extension-backend";

export async function getSchema() {
  return await buildSchema({
    resolvers: blocks.reduce(
      (acc, block) => [...acc, ...block.resolvers],
      [] as any
    ),
    pubSub: pubSub as any,
    container: Container
  });
}

const port = 4545;
export async function startApiServer() {
  const schema: any = await getSchema();
  const server = new GraphQLServer({ schema });
  server
    .start(
      {
        port,
        playground: "/debug"
      },
      async () => {
        const url = `http://localhost:${port}`;
        console.log(`⚡  Insight is running at ${url} `);
      }
    )
    .catch(Err => {
      debugger;
    });
}

if (!process.env.dev) {
  console.log("executing startApiServer");
  startApiServer();
}
