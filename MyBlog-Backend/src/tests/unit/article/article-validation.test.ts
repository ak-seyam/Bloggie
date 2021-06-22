import ArticleModel from "@models/article/article";
import UserModel from "@models/user/user";

describe("Article validation suit", () => {
  const author = new UserModel();
  author.firstName = "firstname";
  author.lastName = "lastname";
  author.password = "asd@!ADS13";

  const generateArticle = (title: string, content: string) => {
    const article = new ArticleModel();
    article.author = author;
    article.title = title;
    article.content = content;
    return article;
  };

  const testLogic = async (
    title: string,
    content: string,
    correct: boolean = false
  ) => {
    let val = false;
    try {
      await generateArticle(title, content).validate();
      val = true;
    } catch (e) {}
    if (correct) expect(val).toBeTruthy();
    else expect(val).toBeFalsy();
  };

  test("should accept valid article", async () => {
    await testLogic(
      "a valid title",
      "Labore reprehenderit ad consequat culpa esse laboris adipisicing aute elit excepteur duis consequat non. Nisi excepteur incididunt ullamco dolore aliquip ipsum veniam. Irure minim aliquip ea nulla. Reprehenderit labore tempor aliquip commodo incididunt sit est est veniam ea cupidatat est velit. Anim minim dolore esse et aute.",
      true
    );
  });
  test("should reject invalid title", async () => {
    await testLogic(
      "bad",
      "Labore reprehenderit ad consequat culpa esse laboris adipisicing aute elit excepteur duis consequat non. Nisi excepteur incididunt ullamco dolore aliquip ipsum veniam. Irure minim aliquip ea nulla. Reprehenderit labore tempor aliquip commodo incididunt sit est est veniam ea cupidatat est velit. Anim minim dolore esse et aute."
    );
  });
  test("should reject very short articles", async () => {
    await testLogic("good title", "bad content");
  });
});
