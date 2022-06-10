import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";

import { UserResolver } from "./resolvers/user.resolvers";
import refreshToken from "./utils/refreshToken";

(async () => {
  const app = express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  app.use(cookieParser());
  app.get("/", (_, res) => res.send("Hello world"));
  app.post("/refresh-token", refreshToken);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await createConnection();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log("Server at http://localhost:" + port));
})();
