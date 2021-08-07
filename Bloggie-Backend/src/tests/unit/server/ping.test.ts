import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import axios from "axios";

describe("check that the server is running", () => {
  const PORT = setupTeardownGraphQL_API();
  test("should response with pong to ping", async () => {
    const data = await axios
      .post("http://localhost:" + PORT + "/graphql", {
        query: `
			query {
				ping	
			}  
		  `,
      })
      .then((res) => res.data)
      .then((content) => content.data);
    expect(data).toBeTruthy();
    expect(data["ping"]).toEqual("pong");
  });
});
