import ArticleModel from "@models/article/article";
import CommentModel from "@models/article/comments";
import UserModel from "@models/user/user";

describe("Comment validation test suit", () => {
  const testLogic = async (content: string, correct: boolean = false) => {
    const author = new UserModel();
    author.firstName = "firstname";
    author.lastName = "lastname";
    author.password = "asd@!ADS13";
    const article = new ArticleModel();
    article.title = "very long as whatever";
    article.content =
      "Ullamco reprehenderit incididunt Lorem ea aute dolor quis. Aute consectetur aliquip proident consectetur in ea elit deserunt cupidatat proident officia ex commodo magna. Dolore sit consequat Lorem nisi. Enim reprehenderit aliquip cillum in labore. Adipisicing sit est non aute ullamco tempor ad occaecat dolore deserunt consectetur consectetur laboris commodo. Proident laboris minim aliquip tempor.";
    const comment = new CommentModel();
    comment.content = content;
    comment.author = author;
    comment.article = article;
    let val = false;
    try {
      await comment.validate();
      val = true;
    } catch (e) {
      if (correct) console.log(e);
    }
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
