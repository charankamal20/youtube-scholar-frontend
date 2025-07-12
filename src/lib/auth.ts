import { cookies } from "next/headers";
import { verifyPaseto } from "@/lib/token";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyPaseto(token);
    return payload;
  } catch (error) {
    console.error("Unexpected token verification failure:", error);
    return null;
  }
}

import { headers } from "next/headers";

export async function getCurrentUseFromHeaders() {
  const headersList = headers();

  return {
    sub: (await headersList).get("x-user-id") || "",
    email: (await headersList).get("x-user-email") || "",
    role: (await headersList).get("x-user-role") || "",
  };
}
