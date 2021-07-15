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
} from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "@models/user/user";
import { Article } from "@models/article/article";
import UserLogic from "@controllers/data-interaction/user/user-logic";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import { DocumentType } from "@typegoose/typegoose";
import { apolloInvalidInputErrorWrapper } from "@services/utils/graph-ql-resolvers-wrapper";

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

@Resolver((of) => User)
export default class UserResolver {
  @Mutation(() => User)
  async register(
    @Args() { email, firstName, lastName, password }: NewUserArguments
  ): Promise<DocumentType<User>> {
    return apolloInvalidInputErrorWrapper(async () => {
      const userLogic: UserLogic = new UserLogicImpl();
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = password;
      return await userLogic.createUser(newUser);
    });
  }
}
