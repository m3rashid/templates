import JWT from "jsonwebtoken";
import { join } from "path";
import { readFileSync } from "fs";

const privateKey = readFileSync(
  join(__dirname, "../utils/keys/private.pem"),
  "utf8"
);
const publicKey = readFileSync(
  join(__dirname, "../utils/keys/public.pem"),
  "utf8"
);

const issueJWT = (payload: object, expiresIn: string | number) => {
  const signedToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });
  const token = `Bearer ${signedToken}`;
  return token;
};

const verifyJWT = (token: string) => {
  try {
    const extractedToken = token.split(" ")[1];
    const decoded = JWT.verify(extractedToken, publicKey, {
      algorithms: ["RS256"],
    });
    return {
      valid: true,
      expired: false,
      payload: decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message.includes("jwt expired"),
      payload: null,
    };
  }
};

export { issueJWT, verifyJWT };
