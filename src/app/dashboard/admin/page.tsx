export default function DashboardPage() {
  // No auth checks needed - middleware guarantees user is authenticated
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome! You're authenticated (guaranteed by middleware)</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Dashboard Content</h2>
        <p>This page is protected by middleware</p>
      </div>
    </div>
  );
}
