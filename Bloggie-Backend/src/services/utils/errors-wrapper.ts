export type AsyncFunction<T> = () => Promise<T>;

export async function errorsWrapper<T>(
  oldErrorClass: any,
  newError: any,
  wrappedFunction: AsyncFunction<T>
) {
  try {
    return await wrappedFunction();
  } catch (e) {
    if (e instanceof oldErrorClass) {
      throw new newError(e.message);
    }
    throw e;
  }
}
