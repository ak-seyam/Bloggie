import { User } from "@models/user/user";
import { getModelForClass, prop } from "@typegoose/typegoose";

export class Comment {
  @prop({ ref: () => User, required: true })
  author: User;

  @prop({ minlength: [15, "Invalid comment, too short"] })
  content: string;

  @prop({ type: Date })
  date: Date;
}

const CommentModel = getModelForClass(Comment);

export default CommentModel;
