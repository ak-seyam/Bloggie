import InvalidInputError from "@utils/api/user-input-error";
import { AuthenticationError, UserInputError } from "apollo-server";
import { AsyncFunction, errorsWrapper } from "@services/utils/errors-wrapper";
import InvalidAuthenticationStateError from "@utils/api/access-errors";

/**
 * @description a wrapper that replace with error with suitable GraphQL errors
 * @param originalError your error type
 */
async function apolloInvalidInputErrorWrapper<T>(
  wrappedFunction: AsyncFunction<T>
) {
  return await errorsWrapper(
    InvalidInputError,
    UserInputError,
    wrappedFunction
  );
}

/**
 * @description a wrapper against the authentication errors in our logic that replace it with a valid GraphQL error
 * @param wrappedFunction
 * @returns
 */
function apolloUnauthenticatedWrapper<T>(wrappedFunction: AsyncFunction<T>) {
  return errorsWrapper(
    InvalidAuthenticationStateError,
    AuthenticationError,
    wrappedFunction
  );
}
/**
 * @description a wrapper used to wrap apollo logic functions
 * @param wrappedFunction the logic function that needs to be caught for error
 */
export async function apolloErrorsWrapper<T>(
  wrappedFunction: AsyncFunction<T>
) {
  // using decorator design pattern we can include as much wrappers as we can here 
	// editing guide for my future self
	// replace the wrapped function with another wrapper that takes the wrapped function
  return await apolloUnauthenticatedWrapper<T>(
    await apolloInvalidInputErrorWrapper<T>(wrappedFunction)
  )();
}
