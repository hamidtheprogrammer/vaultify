import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { customError } from "@/app/apiCalls/authAPI";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: { signIn: "sign-in" },
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.CLIENT_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const body = await response.json();

        if (!response.ok) {
          const error = new customError(body.message, response.status, body);
          throw error;
        }

        return body;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider

      const data = await adapt(session.user.email);

      session.user.id = data.id;

      return session;
    },
  },
});

async function adapt(email: string) {
  const data = { email };
  const response = await fetch(`${process.env.CLIENT_URL}/api/adapt-db`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  if (!response.ok) {
    return null;
  }

  return body;
}
