import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";
import CommentsLogic from "@controllers/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import ArticleModel from "@models/article/article";
import CommentModel, { Comment } from "@models/article/comments";
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

  test("should reject creation of invalid comment", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay!";
    try {
      const comment = await commentsLogic.addComment(
        article._id,
        user._id,
        content,
        commentDependencyValidator
      );
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
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

  test("should reject creating comment with invalid article id", async () => {
    const { user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    try {
      await commentsLogic.addComment(
        new ObjectID(),
        user._id,
        content,
        commentDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should update comment", async () => {
    const { article, user } = await articleCreation();
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "the best thing in this world!";
    const comment = await commentLogic.addComment(
      article._id,
      user._id,
      "the best thing in this world",
      commentDependencyValidator
    );
    const newComm = new Comment();
    newComm.content = content;
    const res = await commentLogic.updateComment(comment._id, newComm);
    expect(res).toBeTruthy();
    expect(res.content).toEqual(content);
  });

  test("should reject updating comment with invalid length", async () => {
    const { article, user } = await articleCreation();
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "t";
    const comment = await commentLogic.addComment(
      article._id,
      user._id,
      "the best thing in this world",
      commentDependencyValidator
    );
    const newComm = new Comment();
    newComm.content = content;
    try {
      const res = await commentLogic.updateComment(comment._id, newComm);
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should reject updating comment with invalid id", async () => {
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    try {
      const newComm = new Comment();
      newComm.content = "very long comment but it doesn't matter";
      await commentLogic.updateComment(new ObjectID(), newComm);
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should delete comment", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      content,
      commentDependencyValidator
    );
    const done = await commentsLogic.deleteComment(comment._id);
    expect(done).toBeTruthy();
    try {
      const c = await commentsLogic.getCommentById(comment._id);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should reject deletion of invalid comment id", async () => {
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const res = await commentLogic.deleteComment(new ObjectID());
    expect(res).toBe(false);
  });

  test("should get comment by id", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      content,
      commentDependencyValidator
    );
    const resComment = await commentsLogic.getCommentById(comment._id);
    expect(resComment.content).toEqual(comment.content);
    // @ts-ignore
    expect(resComment.author).toEqual(comment.author._id);
    // @ts-ignore
    expect(resComment.article).toEqual(comment.article._id);
  });

  test("should reject getting comment by invalid id", async () => {
    try {
      const commentLogic: CommentsLogic = new CommentsLogicImpl();
      await commentLogic.getCommentById(new ObjectID());
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });
});
