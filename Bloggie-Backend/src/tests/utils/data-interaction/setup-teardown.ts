import ArticleModel from "@models/article/article";
import CommentModel from "@models/article/comments";
import UserModel from "@models/user/user";
import { mongoose } from "@typegoose/typegoose";

const setupTeardown = () => {
  beforeAll(async () => {
    require("../../../env_setter");
    require("@utils/database/database-connection");
  });
  afterEach(async () => {
    await UserModel.remove({});
    await ArticleModel.remove({});
    await CommentModel.remove({});
  });
  afterAll(async () => {
    mongoose.disconnect();
  });
}
export default setupTeardown;