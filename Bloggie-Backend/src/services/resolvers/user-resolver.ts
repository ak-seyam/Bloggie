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
} from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "@models/user/user";
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

@ArgsType()
class GetArticlesArgs {
  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit: number = 10;

  @Field(() => String, { nullable: true })
  from: string;

  get fromAsObjectId() {
    if (!this.from) return undefined;
    return new ObjectId(this.from);
  }
}

@ArgsType()
class NewUserArguments implements Partial<User> {
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
class RegisterResponse {
  @Field()
  success: boolean;
  @Field({ nullable: true })
  accessToken?: string;
}

@Resolver((of) => User)
export default class UserResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Args() { email, firstName, lastName, password }: NewUserArguments,
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
      context.res.cookie(
        "rid",
        signRefreshToken({
          iss: newUser._id,
          role: newUser.role,
          tokenVer: newUser.tokenVer,
        }),
        {
          path: "/",
          httpOnly: true,
        }
      );
      return {
        success: true,
        accessToken: signAccessToken({
          iss: newUser._id,
          role: newUser.role,
          tokenVer: newUser.tokenVer,
        }),
      };
    });
  }
}
