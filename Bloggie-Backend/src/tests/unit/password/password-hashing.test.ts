import BcryptPasswordHash from "@utils/password/bcrypt-password-hash";
import PasswordHash from "@utils/password/password-hash";

describe("Password hashing test suite", () => {
  test("should it should hash and compare passwords correctly", async () => {
    const password = "Aasd!13546.";
    const passwordHash: PasswordHash = new BcryptPasswordHash();
    const hashed = await passwordHash.hash(password);
    const valid = await passwordHash.validate(password, hashed);
    expect(valid).toBeTruthy();
  });
});
