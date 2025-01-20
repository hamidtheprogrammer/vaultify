import { comparePassword, hashPassword } from "../../utils/hash";
import { userExists, createUser, updateUser } from "./userService";
import { Request, Response } from "express";

const adaptDb: any = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const doesUserExist = await userExists(email);

    if (doesUserExist) {
      res.status(200).json(doesUserExist);
    } else {
      const newUser = await createUser(email);
      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const doesUserExists = await userExists(email);

    if (doesUserExists) {
      return res.status(400).json({ message: "Invalid credentials" });
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

    if (firstName) user.firstName = firstName as string;
    if (lastName) user.lastName = lastName as string;

    const newUser = await createUser(user);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login: any = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await userExists(email);

    if (
      !doesUserExists ||
      !(await comparePassword(password, doesUserExists.password as string))
    ) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    res.status(200).json(doesUserExists);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  const newUserData = req.body;
  const { id } = req.query;

  if (newUserData.password)
    newUserData.password = await hashPassword(newUserData.password);

  try {
    res.status(201).json(await updateUser(newUserData, id as string));
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { adaptDb, login, register, updateProfile };
