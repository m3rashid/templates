import { config } from "dotenv";
config();

import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";

import deserializeUser from "./middlewares/deserializeUser";

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(deserializeUser);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.all("*", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This page does not exist",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  logger.info("Server started on port " + port);
});
