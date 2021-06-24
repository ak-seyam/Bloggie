import ArticleLogic from "@controllers/data-interaction/article/article-logic";
import ArticleLogicImpl from "@controllers/data-interaction/article/article-logic-impl";
import { articleDependencyValidator } from "@controllers/data-interaction/article/dependency-validator";
import UserLogic from "@controllers/data-interaction/user/user-logic";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import { User } from "@models/user/user";

const articleCreation = async () => {
  const commonWriter = new User();
  commonWriter.email = "email@gmail.com";
  commonWriter.firstName = "firstName";
  commonWriter.lastName = "lastName";
  commonWriter.password = "world123?>Ez";
  const TITLE = "This is a very big title";
  const content =
    "Do proident qui eu occaecat ut velit. Cillum ut esse minim cupidatat nisi. Cillum ullamco elit nisi sunt tempor id ad incididunt dolor aliquip quis laborum ex. Fugiat eu laborum ipsum adipisicing. Veniam ut sit ullamco eu veniam esse nisi amet pariatur sit elit proident ex quis. Ea officia aute pariatur laborum officia aliquip mollit quis laborum labore. Laboris eu labore dolore dolor irure incididunt officia est.";
  const userLogic: UserLogic = new UserLogicImpl();
  const user = await userLogic.createUser(commonWriter);
  const articleLogic: ArticleLogic = new ArticleLogicImpl();
  const article = await articleLogic.createArticle(
    user._id,
    TITLE,
    content,
    articleDependencyValidator
  );

  return { article, user };
};

export default articleCreation;
