import { ApolloServerExpressConfig } from "apollo-server-express";
import { buildSchema } from "type-graphql";

export default async function getApolloConfig(): Promise<ApolloServerExpressConfig> {
  const resolversDir = `${__dirname}/../../controllers/resolvers/*.ts`;
  return {
    schema: await buildSchema({
      resolvers: [resolversDir],
    }),
    context: ({ req, res }) => ({ req, res }),
  };
}
