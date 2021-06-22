import dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}/../${process.env.ENVIRONMENT}.env`,
});
