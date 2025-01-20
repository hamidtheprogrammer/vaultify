import { describe, expect, test, it } from "@jest/globals";
import * as userService from "../userService";
import { User } from "@prisma/client";
import { adaptDb, login, updateProfile } from "../userController";
import { register } from "../userController";
import { db } from "../../../db/dbConfig";
import * as hashFunctions from "../../../utils/hash";
import { hashPassword } from "../../../utils/hash";

beforeAll(async () => {
  const count = await db.user.count();
  if (count > 3) {
    return;
  } else {
    const userList = [
      {
        email: "arthur@gmail.com",
        FirstName: "Arthur",
        LastName: "Morgan",
        password: "12345",
      },
    ];

    userList.forEach(async (user) => {
      user.password = await hashPassword(user.password);
    });
    try {
      await db.user.createMany({ data: userList });
    } catch (error) {
      console.log(error);
    }
  }
});

const payload = {
  id: "1",
  email: "arthur@gmail.com",
  FirstName: "Arthur",
  LastName: "Morgan",
  password: "12345",
};

describe("User Exists", () => {
  it("should return a user if they exist", () => {});
});

describe("database adaptation controller", () => {
  it("it should return a user if email exist", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(payload);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await adaptDb(req, res);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(payload);
  });

  it("it should create a user if they dont already exist", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(null);
    jest.spyOn(userService, "createUser").mockResolvedValueOnce(payload);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await adaptDb(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(payload);
  });
});

describe("Register controller", () => {
  it("Should return error message if email already exists", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(payload);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req as any, res as any);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: "Invalid credentials" });
  });

  it("Should register user if email dont exist", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(null);
    jest.spyOn(userService, "createUser").mockResolvedValueOnce(payload);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req as any, res as any);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(payload);
  });
});

describe("Login controller", () => {
  it("Should return error if email does not exist or incorrect password", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(null);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req as any, res as any);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({ message: "Invalid credentials" });
  });

  it("Should successfully login on correct credentials", async () => {
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(payload);
    jest.spyOn(hashFunctions, "comparePassword").mockResolvedValueOnce(true);

    const req = { body: payload };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req as any, res as any);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(payload);
  });
});

describe("Update profile controller", () => {
  it("Should update the user", async () => {
    jest.spyOn(userService, "updateUser").mockResolvedValueOnce(payload);

    const req = { body: payload, query: { id: "12345" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateProfile(req as any, res as any);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith(payload);
  });
});
