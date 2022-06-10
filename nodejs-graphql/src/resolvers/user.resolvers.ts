import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { getConnection } from "typeorm";

import { User } from "../entity/User";
import { Context } from "../context";
import { createAccessToken, createRefreshToken } from "../utils/auth";
import { isAuth } from "../middlewares/auth.middleware";
import { sendRefreshToken } from "../utils/tokens";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello world";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  // protected route
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: Context) {
    return `Your userId is ${payload!.userId}`;
  }

  // Do not expose this ever as a mutation,
  // done here, only for testing purposes to show logout functionality
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await User.insert({ email, password: hashedPassword });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Credentials");
    }

    sendRefreshToken(res, createRefreshToken(user));
    return {
      accessToken: createAccessToken(user),
    };
  }
}
