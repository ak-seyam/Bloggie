import { UserRole } from "@models/user/user";
import PayloadContext from "@services/contexts/user-cotext";
import { ExpressContext } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

const isAdmin : MiddlewareFn<PayloadContext> = ({context}, next) => {
  // if (context.payload.role !== UserRole.ADMIN)
		
	return next()
}