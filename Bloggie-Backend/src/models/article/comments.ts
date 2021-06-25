import { User } from "@models/user/user";
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { Article } from "./article";
import { ObjectId } from "mongodb";

@pre<Comment>("save", function (next) {
  this.commentId = this._id;
  next();
})
export class Comment {
  @prop({ unique: true, index: true })
  commentId: ObjectId;

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
