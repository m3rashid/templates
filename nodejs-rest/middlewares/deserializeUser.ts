import { NextFunction, Request, Response } from "express";
import { getSession } from "../utils/sessions";
import { issueJWT, verifyJWT } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export interface SecureRequest extends Request {
  user?: string | JwtPayload;
}

/**
 * Deserialize user from JWT token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Next}
 */
function deserializeUser(
  req: SecureRequest,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);
  if (payload) {
    req.user = payload;
    return next();
  }

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };
  if (!refresh) {
    return next();
  }

  // @ts-ignore
  const session = getSession(refresh.sessionId);
  if (!session) {
    return next();
  }

  const newAccessToken = issueJWT(session, "5s");
  res.cookie("accessToken", newAccessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  });

  // @ts-ignore
  req.user = verifyJWT(newAccessToken).payload;
  return next();
}

export default deserializeUser;
