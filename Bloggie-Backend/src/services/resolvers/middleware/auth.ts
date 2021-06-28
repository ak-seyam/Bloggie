import UserContext from "@services/contexts/user-cotext";
import { MiddlewareFn } from "type-graphql";

const isAuth: MiddlewareFn<UserContext> = ({ context }, next) => {
  // check if the jwt is correct
  // get the user from the database
  return next();
};

export default isAuth;
