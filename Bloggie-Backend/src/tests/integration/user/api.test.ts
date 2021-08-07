import { verifyAccessToken } from "@services/utils/JWT-providers";
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
      .then((res) => [res.data, res.headers]);
    console.log(res);
    expect(res.data).toBeTruthy();
    expect(res.data.register).toBeTruthy();
    expect(res.data.register.success).toBeTruthy();
    expect(res.data.register.accessToken).toBeTruthy();
    expect(
      verifyAccessToken(res.data.register.accessToken.split("Bearer ")[1])
    ).toBeTruthy();
  });
});
