import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./tokens";

const refreshToken = async (req: Request, res: Response) => {
  console.log("inside refresh token");
  const token = req.cookies[process.env.TOKEN_NAME!];
  if (!token) {
    console.log("no token");
    return res.send({ ok: false, accessToken: "" });
  }

  let payload: any = null;
  try {
    console.log("Payload processing");
    payload = verify(token, process.env.JWT_RT_SECRET!);
  } catch (err) {
    console.log("error");
    console.log(err);
    return res.send({ ok: false, accessToken: "" });
  }

  console.log("checking user");
  const user = await User.findOne({ where: { id: payload.userId } });
  if (!user) {
    console.log("no user");
    return res.send({ ok: false, accessToken: "" });
  }

  console.log("checking token version");
  if (user.tokenVersion !== payload.tokenVersion) {
    console.log("version did not match");
    return res.send({ ok: false, accessToken: "" });
  }

  console.log("sending refresh token");
  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
};

export default refreshToken;
