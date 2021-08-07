import {
  verifyAccessToken,
  verifyRefreshToken,
} from "@services/utils/JWT-providers";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import axios from "axios";

describe("User API Test suite", () => {
  const PORT = setupTeardownGraphQL_API();
  test("should create user successfully", async () => {
    const [res, headers] = await axios
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
      .then((response) => [response.data, response.headers]);
    expect(res.data).toBeTruthy();
    expect(res.data.register).toBeTruthy();
    expect(res.data.register.success).toBeTruthy();
    expect(res.data.register.accessToken).toBeTruthy();
    expect(
      verifyAccessToken(res.data.register.accessToken)
    ).toBeTruthy();
    // checking the headers
    const [rid, path, httpOnly] = headers["set-cookie"][0].split("; ");
    expect(verifyRefreshToken(rid.split("rid=")[1])).toBeTruthy();
    expect(path.split("=")[1]).toEqual("/");
    expect(httpOnly.toUpperCase()).toEqual("HTTPONLY");
  });
  test("should reject invalid user fields", async () => {
    const data = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation registerInvalid {
			  register(
			    email: "eail@b!.b"
			    firstName: "asd"
			    lastName: "wadswasd"
			    password: "wsS0!123CSCS787"
			  ) {
			    accessToken
			  }
			}
			`,
      })
      .then((res) => res.data);

    expect(data.errors).toBeTruthy();
    expect(data.errors[0].message.indexOf("email")).not.toEqual(-1);
  });
});
