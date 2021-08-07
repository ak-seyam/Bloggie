import PayloadContext from "@services/contexts/user-cotext";
import { verifyAccessToken } from "@services/utils/JWT-providers";
import InvalidAuthenticationStateError from "@utils/api/access-errors";
import { ExpressContext } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

const isAuth: MiddlewareFn<ExpressContext & PayloadContext> = (
  { context },
  next
) => {
  if (!context.req.headers.authorization) {
    throw new InvalidAuthenticationStateError(
      "authorization header is not defined"
    );
  }
  const accessToken = context.req.headers.authorization?.split(" ")[1];
  // check if the token is correct
  try {
    const payload = verifyAccessToken(accessToken);
    context.payload = payload;
  } catch (e) {
    if (e.message) {
      throw new InvalidAuthenticationStateError(e.message);
    }
    console.error(e);
  }
  // get the user from the database
  return next();
};

export default isAuth;
