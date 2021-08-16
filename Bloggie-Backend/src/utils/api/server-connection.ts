import { ApolloServer } from "apollo-server-express";
import getApolloConfig from "./get-apollo-schema-config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import AuthRoutes from "@controllers/routes/auth-routes";

let server: ApolloServer;
let httpServer: http.Server;

export async function startingServer(port: number) {
  server = new ApolloServer(await getApolloConfig());
  await server.start();
  const app = express();
  app.use(cookieParser());
  app.use("/auth", AuthRoutes);
  server.applyMiddleware({ app });
  httpServer = app.listen(port, () => {
    // connect to database
    console.log("Listening on port", port);
  });
}

export async function teardownServer() {
  await server.stop();
  console.log("GraphQL Server stopped");
  httpServer.close();
  console.log("Http Server stopped");
}
