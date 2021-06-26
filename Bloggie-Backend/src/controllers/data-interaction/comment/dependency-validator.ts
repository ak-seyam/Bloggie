import ArticleModel, { Article } from "@models/article/article";
import UserModel, { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import InvalidInputError from "@utils/database/user-input-error";
import { ObjectID } from "mongodb";

export type CommentDependencyValidator = (
  authorId: ObjectID,
  articleId: ObjectID
) => Promise<{
  article: DocumentType<Article>;
  author: DocumentType<User>;
}>;

export const commentDependencyValidator: CommentDependencyValidator = async (
  authorId,
  articleId
) => {
  const author = await UserModel.findOne({ _id: authorId });
  if (!author) throw new InvalidInputError("Invalid author id");
  const article = await ArticleModel.findOne({ _id: articleId });
  if (!article) throw new InvalidInputError("Invalid article model");
  return { author, article };
};
