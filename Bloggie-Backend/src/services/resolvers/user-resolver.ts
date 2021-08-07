import { Max, Min } from "class-validator";
import {
  Resolver,
  Mutation,
  ArgsType,
  Field,
  Int,
  Args,
  InputType,
  Query,
  ObjectType,
  Ctx,
  UseMiddleware,
  Arg,
} from "type-graphql";
import { ObjectId } from "mongodb";
import { User, UserRole } from "@models/user/user";
import { Article } from "@models/article/article";
import UserLogic from "@controllers/data-interaction/user/user-logic";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import { DocumentType } from "@typegoose/typegoose";
import { apolloErrorsWrapper } from "@services/utils/graph-ql-resolvers-wrapper";
import {
  signAccessToken,
  signRefreshToken,
} from "@services/utils/JWT-providers";
import { ExpressContext } from "apollo-server-express";
import PasswordHash from "@utils/password/password-hash";
import BcryptPasswordHash from "@utils/password/bcrypt-password-hash";
import { InvalidAuthenticationStateError } from "@utils/api/access-errors";
import { Response } from "express";
import { MongooseDocument, Types } from "mongoose";
import isAuth from "./middleware/auth";
import PayloadContext from "@services/contexts/user-cotext";

@ObjectType()
class UserContent implements Partial<User> {
  @Field()
  email: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field(() => [Article])
  articles: Array<Article>;
}

@ArgsType()
class LoginArguments {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ArgsType()
class UserProperties implements Partial<User> {
  @Field()
  email: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  password: string;
}

@ObjectType()
class WhatIsMyIdRes {
  @Field()
  id: string;
}

@ObjectType()
class RegisterResponse {
  @Field()
  success: boolean;
  @Field({ nullable: true })
  accessToken?: string;
}

export const tokenGeneration = (
  id: MongooseDocument["_id"],
  role: UserRole,
  tokenVer: number,
  res: Response
) => {
  res.cookie(
    "rid",
    signRefreshToken({
      iss: id,
      role: role,
      tokenVer: tokenVer,
    }),
    {
      path: "/",
      httpOnly: true,
    }
  );
  return {
    success: true,
    accessToken: signAccessToken({
      iss: id,
      role: role,
      tokenVer: tokenVer,
    }),
  };
};

@Resolver((of) => User)
export default class UserResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Args() { email, firstName, lastName, password }: UserProperties,
    @Ctx() context: ExpressContext
  ): Promise<RegisterResponse> {
    return apolloErrorsWrapper<RegisterResponse>(async () => {
      const userLogic: UserLogic = new UserLogicImpl();
      const _newUser = new User();
      _newUser.email = email;
      _newUser.firstName = firstName;
      _newUser.lastName = lastName;
      _newUser.password = password;
      const newUser = await userLogic.createUser(_newUser);
      return tokenGeneration(
        newUser._id,
        newUser.role,
        newUser.tokenVer,
        context.res
      );
    });
  }

  @Mutation(() => RegisterResponse)
  async login(
    @Args() { email, password }: LoginArguments,
    @Ctx() context: ExpressContext
  ) {
    return apolloErrorsWrapper<RegisterResponse>(async () => {
      // get user by email
      const userLogic: UserLogic = new UserLogicImpl();
      const user = await userLogic.getUserByEmail(email);
      if (!user) {
        throw new InvalidAuthenticationStateError("Email not found");
      }
      if (!user.password) {
        throw new InvalidAuthenticationStateError(
          "user doesn't have a password it has used another oauth provider"
        );
      }
      const passwordHashService: PasswordHash = new BcryptPasswordHash();
      if (!passwordHashService.validate(password, user.password)) {
        throw new InvalidAuthenticationStateError("Invalid password");
      }
      return tokenGeneration(user._id, user.role, user.tokenVer, context.res);
    });
  }

  @Query(() => WhatIsMyIdRes)
  @UseMiddleware(isAuth)
  whatIsMyId(@Ctx() context: PayloadContext): WhatIsMyIdRes {
    return {
      id: context.payload.iss!,
    };
  }
  @Query(() => UserContent)
  async user(
    @Arg("id") id: string,
    @Arg("articles_limit", { nullable: true, defaultValue: 5 }) limit: number,
    @Arg("articles_starter_id", { nullable: true }) articlesStarterId: string
  ): Promise<UserContent> {
    const userLogic: UserLogic = new UserLogicImpl();
    const user = await userLogic.getUserById(Types.ObjectId(id));
    console.log("the user is", user);
    const articles = await userLogic.getArticlesByUser(
      user._id,
      limit,
      articlesStarterId ? Types.ObjectId(articlesStarterId) : undefined
    );
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      articles,
    };
  }
}
