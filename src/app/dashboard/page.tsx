import { cookies } from "next/headers";
import { verifyPaseto } from "@/lib/token";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Get the token from cookies
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    // Verify the token and get user data
    const payload = await verifyPaseto(token);

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome back, {payload.sub ? (payload.sub).toString() : "User"}!</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Your Profile:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    // Token is invalid, redirect to login
    redirect("/login");
  }
}
