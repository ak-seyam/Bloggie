import { CommentDependencyValidator } from "@controller/article/dependency-validator";
import CommentModel, { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
export default class CommentsLogicImpl {
  async addComment(
    articleId: ObjectID,
    authorId: ObjectID,
    content: string,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>> {
    const { article, author } = await dependencyValidator(authorId, articleId);
    const savedArticle = {
      ...article,
      author: author._id,
    };
    const comment = new Comment();
    comment.article = article;
    comment.author = author;
    comment.content = content;
    comment.date = new Date();
    const res = await CommentModel.create({
      article: savedArticle,
      author,
      content,
      date: new Date(),
    });
    return res;
  }
  deleteComment(commentId: ObjectID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateComment(
    commentId: ObjectID,
    newContent: Comment
  ): Promise<DocumentType<Comment>> {
    throw new Error("Method not implemented.");
  }
}
