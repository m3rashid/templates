import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../context";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not authenticated");
  }
  try {
    const token = authorization?.split(" ")[1];
    const payload = verify(token, process.env.JWT_AT_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};
