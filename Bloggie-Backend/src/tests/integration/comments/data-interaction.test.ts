import { commentDependencyValidator } from "@controller/article/dependency-validator";
import CommentsLogic from "@controller/comment/comments-logic";
import CommentsLogicImpl from "@controller/comment/comments-logic-impl";
import ArticleModel from "@models/article/article";
import CommentModel from "@models/article/comments";
import UserModel from "@models/user/user";
import articleCreation from "@tests/utils/articles/article-creation";
import setupTeardown from "@tests/utils/data-interaction/setup-teardown";
import { mongoose } from "@typegoose/typegoose";
import UserInputError from "@utils/database/user-input-error";
import { ObjectID } from "mongodb";

describe("Comments data interaction test suit", () => {
  setupTeardown();
  test("should create comment successfully", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      content,
      commentDependencyValidator
    );
    expect(comment).toBeTruthy();
    expect(comment.content).toEqual(content);
  });

  test("should reject creating comment with invalid author", async () => {
    const { article } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    try {
      await commentsLogic.addComment(
        article._id,
        new ObjectID(),
        content,
        commentDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });
});
