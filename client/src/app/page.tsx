import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {session ? <div>Hello {session?.user?.id}</div> : <div>Unauthorized</div>}
    </>
  );
}
