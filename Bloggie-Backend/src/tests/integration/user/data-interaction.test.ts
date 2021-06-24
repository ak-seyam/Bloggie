import UserLogic from "@controllers/data-interaction/user/user-logic";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import UserModel, { User } from "@models/user/user";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import UserInputError from "@utils/database/user-input-error";
import setupTeardown from "@tests/utils/data-interaction/setup-teardown";
import articleCreation from "@tests/utils/articles/article-creation";
import ArticleLogic from "@controllers/data-interaction/article/article-logic-impl";
import ArticleLogicImpl from "@controllers/data-interaction/article/article-logic-impl";
import { Article } from "@models/article/article";
import { articleDependencyValidator } from "@controllers/data-interaction/article/dependency-validator";

describe("User data interaction suit", () => {
  setupTeardown();

  const initUser = new User();
  initUser.firstName = "first";
  initUser.lastName = "last";
  initUser.password = "yahoo!XD123";
  initUser.email = "ahmed@gmail.com";

  const expectsDifference = (keys: string[], user1: any, user2: any) => {
    for (let key in keys) {
      expect(user1[key]).toEqual(user2[key]);
    }
  };

  test("should create new user", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    expect(user).toBeTruthy();
    expect(user._id).toBeTruthy();
    const fields = ["firstName", "lastName", "password", "email"];
    expectsDifference(fields, initUser, user);
  });

  test("should reject user creation with invalid data", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    try {
      const user = await userLogic.createUser({
        ...initUser,
        firstName: "n32",
      });
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should update a user", async () => {
    const NEW_FN = "newfirstname";
    // create new user
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    // update the data of that new user
    const tempUser = new User();
    tempUser.firstName = NEW_FN;
    const newUser = await userLogic.updateUser(user._id, tempUser);
    // check the result from update
    expect(newUser.firstName).toEqual(NEW_FN);
    expect(newUser._id).toEqual(user._id);
    expect(newUser.lastName).toEqual(user.lastName);
  });

  test("should reject user update with invalid id", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    const tempUser = new User();
    tempUser.firstName = "random";
    try {
      await userLogic.updateUser(new ObjectId(), tempUser);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should reject user with invalid new update data", async () => {
    const NEW_FN = "new first name32";
    // create new user
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    // update the data of that new user
    const tempUser = new User();
    tempUser.firstName = NEW_FN;
    try {
      const newUser = await userLogic.updateUser(user._id, tempUser);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should find user by id", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    const newUser = await userLogic.getUserById(user._id);
    const fields = ["firstName", "lastName", "password", "email"];
    expectsDifference(fields, user, newUser);
  });
  test("should reject invalid id", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    try {
      await userLogic.getUserById(new ObjectId());
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should find user by email", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    await userLogic.createUser(initUser);
    const user = await userLogic.getUserByEmail(initUser.email);
    expect(user).toBeTruthy();
    expectsDifference(["firstName", "email"], user, initUser);
  });

  test("should reject invalid email", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    await userLogic.createUser(initUser);
    try {
      await userLogic.getUserByEmail("radomText");
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should delete user successfully", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.createUser(initUser);
    try {
      const res = await userLogic.deleteUser(user._id);
      expect(res).toBeTruthy();
      // find the user again it should return user input error
      await userLogic.getUserById(user._id);
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });

  test("should return false deleting a user that doesn't exist", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const done = await userLogic.deleteUser(new ObjectId());
    expect(done).toBeFalsy();
  });

  test("should get all users and use pagination correctly", async () => {
    const firstName = "firstName";
    const lastName = "lastName";
    const password = "helloWorld123456_!";
    const users = [];
    for (let i = 0; i < 4; i++) {
      const u = new User();
      u.firstName = firstName;
      u.email = `user${i + 1}@gmail.com`;
      u.password = password;
      u.lastName = lastName;
      users.push(u);
    }
    const userLogic: UserLogic = new UserLogicImpl();
    const userRes = await Promise.all(
      users.map(async (user) => {
        return await userLogic.createUser(user);
      })
    );
    const paginationRes_1 = await userLogic.getUsers(2);
    expect(paginationRes_1[0]._id).toEqual(userRes[0]._id);
    expect(paginationRes_1[1]._id).toEqual(userRes[1]._id);
    const paginationRes_2 = await userLogic.getUsers(2, userRes[1]._id);
    expect(paginationRes_2[0]._id).toEqual(userRes[2]._id);
    expect(paginationRes_2[1]._id).toEqual(userRes[3]._id);
  });
  test("should throw an error if no result while requesting all users", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    try {
      await userLogic.getUsers(10, new ObjectId());
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeInstanceOf(UserInputError);
    }
  });
  test("should get all articles by user", async () => {
    const { article, user } = await articleCreation();
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    const articles = [];
    const word = `Very long title yes it is haha `;
    for (let i = 0; i < 3; i++) {
      await articleLogic.createArticle(
        user._id,
        `${word}${i + 2}`,
        "Id adipisicing et Lorem eu irure ex dolor id amet est reprehenderit. Tempor quis ut eu esse ipsum id magna ullamco aliqua elit magna ea. Laboris veniam Lorem deserunt mollit deserunt. Irure quis proident culpa qui reprehenderit. Mollit duis adipisicing minim esse ullamco.",
        articleDependencyValidator
      );
    }
    const userLogic: UserLogic = new UserLogicImpl();
    const articles_1 = await userLogic.getArticlesByUser(user._id, 2);
    expect(articles_1[0].title).toEqual(article.title);
    expect(articles_1[1].title).toEqual(`${word}2`);
    const articles_2 = await userLogic.getArticlesByUser(
      user._id,
      2,
      articles_1[1]._id
    );
    expect(articles_2[0].title).toEqual(`${word}3`);
    expect(articles_2[1].title).toEqual(`${word}4`);
    // @ts-ignore
    expect(articles_2[1].author._id).toEqual(user._id);
  });

  test("should return empty list if user doesn't have articles", async () => {
    const userLogic: UserLogic = new UserLogicImpl();
    const res = await userLogic.createUser(initUser);
    const resArt = await userLogic.getArticlesByUser(res._id, 2);
    expect(resArt.length).toEqual(0);
  });
});
