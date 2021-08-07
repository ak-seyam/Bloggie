import { Article } from "@models/article/article";
import UserModel, { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import InvalidInputError from "@utils/api/user-input-error";
import { ObjectID } from "mongodb";

export type ArticleDependencyValidator = (
  authorId: ObjectID
) => Promise<{ author: DocumentType<User> }>;
export type CommentDependencyValidator = (
  authorId: ObjectID,
  articleId: ObjectID
) => Promise<{
  article: DocumentType<Article>;
  author: DocumentType<User>;
}>;

export const articleDependencyValidator: ArticleDependencyValidator = async (
  authorId
) => {
  const author = await UserModel.findOne({ _id: authorId });
  if (!author) throw new InvalidInputError("Invalid author id");
  return { author };
};
