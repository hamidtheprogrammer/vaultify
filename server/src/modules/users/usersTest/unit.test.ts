import { describe, expect, it } from "@jest/globals";
import * as userService from "../userService";
import { adaptDb, login, updateProfile } from "../userController";
import { register } from "../userController";
import * as hashFunctions from "../../../utils/hash";

const payload = {
  id: "1",
  email: "arthur@gmail.com",
  firstName: "Arthur",
  lastName: "Morgan",
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
    jest.spyOn(userService, "userExists").mockResolvedValueOnce(payload);
    jest.spyOn(userService, "updateUser").mockResolvedValueOnce(payload);

    const req = { body: payload, params: { id: "12345" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateProfile(req as any, res as any);

    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(payload);
  });
});
