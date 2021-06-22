import UserModel from "@models/user/user";

describe("Email is correct suit", () => {
  const generateUser = (email: string) => {
    const user = new UserModel();
    user.email = email;
    user.firstName = "first";
    user.lastName = "last";
    user.password = "weq_Ac123><@";
    return user;
  };
  const testLogic = async (email: string, correctEmail: boolean = false) => {
    let val = false;
    try {
      await generateUser(email).validate();
      val = true;
    } catch (e) {
      val = false;
    }
    if (correctEmail) expect(val).toBeTruthy();
    else expect(val).toBeFalsy();
  };
  test("should reject invalid email no @ or .xxx", async () => {
    await testLogic("email");
  });
  test("should accept valid email", async () => {
    await testLogic("email@gmail.com", true);
  });
  test("should reject invalid email special character in domain", async () => {
    await testLogic("email@g!mail.com");
  });
  test("should reject invalid email no address", async () => {
    await testLogic("@gmail.com");
  });
});
