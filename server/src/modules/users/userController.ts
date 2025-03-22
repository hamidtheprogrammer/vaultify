import { comparePassword, hashPassword } from "../../utils/hash";
import logger from "../../utils/logger";
import { userExists, createUser, updateUser } from "./userService";
import { Request, Response } from "express";

const adaptDb: any = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const doesUserExist = await userExists(email);

    if (doesUserExist) {
      res.status(200).json(doesUserExist);
      logger.info(`User ${doesUserExist.id} logged in successfully`);
    } else {
      const newUser = await createUser({ email });
      res.status(201).json(newUser);
      logger.info(`User ${newUser.id} created an account successfully`);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error(`Internal server error`);
  }
};

const register: any = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const doesUserExists = await userExists(email);

    if (doesUserExists) {
      res.status(400).json({ message: "Invalid credentials" });
      logger.warn(`Failed registration from ${req.ip}`);
      return;
    }

    const user: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    } = {
      email,
      password,
    };

    user.password = await hashPassword(password);

    if (firstName) user.firstName = firstName as string;
    if (lastName) user.lastName = lastName as string;

    const newUser = await createUser(user);

    res.status(201).json(newUser);
    logger.info(`User ${newUser.id} created an account successfully`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error(`Internal server error`);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await userExists(email);

    if (
      !doesUserExists ||
      !(await comparePassword(password, doesUserExists.password as string))
    ) {
      res.status(404).json({ message: "Invalid credentials" });
      logger.warn(`Failed login from ${req.ip}`);
      return;
    }

    res.status(200).json(doesUserExists);
    logger.info(`User ${doesUserExists.id} created an account successfully`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error(`Internal server error`);
  }
};

const updateProfile: any = async (req: Request, res: Response) => {
  const newUserData = req.body;
  const params = req.params;

  if (newUserData.password)
    newUserData.password = await hashPassword(newUserData.password);

  try {
    const doesUserExists = await userExists("", params.id as string);

    if (!params.id || !doesUserExists) {
      res.status(404).json({ message: "User not found" });
      logger.warn(`Failed account modification attempt from ${req.ip}`);
      return;
    }
    res.status(200).json(await updateUser(newUserData, params.id as string));
    logger.info(`User ${doesUserExists.id} updated their account successfully`);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
    logger.error(`Internal server error`);
  }
};

export { adaptDb, login, register, updateProfile };
