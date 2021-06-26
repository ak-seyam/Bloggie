import InvalidInputError from "@utils/database/user-input-error";
import { UserInputError } from "apollo-server";
import { AsyncFunction, ErrorsWrapper } from "@services/utils/errors-wrapper";

/**
 * a wrapper that replace with error with suitable GraphQL errors
 * @param originalError your error type
 */
export async function ApolloInvalidInputErrorWrapper(
  wrappedFunction: AsyncFunction
) {
  await ErrorsWrapper(InvalidInputError, UserInputError, wrappedFunction);
}
