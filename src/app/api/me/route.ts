import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  // Call backend to verify token and return user info
  const res = await fetch("http://localhost:8080/auth/user", {
    credentials: "include",
  });

  console.log("body");
  console.log(res.body);

  console.log("response");
  console.log(res);

  if (!res.ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await res.json();
  return Response.json(user);
}
