import axios from "axios";

export async function login(url: string, email: string, password: string) {
  const loginRes = await axios
    .post(url, {
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
  return loginRes.data.login.accessToken;
}
