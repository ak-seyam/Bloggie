import CommentsLogic from "@controllers/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";
import { Comment } from "@models/article/comments";
import { apolloErrorsWrapper } from "@services/utils/graph-ql-resolvers-wrapper";
import { Types } from "mongoose";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { DoneSuccessfully } from "./aricle-resolver";
import isAuth from "./middleware/auth";

@ArgsType()
class CommentData {
  @Field({ nullable: true })
  content: string;
  @Field()
  commentId: string;
}

@Resolver((of) => Comment)
export default class CommentsResolver {
  // Note: reading a comment is related to articles so no need to add it here again
  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("articleId") articleId: string,
    @Arg("userId") userId: string,
    @Arg("content") content: string
  ) {
    return apolloErrorsWrapper<Comment>(async () => {
      const commentsLogic: CommentsLogic = new CommentsLogicImpl();
      const comment = new Comment();
      comment.content = content;
      return commentsLogic.addComment(
        Types.ObjectId(articleId),
        Types.ObjectId(userId),
        comment,
        commentDependencyValidator
      );
    });
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async editComment(@Args() newData: CommentData) {
    return apolloErrorsWrapper<Comment>(async () => {
      const comment = new Comment();
      if (newData.content) comment.content = newData.content;
      const commentsLogic: CommentsLogic = new CommentsLogicImpl();
      return commentsLogic.updateComment(
        Types.ObjectId(newData.commentId),
        comment
      );
    });
  }

  @Mutation(() => DoneSuccessfully)
  @UseMiddleware(isAuth)
  async deleteComment(@Arg("commentId") commentId: string) {
    return apolloErrorsWrapper<DoneSuccessfully>(async () => {
      try {
        const commentsLogic: CommentsLogic = new CommentsLogicImpl();
        await commentsLogic.deleteComment(Types.ObjectId(commentId));
        return { success: true };
      } catch (e) {
        throw e;
      }
    });
  }
}
