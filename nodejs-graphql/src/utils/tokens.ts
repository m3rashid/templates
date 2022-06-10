import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie(process.env.TOKEN_NAME!, token, {
    httpOnly: true,
  });
};
