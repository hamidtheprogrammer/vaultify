import supertest from "supertest";
import { describe, expect, it } from "@jest/globals";
import { cleanDb, seedDb } from "../../../db/seed";
import { app } from "../../..";
import { db } from "../../../db/dbConfig";
import { User } from "@prisma/client";

beforeAll(async () => {
  await cleanDb();
  await seedDb();
}, 10000);

const payload = {
  id: "1",
  email: "arthur@gmail.com",
  firstName: "Arthur",
  lastName: "Morgan",
  password: "666666666",
};

describe("POST /api/adapt-db", () => {
  it("Should create new user in db if they dont already exist", async () => {
    const payload = { email: "dutch@gmail.com" };
    const response = await supertest(app).post("/api/adapt-db").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
  });

  it("Should return user from db if they exist", async () => {
    const response = await supertest(app).post("/api/adapt-db").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("POST /api/register", () => {
  it("Should register new user", async () => {
    const payload = {
      email: "john@gmail.com",
      firstName: "John",
      lastName: "Marston",
      password: "12345678",
    };
    const response = await supertest(app).post("/api/register").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
  });

  it("Should return error if user already exists", async () => {
    const response = await supertest(app).post("/api/register").send(payload);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid credentials" });
  });
});

describe("POST /api/login", () => {
  it("Should login new user", async () => {
    const response = await supertest(app).post("/api/login").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("Should return error if credentials are invalid", async () => {
    const response = await supertest(app)
      .post("/api/login")
      .send({ ...payload, password: "12345678" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Invalid credentials" });
  });
});

describe("POST /api/update-profile", () => {
  const payload = {
    email: "arthur4@gmail.com",
  };
  let user: any;
  beforeAll(async () => {
    user = await db.user.findFirst();
  });

  it("Should update the user", async () => {
    const response = await supertest(app)
      .post(`/api/update-profile/${user.id}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
