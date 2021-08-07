import { Request, Response } from "express";
export default interface ExpressContext {
  req: Request;
  res: Response;
}
