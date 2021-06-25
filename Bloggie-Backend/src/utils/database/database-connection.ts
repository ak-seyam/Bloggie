import mongoose from "mongoose";
import DatabaseInfoError from "@utils/database/database-info-error";

const mongoUser = process.env["MONGO_USER"];
if (!mongoUser) throw new DatabaseInfoError("mongo user");
const mongoPassword = process.env["MONGO_PASSWORD"];
if (!mongoPassword) throw new DatabaseInfoError("mongo password");
const host = process.env["MONGO_HOST"];
if (!host) throw new DatabaseInfoError("mongo host");
const port = process.env["MONGO_PORT"];
if (!port) throw new DatabaseInfoError("mongo port");
const databaseName = process.env["MONGO_DATABASE"];
if (!databaseName) throw new DatabaseInfoError("database name");
const authSource = process.env["AUTH_SOURCE"];

mongoose.connect(
  `mongodb://${mongoUser}:${mongoPassword}@${host}:${port}/${databaseName}${
    authSource ? `?authSource=${authSource}` : ""
  }`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error(error);
  throw new DatabaseInfoError("Connection", error.message);
});

db.once("open", () => {
  console.log("MongoDB connected successfully");
});
