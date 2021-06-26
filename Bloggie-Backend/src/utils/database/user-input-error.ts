export default class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserInputError";
  }
}
