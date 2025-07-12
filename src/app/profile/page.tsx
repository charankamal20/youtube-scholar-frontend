import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>You are not authenticated. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user.name ? (
        <p>Welcome back, {user.name.toString()}!</p>
      ) : (
        <p>Welcome back, User!</p>
      )}
    </div>
  );
}
