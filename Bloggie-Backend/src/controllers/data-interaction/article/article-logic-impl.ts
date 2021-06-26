import ArticleModel, { Article } from "@models/article/article";
import CommentModel, { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import InvalidInputError from "@utils/database/user-input-error";
import { ObjectId } from "bson";
import ArticleLogic from "./article-logic";
import {
  ArticleDependencyValidator,
  CommentDependencyValidator,
} from "./dependency-validator";

export default class ArticleLogicImpl implements ArticleLogic {
  async getArticleById(articleId: ObjectId): Promise<DocumentType<Article>> {
    const article = await ArticleModel.findById(articleId).populate("author");
    if (!article) throw new InvalidInputError("Invalid article id");
    return article;
  }

  // TODO this has a flaw, if title contain more stuff than the actual thing in
  // the database it will result non
  async getArticleByTitle(title: string): Promise<DocumentType<Article>[]> {
    console.debug(`
	   Warning: This has a flaw, if title contain more stuff than the actual thing in the database it will result non
	  `);
    const article = await ArticleModel.find({
      title: RegExp(`.*${title}.*`, "i"),
    }).populate("author");

    return article;
  }

  async createArticle(
    authorId: ObjectId,
    newData: Article,
    dependencyValidator: ArticleDependencyValidator
  ): Promise<DocumentType<Article>> {
    const { author } = await dependencyValidator(authorId);
    let articleStored;
    newData.author = author._id;
    try {
      // @ts-ignore
      articleStored = await (await ArticleModel.create(newData))
        .populate("author")
        .execPopulate();
    } catch (e) {
      throw new InvalidInputError(e.message);
    }
    return articleStored;
  }
  async updateArticle(
    articleId: ObjectId,
    newData: Article
  ): Promise<DocumentType<Article>> {
    let res;
    try {
      res = await ArticleModel.findOneAndUpdate(
        { _id: articleId },
        { $set: newData },
        { new: true, runValidators: true }
      ).populate("author");
    } catch (e) {
      throw new InvalidInputError(e.message);
    }
    if (!res) throw new InvalidInputError("Invalid article id");
    return res;
  }
  async deleteArticle(articleId: ObjectId): Promise<boolean> {
    const res = await ArticleModel.deleteOne({ _id: articleId });
    return res.ok === 1 && res.deletedCount !== 0;
  }
  async getCommentsForArticle(
    articleId: ObjectId,
    limit: number,
    from?: ObjectId
  ): Promise<DocumentType<Comment>[]> {
    const article = await this.getArticleById(articleId);
    const res = await CommentModel.find({
      $and: [{ article: article._id }, from ? { _id: { $gt: from } } : {}],
    })
      .sort({ _id: 1 })
      .limit(limit);
    return res;
  }
}
