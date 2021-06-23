import { CommentDependencyValidator } from "@controller/article/dependency-validator";
import { Comment } from "@models/article/comments";
import { DocumentType } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
export default interface CommentsLogic {
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
