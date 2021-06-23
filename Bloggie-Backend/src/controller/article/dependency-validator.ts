import ArticleModel, { Article } from "@models/article/article";
import UserModel, { User } from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import UserInputError from "@utils/database/user-input-error";
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
  if (!author) throw new UserInputError("Invalid author id");
  return { author };
};

export const commentDependencyValidator: CommentDependencyValidator = async (
  authorId,
  articleId
) => {
  const author = await UserModel.findOne({ _id: authorId });
  if (!author) throw new UserInputError("Invalid author id");
  const article = await ArticleModel.findOne({ _id: articleId });
  if (!article) throw new UserInputError("Invalid article model");
  return { author, article };
};
