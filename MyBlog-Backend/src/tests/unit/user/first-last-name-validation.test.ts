import UserModel from "@models/user/user";

describe("First and last name validation", () => {
  const generateUser = (firstName: string, lastName: string) => {
    const user = new UserModel();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = "valid@email.com";
    user.password = "wasdw!Wasd132";
    return user;
  };
  const testLogic = async (
    firstName: string,
    lastName: string,
    correct: boolean = false
  ) => {
    let val = false;
    try {
      await generateUser(firstName, lastName).validate();
      val = true;
    } catch (e) {}
    if (correct) expect(val).toBeTruthy();
    else expect(val).toBeFalsy();
  };

  test("should approve valid first name", async () => {
    await testLogic("ahmed", "khaled", true);
  });

  test("should reject invalid first name (too short)", async () => {
    await testLogic("a", "khaled");
  });

  test("should reject invalid first name (contain non alphabetic)", async () => {
    await testLogic("aasd789", "khaled");
  });

  test("should approve valid last name", async () => {
    await testLogic("kamal", "khaled", true);
  });

  test("should approve invalid last name (too short)", async () => {
    await testLogic("kamal", "k");
  });

  test("should approve invalid last name (contain non alphapictic)", async () => {
    await testLogic("kamal", "k123456");
  });
});
