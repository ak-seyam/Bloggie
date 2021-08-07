import ArticleModel from "@models/article/article";
import CommentModel from "@models/article/comments";
import UserModel from "@models/user/user";
import { AsyncFunction } from "@services/utils/errors-wrapper";
import { mongoose } from "@typegoose/typegoose";
import { startingServer, teardownServer } from "@utils/api/server-connection";

/**
 * @description run the setup and teardown logic for the api
 * @returns the port for the server
 */
export default function setupTeardownGraphQL_API() {
  const port = Math.ceil(1024 + Math.random() * 10000);
  beforeAll(async () => {
    require("../../../env_setter");
    require("@utils/database/database-connection");
    await startingServer(port);
  });
  afterEach(async () => {
    await UserModel.remove({});
    await ArticleModel.remove({});
    await CommentModel.remove({});
  });
  afterAll(async () => {
    await teardownServer();
    mongoose.disconnect();
  });
  return port;
}
