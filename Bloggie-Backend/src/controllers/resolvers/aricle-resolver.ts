import ArticleLogic from "@services/data-interaction/article/article-logic";
import ArticleLogicImpl from "@services/data-interaction/article/article-logic-impl";
import { Article } from "@models/article/article";
import { Comment } from "@models/article/comments";
import { User, UserRole } from "@models/user/user";
import { DocumentType, Ref } from "@typegoose/typegoose";
import { ExpressContext, UserInputError } from "apollo-server-express";
import { ObjectID } from "bson";
import { Types } from "mongoose";
import {
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  Mutation,
  Args,
  ArgsType,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import isAuth from "./middleware/auth";
import PayloadContext from "@controllers/contexts/user-cotext";
import InvalidInputError from "@utils/api/user-input-error";
import { articleDependencyValidator } from "@services/data-interaction/article/dependency-validator";
import { apolloErrorsWrapper } from "@controllers/utils/graph-ql-resolvers-wrapper";
import handleNeitherAuthorNorAdmin from "./utils/author-or-admin";

@ObjectType()
export class DoneSuccessfully {
  @Field()
  success: boolean;
}

@ObjectType()
class ArticleWithComments implements Partial<Article> {
  @Field(() => String)
  articleId: Types.ObjectId;
  @Field(() => User)
  author: Ref<User>;
  @Field()
  content: string;
  @Field()
  title: string;
  @Field(() => [Comment])
  comments: Comment[];
}
@ArgsType()
class ArticleNewData {
  @Field()
  articleId: string;
  @Field({ nullable: true })
  content: string;
  @Field({ nullable: true })
  title: string;
}
@Resolver((of) => Article)
export default class ArticleResolver {
  async articlesWithComments(
    articles: DocumentType<Article>[],
    commentsLimit: number,
    commentsFrom: string | undefined,
    articleLogic: ArticleLogic
  ) {
    const articlesWithComments: ArticleWithComments[] = [];
    for (let a of articles) {
      const comments = await articleLogic.getCommentsForArticle(
        a._id,
        commentsLimit,
        commentsFrom ? Types.ObjectId(commentsFrom) : undefined
      );
      articlesWithComments.push({
        author: a.author,
        articleId: a.articleId,
        title: a.title,
        content: a.content,
        comments,
      });
    }
    return articlesWithComments;
  }

  // get article by title
  @Query(() => [ArticleWithComments])
  async article(
    @Arg("title") title: string,
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("from", { nullable: true }) from: string,
    @Arg("commentsFrom", { nullable: true }) commentsFrom: string,
    @Arg("commentsLimit", { nullable: true, defaultValue: 5 })
    commentsLimit: number
  ): Promise<ArticleWithComments[]> {
    return apolloErrorsWrapper<ArticleWithComments[]>(async () => {
      const articleLogic: ArticleLogic = new ArticleLogicImpl();
      const articles = await articleLogic.getArticlesByTitle(
        title,
        (limit = 5),
        from ? Types.ObjectId(from) : undefined
      );
      return this.articlesWithComments(
        articles,
        commentsLimit,
        commentsFrom,
        articleLogic
      );
    });
  }

  @Mutation(() => ArticleWithComments)
  @UseMiddleware(isAuth)
  async createArticle(
    @Arg("content") content: string,
    @Arg("title") title: string,
    @Arg("commentsLimit", { nullable: true }) commentsLimit: number,
    @Arg("commetsFrom", { nullable: true }) commentsFrom: string,
    @Ctx() context: PayloadContext
  ) {
    return apolloErrorsWrapper<ArticleWithComments>(async () => {
      const articleLogic: ArticleLogic = new ArticleLogicImpl();
      const article = new Article();
      article.content = content;
      article.title = title;
      const persistedArticle = await articleLogic.createArticle(
        Types.ObjectId(context.payload.iss),
        article,
        articleDependencyValidator
      );
      return (
        await this.articlesWithComments(
          [persistedArticle],
          commentsLimit,
          commentsFrom,
          articleLogic
        )
      )[0];
    });
  }

  @Mutation(() => ArticleWithComments)
  @UseMiddleware(isAuth)
  async editArticle(
    @Args() newData: ArticleNewData,
    @Arg("commentsFrom", { nullable: true }) commentsFrom: string,
    @Arg("commentsLimit", { nullable: true, defaultValue: 5 })
    commentsLimit: number,
    @Ctx() context: ExpressContext & PayloadContext
  ) {
    return apolloErrorsWrapper<ArticleWithComments>(async () => {
      const articleLogic: ArticleLogic = new ArticleLogicImpl();
      const article = await articleLogic.getArticleById(
        Types.ObjectId(newData.articleId)
      );
      if (!article) {
        throw new InvalidInputError("Invalid article id");
      }
      // make article edit only possible for admins or the original authors
      handleNeitherAuthorNorAdmin(context, (article.author as User).userId);
      const newArticleData = new Article();
      if (newData.title) newArticleData.title = newData.title;
      if (newData.content) newArticleData.content = newData.content;

      const articleAfterUpdate = await articleLogic.updateArticle(
        Types.ObjectId(newData.articleId),
        newArticleData
      );
      return (
        await this.articlesWithComments(
          [articleAfterUpdate],
          commentsLimit,
          commentsFrom,
          articleLogic
        )
      )[0];
    });
  }

  @Mutation(() => DoneSuccessfully)
  @UseMiddleware(isAuth)
  async deleteArticle(
    @Arg("articleId") articleId: string,
    @Ctx() context: PayloadContext
  ): Promise<DoneSuccessfully> {
    return apolloErrorsWrapper<DoneSuccessfully>(async () => {
      const articleLogic: ArticleLogic = new ArticleLogicImpl();
      const article = await articleLogic.getArticleById(
        Types.ObjectId(articleId)
      );
      if (!article) {
        throw new InvalidInputError("Invalid article id");
      }
      // make article delete only possible for admins or the original authors
      handleNeitherAuthorNorAdmin(context, (article.author as User).userId);
      try {
        await articleLogic.deleteArticle(Types.ObjectId(articleId));
        return {
          success: true,
        };
      } catch (e) {
        throw e;
      }
    });
  }
}
