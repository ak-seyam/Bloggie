import { Article } from "@models/article/article";
import { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";

export default interface ArticleLogic {
  getArticleById(articleId: ObjectID): Promise<DocumentType<Article>>;
  getArticleByTitle(title: string): Promise<DocumentType<Article>>;
  createArticle(
    authorId: ObjectID,
    content: string
  ): Promise<DocumentType<Article>>;
  updateArticle(
    articleId: ObjectID,
    newData: Article
  ): Promise<DocumentType<Article>>;
  deleteArticle(articleId: ObjectID): Promise<boolean>;
  getCommentsForArticle(
    articleId: ObjectID,
    from: ObjectID,
    limit: number
  ): Promise<DocumentType<Comment>[]>;
  addComment(
    articleId: ObjectID,
    authorId: ObjectID
  ): Promise<DocumentType<Comment>>;
  deleteComment(commentId: ObjectID): Promise<boolean>;
  updateComment(
    commentId: ObjectID,
    newContent: Comment
  ): Promise<DocumentType<Comment>>;
}
