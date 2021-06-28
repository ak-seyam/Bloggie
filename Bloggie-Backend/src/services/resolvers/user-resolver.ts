import { Max, Min } from "class-validator";
import {
  Resolver,
  Query,
  Mutation,
  Authorized,
  ArgsType,
  Field,
  Int,
  Args,
  InputType,
} from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "@models/user/user";
import { Article } from "@models/article/article";

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

@InputType({ description: "New user arguments" })
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
  async login() {}

  @Query(() => User)
  @Authorized()
  async me() {}

  @Query(() => [Article]!)
  @Authorized()
  async getArticlesForUser(
    @Args() { from, limit, fromAsObjectId }: GetArticlesArgs
  ) {}

  @Mutation(() => User)
  async register(
    @Args() { email, firstName, lastName, password }: NewUserArguments
  ) {}
}
