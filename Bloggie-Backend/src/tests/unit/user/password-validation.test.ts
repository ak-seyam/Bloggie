import UserModel from "@models/user/user";

describe("password validation tests", () => {
  const generateUser = (
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const user = new UserModel();
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password;
    user.email = "requiredEmail@bruh.com";
    return user;
  };
  const testLogic = async (
    password: string,
    correctPassword: boolean = false,
    firstName: string = "first",
    lastName = "last"
  ) => {
    let val = false;
    try {
      await generateUser(password, firstName, lastName).validate();
      val = true;
    } catch (e) {}
    if (correctPassword) expect(val).toBeTruthy();
    else expect(val).toBeFalsy();
  };

  test("should validate very strong password", async () => {
    await testLogic("Aasd!_123456", true);
  });

  test("should invalidate only lowercase password", async () => {
    await testLogic("asdasdasduru");
  });

  test("should invalidate only uppercase passwords", async () => {
    await testLogic("ASDASDASDURU");
  });

  test("should invalidate password with all numbers", async () => {
    await testLogic("111111111111");
  });

  test("should invalidate with all special characters", async () => {
    await testLogic("________________");
  });

  test("should invalidate short passwords", async () => {
    await testLogic("a78!");
  });

  test("should invalidate passwords that has first name", async () => {
    await testLogic("_Asdfirst789", false, "first");
  });

  test("should invalidate passwords that has last name", async () => {
    await testLogic("_Asdfirst789last", false, "notfirst", "last");
  });
});
