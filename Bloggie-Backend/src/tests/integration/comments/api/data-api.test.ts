import { login } from "@tests/integration/utils/login";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import articleCreation from "@tests/utils/articles/article-creation";
import axios from "axios";

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
});
