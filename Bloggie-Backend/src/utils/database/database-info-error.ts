export default class DatabaseInfoError extends Error {
  constructor(resource: string, message: string = "is not provided") {
    super(`${resource}: ${message}`);
    this.name = "DatabaseInfoError";
  }
}
