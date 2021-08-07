export default class InvalidAuthenticationStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}
