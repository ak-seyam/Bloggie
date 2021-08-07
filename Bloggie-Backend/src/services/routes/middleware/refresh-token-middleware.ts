import { tokenGeneration } from "@services/resolvers/user-resolver";
import {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@services/utils/JWT-providers";
import { ExpressMiddleware } from "./express-middleware";

export const RefreshTokenMiddleware: ExpressMiddleware = async (
  req,
  res,
  next
) => {
  // get the refresh token from req cookies
  const refreshToken = req.cookies["rid"];
  // get the access token and verify it too
  // to stop requests that will call /refresh_token to get an access token even
  // it doesn't have a one
  const sentAccessToken = req.headers.authorization?.split(" ")[1];
  if (!sentAccessToken) {
    res.status(401).send({
      success: false,
      message: "Invalid access token",
    });
    return;
  }
  const payloadAccess = await verifyAccessToken(sentAccessToken, true);
  if (!payloadAccess) {
    res.status(401).send({
      success: false,
      message: "Invalid access token",
    });
    return;
  }
  // verify that token
  const payload: any = await verifyRefreshToken(refreshToken);
  if (!payload)
    res.status(401).send({
      success: false,
      message: "Invalid refresh token",
    });
  // get user
  // if true call next with the accessToken added to request
  const accessTokenRes = tokenGeneration(
    payload.iss,
    payload.role,
    payload.tokenVer,
    res
  );
  res.locals = { accessTokenRes, payload };

  next();
};
