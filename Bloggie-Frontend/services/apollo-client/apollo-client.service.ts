import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env["SERVER_SIDE_BASE_URL"],
  cache: new InMemoryCache(),
});
