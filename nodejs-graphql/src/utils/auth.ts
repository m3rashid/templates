import { sign } from "jsonwebtoken";
import { User } from "../entity/User";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.JWT_AT_SECRET!, {
    expiresIn: "1m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_RT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};
