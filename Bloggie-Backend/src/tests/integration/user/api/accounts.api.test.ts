import {
  verifyAccessToken,
  verifyRefreshToken,
} from "@services/utils/JWT-providers";
import setupTeardownGraphQL_API from "@tests/utils/api/setup-teardown";
import axios from "axios";
import UserLogic from "@services/data-interaction/user/user-logic";
import UserLogicImpl from "@services/data-interaction/user/user-logic-impl";
import { User, UserRole } from "@models/user/user";

describe("User Accounts API Test suite", () => {
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
    expect(await verifyAccessToken(res.data.register.accessToken)).toBeTruthy();
    // checking the headers
    const [rid, path, httpOnly] = headers["set-cookie"][0].split("; ");
    expect(await verifyRefreshToken(rid.split("rid=")[1])).toBeTruthy();
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
  test("should login successfully", async () => {
    const email = "valid@email.com";
    const password = "Valid123@&PA$word";
    // create the user
    const userLogic: UserLogic = new UserLogicImpl();
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.isThirdParty = false;
    newUser.role = UserRole.MEMBER;
    newUser.tokenVer = 1;
    await userLogic.createUser(newUser);
    // login
    const [res, headers] = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${email}"
			    password: "${password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => [res.data, res.headers]);
    expect(res.data).toBeTruthy();
    expect(res.data.login).toBeTruthy();
    expect(res.data.login.success).toBeTruthy();
    expect(res.data.login.accessToken).toBeTruthy();
    expect(await verifyAccessToken(res.data.login.accessToken)).toBeTruthy();
    // checking the headers
    const [rid, path, httpOnly] = headers["set-cookie"][0].split("; ");
    expect(await verifyRefreshToken(rid.split("rid=")[1])).toBeTruthy();
    expect(path.split("=")[1]).toEqual("/");
    expect(httpOnly.toUpperCase()).toEqual("HTTPONLY");
  });
  test("should refuse to login user with third party creds", async () => {
    const email = "valid@email.com";
    const password = "Valid123@&PA$word";
    // create the user
    const userLogic: UserLogic = new UserLogicImpl();
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.isThirdParty = true;
    newUser.role = UserRole.MEMBER;
    newUser.tokenVer = 1;
    await userLogic.createUser(newUser);
    const data = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${email}"
			    password: "${password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);

    expect(data.errors).toBeTruthy();
    expect(data.errors[0].message.indexOf("another")).not.toEqual(-1);
  });
  test("should result valid error when email is not correct", async () => {
    const data = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "fake@gmail.com"
			    password: "2@wasdw$989djaskd_"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);
    console.log(data.errors[0].message);
    expect(data.errors).toBeTruthy();
    expect(data.errors[0].message.indexOf("Email not found")).not.toEqual(-1);
  });

  test("[what is my id] should get user id", async () => {
    const email = "valid@email.com";
    const password = "Valid123@&PA$word";
    // create the user
    const userLogic: UserLogic = new UserLogicImpl();
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.isThirdParty = false;
    newUser.role = UserRole.MEMBER;
    newUser.tokenVer = 1;
    await userLogic.createUser(newUser);

    const res = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${email}"
			    password: "${password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);
    const accessToken = res.data.login.accessToken;
    const whoAmIRes = await axios
      .post(
        `http://localhost:${PORT}/graphql`,
        {
          query: `
			query wimi {
				whatIsMyId {
					id
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
      .then((content) => content.data);
    expect(whoAmIRes.whatIsMyId.id).toBeTruthy();
  });
  test("[what is my id] should reject requests with no authorization header", async () => {
    const whoAmIRes = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			query wimi {
				whatIsMyId {
					id
				}
			}
		`,
      })
      .then((res) => res.data);
    console.log("message", whoAmIRes.errors[0].message);
    expect(
      whoAmIRes.errors[0].message.indexOf("authorization header is not defined")
    ).not.toEqual(-1);
  });
  test("[what is my id] should result invalid token when it is invalid", async () => {
    const email = "valid@email.com";
    const password = "Valid123@&PA$word";
    // create the user
    const userLogic: UserLogic = new UserLogicImpl();
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.isThirdParty = false;
    newUser.role = UserRole.MEMBER;
    newUser.tokenVer = 1;
    await userLogic.createUser(newUser);

    const res = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${email}"
			    password: "${password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => res.data);
    const accessToken = res.data.login.accessToken;
    const whoAmIRes = await axios
      .post(
        `http://localhost:${PORT}/graphql`,
        {
          query: `
			query wimi {
				whatIsMyId {
					id
				}
			}
		`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}sadjalksdalkj`,
          },
        }
      )
      .then((res) => res.data);
    expect(whoAmIRes.errors[0].message.indexOf("Invalid token")).not.toEqual(
      -1
    );
  });
  test("should refresh token successfully", async () => {
    const email = "valid@email.com";
    const password = "Valid123@&PA$word";
    // create the user
    const userLogic: UserLogic = new UserLogicImpl();
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = "first";
    newUser.lastName = "last";
    newUser.isThirdParty = false;
    newUser.role = UserRole.MEMBER;
    newUser.tokenVer = 1;
    await userLogic.createUser(newUser);

    const [res, loginHeader] = await axios
      .post(`http://localhost:${PORT}/graphql`, {
        query: `
			mutation loggingAUser {
			  login(
			    email: "${email}"
			    password: "${password}"
			  ) {
			    accessToken,
					success
			  }
			}
			`,
      })
      .then((res) => [res.data, res.headers]);
    const [refreshToken, _path, _httpOnly] =
      loginHeader["set-cookie"][0].split("; ");
    const accessToken = res.data.login.accessToken;
    const [data, headers] = await axios
      .get(
        `http://localhost:${PORT}/auth/refresh_token`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: `rid=${refreshToken}`,
          },
        }
      )
      .then((res) => [res.data, res.headers]);
    expect(data.accessToken).toBeTruthy();
    expect(verifyAccessToken(data.accessToken)).toBeTruthy();
    // checking headers
    const [rid, path, httpOnly] = headers["set-cookie"][0].split("; ");
    expect(await verifyRefreshToken(rid.split("rid=")[1])).toBeTruthy();
    expect(path.split("=")[1]).toEqual("/");
    expect(httpOnly.toUpperCase()).toEqual("HTTPONLY");
  });
});
