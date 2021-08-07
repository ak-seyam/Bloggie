import ArticleLogic from "@controllers/data-interaction/article/article-logic";
import ArticleLogicImpl from "@controllers/data-interaction/article/article-logic-impl";
import { Article } from "@models/article/article";
import { Resolver, Query, Arg } from "type-graphql";

@Resolver((of) => Article)
export default class ArticleResolver {
  // get article by title
  @Query(() => [Article])
  async article(@Arg("title") title: string): Promise<Article[]> {
    const articleLogic: ArticleLogic = new ArticleLogicImpl();
    return articleLogic.getArticlesByTitle(title);
  }
}
