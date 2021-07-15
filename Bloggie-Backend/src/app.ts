import { ApolloServer } from "apollo-server-express";
import express from "express";
import getApolloConfig from "@utils/api/get-apollo-schema-config";

import "reflect-metadata";
import UserResolver from "@services/resolvers/user-resolver";
import { startingServer } from "@utils/api/server-connection";

require("env_setter");
require("@utils/database/database-connection");

async function main() {
  const port: number = parseInt(process.env["SERVER_PORT"] ?? "0");
  if (port < 1024) {
    throw new Error("Server error is not provided");
  }
  await startingServer(port);
}

main();
