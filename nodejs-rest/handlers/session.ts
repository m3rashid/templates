import { Request, Response } from "express";
import { createSession, invalidateSession } from "../utils/sessions";
import { SecureRequest } from "../middlewares/deserializeUser";
import { issueJWT } from "../utils/jwt";

export function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  // get the from the database, now just hte dummy data
  const user = {
    name: "Hello",
    email: "hello@user.com",
    password: "12345",
  };

  if (!user || user.password !== password) {
    return res.status(401).send("Invalid Credentials");
  }

  const session = createSession(email, user.name);
  const accessToken = issueJWT(
    {
      email: user.email,
      name: user.name,
      sessionId: session.sessionId,
    },
    "5s"
  );

  const refreshToken = issueJWT({ sessionId: session.sessionId }, "1y");

  res.cookie("accessToken", accessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
  });

  return res.send(session);
}

export function getSessionHandler(req: SecureRequest, res: Response) {
  return res.send(req.user);
}

export function deleteSessionHandler(req: SecureRequest, res: Response) {
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });
  // @ts-ignore
  const session = invalidateSession(req.user.sessionId);
  return res.send(session);
}
