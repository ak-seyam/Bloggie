import ArticleLogic from "@controller/article/article-logic";
import ArticleLogicImpl from "@controller/article/article-logic-impl";
import ArticleModel, { Article } from "@models/article/article";
import CommentModel from "@models/article/comments";
import UserModel, { User } from "@models/user/user";
import { mongoose } from "@typegoose/typegoose";
import UserLogic from "@controller/user/user-logic";
import UserLogicImpl from "@controller/user/user-logic-impl";
import { ObjectID } from "mongodb";
import UserInputError from "@utils/database/user-input-error";
import {
  articleDependencyValidator,
  commentDependencyValidator,
} from "@controller/article/dependency-validator";
import CommentsLogic from "@controller/comment/comments-logic-impl";
import CommentsLogicImpl from "@controller/comment/comments-logic-impl";
import articleCreation from "@tests/utils/articles/article-creation";
import setupTeardown from "@tests/utils/data-interaction/setup-teardown";

describe("Data interaction suit", () => {
  setupTeardown();
  const commonWriter = new User();
  commonWriter.email = "email@gmail.com";
  commonWriter.firstName = "firstName";
  commonWriter.lastName = "lastName";
  commonWriter.password = "world123?>Ez";

  test("should create article successfully", async () => {
    const TITLE = "This is a very big title";
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(commonWriter);
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const article = await articleLogic.createArticle(
      user._id,
      TITLE,
      "Do proident qui eu occaecat ut velit. Cillum ut esse minim cupidatat nisi. Cillum ullamco elit nisi sunt tempor id ad incididunt dolor aliquip quis laborum ex. Fugiat eu laborum ipsum adipisicing. Veniam ut sit ullamco eu veniam esse nisi amet pariatur sit elit proident ex quis. Ea officia aute pariatur laborum officia aliquip mollit quis laborum labore. Laboris eu labore dolore dolor irure incididunt officia est.",
      articleDependencyValidator
    );
    expect(article).toBeTruthy();
    expect(article._id).toBeTruthy();
    expect(article.title).toEqual(TITLE);
    // @ts-ignore
    expect(article.author._id).toEqual(user._id);
  });

  test("should reject article when user id is invalid", async () => {
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    try {
      await articleLogic.createArticle(
        new ObjectID(),
        "Very long title",
        "Eu mollit ex dolor adipisicing et id pariatur reprehenderit minim proident aliquip aute. Occaecat officia adipisicing et et sit occaecat nostrud voluptate. Dolore duis tempor velit excepteur Lorem magna. Ex nisi ullamco cillum dolore consectetur deserunt proident nisi labore quis.",
        articleDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should update article successfully", async () => {
    const NEW_TITLE = "A very new title!";
    const { article, user } = await articleCreation();
    const newArt = new Article();
    newArt.title = NEW_TITLE;
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const result = await articleLogic.updateArticle(article._id, newArt);
    expect(result.title).toEqual(NEW_TITLE);
    expect(result.content).toEqual(article.content);
    expect(result.author).toEqual(user._id);
  });

  test("should reject updating an article with invalid article id", async () => {
    const NEW_TITLE = "A very new title!";
    const { article } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    try {
      const newArt = new Article();
      newArt.title = NEW_TITLE;
      await articleLogic.updateArticle(new ObjectID(), newArt);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should delete article successfully", async () => {
    const { article } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const correct = await articleLogic.deleteArticle(article._id);
    expect(correct).toBe(true);
  });

  test("should reject deleting invalid article id", async () => {
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const correct = await articleLogic.deleteArticle(new ObjectID());
    expect(correct).toBe(false);
  });
});
