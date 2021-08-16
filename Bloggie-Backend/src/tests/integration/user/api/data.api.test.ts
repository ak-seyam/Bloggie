import ArticleLogic from "@services/data-interaction/article/article-logic";
import ArticleLogicImpl from "@services/data-interaction/article/article-logic-impl";
import { articleDependencyValidator } from "@services/data-interaction/article/dependency-validator";
import UserLogic from "@services/data-interaction/user/user-logic";
import UserLogicImpl from "@services/data-interaction/user/user-logic-impl";
import { Article } from "@models/article/article";
import { User } from "@models/user/user";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import axios from "axios";

describe("User Data API test suite", () => {
  const PORT = setupTeardownGraphQL_API();
  test("should get all user data successfully", async () => {
    const _user = new User();
    _user.email = "valid@gmail.com";
    _user.password = "ValiDPa$$3orD_2020";
    _user.firstName = "firstname";
    _user.lastName = "lastname";
    const userLogic: UserLogic = new UserLogicImpl();
    const persistedUser = await userLogic.createUser(_user);
    const article = new Article();
    article.content = `Ea mollit velit aute anim id in. Consequat est ullamco officia ex Lorem ipsum. Labore nisi fugiat nulla id reprehenderit do quis proident reprehenderit ipsum. Tempor et nostrud pariatur veniam pariatur ex aliquip occaecat et laborum in duis dolor. Laboris ullamco in excepteur ut et velit aliquip anim laboris proident. Laboris ullamco ex ea quis dolor exercitation dolor duis.`;
    article.title = `the title`;
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    articleLogic.createArticle(
      persistedUser._id,
      article,
      articleDependencyValidator
    );
    console.log(`persisted user id ${persistedUser._id}`);
    const user = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
					query getUser {
  					user(id:"${persistedUser._id}") {
    					email,
    					firstName,
							lastName
    					articles {
      					title
    					}
  					}
					}
			`,
      })
      .then((res) => res.data)
      .then((content) => content.data)
      .then((res) => res.user);
    expect(user.email).toBeTruthy();
    expect(user.firstName).toBeTruthy();
    expect(user.lastName).toBeTruthy();
    expect(Array.isArray(user.articles)).toBeTruthy();
    expect(user.articles[0].title).toEqual(article.title);
  });
});
