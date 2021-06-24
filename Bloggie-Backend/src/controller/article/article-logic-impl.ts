import ArticleModel, { Article } from "@models/article/article";
import CommentModel, { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import UserInputError from "@utils/database/user-input-error";
import { ObjectId } from "bson";
import ArticleLogic from "./article-logic";
import {
  ArticleDependencyValidator,
  CommentDependencyValidator,
} from "./dependency-validator";

export default class ArticleLogicImpl implements ArticleLogic {
  async getArticleById(articleId: ObjectId): Promise<DocumentType<Article>> {
    const article = await ArticleModel.findById(articleId);
    if (!article) throw new UserInputError("Invalid article id");
	return article;
}
  getArticleByTitle(title: string): Promise<DocumentType<Article>> {
    throw new Error("Method not implemented.");
  }
  async createArticle(
    authorId: ObjectId,
    title: string,
    content: string,
    dependencyValidator: ArticleDependencyValidator
  ): Promise<DocumentType<Article>> {
    const { author } = await dependencyValidator(authorId);
    const articleStored = await ArticleModel.create({
      author,
      content,
      title,
    });
    return articleStored;
  }
  async updateArticle(
    articleId: ObjectId,
    newData: Article
  ): Promise<DocumentType<Article>> {
    const res = await ArticleModel.findOneAndUpdate(
      { _id: articleId },
      { $set: newData },
      { new: true }
    );
    if (!res) throw new UserInputError("Invalid article id");
    return res;
  }
  async deleteArticle(articleId: ObjectId): Promise<boolean> {
    const res = await ArticleModel.deleteOne({ _id: articleId });
    return res.ok === 1 && res.deletedCount !== 0;
  }
  async getCommentsForArticle(
    articleId: ObjectId,
    from: ObjectId,
    limit: number
  ): Promise<DocumentType<Comment>[]> {
	const article = await this.getArticleById(articleId)
    const res = await CommentModel.find(
      { article: article._id },
      from
        ? {
            _id: {
              $gt: from,
            },
          }
        : {}
    )
      .sort({ _id: 1 })
      .limit(limit);
    return res;
  }
}
