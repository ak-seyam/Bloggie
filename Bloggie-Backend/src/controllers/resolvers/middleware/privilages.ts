import { UserRole } from "@models/user/user";
import PayloadContext from "@services/contexts/user-cotext";
import { InvalidAuthorizationRoleError } from "@utils/api/access-errors";
import { MiddlewareFn } from "type-graphql";

export const isAdmin: MiddlewareFn<PayloadContext> = ({ context }, next) => {
  if (context.payload.role !== UserRole.ADMIN) {
    throw new InvalidAuthorizationRoleError("role is not admin");
  }
  return next();
};
