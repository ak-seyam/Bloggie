import { User } from "@models/user/user";
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { Article } from "./article";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@pre<Comment>("save", function (next) {
  this.commentId = this._id;
  next();
})
@ObjectType()
export class Comment {
  @prop({ unique: true, index: true })
  @Field(() => ID)
  commentId: ObjectId;

  @prop({ ref: () => User, required: true })
  @Field(() => User)
  author: Ref<User>;

  @prop({ required: true, minlength: [10, "Invalid comment, too short"] })
  @Field()
  content: string;

  @prop({ type: Date })
  @Field()
  date: Date;

  @prop({ ref: () => Article, required: true })
  @Field(() => Article)
  article: Ref<Article>;
}

const CommentModel = getModelForClass(Comment);

export default CommentModel;
