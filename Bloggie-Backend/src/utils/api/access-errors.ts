export class InvalidAuthenticationStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAuthenticationStateError";
  }
}

export class InvalidAuthorizationRoleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAuthorizationRoleError";
  }
}
