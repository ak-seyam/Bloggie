import { login } from "@tests/integration/utils/login";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import articleCreation from "@tests/utils/articles/article-creation";
import axios from "axios";
import CommentsLogic from "@controllers/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";
import { Comment } from "@models/article/comments";

describe("Comments data API test suite", () => {
  const PORT = setupTeardownGraphQL_API();
  const graphQLUrl = `http://localhost:${PORT}/graphql`;
  test("should create comment successfully", async () => {
    const commentContent = "Great content";
    const { article, user } = await articleCreation();
    // first author must login
    const accessToken = await login(graphQLUrl, user.email, user.password!);
    const res = await axios
      .post(
        graphQLUrl,
        {
          query: `
				mutation commentCreation {
					createComment(articleId: "${article._id}", userId: "${user._id}", content: "${commentContent}") {
						content,
						date
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
      .then((content) => content.data.createComment);
    expect(res.content).toEqual(commentContent);
    expect(res.date).toBeTruthy();
  });

  test("should edit comment successfully", async () => {
    const { article, user } = await articleCreation();
    const commentLogic: CommentsLogic = new CommentsLogicImpl();
    const content = "the best thing in this world!";
    const tempComment = new Comment();
    tempComment.content = content;
    const comment = await commentLogic.addComment(
      article._id,
      user._id,
      tempComment,
      commentDependencyValidator
    );
    const commentContent = "yoyoyoyoyoyoyoyoyo";
    const accessToken = await login(graphQLUrl, user.email, user.password!);
    const res = await axios
      .post(
        graphQLUrl,
        {
          query: `
				mutation commentEdit {
					editComment(content: "${commentContent}", commentId: "${comment._id}") {
						date,
						content,
						commentId
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
      .then((content) => content.data.editComment);
    expect(res.date).not.toEqual(comment.date);
    expect(res.content).toEqual(commentContent);
		// to fix serialize to the same string I've used JSON.stringify to serialize
    expect(JSON.stringify(res.commentId)).toEqual(
      JSON.stringify(comment.commentId)
    );
  });
	test.todo('should reject updating comment with by different author', async () => {
		
	})
	
});
