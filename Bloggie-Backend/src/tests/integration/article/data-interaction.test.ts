import ArticleLogic from "@controllers/data-interaction/article/article-logic";
import ArticleLogicImpl from "@controllers/data-interaction/article/article-logic-impl";
import ArticleModel, { Article } from "@models/article/article";
import CommentModel, { Comment } from "@models/article/comments";
import UserModel, { User } from "@models/user/user";
import { mongoose } from "@typegoose/typegoose";
import UserLogic from "@controllers/data-interaction/user/user-logic-impl";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import { ObjectID } from "mongodb";
import UserInputError from "@utils/database/user-input-error";
import { articleDependencyValidator } from "@controllers/data-interaction/article/dependency-validator";
import CommentsLogic from "@controllers/data-interaction/comment/comments-logic-impl";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import articleCreation from "@tests/utils/articles/article-creation";
import setupTeardown from "@tests/utils/data-interaction/setup-teardown";
import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";

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
    const tempArticle = new Article();
    tempArticle.title = TITLE;
    tempArticle.content =
      "Do proident qui eu occaecat ut velit. Cillum ut esse minim cupidatat nisi. Cillum ullamco elit nisi sunt tempor id ad incididunt dolor aliquip quis laborum ex. Fugiat eu laborum ipsum adipisicing. Veniam ut sit ullamco eu veniam esse nisi amet pariatur sit elit proident ex quis. Ea officia aute pariatur laborum officia aliquip mollit quis laborum labore. Laboris eu labore dolore dolor irure incididunt officia est.";
    const article = await articleLogic.createArticle(
      user._id,
      tempArticle,
      articleDependencyValidator
    );
    expect(article).toBeTruthy();
    expect(article._id).toBeTruthy();
    expect(article.title).toEqual(TITLE);
    // @ts-ignore
    expect(article.author._id).toEqual(user._id);
  });

  test("should mirror _id to articleId successfully", async () => {
    const TITLE = "This is a very big title";
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(commonWriter);
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const tempArticle = new Article();
    tempArticle.title = TITLE;
    tempArticle.content =
      "Do proident qui eu occaecat ut velit. Cillum ut esse minim cupidatat nisi. Cillum ullamco elit nisi sunt tempor id ad incididunt dolor aliquip quis laborum ex. Fugiat eu laborum ipsum adipisicing. Veniam ut sit ullamco eu veniam esse nisi amet pariatur sit elit proident ex quis. Ea officia aute pariatur laborum officia aliquip mollit quis laborum labore. Laboris eu labore dolore dolor irure incididunt officia est.";
    const article = await articleLogic.createArticle(
      user._id,
      tempArticle,
      articleDependencyValidator
    );
    expect(article).toBeTruthy();
    expect(article._id).toBeTruthy();
    expect(article._id).toEqual(article.articleId);
  });

  test("should reject creating article with incorrect data", async () => {
    const TITLE = "This";
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(commonWriter);
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const tempArticle = new Article();
    tempArticle.title = TITLE;
    tempArticle.content =
      "In dolore elit laborum id nostrud velit dolore dolore cupidatat deserunt sint velit. Exercitation culpa exercitation consequat minim deserunt eu enim commodo ea in nulla commodo. Duis voluptate ut id esse adipisicing ipsum. Eiusmod ad elit labore pariatur esse. Minim ipsum aute eu ut consectetur anim elit cupidatat aliqua nulla laborum cillum deserunt adipisicing.";
    try {
      const article = await articleLogic.createArticle(
        user._id,
        tempArticle,
        articleDependencyValidator
      );
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should reject article when user id is invalid", async () => {
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    try {
      const tempArticle = new Article();
      tempArticle.content =
        "Enim anim consequat id aliquip. Ea pariatur ad sit dolore proident cillum voluptate cupidatat deserunt amet. Duis nostrud laborum aliqua aliqua reprehenderit do non sit. Nisi elit labore proident ipsum ullamco dolor labore duis. Duis ea Lorem veniam eiusmod labore velit ut ad irure est deserunt. Aliquip reprehenderit pariatur cupidatat dolore ea ea excepteur duis in aliquip.";
      tempArticle.title = "A very long title";
      await articleLogic.createArticle(
        new ObjectID(),
        tempArticle,
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
    // @ts-ignore
    expect(result.author._id).toEqual(user._id);
  });

  test("should reject update with invalid title", async () => {
    const NEW_TITLE = "A";
    const { article, user } = await articleCreation();
    const newArt = new Article();
    newArt.title = NEW_TITLE;
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    try {
      const result = await articleLogic.updateArticle(article._id, newArt);
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
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

  test("should get article by id successfully", async () => {
    const { article, user } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const resArticle = await articleLogic.getArticleById(article._id);
    expect(article._id).toEqual(resArticle._id);
    // @ts-ignore
    expect(user._id).toEqual(resArticle.author._id);
    // @ts-ignore
    expect(user.firstName).toEqual(resArticle.author.firstName);
  });

  test("should reject getting article with invalid id", async () => {
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    try {
      await articleLogic.getArticleById(new ObjectID());
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should paginate comments successfully", async () => {
    const { article, user } = await articleCreation();
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const comments = [];
    const word = "veeeeeeeeeeeeeeeeeeeeeeery long";
    for (let i = 0; i < 4; i++) {
      const tempComment = new Comment();
      tempComment.content = `${word}${i + 1}`;
      comments.push(
        await commentsLogic.addComment(
          article._id,
          user._id,
          tempComment,
          commentDependencyValidator
        )
      );
    }
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const commentsOnArticle_1 = await articleLogic.getCommentsForArticle(
      article._id,
      2
    );
    expect(commentsOnArticle_1[0].content).toEqual(`${word}1`);
    expect(commentsOnArticle_1[1].content).toEqual(`${word}2`);
    const commentsOnArticle_2 = await articleLogic.getCommentsForArticle(
      article._id,
      2,
      commentsOnArticle_1[1]._id
    );
    expect(commentsOnArticle_2[0].content).toEqual(`${word}3`);
    expect(commentsOnArticle_2[1].content).toEqual(`${word}4`);
  });

  test("should get an article by title if it exist", async () => {
    const { article } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const resArticle = await articleLogic.getArticleByTitle(article.title);
    expect(resArticle[0].title).toEqual(article.title);
    // @ts-ignore
    expect(resArticle[0].author._id).toEqual(article.author._id);
  });

  test("should get an article by similar title if it exist", async () => {
    const { article } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const resArticle = await articleLogic.getArticleByTitle(
      article.title.toUpperCase().slice(0, article.title.length - 2)
    );
    expect(resArticle[0].title).toEqual(article.title);
    // @ts-ignore
    expect(resArticle[0].author._id).toEqual(article.author._id);
  });

  test("should reject invalid titles", async () => {
    const { article } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const resArt = await articleLogic.getArticleByTitle("tjdklff;asdfajlj");
    expect(resArt.length).toEqual(0);
  });
});
