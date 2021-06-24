import { CommentDependencyValidator } from "controllers/article/dependency-validator";
import CommentModel, { Comment } from "@models/article/comments";
import UserModel from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import UserInputError from "@utils/database/user-input-error";
import { ObjectID } from "mongodb";
import CommentsLogic from "./comments-logic";
export default class CommentsLogicImpl implements CommentsLogic {
  async getCommentById(commentId: ObjectID): Promise<DocumentType<Comment>> {
    const res = await CommentModel.findById(commentId);
    if (!res) throw new UserInputError("Invalid comment id");
    return res;
  }
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
    let res;
    try {
      res = await CommentModel.create({
        article: savedArticle,
        author,
        content,
        date: new Date(),
      });
    } catch (error) {
      throw new UserInputError(error.message);
    }
    return res;
  }
  async deleteComment(commentId: ObjectID): Promise<boolean> {
    const res = await CommentModel.remove({ _id: commentId });
    return res.ok === 1 && res.deletedCount !== 0;
  }
  async updateComment(
    commentId: ObjectID,
    newContent: Comment
  ): Promise<DocumentType<Comment>> {
    newContent.date = new Date();
    let res;
    try {
      res = await CommentModel.findOneAndUpdate(
        { _id: commentId },
        newContent,
        { new: true, runValidators: true }
      );
    } catch (e) {
      throw new UserInputError(e.message);
    }
    if (!res) throw new UserInputError("Invalid comment id");
    return res;
  }
}
