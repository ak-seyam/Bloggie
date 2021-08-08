import CommentsLogic from "@controllers/data-interaction/comment/comments-logic";
import CommentsLogicImpl from "@controllers/data-interaction/comment/comments-logic-impl";
import { commentDependencyValidator } from "@controllers/data-interaction/comment/dependency-validator";
import { Comment } from "@models/article/comments";
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
});
