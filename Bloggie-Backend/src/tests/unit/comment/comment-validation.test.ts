import CommentModel from "@models/article/comments";
import UserModel from "@models/user/user";

describe("Comment validation test suit", () => {
  const testLogic = async (content: string, correct: boolean = false) => {
    const author = new UserModel();
    author.firstName = "firstname";
    author.lastName = "lastname";
    author.password = "asd@!ADS13";
    const comment = new CommentModel();
    comment.content = content;
    comment.author = author;
    let val = false;
    try {
      await comment.validate();
      val = true;
    } catch (e) {}
    if (correct) expect(val).toBeTruthy();
    else expect(val).toBeFalsy();
  };
  test("should approve valid length comment", async () => {
    await testLogic("this is a valid comment", true);
  });
  test("should reject very short length comment", async () => {
    await testLogic(".");
  });
});
