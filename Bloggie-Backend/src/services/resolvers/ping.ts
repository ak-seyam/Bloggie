import { Query } from "type-graphql";

export default class PingResolver {
  @Query(() => String)
  ping() {
    return "pong";
  }
}
