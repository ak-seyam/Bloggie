import { CommentDependencyValidator } from "@controllers/data-interaction/article/dependency-validator";
import CommentModel, { Comment } from "@models/article/comments";
import UserModel from "@models/user/user";
import { DocumentType } from "@typegoose/typegoose";
import InvalidInputError from "@utils/api/user-input-error";
import { ObjectID } from "mongodb";
import CommentsLogic from "./comments-logic";
export default class CommentsLogicImpl implements CommentsLogic {
  async getCommentById(commentId: ObjectID): Promise<DocumentType<Comment>> {
    const res = await CommentModel.findById(commentId);
    if (!res) throw new InvalidInputError("Invalid comment id");
    return res;
  }
  async addComment(
    articleId: ObjectID,
    authorId: ObjectID,
    newData: Comment,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>> {
    const { article, author } = await dependencyValidator(authorId, articleId);
    newData.article = article._id;
    newData.author = author._id;
    newData.date = new Date();
    let res;
    try {
      // @ts-ignore
      res = await (await CommentModel.create(newData))
        .populate("author")
        .populate("article")
        .execPopulate();
    } catch (error) {
      throw new InvalidInputError(error.message);
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
      )
        .populate("author")
        .populate("article")
        .exec();
    } catch (e) {
      throw new InvalidInputError(e.message);
    }
    if (!res) throw new InvalidInputError("Invalid comment id");
    return res;
  }
}
