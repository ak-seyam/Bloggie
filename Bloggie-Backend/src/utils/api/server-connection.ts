import { ApolloServer } from "apollo-server-express";
import getApolloConfig from "./get-apollo-schema-config";
import express from "express";
import http from "http";

let server: ApolloServer;
let httpServer: http.Server;

export async function startingServer(port: number) {
  server = new ApolloServer(await getApolloConfig());
  await server.start();
  const app = express();
  server.applyMiddleware({ app });
  httpServer = app.listen(port, () => {
    // connect to database
    console.log("Listening on port", port);
  });
}

export async function teardownServer() {
  server.stop();
  httpServer.close();
}
