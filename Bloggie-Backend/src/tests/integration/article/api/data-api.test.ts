import CommentsLogic from "@controllers/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";
import UserLogic from "@controllers/data-interaction/user/user-logic";
import UserLogicImpl from "@controllers/data-interaction/user/user-logic-impl";
import { Comment } from "@models/article/comments";
import { User } from "@models/user/user";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import articleCreation from "@tests/utils/articles/article-creation";
import axios from "axios";

describe("Article data api test suite", () => {
  const PORT = setupTeardownGraphQL_API();
  test("should get article and comments successfully", async () => {
    const { article, user } = await articleCreation();
    // create comment
    const commentsLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "Yay! this is the best article ever!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentsLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const articleRes = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
				query getArticle {
				  article(title: "${article.title}") {
				    title,
						author {
				      email
				    }    
				    comments {
    				  content
    				}
				  }
				}	
			`,
      })
      .then((res) => res.data)
      .then((content) => content.data)
      .then((data) => data.article);
    expect(Array.isArray(articleRes)).toBeTruthy();
    expect(articleRes[0].title).toBeTruthy();
    expect(articleRes[0].author.email).toEqual(user.email);
    expect(Array.isArray(articleRes[0].comments)).toBeTruthy();
    expect(articleRes[0].comments[0].content).toEqual(comment.content);
  });
  test("should create a new article", async () => {
    const content =
      "Ipsum dolore nostrud amet mollit. Anim voluptate voluptate exercitation incididunt labore esse consectetur consequat Lorem. Excepteur officia dolor aliquip velit. Sit excepteur est occaecat aute. Adipisicing ullamco sit aute duis ut non.";
    const title = "best title ever?";
    // create new user
    const [res, _] = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
				mutation reg {
					register(
						email: "email@gmail.com"
						firstName: "abdo"
						lastName: "khaled"
						password: "A0@!asdcmxzk"
					) {
						accessToken,
						success
					}
				}	
			`,
      })
      .then((response) => [response.data, response.headers])
      .then(([data, headers]) => [data.data, headers])
      .then(([content, headers]) => [content.register, headers]);
    const accessToken = res.accessToken;
    const articleData = await axios
      .post(
        `http://localhost:${PORT}/graphql`,
        {
          query: `
				mutation newArt {
					createArticle(title: "${title}", content: "${content}") {
						title,
						content
					}
				}	
			`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => res.data)
      .then((content) => content.data.createArticle);
    expect(articleData.title).toEqual(title);
    expect(articleData.content).toEqual(content);
  });

  test("should edit article with the same author", async () => {
    const { article, user } = await articleCreation();
    const res = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${user.email}"
			    password: "${user.password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);
    const accessToken = res.data.login.accessToken;
    console.log("the access token is?", accessToken);
    const newContent = `Nisi cillum proident cupidatat sint voluptate velit reprehenderit consectetur excepteur eiusmod reprehenderit. In deserunt irure proident occaecat sunt velit labore in id tempor labore ex aliquip. Ut adipisicing voluptate ea velit id proident ut consequat nulla. Ex consequat eiusmod aliqua cillum labore occaecat. Aliqua elit culpa tempor mollit deserunt aliquip. Ipsum pariatur exercitation occaecat est amet adipisicing sit fugiat tempor ex dolore enim laborum. Ea amet non consequat magna ea commodo duis tempor. Eiusmod labore tempor proident deserunt commodo est cillum proident. Ipsum deserunt consequat fugiat dolor. Ut cillum aute nulla aliquip amet. Fugiat do et aute cupidatat irure et proident incididunt in magna qui.`;
    const response = await axios
      .post(
        `http://localhost:${PORT}/graphql`,
        {
          query: `
					mutation edit {
						editArticle (articleId: "${article.id}", content: "${newContent}") {
							content,
							title
						}
					}
				`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => res.data)
      .then((content) => {
        return content.data.editArticle;
      });
    expect(response.content).toEqual(newContent);
    expect(response.title).toEqual(article.title);
  });

  test("should reject editing article by different user", async () => {
    const { article, user } = await articleCreation();
    let anotherUser = new User();
    anotherUser.email = "right@gmail.com";
    anotherUser.password = "WCorrectXD_123$#";
    anotherUser.firstName = "firstname";
    anotherUser.lastName = "lastname";
    const userLogic: UserLogic = new UserLogicImpl();
    anotherUser = await userLogic.createUser(anotherUser);
    anotherUser.password = "WCorrectXD_123$#";

    // login with another user

    const res = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${anotherUser.email}"
			    password: "${anotherUser.password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);
    const accessToken = res.data.login.accessToken;

    const newContent = `Nisi cillum proident cupidatat sint voluptate velit reprehenderit consectetur excepteur eiusmod reprehenderit. In deserunt irure proident occaecat sunt velit labore in id tempor labore ex aliquip. Ut adipisicing voluptate ea velit id proident ut consequat nulla. Ex consequat eiusmod aliqua cillum labore occaecat. Aliqua elit culpa tempor mollit deserunt aliquip. Ipsum pariatur exercitation occaecat est amet adipisicing sit fugiat tempor ex dolore enim laborum. Ea amet non consequat magna ea commodo duis tempor. Eiusmod labore tempor proident deserunt commodo est cillum proident. Ipsum deserunt consequat fugiat dolor. Ut cillum aute nulla aliquip amet. Fugiat do et aute cupidatat irure et proident incididunt in magna qui.`;
    const errors = await axios
      .post(
        `http://localhost:${PORT}/graphql`,
        {
          query: `
					mutation edit {
						editArticle (articleId: "${article.id}", content: "${newContent}") {
							content
						}
					}
				`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => res.data)
      .then((data) => data.errors);
    expect(errors[0].message.indexOf("Unauthorized")).not.toEqual(-1);
  });
  test.todo("should delete successfully");
});
