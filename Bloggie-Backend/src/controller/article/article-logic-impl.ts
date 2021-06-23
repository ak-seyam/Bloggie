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
  getArticleById(articleId: ObjectId): Promise<DocumentType<Article>> {
    throw new Error("Method not implemented.");
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
    const article = await ArticleModel.findById(articleId);
    if (!article) throw new UserInputError("Invalid article id");
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
  async addComment(
    articleId: ObjectId,
    authorId: ObjectId,
    content: string,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>> {
    const { article, author } = await dependencyValidator(authorId, articleId);
	const savedArticle = {
		...article,
		author: author._id
	}
    const comment = new Comment();
    comment.article = article;
    comment.author = author;
    comment.content = content;
    comment.date = new Date();
    const res = await CommentModel.create({
		article: savedArticle,
		author,
		content,
		date: new Date()
	});
    return res;
  }
  deleteComment(commentId: ObjectId): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateComment(
    commentId: ObjectId,
    newContent: Comment
  ): Promise<DocumentType<Comment>> {
    throw new Error("Method not implemented.");
  }
}
