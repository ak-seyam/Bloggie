import express from "express";

const app = express();

require("env_setter");
require("@utils/database/database-connection");
app.listen(process.env["SERVER_PORT"], () => {
  // connect to database
  console.log("Listening on port", process.env["SERVER_PORT"]);
});
