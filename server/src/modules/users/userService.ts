import { db } from "../../db/dbConfig";

const userExists = async (email: string, id?: string) => {
  try {
    const user = await db.user.findFirst({
      where: { OR: [{ email }, { id }] },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const createUser = async (credentials: {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}) => {
  try {
    return await db.user.create({ data: credentials });
  } catch (error) {
    throw error;
  }
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
  try {
    return await db.user.update({
      where: { id },
      data: credentials,
    });
  } catch (error) {
    throw error;
  }
};

export { userExists, createUser, updateUser };
