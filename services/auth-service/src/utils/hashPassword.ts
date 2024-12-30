import bcrypt from 'bcrypt';
const hashPassword = async (password: string) => {
  const hashRound = 11;
  const salt = bcrypt.genSaltSync(hashRound);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
