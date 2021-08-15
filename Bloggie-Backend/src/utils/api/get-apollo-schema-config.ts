import { ApolloServerExpressConfig } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import UserResolver from "@controllers/resolvers/user-resolver";
import ArticleResolver from "@controllers/resolvers/aricle-resolver";
import CommentsResolver from "@controllers/resolvers/comments-resolver";
import PingResolver from "@controllers/resolvers/ping";

export default async function getApolloConfig(): Promise<ApolloServerExpressConfig> {
  const resolversDir = `${__dirname}/../../controllers/resolvers/*.ts`;
  return {
    schema: await buildSchema({
      resolvers: [resolversDir],
    }),
    context: ({ req, res }) => ({ req, res }),
  };
}
