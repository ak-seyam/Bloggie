import UserLogic from "@services/data-interaction/user/user-logic";
import UserLogicImpl from "@services/data-interaction/user/user-logic-impl";
import { UserRole } from "@models/user/user";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Types } from "mongoose";

interface UserPayload {
  iss: string;
  role: UserRole;
  tokenVer: number;
}

interface TimeFormat {
  amount: number;
  unit: "s" | "m" | "h" | "d" | "w" | "m" | "y";
}

function signToken(secret: string, payload: UserPayload, exp: TimeFormat) {
  return sign(payload, secret, {
    expiresIn: `${exp.amount}${exp.unit}`,
  });
}

export function signRefreshToken(payload: UserPayload) {
  return signToken(process.env["REFRESH_TOKEN_SECRET"]!, payload, {
    amount: 1,
    unit: "y",
  });
}

export function signAccessToken(payload: UserPayload) {
  return signToken(process.env["ACCESS_TOKEN_SECRET"]!, payload, {
    amount: 15,
    unit: "m",
  });
}

async function verifyToken(
  token: string,
  secret: string,
  ignoreExpiration: boolean = false
) {
  const payload: any = verify(token, secret, { ignoreExpiration });
  const userLogic: UserLogic = new UserLogicImpl();
  const user = await userLogic.getUserById(Types.ObjectId(payload.iss));
  if (!payload || payload.tokenVer !== user.tokenVer) {
    return null;
  }
  return payload;
}

export function verifyRefreshToken(token: string) {
  return verifyToken(token, process.env["REFRESH_TOKEN_SECRET"]!);
}

export function verifyAccessToken(
  token: string,
  ignoreExpiration: boolean = false
) {
  return verifyToken(
    token,
    process.env["ACCESS_TOKEN_SECRET"]!,
    ignoreExpiration
  );
}
