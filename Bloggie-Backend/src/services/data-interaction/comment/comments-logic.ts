import { CommentDependencyValidator } from "@controllers/data-interaction/article/dependency-validator";
import { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
export default interface CommentsLogic {
  addComment(
    articleId: ObjectID,
    authorId: ObjectID,
    newData: Comment,
    dependencyValidator: CommentDependencyValidator
  ): Promise<DocumentType<Comment>>;
  deleteComment(commentId: ObjectID): Promise<boolean>;
  updateComment(
    commentId: ObjectID,
    newContent: Comment
  ): Promise<DocumentType<Comment>>;
  getCommentById(commentId: ObjectID): Promise<DocumentType<Comment>>;
}
