import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS!);

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (password: string, hash: string) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

export { hashPassword, comparePassword };
