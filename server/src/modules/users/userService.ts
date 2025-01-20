import { db } from "../../db/dbConfig";

const userExists = async (email: string) => {
  const user = await db.user.findFirst({ where: { email } });
  if (user) {
    return user;
  } else {
    return null;
  }
};

const createUser = async (credentials: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}) => {
  return await db.user.create({ data: credentials });
};

const updateUser = async (
  credentials: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  },
  id: string
) => {
  return await db.user.update({
    where: { id },
    data: credentials,
  });
};

export { userExists, createUser, updateUser };
