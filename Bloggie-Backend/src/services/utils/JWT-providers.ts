import { UserRole } from "@models/user/user";
import { sign, verify } from "jsonwebtoken";

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

function verifyToken(token: string, secret: string) {
  return verify(token, secret, { ignoreExpiration: false });
}

export function verifyRefreshToken(token: string) {
  return verifyToken(token, process.env["REFRESH_TOKEN_SECRET"]!);
}

export function verifyAccessToken(token: string) {
  return verifyToken(token, process.env["ACCESS_TOKEN_SECRET"]!);
}
