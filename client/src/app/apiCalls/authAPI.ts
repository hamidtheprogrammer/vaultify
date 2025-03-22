import { IUser } from "../(pages)/(auth)/register/page";

export class customError extends Error {
  status;
  response;

  constructor(
    message: string = "Unfortunately, an error occured",
    status: number,
    response: any
  ) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

const registerAPI = async (data: IUser) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    const error = new customError(body.message, response.status, body);
    throw error;
  }

  return body;
};

export { registerAPI };
