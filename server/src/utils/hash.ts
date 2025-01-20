import bcrypt from "bcrypt";

export async function hashPassword(plainText: string) {
  return await bcrypt.hash(plainText, 5);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
