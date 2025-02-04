import { hashPassword } from "../utils/hash";
import { db } from "./dbConfig";

export async function cleanDb() {
  try {
    await db.user.deleteMany();
  } catch (error) {
    console.log(error);
  }
}

export async function seedDb() {
  const userList = [
    {
      email: "arthur@gmail.com",
      firstName: "Arthur",
      lastName: "Morgan",
      password: "$2b$05$ooeVibPRBSiXMG0LmQ/Pq.j63tE0O72ec3fB2.oPfZWgIekjI1PNC",
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
