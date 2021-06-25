import DatabaseInfoError from "@utils/database/database-info-error";

describe("Database info error test suite", () => {
  test("should result a resource and default message", () => {
    const resource = "Resource";
    const defaultMessage = "is not provided";
    try {
      throw new DatabaseInfoError(resource);
    } catch (e) {
      expect(e).toBeInstanceOf(DatabaseInfoError);
      expect(e.message).toEqual(`${resource}: ${defaultMessage}`);
    }
  });
  test("should result a resource with custom error message", () => {
    const resource = "Resource";
    const message = "message";
    try {
      throw new DatabaseInfoError(resource, message);
    } catch (e) {
      expect(e).toBeInstanceOf(DatabaseInfoError);
      expect(e.message).toEqual(`${resource}: ${message}`);
    }
  });
});
