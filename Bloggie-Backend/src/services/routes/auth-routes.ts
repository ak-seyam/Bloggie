import { signRefreshToken } from "@services/utils/JWT-providers";
import { Router } from "express";
import { RefreshTokenMiddleware } from "./middleware/refresh-token-middleware";

const router = Router();

router.post("/refresh_token", RefreshTokenMiddleware, (req, res) => {
  res.send(res.locals.accessTokenRes);
});

export default router;
