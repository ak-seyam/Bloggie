import { Article } from "@models/article/article";
import { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
import {
  ArticleDependencyValidator,
  CommentDependencyValidator,
} from "./dependency-validator";

export default interface ArticleLogic {
  getArticleById(articleId: ObjectID): Promise<DocumentType<Article>>;
  getArticleByTitle(title: string): Promise<DocumentType<Article>>;
  createArticle(
    authorId: ObjectID,
    title: string,
    content: string,
    dependencyValidator: ArticleDependencyValidator
  ): Promise<DocumentType<Article>>;
  updateArticle(
    articleId: ObjectID,
    newData: Article
  ): Promise<DocumentType<Article>>;
  deleteArticle(articleId: ObjectID): Promise<boolean>;
  getCommentsForArticle(
    articleId: ObjectID,
    from: ObjectID,
    limit: number,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>[]>;
  addComment(
    articleId: ObjectID,
    authorId: ObjectID,
    content: string,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>>;
  deleteComment(commentId: ObjectID): Promise<boolean>;
  updateComment(
    commentId: ObjectID,
    newContent: Comment
  ): Promise<DocumentType<Comment>>;
}
