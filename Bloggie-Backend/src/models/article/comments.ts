import { User } from "@models/user/user";
import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Article } from "./article";

export class Comment {
  @prop({ ref: () => User, required: true })
  author: Ref<User>;

  @prop({ required: true, minlength: [15, "Invalid comment, too short"] })
  content: string;

  @prop({ type: Date })
  date: Date;

  @prop({ ref: () => Article, required: true })
  article: Ref<Article>;
}

const CommentModel = getModelForClass(Comment);

export default CommentModel;
