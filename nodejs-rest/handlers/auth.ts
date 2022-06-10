import { PrismaClient } from "@prisma/client";
import express from "express";
import passport from "passport";
const router = express.Router();

import logger from "../utils/logger";
import { comparePassword } from "../utils/auth";

const prisma = new PrismaClient();

router.get("/test", (_, res) => {
  logger.info("Welcome to the auth service");
  res.status(200).send({
    message: "Welcome to the auth service",
  });
});

router.post(
  "/login-local",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => {
    const { email, password } = req.body;
    logger.info(`User ${email} is trying to login`);
    try {
      const user = await prisma["auth"].findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        throw new Error("Incorrect Credentials");
      }
      return res.status(200).json({});
    } catch (err: any) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post("/signup-one-local", async (req, res) => {
  const { email } = req.body;
  logger.info(`User ${email} is trying to signup`);
  try {
    if (!email) {
      throw new Error("Missing email or username");
    }
    const user = await prisma["auth"].findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new Error("User already exists");
    }
    // send mail to user containing a unique code
    return res.status(200).json({
      message: "OTP Sent",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/signup-two-local", async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;
  try {
    if (!email || !password || !confirmPassword || !role) {
      throw new Error("Missing fields");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const user = await prisma["auth"].create({
      data: {
        email: email,
        password: password,
        role: role,
      },
    });
    return res.status(200).json({
      message: "User created",
      user,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await prisma["auth"].findUnique({
      where: {
        id: userId,
      },
    });
    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/logout", async (req, res) => {});

export default router;
